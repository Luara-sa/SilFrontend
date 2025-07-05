import axios, { AxiosResponse } from "axios";
import { _axios } from "interceptors/http-config";
import { IndexObj, IndexObj2, RootObj } from "interface/common";
import {
  MyCertificates,
  MyCourse,
  MyDashboard,
  MyOrdersInstallments,
  MyTest,
} from "modules/profile/interfaces/profile-interfaces";

interface AttendecePOSTprops {
  student_order_id: number | string;
  session_id: number | string;
  attchment_id?: number | string;
  session_test_id?: number | string;
  attachment_test_id?: number | string;
}

class StudentRoleService {
  private static _instance: StudentRoleService;
  //   private readonly URL = "admin";

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  userPassedTest(data?: any): Promise<RootObj<any>> {
    return _axios.post<any>(`userPassedTest`, data).then((res) => res.data);
  }

  updateAttendanceStudent(
    data?: AttendecePOSTprops
  ): Promise<AxiosResponse<any, any>> {
    return _axios.post<any>(`updateAttendanceStudent`, data);
  }

  getStudentOrderDetails(): Promise<AxiosResponse<any, any>> {
    return _axios.get<any>(`getStudentOrderDetails`);
  }

  getStudentOrdersByToken(data?: any): Promise<RootObj<IndexObj<MyCourse>>> {
    return _axios
      .post<any>(`getStudentOrdersByToken`, data)
      .then((res) => res.data);
  }

  getTestsByToken(): Promise<RootObj<{ data: MyTest[] }>> {
    return _axios.get<any>(`getTestsByToken`).then((res) => res.data);
  }

  studentBeDelegate(): Promise<RootObj<any>> {
    return _axios.get<any>(`studentBeDelegate`).then((res) => res.data);
  }

  ratingCourse(data: any): Promise<RootObj<any>> {
    return _axios.post<any>(`ratingCourse`, data).then((res) => res.data);
  }

  changeStudentOrderStatus(data: {
    student_order_id: number;
    status: string;
  }): Promise<RootObj<any>> {
    return _axios
      .post<any>(`changeStudentOrderStatus`, data)
      .then((res) => res.data);
  }

  completedCourse(data: { student_order_id: number }): Promise<RootObj<any>> {
    return _axios
      .post<any>(`completedCourse`, data)
      .then((res) => res.data.result);
  }

  createStudentRequestCertificate(data: {
    student_order_id: number;
  }): Promise<RootObj<any>> {
    return _axios
      .post<any>(`createStudentRequestCertificate`, data)
      .then((res) => res.data);
  }

  getCertificatesStudentByToken(
    data?: any
  ): Promise<RootObj<IndexObj2<{ data: MyCertificates[] }>>> {
    return _axios
      .post<any>(`getCertificatesStudentByToken`, data)
      .then((res) => res.data);
  }

  getMyOrdersInstallmentsByToken(): Promise<
    RootObj<IndexObj2<MyOrdersInstallments[]>>
  > {
    return _axios
      .get<any>(`getMyOrdersInstallmentsByToken`)
      .then((res) => res.data);
  }

  getPlacmentTestsByToken(): Promise<RootObj<IndexObj2<MyTest[]>>> {
    return _axios.get<any>(`getPlacmentTestsByToken`).then((res) => res.data);
  }

  checkOrderAvailability(id: string | number): Promise<RootObj<any>> {
    return _axios
      .get<any>(`checkOrderAvailability/${id}`)
      .then((res) => res.data);
  }
  getProfileDashboard(): Promise<RootObj<IndexObj2<MyDashboard[]>>> {
    return _axios.get<any>(`getDasboardProfileData`).then((res) => res.data);
  }

  //   getTestDetailsbyId(id: string): Promise<RootObj<TestType>> {
  //     return _axios.get<any>(`getTestDetailsbyId/${id}`).then((res) => res.data);
  //   }

  //   getById(id: string): Promise<RootObj<any>> {
  //     return _axios.get<any>(`getCourseById/${id}`).then((res) => res.data);
  //   }

  // getTestByCourseId(id: string): Promise<RootObj<any>> {
  //   return _axios.get<any>(`getTestsByCourseId/${id}`).then((res) => res.data);
  // }

  //   getLiveCourse(data: any): Promise<AxiosResponse<any, any>> {
  //     return _axios.post<any>(`getLiveCourse`, data);
  //   }
}

export const _StudentRoleService = StudentRoleService.Instance;
