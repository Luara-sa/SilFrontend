import { Box, Typography } from "@mui/material";
import { Gender } from "interface/common";
import { renderColorGender } from "modules/profile/helper/renderSwitch";
import React from "react";

interface Props {
  gender: any;
}

export const GenderShip = (props: Props) => {
  return (
    <Box
      sx={{
        backgroundColor: renderColorGender(props.gender),
        borderRadius: "5px",
        padding: "2px 4px",
      }}
    >
      <Typography
        sx={{
          fontSize: "10px",
          color: props.gender === "both" ? "#000" : "gray.light",
          textTransform: "capitalize",
        }}
      >
        {props.gender}
      </Typography>
    </Box>
  );
};
