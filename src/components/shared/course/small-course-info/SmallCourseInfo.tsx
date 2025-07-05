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
        columnGap: "2px",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      {props.icon}
      <Typography
        sx={{
          fontSize:
            // Why important !? because the library (react-vertical-timeline-component)
            // override the css styles; we should find better solution
            props.size === "small"
              ? [
                  "10px !important",
                  "10px !important",
                  "11px !important",
                  "12px !important",
                  "12px !important",
                ]
              : [],
          color: "gray.50",
          textAlign: "center",
        }}
      >
        {props.title}
      </Typography>
    </Box>
  );
};
