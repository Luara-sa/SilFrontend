import { useCallback, useState, useEffect } from "react";
import { _CourseService } from "services/course.service";
import { StudentCourse, Course, StudentCoursesFilters } from "interface/common";
import { mapStudentCoursesToCoursesLegacy } from "helper/mapStudentCourse";

interface UseStudentCoursesReturn {
  studentCourses: StudentCourse[];
  legacyCourses: Course[]; // Mapped to existing Course interface
  loading: boolean;
  error: string | null;
  pagination: {
    current_page: number;
    last_page: number;
    total: number;
    has_next: boolean;
  } | null;
  fetchStudentCourses: (
    page?: number,
    perPage?: number,
    filters?: StudentCoursesFilters
  ) => Promise<void>;
  refreshStudentCourses: () => Promise<void>;
  resetCourses: () => void;
}

// Frontend filtering functions
const applyFilters = (
  courses: StudentCourse[],
  filters: StudentCoursesFilters
): StudentCourse[] => {
  return courses.filter((course) => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const courseName = course.name.toLowerCase();
      const categoryName = course.category?.name?.toLowerCase() || "";
      const instructorName = `${course.instructor?.first_name || ""} ${
        course.instructor?.last_name || ""
      }`.toLowerCase();

      if (
        !courseName.includes(searchTerm) &&
        !categoryName.includes(searchTerm) &&
        !instructorName.includes(searchTerm)
      ) {
        return false;
      }
    }

    // Category filter
    if (filters.category_id && course.category?.id !== filters.category_id) {
      return false;
    }

    // Mode filter
    if (filters.mode && course.mode !== filters.mode) {
      return false;
    }

    // Learning structure filter
    if (
      filters.learning_structure &&
      course.learning_structure !== filters.learning_structure
    ) {
      return false;
    }

    // Delivery mode filter
    if (
      filters.delivery_mode &&
      course.delivery_mode !== filters.delivery_mode
    ) {
      return false;
    }

    // Price filters
    const price = course.course_price?.price
      ? parseFloat(course.course_price.price)
      : 0;
    if (filters.min_price !== undefined && price < filters.min_price) {
      return false;
    }
    if (filters.max_price !== undefined && price > filters.max_price) {
      return false;
    }

    // Duration filters
    if (
      filters.min_duration !== undefined &&
      course.duration < filters.min_duration
    ) {
      return false;
    }
    if (
      filters.max_duration !== undefined &&
      course.duration > filters.max_duration
    ) {
      return false;
    }

    // Rating filter
    if (
      filters.min_rating !== undefined &&
      course.reviews.average_rating < filters.min_rating
    ) {
      return false;
    }

    // Instructor filter
    if (
      filters.instructor_id &&
      course.instructor?.id !== filters.instructor_id
    ) {
      return false;
    }

    return true;
  });
};

const paginateResults = (
  courses: StudentCourse[],
  page: number,
  perPage: number
) => {
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedCourses = courses.slice(startIndex, endIndex);

  const totalPages = Math.ceil(courses.length / perPage);

  return {
    courses: paginatedCourses,
    pagination: {
      current_page: page,
      last_page: totalPages,
      total: courses.length,
      has_next: page < totalPages,
    },
  };
};

export const useStudentCourses = (): UseStudentCoursesReturn => {
  const [allCourses, setAllCourses] = useState<StudentCourse[]>([]);
  const [studentCourses, setStudentCourses] = useState<StudentCourse[]>([]);
  const [legacyCourses, setLegacyCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    current_page: number;
    last_page: number;
    total: number;
    has_next: boolean;
  } | null>(null);

  // Store current params for refresh functionality
  const [currentFilters, setCurrentFilters] = useState<StudentCoursesFilters>(
    {}
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPerPage, setCurrentPerPage] = useState(15);

  // Fetch all courses from API once
  const fetchAllCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await _CourseService.getAllStudentCourses();

      if (response.status && response.data?.content) {
        setAllCourses(response.data.content);
        return response.data.content;
      } else {
        setError(response.message || "Failed to fetch courses");
        setAllCourses([]);
        return [];
      }
    } catch (err) {
      setError("Failed to fetch courses. Please check your connection.");
      setAllCourses([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Apply filters and pagination on frontend
  const fetchStudentCourses = useCallback(
    async (
      page: number = 1,
      perPage: number = 15,
      filters: StudentCoursesFilters = {}
    ) => {
      try {
        setCurrentFilters(filters);
        setCurrentPage(page);
        setCurrentPerPage(perPage);

        // If we don't have all courses yet, fetch them first
        let coursesToFilter = allCourses;
        if (coursesToFilter.length === 0) {
          coursesToFilter = await fetchAllCourses();
        }

        // Apply filters on frontend
        const filteredCourses = applyFilters(coursesToFilter, filters);

        // Apply pagination on filtered results
        const { courses: paginatedCourses, pagination: paginationInfo } =
          paginateResults(filteredCourses, page, perPage);

        setStudentCourses(paginatedCourses);

        // Map to legacy Course structure for existing components
        const mappedCourses =
          mapStudentCoursesToCoursesLegacy(paginatedCourses);
        setLegacyCourses(mappedCourses);

        // Set pagination info
        setPagination(paginationInfo);
      } catch (err) {
        setError("Failed to process courses. Please try again.");
        setStudentCourses([]);
        setLegacyCourses([]);
        setPagination(null);
      }
    },
    [allCourses, fetchAllCourses]
  );

  const refreshStudentCourses = useCallback(async () => {
    // Force refresh all courses from API
    setAllCourses([]);
    await fetchStudentCourses(currentPage, currentPerPage, currentFilters);
  }, [fetchStudentCourses, currentPage, currentPerPage, currentFilters]);

  const resetCourses = useCallback(() => {
    setAllCourses([]);
    setStudentCourses([]);
    setLegacyCourses([]);
    setPagination(null);
    setError(null);
    setCurrentFilters({});
    setCurrentPage(1);
    setCurrentPerPage(15);
  }, []);

  return {
    studentCourses,
    legacyCourses,
    loading,
    error,
    pagination,
    fetchStudentCourses,
    refreshStudentCourses,
    resetCourses,
  };
};

// Hook for student course enrollment details
export const useStudentCourseDetails = (courseId: string | number | null) => {
  const [courseDetails, setCourseDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;

    const fetchCourseDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await _CourseService.getStudentCourseDetails(courseId);

        if (response.status) {
          setCourseDetails(response.data);
        } else {
          setError(response.message || "Failed to fetch course details");
        }
      } catch (err: any) {
        setError(
          err.message || "An error occurred while fetching course details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  return {
    courseDetails,
    loading,
    error,
    refetch: () => {
      if (courseId) {
        const fetchCourseDetails = async () => {
          setLoading(true);
          setError(null);

          try {
            const response = await _CourseService.getStudentCourseDetails(
              courseId
            );

            if (response.status) {
              setCourseDetails(response.data);
            } else {
              setError(response.message || "Failed to fetch course details");
            }
          } catch (err: any) {
            setError(
              err.message || "An error occurred while fetching course details"
            );
          } finally {
            setLoading(false);
          }
        };

        fetchCourseDetails();
      }
    },
  };
};

// Hook for detailed student course information
export const useDetailedStudentCourse = (courseId: string | number | null) => {
  const [courseData, setCourseData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;

    const fetchCourseData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await _CourseService.getDetailedStudentCourse(
          courseId
        );

        if (response.status) {
          setCourseData(response.data);
        } else {
          setError(response.message || "Failed to fetch course details");
        }
      } catch (err: any) {
        setError(
          err.message || "An error occurred while fetching course details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  return {
    courseData,
    loading,
    error,
    refetch: () => {
      if (courseId) {
        const fetchCourseData = async () => {
          setLoading(true);
          setError(null);

          try {
            const response = await _CourseService.getDetailedStudentCourse(
              courseId
            );

            if (response.status) {
              setCourseData(response.data);
            } else {
              setError(response.message || "Failed to fetch course details");
            }
          } catch (err: any) {
            setError(
              err.message || "An error occurred while fetching course details"
            );
          } finally {
            setLoading(false);
          }
        };

        fetchCourseData();
      }
    },
  };
};

// Hook for course enrollment
export const useCourseEnrollment = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const enrollInCourse = async (
    courseId: number,
    type?: string,
    courseGroupId?: number
  ) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const enrollmentData = {
        id: courseId,
        ...(type && { type }),
        ...(courseGroupId && { course_group_id: courseGroupId }),
      };

      const response = await _CourseService.enrollInCourse(enrollmentData);

      if (response.status) {
        setSuccess(true);
        return response;
      } else {
        setError(response.message || "Failed to enroll in course");
        return null;
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "An error occurred during enrollment"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const resetEnrollment = () => {
    setError(null);
    setSuccess(false);
    setLoading(false);
  };

  return {
    enrollInCourse,
    loading,
    error,
    success,
    resetEnrollment,
  };
};

// Hook for checking course enrollment status
export const useCourseEnrollmentStatus = (courseId: string | number | null) => {
  const [enrollmentStatus, setEnrollmentStatus] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEnrollmentStatus = useCallback(async () => {
    if (!courseId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await _CourseService.checkCourseEnrollmentStatus(
        courseId
      );

      if (response.status) {
        setEnrollmentStatus(response.data);
      } else {
        setError(response.message || "Failed to check enrollment status");
      }
    } catch (err: any) {
      setError(
        err.message || "An error occurred while checking enrollment status"
      );
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchEnrollmentStatus();
  }, [fetchEnrollmentStatus]);

  const refetch = useCallback(() => {
    fetchEnrollmentStatus();
  }, [fetchEnrollmentStatus]);

  return {
    enrollmentStatus,
    loading,
    error,
    refetch,
  };
};

// Hook for course curriculum
export const useCourseCurriculum = (courseId: string | number | null) => {
  const [curriculum, setCurriculum] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isNotPurchased, setIsNotPurchased] = useState<boolean>(false);

  const fetchCurriculum = useCallback(async () => {
    if (!courseId) return;

    setLoading(true);
    setError(null);
    setIsNotPurchased(false);

    try {
      const response = await _CourseService.getCourseCurriculum(courseId);

      if (response.status && response.data) {
        setCurriculum(response.data);
      } else {
        // Check if it's the "not purchased" error
        if (response.message === "You have not purchased this course.") {
          setIsNotPurchased(true);
          setError(null);
        } else {
          setError(response.message || "Failed to fetch curriculum");
        }
      }
    } catch (err: any) {
      // Handle HTTP errors (like 403) and check the response message
      if (
        err.response?.data?.message === "You have not purchased this course."
      ) {
        setIsNotPurchased(true);
        setError(null);
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            "An error occurred while fetching curriculum"
        );
      }
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCurriculum();
  }, [fetchCurriculum]);

  const refetch = useCallback(() => {
    fetchCurriculum();
  }, [fetchCurriculum]);

  return {
    curriculum,
    loading,
    error,
    isNotPurchased,
    refetch,
  };
};
