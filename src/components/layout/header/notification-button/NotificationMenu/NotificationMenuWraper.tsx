import { Box } from "@mui/material";
import React from "react";

import { NotificationMenu } from "./NotificationMenu";
import { NotificationMenuFooter } from "./NotificationMenuFooter";
import { NotificationMenuHeader } from "./NotificationMenuHeader";

export const NotificationMenuWraper = () => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #EEEEEE",
          py: "15px",
          px: "20px",
          backgroundColor: "#FFFEFA",
        }}
      >
        <NotificationMenuHeader />
      </Box>
      <NotificationMenu />
      <NotificationMenuFooter />
    </>
  );
};
