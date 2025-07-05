import React, { useEffect } from "react";
import { useSwiper } from "swiper/react";

import { Box } from "@mui/material";
import Image from "next/image";
import { settingsStore } from "store/settingsStore";
import { useRouter } from "next/router";

export const ArrowRight = () => {
  const swiper = useSwiper();
  const { locale } = useRouter();

  useEffect(() => {
    console.log(locale);
  }, [locale]);

  return (
    <Box
      onClick={() => swiper.slideNext()}
      sx={{
        position: "absolute",
        cursor: "pointer",
        right: { xs: "20px", md: "-90px" },
        top: "30%",
        backgroundColor: "gray.light",
        zIndex: "1",
        border: "solid",
        borderWidth: { xs: "3.5px", md: "5px" },
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
          src="/assets/icons/shared/right-arrow.svg"
          layout="fill"
          objectFit="contain"
          alt="arrow"
        />
      </Box>
    </Box>
  );
};
