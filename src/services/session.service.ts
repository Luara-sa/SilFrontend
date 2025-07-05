import axios, { AxiosResponse } from "axios";
import { _axios } from "interceptors/http-config";
import {
  Course,
  CreateStudentOrder,
  IndexObj,
  RootObj,
} from "interface/common";

class SessionService {
  private static _instance: SessionService;
  //   private readonly URL = "admin";

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  getSessionsByCourseId(id: any): Promise<RootObj<any>> {
    return _axios
      .get<any>(`getSessionsByCourseId/${id}`)
      .then((res) => res.data);
  }

  //   getById(id: string): Promise<RootObj<any>> {
  //     return _axios.get<any>(`getCourseById/${id}`).then((res) => res.data);
  //   }

  //   getTestByCourseId(id: string): Promise<any> {
  //     return _axios.get<any>(`getTestsByCourseId/${id}`).then((res) => res.data);
  //   }

  //   getLiveCourse(data: any): Promise<AxiosResponse<any, any>> {
  //     return _axios.post<any>(`getLiveCourse`, data);
  //   }
}

export const _SessionService = SessionService.Instance;
