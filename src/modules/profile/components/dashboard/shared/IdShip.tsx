import { Box } from "@mui/material";
import React from "react";

interface Props {
  id: number;
}

export const IDship = (props: Props) => {
  return (
    <Box
      sx={{
        backgroundColor: "primary.main",
        color: "gray.active",
        fontSize: "10px",
        borderRadius: "5px",
        padding: "2px 6px",
      }}
    >
      #{props.id}
    </Box>
  );
};
