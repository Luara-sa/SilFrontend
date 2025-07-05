import { Typography } from "@mui/material";
import React from "react";

interface Props {
  helpertext?: string;
}

export const InputHelperText = (props: Props) => {
  if (props.helpertext)
    return (
      <Typography sx={{ color: "#d32f2f", fontSize: "12px", ml: "15px" }}>
        {props.helpertext}
      </Typography>
    );

  return <Typography sx={{ visibility: "hidden" }}></Typography>;
};
