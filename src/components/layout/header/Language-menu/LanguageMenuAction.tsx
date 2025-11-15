import React from "react";
import { Box } from "@mui/material";
import { LanguageMenuActionDesktop } from "./Responsive/LanguageMenuActionDesktop";
import { LanguageMenuActionMobile } from "./Responsive/LanguageMenuActionMobile";

export const LanguageMenuAction = () => {
  return (
    <>
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <LanguageMenuActionDesktop />
      </Box>
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <LanguageMenuActionMobile />
      </Box>
    </>
  );
};
