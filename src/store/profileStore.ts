import {
  DelegateCourse,
  MyCertificates,
  MyCourse,
  MyOrders,
  MyOrdersInstallments,
  MyTest,
  MyPaths,
  StudentOrdersForCompany,
  UsersCompany,
  MyDashboard,
} from "modules/profile/interfaces/profile-interfaces";
import { Dashboard } from "modules/profile/pages";
import create from "zustand";

interface ProfileStoreInterface {
  myData:
    | {
        courses: MyCourse[];
        paths: MyPaths[];
        tests: MyTest[];
        certificates: MyCertificates[];
        orders: MyOrders[];
        placementTest: MyTest[];
        orderCourses: MyOrdersInstallments[];
        dashboard: MyDashboard[];
      }
    | undefined;

  setData: (
    data: any,
    key:
      | "courses"
      | "paths"
      | "tests"
      | "certificates"
      | "orders"
      | "placementTest"
      | "orderCourses"
      | "dashboard"
  ) => void;
  clearData: () => void;

  isEdit: boolean;
  setIsEdit: (res: boolean) => void;
  updatedImage?: any;
  setUpdatedImage: (res: any) => void;

  company?: StudentOrdersForCompany[];
  setCompany: (res: StudentOrdersForCompany[]) => void;

  usersCompany?: UsersCompany[];
  setUserCompany: (res: any) => void;
  studentOrdersForCompany?: StudentOrdersForCompany[];
  setStudentOrdersForCompany?: (res: StudentOrdersForCompany[]) => void;

  companyStudentCourses?: any;
  setCompanyStudentCourses: (data: any) => void;

  delegate?:
    | {
        score: any;
        table: DelegateCourse[];
      }
    | undefined;
  setDelegate: (data: any, key: "score" | "table") => any;
}

export const profileStore = create<ProfileStoreInterface>((set: any) => ({
  myData: undefined,
  setData: (data, key) =>
    set((state: ProfileStoreInterface) => ({
      myData: { ...state.myData, [key]: data },
    })),
  clearData: () => set(() => ({ myData: undefined })),

  isEdit: false,
  setIsEdit: (res) => set(() => ({ isEdit: res })),
  setUpdatedImage: (res) => set(() => ({ updatedImage: res })),

  setCompany: (res) => set(() => ({ company: res })),
  setCompanyStudentCourses: (res) =>
    set(() => ({ companyStudentCourses: res })),

  setUserCompany: (res) => set(() => ({ usersCompany: res })),

  setDelegate: (data, key) =>
    set((state: ProfileStoreInterface) => ({
      delegate: { ...state.delegate, [key]: data },
    })),
}));
