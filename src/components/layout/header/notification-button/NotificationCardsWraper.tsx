import React, { useCallback, useEffect } from "react";

import { Box } from "@mui/material";

import { _WithAuthService } from "services/withAuth.service";
import { notificationStore } from "store/notificationStore";
import { NotificationStatus } from "./NotificationMenu/NotificationMenu";

import { NotificationCard } from "./notification-card/NotificationCard";

interface Props {
  selectedTab: NotificationStatus;
}

export const NotificationCardsWraper = (props: Props) => {
  const [notifications, setNotifications, reRenderNotification] =
    notificationStore((state) => [
      state.notifications,
      state.setNotifications,
      state.reRenderNotification,
    ]);

  useEffect(() => {
    _WithAuthService
      .getNotificationsByToken(
        props.selectedTab === "all"
          ? {}
          : { is_read: props.selectedTab === "seen" ? 1 : 2 }
      )
      .then((res) => {
        // console.log(res.result.data);
        setNotifications(res.result.data, props.selectedTab);
      })
      .catch((err) => console.error(err));
  }, [props.selectedTab, reRenderNotification]);

  return (
    <>
      {notifications &&
        notifications[props.selectedTab]?.map((notification, index) => (
          <NotificationCard
            key={index}
            notification={notification}
            selectedTab={props.selectedTab}
          />
        ))}
    </>
  );
};
