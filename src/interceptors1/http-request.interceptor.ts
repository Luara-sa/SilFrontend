import axios from "axios";
import { _axios } from "interceptors/http-config";
import { _AuthService } from "services/auth.service";

// export var cancelTokenSource = axios.CancelToken.source();

export default _axios.interceptors.request.use(
  function (request: any) {
    // Do something before request is sent
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
