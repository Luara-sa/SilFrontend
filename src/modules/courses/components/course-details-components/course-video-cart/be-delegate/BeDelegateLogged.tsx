import React, { useState } from "react";

import { _StudentRoleService } from "services/studentRole.service";
import { useMe } from "hooks/useMe";
import { _WithAuthService } from "services/withAuth.service";
import { courseStore } from "store/courseStore";
import { useIsMounted } from "hooks/useIsMounted";
import { _CourseService } from "services/course.service";

import { Box, Button, Dialog, Typography } from "@mui/material";
import ButtonLoader from "components/custom/ButtonLoader";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import useTranslation from "next-translate/useTranslation";

interface Props {
  handleClose: () => void;
  open: boolean;
}

export const BeDelegateLogged = (props: Props) => {
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation("course");

  const { isDelegate } = useMe();
  const isMounted = useIsMounted();

  const [course, setCourse] = courseStore((state) => [
    state.course,
    state.setCourse,
  ]);

  const onSubmit = async () => {
    console.log(isMounted.current);
    if (isMounted.current) {
      setLoading(true);
      if (!isDelegate) {
        _StudentRoleService
          .studentBeDelegate()
          .then((res) => console.log(res))
          .catch((err) => console.log(err))
          .finally(() => setLoading(false));
      }
      course?.course_id &&
        (await _WithAuthService
          .createCourseLinkDelegate({
            live_course_id: course?.id,
          })
          .then((res) => {
            const tempCourse = course;
            tempCourse.delegate_course_link = {
              active: 0,
              course_id: 0,
              created_at: new Date(),
              id: 1,
              link: "string",
              user_id: 1,
              users_used: 1,
            };
            setCourse(tempCourse);
            props.handleClose();
          })
          .catch((err) => console.log(err))
          .finally(() => setLoading(false)));
    }
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
        <img src="/assets/icons/course/delegate-checked.svg" />
      </Box>
      <Box sx={{ mt: "22px" }}>
        <Typography
          sx={{
            fontSize: "25px",
            color: "warning.main",
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          {t("you are about to get a link to share")}
        </Typography>
        <Typography
          sx={{
            mt: "15px",
            fontSize: "30px",
            fontWeight: "700",
            color: "primary.main",
            textAlign: "center",
          }}
        >
          {t("do you want to be a delegate")}
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
