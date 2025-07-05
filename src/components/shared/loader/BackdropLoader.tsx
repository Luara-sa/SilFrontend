import React from "react";

import { Backdrop, CircularProgress } from "@mui/material";

interface Props {
  open: boolean;
}

export const BackdropLoader = ({ open }: Props) => {
  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: "10001",
        backgroundColor: "rgba(30, 91, 99,0.5)",
      }}
      open={open}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};
