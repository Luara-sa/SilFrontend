import React from "react";
import Link from "next/link";

import useTranslation from "next-translate/useTranslation";

import { Box, Button, Dialog, Typography } from "@mui/material";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";

interface Props {
  open: boolean;
  handleClose: () => void;
}

export const PlacementTestPopup = (props: Props) => {
  const { t } = useTranslation("header");
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
            <PlaylistAddCheckIcon
              sx={{ fontSize: "90px", color: "primary.main" }}
            />
          </Box>
          <Box sx={{ mt: "10px" }}>
            <Typography
              sx={{
                color: "#4CAF50",
                fontSize: "25px",
                fontWeight: "700",
                textAlign: "center",
              }}
            >
              {t("placement test popup massage")}
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
              {t("placement test question")}
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
            <Link href="/placement-tests">
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
