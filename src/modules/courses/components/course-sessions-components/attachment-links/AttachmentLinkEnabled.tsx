import { Box, Typography } from "@mui/material";
import { Attachment } from "interface/common";
import { RenderIcon } from "modules/courses/shared";
import React from "react";

interface Props {
  attachmentSelected?: Attachment;
  attachment: Attachment;
}

export const AttachmentLinkEnabled = (props: Props) => {
  return (
    <Box
      sx={{
        pl: "33px",
        pr: "22px",
        borderBottom: "1px solid rgba(176, 176, 176, 0.3)",
        py: "7px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "pointer",
        backgroundColor:
          props.attachmentSelected?.id === props.attachment.id
            ? "rgba(25, 118, 210, 0.1)"
            : "",
        "&:hover": {
          backgroundColor: "rgba(220, 220, 220, 0.3)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          columnGap: "6px",
        }}
      >
        {RenderIcon({
          type: props.attachment.file_type,
          color:
            props.attachmentSelected?.id === props.attachment.id
              ? "#005CAF"
              : props.attachment.attended
              ? "#4CAF50"
              : !props.attachment.locked
              ? "#FFC107"
              : undefined,
        })}

        <Typography sx={{ fontSize: "12px", color: "gray.50" }}>
          {props.attachment.description.en}
        </Typography>
      </Box>
    </Box>
  );
};
