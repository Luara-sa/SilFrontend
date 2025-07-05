import { Box, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";

export const AvatarCustom = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        position: "relative",
        borderRadius: "50%",
        overflow: "hidden",
        border: "5px solid ",
        borderColor: "warning.main",
      }}
    >
      <Image
        src="/assets/images/teacher.jpg"
        objectFit="cover"
        layout="fill"
        alt="person"
      />
    </Box>
  );
};
