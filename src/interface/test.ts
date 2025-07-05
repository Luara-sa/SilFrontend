export interface Name {
  en: string;
  ar: string;
}

export interface Description {
  en: string;
  ar: string;
}

export interface Curriculum {
  en: string;
  ar: string;
}

export interface Installment {
  id: number;
  course_id: number;
  amount: number;
  num_date_to_paid: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: any;
}

export interface Users {
  id: number;
  country_id: number;
  email: string;
  active: number;
  username: string;
  phone: string;
  bank_name?: any;
  account_name?: any;
  account_number?: any;
  salary?: any;
  id_number?: any;
  Specialties?: any;
  representative_link?: any;
  address?: any;
  commercial_registration_no?: any;
  gender: string;
  lang_level: string;
  personal_image: string;
  company_id?: any;
  email_verified_at: Date;
  email_confirm_code?: any;
  expire_confirm_code_at?: any;
  api_token?: any;
  created_at: Date;
  updated_at: Date;
  deleted_at?: any;
}

export interface Name2 {
  en: string;
  ar: string;
}

export interface Categories {
  id: number;
  parent_id: number;
  name: Name2;
  image: string;
  active: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: any;
}

export interface Name3 {
  en: string;
  ar: string;
}

export interface Description2 {
  en: string;
  ar: string;
}

export interface Session {
  id: number;
  course_id: number;
  name: Name3;
  description: Description2;
  deleted_at?: any;
  created_at: Date;
  updated_at: Date;
}

export interface Datum {
  id: number;
  parent_id: number;
  user_id: number;
  cat_id: number;
  type: string;
  level: string;
  is_livestream: number;
  name: Name;
  image: string;
  active: number;
  hours: number;
  description: Description;
  curriculum: Curriculum;
  max_members: number;
  classes: string;
  price: number;
  discount: number;
  rate?: any;
  tags: string;
  installments: Installment[];
  start_date: string;
  end_date: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: any;
  course_id: number;
  users: Users;
  categories: Categories;
  sessions: Session[];
}

export interface Link {
  url: string;
  label: string;
  active: boolean;
}

export interface Data {
  current_page: number;
  data: Datum[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Link[];
  next_page_url?: any;
  path: string;
  per_page: number;
  prev_page_url?: any;
  to: number;
  total: number;
}

export interface Result {
  data: Data;
  total: number;
  current_page: number;
  limit: number;
  last_page: number;
}

export interface RootObject {
  success: boolean;
  message: string;
  result: Result;
}
