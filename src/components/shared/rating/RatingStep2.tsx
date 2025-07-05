import React, { useState } from "react";

import { Box, TextareaAutosize, Typography } from "@mui/material";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { rateStore } from "store/rateStore";

interface Props {
  handleClose: any;
}

export const RatingStep2 = (props: Props) => {
  const [setRateInput] = rateStore((state) => [state.setRateInput]);

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          sx={{
            color: "primary.main",
            fontSize: "26px",
            fontWeight: "700",
            width: "70%",
          }}
        >
          (Optional) What can we do in your opinion?
        </Typography>
        <Box onClick={() => props.handleClose()} sx={{ cursor: "pointer" }}>
          <CloseOutlinedIcon sx={{ color: "primary.main" }} />
        </Box>
      </Box>
      <Typography
        sx={{
          fontSize: "16px",
          fontWeight: "500",
          color: "#9098A3",
          mt: "5px",
        }}
      >
        Write to us what you think
      </Typography>
      <Box>
        <TextareaAutosize
          aria-label=""
          placeholder="We'd love to know..."
          onChange={(e) => setRateInput(e.target.value)}
          style={{
            width: "100%",
            // boxSizing: "border-box",
            maxWidth: "100%",
            maxHeight: "140px",
            height: "1400px",
            borderRadius: "5px",
            outline: "none",
            marginTop: "20px",
            padding: "10px",
            borderColor: "#c0c0c0",
          }}
        />
      </Box>
    </>
  );
};
