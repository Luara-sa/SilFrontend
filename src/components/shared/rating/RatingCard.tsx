import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

import { RatingStep1 } from "./RatingStep1";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { RatingSubmitSection } from "./RatingSubmitSection";
import { rateStore } from "store/rateStore";
import { RatingStep2 } from "./RatingStep2";

export const RatingCard = () => {
  const [step, setStep] = rateStore((state) => [state.step, state.setStep]);

  const [isClosed, setIsClosed] = useState(false);

  const handleClose = () => {
    setIsClosed(true);
  };

  useEffect(() => {
    setStep(1);
    return () => {
      setStep(undefined);
    };
  }, []);

  if (isClosed) return <></>;

  return (
    <Box
      sx={{
        width: { xs: "100vw", sm: "500px" },
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.25)",
        borderRadius: "20px",
        padding: "30px 30px 20px 30px",
        backgroundColor: "gray.active",
      }}
    >
      {step === 1 && <RatingStep1 handleClose={handleClose} />}
      {step === 2 && <RatingStep2 handleClose={handleClose} />}

      <RatingSubmitSection handleClose={handleClose} />
    </Box>
  );
};
