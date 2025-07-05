import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import { CourseWithDrawnPopup } from "./CourseWithDrawnPopup";
import useTranslation from "next-translate/useTranslation";
export const CourseWithdrawnButton = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { t } = useTranslation("course");

  return (
    <Box>
      <Button
        startIcon={<img src="/assets/icons/shared/output_circle.svg" />}
        onClick={handleOpen}
        sx={{
          borderRadius: "10px",
          backgroundColor: "#FFC107",
          width: "160px",
          height: "50px",
          border: "3px solid #D9D9D9",
          color: "#1E5B63",
          "& svg path": {
            transition: "0.2s",
          },
          ":hover": {
            color: "#fde8e8",
            "& svg path": {
              fill: "#fde8e8",
              transition: "0.2s",
            },
          },
        }}
      >
        {t("withdrawn")}
      </Button>
      <CourseWithDrawnPopup open={open} handleClose={handleClose} />
    </Box>
  );
};
