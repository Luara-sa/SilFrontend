import React, { useEffect, useState } from "react";

import { Box, Tab, Tabs, Typography } from "@mui/material";

import { _WithAuthService } from "services/withAuth.service";
import { filterTabsStyle } from "../helper/filterTabsStyle";

import { a11yProps, TabPanel } from "components/shared/tabs";
import { MyOrdersTab } from "../modules/myOrders/pages/MyOrdersTab";
import { MyOrdersCoursesTab } from "../modules/myOrders/pages/MyOrdersCoursesTab";
import useTranslation from "next-translate/useTranslation";

export const MyOrders = () => {
  const [selectedTab, setSelectedTab] = useState("myOrder");

  const { t } = useTranslation("profile");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
  };

  return (
    <>
      <Box>
        <Box sx={{ pb: "13px", borderBottom: "1px solid #EEEEEE" }}>
          <Typography
            sx={{ fontSize: "30px", fontWeight: 700, color: "primary.main" }}
          >
            {t("my orders")}
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
              value={selectedTab}
              onChange={handleChange}
              aria-label="basic tabs example"
              sx={filterTabsStyle}
            >
              <Tab
                label={t("order document")}
                value="myOrder"
                {...a11yProps("myOrder")}
                sx={{ fontSize: "16px", fontWeight: "400" }}
              />
              <Tab
                label={t("my courses")}
                value="myCourses"
                {...a11yProps("myCourses")}
                sx={{ fontSize: "16px", fontWeight: "400" }}
              />
            </Tabs>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            <TabPanel value={selectedTab} index="myOrder" sx={{ px: "0" }}>
              <MyOrdersTab />
            </TabPanel>
            <TabPanel value={selectedTab} index="myCourses" sx={{ px: "0" }}>
              <MyOrdersCoursesTab />
            </TabPanel>
          </Box>
        </Box>
      </Box>
    </>
  );
};
