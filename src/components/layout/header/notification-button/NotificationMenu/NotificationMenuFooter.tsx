import React, { useState } from "react";

import useTranslation from "next-translate/useTranslation";

import { Box, Button, Dialog } from "@mui/material";
import { DeleteAllPopup } from "../NotificationConfirmPopup/DeleteAllPopup";

export const NotificationMenuFooter = () => {
  const { t } = useTranslation("header");

  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  return (
    <Box
      sx={{
        // position: "fixed",
        // bottom: "0px",
        // right: "0px",
        width: "100%",
        backgroundColor: "#FFFEFA",
        borderTop: "1px solid #EEEEEE",
        py: "10px",
        display: "flex",
        justifyContent: "end",
        pr: "20px",
      }}
    >
      <Button
        onClick={() => handleOpen()}
        sx={{
          backgroundColor: "rgba(255, 82, 82, 0.2)",
          color: "#FF5252",
          borderRadius: "10px",
          py: "5px",
        }}
      >
        {t("remove all")}
      </Button>
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
        <DeleteAllPopup handleClose={handleClose} />
      </Dialog>
    </Box>
  );
};
