import React, { useEffect } from "react";

import { _WithAuthService } from "services/withAuth.service";
import { checkoutStore } from "store/checkoutStore";

export const useGetPaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = checkoutStore((state) => [
    state.paymentMethods,
    state.setPaymentMethods,
  ]);

  useEffect(() => {
    _WithAuthService
      .getPaymentMethodActive()
      .then((res) => setPaymentMethods(res.result))
      .catch((err) => console.error(err));

    return () => {};
  }, []);

  return paymentMethods;
};
