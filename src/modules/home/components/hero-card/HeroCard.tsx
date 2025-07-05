import { Box, Typography } from "@mui/material";
import Image from "next/image";
import React, { FC } from "react";

interface Props {
  title: string;
  desc: string;
  icon: React.ReactNode;
}

export const HeroCard: FC<Props> = (props) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        maxWidth: "300px",
        width: { xs: "179px", md: "299px" },
        backgroundColor: "gray.active",
        height: { xs: "60px", md: "100px" },
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
        borderRadius: "20px",
        border: "3px solid #EEEEEE",
        borderColor: "gray.light",
        p: { xs: "10px", md: "20px" },
      }}
    >
      <Box>
        <Typography
          variant="subtitle1"
          sx={{
            color: "primary.main",
            fontWeight: 700,
            fontSize: { xs: "12px", md: "16px" },
          }}
        >
          {props.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "#888888", fontSize: { xs: "6px", md: "10px" } }}
        >
          {props.desc}
        </Typography>
      </Box>
      <Box
        sx={{
          width: { xs: "30px", md: "60px" },
          height: { xs: "30px", md: "60px" },
        }}
      >
        {props.icon}
      </Box>
    </Box>
  );
};
