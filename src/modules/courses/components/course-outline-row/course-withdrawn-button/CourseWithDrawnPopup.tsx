import { Box, Button, Dialog, Typography } from "@mui/material";
import ButtonLoader from "components/custom/ButtonLoader";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import PanToolOutlinedIcon from "@mui/icons-material/PanToolOutlined";
import React, { useState } from "react";
import { _StudentRoleService } from "services/studentRole.service";
import { courseStore } from "store/courseStore";
import useTranslation from "next-translate/useTranslation";
import { _CourseService } from "services/course.service";
import { useRouter } from "next/router";

interface Props {
  handleClose: () => void;
  open: boolean;
}
export const CourseWithDrawnPopup = (props: Props) => {
  const [course, setCourse] = courseStore((state) => [
    state.course,
    state.setCourse,
  ]);
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation("course");
  const router = useRouter();

  const refetchCourses = () => {
    _CourseService.getById(router?.query?.id as string).then((res) => {
      setCourse(res);
    });
  };

  const onSubmit = async () => {
    setLoading(true);
    _StudentRoleService
      .changeStudentOrderStatus({
        status: "withdrawn",
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
        <img
          src="/assets/icons/shared/output_circle.svg"
          style={{ width: "5rem" }}
        />
      </Box>
      <Box sx={{ mt: "22px" }}>
        <Typography
          sx={{
            fontSize: "25px",
            color: "#FFC107",
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          {t("withdrawn popup text 1")}
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
