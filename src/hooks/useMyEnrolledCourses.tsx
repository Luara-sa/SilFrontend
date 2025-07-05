import { useEffect, useState } from "react";
import { _CourseService } from "../services/course.service";
import { StudentCourse, StudentCoursesResponse } from "../interface/common";

interface UseMyEnrolledCoursesProps {
  page?: number;
  perPage?: number;
}

interface UseMyEnrolledCoursesReturn {
  courses: StudentCourse[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCourses: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  refetch: () => void;
  goToPage: (page: number) => void;
}

export const useMyEnrolledCourses = ({
  page = 1,
  perPage = 15,
}: UseMyEnrolledCoursesProps = {}): UseMyEnrolledCoursesReturn => {
  const [courses, setCourses] = useState<StudentCourse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(page);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCourses: 0,
    hasNext: false,
    hasPrevious: false,
  });

  const fetchMyEnrolledCourses = async (pageNum: number = currentPage) => {
    setLoading(true);
    setError(null);

    try {
      const response: StudentCoursesResponse =
        await _CourseService.getMyEnrolledCourses(pageNum, perPage);

      if (response.status && response.data) {
        setCourses(response.data.content);
        setPagination({
          currentPage: response.data.pagination.current_page,
          totalPages: response.data.pagination.last_page,
          totalCourses: response.data.pagination.total,
          hasNext: response.data.pagination.has_next,
          hasPrevious: response.data.pagination.current_page > 1,
        });
        setCurrentPage(pageNum);
      } else {
        throw new Error(
          response.message || "Failed to fetch my enrolled courses"
        );
      }
    } catch (err: any) {
      setError(
        err.message || "An error occurred while fetching my enrolled courses"
      );
      setCourses([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalCourses: 0,
        hasNext: false,
        hasPrevious: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchMyEnrolledCourses(currentPage);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchMyEnrolledCourses(page);
    }
  };

  useEffect(() => {
    fetchMyEnrolledCourses(page);
  }, [page, perPage]);

  return {
    courses,
    loading,
    error,
    pagination,
    refetch,
    goToPage,
  };
};
