import React, { useEffect, useState } from "react";

import useTranslation from "next-translate/useTranslation";

import { Box, Tab, Tabs, Typography } from "@mui/material";

import { profileStore } from "store/profileStore";
import { _StudentRoleService } from "services/studentRole.service";

import { MyTestCard } from "../components";

import { a11yProps } from "components/shared/tabs";
import { filterTabsStyle } from "../helper/filterTabsStyle";
import { dateToString } from "helper/dateToString";

export const MyTests = () => {
  const [filterParams, setFilterParams] = useState("passed");

  const [setData, myData] = profileStore((state) => [
    state.setData,
    state.myData,
  ]);
  const { t } = useTranslation("profile");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setFilterParams(newValue);
    // getMyCourses(newValue);
  };

  useEffect(() => {
    _StudentRoleService
      .getTestsByToken()
      .then((res) => setData(res.result.data, "tests"))
      .catch((err) => console.log(err));

    return () => {};
  }, []);

  return (
    <Box sx={{}}>
      <Box sx={{ pb: "13px", borderBottom: "1px solid #EEEEEE" }}>
        <Typography
          sx={{ fontSize: "30px", fontWeight: "700", color: "primary.main" }}
        >
          {t("my tests")}
        </Typography>
      </Box>
      <Box
        sx={{
          backgroundColor: "#fff",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
          borderRadius: "10px",
          padding: "8px 10px",
          mt: "15px",
        }}
      >
        <Tabs
          value={filterParams}
          onChange={handleChange}
          aria-label="basic tabs example"
          sx={filterTabsStyle}
        >
          {myTestTabs.map((tab, index) => (
            <Tab
              key={`tab-${index}`}
              label={t(tab.label)}
              {...a11yProps(tab.name)}
              value={tab.name}
              sx={{ fontSize: "16px", fontWeight: "400" }}
            />
          ))}
        </Tabs>
      </Box>
      <Box
        sx={{
          display: "flex",
          columnGap: "20px",
          rowGap: "20px",
          flexWrap: "wrap",
          pt: "20px",
        }}
      >
        {myData?.tests &&
          myData?.tests
            .filter((test) =>
              filterParams === "passed"
                ? test.mark && test.mark >= 60
                : test.mark && test.mark < 60
            )
            .map((test) => {
              return (
                <Box sx={{ flex: { xs: 1, md: 0.5 } }} key={test.id}>
                  <MyTestCard
                    id={test.id}
                    name={
                      test.test_name !== "" ? JSON.parse(test.test_name).en : ""
                    }
                    date={dateToString(test.created_at)}
                    mark={test.mark ?? 0}
                  />
                </Box>
              );
            })}
      </Box>
    </Box>
  );
};

const myTestTabs = [
  {
    label: "Passed",
    name: "passed",
  },
  {
    label: "Failed",
    name: "failed",
  },
];
