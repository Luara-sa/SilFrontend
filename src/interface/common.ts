import { StudentStatus } from "modules/courses/helper/StudentStatusProperties";
import { CertifcateStatus } from "modules/courses/helper/certifcateRequestProperties";

export interface RootObj<T = any> {
  result: T;
  success: boolean;
  message: string;
}

export interface IndexObj<T = any> {
  data: T[];
  current_page: number;
  last_page: number;
  limit: number;
  total: number;
}

// export interface Data {
//   current_page: number;
//   data: Datum[];
//   first_page_url: string;
//   from: number;
//   last_page: number;
//   last_page_url: string;
//   links: Link[];
//   next_page_url?: any;
//   path: string;
//   per_page: number;
//   prev_page_url?: any;
//   to: number;
//   total: number;
// }

// export interface Result {
//   data: Data;
//   total: number;
//   current_page: number;
//   limit: number;
//   last_page: number;
// }

// export interface RootObject {
//   success: boolean;
//   message: string;
//   result: Result;
// }

export interface IndexObj2<T = any> {
  data: T;
  current_page: number;
  last_page: number;
  limit: number;
  total: number;
}

export interface Course {
  id: number;
  course_id: number;
  discount: number;
  hours: number;
  image: string;
  level?: string;
  name: StringDouble;
  price: number;
  rate: number;
  type?: string;
  description?: any;
  sessions: Session[];
  max_members?: string | number;
  parent_id?: string | number;
  users?: User;
  start_date?: Date;
  created_at?: Date;
  deleted_at?: Date;
  end_date?: Date;
  updated_at?: Date;
  tags?: any;
  course_test?: CourseTest[];
  order?: Order;
  delegate_course_link?: DelegateCourseLinkType;
  certificate: string;
  certificate_request: CertificateRequest;
  certificate_type: number;
  user_is_rating?: boolean;
  user_passed_test: boolean | null;
  rating_list: Rate[];
  price_without_inst: number;
  total_with_vat_without_inst: number;
  trainer_name?: string;
  total_with_vat_with_inst: number;
  installments: IInstallments[];
  reviews_report?: IReviewsReport[];
  // New pricing fields for better price display
  originalPrice?: number;
  discountedPrice?: number;
  currency?: string;
}

export interface IReviewsReport {
  count: number;
  rate_number: number;
}

interface IInstallments {
  amount: number;
  course_id: number;
  created_at: Date;
  deleted_at?: Date;
  id: number;
  num_date_to_paid: number;
  updated_at?: Date;
}

export interface Rate {
  course_id: number;
  created_at: Date;
  deleted_at?: Date | undefined;
  email: string;
  id: number;
  rate_message: string | undefined;
  rate_number: number;
  updated_at: Date | undefined;
  user_id: number;
  username: string;
  personal_image: string;
}

export interface CertificateRequest {
  content_array: string;
  created_at: Date;
  id: number;
  status: CertifcateStatus;
  type: number;
  updated_at?: Date;
  user_id: number;
}

export interface CourseTest {
  class_id: number;
  course_id: number;
  created_at: Date;
  deleted_at?: Date;
  id: number;
  test_id: number;
  updated_at?: Date;
}

export interface Session {
  attachments: Attachment[];
  course_id: string | number;
  created_at: string;
  deleted_at?: string;
  description: StringDouble;
  id: string | number;
  name: StringDouble;
  updated_at?: string;
}

export interface Attachment {
  created_at: string;
  deleted_at: string;
  description: StringDouble;
  file_type:
    | "png"
    | "jpg"
    | "pdf"
    | "mp4"
    | "docx"
    | "doc"
    | "xls"
    | "xlsx"
    | "none";
  id: string | number;
  link: string;
  session_id: string | number;
  updated_at?: string;
  attchments_tests: AttchmentsTests[];
  attended?: boolean;
  locked?: boolean;
}

export interface AttchmentsTests {
  attachment_id: number;
  created_at: Date;
  deleted_at?: Date;
  id: number;
  test_id: number;
  updated_at: Date;
}

export interface Path {
  id: number;
  cat_id: number;
  name: string;
  created_at: string;
  image: string;
  enrollPath: boolean;
  courses_sort?: ICoursesSort[];
  courses_count: number;
  categories: Category;
}
export interface PathCourse {
  id: number;
  course_id: number;
  discount?: number;
  hours: number;
  image: string;
  level?: string;
  name: string;
  price: number;
  rate: number;
  type?: string;
  description?: any;
  sessions: Session[];
  max_members?: string | number;
  parent_id?: string | number;
  users?: User;
  start_date?: Date;
  created_at?: Date;
  deleted_at?: Date;
  end_date?: Date;
  updated_at?: Date;
  tags?: any;
  course_test?: CourseTest[];
  order?: Order;
  delegate_course_link?: DelegateCourseLinkType;
  certificate: string;
  certificate_request: CertificateRequest;
  certificate_type: number;
  user_is_rating?: boolean;
  user_passed_test: boolean | null;
  rating_list: Rate[];
  price_without_inst: number;
  total_with_vat_without_inst: number;
  trainer_name?: string;
  total_with_vat_with_inst: number;
  installments: IInstallments[];
  reviews_report?: IReviewsReport[];
}

export interface ICoursesSort {
  course: PathCourse;
  course_id: number;
  sort: number;
}

export interface DateDTO {
  day: number;
  month: number;
  year: number;
}

export interface StringDouble {
  en: string;
  ar: string;
}

export interface User {
  account_name?: string;
  account_number?: number;
  active?: number;
  bank_name?: string;
  created_at?: Date;
  created_at_hejri?: string;
  email: string;
  gender: string;
  id: number;
  id_number?: string;
  personal_image?: string;
  phone: string;
  salary?: string | number;
  updated_at?: Date;
  username?: string;
  extra_phone?: string;
  delegate_active?: number;
  // New fields from student profile API
  first_name?: string;
  last_name?: string;
  prefix_phone_number?: string;
  profile_img?: string;
  enrollments_count?: number;
}

export interface CreateStudentOrder {
  live_course_id?: string | number;
  payment_id?: string | number;
  bank_account_id?: string | number;
  bank_name?: string;
  bank_number?: number;
  bank_image?: string;
  amount?: string | number;
  discount?: string | number;
  totalWithVat?: string | number;
  class_id?: string | number;
  moyasar_payment_id?: number | string;
}

export interface TestType {
  active: number;
  id: number;
  created_at: Date;
  deleted_at?: Date;
  is_experimental: number;
  is_placement: number;
  is_question_test: number;
  is_required: number;
  name: StringDouble;
  updated_at?: Date;
  questions: {
    correct_answer: StringDouble;
    id: number;
    points: number;
    question: StringDouble;
    question_extension: { ar: string[]; en: string[] };
    test_id: number;
    type: TQuestionType;
  }[];
}

export type TQuestionType =
  | "multiple_choice"
  | "true_false"
  | "traditional"
  | "blanks";

export interface Question {
  correct_answer: StringDouble;
  id: number;
  points: number;
  question: StringDouble;
  question_extension: { ar: string[]; en: string[] };
  test_id: number;
  type: TQuestionType;
}

export interface IStudentAnswer {
  answer: string;
  blank_id: number;
}

export interface ICorrectAnswer {
  blank_id: number;
  answer: string;
}

// export interface Question {

// }

export interface Order {
  GPA: number;
  amount: number;
  attendance: string;
  bank_account_id?: number;
  class_id: number;
  created_at: Date;
  discount: number;
  id: number;
  installments: number;
  live_course_id: number;
  order_status: TOrderStatus;
  payment_id: number;
  student_status: StudentStatus;
  totalWithVat: number;
  updated_at: Date;
  user_id: number;
}

export interface User {}

export interface CoursePathType {
  classes: string;
  course_id: number;
  courses_course_id: number;
  created_at: Date;
  deleted_at?: Date;
  discount: number;
  end_date?: Date;
  id: number;
  installments: number;
  is_end: number;
  max_members: number;
  name: string;
  price: number;
  start_date: Date;
  trainer_name: string;
  type: string;
  updated_at?: Date;
}

export interface Category {
  active: number;
  created_at: Date;
  deleted_at?: Date;
  id: number;
  image: string;
  name: StringDouble;
  parent_id: number;
  updated_at?: Date;
  child: Category[];
}

// New interface for student categories API
export interface StudentCategory {
  id: number;
  name: string;
  image: string;
}

export interface StudentCategoriesResponse {
  status: boolean;
  message: string;
  data: {
    content: StudentCategory[];
    pagination: {
      current_page: number;
      from: number;
      last_page: number;
      per_page: number;
      to: number;
      total: number;
      count: number;
      has_next: boolean;
      next_page_url: string | null;
      previous_page_url: string | null;
      pagination_name: string;
    };
  };
}

// Student courses API interfaces
export interface StudentCourse {
  id: number;
  name: string;
  thumbnail: string;
  mode: "location" | "hybrid" | "online";
  learning_structure: "structured" | "unstructured";
  delivery_mode: "synchronous" | "asynchronous";
  group_assignment_mode: "before_enroll" | "after_enroll";
  start_date: string;
  end_date: string;
  duration: number;
  reviews: {
    rating: number[];
    average_rating: number;
    total_rating: number;
  };
  enrollments_count: number | null;
  course_price: {
    price: string;
    currency: string;
    discounted_price: string | null;
  };
  levels: any[];
  category: {
    id: number;
    name: string;
    image: string;
  };
  instructor: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    image: string;
  };
  target_audiences: any[];
}

export interface StudentCoursesResponse {
  status: boolean;
  message: string;
  data: {
    content: StudentCourse[];
    pagination: {
      current_page: number;
      from: number;
      last_page: number;
      per_page: number;
      to: number;
      total: number;
      count: number;
      has_next: boolean;
      next_page_url: string | null;
      previous_page_url: string | null;
      pagination_name: string;
    };
  };
}

// Student Courses Filter Interfaces
export interface StudentCoursesFilters {
  category_id?: number;
  mode?: "location" | "hybrid" | "online";
  learning_structure?: "structured" | "unstructured";
  delivery_mode?: "synchronous" | "asynchronous";
  min_price?: number;
  max_price?: number;
  min_rating?: number;
  min_duration?: number;
  max_duration?: number;
  instructor_id?: number;
  search?: string;
}

export interface PaginationParams {
  page: number;
  per_page: number;
}

export interface StudentCoursesApiParams extends PaginationParams {
  filters?: StudentCoursesFilters;
}

export interface StudentCourseDetailsResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    is_enrollment: boolean;
    statistic: any;
  } | null;
}

export interface CourseLevel {
  id: number;
  name: string;
}

export interface TargetAudience {
  id: number;
  name: string;
}

export interface CourseSchedule {
  id: number;
  day: string;
  start_time: string;
  end_time: string;
}

export interface CourseGroup {
  id: number;
  name: string;
  max_students_count: number;
  start_date: string;
  end_date: string;
  expire_joined_date: string;
  schedules: CourseSchedule[];
}

export interface CourseEnrollmentStatus {
  id: number;
  is_enrollment: boolean;
  statistic: {
    tasks_count: number;
    completed_tasks_count: number;
    progress: number;
    status: string;
  };
}

export interface CourseEnrollmentStatusResponse {
  status: boolean;
  message: string;
  data: CourseEnrollmentStatus;
}

export interface CourseTopic {
  id: number;
  type: "video" | "reading" | "pdf";
  name: string;
  description: string | null;
  video_url: string | null;
}

export interface CourseChapter {
  id: number;
  name: string;
  topics_count: number;
  topics: CourseTopic[];
}

export interface CourseCurriculumResponse {
  status: boolean;
  message: string;
  data: {
    chapters: CourseChapter[];
  } | null;
}

export interface DetailedStudentCourseResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    short_description: string;
    thumbnail: string;
    mode: "online" | "location" | "hybrid";
    learning_structure: "self_paced" | "structured";
    delivery_mode: "synchronous" | "asynchronous";
    group_assignment_mode: "none" | "before_enroll" | "after_enroll";
    start_date: string;
    end_date: string;
    duration: number;
    reviews: {
      rating: number[];
      average_rating: number;
      total_rating: number;
    };
    enrollments_count: number;
    topics_count: number;
    group_sessions_count: number;
    course_price: {
      price: string;
      currency: string;
      discounted_price: string | null;
    };
    course_setting: {
      is_free: number;
      is_upcoming: number;
      is_live: number;
    };
    category: {
      id: number;
      name: string;
      image: string;
    };
    levels: CourseLevel[];
    instructor: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      image: string;
    };
    target_audiences: TargetAudience[];
    groups: CourseGroup[];
  } | null;
}

export interface InfoSystem {
  document_type_enum: any;
  course_link_delegate_enum: any;
  course_type_enum: any[];
  delegate_account_enum: any;
  english_level_enum: any[];
  invoice_type_enum: any[];
  order_status_enum: any[];
  student_status_enum: any[];
  vat_value: { vat: number };
}

export type Gender = "male" | "female" | "both";

export type PaymentStatus = "pending" | "completed" | "rejected";

export type RoleType = "delegate" | "student" | "company" | "teacher";

export interface DelegateCourseLinkType {
  active: number;
  course_id: number;
  created_at: Date;
  deleted_at?: Date;
  expire_date?: Date;
  id: number;
  link: string;
  updated_at?: Date;
  user_id: number;
  users_used: number;
}

export type NotificationType =
  | "my_courses"
  | "my_orders"
  | "certificates_request"
  | "delegate_link"
  | "delegate_account"
  | "new_installment_to_checkout";

export interface NotificationDataAfterParse {
  body: string;
  title: string;
  data: { type: NotificationType };
}

export interface Notification {
  created_at: Date;
  data: string;
  id: number;
  is_read: number;
  updated_at?: Date;
  user_id: number;
}

export interface IPaymentMethodActive {
  active: number;
  id: number;
  image: string;
  name: string;
}

export type TOrderStatus =
  | "rejected"
  | "pending"
  | "completed"
  | "remove"
  | "cancel";

export interface CourseEnrollmentRequest {
  id: number;
  type?: string;
  course_group_id?: number;
}

export interface CourseEnrollmentResponse {
  status: boolean;
  message: string;
  data: any;
}
