import React from "react";
import Link from "next/link";

import { Box, IconButton, Typography } from "@mui/material";

import { _WithAuthService } from "services/withAuth.service";
import { Notification, NotificationDataAfterParse } from "interface/common";
import { notificationStore } from "store/notificationStore";
import { dateToString } from "helper/dateToString";
import { NotificationStatus } from "../NotificationMenu/NotificationMenu";
import { notificationRedirection, notificationTextStyle } from "../helper";

import { Teacher } from "components/shared";
import { NotificationTitle } from "./NotificationCardTitle";

import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

interface Props {
  notification: Notification;
  selectedTab: NotificationStatus;
}

export const NotificationCard = (props: Props) => {
  const { notification, selectedTab } = props;

  const [notifications, setNotifications] = notificationStore((state) => [
    state.notifications,
    state.setNotifications,
  ]);

  const notificationData = JSON.parse(
    notification.data
  ) as NotificationDataAfterParse;

  const handleDelete = (id: number) => {
    _WithAuthService
      .deleteNotification({ notification_id: id })
      .then((res) => {
        notifications &&
          setNotifications(
            [
              ...(notifications[selectedTab] || [])?.filter(
                (notif) => notif.id !== id
              ),
            ],
            selectedTab
          );
      })
      .catch((err) => console.error(err));
  };

  const handleNotificationClicked = (id: number) => {
    _WithAuthService
      .readNotification({ notification_id: id })
      .then((res) => {
        if (notifications && selectedTab !== "all" && selectedTab !== "seen")
          setNotifications(
            [
              ...(notifications[selectedTab] || [])?.filter(
                (notif) => notif.id !== id
              ),
            ],
            selectedTab
          );
      })
      .catch((err) => console.error(err));
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Link
        href={{
          pathname: notificationRedirection[notificationData.data.type]?.link,
          query: notificationRedirection[notificationData.data.type]?.query,
        }}
      >
        <Box
          onClick={() => handleNotificationClicked(notification.id)}
          sx={{
            width: "100%",
            background: "linear-gradient(270deg, #CBFFE8 0%, #E9FCFF 100%)",
            border: " 1px solid #5EECFF",
            borderRadius: "15px",
            px: "8px",
            py: "13px",
            position: "relative",
            zIndex: "0",
            cursor: "pointer",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              pr: "25px",
            }}
          >
            <Box sx={{ display: "flex" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Teacher image="" withTeacher={false} imageWidth="40px" />
                {!notification.is_read && (
                  <FiberManualRecordIcon sx={{ color: "#FF5252" }} />
                )}
              </Box>

              <Box sx={{}}>
                <NotificationTitle
                  title={notificationData.title}
                  date={dateToString(notification.created_at)}
                />
                <Box>
                  <Typography
                    sx={{ ...notificationTextStyle, fontSize: "10px" }}
                  >
                    {notificationData.body}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Link>
      <Box
        onClick={() => handleDelete(notification.id)}
        sx={{
          cursor: "pointer",
          position: "absolute",
          right: "0px",
          top: "0px",
        }}
      >
        <IconButton>
          <CancelOutlinedIcon sx={{ color: "primary.main" }} />
        </IconButton>
      </Box>
    </Box>
  );
};
