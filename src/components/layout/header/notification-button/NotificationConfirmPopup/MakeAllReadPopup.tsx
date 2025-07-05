import React, { useState } from "react";

import { Box, Button, Typography } from "@mui/material";

import { notificationStore } from "store/notificationStore";
import { _WithAuthService } from "services/withAuth.service";

import ButtonLoader from "components/custom/ButtonLoader";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import MarkAsUnreadIcon from "@mui/icons-material/MarkAsUnread";
import useTranslation from "next-translate/useTranslation";

interface Props {
  handleClose: () => void;
}

export const MakeAllReadPopup = (props: Props) => {
  const [setReRenderNotification] = notificationStore((state) => [
    state.setReRenderNotification,
  ]);

  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("header");

  const onSubmit = async () => {
    setLoading(true);
    await _WithAuthService
      .readNotification({ make_all_read: 1 })
      .then((res) => {
        setReRenderNotification();
        props.handleClose();
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <MarkAsUnreadIcon sx={{ fontSize: "80px", color: "primary.main" }} />
      </Box>
      <Box sx={{ mt: "10px" }}>
        <Typography
          sx={{
            textAlign: "center",
            color: "#888888",
            fontSize: "18px",
            mt: "10px",
            fontWeight: "500",
          }}
        >
          {t("mask all read massage")}
        </Typography>
        <Typography
          sx={{
            mt: "10px",
            fontSize: "30px",
            fontWeight: "700",
            color: "primary.main",
            textAlign: "center",
          }}
        >
          {t("mask all read question")}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          columnGap: "15px",
          mt: "25px",
        }}
      >
        <ButtonLoader
          loading={loading}
          disableOnLoading
          onClick={onSubmit}
          startIcon={!loading && <CheckCircleOutlineIcon />}
          variant="contained"
          textstyle={{ fontSize: "16px", fontWeight: "700" }}
          sx={{
            color: "primary.main",
            px: "30px",
            borderRadius: "10px",

            backgroundColor: "rgba(30, 91, 99, 0.2)",
            "&:hover": {
              color: "gray.active",
            },
          }}
        >
          {t("yes")}
        </ButtonLoader>
        <Button
          onClick={props.handleClose}
          startIcon={<CancelOutlinedIcon />}
          variant="contained"
          sx={{
            color: "#FF5252",
            fontSize: "16px",
            fontWeight: "700",
            px: "30px",
            borderRadius: "10px",
            backgroundColor: "rgba(255, 82, 82, 0.2)",
            "&:hover": {
              backgroundColor: "#FF5252",
              color: "gray.active",
            },
          }}
        >
          {t("no")}
        </Button>
      </Box>
    </>
  );
};
