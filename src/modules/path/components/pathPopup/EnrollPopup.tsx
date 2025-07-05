import {
  Box,
  Button,
  Dialog,
  Typography,
  MobileStepper,
  Slide,
} from "@mui/material";
import Image from "next/image";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ContactSupportOutlinedIcon from "@mui/icons-material/ContactSupportOutlined";
import UpdateIcon from "@mui/icons-material/Update";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { _PathService } from "services/path.service";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import { pathStore } from "store/pathStore";

interface Props {
  firstCourseId: number;
}

export const EnrollPath = (props: Props) => {
  const { t } = useTranslation("course");
  const router = useRouter();
  const [activeStep, setActiveStep] = useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);
  const [setPath] = pathStore((state) => [state.setPath]);

  const Refetchpath = () => {
    router.query.id &&
      _PathService.getCoursesPath(router.query.id as any).then((res) => {
        setPath(res.result);
      });
  };

  useEffect(() => {
    setActiveStep(1);
  }, [open]);

  const handleSureClick = () => {
    setActiveStep(2);
    _PathService
      .createEnrollPath(router.query.id as string)
      .then((res) => {
        Refetchpath();
      })
      .catch((err) => {
        setOpen(false);
      });
  };
  const handleStartClick = () => {
    router.push(`/courses/${props?.firstCourseId}`);
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        variant="default"
        fullWidth
        startIcon={<SubscriptionsIcon sx={{ color: "primary.main" }} />}
        sx={{
          borderRadius: "10px",
          fontSize: [13, 13, 14, 13, 13],
          "&:hover": {
            backgroundColor: "primary.main",
          },
        }}
      >
        {t("enroll path")}
      </Button>
      <Dialog
        sx={{
          "& .MuiDialog-paper ": {
            py: "20px",
            backgroundColor: "#FFFEFA",
            overflowX: "hidden",
          },
          zIndex: "11001",
        }}
        open={open}
        onClose={handleClose}
      >
        <Box
          sx={{
            width: { xs: "auto", md: "556px" },
            height: "400px",
            backgroundColor: "#FFFEFA",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            alignItems: "center",
            justifyContent: "center",
            px: "1rem",
          }}
        >
          {activeStep === 1 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                alignItems: "center",
                height: "100%",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  pt: "2.5rem",
                  gap: "12px",
                }}
              >
                <Box>
                  <ContactSupportOutlinedIcon
                    sx={{ color: "#FFC107", fontSize: "100px" }}
                  />
                </Box>
                <Typography
                  sx={{ fontSize: "30px", fontWeight: "700", color: "#FFC107" }}
                >
                  {t("are you sure to enroll")}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "10px",
                  }}
                >
                  <Button
                    onClick={handleSureClick}
                    sx={{
                      backgroundColor: "rgba(12, 128, 144, 0.3)",
                      gap: "3px",
                      borderRadius: "10px",
                      color: "#0C8090",
                      fontWeight: "700",
                      width: "127px",
                      height: "42px",
                    }}
                    endIcon={
                      <CheckCircleOutlineIcon sx={{ color: "#0C8090" }} />
                    }
                  >
                    {t("sure")}
                  </Button>

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
                    endIcon={
                      <HighlightOffOutlinedIcon sx={{ color: "#FF5252" }} />
                    }
                  >
                    {t("cancel")}
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
          {activeStep === 2 && (
            <Slide direction="left" in={open} mountOnEnter unmountOnExit>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  src="/assets/icons/course/bookmark.png"
                  width={120}
                  height={120}
                />
                <Typography
                  sx={{ fontSize: "24px", fontWeight: "700", color: "#FFC107" }}
                >
                  {t("enroll path text1")}
                </Typography>
                <Typography
                  sx={{ fontSize: "30px", fontWeight: "700", color: "#0C8090" }}
                >
                  {t("enroll path text2")}
                </Typography>
                <Typography
                  sx={{ fontSize: "15px", fontWeight: "500", color: "#0C8090" }}
                >
                  {t("enroll path text3")}
                </Typography>
                <Typography
                  sx={{ fontSize: "15px", fontWeight: "600", color: "#FFC107" }}
                >
                  {t("enroll path text4")}
                </Typography>
                <Typography
                  sx={{ fontSize: "24px", fontWeight: "600", color: "#979797" }}
                >
                  {t("enroll path question")}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "10px",
                  }}
                >
                  <Button
                    onClick={handleClose}
                    sx={{
                      backgroundColor: "#AAAAAA",
                      gap: "3px",
                      borderRadius: "10px",
                      color: "#888888",
                      fontWeight: "700",
                      width: "127px",
                      height: "42px",
                    }}
                    endIcon={<UpdateIcon sx={{ color: "#888888" }} />}
                  >
                    {t("later")}
                  </Button>
                  <Button
                    onClick={handleStartClick}
                    sx={{
                      backgroundColor: "rgba(12, 128, 144, 0.3)",
                      gap: "3px",
                      borderRadius: "10px",
                      color: "#0C8090",
                      fontWeight: "700",
                      width: "127px",
                      height: "42px",
                    }}
                    endIcon={
                      <CheckCircleOutlineIcon sx={{ color: "#0C8090" }} />
                    }
                  >
                    {t("start button")}
                  </Button>
                </Box>
              </Box>
            </Slide>
          )}
          <Box sx={{ display: "flex", gap: "4px" }}>
            <Box
              sx={{
                backgroundColor: activeStep === 1 ? "#178695" : "#EEEEEE",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
              }}
            />
            <Box
              sx={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: activeStep !== 1 ? "#178695" : "#EEEEEE",
              }}
            />
          </Box>
        </Box>
      </Dialog>
    </>
  );
};
