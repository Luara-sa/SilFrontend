import React from "react";

import { Box } from "@mui/material";

import { DashboardDelegateIndex } from "../dashboard-delegate/DashboardDelegateIndex";
import { DashboardStudentIndex } from "../dashboard-student/DashboardStudentIndex";

export const DashboardStudentDelegateIndex = () => {
  return (
    <div>
      <Box sx={{ mb: "20px" }}>
        <DashboardStudentIndex />
      </Box>
      <DashboardDelegateIndex />
    </div>
  );
};
