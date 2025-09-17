import { _CourseService } from "services/course.service";

interface IParams {
  moyasar_payment_id: number | string;
  course_id: number;
  selectedMethod: number;
  course_group_id?: number;
  bank_document?: File;
}

export const handlePaymentPaid = ({
  moyasar_payment_id,
  course_id,
  selectedMethod,
  course_group_id,
  bank_document,
}: IParams) => {
  // Map payment method IDs to the new API format
  const paymentMethodMap: { [key: number]: 'paymob' | 'tamara' | 'tabby' | 'bank_transfer' } = {
    1: 'paymob',
    2: 'tamara', 
    3: 'tabby',
    4: 'bank_transfer',
  };

  const checkoutData = {
    payment_method: paymentMethodMap[selectedMethod] || 'paymob',
    course_id: course_id,
    course_group_id: course_group_id,
    bank_document: bank_document,
  };

  return _CourseService.checkoutCourse(checkoutData);
};
