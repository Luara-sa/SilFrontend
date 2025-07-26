import React from "react";
import Link from "next/link";

import { Box, IconButton, Typography } from "@mui/material";

import { _WithAuthService } from "services/withAuth.service";
import { Notification } from "interface/common";
import { notificationStore } from "store/notificationStore";
import { dateToString } from "helper/dateToString";
import { NotificationStatus } from "../NotificationMenu/NotificationMenu";
import { notificationTextStyle } from "../helper";

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

  const [notifications, setNotifications, setReRenderNotification] =
    notificationStore((state) => [
      state.notifications,
      state.setNotifications,
      state.setReRenderNotification,
    ]);

  const handleDelete = (id: string) => {
    _WithAuthService
      .deleteNotification({ notification_id: id })
      .then((res) => {
        setReRenderNotification();
      })
      .catch((err) => console.error(err));
  };

  const handleNotificationClicked = (id: string) => {
    if (!notification.read_at) {
      _WithAuthService
        .readNotification({ notification_id: id })
        .then((res) => {
          setReRenderNotification();
        })
        .catch((err) => console.error(err));
    }
  };

  const getNotificationLink = () => {
    // Handle different notification types
    if (notification.meta_data?.type === "invite_placement_test_meeting") {
      return notification.meta_data.meeting_url || "#";
    }
    return "#";
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Link href={getNotificationLink()}>
        <Box
          onClick={() => handleNotificationClicked(notification.id)}
          sx={{
            width: "100%",
            background: notification.read_at 
              ? "linear-gradient(270deg, #F5F5F5 0%, #FAFAFA 100%)"
              : "linear-gradient(270deg, #CBFFE8 0%, #E9FCFF 100%)",
            border: notification.read_at 
              ? "1px solid #E0E0E0"
              : "1px solid #5EECFF",
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
                {!notification.read_at && (
                  <FiberManualRecordIcon sx={{ color: "#FF5252" }} />
                )}
              </Box>

              <Box sx={{}}>
                <NotificationTitle
                  title={notification.title}
                  date={notification.created_at}
                />
                <Box>
                  <Typography
                    sx={{ ...notificationTextStyle, fontSize: "10px" }}
                  >
                    {notification.message}
                  </Typography>
                  
                  {/* Show additional meta data for specific notification types */}
                  {notification.meta_data.type === "invite_placement_test_meeting" && (
                    <Box sx={{ mt: 1 }}>
                      {notification.meta_data.meeting_password && (
                        <Typography
                          sx={{ ...notificationTextStyle, fontSize: "9px", color: "primary.main" }}
                        >
                          Password: {notification.meta_data.meeting_password}
                        </Typography>
                      )}
                    </Box>
                  )}
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
