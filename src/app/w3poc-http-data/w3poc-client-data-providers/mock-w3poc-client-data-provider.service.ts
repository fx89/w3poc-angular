import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataLayerRequest } from '../model/DataLayerRequest';
import { DataLayerResponse } from '../model/DataLayerResponse';
import { W3POCHttpClientDataProvider } from '../w3poc-http-client-data-provider';

@Injectable({
  providedIn: 'root'
})
export class MockW3pocClientDataProviderService extends W3POCHttpClientDataProvider {

    private tableData : [] = []

    constructor() {
        super()
        this.loadTableData()
    }

    public requestData(request: DataLayerRequest, errorEventEmitter: EventEmitter<any>): Observable<DataLayerResponse> {
        throw new Error('Method not implemented.');
    }

    private loadTableData() : void {

    }
}
