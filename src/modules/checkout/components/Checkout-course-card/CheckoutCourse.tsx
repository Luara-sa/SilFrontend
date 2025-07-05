import { Box, Rating, Typography } from "@mui/material";
import { StringDouble } from "interface/common";
import Image from "next/image";
import React from "react";

export const CheckoutCourse = (props: {
  name: StringDouble;
  rate?: number;
}) => {
  return (
    <Box
      sx={{
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        backgroundColor: "FFFEFA",
        borderRadius: "10px",
        border: "1px solid #EEEEEE",
        px: "10px",
        py: "9px",
      }}
    >
      <Box sx={{ display: "flex", columnGap: "15px" }}>
        <Box
          sx={{
            position: "relative",
            minWidth: "70px",
            height: "70px",
            overflow: "hidden",
            borderRadius: "5px",
          }}
        >
          <Image
            src="/assets/images/product.png"
            layout="fill"
            objectFit="cover"
            loading="lazy"
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: [18, 18, 18, "0.938vw", "0.938vw"],
              fontWeight: 700,
              color: "gray.50",
              mb: "5px",
            }}
          >
            {props.name.en}
          </Typography>
          <Rating value={props.rate ? props.rate : 0} size="small" readOnly />
        </Box>
      </Box>
    </Box>
  );
};
