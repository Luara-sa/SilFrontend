import React, { useEffect, useState } from "react";

import { useRouter } from "next/router";

import { Box, Button, Tab, Tabs } from "@mui/material";

import { useMe } from "hooks/useMe";
import { companySideBar, studentSideBar } from "./helper/sideBarLink";
import { useIsTablet } from "./helper/useIsTablet";
import { profileStore } from "store/profileStore";

import { MyOrders } from "./pages/MyOrders";
import { Settings } from "./pages/Settings";
import { ProfileHero } from "./components";
import {
  Dashboard,
  MyCertificates,
  MyCourses,
  MyPaths,
  MyTests,
  PlacementTest,
  Profile,
} from "./pages";
import { a11yProps, TabPanel } from "components/shared/tabs";

import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import useDeviceSize from "hooks/useDeviceSize";
import { StringDouble } from "interface/common";
import useTranslation from "next-translate/useTranslation";

interface TabPanelProps {
  children?: React.ReactNode;
  index: string;
  value: string;
}

export const ProfileIndex = () => {
  const router = useRouter();

  const { me, role } = useMe();

  const [clearData] = profileStore((state) => [state.clearData]);

  const DeviceSize = useDeviceSize();
  const { locale } = useRouter();
  const { t } = useTranslation("profile");

  const [sideBar, setSideBar] = useState<any[]>([]);
  const [value, setValue] = useState<string>("dashboard");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    router.push(
      {
        pathname: router.pathname,
        query: {
          page: newValue,
        },
      },
      undefined,
      { scroll: false }
    );
  };

  useEffect(() => {
    router.query.page && setValue(router.query.page as string);
  }, [router]);

  useEffect(() => {
    if (role) {
      role?.includes("company")
        ? setSideBar(companySideBar)
        : setSideBar(studentSideBar);
    }
    return () => clearData();
  }, [me]);

  if (!me) return <></>;

  return (
    <Box>
      <Box
        sx={{
          mt: { xs: "0", md: "45px" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: { xs: "column", md: "row" },
          width: "100%",
          pt: { xs: "10px", md: "0" },
          pb: { xs: "10px", md: "0" },
          boxShadow: { xs: "0px 2px 4px rgba(0, 0, 0, 0.25)", md: "none" },
          backgroundColor: { xs: "#FFFFFF", md: "inherit" },
        }}
      >
        <ProfileHero />
        {DeviceSize === "mobile" && (
          <Tabs
            orientation="horizontal"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            sx={{
              width: "100%",
              py: "1rem",
              px: "1rem",
              "& .MuiTabs-scrollButtons": {
                display: "flex",
              },
            }}
          >
            {sideBar.length > 0 &&
              sideBar.map((item: any, index: any) => (
                <Tab
                  key={index}
                  icon={item.icon}
                  label={item.label[locale as keyof StringDouble]}
                  value={item.index}
                  iconPosition="start"
                  sx={{
                    ...tabStyle,
                    backgroundColor:
                      item.index === value ? "rgba(30, 91, 99, 0.2)" : "#fff",
                    borderTop:
                      item.index !== "dashboard" ? "1px solid #EEEEEE" : "none",
                  }}
                  {...a11yProps(item.index)}
                />
              ))}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: { xs: "0", xl: "20px" },
              }}
            >
              <Button
                onClick={(event) => handleChange(event, "settings")}
                startIcon={<SettingsOutlinedIcon />}
                sx={{
                  width: "70%",
                  backgroundColor: "primary.main",
                  color: "gray.active",
                  minWidth: "130px",
                  ml: { xs: "20px", xl: "0" },
                  "&:hover": {
                    // color: "primary.main",
                    backgroundColor: "#25727c",
                  },
                }}
              >
                Settings
              </Button>
            </Box>
          </Tabs>
        )}
      </Box>
      <Box
        sx={{
          mt: "20px",
          display: "flex",
          mb: "50px",
          flexDirection: { xs: "column", xl: "row" },
        }}
      >
        {(DeviceSize === "tablet" || DeviceSize === "desktop") && (
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
              borderRadius: "10px",
              flex: "0.2",
              minWidth: "300px",
              pt: "20px",
              pb: "50px",
              backgroundColor: "#FFFEFA",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Tabs
              orientation={DeviceSize === "tablet" ? "horizontal" : "vertical"}
              variant="scrollable"
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              sx={{ width: "100%" }}
            >
              {sideBar.length > 0 &&
                sideBar.map((item: any, index: any) => (
                  <Tab
                    key={index}
                    icon={item.icon}
                    label={item.label[locale as keyof StringDouble]}
                    value={item.index}
                    iconPosition="start"
                    sx={{
                      ...tabStyle,
                      backgroundColor: "#FFFEFA",
                      borderTop:
                        item.index !== "dashboard"
                          ? "1px solid #EEEEEE"
                          : "none",
                    }}
                    {...a11yProps(item.index)}
                  />
                ))}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: { xs: "0", xl: "20px" },
                }}
              >
                <Button
                  onClick={(event) => handleChange(event, "settings")}
                  startIcon={<SettingsOutlinedIcon />}
                  sx={{
                    width: "70%",
                    backgroundColor: "primary.main",
                    color: "gray.active",
                    minWidth: "130px",
                    ml: { xs: "20px", xl: "0" },
                    "&:hover": {
                      // color: "primary.main",
                      backgroundColor: "#25727c",
                    },
                  }}
                >
                  {t("settings")}
                </Button>
              </Box>
            </Tabs>
          </Box>
        )}

        <Box sx={{ width: "100%", height: "100%" }}>
          <TabPanel value={value} index="dashboard">
            {role !== null && <Dashboard role={role} />}
          </TabPanel>
          <TabPanel value={value} index="profile">
            <Profile />
          </TabPanel>
          {role?.includes("student") && (
            <>
              <TabPanel value={value} index="myCourses">
                <MyCourses />
              </TabPanel>
              <TabPanel value={value} index="myPaths">
                <MyPaths />
              </TabPanel>
              <TabPanel value={value} index="myTests">
                <MyTests />
              </TabPanel>
              <TabPanel value={value} index="placementTest">
                <PlacementTest />
              </TabPanel>
              <TabPanel value={value} index="myCertificates">
                <MyCertificates />
              </TabPanel>
              <TabPanel value={value} index="myOrders">
                <MyOrders />
              </TabPanel>
            </>
          )}
          <TabPanel value={value} index="settings">
            <Settings />
          </TabPanel>
        </Box>
      </Box>
    </Box>
  );
};

const tabStyle = {
  py: "13px",
  pl: { xs: "20px", xl: "40px" },
  pr: { xs: "20px", xl: "0" },
  minHeight: "30px",
  justifyContent: "start",
  columnGap: "15px",
  fontSize: [15, 16, 17, 18, 18],
  color: "primary.main",
  fontWeight: "400",
  "&.MuiButtonBase-root.MuiTab-root": {
    marginLeft: "0px",
  },
};
