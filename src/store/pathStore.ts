import { Path } from "interface/common";
import create from "zustand";

interface PathStoreInterface {
  paths?: Path[];
  setPaths: (res: any) => void;

  path?: Path;
  setPath: (res: Path) => void;

  clear: () => void;
}

export const pathStore = create<PathStoreInterface>((set: any) => ({
  setPaths: (res: Path[]) => set(() => ({ paths: res })),
  clear: () => set(() => ({ paths: undefined })),

  setPath: (res) => set(() => ({ path: res })),
}));
