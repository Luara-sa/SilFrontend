import { AxiosResponse } from "axios";
import { _axios } from "interceptors/http-config";

class WithoutAuthService {
  private static _instance: WithoutAuthService;

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  contactUs(data: any): Promise<AxiosResponse<any, any>> {
    return _axios.post<any>(`contactUs`, data).then((res: any) => {
      return res;
    });
  }
}

export const _WithoutAuthService = WithoutAuthService.Instance;
