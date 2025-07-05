import create from "zustand";

interface rateStoreInterface {
  step?: 1 | 2;
  setStep: (res: any) => void;

  rateSelected?: number;
  setRateSelected: (res: any) => void;

  rateInput?: string;
  setRateInput: (res: any) => void;
}

export const rateStore = create<rateStoreInterface>((set: any) => ({
  step: 1,
  setStep: (res: any) => set(() => ({ step: res })),

  setRateSelected: (res: any) => set(() => ({ rateSelected: res })),

  setRateInput: (res) => set(() => ({ rateInput: res })),
}));
