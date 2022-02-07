export const RESPONSE_TYPE_OK : string = "ok"
export const RESPONSE_TYPE_ERROR : string = "error"

export class DataLayerResponse {
    constructor(
        public responseType : string,
        public response : any
    ){}
}