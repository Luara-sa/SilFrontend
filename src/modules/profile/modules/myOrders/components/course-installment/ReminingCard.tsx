import React from "react";
import { Card, Typography, Box } from "@mui/material";
import useTranslation from "next-translate/useTranslation";

export const ReminingCard = (props: { sum: number }) => {
  const { t } = useTranslation("course");
  return (
    <Card
      sx={{
        width: "158px",
        height: "77px",
        background: "#FFF3CF",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        padding: "15px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        borderRadius: "15px",
      }}
    >
      <Typography
        sx={{
          fontSize: "12px",
          color: "#555555",
          lineHeight: "15px",
          fontWeight: "400",
        }}
      >
        {t("remining amount")}
      </Typography>

      <Box sx={{ display: "flex", gap: "3px", alignItems: "baseline" }}>
        <Typography
          sx={{
            fontSize: "18px",
            color: "primary.main",
            fontWeight: "700",
          }}
        >
          {props?.sum}
        </Typography>
        <Typography
          sx={{
            fontSize: "13px",
            color: "primary.main",
            fontWeight: "700",
          }}
        >
          {t("sar")}
        </Typography>
      </Box>
    </Card>
  );
};
