import { _axios as Axios } from "./http-config";
import { _AuthService } from "services/auth.service";

export const HttpRequestInterceptor = () => {
  Axios.interceptors.request.use(
    function (request) {
      // Do something before request is sent
      const token = _AuthService.getJwtToken();
      // console.log(token);
      if (request.headers) {
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
