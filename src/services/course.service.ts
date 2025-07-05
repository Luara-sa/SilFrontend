import { Result } from "./../interface/test";
import axios, { AxiosResponse } from "axios";
import { _axios } from "interceptors/http-config";
import { Course, IndexObj, Path, IndexObj2, RootObj, StudentCoursesResponse, StudentCourseDetailsResponse, DetailedStudentCourseResponse, CourseEnrollmentRequest, CourseEnrollmentResponse, CourseEnrollmentStatusResponse, CourseCurriculumResponse } from "interface/common";

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

  // Method to fetch all courses for frontend filtering
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
