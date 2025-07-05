import React, { useMemo } from "react";

import { Typography, Box, Rating } from "@mui/material";

import { courseStore } from "store/courseStore";
import { IReviewsReport } from "interface/common";

import { LinesBarWraper } from "./LinesBarWraper";

export const ReviewRating = () => {
  const [course] = courseStore((state) => [state.course]);

  const totalReviewNumber = course?.rating_list.length;

  const reviewsReportObject = useMemo(
    () =>
      course?.reviews_report?.reduce((acc, curr) => {
        acc[curr.rate_number] = {
          ...curr,
          percent: totalReviewNumber
            ? (curr.count / totalReviewNumber) * 100
            : 0,
        };
        return acc;
      }, {} as Record<number, IReviewsReport & { percent: number }>),
    [totalReviewNumber, course?.reviews_report]
  );

  return (
    <Box
      sx={{
        display: "flex",
        columnGap: "20px",
        alignItems: "center",
        minHeight: "120px",
      }}
    >
      {/* number */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{ fontSize: "60px", fontWeight: 700, color: "primary.main" }}
        >
          {course?.rate}
        </Typography>
        <Rating
          size="small"
          value={course?.rate}
          precision={0.1}
          readOnly
          sx={{ "& .MuiRating-iconFilled": { color: "primary.main" } }}
        />
        <Typography>(Based on {totalReviewNumber} reviews)</Typography>
      </Box>
      {/* Line bars */}
      <Box sx={{ width: "80%" }}>
        <LinesBarWraper reviewsReportObject={reviewsReportObject} />
      </Box>
    </Box>
  );
};
