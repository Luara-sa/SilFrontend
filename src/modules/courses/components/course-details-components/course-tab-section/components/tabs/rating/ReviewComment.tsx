import React from "react";
import Image from "next/image";

import { Typography, Box, Avatar, Rating } from "@mui/material";

import { Rate } from "interface/common";
import { dateToString } from "helper/dateToString";

interface Props {
  rate: Rate;
}

export const ReviewComment = (props: Props) => {
  const { rate } = props;

  return (
    <Box sx={{ py: "25px", borderBottom: "1px solid #EEEEEE" }}>
      <Box sx={{ display: "flex", columnGap: "15px" }}>
        <Box
          sx={{
            width: "60px",
            height: "60px",
            border: "3px solid #FFD700",
            position: "relative",
            borderRadius: "50%",
            overflow: "hidden",
          }}
        >
          <Image
            src={rate.personal_image ?? ""}
            layout="fill"
            objectFit="cover"
            loading="lazy"
          />
        </Box>
        <Box>
          {/* Name */}
          <Box sx={{ display: "flex", columnGap: "5px", alignItems: "end" }}>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "700",
                color: "primary.main",
              }}
            >
              {rate.username}
            </Typography>
            <Typography sx={{ fontSize: "10px", color: "primary.main" }}>
              {dateToString(rate.created_at)}
            </Typography>
          </Box>
          {/* Rating */}
          <Box sx={{ mt: "9px" }}>
            <Rating
              value={rate.rate_number}
              size="small"
              readOnly
              precision={0.1}
              sx={{ "& .MuiRating-iconFilled": { color: "primary.main" } }}
            />
          </Box>
          {/* Text Review */}
          {rate.rate_message && (
            <Box sx={{ mt: "9px" }}>
              <Typography sx={{ color: "#888888", fontSize: "12px" }}>
                {rate.rate_message}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
