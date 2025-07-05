import React, { useEffect, useState } from "react";

export const useCourseSectionSlider = () => {
  const [num, setNum] = useState(4);

  const handleResize = () => {
    if (window.innerWidth > 1800) {
      setNum(4);
    } else if (window.innerWidth <= 1800 && window.innerWidth > 1580) {
      setNum(3.5);
    } else if (window.innerWidth <= 1580 && window.innerWidth > 1380) {
      setNum(4);
    } else if (window.innerWidth <= 1380 && window.innerWidth > 1150) {
      setNum(3);
    } else if (window.innerWidth <= 1150 && window.innerWidth > 960) {
      setNum(2.5);
    } else if (window.innerWidth <= 960 && window.innerWidth > 850) {
      setNum(2.2);
    } else if (window.innerWidth <= 850 && window.innerWidth > 768) {
      setNum(2);
    } else if (window.innerWidth <= 768 && window.innerWidth > 640) {
      setNum(2.5);
    } else if (window.innerWidth <= 530 && window.innerWidth > 452) {
      setNum(1);
    } else if (window.innerWidth <= 452 && window.innerWidth > 380) {
      setNum(1);
    } else if (window.innerWidth <= 380) {
      setNum(1);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
  });

  return { num };
};
