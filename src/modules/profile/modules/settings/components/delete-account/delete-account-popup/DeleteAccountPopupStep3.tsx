import { Box, Typography } from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { _AuthService } from "services/auth.service";
import { profileSettingsStore } from "store/profileSettingsStore";

export const DeleteAccountPopupStep3 = () => {
  const router = useRouter();

  const { t } = useTranslation("profile");

  const [resetDeleteAccoutPopup] = profileSettingsStore((state) => [
    state.resetDeleteAccoutPopup,
  ]);

  useEffect(() => {
    setTimeout(() => {
      resetDeleteAccoutPopup();
      _AuthService.doLogout();
      router.push("/");
    }, 2500);

    return () => {};
  }, []);

  return (
    <Box sx={{ padding: "20px 40px" }}>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <img src="/assets/icons/profile/goodbye-icon.svg" />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          rowGap: "10px",
        }}
      >
        <Typography
          sx={{
            color: "#888888",
            fontSize: "30px",
            fontWeight: "700",
            mt: "35px",
          }}
        >
          {t("your account has been")}
        </Typography>
        <Typography
          sx={{ fontSize: "30px", fontWeight: "700", color: "#FF5252" }}
        >
          {t("deleted")}
        </Typography>
        <Typography
          sx={{ fontSize: "18px", color: "#888888", fontWight: "500px" }}
        >
          {t("thank you for your expeience")}
        </Typography>
        <Typography
          sx={{
            fontSize: "18px",
            fontWeight: "700",
            color: "#888888",
          }}
        >
          {t("we wish you success")}
        </Typography>
      </Box>
    </Box>
  );
};
