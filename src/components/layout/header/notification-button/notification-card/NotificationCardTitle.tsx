import React from "react";

import { Box, Typography } from "@mui/material";

import { notificationTextStyle } from "../helper";

interface NotificationTitleProps {
  title: string;
  date: string;
}

export const NotificationTitle = (props: NotificationTitleProps) => {
  const { date, title } = props;

  const isTitleLong = title?.length > 20;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: isTitleLong ? "column" : "row",
          alignItems: isTitleLong ? "start" : "center",
        }}
      >
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: "600",
            ...notificationTextStyle,
            mb: isTitleLong ? "0" : "5px",
          }}
        >
          {title}
        </Typography>
        <Box
          sx={{
            borderLeft: isTitleLong
              ? "none"
              : "0.5px solid rgba(30, 91, 99, 0.5)",
            pl: isTitleLong ? "0" : "5px",
            ml: isTitleLong ? "0" : "5px",
          }}
        >
          <Typography
            sx={{ color: "primary.main", fontSize: "9px", fontWeight: "500" }}
          >
            {date}
          </Typography>
        </Box>
      </Box>
    </>
  );
};
