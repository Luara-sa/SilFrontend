import React from "react";
import { useSwiper } from "swiper/react";

import { Box } from "@mui/material";
import Image from "next/image";
import { settingsStore } from "store/settingsStore";
import { useRouter } from "next/router";

export const ArrowLeft = () => {
  const swiper = useSwiper();
  const { locale } = useRouter();

  return (
    <Box
      onClick={() => swiper.slidePrev()}
      sx={{
        position: "absolute",
        cursor: "pointer",
        left: { xs: "20px", md: "-90px" },
        top: "30%",
        backgroundColor: "gray.light",
        zIndex: "1",
        border: "5px solid",
        borderColor: "wood.main",
        borderRadius: "50%",
        width: { xs: "40px", md: "60px" },
        height: { xs: "40px", md: "60px" },
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        userSelect: "none",
        transform: locale === "ar" ? "rotate(180deg)" : "rotate(0deg)",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: { xs: "16px", md: "25px" },
          height: { xs: "10px", md: "20px" },
        }}
      >
        <Image
          src="/assets/icons/shared/left-arrow.svg"
          layout="fill"
          objectFit="contain"
          alt="arrow"
        />
      </Box>
    </Box>
  );
};
