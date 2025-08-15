import { Box, Typography } from "@mui/material";
import React from "react";

export type PricingTagType = "free" | "discount";

interface Props {
  variants: PricingTagType | undefined;
  discount?: number;
  price?: number;
}

export const PricingTag = (props: Props) => {
  const { variants, discount, price } = props;
  if (!!variants)
    return (
      <Box
        className="course-card-pricing-tag"
        sx={{
          backgroundColor: variantsObj[variants].backgroundColor,
          position: "absolute",
          bottom: "0",
          width: "100%",
          height: "45px",
          display: "flex",
          alignItems: "center",
          justifyContent: variantsObj[variants].justifyContent,
          color: "gray.active",
          fontSize: "18px",
          fontWeight: "700",
          px: "20px",
          transition: "200ms",
        }}
      >
        <Box sx={{}}>
          {variantsObj[variants].text}{" "}
          {variantsObj[variants].hasPrice &&
            ` ${Number(discount ?? 0).toFixed(2)}%`}
        </Box>
        {/* {variantsObj[variants].hasPrice && (
          <Box
            sx={{
              display: "flex",
              alignItems: "end",
              columnGap: "5px",
            }}
          >
            {Number(price ?? 0).toFixed(2)}
            <Typography sx={{ fontSize: "12px", fontWeight: "700" }}>
              SAR
            </Typography>
          </Box>
        )} */}
      </Box>
    );

  return <></>;
};

const variantsObj = {
  discount: {
    backgroundColor: "#419AF2",
    text: "DISCOUNT",
    justifyContent: "space-between",
    hasPrice: true,
  },
  free: {
    backgroundColor: "#48C94D",
    text: "FREE COURSE",
    justifyContent: "center",
    hasPrice: false,
  },
};
