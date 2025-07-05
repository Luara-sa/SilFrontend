import { useEffect, useRef } from "react";

export const useUnInitUseEffect = (fun: () => void, arr: any[]) => {
  const ref = useRef(false);

  return useEffect(() => {
    if (ref.current) fun();
    else ref.current = true;
  }, [...arr]);
};
