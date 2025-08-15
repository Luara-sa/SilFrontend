import { Result } from "./../interface/test";
import axios, { AxiosResponse } from "axios";
import { _axios } from "interceptors/http-config";
import { Course, IndexObj, Path, IndexObj2, RootObj, StudentCoursesResponse, StudentCourseDetailsResponse, DetailedStudentCourseResponse, CourseEnrollmentRequest, CourseEnrollmentResponse, CourseEnrollmentStatusResponse, CourseCurriculumResponse, StudentCoursesFilters } from "interface/common";

class CourseService {
  private static _instance: CourseService;
  //   private readonly URL = "admin";

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  getAll(data?: any): Promise<
    RootObj<
      IndexObj2<{
        data: Course[];
        current_page: number;
        last_page: number;
        limit: number;
        total: number;
      }>
    >
  > {
    return _axios.post<any>(`getCourses`, data).then((res) => res.data);
  }



  // Updated method for student courses API - fetch all courses (no backend filtering)
  getStudentCourses(page: number = 1, perPage: number = 15): Promise<StudentCoursesResponse> {
    const url = `student/courses?page=${page}&per_page=${perPage}`;
    
    return _axios.get<any>(url).then((res) => {
      // The axios response.data should already be the structured response
      return res.data;
    }).catch((error) => {
      // Return error in expected format
      return {
        status: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch courses',
        data: {
          content: [],
          pagination: {
            current_page: 1,
            from: 0,
            last_page: 1,
            per_page: 15,
            to: 0,
            total: 0,
            count: 0,
            has_next: false,
            next_page_url: null,
            previous_page_url: null,
            pagination_name: 'page'
          }
        }
      };
    });
  }

  // Method to fetch all courses for frontend filtering (legacy)
  getAllStudentCourses(): Promise<StudentCoursesResponse> {
    return _axios.get<any>('student/courses?per_page=1000').then((res) => {
      // The axios response.data should already be the structured response
      return res.data;
    }).catch((error) => {
      // Return error in expected format
      return {
        status: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch courses',
        data: {
          content: [],
          pagination: {
            current_page: 1,
            from: 0,
            last_page: 1,
            per_page: 1000,
            to: 0,
            total: 0,
            count: 0,
            has_next: false,
            next_page_url: null,
            previous_page_url: null,
            pagination_name: 'page'
          }
        }
      };
    });
  }

  // Method to fetch courses with comprehensive backend filtering
  getStudentCoursesWithFilters(
    page: number = 1,
    perPage: number = 15,
    filters?: StudentCoursesFilters
  ): Promise<StudentCoursesResponse> {
    // Build query parameters based on filters
    const queryParams = new URLSearchParams();
    
    // Basic pagination
    queryParams.append('page', page.toString());
    queryParams.append('per_page', perPage.toString());
    
    if (filters) {
      // Search filter
      if (filters.search) {
        queryParams.append('filters[search]', filters.search);
      }
      
      // Category filter
      if (filters.category_id) {
        queryParams.append('filters[category_id]', filters.category_id.toString());
      }
      
      // Target audience filter
      if (filters.target_audience_id) {
        queryParams.append('filters[target_audience_id]', filters.target_audience_id.toString());
      }
      
      // Free/Paid filters
      if (filters.is_free !== undefined) {
        queryParams.append('filters[is_free]', filters.is_free ? '1' : '0');
      }
      
      if (filters.is_paid !== undefined) {
        queryParams.append('filters[is_paid]', filters.is_paid ? '1' : '0');
      }
      
      // Price range filters
      if (filters.price?.min !== undefined) {
        queryParams.append('filters[price][min]', filters.price.min.toString());
      }
      
      if (filters.price?.max !== undefined) {
        queryParams.append('filters[price][max]', filters.price.max.toString());
      }
      
      // Legacy price filters (fallback)
      if (filters.min_price !== undefined && !filters.price?.min) {
        queryParams.append('filters[price][min]', filters.min_price.toString());
      }
      
      if (filters.max_price !== undefined && !filters.price?.max) {
        queryParams.append('filters[price][max]', filters.max_price.toString());
      }
      
      // Rating filter
      if (filters.rating !== undefined) {
        queryParams.append('filters[rating]', filters.rating.toString());
      }
      
      // Duration range filters
      if (filters.duration?.min !== undefined) {
        queryParams.append('filters[duration][min]', filters.duration.min.toString());
      }
      
      if (filters.duration?.max !== undefined) {
        queryParams.append('filters[duration][max]', filters.duration.max.toString());
      }
      
      // Legacy duration filters (fallback)
      if (filters.min_duration !== undefined && !filters.duration?.min) {
        queryParams.append('filters[duration][min]', filters.min_duration.toString());
      }
      
      if (filters.max_duration !== undefined && !filters.duration?.max) {
        queryParams.append('filters[duration][max]', filters.max_duration.toString());
      }
      
      // Level filter
      if (filters.level_id !== undefined) {
        queryParams.append('filters[level_id]', filters.level_id.toString());
      }
      
      // Date-based filters
      if (filters.created_this_week) {
        queryParams.append('filters[created_this_week]', '1');
      }
      
      if (filters.created_this_month) {
        queryParams.append('filters[created_this_month]', '1');
      }
      
      if (filters.created_this_year) {
        queryParams.append('filters[created_this_year]', '1');
      }
      
      // Additional filters that might be useful
      if (filters.mode) {
        queryParams.append('filters[mode]', filters.mode);
      }
      
      if (filters.learning_structure) {
        queryParams.append('filters[learning_structure]', filters.learning_structure);
      }
      
      if (filters.delivery_mode) {
        queryParams.append('filters[delivery_mode]', filters.delivery_mode);
      }
      
      if (filters.instructor_id) {
        queryParams.append('filters[instructor_id]', filters.instructor_id.toString());
      }
      
      if (filters.min_rating !== undefined) {
        queryParams.append('filters[min_rating]', filters.min_rating.toString());
      }
    }
    
    const url = `student/courses?${queryParams.toString()}`;
    
    return _axios.get<any>(url).then((res) => {
      return res.data;
    }).catch((error) => {
      // Return error in expected format
      return {
        status: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch courses',
        data: {
          content: [],
          pagination: {
            current_page: page,
            from: 0,
            last_page: 1,
            per_page: perPage,
            to: 0,
            total: 0,
            count: 0,
            has_next: false,
            next_page_url: null,
            previous_page_url: null,
            pagination_name: 'page'
          }
        }
      };
    });
  }

  // Method to get student course details
  getStudentCourseDetails(id: string | number): Promise<StudentCourseDetailsResponse> {
    const url = `student/courses/${id}/details`;
    
    return _axios.get<StudentCourseDetailsResponse>(url).then((res) => {
      return res.data;
    }).catch((error) => {
      throw error;
    });
  }

  // Method to get detailed student course information
  getDetailedStudentCourse(id: string | number): Promise<DetailedStudentCourseResponse> {
    const url = `student/courses/${id}`;
    
    return _axios.get<DetailedStudentCourseResponse>(url).then((res) => {
      return res.data;
    }).catch((error) => {
      throw error;
    });
  }

  // Method to enroll in a course
  enrollInCourse(data: CourseEnrollmentRequest): Promise<CourseEnrollmentResponse> {
    const url = `student/enrolled`;
    
    return _axios.post<CourseEnrollmentResponse>(url, data).then((res) => {
      return res.data;
    }).catch((error) => {
      throw error;
    });
  }

  // Method to check if user is enrolled in a course
  checkCourseEnrollmentStatus(id: string | number): Promise<CourseEnrollmentStatusResponse> {
    const url = `student/courses/${id}/details`;
    
    return _axios.get<CourseEnrollmentStatusResponse>(url).then((res) => {
      return res.data;
    }).catch((error) => {
      throw error;
    });
  }

  // Method to get course curriculum
  getCourseCurriculum(id: string | number): Promise<CourseCurriculumResponse> {
    const url = `student/courses/${id}/curriculum`;
    
    return _axios.get<CourseCurriculumResponse>(url).then((res) => {
      return res.data;
    }).catch((error) => {
      throw error;
    });
  }

  // NEW: Method to get video topic content
  getVideoTopicContent(courseId: string | number, chapterId: string | number, topicId: string | number): Promise<any> {
    const url = `student/courses/${courseId}/curriculum/video/chapters/${chapterId}/topics/${topicId}`;
    
    return _axios.get<any>(url).then((res) => {
      return res.data;
    }).catch((error) => {
      throw error;
    });
  }

  // NEW: Method to get reading topic content
  getReadingTopicContent(courseId: string | number, chapterId: string | number, topicId: string | number): Promise<any> {
    const url = `student/courses/${courseId}/curriculum/reading/chapters/${chapterId}/topics/${topicId}`;
    
    return _axios.get<any>(url).then((res) => {
      return res.data;
    }).catch((error) => {
      throw error;
    });
  }

  // NEW: Generic method to get topic content based on type
  getTopicContent(courseId: string | number, chapterId: string | number, topicId: string | number, topicType: 'video' | 'reading'): Promise<any> {
    if (topicType === 'video') {
      return this.getVideoTopicContent(courseId, chapterId, topicId);
    } else if (topicType === 'reading') {
      return this.getReadingTopicContent(courseId, chapterId, topicId);
    } else {
      throw new Error(`Unsupported topic type: ${topicType}`);
    }
  }

  // NEW: Methods specifically for My Courses (enrolled courses)
  getMyEnrolledCourses(page: number = 1, perPage: number = 15): Promise<StudentCoursesResponse> {
    const url = `student/my-courses?page=${page}&per_page=${perPage}`;
    
    return _axios.get<StudentCoursesResponse>(url).then((res) => {
      return res.data;
    }).catch((error) => {
      throw error;
    });
  }

  // Method to get all my enrolled courses for pagination
  getAllMyEnrolledCourses(): Promise<StudentCoursesResponse> {
    return _axios.get<StudentCoursesResponse>('student/my-courses?per_page=1000').then((res) => {
      return res.data;
    }).catch((error) => {
      throw error;
    });
  }

  getPaths(data?: any): Promise<
    RootObj<
      IndexObj2<{
        data: Path[];
        current_page: number;
        limit: number;
      }>
    >
  > {
    return _axios
      .post<any>(`getPaths`, data)
      .then((res) => res.data?.result?.data);
  }

  getById(id: string | number): Promise<Course> {
    return _axios
      .get<any>(`getCourseById/${id}`)
      .then((res) => res.data.result);
  }

  getTestByCourseId(id: string): Promise<any> {
    return _axios.get<any>(`getTestsByCourseId/${id}`).then((res) => res.data);
  }

  getLiveCourse(data: any): Promise<AxiosResponse<any, any>> {
    return _axios.post<any>(`getLiveCourse`, data);
  }
  // checkCourseStatus(id: string | number): Promise<RootObj<Course>> {
  //   return _axios.get<any>(`checkOrderAvailability` , {id  : id}).then((res) => res.data);
  // }
}

export const _CourseService = CourseService.Instance;
