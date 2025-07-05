import useDeviceSize from "hooks/useDeviceSize";
import React from "react";
import { PlacementTestButtonDesktop } from "./Responsive/PlacementTestButtonDesktop";
import { PlacementTestButtonMobile } from "./Responsive/PlacementTestButtonMobile";

export const PlacementTestButton = () => {
  const DeviceSize = useDeviceSize();
  return (
    <>
      {(DeviceSize === "desktop" || DeviceSize === "tablet") && (
        <PlacementTestButtonDesktop />
      )}
      {DeviceSize === "mobile" && <PlacementTestButtonMobile />}
    </>
  );
};
