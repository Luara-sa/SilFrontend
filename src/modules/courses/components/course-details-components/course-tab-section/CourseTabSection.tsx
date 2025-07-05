import * as React from "react";

import { useTheme } from "@mui/material/styles";
import { AppBar, Box, Tab, Tabs } from "@mui/material";

import { Session, StringDouble } from "interface/common";
import SwipeableViews from "react-swipeable-views";

import { CurriculumTab, ReviewsTab, DescriptionTab } from "./components";
import useTranslation from "next-translate/useTranslation";

interface CourseTabSectionProps {
  description: StringDouble;
  sessions?: Session[];
}

export const CourseTabSection = (props: CourseTabSectionProps) => {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const { t } = useTranslation("course");
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  return (
    <Box sx={{ width: { xs: "95%", lg: "65%" }, mt: { xs: "30px", lg: "0" } }}>
      <Box
        sx={{
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
          borderRadius: "10px",
          backgroundColor: "#FFFEFA",
        }}
      >
        <AppBar
          position="static"
          sx={{
            // width: "700px",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
            borderRadius: "10px",
            backgroundColor: "#ffffff",
            color: "primary.main",
            borderBottom: "2px solid #eeeeee",
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="secondary"
            textColor="inherit"
            aria-label="full width tabs example"
          >
            <Tab
              label={t("description")}
              {...a11yProps(1)}
              sx={{ mx: "30px" }}
            />
            <Tab
              label={t("curriculum")}
              {...a11yProps(0)}
              sx={{ mx: "30px" }}
            />
            <Tab label={t("reviews")} {...a11yProps(2)} sx={{ mx: "30px" }} />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            <DescriptionTab description={props.description} />
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            {props.sessions && <CurriculumTab sessions={props.sessions} />}
          </TabPanel>
          <TabPanel value={value} index={2} dir={theme.direction}>
            <ReviewsTab />
          </TabPanel>
        </SwipeableViews>
      </Box>
    </Box>
  );
};

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}
