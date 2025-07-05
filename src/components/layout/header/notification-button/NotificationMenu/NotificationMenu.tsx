import React, { useState } from "react";

import useTranslation from "next-translate/useTranslation";

import { Box, Divider, Tab, Tabs } from "@mui/material";
import { a11yProps } from "components/shared/tabs";
import { filterTabsStyle } from "modules/profile/helper/filterTabsStyle";

import { NotificationCardsWraper } from "../NotificationCardsWraper";

export type NotificationStatus = "all" | "seen" | "unseen";

export const NotificationMenu = () => {
  const [selectedTab, setSelectedTab] = useState<"all" | "seen" | "unseen">(
    "unseen"
  );
  const { t } = useTranslation("header");

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: NotificationStatus
  ) => {
    setSelectedTab(newValue);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#FFFEFA",
        // position: "relative",
        // transform: "translateX(0)", // this will act like relative parent
      }}
    >
      {/* <Box> */}
      {/* Sticky container */}
      <Box
        sx={{
          zIndex: "100",
          backgroundColor: "#FFFEFA",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: "8px",
            // position: "sticky",
            top: "10px",
            backgroundColor: "#FFFEFA",
            // zIndex: "10",
          }}
        >
          <Box
            sx={{
              backgroundColor: "#fff",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
              borderRadius: "10px",
              padding: "5px 10px",
              width: "90%",
            }}
          >
            <Tabs
              value={selectedTab}
              onChange={handleChange}
              aria-label="basic tabs example"
              sx={{ ...filterTabsStyle, zIndex: "100" }}
              centered
            >
              <Tab
                label={t("all")}
                {...a11yProps("all")}
                value="all"
                sx={{ fontSize: "16px", fontWeight: "500" }}
              />
              <Tab
                label={t("unseen")}
                value="unseen"
                {...a11yProps("unseen")}
                sx={{
                  fontSize: "16px",
                  fontWeight: "500",
                }}
              />
              <Tab
                label={t("seen")}
                value="seen"
                {...a11yProps("seen")}
                sx={{ fontSize: "16px", fontWeight: "500" }}
              />
            </Tabs>
          </Box>
        </Box>
        {/* </Box> */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Box
            sx={{
              width: "85%",
              pt: "30px",
              display: "flex",
              flexDirection: "column",
              rowGap: "15px",
              pb: "25px",
              maxHeight: "40vh",
              overflowY: "scroll",
              "::-webkit-scrollbar": {
                width: "5px",
              },
              "::-webkit-scrollbar-thumb": {
                backgroundColor: "gray.dark",
                borderRadius: "15px",
              },
              px: "10px",
            }}
          >
            <NotificationCardsWraper selectedTab={selectedTab} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
