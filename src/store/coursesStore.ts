import create from "zustand";
import { Course, IndexObj, IndexObj2, Path } from "interface/common";

export type SelectValue = "courses" | "paths";

interface CoursesInterface {
  courses?: IndexObj2<{
    data: Course[];
    current_page: number;
    last_page: number;
    limit: number;
    total: number;
  }> | null;
  setCourses: (res: any) => void;

  selectValue: SelectValue;
  setSelectedValue: (res: SelectValue) => void;

  paths?: IndexObj<Path>;
  setPaths: (res: IndexObj<Path>) => void;
}

export const coursesStore = create<CoursesInterface>((set: any) => ({
  setCourses: (res) => set(() => ({ courses: res })),

  selectValue: "courses",
  setSelectedValue: (res) => set(() => ({ selectValue: res })),

  setPaths: (res) => set(() => ({ paths: res })),
}));
