import { _CategoriesService } from "services/categories.service";
import useDeviceSize from "hooks/useDeviceSize";

import { CategoriesMenuDesktop } from "./Responsive/CategoriseMenuDesktop";
import { CategorisMenuMobile } from "./Responsive/CategorisMenuMobile";

export const CategoriesMenu = () => {
  const DeviceSize = useDeviceSize();
  return (
    <>
      {(DeviceSize === "desktop" || DeviceSize === "tablet") && (
        <CategoriesMenuDesktop />
      )}
      {DeviceSize === "mobile" && <CategorisMenuMobile />}
    </>
  );
};
