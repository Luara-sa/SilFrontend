import { useEffect, useState } from "react";

import { useRouter } from "next/router";

import { Box } from "@mui/material";

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
        <JoinForFree1 />
        {courses_Paths?.courses && (
          <CoursesSection courses={courses_Paths.courses} />
        )}
        {courses_Paths?.paths && <PathsSection paths={courses_Paths.paths} />}
        <DownloadApp />
        <JoinForFree2 />
        {/* <SuperiorSection /> */}
        <GetInTouch />
      </Box>
    </>
  );
};
