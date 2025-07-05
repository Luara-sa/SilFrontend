import React, { FC, useEffect } from "react";

import { Box, Typography } from "@mui/material";

import { _CompanyService } from "services/company.service";
import { profileStore } from "store/profileStore";

import { DashboardCompanyTable } from "./dashboard-company-table/DashboardCompanyTable";

export const DashboardCompanyIndex: FC = () => {
  const [setUserCompany] = profileStore((state) => [state.setUserCompany]);

  useEffect(() => {
    _CompanyService
      .getUsersCompanyByToken()
      .then((res) => {
        setUserCompany(res.result);
      })
      .catch((err) => console.log(err));

    return () => {};
  }, []);

  // const HandleSort = (sort: string) => {
  //   params.sort = params.sort === sort ? `-${sort}` : sort;
  //   getGeofence(params).subscribe();
  // };

  return (
    <Box>
      <Box sx={{ pb: "10px", borderBottom: "1px solid #EEEEEE" }}>
        <Typography
          sx={{ fontSize: "30px", fontWeight: 700, color: "primary.main" }}
        >
          Monitor beneficiaries
        </Typography>
      </Box>
      <Box sx={{ mt: "33px", ml: "20px" }}>
        <DashboardCompanyTable />
      </Box>
    </Box>
  );
};
