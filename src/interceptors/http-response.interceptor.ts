import { _axios as Axios } from "./http-config";
import { _AuthService } from "services/auth.service";

interface HttpResponseInterceptorProps {
  navigate?: any;
  enqueueSnackbar?: any;
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
        case 402:
          _AuthService.doLogout();
          // navigate("/");
          break;

        case 405:
          Object.keys(error.response.data.message).map((key) =>
            enqueueSnackbar(error.response.data.message[key], {
              variant: "error",
              autoHideDuration: 3000,
            })
          );
          break;

        default:
          // enqueueSnackbar(error.response.data.message, {
          //   variant: "error",
          //   autoHideDuration: 3000,
          // });
          break;
      }

      return Promise.reject(error);
    }
  );
};
