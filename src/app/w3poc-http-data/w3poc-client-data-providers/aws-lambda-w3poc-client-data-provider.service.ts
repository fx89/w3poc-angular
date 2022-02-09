import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/w3poc-core/config-service.service';
import { LoginService } from 'src/app/w3poc-core/login-service.service';
import { HttpClientWrapperService, RequestType } from '../http-client-wrapper.service';
import { DataLayerRequest } from '../model/DataLayerRequest';
import { DataLayerResponse } from '../model/DataLayerResponse';
import { W3POCHttpClientDataProvider } from '../w3poc-http-client-data-provider';

@Injectable({
  providedIn: 'root'
})
export class AwsLambdaW3pocClientDataProviderService extends W3POCHttpClientDataProvider {

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
        super()
        this.backendUrl = this.config.getAttributeValue("backendUrl")
    }

    public requestData(request : DataLayerRequest, errorEventEmitter : EventEmitter<any>): Observable<DataLayerResponse> {
        return this.client.requestWithErrorHandling(
              RequestType.POST,                   // The request type is always POST
              this.backendUrl,                    // The URL to the generic lambda that gets data from any table
              { "request": request },             // The DataLayerRequest object is put in the body of the POST request
              errorEventEmitter,                  // The error event emitter will emit errors to the local subscriber to be processed and then sent to external consumers via the public errorEventEmitter
              undefined,                          // There are no URL params
              this.resolveAuthorizationHeader()   // The authorization header is needed for accessing the backend
          )
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
}
