import React from "react";
import { useRouter } from "next/router";

import useTranslation from "next-translate/useTranslation";

import { Swiper, SwiperSlide } from "swiper/react";
import { Box, Typography } from "@mui/material";

import { Navigation, Pagination, Scrollbar, A11y } from "swiper";

import { useCourseSectionSlider } from "../../hooks";
import { Course } from "interface/common";

import { ArrowLeft, ArrowRight, CourseCard } from "components/shared";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

interface Props {
  courses: Course[];
}

export const CoursesSection = (props: Props) => {
  const { num } = useCourseSectionSlider();
  const { t } = useTranslation("home");
  const { locale } = useRouter();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        py: "100px",
        // minHeight: "100vh",
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
            {t("courses")}
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
            spaceBetween={20}
            dir={locale === "en" ? "ltr" : "rtl"}
            // centeredSlides={true}
            pagination={{
              clickable: true,
            }}
            slidesPerView={num}
            loop
          >
            <ArrowRight />
            <ArrowLeft />
            <Box
              sx={{
                display: "flex",
                columnGap: "20px",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {props.courses.map((course) => (
                <SwiperSlide
                  key={course.id}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <CourseCard
                    id={course.id}
                    name={(course.name as any).en}
                    hours={course.hours}
                    image={course.image}
                    level={course.level}
                    price={course.price}
                    rate={course.rate}
                    type={course.type}
                    lessonCount={course?.sessions.length}
                    discount={course.discount}
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
