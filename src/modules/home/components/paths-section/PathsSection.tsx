import React from "react";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";

import { useCourseSectionSlider } from "modules/home/hooks";

import { Box, Typography } from "@mui/material";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";

import { Path } from "interface/common";

import { ArrowLeft, ArrowRight, PathCard } from "components/shared";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

interface Props {
  paths: Path[];
}

export const PathsSection = (props: Props) => {
  const { locale } = useRouter();
  const { t } = useTranslation("home");
  const { num } = useCourseSectionSlider();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        pb: "120px",
      }}
    >
      <Box sx={{ width: { xs: "100vw", md: "80%" } }}>
        <Box sx={{ mb: "50px" }}>
          <Typography
            sx={{
              fontSize: [32, 35, 37, 40, 45],
              fontWeight: "700",
              color: "primary.main",
              textAlign: { xs: "center", md: "start" },
            }}
          >
            {t("paths")}
          </Typography>
        </Box>
        <Box sx={{ position: "relative" }}>
          <Swiper
            key={`${locale}-swiper`}
            style={{
              position: "initial",
              padding: "20px 3px 70px",
              //   "--swiper-pagination-color": "#CBA770",
            }}
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            dir={locale === "en" ? "ltr" : "rtl"}
            spaceBetween={20}
            // centeredSlides={true}
            pagination={{
              clickable: true,
            }}
            slidesPerView={num}
            loop
          >
            <ArrowLeft />
            <ArrowRight />
            <Box
              sx={{ display: "flex", columnGap: "20px", flexDirection: "row" }}
            >
              {props.paths.map((path) => (
                <SwiperSlide
                  key={path.id}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <PathCard
                    name={path.name}
                    image={path.image}
                    pathId={path.id}
                    courseCount={path.courses_count}
                  />
                </SwiperSlide>
              ))}
            </Box>
          </Swiper>
        </Box>
      </Box>
    </Box>
  );
};
