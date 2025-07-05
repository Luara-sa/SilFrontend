import React, { useEffect, useState } from "react";

import { eventEmitter } from "services/eventEmitter";
import { MoyasarStatus, usePaymentURL } from "./usePaymentURL";
import { useRouter } from "next/router";
import { checkoutStore } from "store/checkoutStore";
import { handlePaymentPaid } from "../helper/handlePaymentPaid";

interface IUseBackdropLoaderProps {
  urlStatus?: MoyasarStatus;
  isLoading?: boolean;
}

export const useBackdropLoader = ({
  urlStatus,
  isLoading,
}: IUseBackdropLoaderProps) => {
  const { query } = useRouter();
  const { urlParams, isQueryLoading } = usePaymentURL();

  const [selectedMethod] = checkoutStore((state) => [state.selectedMethod]);

  const [hasBackdropLoader, setHasBackdropLoader] = useState(false);

  useEffect(() => {
    const status = urlParams?.status;
    if (isQueryLoading) {
      // show backdrop loader
      console.log("show backdrop loader");
      setHasBackdropLoader(true);
    } else if (
      urlParams?.status &&
      !isQueryLoading &&
      (status === "failed" || status === "paid")
    ) {
      setHasBackdropLoader(true);
      eventEmitter.emit("enqueueSnackbar", {
        message: urlParams?.message,
        variant: status === "failed" ? "error" : "success",
        snack: {
          autoHideDuration: 3000,
          preventDuplicate: true,
        },
      });
      handlePaymentPaid({
        moyasar_payment_id: urlParams.id ?? 0,
        course_id: query.id ? +query.id : 0,
        selectedMethod: selectedMethod ? +selectedMethod : 1,
      })
        .then((res) => console.log(res))
        .catch((err) => console.error(err))
        .finally(() => setHasBackdropLoader(false));
      // show backdrop loader and make API call
      console.log("show backdrop loader and make API call");
    } else {
      setHasBackdropLoader(false);
      // remove backdrop loader
      console.log("remove backdrop loader");
    }
  }, [urlParams, isQueryLoading]);

  return { hasBackdropLoader }; // or any other JSX you want to return
};
