import React from "react";

import { Box, CircularProgress } from "@mui/material";

export const TotalCardLoader = () => {
  return (
    <Box
      sx={{
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
        borderRadius: "10px",
        border: "2px solid #EEEEEE",
        backgroundColor: "#FFFEFA",
        p: "18px",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress />
    </Box>
  );
};
