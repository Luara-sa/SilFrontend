import { _WithAuthService } from "services/withAuth.service";

interface IParams {
  moyasar_payment_id: number | string;
  course_id: number;
  selectedMethod: number;
}

export const handlePaymentPaid = ({
  moyasar_payment_id,
  course_id,
  selectedMethod,
}: IParams) => {
  const tempData = {
    live_course_id: course_id,
    payment_id: selectedMethod,
    amount: 250,
    totalWithVat: 287,
    discount: 10,
    paid_type: 1,
    moyasar_payment_id: moyasar_payment_id,
  };

  return _WithAuthService.createOrderStudent(tempData);
};
