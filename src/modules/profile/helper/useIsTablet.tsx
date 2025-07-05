import React, { useEffect, useState } from "react";

export const useIsTablet = () => {
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleWindowResize = () => {
      if (window.innerWidth < 1200) {
        if (isTablet) return;
        setIsTablet(true);
      } else if (!isTablet) return;
      else if (isTablet) setIsTablet(false);
    };

    window.addEventListener("resize", handleWindowResize);
    window.addEventListener("load", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
      window.removeEventListener("load", handleWindowResize);
    };
  });

  return { isTablet };
};
