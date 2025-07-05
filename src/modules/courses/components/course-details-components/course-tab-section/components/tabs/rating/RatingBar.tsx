import { Typography, Box } from "@mui/material";
import React from "react";

interface Props {
  width: number;
}

export const RatingBar = (props: Props) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "5px",
        backgroundColor: "#D9D9D9",
        borderRadius: "5px",
      }}
    >
      <Box
        sx={{
          width: `${props.width}%`,
          maxWidth: "100%",
          height: "5px",
          backgroundColor: "primary.main",
          borderRadius: "5px",
        }}
      ></Box>
    </Box>
  );
};
