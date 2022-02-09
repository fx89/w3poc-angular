import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DataLayerRequest } from '../model/DataLayerRequest';
import { DataLayerResponse } from '../model/DataLayerResponse';
import { FilterSpecification } from '../model/FilterSpecification';
import { W3POCHttpClientDataProvider } from '../w3poc-http-client-data-provider';

const MOCK_DATA_PATH : string = "assets/mock-data/"

/**
 * Loads data from CSV files, resulted from exports from various databases.
 * Used for development and unit testing. Saves money by providing an alternative
 * to using RDS during the development stage.
 */
@Injectable({
  providedIn: 'root'
})
export class MockW3pocClientDataProviderService extends W3POCHttpClientDataProvider {

    private verbosity : boolean = true

    constructor(
        private http : HttpClient
    ) {
        super()
    }

    public setVerbosity(verbosity:boolean) {
        this.verbosity = verbosity
    }

    public requestData(request: DataLayerRequest, errorEventEmitter: EventEmitter<any>): Observable<DataLayerResponse> {
        // Prepare the response observable
        const ret : EventEmitter<DataLayerResponse> = new EventEmitter<DataLayerResponse>()

        // Get the records from the CSV file
        this.loadTableFile(request.tableName).subscribe(tableRows => {
            // If there was any issue loading the CSV file, throw an exception
            if (tableRows == null) {
                this.emitError(ret, errorEventEmitter, "Could not load data for table [" + request.tableName + "]")
            }
            // If the data was loaded, run the search
            else {
                this.searchTableDataAndBuildResponse(request, errorEventEmitter, ret, tableRows)
            }
        })

        // Return the response observable
        return ret
    }

    private loadTableFile(tableName:string) : EventEmitter<string[]> {
        // Prepare the response observable
        const ret : EventEmitter<string[]> = new EventEmitter<string[]>()

        // Use the HttpClient to get data from the file related to the referenced table
        this.http.get(MOCK_DATA_PATH + tableName + ".csv", { responseType: 'text'})
          .subscribe(
                // If the request has responded successfully, split the response
                // into rows and emit the result
                (data:any) => {
                    ret.emit(data.replace('\r\n', '\n').split('\n'))
                },
                // If there was an error, then emit null, which is handled in a
                // special manner by the caller
                (err:any) => {
                    ret.emit(null)
                }
            )

        // Return the response observable
        return ret
    }

    private searchTableDataAndBuildResponse(
        request: DataLayerRequest,
        errorEventEmitter: EventEmitter<any>,
        responseEventEmitter : EventEmitter<DataLayerResponse>,
        tableData : string[]
    ){
        // If the CSV file is empty or contains only the header row,
        // respond with an empty array and exit
        if (tableData.length < 2) {
            this.emitOk(responseEventEmitter, [])
            return
        }

        // Get the table columns from the first row of the CSV file
        const colNames : string[] = this.getRecValues(tableData[0], true)

        // Check the filters. If they are not ok, respond with an error and exit.
        const filtersRelatedError = this.checkFilterSpecification(request, colNames)
        if (filtersRelatedError != null) {
            this.emitError(responseEventEmitter, errorEventEmitter, filtersRelatedError)
            return
        }

        // Check the window specification. If it's not ok, respond with an error and exit
        const windowRelatedError = this.checkWindowSpecification(request)
        if (windowRelatedError != null) {
            //this.emitError(responseEventEmitter, errorEventEmitter, filtersRelatedError)
            //return
        }

        // Initialize counters for the result set index and size. This is needed,
        // in case the window specification was provided, to know where to start
        // building the result set and when to stop looking for new data.
        let resultRecIndex : number = 0
        let resultSetSize : number = 0

        // Initialize the result set
        const resultSet : any[] = []

        // Search for the requested data
        for(let recIndex = 1 ; recIndex < tableData.length ; recIndex++) {
            // If the record is valid (not the last record or something)
            if (tableData[recIndex].length > 1) {
              // Split the record into values
              const recValues : string[] = this.getRecValues(tableData[recIndex], false)

              // If the record matches the filters
              if (this.recMatchesFilters(request.filters, recValues, colNames)) {
                  // If there is no paging defined in the request, or if the result
                  // set counter is within the requested window...
                  if (!request.paging || request.paging.windowStart <= resultRecIndex) {
                      // Create a new record and add it to the result set
                      resultSet.push(this.createResultSetRecord(recValues, colNames))
                      resultSetSize++
                  }

                  // Increment the result set index
                  resultRecIndex++

                  // If there is a window size defined and the result set
                  // size has reached the upper limit of the defined window,
                  // then break the loop
                  if (request.paging && request.paging.windowSize <= resultSetSize) {
                      break
                  }
              }
            }
        }

        // Finally, emit the response
        this.emitOk(responseEventEmitter, resultSet)
    }

    private getRecValues(colsRow:string, toLower:boolean) : string[] {
        const colNames : string[] = []

        for (let colName of colsRow.split('","')) {
            let colValue = colName.trim().replace('"',"")
            if (toLower) {
                colValue = colValue.toLocaleLowerCase()
            }
            colNames.push(colValue)
        }

        return colNames
    }

    private checkFilterSpecification(request:DataLayerRequest, colNames:string[]) : string {
        if (request.filters) {
            for (let filterDef of request.filters) {
                const colName:string = (<FilterSpecification>filterDef).columnName

                if (colNames.indexOf(colName) < 0) {
                    return "Column [" + colName + "], referenced in the request filters, does not exist in table [" + request.tableName + "]"
                }
            }
        }

        return null
    }

    private checkWindowSpecification(request:DataLayerRequest) : string {
        if (request.paging) {
            if (!request.paging.windowSize || !request.paging.windowStart) {
                return "Window specification is missing the windowSize or the windowStart property"
            }

            if (isNaN(request.paging.windowStart) || isNaN(request.paging.windowSize)) {
                return "Window specification is wrong. The windowStart or the windowSize is not a number."
            }
        }

        return null
    }

    private recMatchesFilters(
        filters:FilterSpecification[],
        recValues:string[],
        colNames:string[]
    ) : boolean
    {
        // If there are no filters defined, all records pass the filter check
        if (!filters) { return true }

        // Check each filter. If any one of the filters fails to pass, it means
        // the record has failed the filters test.
        for (let filter of filters) {
            // Make the casts and get the working values
            const filterSpec:FilterSpecification = <FilterSpecification>filter
            const filterColValue : string = <string>(filter.columnValue)
            const colIndex : number = colNames.indexOf(filterSpec.columnName)
            let recColValue : string = recValues[colIndex]; if (recColValue == undefined) recColValue = ""

            // If the filter specification requests matching,
            // then a case-insensitive regex comparison has to be done
            if (filterColValue.indexOf('%') >= 0) {
                if (!recColValue.toUpperCase().match(this.replaceAll(filterColValue.toUpperCase(), '%', '(.*)'))) {
                    return false
                }
            }
            // If the filter specification does not request matching,
            // then regular case-insensitive string comparison is done
            else {
                if (recColValue.toUpperCase() != filterColValue.toUpperCase()) {
                    return false
                }
            }
        }

        // If all checks pass, it means the record has passed the filter
        return true
    }

    private escapeRegExp(str:string) : string {
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }

    private replaceAll(str:string, find:string, replace:string) : string {
      return str.replace(new RegExp(this.escapeRegExp(find), 'g'), replace);
    }

    private createResultSetRecord(recValues:string[], colNames:string[]) : any {
        const ret : any = {}

        let colIndex : number = 0
        for (let colName of colNames) {
            ret[colName] = recValues[colIndex]
            colIndex++
        }

        return ret
    }

    private emitError(
        responseEventEmitter:EventEmitter<DataLayerResponse>,
        errorEventEmitter:EventEmitter<DataLayerResponse>,
        err:any
    ) {
        console.error('======================================================')
        console.error('An error has occurred in the mock data service:')
        console.error(err)
        console.error('======================================================')

        const resp : any = new DataLayerResponse("error", err)
        responseEventEmitter.emit(resp)
        errorEventEmitter.emit(resp)
    }

    private emitOk(responseEventEmitter:EventEmitter<DataLayerResponse>, data:any) {
        if (this.verbosity) {
            console.log('======================================================')
            console.log('Response from the mock data service:')
            console.log(data)
            console.log('======================================================')
        }
        responseEventEmitter.emit(new DataLayerResponse("ok", data))
    }
}
