import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { share, catchError } from 'rxjs/operators';

export const ERR_MSG_CONNECTION_REFUSED : string = "Connection refused";

/**
 * used by the request() method
 */
 export enum RequestType {
  POST    = 'POST',
  GET     = 'GET',
  DELETE  = 'DELETE',
  PUT     = 'PUT',
  HEAD    = 'HEAD',
  JSONP   = 'JSONP',
  OPTIONS = 'OPTIONS',
  PATCH   = 'PATCH'
}

/**
* used by the request() method
*/
export enum ResponseType {
  ARRAYBUFFER = 'arraybuffer',
  TEXT        = 'text',
  BLOB        = 'blob',
  JSON        = 'json'
}


@Injectable({
  providedIn: 'root'
})
export class HttpClientWrapperService {

   constructor(private httpClient: HttpClient) { }
   /**
    * Simplified version of the request from the HttpClient,
    * designed for in-line calls instead of having to instantiate headers and other things
    */
   public request<R>(
       requestType: RequestType,
       url: string,
       body: any,
       params?: Map<string, string>,
       headers?: Map<string, string>,
       responseType?: ResponseType
   ): Observable<R> {
    // Workaround to allow the parameters to be passed to the constructor of HttpRequest
       const requestTypeForced: any = requestType.valueOf();
       const responseTypeForced: any = responseType == null ? 'json' : responseType.valueOf();

    // Build the params (if any)
       let httpParams: HttpParams = <any>null;

       if (params != null) {
           httpParams = new HttpParams();

           params.forEach((value: string, key: string) => {
               httpParams = httpParams.append(key, value);
           });
       }

    // Build the headers (if any)
       let httpHeaders: HttpHeaders = <any>null;

       if (headers != null) {
           httpHeaders = new HttpHeaders();

           headers.forEach((value: string, key: string) => {
               httpHeaders = httpHeaders.append(key, value);
           });
       }

    // Send the request
       return this.httpClient.request<R> (
                           requestTypeForced,
                           url,
                           {
                               body: body,
                               headers: httpHeaders,
                               observe: 'body',
                               params: httpParams,
                               responseType: responseTypeForced,
                               reportProgress: false,
                               withCredentials: false
                           }
                       )
                       .pipe(
                           share()
                        )
                        .pipe(
                           catchError(err => of(err.error))
                        )
                       ;
   }

   public requestWithErrorHandling<R>(
       requestType: RequestType,
       url: string,
       body: any,
       errorEventEmitter: EventEmitter<any>,
       params?: Map<string, string>,
       headers?: Map<string, string|any>,
       responseType?: ResponseType
   ) : Observable<any>
   {
       let ret : EventEmitter<any> = new EventEmitter<any>();

       this.request<R>(requestType, url, body, params, headers, responseType)
       .subscribe(
         data => {
            const responseType = (<any>data).type
            if (!(responseType == 'error') && ((<any>data)?.status == undefined || (<any>data)?.status == 200)) {
                ret.emit(data)
            } else {  
                errorEventEmitter.emit(responseType == 'error' ? ERR_MSG_CONNECTION_REFUSED : data);
            }
        },
         error => { errorEventEmitter.emit(error); }
       )
       return ret;
   }

}
