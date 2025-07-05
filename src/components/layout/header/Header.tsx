import React from "react";
import { _AuthService } from "services/auth.service";
import { _WithAuthService } from "services/withAuth.service";
import { HeaderMobile } from "./Responsive/HeaderMobile";
import useDeviceSize from "hooks/useDeviceSize";
import { HeaderDesktop } from "./Responsive/HeaderDesktop";

export const Header = () => {
  const DeviceSize = useDeviceSize();
  const handleClick = () => {
    _WithAuthService
      .testNotification()
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  return (
    <>
      {(DeviceSize === "desktop" || DeviceSize === "tablet") && (
        <HeaderDesktop />
      )}
      {DeviceSize === "mobile" && <HeaderMobile />}
    </>
  );
};
