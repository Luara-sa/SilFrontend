import { useCallback } from "react";
import { _CategoriesService } from "services/categories.service";
import { categoryStore } from "store/categoryStore";

export const useStudentCategories = () => {
  const storeData = categoryStore((state) => ({
    studentCategories: Array.isArray(state.studentCategories)
      ? state.studentCategories
      : [],
    setStudentCategories: state.setStudentCategories,
    studentCategoriesLoading: Boolean(state.studentCategoriesLoading),
    setStudentCategoriesLoading: state.setStudentCategoriesLoading,
  }));

  const {
    studentCategories,
    setStudentCategories,
    studentCategoriesLoading,
    setStudentCategoriesLoading,
  } = storeData;

  const fetchStudentCategories = useCallback(async () => {
    try {
      setStudentCategoriesLoading(true);
      const response = await _CategoriesService.getAllStudentCategories();

      if (response.status && response.data?.content) {
        setStudentCategories(response.data.content);
        return response.data.content;
      } else {
        console.error("Failed to fetch student categories:", response.message);
        setStudentCategories([]);
        return [];
      }
    } catch (error) {
      console.error("Error fetching student categories:", error);
      setStudentCategories([]);
      return [];
    } finally {
      setStudentCategoriesLoading(false);
    }
  }, [setStudentCategories, setStudentCategoriesLoading]);

  const refreshStudentCategories = useCallback(() => {
    return fetchStudentCategories();
  }, [fetchStudentCategories]);

  return {
    studentCategories,
    studentCategoriesLoading,
    fetchStudentCategories,
    refreshStudentCategories,
  };
};
