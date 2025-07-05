import React, { useEffect } from "react";

import { useRouter } from "next/router";

import { useMe } from "./useMe";

export const useProtectedRoute = () => {
  const router = useRouter();
  const { isLogged, isThereIsToken, loading } = useMe();

  useEffect(() => {
    if (!loading) {
      if (!isThereIsToken || !isLogged) {
        router.push("/");
      }
    }
    return () => {};
  }, [isLogged, isThereIsToken]);
};
