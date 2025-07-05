import React, { useEffect, useRef, useState } from "react";

import useTranslation from "next-translate/useTranslation";

import { Box, CircularProgress, Tab, Tabs, Typography } from "@mui/material";

import { _StudentRoleService } from "services/studentRole.service";
import { profileStore } from "store/profileStore";
import { filterTabsStyle } from "../helper/filterTabsStyle";
import { MyCourse } from "../interfaces/profile-interfaces";

import { MyCourseCard } from "../components/my-courses/MyCourseCard";

import { a11yProps } from "components/shared/tabs";
import { NoData } from "components/shared";

export const MyCourses = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [filterParams, setFilterParams] = useState<FilterParams>("active");

  const { t } = useTranslation("profile");

  const [setData, myData] = profileStore((state) => [
    state.setData,
    state.myData,
  ]);

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: FilterParams
  ) => {
    setFilterParams(newValue);
    getMyCourses(newValue);
  };

  useEffect(() => {
    getMyCourses(filterParams);
    return () => {};
  }, []);

  const getMyCourses = (params?: FilterParams) => {
    setIsLoading(true);
    _StudentRoleService
      .getStudentOrdersByToken(params ? filterParamsObjects[params] : {})
      .then((res) => {
        res.result.data.forEach((course) => {
          let attachmentCount = 0;
          let attachmentAtteded = 0;
          // Invoke  (attachment_attended_count) to make things easier
          // when displaying proggres bar
          course.attendance !== "" &&
            JSON.parse(course.attendance).forEach((attend: any) => {
              attachmentAtteded += attend.attachments.length;
            });
          course.attachment_attended_count = attachmentAtteded;
          // Here invoking (course_attachment_count)
          course.course_sessons.forEach((session) => {
            attachmentCount += session.session_attachments.length;
          });
          course.course_attachment_count = attachmentCount;
        });
        console.log(res.result.data);
        setData(res.result.data, "courses");
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
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
        <Box
          sx={{
            backgroundColor: "#fff",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
            borderRadius: "10px",
            padding: "8px 10px",
          }}
        >
          <Tabs
            value={filterParams}
            onChange={handleChange}
            aria-label="basic tabs example"
            sx={filterTabsStyle}
          >
            {myCoursesTabs.map((tab, index) => (
              <Tab
                key={`tab-${index}`}
                label={t(tab.name)}
                {...a11yProps(tab.name)}
                value={tab.name}
                sx={{ fontSize: "16px", fontWeight: "400" }}
              />
            ))}
          </Tabs>
        </Box>
        {isLoading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100px",
            }}
          >
            <CircularProgress />
          </Box>
        )}
        {!isLoading && !myData?.courses?.length && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: "20px" }}>
            <NoData />
          </Box>
        )}
        {!!myData?.courses && !isLoading && (
          <Box
            sx={{
              pt: "20px",
              display: "flex",
              columnGap: "20px",
              rowGap: "20px",
              flexWrap: "wrap",
              justifyContent: { xs: "center", md: "start" },
            }}
          >
            {myData?.courses.map((course: MyCourse, index) => (
              <MyCourseCard
                key={index}
                hours={course.course_hours}
                level="Beginner"
                // rate={4}
                price={3000}
                type={course.course_type}
                id={course.course_id}
                name={JSON.parse(course.course_name).en}
                image={course.course_image}
                lesson_count={course.course_sessons.length}
                trianer_image={course.trianer_image}
                trianer_name={course.trianer_name}
                progressValue={
                  course.attachment_attended_count &&
                  course.course_attachment_count
                    ? (course.attachment_attended_count * 100) /
                      course.course_attachment_count
                    : 0
                }
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

type FilterParams = "active" | "completed" | "pending" | "rejected";

const filterParamsObjects = {
  pending: { student_order_status: "pending" },
  active: { course_active: true },
  completed: { student_status: "completed" },
  rejected: { student_order_status: "rejected" },
};

const myCoursesTabs = [
  {
    name: "active",
    label: "Active",
  },
  {
    name: "pending",
    label: "Pending",
  },
  {
    name: "completed",
    label: "Completed",
  },
  {
    name: "rejected",
    label: "Rejected",
  },
];
