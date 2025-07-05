import React from "react";
import Link from "next/link";

import { Box, Button, Dialog, Typography } from "@mui/material";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

import LoginIcon from "@mui/icons-material/Login";
import useTranslation from "next-translate/useTranslation";

interface Props {
  open: boolean;
  handleClose: () => void;
}

export const PlacementTestPopupShouldBeLogged = (props: Props) => {
  const { t } = useTranslation("test");
  return (
    <>
      <Dialog
        open={props.open}
        onClose={() => props.handleClose()}
        sx={{
          "& .MuiDialog-paper ": {
            px: "40px",
            py: "20px",
            backgroundColor: "#FFFEFA",
            maxWidth: "600px",
            minWidth: "290px",
          },
          zIndex: "11001",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box>
            <LoginIcon sx={{ fontSize: "80px", color: "#4CAF50" }} />
          </Box>
          <Box sx={{ mt: "20px" }}>
            <Typography
              sx={{
                color: "#4CAF50",
                fontSize: "25px",
                fontWeight: "700",
                textAlign: "center",
              }}
            >
              {t("you should be logged in")}
            </Typography>
          </Box>
          <Box sx={{ mt: "20px" }}>
            <Typography
              sx={{
                color: "primary.main",
                fontSize: "30px",
                fontWeight: "700",
              }}
            >
              {t("do you want logged in")}
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
            <Link
              href={{
                pathname: "/auth/login",
                query: { isPlacement: "1" },
              }}
            >
              <Button
                onClick={() => props.handleClose()}
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
            </Link>
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
              {t("no")}
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};
