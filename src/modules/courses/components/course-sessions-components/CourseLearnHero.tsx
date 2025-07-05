import { Box, Typography } from "@mui/material";
import React from "react";

interface Props {
  title: string;
}

export const CourseLearnHero = (props: Props) => {
  return (
    <Box
      sx={{
        backgroundImage: "url('/assets/images/shared/Intersect.png')",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "rgba(12, 128, 144, 0.9)",
        }}
      >
        <Box
          sx={{
            py: "45px",
            width: { xs: "90vw", lg: "60vw" },
            minWidth: { lg: "970px", xl: "1148px" },
          }}
        >
          <Typography
            sx={{ fontSize: "38px", fontWeight: "700", color: "gray.active" }}
          >
            {props.title}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
