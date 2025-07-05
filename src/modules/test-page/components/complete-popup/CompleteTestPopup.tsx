import React, { forwardRef, useImperativeHandle, useState } from "react";
import Link from "next/link";

import useTranslation from "next-translate/useTranslation";

import { Box, Button, Dialog, Typography } from "@mui/material";

import TaskOutlinedIcon from "@mui/icons-material/TaskOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import { useRouter } from "next/router";

interface Props {
  mark: number | undefined;
}

export const CompleteTestPopup = forwardRef(({ mark }: Props, ref) => {
  const router = useRouter();
  const { t } = useTranslation("test");
  useImperativeHandle(ref, () => ({
    handleOpen,
  }));

  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    if (router.query.id) {
      router.push({
        pathname: `/courses/[id]/lesson`,
        query: {
          id: router.query.id,
        },
      });
    } else {
      router.push("/");
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
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
          <TaskOutlinedIcon sx={{ fontSize: "90px", color: "#4CAF50" }} />
        </Box>
        <Box sx={{ mt: "10px" }}>
          <Typography
            sx={{
              color: "#4CAF50",
              fontSize: "30px",
              fontWeight: "700",
              textAlign: "center",
            }}
          >
            {t("test completed")}
          </Typography>
        </Box>
        <Box sx={{ mt: "20px" }}>
          <Typography
            sx={{
              color: "primary.main",
              fontSize: "20px",
              fontWeight: "700",
            }}
          >
            {t("your mark is")}
          </Typography>
        </Box>
        <Typography
          sx={{
            color: "#4CAF50",
            fontSize: "60px",
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          {mark}
        </Typography>
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
              pathname: "/test",
              query: { isPlacement: "1" },
            }}
          >
            <Button
              onClick={handleClose}
              startIcon={<CheckOutlinedIcon />}
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
              {t("done")}
            </Button>
          </Link>
        </Box>
      </Box>
    </Dialog>
  );
});

CompleteTestPopup.displayName = "CompleteTestPopup";
