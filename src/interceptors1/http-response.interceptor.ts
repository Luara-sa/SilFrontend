import { AxiosError } from "axios";
import { _axios } from "interceptors/http-config";
import { _AuthService } from "services/auth.service";
import { eventEmitter } from "services/eventEmitter";

interface Error {
  message: string;
  [key: string]: any;
}

interface e {
  message: string;
  errors?: { [key: string]: string[] };
  [key: string]: any;
}

export default _axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response;
  },
  function (error: AxiosError<e>) {
    // Do something with response error
    const errorData = error.response?.data;
    const errorStatus = error.response?.status;
    console.log(errorData);

    switch (errorStatus) {
      // Handle unauthorized access (token expired/invalid) - Primary case
      case 401:
        console.warn('401 Unauthorized: Token expired or invalid');
        eventEmitter.emit("enqueueSnackbar", {
          message: 'Session expired. Please log in again.',
          variant: "warning",
          autoHideDuration: 3000,
          preventDuplicate: true,
        });
        _AuthService.forceLogout('Token expired or invalid (401)');
        break;

      // Legacy logout code (keeping for backward compatibility)
      case 209:
        eventEmitter.emit("enqueueSnackbar", errorData?.message, {
          variant: "warning",
          autoHideDuration: 3000,
        });
        _AuthService.doLogout();
        eventEmitter.emit("setMe", undefined);
        eventEmitter.emit("router", "/auth/login");
        break;

      // Handle forbidden access
      case 403:
        console.warn('403 Forbidden: Access denied');
        eventEmitter.emit("enqueueSnackbar", {
          message: 'Access denied. Please contact support if this is unexpected.',
          variant: "error",
          autoHideDuration: 5000,
          preventDuplicate: true,
        });
        break;

      // Handle not found
      case 404:
        eventEmitter.emit("enqueueSnackbar", {
          message: errorData?.message || 'Resource not found',
          variant: "error",
          autoHideDuration: 3000,
          preventDuplicate: true,
        });
        break;

      // Handle rate limiting
      case 429:
        eventEmitter.emit("enqueueSnackbar", {
          message: 'Too many requests. Please wait before trying again.',
          variant: "warning",
          autoHideDuration: 5000,
          preventDuplicate: true,
        });
        break;

      // Custom business logic error
      case 141:
        eventEmitter.emit(
          "enqueueSnackbar",
          errorData?.message ?? "Unknown Error",
          {
            variant: "warning",
            autoHideDuration: 3000,
          }
        );
        break;

      // Handle validation errors
      case 400:
        console.log(
          error.config?.url === "https://api.moyasar.com/v1/payments"
        );
        if (error.config?.url === "https://api.moyasar.com/v1/payments") {
          const firstObjElment: keyof Error = Object.keys(
            errorData?.errors || ""
          )[0] as unknown as keyof Error;

          eventEmitter.emit("enqueueSnackbar", {
            message: errorData ? errorData[firstObjElment][0] : "Payment error",
            variant: "error",
            snack: {
              autoHideDuration: 3000,
              preventDuplicate: true,
            },
          });
        } else {
          eventEmitter.emit("enqueueSnackbar", {
            message: errorData?.message || 'Invalid request',
            snack: {
              variant: "error",
              autoHideDuration: 3000,
              preventDuplicate: true,
            },
          });
        }
        break;

      // Handle server errors
      case 500:
        eventEmitter.emit("enqueueSnackbar", {
          message: 'Server error occurred. Please try again later.',
          snack: {
            variant: "error",
            autoHideDuration: 5000,
            preventDuplicate: true,
          },
        });
        break;

      // Handle service unavailable
      case 503:
        eventEmitter.emit("enqueueSnackbar", {
          message: 'Service temporarily unavailable. Please try again later.',
          snack: {
            variant: "warning",
            autoHideDuration: 5000,
            preventDuplicate: true,
          },
        });
        break;

      // Handle unprocessable entity (validation errors)
      case 422:
        if (errorData?.errors) {
          Object.keys(errorData?.errors).map((key, index) => {
            errorData.errors![key].forEach((message) => {
              eventEmitter.emit("enqueueSnackbar", {
                message: message,
                variant: "error",
                autoHideDuration: 3000,
                preventDuplicate: true,
              });
            });
          });
        } else {
          eventEmitter.emit("enqueueSnackbar", {
            message: errorData?.message || 'Validation failed',
            variant: "error",
            autoHideDuration: 3000,
            preventDuplicate: true,
          });
        }
        break;

      default:
        // Only show error message for unexpected errors
        if (errorData?.message) {
          eventEmitter.emit("enqueueSnackbar", {
            message: errorData.message,
            variant: "error",
            autoHideDuration: 3000,
            preventDuplicate: true,
          });
        } else if (error.message && error.message !== 'Network Error') {
          eventEmitter.emit("enqueueSnackbar", {
            message: error.message,
            variant: "error", 
            autoHideDuration: 3000,
            preventDuplicate: true,
          });
        }
        break;
    }

    return Promise.reject(error);
  }
);

// export const HttpResponseInterceptor = (
//   router: NextRouter,
//   enqueueSnackbar: (
//     message: SnackbarMessage,
//     options?: OptionsObject | undefined
//   ) => SnackbarKey,
//   setMe: (me: undefined) => void
// ) => {

// };
