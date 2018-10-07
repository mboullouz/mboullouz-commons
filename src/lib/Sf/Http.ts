import {JSRoutingParams, SfConfig} from "./SfConfig";

export class Http {
    static async post<T>(dataToSubmit: T, routingParams: JSRoutingParams) {
        return $.ajax(Http.constructRequest(dataToSubmit, routingParams, "POST"));
    }

    static async get(routingParams: JSRoutingParams){
        return $.ajax(Http.constructRequest({}, routingParams, "GET") );
    }

    private static constructRequest(dataToSubmit: any, routingParams: JSRoutingParams, methodType: string): any {
        return {
            url: SfConfig.getRouter().generate(routingParams.nomRoute, routingParams.params, routingParams.flag),
            method: methodType,
            data: JSON.stringify(dataToSubmit),
            contentType: "application/json;charset=utf-8",
            dataType: "json"
        };
    }
}