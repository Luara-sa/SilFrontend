import React from "react";

import { Box, Rating, Typography } from "@mui/material";

import { IReviewsReport } from "interface/common";

import { RatingBar } from "./RatingBar";

interface Props {
  reviewsReportObject?: Record<number, IReviewsReport & { percent: number }>;
}

export const LinesBarWraper = ({ reviewsReportObject }: Props) => {
  return (
    <>
      {[5, 4, 3, 2, 1].map((rateNumber, index) => (
        <Box
          key={index}
          sx={{ display: "flex", alignItems: "center", columnGap: "20px" }}
        >
          <Box sx={{ width: "69%" }}>
            <RatingBar
              width={
                reviewsReportObject && reviewsReportObject[rateNumber]
                  ? reviewsReportObject[rateNumber]?.percent
                  : 0
              }
            />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", columnGap: "8px" }}>
            <Rating
              value={rateNumber}
              size="small"
              readOnly
              sx={{ "& .MuiRating-iconFilled": { color: "primary.main" } }}
            />
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 700,
                color: "primary.main",
              }}
            >
              {reviewsReportObject && reviewsReportObject[rateNumber]
                ? reviewsReportObject[rateNumber]?.percent
                : 0}
              %
            </Typography>
          </Box>
        </Box>
      ))}
    </>
  );
};
