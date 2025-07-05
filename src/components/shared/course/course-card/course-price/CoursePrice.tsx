import { Box, Divider, Typography } from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export const CoursePrice = ({
  price,
  disable,
  originalPrice,
  discountedPrice,
  currency = "SAR",
}: {
  price: number;
  disable: boolean;
  originalPrice?: number;
  discountedPrice?: number;
  currency?: string;
}) => {
  const { t } = useTranslation();

  // Determine which prices to display
  const hasDiscount =
    discountedPrice && originalPrice && discountedPrice < originalPrice;
  const displayPrice = hasDiscount ? discountedPrice : price;
  const originalPriceToShow = hasDiscount ? originalPrice : null;

  // Format currency display
  const formatPrice = (priceValue: number) => {
    if (currency && currency.includes("SAR")) {
      return `${priceValue} ${currency}`;
    }
    return `${priceValue} ${currency || t("sar")}`;
  };

  if (disable && hasDiscount) {
    // Show discounted price with crossed out original price
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        <Box sx={{ position: "relative", mb: 0.5 }}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              width: "100%",
              height: "1px",
              backgroundColor: "error.main",
            }}
          />
          <Typography
            sx={{
              fontSize: [10, 11, 12, 13, 14],
              fontWeight: "500",
              color: "text.secondary",
            }}
          >
            {formatPrice(originalPriceToShow!)}
          </Typography>
        </Box>
        <Typography
          sx={{
            fontSize: [12, 13, 14, 15, 18],
            fontWeight: "700",
            color: "success.main",
          }}
        >
          {formatPrice(displayPrice)}
        </Typography>
      </Box>
    );
  }

  if (disable) {
    // Free course or other disabled state
    return (
      <Box sx={{ position: "relative" }}>
        <Box
          sx={{
            position: "absolute",
            top: "60%",
            width: "100%",
            height: "2px",
            backgroundColor: "primary.main",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "40%",
            width: "100%",
            height: "2px",
            backgroundColor: "primary.main",
          }}
        />
        <Typography
          sx={{
            fontSize: [12, 13, 14, 15, 18],
            fontWeight: "700",
            color: "#8fadaf",
          }}
        >
          {formatPrice(price)}
        </Typography>
      </Box>
    );
  }

  return (
    <Typography
      sx={{
        fontSize: [12, 13, 14, 15, 18],
        fontWeight: "700",
        color: "primary.main",
      }}
    >
      {formatPrice(displayPrice)}
    </Typography>
  );
};
