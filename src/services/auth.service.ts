import { _axios } from "interceptors/http-config";
// import axios from "axios";

import { AxiosResponse } from "axios";
import { RootObj } from "interface/common";
import { IMe } from "store/meStore";
// import { me, RootObj } from "interfaces/common";

const { NEXT_APP_TOKEN_KEY } = process.env;

class AuthService {
  private static _instance: AuthService;

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  login(data: any): Promise<AxiosResponse<RootObj<any>>> {
    return _axios.post<any>(`student/login`, data).then((res: any) => {
  
      // Handle new response structure: { status: true, data: { profile: {...}, token: "..." } }
      if (res.data.data && res.data.data.token) {
        this.doLogin(res.data.data.token);
      }
      return res;
    });
  }

  register(data: any): Promise<AxiosResponse<any, any>> {
    return _axios.post<any>(`student/register`, data).then((res: any) => {
  
      // Handle new response structure: { status: true, data: { profile: {...}, token: "..." } }
      if (res.data.data && res.data.data.token) {
        this.doLogin(res.data.data.token);
      }
      return res;
    });
  }

  deleteAccount(): Promise<AxiosResponse<any, any>> {
    return _axios.delete<any>(`student/deleteAccount`).then((res: any) => {
      return res;
    });
  }

  logout(): Promise<AxiosResponse<any, any>> {
    return _axios.post<any>(`student/logout`).then((res: any) => {
      this.doLogout();
      return res;
    });
  }

  forgetPassword(data: any): Promise<AxiosResponse<any>> {
    return _axios
      .post<any>(`forgetPassword`, data)
      .then((res: any) => (res.data as any).result);
  }

  confirmAccount(data: any): Promise<AxiosResponse<any>> {
    return _axios
      .post<any>(`confirmAccount`, data)
      .then((res: any) => (res.data as any).result);
  }

  resendConfirmAccountCode(data: any): Promise<AxiosResponse<any>> {
    return _axios
      .post<any>(`resendConfirmAccountCode`, data)
      .then((res: any) => (res.data as any).result);
  }

  updateProfile(data: any): Promise<AxiosResponse<any>> {
    return _axios.post<any>(`updateProfile`, data).then((res: any) => res.data);
  }

  uploadFile(data: any): Promise<RootObj<any>> {
    return _axios.post<any>(`uploadFile`, data).then((res: any) => res.data);
  }

  delegateRegister(
    data: DelegateRegisterPostData
  ): Promise<AxiosResponse<any, any>> {
    return _axios
      .post<any>(`delegateRegister`, data)
      .then((res: any) => res.data);
  }

  updateFCMToken(data: {
    fcm_token: string;
  }): Promise<AxiosResponse<any, any>> {
    return _axios
      .post<any>(`updateFCMToken`, data)
      .then((res: any) => res.data);
  }

  socialLogin(data: {
    provider_name: string;
    access_token: string;
  }): Promise<AxiosResponse<RootObj<ISocialLoginRes>>> {
    return _axios.post<any>(`socialLogin`, data).then((res) => {
      // Handle both old and new response structures
      const token = res.data.token || res.data.result?.access_token;
      if (token) {
        this.doLogin(token);
      }
      return res;
    });
  }

  isLoggedIn() {
    return Boolean(this.getJwtToken());
  }

  doLogout() {
    this.destroyTokens();
    // Clear user data (async but don't wait for it to avoid blocking logout)
    this.clearAllUserData().catch((error) => {
      console.error("Error during comprehensive logout cleanup:", error);
    });
  }

  // Debug method to check current localStorage state (for testing)
  debugLocalStorage() {
    if (typeof window !== "undefined") {
      console.log("Current localStorage keys:", Object.keys(localStorage));
      console.log("Current sessionStorage keys:", Object.keys(sessionStorage));
    }
  }

  doLogin(token: any, user?: any) {
    this.storeTokens(token);
  }

  getJwtToken() {
    if (typeof window !== "undefined") {
      return localStorage.getItem(NEXT_APP_TOKEN_KEY ?? "token");
    }
    return null;
  }

  private storeTokens(token: any) {
    localStorage.setItem(NEXT_APP_TOKEN_KEY ?? "token", token);
  }

  private destroyTokens() {
    localStorage.removeItem(NEXT_APP_TOKEN_KEY ?? "token");
    // Clear user data from localStorage
    localStorage.removeItem('user_data');
  }

  private async clearAllUserData() {
    try {
      // Clear all localStorage (comprehensive cleanup)
      if (typeof window !== "undefined") {
        // Get all localStorage keys before clearing
        const keysToPreserve = ['language', 'theme', 'settings']; // Preserve app settings
        const allKeys = Object.keys(localStorage);
        
        // Remove all keys except the ones we want to preserve
        allKeys.forEach(key => {
          if (!keysToPreserve.includes(key)) {
            localStorage.removeItem(key);
          }
        });
        
        // Clear all sessionStorage
        sessionStorage.clear();
      }
      
      // Clear user-specific Zustand stores
      await this.clearUserStores();
    } catch (error) {
      console.error("Error during logout cleanup:", error);
      // Fallback: force clear everything
      if (typeof window !== "undefined") {
        try {
          localStorage.clear();
          sessionStorage.clear();
        } catch (fallbackError) {
          console.error("Fallback cleanup also failed:", fallbackError);
        }
      }
    }
  }

  private async clearUserStores() {
    try {
      // Clear stores directly using dynamic imports with await
      if (typeof window !== "undefined") {
        // Clear meStore (most important)
        try {
          const { meStore } = await import('../store/meStore');
          meStore.getState().clearMe();
        } catch (e) {
          console.warn("Could not clear meStore:", e);
        }

        // Clear profileStore
        try {
          const { profileStore } = await import('../store/profileStore');
          profileStore.getState().clearData();
        } catch (e) {
          console.warn("Could not clear profileStore:", e);
        }

        // Clear courseStore
        try {
          const { courseStore } = await import('../store/courseStore');
          if (courseStore.getState().clearCourseStore) {
            courseStore.getState().clearCourseStore();
          }
        } catch (e) {
          console.warn("Could not clear courseStore:", e);
        }

        // Clear filterStore
        try {
          const { filterStore } = await import('../store/filterStore');
          filterStore.setState({
            filters: {},
            currentPage: 1
          });
        } catch (e) {
          console.warn("Could not clear filterStore:", e);
        }

        // Clear notificationStore
        try {
          const { notificationStore } = await import('../store/notificationStore');
          notificationStore.setState({
            notifications: undefined,
            reRenderNotification: false
          });
        } catch (e) {
          console.warn("Could not clear notificationStore:", e);
        }
      }
    } catch (error) {
      console.error("Error clearing user stores:", error);
    }
  }

  // New forgot password methods
  forgotPassword(data: { email: string }): Promise<AxiosResponse<RootObj<{ token: string }>>> {
    return _axios.post<any>(`student/forgot-password`, data);
  }

  verifyResetCode(token: string, data: { code: string }): Promise<AxiosResponse<RootObj<null>>> {
    return _axios.post<any>(`student/verify-reset-code`, data, {
      headers: {
        token: token
      }
    });
  }

  resetPassword(token: string, data: { password: string; password_confirmation: string }): Promise<AxiosResponse<RootObj<null>>> {
    return _axios.post<any>(`student/reset-password`, data, {
      headers: {
        token: token
      }
    });
  }

  // New method to fetch student profile
  getStudentProfile(): Promise<AxiosResponse<RootObj<IStudentProfile>>> {
    return _axios.get<any>(`student/profile`);
  }

  // New method to fetch and update student profile in store
  async fetchAndUpdateStudentProfile(meStore: any) {
    try {
      if (!this.isLoggedIn()) {
        console.warn("Cannot fetch profile: User not logged in");
        return null;
      }

      const response = await this.getStudentProfile();
      
      // Handle both response formats - new API uses status/data, old uses success/result
      const responseData = response.data as any;
      const isSuccess = responseData.status || responseData.success;
      const profileData = responseData.data || responseData.result;
      
      if (isSuccess && profileData) {
        const currentMe = meStore.getState().me;
        
        if (currentMe?.user && currentMe?.role?.includes("student")) {
          // Merge new profile data with existing user data
          const updatedUser = {
            ...currentMe.user,
            id: profileData.id,
            first_name: profileData.first_name,
            last_name: profileData.last_name,
            email: profileData.email,
            prefix_phone_number: profileData.prefix_phone_number,
            phone: profileData.phone,
            gender: profileData.gender,
            profile_img: profileData.profile_img,
            enrollments_count: profileData.enrollments_count,
            // Keep backward compatibility
            username: profileData.first_name && profileData.last_name 
              ? `${profileData.first_name} ${profileData.last_name}`
              : currentMe.user.username,
            personal_image: profileData.profile_img || currentMe.user.personal_image,
          };

          const updatedMeData = {
            ...currentMe,
            user: updatedUser,
          };

          meStore.getState().setMe(updatedMeData);

          // Update localStorage with new data
          localStorage.setItem("user_data", JSON.stringify(updatedMeData));
          
          return updatedUser;
        }
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        console.warn("Profile fetch failed: User not authenticated");
      } else if (err.response?.status === 403) {
        console.warn("Profile fetch failed: Access forbidden");
      } else {
        console.error("Failed to fetch student profile:", err);
      }
      return null;
    }
  }

  // New method to update student profile with multipart/form-data
  updateStudentProfile(data: {
    first_name?: string;
    last_name?: string;
    profile_img?: File;
  }): Promise<AxiosResponse<RootObj<IStudentProfile>>> {
    const formData = new FormData();
    
    if (data.first_name) {
      formData.append('first_name', data.first_name);
    }
    if (data.last_name) {
      formData.append('last_name', data.last_name);
    }
    if (data.profile_img) {
      formData.append('profile_img', data.profile_img);
    }

    return _axios.post<any>(`student/update-profile`, formData);
  }
}

export const _AuthService = AuthService.Instance;

interface DelegateRegisterPostData {
  username: string;
  email: string;
  password: string;
  phone: string;
  gender: string;
  id_number: string;
  personal_image?: string;
}

interface ISocialLoginRes extends IMe {
  token_type: string;
  access_token: string;
}

interface IStudentProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  prefix_phone_number: string;
  phone: string;
  gender: "male" | "female";
  profile_img: string;
  enrollments_count: number;
}
