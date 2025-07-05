import { Box, Button, Rating, Typography } from "@mui/material";
import { SmallCourseInfo, Teacher } from "components/shared";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { LevelIcon } from "../../../../public/assets/icons/shared/LevelIcon";
import { MaleIcon } from "../../../../public/assets/icons/shared/MaleIcon";
import { VideoIcon } from "../../../../public/assets/icons/shared/VideoIcon";
import { meStore } from "store/meStore";
import { useMe } from "hooks/useMe";

interface Props {
  name: string;
  level?: string;
  gender?: string;
  rating?: number;
  teacherName?: string;
  price?: number;
}

export const CourseCardPathTimeLine = (props: Props) => {
  const [disabled, setDisabled] = useState<boolean>(false);

  const { isLogged } = useMe();
  const { t } = useTranslation("course");
  const me = meStore((state) => state.me);

  useEffect(() => {
    if (isLogged) {
      if (me?.user?.gender === props?.gender || me?.user?.gender === "both") {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    } else {
      setDisabled(false);
    }
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Box
        sx={{
          px: "12px",
          py: "9px",
          display: "flex",
          width: "100%",
          backgroundColor: "#FFFEFA",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box
          sx={{
            width: "70px",
            height: "70px",
            borderRadius: "5px",
            overflow: "hidden",
            mr: "15px",
          }}
        >
          <Box
            sx={{
              backgroundImage: `url()`,
              backgroundColor: "gray.light",
              width: "70px",
              height: "70px",
            }}
          ></Box>
        </Box>
        <Box
          sx={{
            width: "calc(100% - 130px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            rowGap: "5px",
          }}
        >
          <Typography
            sx={{
              color: "gray.50",
              fontSize: "22px !important",
              fontWeight: "700",
            }}
          >
            {props.name}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            {props.level && (
              <SmallCourseInfo
                title={props.level}
                size="small"
                icon={<LevelIcon customcolor="#1E5B63" customsize="small" />}
              />
            )}
            {props.gender && (
              <SmallCourseInfo
                title={props.gender}
                size="small"
                icon={<MaleIcon />}
              />
            )}
            {/* <SmallCourseInfo
              title="level"
              size="small"
              icon={<VideoIcon customcolor="#1E5B63" customsize="small" />}
            /> */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Rating
                max={1}
                size="small"
                readOnly
                value={0.4}
                precision={0.1}
              />
              <Typography
                sx={{
                  fontSize: "10px !important",
                  fontWeight: 700,
                  color: "gray.50",
                }}
              >
                4.1
              </Typography>
            </Box>
            <Teacher
              imageWidth="24px"
              image=""
              name={props.teacherName}
              withTeacher={false}
              nameFontSize={["14px !important"]}
            />
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          backgroundColor: "#EEEEEE",
          px: "14px",
          display: "flex",
          paddingBottom: "4px",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          rowGap: "5px",
        }}
      >
        <Typography
          sx={{
            color: "primary.main",
            fontWeight: "700",
            fontSize: "18px !important",
          }}
        >
          {props.price} {t("sar")}
        </Typography>
        <Button
          variant="default"
          sx={{ borderRadius: "3px" }}
          disabled={disabled}
        >
          {t("reservation")}
        </Button>
      </Box>
    </Box>
  );
};
