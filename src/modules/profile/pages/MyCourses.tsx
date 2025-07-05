import React, { useState } from "react";
import useTranslation from "next-translate/useTranslation";
import {
  Box,
  Typography,
  Pagination,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useMyEnrolledCourses } from "hooks/useMyEnrolledCourses";
import { CourseCard } from "components/shared";
import { NoData } from "components/shared";
import { StudentCourse } from "interface/common";

// Helper function to map StudentCourse to CourseCard props
const mapStudentCourseToCardProps = (course: StudentCourse) => {
  return {
    id: course.id,
    name: course.name,
    image: course.thumbnail,
    hours: course.duration,
    level: course.levels?.[0]?.name || "",
    type: course.mode,
    rate: course.reviews?.average_rating || 0,
    price: parseFloat(course.course_price?.price || "0"),
    discount: course.course_price?.discounted_price
      ? Math.round(
          (1 -
            parseFloat(course.course_price.discounted_price) /
              parseFloat(course.course_price.price)) *
            100
        )
      : 0,
    originalPrice: parseFloat(course.course_price?.price || "0"),
    discountedPrice: course.course_price?.discounted_price
      ? parseFloat(course.course_price.discounted_price)
      : undefined,
    currency: course.course_price?.currency || "SAR",
    lessonCount: 0, // This would need to be added to the API response or calculated
    navigateTo: `/courses/${course.id}/student-details`,
  };
};

export const MyCourses = () => {
  const { t } = useTranslation("profile");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 12;

  const { courses, loading, error, pagination, goToPage } =
    useMyEnrolledCourses({ page: currentPage, perPage });

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
    goToPage(value);
  };

  return (
    <Box>
      <Box sx={{ pb: "13px", borderBottom: "1px solid #EEEEEE" }}>
        <Typography
          sx={{ fontSize: "30px", fontWeight: 700, color: "primary.main" }}
        >
          {t("my courses")}
        </Typography>
      </Box>

      <Box sx={{ mt: "15px" }}>
        {/* Summary Stats */}
        {!loading && courses.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" color="text.secondary">
              {t("total enrolled courses")}: {pagination.totalCourses}
            </Typography>
          </Box>
        )}

        {/* Loading State */}
        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Box sx={{ mb: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        {/* No Data State */}
        {!loading && !error && courses.length === 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: "40px" }}>
            <NoData />
          </Box>
        )}

        {/* Courses Grid */}
        {!loading && !error && courses.length > 0 && (
          <>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                  lg: "repeat(4, 1fr)",
                },
                gap: 3,
                mt: 3,
              }}
            >
              {courses.map((course) => {
                const cardProps = mapStudentCourseToCardProps(course);
                return <CourseCard key={course.id} {...cardProps} />;
              })}
            </Box>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 4,
                  mb: 2,
                }}
              >
                <Pagination
                  count={pagination.totalPages}
                  page={pagination.currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};
