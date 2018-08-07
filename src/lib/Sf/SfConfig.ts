export interface JSRouting {
  generate(nomRoute: string, params?: any, flag?: boolean): JSRouting;
}
export class SfConfig {
  constructor() {}
  static getRouter(): JSRouting {
    let w: any = window;
    return <any>w["Routing"];
  }
}
