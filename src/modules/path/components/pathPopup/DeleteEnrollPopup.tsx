import { useState } from "react";
import Image from "next/image";
import useTranslation from "next-translate/useTranslation";

import { Box, Button, Dialog, Typography } from "@mui/material";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import ContactSupportOutlinedIcon from "@mui/icons-material/ContactSupportOutlined";
import { _CourseService } from "services/course.service";
import { _PathService } from "services/path.service";
import { pathStore } from "store/pathStore";
import { useRouter } from "next/router";

interface Props {
  enrollId: string;
}

export const DeleteEnrollPopup = (props: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const { t } = useTranslation("course");

  const [setPath] = pathStore((state) => [state.setPath]);

  const Refetchpath = () => {
    router.query.id &&
      _PathService.getCoursesPath(router.query.id as any).then((res) => {
        setPath(res.result);
      });
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = () => {
    _PathService.deleteEnrollPath(props?.enrollId).then((res) => {
      Refetchpath();
      handleClose();
    });
  };

  return (
    <>
      <Button
        variant="default"
        onClick={handleOpen}
        fullWidth
        sx={{
          borderRadius: "10px",
          fontSize: [13, 13, 14, 13, 13],
          color: "#FF5252",
          backgroundColor: "rgba(255, 82, 82, 0.2)",

          "&:hover": {
            backgroundColor: "#FF5252",
          },
        }}
        startIcon={<SubscriptionsIcon sx={{ color: "#FF5252" }} />}
      >
        {t("enrolled path")}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            overflow: "hidden ",
          },
        }}
      >
        <Box
          sx={{
            backgroundColor: "#FFDCDC",
            width: "582px",
            height: "385px",
            borderRadius: "15px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <ContactSupportOutlinedIcon
            sx={{ fontSize: "95px", color: "#FF5252" }}
          />
          <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Typography
              sx={{
                fontSize: "30px",
                fontWeight: "700",
                color: "#FF5252",
                textAlign: "center",
              }}
            >
              {t("are you sure to remove enroll")}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: "10px" }}>
            <Button
              onClick={handleClose}
              sx={{
                backgroundColor: "#FF525233",
                gap: "3px",
                borderRadius: "10px",
                color: "#FF5252",
                fontWeight: "700",
                width: "127px",
                height: "42px",
              }}
              endIcon={<HighlightOffOutlinedIcon sx={{ color: "#FF5252" }} />}
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={handleSubmit}
              sx={{
                backgroundColor: "rgba(12, 128, 144, 0.3)",
                gap: "3px",
                borderRadius: "10px",
                color: "#0C8090",
                fontWeight: "700",
                width: "127px",
                height: "42px",
              }}
              endIcon={<CheckCircleOutlineIcon sx={{ color: "#0C8090" }} />}
            >
              {t("sure")}
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};
