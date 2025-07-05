import React, { useMemo, useState } from "react";

import { Box, Button, Typography } from "@mui/material";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { rateStore } from "store/rateStore";
import { _StudentRoleService } from "services/studentRole.service";
import { useRouter } from "next/router";
import { courseStore } from "store/courseStore";
import ButtonLoader from "components/custom/ButtonLoader";

interface Props {
  handleClose: () => void;
}

export const RatingSubmitSection = (props: Props) => {
  const [loading, setLoading] = useState(false);

  const [course, changeRatingCourseStatus] = courseStore((state) => [
    state.course,
    state.changeRatingCourseStatus,
  ]);

  const [step, setStep, rateSelected, rateInput] = rateStore((state) => [
    state.step,
    state.setStep,
    state.rateSelected,
    state.rateInput,
  ]);

  const handleStepChange = () => {
    if (step === 1) {
      setStep(2);
    } else {
      setLoading(true);
      _StudentRoleService
        .ratingCourse({
          course_id: course?.course_id,
          rate_number: rateSelected,
          rate_message: rateInput,
        })
        .then((res) => {
          props.handleClose();
          changeRatingCourseStatus();
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    }
  };

  let NoRateSelected = !Boolean(rateSelected);

  return (
    <Box
      sx={{
        borderTop: "1px solid rgba(176, 176, 176, 0.3)",
        display: "flex",
        justifyContent: "space-between",
        pt: "20px",
        mt: "15px",
      }}
    >
      <Typography
        sx={{ fontSize: "16px", fontWight: "500", color: "primary.main" }}
      >
        Question {step} of 2
      </Typography>
      <Box>
        <ButtonLoader
          loading={loading}
          disableOnLoading
          disabled={NoRateSelected}
          onClick={handleStepChange}
          endIcon={
            step === 1 ? (
              <ArrowForwardIcon sx={{ color: "gray.active" }} />
            ) : undefined
          }
          sx={{
            backgroundColor: NoRateSelected ? "gray.dark" : "#118190",
            borderRadius: "10px",
            width: "100px",
            color: "gray.active",
            "&.Mui-disabled ": { color: "gray.active" },
            ":hover": { backgroundColor: "#0d636e" },
          }}
        >
          {step === 1 ? "Next" : "Submit"}
        </ButtonLoader>
      </Box>
    </Box>
  );
};
