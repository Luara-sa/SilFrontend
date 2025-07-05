import React, { useState } from "react";

import { Box, Button } from "@mui/material";

import { CourseStopContinuePopup } from "./CourseStopContinuePopup";

import PanToolOutlinedIcon from "@mui/icons-material/PanToolOutlined";
import PublishedWithChangesOutlinedIcon from "@mui/icons-material/PublishedWithChangesOutlined";
import { useRouter } from "next/router";
import { StringDouble } from "interface/common";

interface Props {
  type: "stopped" | "normal";
}

const CourseStopContinueButton = (props: Props) => {
  const [open, setOpen] = useState(false);
  const { locale } = useRouter();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Button
        onClick={handleOpen}
        startIcon={stopedContinueColors[props.type].icon}
        sx={{
          borderRadius: "10px",
          backgroundColor: stopedContinueColors[props.type].background,
          border: "3px solid",
          width: "126px",
          height: "50px",
          borderColor: stopedContinueColors[props.type].border,
          color: stopedContinueColors[props.type].textColor,
          "& svg path": {
            transition: "0.2s",
          },
          ":hover": {
            backgroundColor: stopedContinueColors[props.type].border,
            color: "#fde8e8",
            "& svg path": {
              fill: "#fde8e8",
              transition: "0.2s",
            },
          },
        }}
      >
        {stopedContinueColors[props.type].text[locale as keyof StringDouble]}
      </Button>
      <CourseStopContinuePopup
        open={open}
        handleClose={handleClose}
        type={props.type}
      />
    </Box>
  );
};

export default CourseStopContinueButton;

const stopedContinueColors = {
  stopped: {
    background: "#FF5252",
    border: "3px solid #EEEEEE",
    text: { ar: "إيقاف", en: "Stoped" },
    textColor: "#EEEEEE",
    icon: <PanToolOutlinedIcon />,
  },
  normal: {
    background: "rgba(76, 175, 80, 0.3)",
    border: "#4CAF50",
    text: { ar: "متابعة", en: "Continue" },
    textColor: "#4CAF50",
    icon: <PublishedWithChangesOutlinedIcon />,
  },
  // payability: {
  //   background: "rgba(255, 193, 7, 0.3)",
  //   border: "#FFC107",
  //   text: "Pending",
  //   textColor: "#FFC107",
  //   icon: <TimePending customcolor="#FFC107" />,
  // },
};
