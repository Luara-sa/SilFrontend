import React, { useState } from "react";
import { Box, Button, Dialog, Typography } from "@mui/material";

import ButtonLoader from "components/custom/ButtonLoader";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

interface Props {
  handleClose: () => void;
  open: boolean;
  onSubmit: () => void;
  handleCancel: () => void;
}

export const PrivacyPolicy = (props: Props) => {
  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      sx={{
        "& .MuiDialog-paper": {
          px: "22px",
          pb: "30px",
          backgroundColor: "#FFFEFA",
          width: "80vw",
          //   height:'90vh',
          minWidth: "290px",
          maxWidth: "100%",
        },
      }}
    >
      <Box>
        <Typography
          sx={{
            mt: "15px",
            fontSize: "30px",
            fontWeight: "700",
            color: "primary.main",
          }}
        >
          Experimental test
        </Typography>
        <Box sx={{ px: "40px", mt: "40px" }}>
          <Typography
            sx={{ color: "#888888", fontSize: "20px", fontWeight: "500" }}
          >
            This placement test is designed to assess your current knowledge and
            skill level. The results will help us recommend the most suitable
            courses and learning paths for you. By proceeding with this test,
            you agree to: (1) Complete the test honestly without external
            assistance, (2) Allow us to use your results to personalize your
            learning experience, (3) Understand that test results are for
            assessment purposes only and do not affect your enrollment
            eligibility. The test typically takes 30-45 minutes to complete. You
            can take breaks between sections, but each section must be completed
            in one sitting. Your responses are confidential and will only be
            used to enhance your educational journey with us. If you have any
            questions or concerns about the test, please contact our support
            team before proceeding.
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          columnGap: "10px",
          mt: "25px",
        }}
      >
        <Button
          onClick={props.onSubmit}
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
          I Agree
        </Button>
        <Button
          onClick={props.handleCancel}
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
          No
        </Button>
      </Box>
    </Dialog>
  );
};
