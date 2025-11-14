import axios from "axios";
import { _axios } from "interceptors/http-config";
import { _AuthService } from "services/auth.service";

// export var cancelTokenSource = axios.CancelToken.source();

export default _axios.interceptors.request.use(
  function (request: any) {
    // Do something before request is sent
    
    // Get current locale from the URL or localStorage
    let locale = 'en'; // default
    if (typeof window !== 'undefined') {
      // Try to get locale from URL path (e.g., /ar/courses or /en/courses)
      const pathParts = window.location.pathname.split('/');
      const pathLocale = pathParts[1];
      if (pathLocale === 'ar' || pathLocale === 'en') {
        locale = pathLocale;
      } else {
        // Fallback to localStorage or default
        locale = localStorage.getItem('locale') || 'en';
      }
    }
    
    // Add localization header to all requests
    request.headers['X-localization'] = locale;
    
    // Add authorization token if available
    const token = _AuthService.getJwtToken();
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }
    // request.cancelToken = cancelTokenSource.token;

    return request;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);
