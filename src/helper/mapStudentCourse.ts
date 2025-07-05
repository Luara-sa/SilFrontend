import { Course, StudentCourse, StringDouble } from "interface/common";

/**
 * Maps StudentCourse from the new API to the existing Course interface
 * This allows us to use existing course components without major changes
 */
export const mapStudentCourseToCourseLegacy = (studentCourse: StudentCourse): Course => {
  // Create a name object compatible with StringDouble
  const name: StringDouble = {
    en: studentCourse.name,
    ar: studentCourse.name, // Using the same name for both languages for now
  };

  // Convert price string to number
  const originalPrice = parseFloat(studentCourse.course_price.price) || 0;
  const discountedPrice = studentCourse.course_price.discounted_price 
    ? parseFloat(studentCourse.course_price.discounted_price) 
    : null;
  
  // Use discounted price if available, otherwise original price
  const finalPrice = discountedPrice || originalPrice;
  const currency = studentCourse.course_price.currency;

  return {
    id: studentCourse.id,
    course_id: studentCourse.id, // Using the same ID
    discount: discountedPrice ? ((originalPrice - discountedPrice) / originalPrice) * 100 : 0,
    hours: studentCourse.duration,
    image: studentCourse.thumbnail,
    level: undefined, // Not provided in new API
    name: name,
    price: finalPrice,
    rate: studentCourse.reviews.average_rating,
    type: studentCourse.mode,
    // Add pricing details for better display
    originalPrice: originalPrice,
    discountedPrice: discountedPrice ?? undefined,
    currency: currency,
    description: undefined,
    sessions: [],
    max_members: undefined,
    parent_id: undefined,
    users: undefined,
    start_date: new Date(studentCourse.start_date),
    created_at: undefined,
    deleted_at: undefined,
    end_date: new Date(studentCourse.end_date),
    updated_at: undefined,
    tags: undefined,
    course_test: [],
    order: undefined,
    delegate_course_link: undefined,
    certificate: "",
    certificate_request: {} as any,
    certificate_type: 0,
    user_is_rating: false,
    user_passed_test: null,
    rating_list: [],
    price_without_inst: finalPrice,
    total_with_vat_without_inst: finalPrice,
    trainer_name: `${studentCourse.instructor.first_name} ${studentCourse.instructor.last_name}`,
    total_with_vat_with_inst: finalPrice,
    installments: [],
    reviews_report: [
      {
        count: studentCourse.reviews.total_rating,
        rate_number: studentCourse.reviews.average_rating,
      },
    ],
  };
};

/**
 * Maps an array of StudentCourse to Course array
 */
export const mapStudentCoursesToCoursesLegacy = (studentCourses: StudentCourse[]): Course[] => {
  return studentCourses.map(mapStudentCourseToCourseLegacy);
}; 