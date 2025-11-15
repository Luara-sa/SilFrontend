import React from "react";
import { Box } from "@mui/material";
import { PlacementTestButtonDesktop } from "./Responsive/PlacementTestButtonDesktop";
import { PlacementTestButtonMobile } from "./Responsive/PlacementTestButtonMobile";

export const PlacementTestButton = () => {
  return (
    <>
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <PlacementTestButtonDesktop />
      </Box>
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <PlacementTestButtonMobile />
      </Box>
    </>
  );
};
