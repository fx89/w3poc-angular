import { Observable } from "rxjs";
import { LoadingModalService } from "src/app/w3poc-core/loading-modal.service";
import { LoginService } from "src/app/w3poc-core/login-service.service";
import { DataLayerResponse } from "../model/DataLayerResponse";
import { W3POCHttpClientService } from "../w3poc-http-client.service";
import { EntityRepository } from "./EntityRepository";

export class CustomerTypeRepository extends EntityRepository {

    constructor(
        client : W3POCHttpClientService,
        loadingModal : LoadingModalService,
        loginService : LoginService,
        tableName : string
    ){
        super(client, loadingModal, loginService ,tableName);
    }

    /**
     * This is a special entity for which is safe to fetch all records
     * in one single page since we do not expect to have too many types
     * of customers in the database. This method is required for pages
     * which have to display a dropdown box to let users choose between
     * various customer types.
     */
    public findAll() : Observable<DataLayerResponse> {
        return this.requestDataCustomRequest(undefined, undefined)
    }
}