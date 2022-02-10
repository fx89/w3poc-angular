import { Injectable } from '@angular/core';
import { LoadingModalService } from '../w3poc-core/loading-modal.service';
import { LoginService } from '../w3poc-core/login-service.service';
import { DataLayerResponse } from './model/DataLayerResponse';
import { CustomerRepository } from './repos/CustomerRepository';
import { CustomerTypeRepository } from './repos/CustomerTypeRepository';
import { HandsetRepository } from './repos/HandsetRepository';
import { W3POCHttpClientService } from './w3poc-http-client.service';

@Injectable({
  providedIn: 'root'
})
export class W3pocDataService {

  public customerTypeRepository : CustomerTypeRepository
  public customerRepository : CustomerRepository
  public handsetRepository : HandsetRepository

  constructor(
      private client : W3POCHttpClientService,
      loadingModal : LoadingModalService,
      loginService : LoginService
  ) {
      this.customerTypeRepository = new CustomerTypeRepository(client, loadingModal, loginService, "customer_type")
      this.customerRepository = new CustomerRepository(client, loadingModal, loginService, "customer")
      this.handsetRepository = new HandsetRepository(client, loadingModal, loginService, "handset")
  }

  public subscribeToErrorEvent(next?: (response:DataLayerResponse) => void) {
      this.client.errorEventEmitter.subscribe(next)
  }
}
