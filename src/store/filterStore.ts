import create from "zustand";
import { StudentCoursesFilters } from "interface/common";

interface FilterStore {
  // UI State
  drawerOpen: boolean;
  toggleDrawer: () => void;
  
  // Student Courses Filters
  filters: StudentCoursesFilters;
  setFilters: (filters: Partial<StudentCoursesFilters>) => void;
  resetFilters: () => void;
  
  // Pagination
  currentPage: number;
  setCurrentPage: (page: number) => void;
  
  // Legacy compatibility (can be removed later)
  initFilterParams: string;
  setInitFilterParams: (params: string) => void;
}

const initialFilters: StudentCoursesFilters = {
  category_id: undefined,
  mode: undefined,
  learning_structure: undefined,
  delivery_mode: undefined,
  min_price: undefined,
  max_price: undefined,
  min_rating: undefined,
  min_duration: undefined,
  max_duration: undefined,
  instructor_id: undefined,
  search: undefined,
};

export const filterStore = create<FilterStore>((set: any) => ({
  // UI State
  drawerOpen: false,
  toggleDrawer: () => set((state: any) => ({ drawerOpen: !state.drawerOpen })),
  
  // Student Courses Filters
  filters: initialFilters,
  setFilters: (newFilters: Partial<StudentCoursesFilters>) =>
    set((state: any) => ({
      filters: { ...state.filters, ...newFilters },
      currentPage: 1, // Reset to first page when filters change
    })),
  resetFilters: () =>
    set(() => ({
      filters: initialFilters,
      currentPage: 1,
    })),
  
  // Pagination
  currentPage: 1,
  setCurrentPage: (page: number) => set(() => ({ currentPage: page })),
  
  // Legacy compatibility
  initFilterParams: "",
  setInitFilterParams: (params: string) => set(() => ({ initFilterParams: params })),
}));
