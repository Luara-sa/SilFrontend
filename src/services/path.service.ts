import { AxiosResponse } from "axios";
import { _axios } from "interceptors/http-config";
import { IndexObj, Path, RootObj } from "interface/common";

class PathService {
  private static _instance: PathService;
  //   private readonly URL = "admin";

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  getPaths(data?: any): Promise<RootObj<IndexObj<Path>>> {
    return _axios.post<any>(`getPaths`, data).then((res) => res.data);
  }

  getCoursesPath(id: string): Promise<RootObj<Path>> {
    return _axios.get<any>(`getCoursesPath/${id}`).then((res) => res.data);
  }
  createEnrollPath(id: string): Promise<RootObj<any>> {
    return _axios.get<any>(`createEnrollPath/${id}`).then((res) => res.data);
  }
  deleteEnrollPath(id: string): Promise<RootObj<any>> {
    return _axios.delete<any>(`deleteEnrollPath/${id}`).then((res) => res.data);
  }
}

export const _PathService = PathService.Instance;
