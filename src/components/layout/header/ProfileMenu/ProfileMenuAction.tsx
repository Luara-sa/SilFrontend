import useDeviceSize from "hooks/useDeviceSize";
import { ProfileMenuActionDesktop } from "./Responsive/ProfileMenuActionDesktop";
import { ProfileMenuActionMobile } from "./Responsive/ProfileMenuActionMobile";
export const ProfileMenuAction = () => {
  const DeviceSize = useDeviceSize();
  return (
    <>
      {(DeviceSize === "desktop" || DeviceSize === "tablet") && (
        <ProfileMenuActionDesktop />
      )}
      {DeviceSize === "mobile" && <ProfileMenuActionMobile />}
    </>
  );
};
