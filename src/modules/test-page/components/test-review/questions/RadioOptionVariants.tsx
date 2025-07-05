import { Box } from "@mui/material";
import React from "react";

interface Props {
  active: boolean;
  optioncount: string;
  variants: "student" | "correct" | "default";
}

export const RadioOptionVariants = ({
  active,
  optioncount,
  variants,
}: Props) => {
  return (
    <Box
      sx={{
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: variantsObj[variants].backGroundColor,
        color: variantsObj[variants].color,
        borderRadius: "10px 0 0 10px",
        fontSize: "14px",
      }}
    >
      {optioncount}
    </Box>
  );
};

const variantsObj = {
  student: { backGroundColor: "#FFC1C1", color: "#FF5252" },
  correct: { backGroundColor: "rgba(76, 175, 80, 0.5)", color: "#1E5B63" },
  default: { backGroundColor: "#D9D9D9", color: "#AAAAAA" },
};
