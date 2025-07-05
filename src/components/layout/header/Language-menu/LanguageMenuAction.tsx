import React from "react";
import useDeviceSize from "hooks/useDeviceSize";
import { LanguageMenuActionDesktop } from "./Responsive/LanguageMenuActionDesktop";
import { LanguageMenuActionMobile } from "./Responsive/LanguageMenuActionMobile";

export const LanguageMenuAction = () => {
  const DeviceSize = useDeviceSize();
  return (
    <>
      {(DeviceSize === "desktop" || DeviceSize === "tablet") && (
        <LanguageMenuActionDesktop />
      )}
      {DeviceSize === "mobile" && <LanguageMenuActionMobile />}
    </>
  );
};
