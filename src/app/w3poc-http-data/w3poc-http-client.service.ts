import { EventEmitter, Injectable } from '@angular/core';
import { HttpClientWrapperService, RequestType } from './http-client-wrapper.service';
import { Observable } from 'rxjs';
import { ConfigService } from '../w3poc-core/config-service.service';
import { LoginService } from '../w3poc-core/login-service.service';
import { DataLayerResponse, RESPONSE_TYPE_ERROR } from './model/DataLayerResponse';
import { FilterSpecification } from './model/FilterSpecification';
import { WindowSpecification } from './model/WindowSpecification';
import { DataLayerRequest } from './model/DataLayerRequest';

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

    /**
     * This is the URL to which requests will be sent
     */
    private backendUrl : string = ""

    /**
     * The authorization header will contain the id_token requied by AWS
     */
    private authorizationHeader : Map<string, string | null> | undefined;
  
    constructor(
        private client : HttpClientWrapperService,
        private config : ConfigService,
        private loginService : LoginService
    ) {
        this.backendUrl = this.config.getAttributeValue("backendUrl")
        this.subscribeToLocalErrorEventEmitter()
    }

    /**
     * Applies the id_token to the authorization header and caches the authorization
     * header in memory, to avoid executing this operation with every request
     */
    private resolveAuthorizationHeader() : Map<string, string | null> | undefined {
        if (this.authorizationHeader == undefined) {
            this.authorizationHeader = new Map([["Authorization", this.loginService.getIdToken()]])
        }

        return this.authorizationHeader
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

        // Then send the request to the backend URL, along with the authorization header
        this.client.requestWithErrorHandling(
                      RequestType.POST,                   // The request type is always POST
                      this.backendUrl,                    // The URL to the generic lambda that gets data from any table
                      { "request": request },             // The DataLayerRequest object is put in the body of the POST request
                      this.localErrorEventEmitter,        // The local error event emitter will emit errors to the local subscriber to be processed and then sent to external consumers via the public errorEventEmitter
                      undefined,                          // There are no URL params
                      this.resolveAuthorizationHeader()   // The authorization header is needed for accessing the backend
                  )
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