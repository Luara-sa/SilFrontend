import React from "react";
import { Box } from "@mui/material";
import { _AuthService } from "services/auth.service";
import { _WithAuthService } from "services/withAuth.service";
import { HeaderMobile } from "./Responsive/HeaderMobile";
import { HeaderDesktop } from "./Responsive/HeaderDesktop";

export const Header = () => {
  const handleClick = () => {
    _WithAuthService
      .testNotification()
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <HeaderDesktop />
      </Box>
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <HeaderMobile />
      </Box>
    </>
  );
};
