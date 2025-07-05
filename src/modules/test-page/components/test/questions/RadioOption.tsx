import { Box, Typography } from "@mui/material";
import React, { MouseEvent, useState } from "react";

interface Props {
  borderTop?: boolean;
  borderBottom?: boolean;
  borderBoth?: boolean;
  title: string;
  active?: boolean;
  optioncount: string;
  // onClick: React.MouseEventHandler<HTMLDivElement>;
}

export const RadioOption = (props: Props) => {
  return (
    <Box
      // onClick={(event) => props.onClick(event)}
      sx={{
        display: "flex",
        alignItems: "center",
        columnGap: "20px",
        cursor: "pointer",
      }}
    >
      <Box sx={{ borderRight: "1px solid gray.main", width: "40.5px" }}>
        <Box
          sx={{
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: props.active
              ? "rgba(76, 175, 80, 0.5)"
              : "#D9D9D9",
            color: props.active ? "primary.main" : "gray.main",
            borderRadius: "10px 0 0 10px",
            fontSize: "14px",
          }}
        >
          {props.optioncount}
        </Box>
      </Box>
      <Typography sx={{ fontSize: "14px" }}>{props.title}</Typography>
    </Box>
  );
};
