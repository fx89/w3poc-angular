import { Observable } from "rxjs";
import { LoadingModalService } from "src/app/w3poc-core/loading-modal.service";
import { EventEmitter } from "@angular/core";
import { DataLayerResponse } from "../model/DataLayerResponse";
import { FilterSpecification } from "../model/FilterSpecification";
import { WindowSpecification } from "../model/WindowSpecification";
import { W3POCHttpClientService } from "../w3poc-http-client.service";
import { LoginService } from "src/app/w3poc-core/login-service.service";
import { ERR_MSG_CONNECTION_REFUSED } from "../http-client-wrapper.service";

export class EntityRepository {

    constructor(
        private client : W3POCHttpClientService,
        private loadingModal : LoadingModalService,
        private loginService : LoginService,
        private tableName : string
    ) {
        this.subscribeToErrorEvent()
    }



    // HELPER METHODS FOR THE INHERITING REPOSITORY CLASSES ///////////

    /**
     * Wraps the requestData() method in the super class, giving it the
     * name of the table for which this repository is responsible. Also
     * envelops the request in the loading modal service flow, to auto-
     * matically show the loading modal if the response time goes over
     * the acceptable limit.
     */
    protected requestDataCustomRequest(
        filters : FilterSpecification[] | undefined,
        paging : WindowSpecification | undefined
    ) : Observable<DataLayerResponse>
    {
        // Prepare the response emitter
        const ret : EventEmitter<DataLayerResponse> = new EventEmitter<DataLayerResponse>()

        // Envelop the operation in the loading modal service flow
        this.loadingModal.envelopOperation(
            // The operation
            () => this.client.requestData(this.tableName, filters, paging),

            // The operation result handler
            (result:DataLayerResponse) => {
                ret.emit(result)
            }
        )

        // Return the response emitter
        return ret;
    }

    /**
     * If the connection is refused, redirect to the login form using
     * the login service.
     */
    private subscribeToErrorEvent() {
        this.client.errorEventEmitter.subscribe(err => {
            if (err.response == ERR_MSG_CONNECTION_REFUSED) {
                this.loginService.redirectToLoginForm()
            }
        })
    }

    /**
     * Fetches the data from the table managed by this repository while
     * applying the given filters
     */
     protected requestDataWithFilters(filters : FilterSpecification[]) {
        return this.requestDataCustomRequest(filters, undefined);
    }

    /**
     * Fetches the data while applying a filter on the referenced column
     */
     protected requestDataWithFilter(columnName:string, columnValue:any) {
        return this.requestDataCustomRequest([new FilterSpecification(columnName, columnValue)], undefined);
    }

    /**
     * Fetches the data using the provided window specification
     */
    protected requestDataWithPaging(windowStart:number, windowSize:number) : Observable<DataLayerResponse> {
        return this.client.requestData(this.tableName, undefined, new WindowSpecification(windowStart, windowSize))
    }

    protected requestDataWithFiltersAndPaging(
        filters : FilterSpecification[],
        windowStart : number,
        windowSize : number
    ) {
        return this.requestDataCustomRequest(filters, new WindowSpecification(windowStart, windowSize));
    }

    protected requestDataWithFilterAndPaging(
        columnName : string,
        columnValue : any,
        windowStart : number,
        windowSize : number
    ) {
        return this.requestDataCustomRequest(
                    [new FilterSpecification(columnName, columnValue)],
                    new WindowSpecification(windowStart, windowSize)
                );
    }



    // METHODS WHICH MUST BE PRESENT IN ALL REPOSITORIES //////////////

    /**
     * Fetches all the data from the table managed by this repository
     */
    public pageAll(windowStart:number, windowSize:number) : Observable<DataLayerResponse> {
        return this.requestDataWithPaging(windowStart, windowSize)
    }
}