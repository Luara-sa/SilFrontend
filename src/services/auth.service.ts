import { _axios } from "interceptors/http-config";
// import axios from "axios";

import { AxiosResponse } from "axios";
import { RootObj } from "interface/common";
import { IMe } from "store/meStore";
import { JwtUtils } from "utils/jwtUtils";
import { ApiUtils } from "utils/apiUtils";
// import { me, RootObj } from "interfaces/common";

const { NEXT_APP_TOKEN_KEY } = process.env;

  class AuthService {
    private static _instance: AuthService;
    private logoutCallbacks: (() => void)[] = [];
    private readonly SESSION_STARTED_AT_KEY = 'auth_session_started_at';
  public static readonly DEFAULT_SESSION_MAX_AGE_MS = 10 * 60 * 1000; // 10 minutes

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  /**
   * Add callback to be executed on logout
   */
  addLogoutCallback(callback: () => void) {
    this.logoutCallbacks.push(callback);
  }

  /**
   * Remove logout callback
   */
  removeLogoutCallback(callback: () => void) {
    this.logoutCallbacks = this.logoutCallbacks.filter(cb => cb !== callback);
  }

  login(data: any): Promise<AxiosResponse<RootObj<any>>> {
    return _axios.post<any>(`student/login`, data).then(async (res: any) => {
  
      // Handle new response structure: { status: true, data: { profile: {...}, token: "..." } }
      if (res.data.data && res.data.data.token) {
        await this.doLogin(res.data.data.token);
      }
      return res;
    });
  }


  loginCompany(data: any): Promise<AxiosResponse<RootObj<any>>> {
    return _axios.post<any>(`company/login`, data).then(async (res: any) => {
  
      // Handle new response structure: { status: true, data: { profile: {...}, token: "..." } }
      if (res.data.data && res.data.data.token) {
        await this.doLogin(res.data.data.token);
      }
      return res;
    });
  }

  register(data: any): Promise<AxiosResponse<any, any>> {
    return _axios.post<any>(`student/register`, data).then((res: any) => {
      // Don't auto-login on registration - user needs to verify email first
      return res;
    });
  }

  deleteAccount(): Promise<AxiosResponse<any, any>> {
    return _axios.delete<any>(`${ApiUtils.buildEndpoint('deleteAccount')}`).then((res: any) => {
      return res;
    });
  }

  logout(): Promise<AxiosResponse<any, any>> {
    return _axios.post<any>(`${ApiUtils.buildEndpoint('logout')}`).then((res: any) => {
      this.doLogout();
      return res;
    });
  }

  logoutCompany(): Promise<AxiosResponse<any, any>> {
    return _axios.post<any>(`company/logout`).then((res: any) => {
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

  // New email verification methods for updated API
  verifyEmail(verifyEmailToken: string, data: { email: string; code: string }): Promise<AxiosResponse<any>> {
    return _axios.post<any>(`student/verify-email`, data, {
      headers: {
        token: verifyEmailToken
      }
    }).then((res: any) => res.data);
  }

  resendVerificationCode(email: string): Promise<AxiosResponse<any>> {
    return _axios.post<any>(`student/resend-verification-code`, { email })
      .then((res: any) => res.data);
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
    provider: string;
    access_token: string;
  }): Promise<AxiosResponse<RootObj<ISocialLoginRes>>> {
    // Use new student/social-login endpoint with correct parameter names
    return _axios.post<any>(`student/social-login`, data).then(async (res) => {
      // Handle new response structure: { status: true, data: { profile: {...}, token: "..." } }
      if (res.data.data && res.data.data.token) {
        await this.doLogin(res.data.data.token);
      }
      return res;
    });
  }

  /**
   * Enhanced authentication check with token validation
   */
  isLoggedIn(): boolean {
    const token = this.getJwtToken();
    if (!token) return false;

    if (this.isSessionExpired()) {
      console.warn('Session max age reached, logging out...');
      this.doLogout();
      return false;
    }
    
    // Validate token format
    if (!JwtUtils.isValidTokenFormat(token)) {
      console.warn('Invalid token format detected, logging out...');
      this.doLogout();
      return false;
    }
    
    // Check if token is expired (only for JWT tokens)
    if (JwtUtils.isJwtToken(token) && JwtUtils.isTokenExpired(token)) {
      console.warn('Token expired, logging out...');
      this.doLogout();
      return false;
    }
    
    return true;
  }

  /**
   * Check if token exists without validation (for initial app load)
   */
  hasToken(): boolean {
    return Boolean(this.getJwtToken());
  }

  /**
   * Check if token will expire soon
   * For Sanctum tokens, this will always return false since they don't have expiration info
   */
  willTokenExpireSoon(bufferTimeSeconds: number = 300): boolean {
    const token = this.getJwtToken();
    if (!token) return true;
    
    // For Sanctum tokens, we can't check expiration client-side
    if (JwtUtils.isSanctumToken(token)) {
      return false;
    }
    
    return JwtUtils.willTokenExpireSoon(token, bufferTimeSeconds);
  }

  /**
   * Get token expiration date
   * Returns null for Sanctum tokens since they don't contain expiration info
   */
  getTokenExpiration(): Date | null {
    const token = this.getJwtToken();
    if (!token) return null;
    
    const expirationTime = JwtUtils.getTokenExpiration(token);
    return expirationTime ? new Date(expirationTime) : null;
  }

  /**
   * Enhanced logout with comprehensive cleanup
   */
  doLogout() {
    // Execute all registered logout callbacks
    this.logoutCallbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('Error executing logout callback:', error);
      }
    });

    this.destroyTokens();
    // Clear user data (async but don't wait for it to avoid blocking logout)
    this.clearAllUserData().catch((error) => {
      console.error("Error during comprehensive logout cleanup:", error);
    });
  }

  /**
   * Force logout with redirect (for expired tokens)
   */
  forceLogout(reason: string = 'Token expired') {
    console.warn(`Force logout: ${reason}`);
    this.doLogout();
    
    // Redirect to login page if we're not already there
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      // Only redirect if we're not already on an auth page
      if (!currentPath.startsWith('/auth/')) {
        // Store current path for redirect after login
        const returnUrl = currentPath + window.location.search;
        window.location.href = `/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`;
      }
      // If already on auth page, just stay there (don't redirect)
    }
  }

  // Debug method to check current localStorage state (for testing)
  debugLocalStorage() {
    if (typeof window !== "undefined") {
      console.log("Current localStorage keys:", Object.keys(localStorage));
      console.log("Current sessionStorage keys:", Object.keys(sessionStorage));
    }
  }

  async doLogin(token: any, user?: any) {
    // Validate token before storing
    if (!JwtUtils.isValidTokenFormat(token)) {
      throw new Error('Invalid token format');
    }
    
    if (JwtUtils.isTokenExpired(token)) {
      throw new Error('Token is already expired');
    }
    
    await this.storeTokens(token);
    this.markSessionStart();
    console.log('Token stored in AuthService:', !!this.getJwtToken());
  }

  getJwtToken() {
    if (typeof window !== "undefined") {
      return localStorage.getItem(NEXT_APP_TOKEN_KEY ?? "token");
    }
    return null;
  }

  /**
   * Store token securely using both localStorage and httpOnly cookies when possible
   */
  private async storeTokens(token: any) {
    const tokenKey = NEXT_APP_TOKEN_KEY ?? "token";
    
    // Store in localStorage for client-side access
    localStorage.setItem(tokenKey, token);
    
    // Store in httpOnly cookie via API call - WAIT for it to complete
    try {
      await this.storeTokenInCookie(token);
      console.log('Token stored in cookie successfully');
    } catch (error) {
      console.error('Failed to store token in httpOnly cookie:', error);
      // Continue execution as localStorage storage is still available
    }
  }

  /**
   * Store token in httpOnly cookie via API endpoint
   */
  private async storeTokenInCookie(token: string): Promise<void> {
    try {
      const response = await fetch('/api/auth/set-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
        credentials: 'include', // Include cookies in the request
      });

      if (!response.ok) {
        throw new Error(`Failed to store token in cookie: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error storing token in cookie:', error);
      throw error;
    }
  }

  /**
   * Clear token from httpOnly cookie via API endpoint
   */
  private async clearTokenFromCookie(): Promise<void> {
    try {
      const response = await fetch('/api/auth/clear-token', {
        method: 'POST',
        credentials: 'include', // Include cookies in the request
      });

      if (!response.ok) {
        throw new Error(`Failed to clear token from cookie: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error clearing token from cookie:', error);
      // Don't throw error as localStorage clearing is more important
    }
  }

  private destroyTokens() {
    localStorage.removeItem(NEXT_APP_TOKEN_KEY ?? "token");
    localStorage.removeItem(this.SESSION_STARTED_AT_KEY);
    // Clear user data from localStorage
    localStorage.removeItem('user_data');
    
    // Clear httpOnly cookie
    this.clearTokenFromCookie().catch(error => {
      console.warn('Failed to clear token from httpOnly cookie:', error);
    });
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

  /**
   * Track and validate session lifetime (front-end enforced)
   */
  private markSessionStart() {
    if (typeof window === "undefined") return;
    localStorage.setItem(this.SESSION_STARTED_AT_KEY, Date.now().toString());
  }

  private getSessionStart(): number | null {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(this.SESSION_STARTED_AT_KEY);
    if (!stored) return null;
    const parsed = Number(stored);
    return Number.isFinite(parsed) ? parsed : null;
  }

  isSessionExpired(maxAgeMs: number = AuthService.DEFAULT_SESSION_MAX_AGE_MS): boolean {
    if (maxAgeMs <= 0) return false;
    const startedAt = this.getSessionStart();

    // If we have no start time but a token exists, start the timer now.
    if (!startedAt && this.getJwtToken()) {
      this.markSessionStart();
      return false;
    }

    if (!startedAt) return true;

    const now = Date.now();
    return now - startedAt >= maxAgeMs;
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
    return _axios.get<any>(`${ApiUtils.buildEndpoint('profile')}`);
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
        this.forceLogout('Authentication failed during profile fetch');
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

    return _axios.post<any>(`${ApiUtils.buildEndpoint('update-profile')}`, formData);
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
