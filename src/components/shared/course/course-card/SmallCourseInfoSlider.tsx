import React, { useState } from "react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
// import "swiper/css/navigation";

// import required modules
import { FreeMode, Pagination, Navigation, A11y, Scrollbar } from "swiper";
import { Swiper as SwiperContaier, SwiperSlide } from "swiper/react";
import { SmallCourseInfo } from "../small-course-info/SmallCourseInfo";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import Man2OutlinedIcon from "@mui/icons-material/Man2Outlined";

import { TimeIcon } from "../../../../../public/assets/icons/shared/Time";
import { VideoIcon } from "../../../../../public/assets/icons/shared/VideoIcon";
import { LevelIcon } from "../../../../../public/assets/icons/shared/LevelIcon";
import { MaleIcon } from "../../../../../public/assets/icons/shared/MaleIcon";
import { SmallInfoSliderleftArrow } from "./arrows/SmallInfoSliderleftArrow";
import { SmallInfoSliderRightArrow } from "./arrows/SmallInfoSliderRightArrow";

interface Props {
  hours?: number;
  level?: string;
  type?: string;
  lessonCount?: number;
  isFourInfoDisplyed?: boolean;
}

export const SmallCourseInfoSlider = ({
  hours,
  lessonCount,
  level,
  type,
  isFourInfoDisplyed,
}: Props) => {
  const [isArrowDisabled, setIsArrowDisabled] = useState({
    left: true,
    right: false,
  });

  return (
    <SwiperContaier
      style={{
        position: "initial",
        backgroundColor: "#FFFEFA",
        padding: "4px 0",
        display: "flex",
        alignItems: "center",
      }}
      cssMode={true}
      spaceBetween={isFourInfoDisplyed ? 12 : 16}
      freeMode={true}
      slidesPerView="auto"
      pagination={{
        clickable: true,
      }}
      navigation={{
        nextEl: ".image-swiper-button-next",
        prevEl: ".image-swiper-button-prev",
        disabledClass: "swiper-button-disabled",
      }}
      modules={[Navigation, Scrollbar, A11y]}
      className="small-course-info-slider"
    >
      {isFourInfoDisplyed && (
        <>
          <SmallInfoSliderRightArrow
            isDiabled={isArrowDisabled.right}
            setDiabled={setIsArrowDisabled}
          />
          <SmallInfoSliderleftArrow
            isDiabled={isArrowDisabled.left}
            setDiabled={setIsArrowDisabled}
          />
        </>
      )}

      {hours && (
        <SwiperSlide
          style={{
            width: "auto",
            marginRight: "8px",
            display: "flex",
            alignItems: "center",
            height: "auto",
          }}
        >
          <SmallCourseInfo
            title={`${hours} hours`}
            icon={<AccessTimeIcon sx={{ color: "#1E5B63", width: "13px" }} />}
          />
        </SwiperSlide>
      )}

      {type && (
        <SwiperSlide
          style={{
            width: "auto",
            marginRight: "8px",
            display: "flex",
            alignItems: "center",
            height: "auto",
          }}
        >
          <SmallCourseInfo
            title={type}
            icon={<Man2OutlinedIcon sx={{ color: "#1E5B63", width: "13px" }} />}
          />
        </SwiperSlide>
      )}

      {lessonCount && (
        <SwiperSlide
          style={{
            width: "auto",
            marginRight: "8px",
            display: "flex",
            alignItems: "center",
            height: "auto",
          }}
        >
          <SmallCourseInfo
            title={`${lessonCount} Lessons`}
            icon={
              <PlayCircleOutlineIcon sx={{ color: "#1E5B63", width: "13px" }} />
            }
          />
        </SwiperSlide>
      )}

      {level && (
        <SwiperSlide
          style={{
            width: "auto",
            display: "flex",
            alignItems: "center",
            height: "auto",
          }}
        >
          <SmallCourseInfo
            title={level}
            icon={<LevelIcon customsize="small" />}
          />
        </SwiperSlide>
      )}
    </SwiperContaier>
  );
};
