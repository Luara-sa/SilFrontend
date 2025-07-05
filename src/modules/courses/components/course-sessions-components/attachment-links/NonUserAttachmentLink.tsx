import { Box, Typography } from "@mui/material";
import React from "react";

import { Attachment } from "interface/common";
import { RenderIcon } from "modules/courses/shared";

interface Props {
  attachment: Attachment;
}

export const NonUserAttachmentLink = (props: Props) => {
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
        // cursor: "pointer",

        // "&:hover": {
        //   backgroundColor: "rgba(220, 220, 220, 0.3)",
        // },
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
        })}
        <Typography sx={{ fontSize: "12px", color: "gray.50" }}>
          {props.attachment.description.en}
        </Typography>
      </Box>
    </Box>
  );
};
