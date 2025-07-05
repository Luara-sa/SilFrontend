import { Typography, Box, Rating, Divider } from "@mui/material";
import { SmallCourseInfo, Teacher } from "components/shared";
import React from "react";
import { LevelIcon } from "../../../../../public/assets/icons/shared/LevelIcon";
import { PersonIcon } from "../../../../../public/assets/icons/shared/PersonIcon";
import { TimeIcon } from "../../../../../public/assets/icons/shared/Time";
import {
  StudentStatus,
  StudentStatusProperties,
} from "modules/courses/helper/StudentStatusProperties";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { StringDouble } from "interface/common";

interface Props {
  hours?: string | number;
  level?: string;
  rate?: number;
  teacherName?: string;
  teacherImage?: string;
  student_status?: StudentStatus;
}

export const CourseOutlineSection = (props: Props) => {
  const { t } = useTranslation("course");
  const { locale } = useRouter();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
        py: "11px",
        minHeight: "60px",
      }}
    >
      <Box
        sx={{
          width: { xs: "95vw", lg: "60vw" },
          minWidth: { lg: "970px", xl: "1148px" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: { xs: "100%", lg: "65%" },
            minWidth: { xs: "none", lg: "643px" },
          }}
        >
          <Box
            sx={{
              borderRight: { xs: "none", md: "1px solid rgba(0, 0, 0, 0.2)" },
              pr: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {props.teacherName && (
              <Teacher
                image={props.teacherImage}
                name={props.teacherName}
                withTeacher={true}
                nameFontSize={[12, 12, 16, "0.938vw", "0.938vw"]}
              />
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: "10px",
              width: { xs: "70%", md: "30%" },
            }}
          >
            {props.hours && (
              <SmallCourseInfo
                title={`${props.hours} ${t("hours")}`}
                icon={<TimeIcon customcolor="gray.50" customsize="large" />}
              />
            )}
            {props.level && (
              <SmallCourseInfo
                title={props.level}
                icon={<LevelIcon customcolor="gray.50" customsize="large" />}
              />
            )}
            <SmallCourseInfo
              title={`5 ${t("enrolled")}`}
              icon={<PersonIcon customcolor="gray.50" customsize="large" />}
            />
            <Divider
              sx={{
                width: "40px",
                transform: "rotate(90deg)",
              }}
            />
          </Box>

          <Box
            sx={{
              alignItems: "center",
              columnGap: "10px",
              display: { xs: "none", lg: "flex" },
            }}
          >
            <Rating
              name="simple-controlled"
              value={props.rate}
              size="small"
              readOnly
              precision={0.1}
            />
            <Typography sx={{ color: "gray.50", fontSize: ["12px"] }}>
              {props.rate ? props.rate : 0}/5
            </Typography>
          </Box>
          <Divider
            sx={{ border: { xs: "none", md: "1px solid rgba(0, 0, 0, 0.2);" } }}
          />
          {props?.student_status && (
            <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Typography
                sx={{ fontWeight: "700", fontSize: "14px", color: "#555555" }}
              >
                {t("status")} :
              </Typography>
              <Box
                sx={{
                  backgroundColor:
                    StudentStatusProperties[props?.student_status]
                      .primaryBackground,
                  color:
                    StudentStatusProperties[props?.student_status].primaryColor,
                  padding: "3px 5px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "89px",
                  height: "21px",
                  borderRadius: "10px",
                  fontWeight: "700",
                  fontSize: "12px",
                }}
              >
                {
                  StudentStatusProperties[props?.student_status].buttonText[
                    locale as keyof StringDouble
                  ]
                }
              </Box>
            </Box>
          )}

          {/* <CourseStopContinueButton type="stopped" /> */}
        </Box>
      </Box>
    </Box>
  );
};
