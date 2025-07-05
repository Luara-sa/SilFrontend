import { Box, Typography } from "@mui/material";
import {
  Course,
  CoursePathType,
  ICoursesSort,
  Path,
  StringDouble,
} from "interface/common";
import React from "react";

import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { CourseCardPathTimeLine } from "./CourseCardPathTimeLine";

interface Props {
  courses: ICoursesSort[];
}

export const PathTimeLine = (props: Props) => {
  return (
    <VerticalTimeline
      layout="1-column-left"
      lineColor="#DDDDDD"
      // className="path-courses-timeline"
    >
      {props.courses.map((course, index) => (
        <>
          {course?.course && (
            <VerticalTimelineElement
              // date=''
              className="path-course-timline-card"
              contentArrowStyle={{ display: "none" }}
              key={course.course.id}
              style={{ width: "100%" }}
              iconStyle={{
                background: "#EEEEEE",
                border: "1px solid #DDDDDD",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#888888",
                boxShadow: "none",
              }}
              icon={<Typography>{index + 1}</Typography>}
            >
              <CourseCardPathTimeLine
                name={JSON.parse(course?.course?.name).en}
                gender={course?.course?.type}
                // level={course.course.level ?? ""}
                price={course?.course?.price}
                // rating={course.course.rate ?? ""}
                teacherName={course?.course?.trainer_name}
              />
            </VerticalTimelineElement>
          )}
        </>
      ))}
    </VerticalTimeline>
  );
};
