import { useEffect, useState } from "react";

import { useRouter } from "next/router";
import dynamic from "next/dynamic";

import { Box, IconButton } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

import { _CourseService } from "services/course.service";
import { _PathService } from "services/path.service";
import { Course, Path } from "interface/common";

import {
  ClientSection,
  CoursesSection,
  DownloadApp,
  GetInTouch,
  HeroSection,
  JoinForFree1,
  JoinForFree2,
} from "../components";
import { PathsSection } from "../components/paths-section/PathsSection";
import { LatestCoursesSectionLoader } from "../components/latest-courses-section/LatestCoursesSectionLoader";

// Import LatestCoursesSection with SSR disabled to prevent hydration errors
const LatestCoursesSection = dynamic(
  () => import("../components/latest-courses-section/LatestCoursesSection").then(mod => mod.LatestCoursesSection),
  { 
    ssr: false,
    loading: () => <LatestCoursesSectionLoader />
  }
);

export const HomeIndex = () => {
  const [courses_Paths, setCourses_Paths] = useState<{
    courses?: Course[];
    paths?: Path[];
  }>();

  const router = useRouter();

  const getData = async () => {
    // const paths = await _PathService
    //   .getPaths({ limit: 10, page: 1 })
    //   .then((res) => res.result);
    // const courses = await _CourseService.getAll().then((res) => res.result);

    setCourses_Paths({
      // paths: paths.data,
      // courses: courses?.data as any,
    });
  };

  useEffect(() => {
    getData();
    return () => {};
  }, []);

  return (
    <>
      <Box sx={{ minHeight: "100vh" }}>
        {/* <FireBaseSnack /> */}
        <HeroSection />
        <ClientSection />
        <LatestCoursesSection />
        {courses_Paths?.courses && (
          <CoursesSection courses={courses_Paths.courses} />
        )}
        {courses_Paths?.paths && <PathsSection paths={courses_Paths.paths} />}
        <DownloadApp />
        <JoinForFree2 />
        {/* <SuperiorSection /> */}
        <GetInTouch />

        <IconButton
          component="a"
          href="https://wa.me/966553140808"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          sx={{
            position: "fixed",
            right: { xs: 16, md: 24 },
            bottom: { xs: 16, md: 24 },
            zIndex: 1300,
            width: 56,
            height: 56,
            color: "#fff",
            backgroundColor: "#25D366",
            boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
            "&:hover": {
              backgroundColor: "#1ebe5d",
            },
          }}
        >
          <WhatsAppIcon />
        </IconButton>
      </Box>
    </>
  );
};
