import React, { FC } from "react";
import { Box, Typography } from "@mui/material";

interface SmallInfoProps {
  title: string;
  icon: any;
  size?: "small" | "large";
}

export const SmallCourseInfo: FC<SmallInfoProps> = (props) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        columnGap: { xs: "4px", sm: "2px" },
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "center",
        minWidth: { xs: "60px", sm: "auto" },
      }}
    >
      {props.icon}
      <Typography
        sx={{
          fontSize:
            props.size === "small"
              ? {
                  xs: "10px !important",
                  sm: "10px !important",
                  md: "11px !important",
                  lg: "12px !important",
                }
              : { xs: "12px", sm: "13px", md: "14px" },
          color: "gray.50",
          textAlign: "center",
          lineHeight: 1.2,
          whiteSpace: "nowrap",
        }}
      >
        {props.title}
      </Typography>
    </Box>
  );
};
