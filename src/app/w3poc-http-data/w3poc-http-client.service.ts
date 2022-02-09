import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginService } from '../w3poc-core/login-service.service';
import { DataLayerResponse, RESPONSE_TYPE_ERROR } from './model/DataLayerResponse';
import { FilterSpecification } from './model/FilterSpecification';
import { WindowSpecification } from './model/WindowSpecification';
import { DataLayerRequest } from './model/DataLayerRequest';
import { W3POCHttpClientDataProvider } from './w3poc-http-client-data-provider';

@Injectable({
  providedIn: 'root'
})
export class W3POCHttpClientService {

    /**
     * Users of this class subscribe to this event emitter to handle errors
     */
    public errorEventEmitter : EventEmitter<any> = new EventEmitter<any>();

    /**
     * This local event emitter is given to the HTTP Clent Wrapper and helps
     * with the standardization of error objects before they are sent to the
     * external consumers
     */
    private localErrorEventEmitter : EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private loginService : LoginService,
        private clientDataProvider : W3POCHttpClientDataProvider
    ) {
        this.subscribeToLocalErrorEventEmitter()
    }

    public requestData(
        tableName : string,
        filters : FilterSpecification[] | undefined,
        paging : WindowSpecification | undefined
    ) : Observable<DataLayerResponse>
    {
        // If the user is not yet logged in, redirect to the login form
        // and emit an error event, in case further handling is required,
        // and terminate execution by returning the observed error
        if (this.loginService.isNotLoggedIn())
        {
            const ret:any = new DataLayerResponse(RESPONSE_TYPE_ERROR, "Not logged in")
            this.errorEventEmitter.emit(ret)

            this.loginService.redirectToLoginForm()
            return new Observable(ret)
        }

        // If the user is logged in, proceed to making the request, then:

        // The first step is to compile the request in the format required by the back-end
        let request : DataLayerRequest = new DataLayerRequest(tableName, filters, paging)

        // A response event emitter is required to be returned
        let responseEventEmitter : EventEmitter<DataLayerResponse> = new EventEmitter<DataLayerResponse>()

        // The second step is to send the request through the injected clientDataProvider
        this.clientDataProvider.requestData(request, this.localErrorEventEmitter)
            // The data layer response needs to be checked for error codes. If there is
            // an error code in the data layer response, then the errorEventEmitter must
            // emit the response. Otherwise, the responseEventEmitter must send the data
            // to the caller for further processing.
            .subscribe(ret => {
                if (ret.responseType == 'error') {
                    this.errorEventEmitter.emit(ret)
                } else {
                    responseEventEmitter.emit(ret)
                }
            })

        // Finally, the caller must subscribe to the responseEventEmitter to get the data
        return responseEventEmitter
    }

    /**
     * This is where we standardize errors coming from the HTTP Client Wrapper
     */
    private subscribeToLocalErrorEventEmitter() {
        this.localErrorEventEmitter.subscribe(err => {
            let errType : string = typeof err

            if (errType == "string") {
                err = new DataLayerResponse('error', err)
            }

            this.errorEventEmitter.emit(err)
        })
    }
  }
