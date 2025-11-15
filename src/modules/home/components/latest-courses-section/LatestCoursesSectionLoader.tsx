import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import { CourseCardLoader } from "components/shared/loader/LoaderCard/CourseCardLoader";

export const LatestCoursesSectionLoader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        py: { xs: "50px", md: "100px" },
        backgroundColor: "#f9f9f9",
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", sm: "95%", md: "80%" },
          px: { xs: 2, sm: 3, md: 0 },
        }}
      >
        <Box sx={{ mb: { xs: "30px", md: "50px" } }}>
          <Box
            sx={{
              width: "200px",
              height: "45px",
              backgroundColor: "#e0e0e0",
              borderRadius: "4px",
            }}
          />
        </Box>

        <Grid container spacing={3}>
          {[1, 2, 3].map((index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <CourseCardLoader />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

