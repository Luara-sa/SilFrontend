import React, { useEffect, useState } from "react";

export const useResponsive = () => {
  const [windowSize, setWindowSize] = useState(() => {
    return typeof window !== "undefined" ? window.innerWidth : 0;
  });
  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize(window.innerWidth);
    };
    updateWindowSize();
    window.addEventListener("resize", updateWindowSize);
    return () => {
      window.removeEventListener("resize", updateWindowSize);
    };
  }, []);
  return {
    screenWidth: windowSize,
  };
};
