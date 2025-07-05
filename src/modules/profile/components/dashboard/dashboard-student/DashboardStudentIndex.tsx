import React, { useEffect, useState } from "react";

import { Box } from "@mui/material";

import { profileStore } from "store/profileStore";
import { _StudentRoleService } from "services/studentRole.service";

import { DashboardTotalCard, StudentStatus } from "./DashboardTotalCard";

export const DashboardStudentIndex = () => {
  const [setData, myData] = profileStore((state) => [
    state.setData,
    state.myData,
  ]);
  const allStatus = ["stopped", "completed", "frozen"];
  allStatus.forEach((status) => {
    const statusIndex = myData?.dashboard.findIndex(
      (obj) => obj?.student_status === status
    );
    console.log(typeof status);
    if (statusIndex === -1) {
      myData?.dashboard.push({ student_status: status, count: 0 });
    }
  });

  useEffect(() => {
    _StudentRoleService
      .getProfileDashboard()
      .then((res) => {
        setData(res.result, "dashboard");
      })
      .catch((err) => console.log(err));
    return () => {};
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        columnGap: "20px",
        rowGap: "20px",
      }}
    >
      {myData &&
        myData?.dashboard?.length > 0 &&
        myData?.dashboard.map((card, index) => (
          <DashboardTotalCard
            key={index}
            status={card?.student_status as StudentStatus}
            count={card?.count}
          />
        ))}
    </Box>
  );
};
