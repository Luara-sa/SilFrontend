import { Course, IPaymentMethodActive } from "interface/common";
import create from "zustand";

interface CheckoutInterface {
  course?: Course;
  setCourse: (res: Course) => void;

  isInstallment?: boolean;
  setIsInstallment: (res: boolean) => void;

  dataForApi: any | undefined;
  setDataForApi: (res: any) => void;
  clearDataForApi: () => void;

  dialogOpen: boolean;
  setDialog: (res: boolean) => void;

  paymentMethods?: IPaymentMethodActive[];
  setPaymentMethods: (res: IPaymentMethodActive[]) => void;

  selectedMethod?: string;
  setSelectedMethod: (res: string) => void;
}

export const checkoutStore = create<CheckoutInterface>((set: any) => ({
  setCourse: (res) => set(() => ({ course: res })),

  setIsInstallment: (res) => set(() => ({ isInstallment: res })),

  dataForApi: undefined,
  setDataForApi: (res: any) => set(() => ({ dataForApi: res })),
  clearDataForApi: () => set(() => ({ dataForApi: undefined })),

  dialogOpen: false,
  setDialog: (res) => set(() => ({ dialogOpen: res })),

  setPaymentMethods: (res) => set(() => ({ paymentMethods: res })),

  setSelectedMethod: (res) => set(() => ({ selectedMethod: res })),
}));
