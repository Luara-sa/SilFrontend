import { useEffect, useState } from "react";
import { _CourseService } from "../services/course.service";
import { StudentCourse, StudentCoursesResponse } from "../interface/common";

interface UseMyEnrolledCoursesProps {
  page?: number;
  perPage?: number;
  skip?: boolean; // Skip fetching if true (for unauthenticated users)
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
  skip = false,
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
    // Skip fetching if skip flag is true (user not authenticated)
    if (skip) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response: StudentCoursesResponse =
        await _CourseService.getMyEnrolledCourses(pageNum, perPage);

      // Check if we have data.content regardless of status field
      if (response.data?.content && Array.isArray(response.data.content)) {
        setCourses(response.data.content);
        if (response.data.pagination) {
          setPagination({
            currentPage: response.data.pagination.current_page,
            totalPages: response.data.pagination.last_page,
            totalCourses: response.data.pagination.total,
            hasNext: response.data.pagination.has_next,
            hasPrevious: response.data.pagination.current_page > 1,
          });
        }
        setCurrentPage(pageNum);
      } else {
        setError(response.message || "Failed to fetch my enrolled courses");
        setCourses([]);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalCourses: 0,
          hasNext: false,
          hasPrevious: false,
        });
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
    if (!skip) {
      fetchMyEnrolledCourses(currentPage);
    }
  };

  const goToPage = (page: number) => {
    if (!skip && page >= 1 && page <= pagination.totalPages) {
      fetchMyEnrolledCourses(page);
    }
  };

  useEffect(() => {
    if (!skip) {
      fetchMyEnrolledCourses(page);
    }
  }, [page, perPage, skip]);

  return {
    courses,
    loading,
    error,
    pagination,
    refetch,
    goToPage,
  };
};
