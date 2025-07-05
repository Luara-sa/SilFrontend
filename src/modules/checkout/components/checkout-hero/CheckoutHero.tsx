import { Typography, Box } from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export const CheckoutHero = () => {
  const { t } = useTranslation("checkout");
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
        <Box sx={{ width: "80vw", py: "45px" }}>
          <Typography
            sx={{ fontSize: "38px", fontWeight: "700", color: "gray.active" }}
          >
            {t("checkout")}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
