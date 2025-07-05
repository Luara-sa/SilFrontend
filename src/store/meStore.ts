import create from "zustand";
import { InfoSystem, RoleType, User } from "interface/common";

export interface IMe {
  role: RoleType[];
  user: User;
  info_system: InfoSystem;
}

interface MeStoreInterface {
  me: IMe | undefined;
  isLogged: boolean;
  setMe: (res: IMe | any) => void;
  clearMe: () => void;
  setIsLogged: (res: boolean) => void;
}

export const meStore = create<MeStoreInterface>((set: any) => ({
  me: undefined,
  isLogged: false,
  setIsLogged: (res: boolean) => set(() => ({ isLogged: res })),
  setMe: (res) => set(() => ({ me: res })),
  clearMe: () => set(() => ({ me: undefined })),
}));
