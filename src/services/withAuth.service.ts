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
import { ApiUtils } from "utils/apiUtils";
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
    return _axios.get<any>(`${ApiUtils.buildEndpoint('placement-tests')}`).then((res) => res.data);
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
    // Use the dynamic notifications endpoint
    return _axios
      .get<any>(`${ApiUtils.buildEndpoint('notifications')}`)
      .then((res: any) => {
        // Transform new API response to match old structure
        const notifications = res.data.data.content;
        
        // Filter based on is_read parameter if provided
        let filteredNotifications = notifications;
        if (data?.is_read === 1) {
          // Show only read notifications
          filteredNotifications = notifications.filter((n: any) => n.read_at !== null);
        } else if (data?.is_read === 2) {
          // Show only unread notifications  
          filteredNotifications = notifications.filter((n: any) => n.read_at === null);
        }
        
        return {
          success: res.data.status,
          message: res.data.message,
          result: {
            data: filteredNotifications,
            current_page: res.data.data.pagination?.current_page || 1,
            last_page: res.data.data.pagination?.last_page || 1,
            limit: res.data.data.pagination?.per_page || 10,
            total: res.data.data.pagination?.total || filteredNotifications.length
          }
        };
      });
  }

  getListOfNotifications(): Promise<RootObj<IndexObj2<Notification[]>>> {
    return _axios.get<any>(`${ApiUtils.buildEndpoint('notifications')}`).then((res) => res.data);
  }

  readNotification(data: {
    notification_id?: string;
    make_all_read?: number;
  }): Promise<RootObj<IndexObj2<any>>> {
    if (data.make_all_read === 1) {
      // Use new read-all endpoint
      return _axios
        .get<any>(`${ApiUtils.buildEndpoint('notifications/read-all')}`)
        .then((res: any) => ({
          success: res.data.status,
          message: res.data.message,
          result: {
            data: res.data.data,
            current_page: 1,
            last_page: 1,
            limit: 1,
            total: 1
          }
        }));
    } else if (data.notification_id) {
      // Use new read specific notification endpoint
      return _axios
        .get<any>(`${ApiUtils.buildEndpoint(`notifications/read/${data.notification_id}`)}`)
        .then((res: any) => ({
          success: res.data.status,
          message: res.data.message,
          result: {
            data: res.data.data,
            current_page: 1,
            last_page: 1,
            limit: 1,
            total: 1
          }
        }));
    }
    
    return Promise.reject(new Error('Invalid notification read parameters'));
  }

  deleteNotification(data?: {
    notification_id?: string;
    remove_all?: number;
  }): Promise<RootObj<IndexObj2<any>>> {
    if (data?.notification_id) {
      // Use new delete specific notification endpoint
      return _axios
        .delete<any>(`${ApiUtils.buildEndpoint(`notifications/delete/${data.notification_id}`)}`)
        .then((res: any) => ({
          success: res.data.status,
          message: res.data.message,
          result: {
            data: res.data.data,
            current_page: 1,
            last_page: 1,
            limit: 1,
            total: 1
          }
        }));
    }
    
    // Note: There's no delete-all endpoint in the new API
    // This will need to be handled differently or removed
    return Promise.reject(new Error('Delete all notifications not supported in new API'));
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
