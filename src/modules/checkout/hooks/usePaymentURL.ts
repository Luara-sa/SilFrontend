import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export type MoyasarStatus = "paid" | "failed";

interface IUrlState {
  id: string | null;
  status: MoyasarStatus;
  amount: string | null;
  message: string | null;
}

export const usePaymentURL = () => {
  const { isReady, asPath, query } = useRouter();

  const [urlState, setUrlState] = useState<IUrlState | undefined>(undefined);

  useEffect(() => {
    if (isReady) {
      const fullURL = `${window.location.protocol}//${window.location.host}${asPath}`;

      const url = new URL(fullURL);
      const queryParams = new URLSearchParams(url.search);

      const id = queryParams.get("id");
      const status = queryParams.get("status") as MoyasarStatus;
      const amount = queryParams.get("amount");
      const message = queryParams.get("message");

      setUrlState({ id, status, amount, message });
    }
    return () => {};
  }, [isReady, query]);

  return { urlParams: urlState, isQueryLoading: !isReady };
};
