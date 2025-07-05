import { useRef } from "react";

export const useDebounce = (fun: Function, time: number) => {
  const ref = useRef<any>(null);
  return (e?: any) => {
    ref.current && clearTimeout(ref.current);
    ref.current = setTimeout(() => fun(e), time);
  };
};
