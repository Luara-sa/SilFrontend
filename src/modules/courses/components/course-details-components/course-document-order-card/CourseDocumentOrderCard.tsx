import React from "react";

import useTranslation from "next-translate/useTranslation";

import { Box, Button, Typography } from "@mui/material";

import { CourseDocumentOrderAction } from "./CourseDocumentOrderAction";

import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";

export const CourseDocumentOrderCard = () => {
  const { t } = useTranslation("course");
  return (
    <Box
      sx={{
        px: "10px",
        py: "15px",
        backgroundColor: "#FFFEFA",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.4)",
        borderRadius: "5px",
      }}
    >
      <Box
        sx={{
          borderBottom: "1px solid rgba(0, 0, 0, 0.25)",
          px: "20px",
          pb: "10px",
        }}
      >
        <Typography
          sx={{ color: "primary.main", fontSize: "18px", fontWeight: "700" }}
        >
          {t("document")}
        </Typography>
      </Box>
      <Box sx={{ pt: "10px", display: "flex", justifyContent: "center" }}>
        <CourseDocumentOrderAction />
      </Box>
    </Box>
  );
};
