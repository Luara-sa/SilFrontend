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
      // slidesPerView={3}
      style={{ position: "initial", backgroundColor: "#FFFEFA" }}
      cssMode={true}
      spaceBetween={isFourInfoDisplyed ? 10 : 20}
      freeMode={true}
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
        <SwiperSlide>
          <SmallCourseInfo
            title={`${hours} hours`}
            icon={<AccessTimeIcon sx={{ color: "#1E5B63", width: "13px" }} />}
          />
        </SwiperSlide>
      )}

      <SwiperSlide>
        {type && (
          <SmallCourseInfo
            title={type}
            icon={<Man2OutlinedIcon sx={{ color: "#1E5B63", width: "13px" }} />}
          />
        )}
      </SwiperSlide>

      {lessonCount && (
        <SwiperSlide>
          <SmallCourseInfo
            title={`${lessonCount} Lessons`}
            icon={
              <PlayCircleOutlineIcon sx={{ color: "#1E5B63", width: "13px" }} />
            }
          />
        </SwiperSlide>
      )}

      <SwiperSlide>
        {level && (
          <SmallCourseInfo
            title={level}
            icon={<LevelIcon customsize="small" />}
          />
        )}
      </SwiperSlide>
    </SwiperContaier>
  );
};
