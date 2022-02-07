import { FilterSpecification } from "./FilterSpecification";
import { WindowSpecification } from "./WindowSpecification";

export class DataLayerRequest {
    constructor(
        public tableName : string,
        public filters : FilterSpecification[] | undefined,
        public paging : WindowSpecification | undefined
    ) {}
}