import { _axios as Axios } from "./http-config";
import { _AuthService } from "services/auth.service";

export const HttpRequestInterceptor = () => {
  Axios.interceptors.request.use(
    function (request) {
      // Do something before request is sent
      const token = _AuthService.getJwtToken();
      
      // List of endpoints that don't require authentication
      const publicEndpoints = [
        'student/courses',
        'student/categories',
        'company/courses',
        'getCourses',
        'getCategories'
      ];
      
      // Check if this is a public endpoint
      const isPublicEndpoint = publicEndpoints.some(endpoint => 
        request.url?.includes(endpoint)
      );
      
      // Only add authorization header if we have a token and it's not a public endpoint
      // OR if it's not a public endpoint (require auth for all other endpoints)
      if (request.headers && token && !isPublicEndpoint) {
        request.headers.Authorization = `Bearer ${token}`;
      } else if (request.headers && token && isPublicEndpoint) {
        // For public endpoints, add token if available but don't require it
        request.headers.Authorization = `Bearer ${token}`;
      }

      return request;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );
};
