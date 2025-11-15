import { useState, useEffect } from "react";

type DeviceSize = "mobile" | "tablet" | "desktop";

const getDeviceSize = (): DeviceSize => {
  if (typeof window === "undefined") return "desktop";
  
  const { innerWidth } = window;
  if (innerWidth <= 768) {
    return "mobile";
  } else if (innerWidth > 768 && innerWidth <= 1024) {
    return "tablet";
  } else {
    return "desktop";
  }
};

const useDeviceSize = (throttleTime = 100): DeviceSize => {
  const [deviceSize, setDeviceSize] = useState<DeviceSize>(() => getDeviceSize());
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    let timeoutId: number;

    const handleResize = () => {
      setDeviceSize(getDeviceSize());
    };

    handleResize();

    const handleResizeThrottled = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = window.setTimeout(handleResize, throttleTime);
    };
    
    window.addEventListener("resize", handleResizeThrottled);

    return () => {
      window.removeEventListener("resize", handleResizeThrottled);
      clearTimeout(timeoutId);
    };
  }, [throttleTime]);

  // Return desktop for SSR to prevent hydration mismatch
  if (!isMounted) {
    return "desktop";
  }

  return deviceSize;
};

export default useDeviceSize;
