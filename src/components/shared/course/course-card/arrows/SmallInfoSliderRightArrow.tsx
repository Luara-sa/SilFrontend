import React from "react";

import { useSwiper } from "swiper/react";

import { Box, Typography } from "@mui/material";

import ArrowRightTwoTone from "@mui/icons-material/ArrowRightTwoTone";
import { useRouter } from "next/router";

interface Props {
  isDiabled: boolean;
  setDiabled: any;
}

export const SmallInfoSliderRightArrow = (props: Props) => {
  const swiper = useSwiper();
  const { locale } = useRouter();
  const handleNext = async () => {
    await swiper.slideNext();
    if (swiper.isBeginning)
      props.setDiabled((old: any) => ({ right: false, left: true }));
    else props.setDiabled((old: any) => ({ right: true, left: false }));
  };

  return (
    <Box
      onClick={() => handleNext()}
      sx={{
        position: "absolute",
        cursor: "pointer",
        right: "-10px",
        top: "0px",
        backgroundColor: "#FFFEFA",
        zIndex: "2",
        border: "none",
        width: "40px",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        userSelect: "none",
        transform: locale === "ar" ? "rotate(180deg)" : "rotate(0deg)",
      }}
    >
      <ArrowRightTwoTone
        sx={{
          color: props.isDiabled ? "gray.main" : "primary.main",
          fontSize: "30px",
        }}
      />
    </Box>
  );
};
