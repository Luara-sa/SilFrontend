import axios, { AxiosResponse } from "axios";
import { _axios } from "interceptors/http-config";
import { Course, IndexObj, IndexObj2, RootObj } from "interface/common";
import {
  StudentOrdersForCompany,
  UsersCompany,
} from "modules/profile/interfaces/profile-interfaces";

class CompanyService {
  private static _instance: CompanyService;
  //   private readonly URL = "admin";

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  getStudentOrdersForCompany(data: {
    student_id: number;
  }): Promise<RootObj<IndexObj2<StudentOrdersForCompany[]>>> {
    return _axios
      .post<any>(`getStudentOrdersForCompany`, {
        student_id: data.student_id,
        limit: 1000,
      })
      .then((res) => res.data);
  }

  getUsersCompanyByToken(data?: any): Promise<RootObj<UsersCompany[]>> {
    return _axios
      .post<any>(`getUsersCompanyByToken`, data)
      .then((res) => res.data);
  }
}

export const _CompanyService = CompanyService.Instance;
