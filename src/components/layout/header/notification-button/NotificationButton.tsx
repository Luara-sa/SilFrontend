import React, { useEffect, useState } from "react";

import { Badge, IconButton } from "@mui/material";

import { _AuthService } from "services/auth.service";
import { notificationStore } from "store/notificationStore";
import { _WithAuthService } from "services/withAuth.service";

import { MenuLangStyled } from "components/styled";
import { NotificationMenuWraper } from "./NotificationMenu/NotificationMenuWraper";

import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";

export const NotificationButton = () => {
  const [notifications, setNotifications] = notificationStore((state) => [
    state.notifications,
    state.setNotifications,
  ]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    // Get unseen notification count
    _WithAuthService
      .getNotificationsByToken({ is_read: 2 })
      .then((res) => setNotifications(res.result.data, "unseen"))
      .catch((err) => console.error(err));

    return () => {};
  }, []);

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          backgroundColor: "inherit",
          height: "50px",
          width: "50px",
        }}
      >
        <Badge
          color="error"
          badgeContent={notifications?.unseen?.length}
          showZero
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          {/* <img src="/assets/icons/notifcation.svg" alt="" /> */}
          <NotificationsOutlinedIcon
            sx={{ color: "primary.main", fontSize: "27px" }}
          />
        </Badge>
      </IconButton>
      <MenuLangStyled
        sx={{ ...menuStyle }}
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <NotificationMenuWraper />
      </MenuLangStyled>
    </>
  );
};

const menuStyle = {
  mt: "15px",
  zIndex: "11000",
  "& .MuiMenu-paper": {
    width: { xs: "320px", md: "472px" },
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
    border: "3px solid #EEEEEE",
    maxHeight: "70vh",
    overflowY: "hidden",
    "::-webkit-scrollbar": {
      width: "8px",
    },
    "::-webkit-scrollbar-thumb": {
      backgroundColor: "gray.dark",
      borderRadius: "15px",
    },
  },
  "& .MuiList-root.MuiList-padding ": {
    padding: "0px !important",
  },
};
