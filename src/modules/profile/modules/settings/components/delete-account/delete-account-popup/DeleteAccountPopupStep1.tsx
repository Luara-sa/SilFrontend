import React from "react";

import useTranslation from "next-translate/useTranslation";

import { Box, Button, Typography } from "@mui/material";

import { profileSettingsStore } from "store/profileSettingsStore";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";

export const DeleteAccountPopupStep1 = () => {
  const [setDeleteAccoutPopupStep, closeDeleteAccoutPopup] =
    profileSettingsStore((state) => [
      state.setDeleteAccoutPopupStep,
      state.closeDeleteAccoutPopup,
    ]);

  const { t } = useTranslation("profile");

  return (
    <>
      <Box sx={{ backgroundColor: "#FFDCDC", padding: "20px 40px" }}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <DeleteForeverOutlinedIcon
            sx={{ fontSize: "120px", color: "#FF5252" }}
          />
        </Box>
        <Box sx={{ mt: "22px" }}>
          <Typography
            sx={{
              fontSize: "25px",
              color: "#FF5252",
              fontWeight: "700",
              textAlign: "center",
            }}
          >
            {t("popup delete account text")}
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
            {t("popup delete account question")}
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
          <Button
            onClick={() => setDeleteAccoutPopupStep(2)}
            startIcon={<CheckCircleOutlineIcon />}
            variant="contained"
            sx={{
              color: "primary.main",
              px: "30px",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: "700",
              backgroundColor: "rgba(30, 91, 99, 0.2)",
              "&:hover": {
                color: "gray.active",
              },
            }}
          >
            {t("yes")}
          </Button>
          <Button
            onClick={() => closeDeleteAccoutPopup()}
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
      </Box>
    </>
  );
};
