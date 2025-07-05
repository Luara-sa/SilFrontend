import { Box } from "@mui/material";
import { convertStringToJSON } from "helper/convertStringToJSON";
import { dateToString } from "helper/dateToString";
import React, { useEffect } from "react";

import { _StudentRoleService } from "services/studentRole.service";
import { profileStore } from "store/profileStore";
import { MyOrdersCourseCard } from "../components/my-course/MyOrdersCourseCard";

export const MyOrdersCoursesTab = () => {
  const [setData, myData] = profileStore((state) => [
    state.setData,
    state.myData,
  ]);
  useEffect(() => {
    !Boolean(myData?.orderCourses) &&
      _StudentRoleService
        .getMyOrdersInstallmentsByToken()
        .then((res) => setData(res.result.data, "orderCourses"))
        .catch((err) => console.log(err));

    return () => {};
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        justifyContent: { xs: "center", md: "start" },
      }}
    >
      {myData?.orderCourses &&
        myData?.orderCourses.map((order) => (
          <Box sx={{ flex: 0.5 }} key={order.id}>
            <MyOrdersCourseCard
              price={order.totalWithVat}
              courseName={(convertStringToJSON(order.course_name) as any).en}
              date={dateToString(order.created_at)}
              total={order?.amount}
              installments={order?.installments}
            />
          </Box>
        ))}
    </Box>
  );
};
