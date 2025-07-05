import React, { ReactNode } from "react";

import { Box, Typography } from "@mui/material";
import { coursesStore } from "store/coursesStore";

interface Props {
  children: ReactNode;
}

export const CoursesFiltersBox = ({ children }: Props) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: { xs: "100%", md: "80vw" },
          flexDirection: "column",
          px: { xs: "8px", md: "0" },
        }}
      >
        {children}
      </Box>
      <SelectedSectionText />
    </Box>
  );
};

const SelectedSectionText = () => {
  const selectValue = coursesStore((state) => state.selectValue);

  return (
    <Box
      sx={{
        width: { xs: "100%", md: "80vw" },
        paddingTop: "1rem",
        display: "flex",
        justifyContent: { xs: "center", md: "start" },
      }}
    >
      <Typography
        sx={{
          fontSize: "30px",
          fontWeight: "700",
          color: "primary.main",
          textTransform: "capitalize",
        }}
      >
        {selectValue}
      </Typography>
    </Box>
  );
};
