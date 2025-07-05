import { useState, useEffect } from "react";

type DeviceSize = "mobile" | "tablet" | "desktop";

const useDeviceSize = (throttleTime = 100): DeviceSize => {
  const [deviceSize, setDeviceSize] = useState<DeviceSize>("desktop");

  useEffect(() => {
    let timeoutId: number;

    const handleResize = () => {
      const { innerWidth } = window;

      if (innerWidth <= 768) {
        setDeviceSize("mobile");
      } else if (innerWidth > 768 && innerWidth <= 1024) {
        setDeviceSize("tablet");
      } else {
        setDeviceSize("desktop");
      }
    };

    handleResize();

    const handleResizeThrottled = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = window.setTimeout(handleResize, throttleTime);
    };
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResizeThrottled);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResizeThrottled);
      }
      clearTimeout(timeoutId);
    };
  }, [throttleTime]);

  return deviceSize || "desktop";
};

export default useDeviceSize;
