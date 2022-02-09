import { EventEmitter } from "@angular/core";
import { Observable } from "rxjs";
import { DataLayerRequest } from "./model/DataLayerRequest";
import { DataLayerResponse } from "./model/DataLayerResponse";

export abstract class W3POCHttpClientDataProvider {
  public abstract requestData(
          request: DataLayerRequest,
          errorEventEmitter : EventEmitter<any>
      ) : Observable<DataLayerResponse>;
}
