import React from "react";

import { Box, Typography } from "@mui/material";

import { DeleteAccountButton } from "./DeleteAccountButton";
import useTranslation from "next-translate/useTranslation";

export const DeleteAccount = () => {
  const { t } = useTranslation("profile");
  return (
    <Box
      sx={{
        pt: "30px",
        pb: "40px",
        borderBottom: "1px solid #EEEEEE",
        display: "flex",
        alignItems: "center",
        columnGap: "60px",
      }}
    >
      <Box>
        <Typography
          sx={{ fontSize: "18px", color: "primary.main", fontWeight: "500" }}
        >
          {t("delete your account")}
        </Typography>
        <Typography sx={{ fontSize: "14px", color: "#888888" }}>
          {t("delete account text")}
        </Typography>
      </Box>
      <Box>
        <DeleteAccountButton />
      </Box>
    </Box>
  );
};
