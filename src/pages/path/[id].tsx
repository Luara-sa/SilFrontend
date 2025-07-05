import React, { useEffect } from "react";
import { useRouter } from "next/router";

import { Box, useTheme } from "@mui/material";

import { _CourseService } from "services/course.service";
import { _PathService } from "services/path.service";
import { meStore } from "store/meStore";
import { pathStore } from "store/pathStore";

import { PathTimeLine } from "modules/path";
import { CourseHeroSection, CourseOutlineSection } from "modules";

import { PathVideoCart } from "modules/path/components/PathVideoCart";

interface Props {
  pathId: string;
}

const PathPage = (props: Props) => {
  // const [course, setCourse] = useState<Course>();
  const me = meStore((state) => state.me);
  const router = useRouter();

  const [path, setPath] = pathStore((state) => [state.path, state.setPath]);

  const theme = useTheme();

  useEffect(() => {
    router.query.id &&
      _PathService.getCoursesPath(router.query.id as any).then((res) => {
        console.log(res);
        setPath(res.result);
      });

    return () => {};
  }, [router.query.id]);

  useEffect(() => {
    // me &&
    //   _CourseService.getById(props.pathId).then((res) => {
    //     console.log(res.result);
    //     setCourse(res.result);
    //     // res.result.order?.attendance &&
    //     // res.result.order?.attendance !== "" &&
    //     // console.log(JSON.parse(res.result.order?.attendance));
    //   });
    return () => {
      //   clearCourseStore();
    };
  }, [me]);
  return (
    <div>
      {path && (
        <Box sx={{ position: "relative" }}>
          <CourseHeroSection name={path.name} />
          <CourseOutlineSection
          // level={path.level}
          // rate={path.rate}
          // hours={path.hours}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
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
              <Box sx={{ width: "100%" }}>
                {path.courses_sort && (
                  <PathTimeLine courses={path.courses_sort} />
                )}
              </Box>
              <PathVideoCart
                courseId={
                  path?.courses_sort ? path?.courses_sort[0]?.course_id : 0
                }
                videoSource={path.image}
                isBaid={false}
                pathEnroll={path?.enrollPath}
                // isBaid={Boolean(path.order)}
                hours={10}
                // hours={path.hours}
                // date={path.created_at}
                isOffline
                lessons={10}
                // lessons={path.sessions?.length}
                // isCertificate
                // teacherName={path.users?.username}
                // teacherImage={path.users?.personal_image}
              />
            </Box>
          </Box>
        </Box>
      )}
    </div>
  );
};

export default PathPage;

export const getServerSideProps = async (ctx: any) => {
  return {
    props: {
      pathId: ctx.params.id,
    },
  };
};
