import React from "react";

import { Button } from "@mui/material";

import { profileSettingsStore } from "store/profileSettingsStore";

import { DeleteAccountPopup } from "./delete-account-popup/DeleteAccountPopup";

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import useTranslation from "next-translate/useTranslation";

export const DeleteAccountButton = () => {
  const [openDeleteAccoutPopup] = profileSettingsStore((state) => [
    state.openDeleteAccoutPopup,
  ]);
  const { t } = useTranslation("profile");

  const handleOpen = () => openDeleteAccoutPopup();

  return (
    <>
      <Button
        onClick={handleOpen}
        startIcon={<DeleteForeverIcon />}
        sx={{
          color: "gray.active",
          backgroundColor: "#FF5252",
          "&:hover": { color: "#FF5252" },
          whiteSpace: "pre",
        }}
      >
        {t("delete account")}
      </Button>
      <DeleteAccountPopup />
    </>
  );
};
