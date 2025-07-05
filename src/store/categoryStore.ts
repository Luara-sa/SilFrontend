import create from "zustand";
import { Category, StudentCategory } from "interface/common";

interface CategoryInterface {
  categories?: Category[];
  setCategories: (res: Category[]) => void;
  // Student categories
  studentCategories: StudentCategory[];
  setStudentCategories: (res: StudentCategory[]) => void;
  studentCategoriesLoading: boolean;
  setStudentCategoriesLoading: (loading: boolean) => void;
}

export const categoryStore = create<CategoryInterface>((set: any) => ({
  setCategories: (res) => set(() => ({ categories: res })),
  // Student categories
  studentCategories: [],
  setStudentCategories: (res) => set(() => ({ studentCategories: Array.isArray(res) ? res : [] })),
  studentCategoriesLoading: false,
  setStudentCategoriesLoading: (loading) => set(() => ({ studentCategoriesLoading: Boolean(loading) })),
}));
