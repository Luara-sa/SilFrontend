import React from "react";

import { Typography, Box } from "@mui/material";

import { courseStore } from "store/courseStore";

import { ReviewRating } from "./ReviewRating";
import { ReviewComment } from "./ReviewComment";

export const ReviewsTab = () => {
  const [course] = courseStore((state) => [state.course]);

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Box
        sx={{
          width: "100%",
          px: { xs: "0", md: "20px" },
        }}
      >
        <Typography
          sx={{ fontSize: "20px", color: "wood.main", fontWeight: 700 }}
        >
          How students rated this course
        </Typography>
        <Box sx={{ pb: "40px", borderBottom: "2px solid #EEEEEE" }}>
          <ReviewRating />
        </Box>
        <Box>
          {course &&
            course?.rating_list.map((rate, index) => (
              <ReviewComment rate={rate} key={index} />
            ))}
        </Box>
      </Box>
    </Box>
  );
};
