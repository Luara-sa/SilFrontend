import React, { forwardRef, MutableRefObject, useEffect } from "react";

import shallow from "zustand/shallow";

import InfiniteScroll from "react-infinite-scroll-component";

import { Box } from "@mui/material";

import { useCoursesPageResize } from "modules/courses/hooks";

import { coursesStore } from "store/coursesStore";
import { filterStore } from "store/filterStore";

import { _PathService } from "services/path.service";
import { _CourseService } from "services/course.service";

import { PathCard } from "components/shared";
import { Path } from "interface/common";
import { CourseCardLoader } from "components/shared/loader/LoaderCard/CourseCardLoader";

interface Props {
  getPaths: (params: MutableRefObject<any>) => void;
}

export const PathsBodyWraper = forwardRef<HTMLDivElement, Props>(
  (props: Props, paramsRef: any) => {
    const [largeScreen] = useCoursesPageResize();

    const [paths, setPaths] = coursesStore(
      (state) => [state.paths, state.setPaths],
      shallow
    );

    const [drawerOpen, toggleDrawer] = filterStore((state) => [
      state.drawerOpen,
      state.toggleDrawer,
    ]);

    const handleInfintScroll = () => {
      paramsRef.current.page += 1;
      _PathService
        .getPaths(paramsRef.current)
        .then((res) => {
          setPaths({
            ...res.result,
            data: [...(paths?.data as any), ...res.result.data],
          });
        })
        .catch((err) => console.log(err));
    };

    useEffect(() => {
      props.getPaths(paramsRef);

      return () => {};
    }, []);

    if (paths)
      return (
        <>
          <InfiniteScroll
            dataLength={paths?.current_page! * 20 || 10}
            next={handleInfintScroll}
            hasMore={paths?.current_page !== paths?.last_page}
            loader={<></>}
          >
            <Box
              sx={{
                width: drawerOpen && largeScreen ? "70vw" : "80vw",
                transition: "500ms",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                columnGap: "25px",
                rowGap: "30px",
                pb: "20px",
              }}
            >
              {(paths?.data as any).map((path: Path) => (
                <PathCard
                  key={path.id}
                  name={path.name}
                  image={path.image}
                  pathId={path.id}
                  courseCount={path.courses_count}
                />
              ))}
            </Box>
          </InfiniteScroll>
        </>
      );
    return (
      <>
        <Box
          sx={{
            width: "80vw",
            transition: "500ms",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            columnGap: "25px",
            rowGap: "30px",
            pb: "20px",
          }}
        >
          {[1, 2, 3, 4].map((card) => (
            <CourseCardLoader key={card} />
          ))}
        </Box>
      </>
    );
  }
);
PathsBodyWraper.displayName = "PathsBodyWraper";
