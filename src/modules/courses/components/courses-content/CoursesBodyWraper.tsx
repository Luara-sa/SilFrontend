import React, { forwardRef, useEffect, useState } from "react";

import { Box, Button, Typography, Alert, Pagination } from "@mui/material";
import { Refresh as RefreshIcon } from "@mui/icons-material";

import { useStudentCourses } from "hooks/useStudentCourses";
import { _AuthService } from "services/auth.service";
import { filterStore } from "store/filterStore";
import { StudentCoursesFilters } from "interface/common";

import { CourseCard } from "components/shared";
import { CourseCardLoader } from "components/shared/loader/LoaderCard/CourseCardLoader";
import { CourseFilterButton } from "modules/courses/components/course-filter-button/CourseFilterButton";
import { CoursesFilter } from "modules/courses/components/courses-filter/CoursesFilter";

interface Props {}

export const CoursesBodyWraper = forwardRef<HTMLDivElement, any>(
  (props: Props, paramsRef: any) => {
    const {
      legacyCourses,
      loading: studentCoursesLoading,
      error: studentCoursesError,
      pagination,
      fetchStudentCourses,
      resetCourses,
    } = useStudentCourses();

    const { filters, currentPage, setCurrentPage } = filterStore();

    // Local state
    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

    // Load courses on mount and when filters/page change
    useEffect(() => {
      const isLoggedIn = _AuthService.isLoggedIn();
      const token = _AuthService.getJwtToken();

      if (isLoggedIn && token) {
        fetchStudentCourses(currentPage, 15, filters);
      }
    }, [fetchStudentCourses, filters, currentPage]);

    const handlePageChange = (
      event: React.ChangeEvent<unknown>,
      page: number
    ) => {
      setCurrentPage(page);
    };

    const handleRefreshCourses = () => {
      const isLoggedIn = _AuthService.isLoggedIn();
      if (!isLoggedIn) {
        return;
      }
      fetchStudentCourses(currentPage, 15, filters);
    };

    const handleApplyFilters = (newFilters: StudentCoursesFilters) => {
      setCurrentPage(1); // Reset to first page when applying filters
      fetchStudentCourses(1, 15, newFilters);
    };

    // Show error state
    if (studentCoursesError) {
      return (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {studentCoursesError}
          </Alert>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleRefreshCourses}
          >
            Try Again
          </Button>
        </Box>
      );
    }

    return (
      <>
        {/* Filter Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
          <CourseFilterButton onOpenFilter={() => setFilterDrawerOpen(true)} />
        </Box>

        {/* Courses Grid */}
        {legacyCourses && legacyCourses.length > 0 ? (
          <>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                columnGap: "25px",
                rowGap: "30px",
                pb: "20px",
                minHeight: "400px",
              }}
            >
              {legacyCourses.map((course: any) => (
                <CourseCard
                  id={course.id}
                  key={course.id}
                  name={course.name?.en || course.name}
                  hours={course.hours}
                  image={course.image}
                  level={course.level}
                  price={course.price}
                  rate={course.rate}
                  type={course.type}
                  lessonCount={course.sessions?.length || 0}
                  discount={course.discount}
                  navigateTo={`courses/${course.id}/student-details`}
                />
              ))}
            </Box>

            {/* Pagination */}
            {pagination && pagination.last_page > 1 && (
              <Box
                sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 2 }}
              >
                <Pagination
                  count={pagination.last_page}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}
          </>
        ) : studentCoursesLoading ? (
          // Loading State
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              columnGap: "25px",
              rowGap: "30px",
              pb: "20px",
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((card) => (
              <CourseCardLoader key={card} />
            ))}
          </Box>
        ) : (
          // No Results
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No courses found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Try adjusting your filters to find more courses.
            </Typography>
            <Button
              variant="outlined"
              onClick={() => setFilterDrawerOpen(true)}
            >
              Open Filters
            </Button>
          </Box>
        )}

        {/* Filter Drawer */}
        <CoursesFilter
          open={filterDrawerOpen}
          onClose={() => setFilterDrawerOpen(false)}
          onApplyFilters={handleApplyFilters}
        />
      </>
    );
  }
);

CoursesBodyWraper.displayName = "CoursesBodyWraper";
