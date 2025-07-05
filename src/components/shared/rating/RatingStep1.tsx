import { Box, Typography } from "@mui/material";
import React, { useState } from "react";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { rateStore } from "store/rateStore";

interface Props {
  handleClose: any;
}

export const RatingStep1 = (props: Props) => {
  const [rateSelected, setRateSelected] = rateStore((state) => [
    state.rateSelected,
    state.setRateSelected,
  ]);

  const handleRateChange = (rate: number) => {
    setRateSelected(rate);
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          sx={{
            color: "primary.main",
            fontSize: "26px",
            fontWeight: "700",
            width: "60%",
          }}
        >
          How&apos;s your experience so far?{" "}
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
        We&apos;d love to know!
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          columnGap: "10px",
          mt: "20px",
        }}
      >
        {[1, 2, 3, 4, 5].map((rate, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <Box
              onClick={() => handleRateChange(rate)}
              sx={{
                background:
                  rate === rateSelected
                    ? "linear-gradient(270deg, #0E7B8A 0%, #1CA9BC 100%)"
                    : "#D9D9D9",
                borderRadius: "50%",
                width: { xs: "45px", sm: "60px" },
                height: { xs: "45px", sm: "60px" },
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                "& img": { width: { xs: "22px", sm: "auto" } },
              }}
            >
              <img src={`/assets/icons/rating/${rate}-rate.svg`} />
            </Box>
            <Box sx={{ mt: "10px" }}>
              {rate === 1 && (
                <Typography
                  sx={{
                    color: "gray.dark",
                    fontSize: "16px",
                    fontWeight: "500",
                  }}
                >
                  not good
                </Typography>
              )}
              {rate === 5 && (
                <Typography
                  sx={{
                    color: "gray.dark",
                    fontSize: "16px",
                    fontWeight: "500",
                  }}
                >
                  super
                </Typography>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </>
  );
};
