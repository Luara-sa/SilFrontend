import { Avatar, Box, Typography } from "@mui/material";
import React, { FC } from "react";

interface Props {
  image: any;
  name?: string;
  withTeacher: boolean;
  nameFontSize?: any[];
  nameBottom?: boolean;
  imageWidth?: string;
  isMyCourse?: boolean;
}

export const Teacher: FC<Props> = (props) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        columnGap: "10px",
        flexDirection: props?.isMyCourse ? "column" : "row",
      }}
    >
      <Avatar
        src={props.image ?? ""}
        sx={{
          width: props.imageWidth
            ? props.imageWidth
            : props.withTeacher
            ? { xs: "27px", md: "40px" }
            : { xs: "27px", md: "35px" },
          height: props.imageWidth
            ? props.imageWidth
            : props.withTeacher
            ? { xs: "27px", md: "40px" }
            : { xs: "27px", md: "35px" },
          border: "3px solid #FFD700",
        }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {props.name && (
          <Typography
            sx={{
              fontSize: props.nameFontSize
                ? props.nameFontSize
                : props.withTeacher
                ? "0.938vw"
                : [10, 10, 11, "0.833vw", "0.833vw"],
              fontWeight: props.withTeacher ? "700" : "400",
              color: "gray.50",
              textTransform: "capitalize",
              textAlign: "center",
            }}
          >
            {props.name}
          </Typography>
        )}
        {props.withTeacher && (
          <Typography
            sx={{
              fontSize: [8, 9, 9, 12, "0.625vw"],
              color: "gray.50",
            }}
          >
            Teacher
          </Typography>
        )}
      </Box>
    </Box>
  );
};
