import { Box } from "@mui/material";
import { _CategoriesService } from "services/categories.service";

import { CategoriesMenuDesktop } from "./Responsive/CategoriseMenuDesktop";
import { CategorisMenuMobile } from "./Responsive/CategorisMenuMobile";

export const CategoriesMenu = () => {
  return (
    <>
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <CategoriesMenuDesktop />
      </Box>
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <CategorisMenuMobile />
      </Box>
    </>
  );
};
