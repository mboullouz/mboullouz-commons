export interface JSRouting {
    generate(nomRoute: string, params?: any, flag?: boolean): JSRouting;
}

export class SfConfig {
    static getRouter(): JSRouting {
        return (window as any)["Routing"];
    }
}

export interface JSRoutingParams {
    nomRoute: string,
    params?: any,
    flag?: boolean
}
