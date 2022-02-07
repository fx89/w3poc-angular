import { Observable } from "rxjs";
import { LoadingModalService } from "src/app/w3poc-core/loading-modal.service";
import { LoginService } from "src/app/w3poc-core/login-service.service";
import { DataLayerResponse } from "../model/DataLayerResponse";
import { FilterSpecification } from "../model/FilterSpecification";
import { WindowSpecification } from "../model/WindowSpecification";
import { W3POCHttpClientService } from "../w3poc-http-client.service";
import { EntityRepository } from "./EntityRepository";

export class CustomerRepository extends EntityRepository {

    constructor(
        client : W3POCHttpClientService,
        loadingModal : LoadingModalService,
        loginService : LoginService,
        tableName : string
    ){
        super(client, loadingModal, loginService ,tableName);
    }

    public findOneById(id:number) : Observable<DataLayerResponse> {
        return this.requestDataWithFilter("id", id)
    }

    public findAllByTypeId(typeId:number) {
        return this.requestDataWithFilter("customer_type_id", typeId)
    }

    public pageAllByTypeId(typeId:number, windowStart:number, windowSize:number) {
        return this.requestDataWithFilterAndPaging("customer_type_id", typeId, windowStart, windowSize)
    }

    public pageAllByTypeIdAndNameLike(typeId:number, customerName:string, windowStart:number, windowSize:number) {
        return this.requestDataCustomRequest(
            [
                new FilterSpecification("customer_type_id", typeId),
                new FilterSpecification("customer_name", '%' + customerName + '%')
            ],
            new WindowSpecification(windowStart, windowSize)
        )
    }

    public pageAllByNameLike(customerName:string, windowStart:number, windowSize:number) {
        return this.requestDataCustomRequest(
            [ new FilterSpecification("customer_name", '%' + customerName + '%') ],
            new WindowSpecification(windowStart, windowSize)
        )
    }
}