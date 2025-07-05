import {
  Box,
  CircularProgress,
  circularProgressClasses,
  CircularProgressProps,
  Typography,
} from "@mui/material";
import { renderColorCircle } from "modules/profile/helper/renderSwitch";
import React from "react";

export const CircularStatic = (
  props: CircularProgressProps & { value: number }
) => {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        {...props}
        sx={{
          color: renderColorCircle(props.value),
          zIndex: "1",
          borderRadius: "5px",
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: "round",
          },
        }}
      />
      <CircularProgress
        variant="determinate"
        sx={{
          color: "#EEEEEE",
          position: "absolute",
          left: 0,
        }}
        size={40}
        thickness={4}
        value={100}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          // component="div"
          sx={{ color: "gray.50", fontSize: "10px", fontWeight: "700" }}
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
};
