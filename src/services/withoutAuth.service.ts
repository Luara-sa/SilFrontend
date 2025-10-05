import { AxiosResponse } from "axios";
import { _axios } from "interceptors/http-config";

class WithoutAuthService {
  private static _instance: WithoutAuthService;

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  contactUs(data: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }): Promise<AxiosResponse<any, any>> {
    return _axios.post<any>('app/shared/contacts', data).then((res: any) => {
      return res;
    });
  }

  // NEW: Method to get sliders
  getSliders(): Promise<AxiosResponse<any, any>> {
    return _axios.get<any>('web/shared/sliders').then((res: any) => {
      return res;
    });
  }
}

export const _WithoutAuthService = WithoutAuthService.Instance;
