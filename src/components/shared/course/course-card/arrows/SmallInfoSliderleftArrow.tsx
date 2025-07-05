import React, { useEffect, useState } from "react";

import { useSwiper, useSwiperSlide } from "swiper/react";

import { Box, Typography } from "@mui/material";

import ArrowLeftTwoToneIcon from "@mui/icons-material/ArrowLeftTwoTone";
import { useRouter } from "next/router";

interface Props {
  isDiabled: boolean;
  setDiabled: any;
}

export const SmallInfoSliderleftArrow = (props: Props) => {
  const swiper = useSwiper();
  const { locale } = useRouter();
  const handlePrev = async () => {
    await swiper.slidePrev();
    if (swiper.isBeginning)
      props.setDiabled((old: any) => ({ right: false, left: true }));
    else props.setDiabled((old: any) => ({ right: true, left: false }));
  };

  return (
    <Box
      onClick={() => handlePrev()}
      sx={{
        position: "absolute",
        cursor: "pointer",
        left: "-10px",
        top: "0px",
        backgroundColor: "#FFFEFA",

        // backgroundColor: "red",
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
      <ArrowLeftTwoToneIcon
        sx={{
          color: props.isDiabled ? "gray.main" : "primary.main",
          fontSize: "30px",
        }}
      />
    </Box>
  );
};
