import axios, { AxiosResponse } from "axios";
import { _axios } from "interceptors/http-config";
import { Course, IndexObj, IndexObj2, RootObj, Notification } from "interface/common";
import {
  StudentOrdersForCompany,
  UsersCompany,
} from "modules/profile/interfaces/profile-interfaces";

// Company Profile Interface
export interface CompanyProfile {
  id: number;
  first_name: string;
  last_name?: string;
  email: string;
  profile_img?: string;
  cv_file?: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyProfileResponse {
  status: boolean;
  message: string;
  data: CompanyProfile;
}

export interface CompanyCoursesResponse {
  status: boolean;
  message: string;
  data: {
    data: Course[];
    meta: {
      current_page: number;
      from: number;
      last_page: number;
      links: Array<{
        url: string | null;
        label: string;
        active: boolean;
      }>;
      path: string;
      per_page: number;
      to: number;
      total: number;
      pagination_name: string;
    };
  };
}

class CompanyService {
  private static _instance: CompanyService;

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  // Legacy methods - keeping for backward compatibility
  getStudentOrdersForCompany(data: {
    student_id: number;
  }): Promise<RootObj<IndexObj2<StudentOrdersForCompany[]>>> {
    return _axios
      .post<any>(`getStudentOrdersForCompany`, data)
      .then((res) => res.data);
  }

  getUsersCompanyByToken(data?: any): Promise<RootObj<UsersCompany[]>> {
    return _axios.post<any>(`getUsersCompanyByToken`, data).then(
      (res) => res.data
    );
  }

  // NEW: Company Authentication
  loginCompany(data: {
    email: string;
    password: string;
  }): Promise<AxiosResponse<any>> {
    return _axios.post<any>(`company/login`, data);
  }

  logoutCompany(): Promise<AxiosResponse<any>> {
    return _axios.post<any>(`company/logout`);
  }

  // NEW: Company Profile Management
  getProfile(): Promise<AxiosResponse<CompanyProfileResponse>> {
    return _axios.get<any>(`company/profile`);
  }

  updateProfile(data: {
    first_name?: string;
    profile_img?: File;
    cv_file?: File;
  }): Promise<AxiosResponse<CompanyProfileResponse>> {
    const formData = new FormData();
    
    if (data.first_name) {
      formData.append('first_name', data.first_name);
    }
    if (data.profile_img) {
      formData.append('profile_img', data.profile_img);
    }
    if (data.cv_file) {
      formData.append('cv_file', data.cv_file);
    }

    return _axios.post<any>(`company/update-profile`, formData);
  }

  // NEW: Company Notifications
  getNotifications(): Promise<AxiosResponse<RootObj<Notification[]>>> {
    return _axios.get<any>(`company/notifications`);
  }

  readNotification(notificationId: string): Promise<AxiosResponse<RootObj<null>>> {
    return _axios.get<any>(`company/notifications/read/${notificationId}`);
  }

  deleteNotification(notificationId: string): Promise<AxiosResponse<RootObj<null>>> {
    return _axios.delete<any>(`company/notifications/delete/${notificationId}`);
  }

  readAllNotifications(): Promise<AxiosResponse<RootObj<null>>> {
    return _axios.get<any>(`company/notifications/read-all`);
  }

  // NEW: Company Courses
  getCourses(params?: {
    per_page?: number;
    filters?: {
      search?: string;
      category_id?: number;
      target_audience_id?: number;
      is_free?: boolean;
      is_paid?: boolean;
      price?: { min?: number; max?: number };
      rating?: number;
      duration?: { min?: number; max?: number };
      level_id?: number;
      created_this_week?: boolean;
      created_this_month?: boolean;
      created_this_year?: boolean;
    };
  }): Promise<AxiosResponse<CompanyCoursesResponse>> {
    const queryParams = new URLSearchParams();
    
    if (params?.per_page) {
      queryParams.append('per_page', params.per_page.toString());
    }
    
    if (params?.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (typeof value === 'object' && !Array.isArray(value)) {
            // Handle nested objects like price: { min, max }
            Object.entries(value).forEach(([nestedKey, nestedValue]) => {
              if (nestedValue !== undefined && nestedValue !== null) {
                queryParams.append(`filters[${key}][${nestedKey}]`, nestedValue.toString());
              }
            });
          } else {
            queryParams.append(`filters[${key}]`, value.toString());
          }
        }
      });
    }

    const queryString = queryParams.toString();
    const url = `company/courses${queryString ? `?${queryString}` : ''}`;
    
    return _axios.get<any>(url);
  }

  // NEW: Company Students
  getStudents(params?: {
    per_page?: number;
    filters?: {
      search?: string;
    };
  }): Promise<AxiosResponse<RootObj<any[]>>> {
    const queryParams = new URLSearchParams();
    
    if (params?.per_page) {
      queryParams.append('per_page', params.per_page.toString());
    }
    
    if (params?.filters?.search) {
      queryParams.append('filters[search]', params.filters.search);
    }

    const queryString = queryParams.toString();
    const url = `company/students${queryString ? `?${queryString}` : ''}`;
    
    return _axios.get<any>(url);
  }

  getStudent(studentId: number): Promise<AxiosResponse<RootObj<any>>> {
    return _axios.get<any>(`company/students/${studentId}`);
  }
}

export const _CompanyService = CompanyService.Instance;