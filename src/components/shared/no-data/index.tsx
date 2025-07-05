import { Typography } from "@mui/material";
import React from "react";

export const NoData = () => {
  return (
    <Typography sx={{ color: "primary.main", fontSize: "16px" }}>
      There is no result
    </Typography>
  );
};
