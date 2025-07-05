import React from "react";

import { Dialog } from "@mui/material";

import { profileSettingsStore } from "store/profileSettingsStore";

import { DeleteAccountPopupStep1 } from "./DeleteAccountPopupStep1";
import { DeleteAccountPopupStep2 } from "./DeleteAccountPopupStep2";
import { DeleteAccountPopupStep3 } from "./DeleteAccountPopupStep3";

export const DeleteAccountPopup = () => {
  const [isDeleteAccoutPopup, closeDeleteAccoutPopup, deleteAccoutPopupStep] =
    profileSettingsStore((state) => [
      state.isDeleteAccoutPopup,
      state.closeDeleteAccoutPopup,
      state.deleteAccoutPopupStep,
    ]);

  console.log("deleteAccoutPopupStep", deleteAccoutPopupStep);

  const RenderPopupStep = () => {
    switch (deleteAccoutPopupStep) {
      case 1:
        return <DeleteAccountPopupStep1 />;
        break;

      case 2:
        return <DeleteAccountPopupStep2 />;

      case 3:
        return <DeleteAccountPopupStep3 />;
    }
  };

  return (
    <Dialog
      open={isDeleteAccoutPopup}
      onClose={() => closeDeleteAccoutPopup()}
      sx={{
        "& .MuiDialog-paper ": {
          px: "40px",
          py: "20px",
          backgroundColor: "#FFFEFA",
          maxWidth: "100%",
          width: { xs: "80vw", md: "50vw", lg: "40vw", xl: "35vw" },
          minWidth: "290px",
          padding: "0",
        },
      }}
    >
      {RenderPopupStep()}
    </Dialog>
  );
};
