import React, { useEffect } from "react";

import { Box, Typography } from "@mui/material";

import { _DelegateRoleService } from "services/delegateRole.service";
import { profileStore } from "store/profileStore";

import { DashboardDelegateTable } from "./DashboardDelegateTable";
import { DelegateNumberOfBeneficiaries } from "./DelegateNumberOfBeneficiaries";

export const DashboardDelegateIndex = () => {
  const [setDelegate] = profileStore((state) => [state.setDelegate]);

  useEffect(() => {
    _DelegateRoleService
      .getDelegateCoursesByToken()
      .then((res) => {
        setDelegate(res.result.data, "table");
      })
      .catch((err) => console.log(err));

    return () => {};
  }, []);
  return (
    <Box>
      <DelegateNumberOfBeneficiaries />
      <Box sx={{ pb: "10px", borderBottom: "1px solid #EEEEEE", mt: "20px" }}>
        <Typography
          sx={{ fontSize: "30px", fontWeight: 700, color: "primary.main" }}
        >
          Monitor beneficiaries
        </Typography>
      </Box>
      <Box sx={{ mt: "33px", ml: "20px" }}>
        <DashboardDelegateTable />
      </Box>
    </Box>
  );
};
