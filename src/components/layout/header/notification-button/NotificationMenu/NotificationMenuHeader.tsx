import React, { useState } from "react";

import useTranslation from "next-translate/useTranslation";

import { Dialog, Typography } from "@mui/material";

import { _WithAuthService } from "services/withAuth.service";
import { MakeAllReadPopup } from "../NotificationConfirmPopup/MakeAllReadPopup";

export const NotificationMenuHeader = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation("header");
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  return (
    <>
      <Typography
        sx={{
          color: "primary.main",
          fontSize: "20px",
          fontWeight: "700",
        }}
      >
        {t("notifications")}
      </Typography>
      <Typography
        onClick={() => handleOpen()}
        sx={{
          color: "primary.main",
          fontSize: "14px",
          fontWeight: "500",
          cursor: "pointer",
        }}
      >
        {t("make all read")}
      </Typography>
      <Dialog
        open={open}
        onClose={() => handleClose()}
        sx={{
          "& .MuiDialog-paper ": {
            px: "40px",
            py: "20px",
            backgroundColor: "#FFFEFA",
            maxWidth: "100%",
            minWidth: "290px",
          },
          zIndex: "11001",
        }}
      >
        <MakeAllReadPopup handleClose={handleClose} />
      </Dialog>
    </>
  );
};
