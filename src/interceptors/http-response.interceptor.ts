import { _axios as Axios } from "./http-config";
import { _AuthService } from "services/auth.service";

interface HttpResponseInterceptorProps {
  enqueueSnackbar: any;
  navigate: any;
}

export const HttpResponseInterceptor = ({
  enqueueSnackbar,
  navigate,
}: HttpResponseInterceptorProps) => {
  Axios.interceptors.response.use(
    function (response) {
      // Do something with response data
      switch (response?.config?.method) {
        case "post":
          enqueueSnackbar(response.data.message, {
            variant: "success",
            autoHideDuration: 3000,
          });
          break;
        case "put":
          enqueueSnackbar(response.data.message, {
            variant: "success",
            autoHideDuration: 3000,
          });
          break;
        case "patch":
          enqueueSnackbar(response.data.message, {
            variant: "success",
            autoHideDuration: 3000,
          });
          break;
        case "delete":
          enqueueSnackbar(response.data.message, {
            variant: "success",
            autoHideDuration: 3000,
          });
          break;

        default:
          break;
      }

      return response;
    },
    function (error) {
      // make a copy of the original request to do it again incase we need to refresh the token
      const originalRequest = error?.config;

      switch (error?.response?.status) {
        // Handle unauthorized access (token expired/invalid)
        case 401:
          console.warn('401 Unauthorized: Token expired or invalid');
          enqueueSnackbar('Session expired. Please log in again.', {
            variant: "warning",
            autoHideDuration: 3000,
          });
          _AuthService.forceLogout('Token expired or invalid (401)');
          break;

        // Handle forbidden access
        case 403:
          console.warn('403 Forbidden: Access denied');
          enqueueSnackbar('Access denied. Please contact support if this is unexpected.', {
            variant: "error",
            autoHideDuration: 5000,
          });
          break;

        // Legacy logout codes (keeping for backward compatibility)
        case 402:
          console.warn('402 Payment Required: Forcing logout');
          _AuthService.doLogout();
          break;

        // Handle validation errors
        case 405:
          Object.keys(error.response.data.message).map((key) =>
            enqueueSnackbar(error.response.data.message[key], {
              variant: "error",
              autoHideDuration: 3000,
            })
          );
          break;

        // Handle unprocessable entity (validation errors)
        case 422:
          if (error.response.data?.errors) {
            Object.keys(error.response.data.errors).forEach((key) => {
              const errorMessages = error.response.data.errors[key];
              if (Array.isArray(errorMessages)) {
                errorMessages.forEach((message) => {
                  enqueueSnackbar(message, {
                    variant: "error",
                    autoHideDuration: 3000,
                    preventDuplicate: true,
                  });
                });
              }
            });
          } else if (error.response.data?.message) {
            enqueueSnackbar(error.response.data.message, {
              variant: "error",
              autoHideDuration: 3000,
            });
          }
          break;

        // Handle server errors
        case 500:
          enqueueSnackbar('Server error occurred. Please try again later.', {
            variant: "error",
            autoHideDuration: 5000,
          });
          break;

        // Handle service unavailable
        case 503:
          enqueueSnackbar('Service temporarily unavailable. Please try again later.', {
            variant: "warning",
            autoHideDuration: 5000,
          });
          break;

        // Handle rate limiting
        case 429:
          enqueueSnackbar('Too many requests. Please wait a moment before trying again.', {
            variant: "warning",
            autoHideDuration: 5000,
          });
          break;

        // Handle not found specifically for placement tests
        case 404:
          // Don't show error toast for placement test results - it's normal when no results exist
          if (error.config?.url?.includes('/placement-tests/') && error.config?.url?.includes('/result')) {
            // Silently handle placement test result not found - this is expected behavior
            break;
          }
          
          if (error.response?.data?.message) {
            enqueueSnackbar(error.response.data.message, {
              variant: "error",
              autoHideDuration: 3000,
            });
          }
          break;

        default:
          // Only show generic error message for unexpected errors
          if (error.response?.data?.message) {
            // Don't show error toast for placement test results - it's normal when no results exist
            if (error.config?.url?.includes('/placement-tests/') && error.config?.url?.includes('/result')) {
              break;
            }
            
            enqueueSnackbar(error.response.data.message, {
              variant: "error",
              autoHideDuration: 3000,
            });
          } else if (error.message && error.message !== 'Network Error') {
            enqueueSnackbar(error.message, {
              variant: "error",
              autoHideDuration: 3000,
            });
          }
          break;
      }

      return Promise.reject(error);
    }
  );
};
