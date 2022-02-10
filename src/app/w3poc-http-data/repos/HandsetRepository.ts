import { LoadingModalService } from "src/app/w3poc-core/loading-modal.service";
import { LoginService } from "src/app/w3poc-core/login-service.service";
import { W3POCHttpClientService } from "../w3poc-http-client.service";
import { EntityRepository } from "./EntityRepository";

export class HandsetRepository extends EntityRepository {

    constructor(
        client : W3POCHttpClientService,
        loadingModal : LoadingModalService,
        loginService : LoginService,
        tableName : string
    ){
        super(client, loadingModal, loginService ,tableName);
    }

    public findAllByCustomerId(customerId:any) {
        return this.requestDataWithFilter("customer_id", customerId)
    }
}
