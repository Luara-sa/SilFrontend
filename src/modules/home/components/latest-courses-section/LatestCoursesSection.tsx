import React, { useEffect } from "react";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";

import { Box, Typography, Grid } from "@mui/material";

import { CourseCard } from "components/shared";
import { useStudentCourses } from "hooks/useStudentCourses";
import { useCourseMappings } from "hooks/useCourseMappings";
import { CourseCardLoader } from "components/shared/loader/LoaderCard/CourseCardLoader";

export const LatestCoursesSection = () => {
  const { t } = useTranslation("home");
  const { locale } = useRouter();
  const { getCourseMode, getCourseLevel } = useCourseMappings();

  const { studentCourses, loading, fetchStudentCourses } = useStudentCourses();

  useEffect(() => {
    fetchStudentCourses(1, 3);
  }, [fetchStudentCourses]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        py: { xs: "50px", md: "100px" },
        backgroundColor: "#f9f9f9",
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", sm: "95%", md: "80%" },
          px: { xs: 2, sm: 3, md: 0 },
        }}
      >
        <Box sx={{ mb: { xs: "30px", md: "50px" } }}>
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

        {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3].map((index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <CourseCardLoader />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={3}>
            {studentCourses.slice(0, 3).map((course) => {
              const levelName =
                course.levels && course.levels.length > 0
                  ? course.levels[0].name
                  : "";

              return (
                <Grid item xs={12} sm={6} md={4} key={course.id}>
                  <CourseCard
                    id={course.id}
                    name={
                      typeof course.name === "string"
                        ? course.name
                        : (course.name as any)?.[locale || "en"] ||
                          (course.name as any)?.en
                    }
                    hours={course.duration || 0}
                    image={course.thumbnail}
                    level={levelName ? getCourseLevel(levelName) : ""}
                    price={
                      typeof course.course_price === "object"
                        ? Number(course.course_price?.discounted_price) ||
                          Number(course.course_price?.price) ||
                          0
                        : Number(course.course_price) || 0
                    }
                    rate={course.reviews?.average_rating || 0}
                    type={getCourseMode(course.mode)}
                    lessonCount={(course as any).topics_count || 0}
                    discount={
                      typeof course.course_price === "object" &&
                      course.course_price?.discounted_price &&
                      course.course_price?.price
                        ? Math.round(
                            ((Number(course.course_price.price) -
                              Number(course.course_price.discounted_price)) /
                              Number(course.course_price.price)) *
                              100
                          )
                        : 0
                    }
                  />
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </Box>
  );
};
