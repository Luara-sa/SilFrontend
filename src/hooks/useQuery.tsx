import { useRouter } from "next/router";
import React from "react";

export const useQuery = () => {
  const router = useRouter();

  const set: SetQuery = (params) => {
    router.replace({
      query: { ...router.query, filter: JSON.stringify(params) },
    });
  };

  const get: GetQuery = () => {
    try {
      return JSON.parse(router.query.filter as string);
    } catch (error) {
      return {};
    }
  };

  return [set, get] as [SetQuery, GetQuery];
};

type SetQuery = (params: any) => void;
type GetQuery = () => any;
