import { Box, Typography } from "@mui/material";
import React from "react";

interface Props {
  name: string;
  email?: string;
  imgUrl?: string;
  type: "course" | "student";
}

export const NameTableCell = (props: Props) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", columnGap: "10px" }}>
      <Box
        sx={{
          width: "45px",
          height: "45px",
          // backgroundImage: props.imgUrl,
          borderRadius: props.type === "student" ? "50%" : "10px",
          backgroundColor: "gray.light",
        }}
      ></Box>
      <Box>
        <Typography
          sx={{ fontSize: "12px", fontWeight: "700", color: "#000000" }}
        >
          {props.name}
        </Typography>
        {props.type === "student" && (
          <Typography sx={{ fontSize: "10px" }}>{props.email}</Typography>
        )}
      </Box>
    </Box>
  );
};
