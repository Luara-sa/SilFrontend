import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

interface Props {
  setResend: (a: boolean) => void;
}

export const Timer = (props: Props) => {
  const [seconds, setSeconds] = useState(30);

  if (seconds <= 0) {
    props?.setResend(false);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((seconds) => seconds - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box>
      <Typography
        sx={{
          borderBottom: "0.5px solid #CBA770",
          cursor: "pointer",
          color: "wood.main",
          fontSize: "14px",
        }}
      >
        {seconds}
      </Typography>
    </Box>
  );
};
