import React, { useState } from "react";

import useTranslation from "next-translate/useTranslation";

import { Box, Button, Dialog, Typography } from "@mui/material";

import ButtonLoader from "components/custom/ButtonLoader";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import { _StudentRoleService } from "services/studentRole.service";
import { courseStore } from "store/courseStore";

interface Props {
  handleClose: () => void;
  open: boolean;
}

export const CertificateRequestPopup = (props: Props) => {
  const [course] = courseStore((state) => [state.course]);

  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("course");

  const onSubmit = async () => {
    setLoading(true);
    course?.order?.id &&
      _StudentRoleService
        .createStudentRequestCertificate({
          student_order_id: course?.order?.id,
        })
        .then((res) => console.log(res))
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
        <WorkspacePremiumOutlinedIcon
          sx={{ fontSize: "80px", color: "#FFC107" }}
        />
      </Box>

      <Box sx={{ mt: "22px" }}>
        <Typography
          sx={{
            mt: "10px",
            fontSize: "30px",
            fontWeight: "700",
            color: "primary.main",
            textAlign: "center",
          }}
        >
          {t("popup cerificate title")}
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
