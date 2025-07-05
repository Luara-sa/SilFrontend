import axios, { AxiosResponse } from "axios";
import { _axios } from "interceptors/http-config";
import { Course, IndexObj, IndexObj2, RootObj } from "interface/common";
import {
  DelegateCourse,
  StudentOrdersForCompany,
} from "modules/profile/interfaces/profile-interfaces";

class DelegateRoleService {
  private static _instance: DelegateRoleService;
  //   private readonly URL = "admin";

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  getDelegateCoursesByToken(
    data?: any
  ): Promise<RootObj<IndexObj2<DelegateCourse[]>>> {
    return _axios
      .post<any>(`getDelegateCoursesByToken`, data ?? { page: 1, limit: 1000 })
      .then((res) => res.data);
  }

  getDelegateScore(): Promise<RootObj<Course>> {
    return _axios.get<any>("getDelegateScore").then((res) => res.data);
  }
}

export const _DelegateRoleService = DelegateRoleService.Instance;
