import { Box, Typography } from "@mui/material";
import React, { MouseEvent, useState } from "react";
import RadioSwitchWrapper from "./RadioSwitchWrapper";

interface Props {
  borderTop?: boolean;
  borderBottom?: boolean;
  borderBoth?: boolean;
  title: string;
  type: "multiple_choice" | "blanks" | "true_false" | "traditional";
  active?: boolean;
  optioncount: string;
  question: any;
  optionId: string | number;
  // onClick: React.MouseEventHandler<HTMLDivElement>;
}

export const RadioOption = (props: Props) => {
  return (
    <Box
      // onClick={(event) => props.onClick(event)}
      sx={{
        display: "flex",
        alignItems: "center",
        columnGap: "20px",
        cursor: "pointer",
      }}
    >
      <Box sx={{ borderRight: "1px solid gray.main", width: "40.5px" }}>
        <RadioSwitchWrapper
          question={props.question}
          optionId={props.optionId}
          optioncount={props.optioncount}
          type={props?.type}
        />
      </Box>
      <Typography sx={{ fontSize: "14px" }}>{props.title}</Typography>
    </Box>
  );
};
