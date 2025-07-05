import React, { useEffect, useState } from "react";

export const useCoursesPageResize = () => {
  const [largeScreen, setLargeScreen] = useState(false);

  const handleResize = () => {
    if (window.innerWidth >= 1830) {
      setLargeScreen(true);
    } else if (window.innerWidth < 1830) {
      setLargeScreen(false);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
  }, []);

  return [largeScreen, setLargeScreen];
};
