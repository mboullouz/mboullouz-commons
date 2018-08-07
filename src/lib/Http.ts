import { SfConfig } from "./SfConfig";

export class HttpService {
  static post<T>(
    dataToSubmit: T,
    callbackSuccess: (response: any) => any,
    callbackError: (response: any) => any,
    routeName: string,
    routeParams?: any,
    routeFlag?: boolean
  ) {
    $.ajax(
      HttpService.constructPostObject(
        dataToSubmit,
        callbackSuccess,
        callbackError,
        routeName,
        routeParams,
        routeFlag
      )
    );
  }

  private static constructPostObject(
    dataToSubmit: any,
    callbackSuccess: (response: any) => any,
    callbackError: (response: any) => any,
    routeName: string,
    routeParams?: any,
    routeFlag?: boolean
  ): any {
    const obj = {
      url: SfConfig.getRouter().generate(routeName, routeParams, routeFlag),
      type: "POST",
      data: JSON.stringify(dataToSubmit),
      success: function(serverResp: any) {
        callbackSuccess(serverResp);
      },
      error: function(serverResp: any) {
        callbackError(serverResp);
      }
    };
    return obj;
  }
}
