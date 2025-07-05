import axios, { AxiosResponse } from "axios";
import { _axios } from "interceptors/http-config";
import {
  Course,
  CreateStudentOrder,
  IndexObj,
  IndexObj2,
  IPaymentMethodActive,
  Notification,
  RootObj,
  TestType,
} from "interface/common";
import { MyOrders } from "modules/profile/interfaces/profile-interfaces";

class WithAuthService {
  private static _instance: WithAuthService;
  //   private readonly URL = "admin";

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  createOrderStudent(
    data?: CreateStudentOrder
  ): Promise<AxiosResponse<any, any>> {
    return _axios.post<any>(`createStudentOrder`, data);
  }

  getTestDetailsbyId(id: string): Promise<RootObj<TestType>> {
    return _axios.get<any>(`getTestDetailsbyId/${id}`).then((res) => res.data);
  }

  createCourseLinkDelegate(data: {
    live_course_id: number;
  }): Promise<RootObj<any>> {
    return _axios
      .post<any>(`createDelegateLink`, data)
      .then((res: any) => res.data);
  }

  createDocumentRequest(data: any): Promise<RootObj<any>> {
    return _axios
      .post<any>(`createDocumentRequest`, data)
      .then((res: any) => res.data);
  }

  getDocumentsByToken(
    data?: any
  ): Promise<RootObj<IndexObj2<{ data: MyOrders[] }>>> {
    return _axios
      .post<any>(`getDocumentsByToken`, data)
      .then((res: any) => res.data);
  }

  getPlacementTests(): Promise<RootObj<IndexObj2<{ data: TestType[] }>>> {
    return _axios.get<any>("student/placement-tests").then((res) => res.data);
  }
  getUserTest(id: string): Promise<RootObj<IndexObj2<{ data: any }>>> {
    return _axios.get<any>(`getUserTest/${id}`).then((res) => res.data);
  }

  testNotification(): Promise<any> {
    return _axios.get<any>("testNotification").then((res) => res.data);
  }

  getNotificationsByToken(data?: {
    is_read?: 1 | 2;
  }): Promise<RootObj<IndexObj2<Notification[]>>> {
    return _axios
      .post<any>(`getNotificationsByToken`, data)
      .then((res: any) => res.data);
  }

  readNotification(data: {
    notification_id?: number;
    make_all_read?: number;
  }): Promise<RootObj<IndexObj2<any>>> {
    return _axios
      .post<any>(`readNotification`, data)
      .then((res: any) => res.data);
  }

  deleteNotification(data?: {
    notification_id?: number;
    remove_all?: number;
  }): Promise<RootObj<IndexObj2<any>>> {
    return _axios
      .post<any>(`deleteNotification`, data)
      .then((res: any) => res.data);
  }

  getPaymentMethodActive(): Promise<RootObj<IPaymentMethodActive[]>> {
    return _axios.get<any>("getPaymentMethodActive").then((res) => res.data);
  }

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

export const _WithAuthService = WithAuthService.Instance;
