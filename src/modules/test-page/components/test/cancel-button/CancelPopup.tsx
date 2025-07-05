import React from "react";
import { useRouter } from "next/router";

import useTranslation from "next-translate/useTranslation";

import { Box, Button, Typography } from "@mui/material";

import { _WithAuthService } from "services/withAuth.service";

import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ContactSupportOutlinedIcon from "@mui/icons-material/ContactSupportOutlined";

interface Props {
  handleClose: () => void;
}

export const CancelPopup = (props: Props) => {
  const { t } = useTranslation("test");

  const router = useRouter();

  const handleConfirm = () => router.push("/");

  return (
    <>
      <Box sx={{ backgroundColor: "#FFDCDC", padding: "20px 40px" }}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <ContactSupportOutlinedIcon
            sx={{ fontSize: "100px", color: "#FF5252" }}
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
            {t("are you sure you want to leave?")}
          </Typography>

          <Typography
            sx={{
              mt: "10px",
              fontSize: "20px",
              //   fontWeight: "300",
              color: "#FF5252",
              textAlign: "center",
            }}
          >
            {t("unsaved changes will be lost")}
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
            onClick={handleConfirm}
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
            {t("cancel")}
          </Button>
        </Box>
      </Box>
    </>
  );
};
