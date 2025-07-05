import React, { useEffect } from "react";

import { Box, useTheme } from "@mui/material";

import { useMe } from "hooks/useMe";
import { _CourseService } from "services/course.service";
import { courseStore } from "store/courseStore";
import { Course } from "interface/common";

import {
  CourseHeroSection,
  CourseOutlineSection,
  CourseTabSection,
  CourseVideoCart,
} from "modules";
import { StudentStatus } from "modules/courses/helper/StudentStatusProperties";
import { useRouter } from "next/router";

interface Props {
  course: Course;
  courseId: string;
}

const CourseById = (props: Props) => {
  const theme = useTheme();
  const { loading, me } = useMe();

  const [course, setCourse, clearCourseStore] = courseStore((state) => [
    state.course,
    state.setCourse,
    state.clearCourseStore,
  ]);

  useEffect(() => {
    !loading &&
      _CourseService.getById(props.courseId).then((res) => {
        setCourse(res);
      });
    return () => {
      clearCourseStore();
    };
  }, [me, loading]);

  return (
    <>
      {course && (
        <Box sx={{ position: "relative" }}>
          <CourseHeroSection
            tags={JSON.parse("[" + course?.tags + "]")[0]}
            name={course?.name?.en}
            student_status={course.order?.student_status}
            order_status={course?.order?.order_status}
          />
          <CourseOutlineSection
            teacherName={
              // course?.users?.username
              "SIL"
            }
            teacherImage={
              // course.users?.personal_image
              "/assets/images/logo.svg"
            }
            level={course.level}
            rate={course.rate}
            hours={course.hours}
            student_status={
              course?.order?.student_status as StudentStatus | undefined
            }
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              // backgroundImage: theme.palette.bg_body.main,
              boxShadow: "inset 0px 2px 4px rgba(0, 0, 0, 0.25)",
              boxSizing: "border-box",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "center", lg: "space-between" },
                alignItems: { xs: "center", lg: "flex-start" },
                flexDirection: { xs: "column-reverse", lg: "row" },
                columnGap: "20px",
                width: { xs: "100vw", lg: "60vw" },
                minWidth: { lg: "970px", xl: "1148px" },
                my: "20px",
                position: "relative",
              }}
            >
              <CourseTabSection
                description={course.description}
                sessions={course.sessions}
              />
              <CourseVideoCart
                isBaid={Boolean(course.order)}
                hours={course.hours}
                date={course.created_at}
                isOffline
                lessons={course.sessions?.length}
                isCertificate
                teacherName={course.users?.username}
                teacherImage={course.users?.personal_image}
                certificate={course.certificate}
                order_status={course?.order?.order_status}
                student_status={course?.order?.student_status as StudentStatus}
                isCourseCompleted={course.order?.student_status === "completed"}
              />
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default CourseById;

export const getServerSideProps = async (ctx: any) => {
  return {
    props: {
      courseId: ctx.params.id,
    },
  };
};
