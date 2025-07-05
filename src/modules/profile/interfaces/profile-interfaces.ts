import { Gender, PaymentStatus, StringDouble, User } from "interface/common";
import { StudentStatus } from "../components";

export interface MyCourse {
  attendance: string;
  category_name: string;
  course_hours: number;
  course_id: number;
  course_image: string;
  course_name: string;
  course_sessons: CourseSesson[];
  order_status: string;
  student_order_id: number;
  student_status: string;
  trianer_image: string;
  trianer_name: string;
  attachment_attended_count?: number;
  course_attachment_count?: number;
  course_type: "male" | "female" | "both";
}

export interface CourseSesson {
  course_id: number;
  created_at: Date;
  deleted_at?: Date;
  description: StringDouble;
  id: number;
  name: StringDouble;
  updated_at: Date;
  session_attachments: SessionAttachments[];
}

export interface SessionAttachments {
  created_at: Date;
  deleted_at?: Date;
  description: StringDouble;
  file_type: string;
  id: number;
  link: string;
  session_id: number;
  updated_at: Date;
}

export interface MyTest {
  answers: string;
  created_at: Date;
  deleted_at?: Date;
  id: number;
  is_placement_done: number;
  mark?: number;
  test_city?: string;
  test_id: number;
  test_name: string;
  updated_at?: Date;
  user_id: number;
}

export interface StudentOrdersForCompany {
  GPA: number;
  amount?: number;
  attendance: string;
  bank_account_id?: number;
  bank_image?: string;
  bank_name?: string;
  bank_number?: number;
  class_id: number;
  course_name: string;
  created_at: Date;
  deleted_at?: Date;
  discount: number;
  id: number;
  installments: number;
  invoice_id?: number;
  live_course_id: number;
  order_status: PaymentStatus;
  payment_id: number;
  student_email: string;
  student_status: string;
  student_phone?: string;
  totalWithVat: number;
  updated_at?: Date;
  user_id: number;
  student_gender?: Gender;
  student_name: string;
  attachment_attended_count?: number;
  course_attachment_count?: number;
}

export interface MyCertificates {
  content_array: string;
  created_at: Date;
  id: number;
  status: string;
  type: "pending" | "pending" | "completed" | "rejected" | "remove" | "cancel";
  updated_at: Date;
  user: User;
  user_id: number;
}

export interface MyOrders {
  content_array: string;
  created_at: Date;
  id: number;
  status:
    | "pending"
    | "pending"
    | "completed"
    | "rejected"
    | "remove"
    | "cancel";
  type: number;
  updated_at?: Date;
  user: User;
  user_id: number;
}

export interface DelegateCourse {
  active: number;
  course_id: number;
  course_name: string;
  course_type: string;
  created_at: Date;
  deleted_at?: Date;
  expire_date?: Date;
  id: number;
  link: string;
  updated_at?: Date;
  user_id: number;
  users_used: number;
}

export interface MyOrdersInstallments {
  GPA: number;
  amount: number;
  attendance: string;
  bank_account_id?: number;
  bank_image?: string;
  bank_name?: string;
  bank_number?: number;
  class_id: number;
  course_name: string;
  created_at: Date;
  deleted_at?: Date;
  discount: number;
  id: number;
  installments: number;
  installments_student: any[];
  invoice_id?: number;
  live_course_id: number;
  order_status:
    | "pending"
    | "pending"
    | "completed"
    | "rejected"
    | "remove"
    | "cancel";
  paid_type: number;
  payment_id: number;
  student_status: string;
  teacher_name: string;
  totalWithVat: number;
  updated_at?: Date;
  user_id: number;
}

export interface UsersCompany {
  id: number;
  email: string;
  username: string;
  gender: Gender;
  phone: string;
  extra_phone?: string;
  id_number: string;
  courses_count: number;
}
export interface MyPaths {
  id: number;
  name: string;
  image: string;
  cat_id: number;
  category_name: string;
  courses_count: number;
}
export interface MyDashboard {
  student_status: string;
  count: number;
}
