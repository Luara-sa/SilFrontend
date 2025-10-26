import { Result } from "./../interface/test";
import axios, { AxiosResponse } from "axios";
import { _axios } from "interceptors/http-config";
import { Course, IndexObj, Path, IndexObj2, RootObj, StudentCoursesResponse, StudentCourseDetailsResponse, DetailedStudentCourseResponse, CourseEnrollmentRequest, CourseEnrollmentResponse, CourseEnrollmentStatusResponse, CourseCurriculumResponse, StudentCoursesFilters } from "interface/common";
import { ApiUtils } from "utils/apiUtils";

class CourseService {
  private static _instance: CourseService;
  //   private readonly URL = "admin";

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  /**
   * Check if current user can access student-only features
   */
  private canAccessStudentFeatures(): boolean {
    return ApiUtils.isStudentUser();
  }

  /**
   * Throw error for company users trying to access student-only features
   */
  private throwCompanyAccessError(feature: string): never {
    throw new Error(`${feature} is only available for student accounts. Company accounts have limited access to course viewing only.`);
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



  // Updated method for courses API - works for both student and company and unauthenticated users
  getStudentCourses(page: number = 1, perPage: number = 15): Promise<StudentCoursesResponse> {
    // Courses can be viewed without authentication
    const endpoint = ApiUtils.isStudentUser() 
      ? `${ApiUtils.buildEndpoint('courses')}` 
      : 'student/courses';
    const url = `${endpoint}?page=${page}&per_page=${perPage}`;
    
    return _axios.get<any>(url).then((res) => {
      const responseData = res.data;
      
      // Handle different response formats
      if (responseData.status !== undefined && responseData.data) {
        return responseData;
      }
      
      if (responseData.content && responseData.pagination) {
        return {
          status: true,
          message: 'Courses fetched successfully',
          data: {
            content: responseData.content,
            pagination: responseData.pagination
          }
        };
      }
      
      if (Array.isArray(responseData)) {
        return {
          status: true,
          message: 'Courses fetched successfully',
          data: {
            content: responseData,
            pagination: {
              current_page: page,
              from: 0,
              last_page: 1,
              per_page: perPage,
              to: responseData.length,
              total: responseData.length,
              count: responseData.length,
              has_next: false,
              next_page_url: null,
              previous_page_url: null,
              pagination_name: 'page'
            }
          }
        };
      }
      
      return responseData;
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

  // Public method to fetch courses without authentication
  getPublicStudentCourses(page: number = 1, perPage: number = 15): Promise<StudentCoursesResponse> {
    const url = `${ApiUtils.buildEndpoint('courses')}?page=${page}&per_page=${perPage}`;
    
    // Create a request without auth headers
    return _axios.get<any>(url, {
      headers: {
        // Explicitly remove authorization header for public access
        Authorization: undefined
      }
    }).then((res) => {
      return res.data;
    }).catch((error) => {
      // For public access, don't redirect on 401, just return empty data
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
    // Courses can be viewed without authentication
    const endpoint = ApiUtils.isStudentUser() 
      ? `${ApiUtils.buildEndpoint('courses')}` 
      : 'student/courses';
    return _axios.get<any>(`${endpoint}?per_page=1000`).then((res) => {
      const responseData = res.data;
      
      // Handle different response formats
      if (responseData.status !== undefined && responseData.data) {
        return responseData;
      }
      
      if (responseData.content && responseData.pagination) {
        return {
          status: true,
          message: 'Courses fetched successfully',
          data: {
            content: responseData.content,
            pagination: responseData.pagination
          }
        };
      }
      
      if (Array.isArray(responseData)) {
        return {
          status: true,
          message: 'Courses fetched successfully',
          data: {
            content: responseData,
            pagination: {
              current_page: 1,
              from: 0,
              last_page: 1,
              per_page: 1000,
              to: responseData.length,
              total: responseData.length,
              count: responseData.length,
              has_next: false,
              next_page_url: null,
              previous_page_url: null,
              pagination_name: 'page'
            }
          }
        };
      }
      
      return responseData;
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
    
    // Courses can be viewed without authentication
    const endpoint = ApiUtils.isStudentUser() 
      ? `${ApiUtils.buildEndpoint('courses')}` 
      : 'student/courses';
    const url = `${endpoint}?${queryParams.toString()}`;
    
    return _axios.get<any>(url).then((res) => {
      // Handle different response formats
      const responseData = res.data;
      
      // Case 1: Response has status, message, and data wrapper (expected format)
      if (responseData.status !== undefined && responseData.data) {
        return responseData;
      }
      
      // Case 2: Response has content and pagination directly (alternative format)
      if (responseData.content && responseData.pagination) {
        return {
          status: true,
          message: 'Courses fetched successfully',
          data: {
            content: responseData.content,
            pagination: responseData.pagination
          }
        };
      }
      
      // Case 3: Response is an array of courses (legacy format)
      if (Array.isArray(responseData)) {
        return {
          status: true,
          message: 'Courses fetched successfully',
          data: {
            content: responseData,
            pagination: {
              current_page: page,
              from: 0,
              last_page: 1,
              per_page: perPage,
              to: responseData.length,
              total: responseData.length,
              count: responseData.length,
              has_next: false,
              next_page_url: null,
              previous_page_url: null,
              pagination_name: 'page'
            }
          }
        };
      }
      
      // If none of the above, return the data as-is (might fail validation later)
      if (process.env.NODE_ENV === 'development') {
        console.warn('CourseService: Unexpected response format', responseData);
      }
      return responseData;
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
    // Course details can be viewed without authentication
    const endpoint = ApiUtils.isStudentUser() 
      ? `${ApiUtils.buildEndpoint(`courses/${id}/details`)}` 
      : `student/courses/${id}/details`;
    
    return _axios.get<StudentCourseDetailsResponse>(endpoint).then((res) => {
      return res.data;
    }).catch((error) => {
      throw error;
    });
  }

  // Method to get detailed student course information
  getDetailedStudentCourse(id: string | number): Promise<DetailedStudentCourseResponse> {
    // Course details can be viewed without authentication
    const endpoint = ApiUtils.isStudentUser() 
      ? `${ApiUtils.buildEndpoint(`courses/${id}`)}` 
      : `student/courses/${id}`;
    
    return _axios.get<DetailedStudentCourseResponse>(endpoint).then((res) => {
      return res.data;
    }).catch((error) => {
      throw error;
    });
  }

  // Method to enroll in a course
  enrollInCourse(data: CourseEnrollmentRequest): Promise<CourseEnrollmentResponse> {
    if (!this.canAccessStudentFeatures()) {
      this.throwCompanyAccessError('Course Enrollment');
    }
    
    const url = `${ApiUtils.buildEndpoint('enrolled')}`;
    
    return _axios.post<CourseEnrollmentResponse>(url, data).then((res) => {
      return res.data;
    }).catch((error) => {
      throw error;
    });
  }

  // Method to check if user is enrolled in a course
  checkCourseEnrollmentStatus(id: string | number): Promise<CourseEnrollmentStatusResponse> {
    const url = `${ApiUtils.buildEndpoint(`courses/${id}/details`)}`;
    
    return _axios.get<CourseEnrollmentStatusResponse>(url).then((res) => {
      return res.data;
    }).catch((error) => {
      throw error;
    });
  }

  // Method to get course curriculum
  getCourseCurriculum(id: string | number): Promise<CourseCurriculumResponse> {
    if (!this.canAccessStudentFeatures()) {
      this.throwCompanyAccessError('Course Curriculum');
    }
    
    const url = `${ApiUtils.buildEndpoint(`courses/${id}/curriculum`)}`;
    
    return _axios.get<CourseCurriculumResponse>(url).then((res) => {
      return res.data;
    }).catch((error) => {
      throw error;
    });
  }

  // NEW: Method to get video topic content
  getVideoTopicContent(courseId: string | number, chapterId: string | number, topicId: string | number): Promise<any> {
    const url = `${ApiUtils.buildEndpoint(`courses/${courseId}/curriculum/video/chapters/${chapterId}/topics/${topicId}`)}`;
    
    return _axios.get<any>(url).then((res) => {
      return res.data;
    }).catch((error) => {
      throw error;
    });
  }

  // NEW: Method to get reading topic content
  getReadingTopicContent(courseId: string | number, chapterId: string | number, topicId: string | number): Promise<any> {
    const url = `${ApiUtils.buildEndpoint(`courses/${courseId}/curriculum/reading/chapters/${chapterId}/topics/${topicId}`)}`;
    
    return _axios.get<any>(url).then((res) => {
      return res.data;
    }).catch((error) => {
      throw error;
    });
  }

  // NEW: Method to get quiz topic content
  getQuizTopicContent(courseId: string | number, chapterId: string | number, topicId: string | number): Promise<any> {
    const url = `${ApiUtils.buildEndpoint(`courses/${courseId}/curriculum/quiz/chapters/${chapterId}/topics/${topicId}`)}`;
    
    return _axios.get<any>(url).then((res) => {
      return res.data;
    }).catch((error) => {
      throw error;
    });
  }

  // NEW: Generic method to get topic content based on type
  getTopicContent(courseId: string | number, chapterId: string | number, topicId: string | number, topicType: 'video' | 'reading' | 'quiz'): Promise<any> {
    if (topicType === 'video') {
      return this.getVideoTopicContent(courseId, chapterId, topicId);
    } else if (topicType === 'reading') {
      return this.getReadingTopicContent(courseId, chapterId, topicId);
    } else if (topicType === 'quiz') {
      return this.getQuizTopicContent(courseId, chapterId, topicId);
    } else {
      throw new Error(`Unsupported topic type: ${topicType}`);
    }
  }

  // Method to mark topic as viewed
  markTopicAsViewed(courseId: string | number, chapterId: string | number, topicId: string | number): Promise<any> {
    const url = `${ApiUtils.buildEndpoint(`courses/${courseId}/curriculum/chapters/${chapterId}/topics/${topicId}/mark-viewed`)}`;
    
    return _axios.post<any>(url).then((res) => {
      return res.data;
    }).catch((error) => {
      throw error;
    });
  }

  // NEW: Methods specifically for My Courses (enrolled courses)
  getMyEnrolledCourses(page: number = 1, perPage: number = 15): Promise<StudentCoursesResponse> {
    if (!this.canAccessStudentFeatures()) {
      this.throwCompanyAccessError('My Enrolled Courses');
    }
    
    const url = `${ApiUtils.buildEndpoint('my-courses')}?page=${page}&per_page=${perPage}`;
    
    return _axios.get<any>(url).then((res) => {
      const responseData = res.data;
      
      // Handle different response formats
      if (responseData.status !== undefined && responseData.data) {
        return responseData;
      }
      
      if (responseData.content && responseData.pagination) {
        return {
          status: true,
          message: 'My courses fetched successfully',
          data: {
            content: responseData.content,
            pagination: responseData.pagination
          }
        };
      }
      
      if (Array.isArray(responseData)) {
        return {
          status: true,
          message: 'My courses fetched successfully',
          data: {
            content: responseData,
            pagination: {
              current_page: page,
              from: 0,
              last_page: 1,
              per_page: perPage,
              to: responseData.length,
              total: responseData.length,
              count: responseData.length,
              has_next: false,
              next_page_url: null,
              previous_page_url: null,
              pagination_name: 'page'
            }
          }
        };
      }
      
      return responseData;
    }).catch((error) => {
      // Return error in expected format instead of throwing
      return {
        status: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch my enrolled courses',
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

  // Method to get all my enrolled courses for pagination
  getAllMyEnrolledCourses(): Promise<StudentCoursesResponse> {
    if (!this.canAccessStudentFeatures()) {
      this.throwCompanyAccessError('My Enrolled Courses');
    }
    
    return _axios.get<StudentCoursesResponse>(`${ApiUtils.buildEndpoint('my-courses')}?per_page=1000`).then((res) => {
      return res.data;
    }).catch((error) => {
      throw error;
    });
  }

  // NEW: Method to show interest in a course
  interestInCourse(courseId: string | number): Promise<any> {
    if (!this.canAccessStudentFeatures()) {
      this.throwCompanyAccessError('Course Interest');
    }
    
    const url = `${ApiUtils.buildEndpoint(`courses/${courseId}/interest`)}`;
    
    return _axios.post<any>(url).then((res) => {
      return res.data;
    }).catch((error) => {
      throw error;
    });
  }

  // NEW: Method to delegate a course
  delegateCourse(courseId: string | number): Promise<any> {
    if (!this.canAccessStudentFeatures()) {
      this.throwCompanyAccessError('Course Delegation');
    }
    
    const url = `${ApiUtils.buildEndpoint(`courses/${courseId}/delegate`)}`;
    
    return _axios.post<any>(url).then((res) => {
      return res.data;
    }).catch((error) => {
      throw error;
    });
  }

  // NEW: Method to review a course
  reviewCourse(courseId: string | number, data: {
    stars_count: number;
    message?: string;
  }): Promise<any> {
    if (!this.canAccessStudentFeatures()) {
      this.throwCompanyAccessError('Course Reviews');
    }
    
    const url = `${ApiUtils.buildEndpoint(`courses/${courseId}/review`)}`;
    
    return _axios.post<any>(url, data).then((res) => {
      return res.data;
    }).catch((error) => {
      throw error;
    });
  }

  // NEW: Method to purchase/checkout a course
  checkoutCourse(data: {
    payment_method: 'paymob' | 'tamara' | 'tabby' | 'bank_transfer';
    course_id: string | number;
    course_group_id?: string | number;
    bank_document?: File;
  }): Promise<any> {
    const url = `${ApiUtils.buildEndpoint('checkout')}`;
    
    // Create FormData for file upload support
    const formData = new FormData();
    formData.append('payment_method', data.payment_method);
    formData.append('course_id', data.course_id.toString());
    
    if (data.course_group_id) {
      formData.append('course_group_id', data.course_group_id.toString());
    }
    
    if (data.bank_document) {
      formData.append('bank_document', data.bank_document);
    }
    
    return _axios.post<any>(url, formData).then((res) => {
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
