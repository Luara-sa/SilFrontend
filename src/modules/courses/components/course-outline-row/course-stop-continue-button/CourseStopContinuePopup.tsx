import React, { useEffect, useState } from "react";

import { Box, Button, Dialog, Typography } from "@mui/material";

import ButtonLoader from "components/custom/ButtonLoader";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import PanToolOutlinedIcon from "@mui/icons-material/PanToolOutlined";
import PublishedWithChangesOutlinedIcon from "@mui/icons-material/PublishedWithChangesOutlined";
import { _StudentRoleService } from "services/studentRole.service";
import { courseStore } from "store/courseStore";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { StringDouble } from "interface/common";
import { _CourseService } from "services/course.service";

interface Props {
  handleClose: () => void;
  open: boolean;
  type: "stopped" | "normal";
}

export const CourseStopContinuePopup = (props: Props) => {
  const [course, setCourse] = courseStore((state) => [
    state.course,
    state.setCourse,
  ]);
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation("course");
  const { locale } = useRouter();
  const router = useRouter();

  const refetchCourses = () => {
    _CourseService.getById(router?.query?.id as string).then((res) => {
      setCourse(res);
    });
  };

  const onSubmit = () => {
    setLoading(true);
    _StudentRoleService
      .changeStudentOrderStatus({
        status: props.type,
        student_order_id: course?.order?.id ?? 0,
      })
      .then((res) => {
        refetchCourses();
        props.handleClose();
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      sx={{
        "& .MuiDialog-paper ": {
          px: "40px",
          py: "20px",
          backgroundColor: "#FFFEFA",
          maxWidth: "100%",
          minWidth: "290px",
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        {stopContinueValues[props.type].icon}
      </Box>
      <Box sx={{ mt: "22px" }}>
        <Typography
          sx={{
            fontSize: "25px",
            color: stopContinueValues[props.type].textColor,
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          {stopContinueValues[props.type].text[locale as keyof StringDouble]}
        </Typography>
        <Typography
          sx={{
            textAlign: "center",
            color: "#888888",
            fontSize: "18px",
            mt: "10px",
            fontWeight: "500",
          }}
        >
          {t("withdrawn popup text 2")}
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
          {t("popup text question")}
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
        <ButtonLoader
          loading={loading}
          disableOnLoading
          onClick={onSubmit}
          startIcon={!loading && <CheckCircleOutlineIcon />}
          variant="contained"
          textstyle={{ fontSize: "16px", fontWeight: "700" }}
          sx={{
            color: "primary.main",
            px: "30px",
            borderRadius: "10px",

            backgroundColor: "rgba(30, 91, 99, 0.2)",
            "&:hover": {
              color: "gray.active",
            },
          }}
        >
          {t("yes")}
        </ButtonLoader>
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
    </Dialog>
  );
};

const stopContinueValues: any = {
  stopped: {
    icon: <PanToolOutlinedIcon sx={{ color: "#FF5252", fontSize: "80px" }} />,
    text: {
      ar: "أنت الآن على وشك إيقاف هذه الدورة",
      en: "You are now about to stop this course",
    },
    textColor: "#FF5252",
  },
  normal: {
    icon: (
      <PublishedWithChangesOutlinedIcon
        sx={{ color: "#4CAF50", fontSize: "80px" }}
      />
    ),
    text: {
      ar: "أنت الآن على وشك الإستمرار في هذه الدورة",
      en: "You are now about to continue this course",
    },
    textColor: "#4CAF50",
  },
};
