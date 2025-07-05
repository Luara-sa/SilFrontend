import axios, { AxiosError } from "axios";
import { _axios } from "interceptors/http-config";
import { _AuthService } from "services/auth.service";

import { eventEmitter } from "services/eventEmitter";

interface Error {
  error_code: number;
  error: string;
  message: string;
  // errors?: { [key: string]: string[] };
  errors?: any;
}

export default _axios.interceptors.response.use(
  function (response) {
    // Do something with response data

    return response;
  },
  function (error: AxiosError<Error>) {
    // Do something with response error

    const errorData = error.response?.data;
    const errorStatus = error.response?.status;
    console.log(errorData);

    switch (errorStatus) {
      case 209:
        eventEmitter.emit("enqueueSnackbar", errorData?.message, {
          variant: "warning",
          autoHideDuration: 3000,
        });
        _AuthService.doLogout();
        eventEmitter.emit("setMe", undefined);
        eventEmitter.emit("router", "/auth/login");
        break;

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

      case 400:
        console.log(
          error.config?.url === "https://api.moyasar.com/v1/payments"
        );
        if (error.config?.url === "https://api.moyasar.com/v1/payments") {
          const firstObjElment: keyof Error = Object.keys(
            errorData?.errors
          )[0] as unknown as keyof Error;

          eventEmitter.emit("enqueueSnackbar", {
            message: errorData ? errorData[firstObjElment][0] : "Test error",
            variant: "error",
            snack: {
              autoHideDuration: 3000,

              preventDuplicate: true,
            },
          });
        } else
          eventEmitter.emit("enqueueSnackbar", {
            message: errorData?.message,
            snack: {
              variant: "error",
              autoHideDuration: 3000,

              preventDuplicate: true,
            },
          });
        break;

      case 500:
        eventEmitter.emit("enqueueSnackbar", {
          message: errorData?.message,
          snack: {
            variant: "error",
            autoHideDuration: 3000,

            preventDuplicate: true,
          },
        });
        break;

      case 422:
        // console.log(errorData?);
        errorData?.errors
          ? Object.keys(errorData?.errors).map((key, index) => {
              // console.log(errorData.errors[key][0]);
              eventEmitter.emit("enqueueSnackbar", {
                message: errorData?.errors[key][0],
                variant: "error",
                autoHideDuration: 3000,

                preventDuplicate: true,
              });
            })
          : eventEmitter.emit("enqueueSnackbar", {
              message: errorData?.message,
              variant: "error",
              autoHideDuration: 3000,

              preventDuplicate: true,
            });
        break;

      // case 500:
      //   // _NotistackService.addNotistack(
      //   //   "error",
      //   //   "Server Error - call the administration"
      //   // );
      //   break;

      // case 403:
      //   // _NotistackService.addNotistack("info", "You don't have the permission");
      //   //  navigate("/forbidden");
      //   break;

      // case 400:
      //   // eslint-disable-next-line no-lone-blocks
      //   {
      //     // if (
      //     //   error?.response?.data?.message === "Invalid ObjectId" &&
      //     //   error.config.method === "get"
      //     // ) {
      //     //   navigate("/dashboard/not-found");
      //     // } else {
      //     //   _NotistackService.addNotistack(
      //     //     "info",
      //     //     `${error?.response?.data?.message ??
      //     //     error?.response?.data?.errCode ??
      //     //     "The given data is invalid"
      //     //     }`
      //     //   );
      //     // }
      //   }
      //   break;

      default:
        eventEmitter.emit(
          "enqueueSnackbar",
          errorData?.message ?? "Unknown Error",
          {
            variant: "error",
            autoHideDuration: 3000,
          }
        );
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
