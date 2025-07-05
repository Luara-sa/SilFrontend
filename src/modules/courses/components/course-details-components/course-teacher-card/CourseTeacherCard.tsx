import { Avatar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

interface Props {
  teacherImage?: string;
  teacherName: string;
}

export const CourseTeacherCard = (props: Props) => {
  return (
    <Box
      sx={{
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.4)",
        backgroundColor: "#FFFEFA",
        borderRadius: "5px",
        px: "10px",
        py: "20px",
        width: { lg: "290px", xl: "350px" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          columnGap: "15px",
          px: "20px",
          borderBottom: "1px solid rgba(0, 0, 0, 0.25)",
          // width: "100%",
          pb: "12px",
        }}
      >
        <Box>
          <Avatar
            src={props.teacherImage}
            sx={{
              width: "72px",
              height: "72px",
              border: "3px solid #FFD700",
            }}
          />
        </Box>
        <Box>
          <Typography
            sx={{
              color: "primary.main",
              fontSize: "18px",
              fontWeight: "700",
              textTransform: "capitalize",
            }}
          >
            {props.teacherName}
          </Typography>
          <Typography sx={{ color: "primary.main", fontSize: "16px" }}>
            English
          </Typography>
        </Box>
      </Box>
      <Box sx={{ px: "20px", pt: "12px" }}>
        <Box>
          <Typography sx={{ color: "gray.50", fontSize: "12px" }}>
            Lorem ipsum is placeholder text commonly used in the graphic, print,
            and publishing industries for previewing layouts and visual mockups.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
