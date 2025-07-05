import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { Box, Collapse, Typography } from "@mui/material";

import { Attachment, Course, Session } from "interface/common";

import { courseStore } from "store/courseStore";

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import {
  AttachmentLinkDisabled,
  AttachmentLinkEnabled,
} from "./attachment-links";

interface Props {
  session: Session;
}

export const SessionsList = (props: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();

  const [setAttachment, setSession, course, attachmentSelected] = courseStore(
    (state) => [
      state.setAttachment,
      state.setSession,
      state.course,
      state.attachmentSelected,
    ]
  );

  const handleChangeLesson = (attac: Attachment) => {
    if (!attac.locked) {
      setSession(+attac.session_id);
      setAttachment(+attac.session_id, +attac.id, course as Course);
      router.push(
        {
          pathname: router.pathname,
          query: {
            id: router.query.id,
            session: attac.session_id,
            attachment: attac.id,
          },
        },
        undefined,
        { shallow: true }
      );
    }
  };

  return (
    <Box
      sx={{
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
        borderRadius: "5px",
        backgroundColor: "gray.active",
      }}
    >
      <Box
        onClick={() => setIsOpen((old) => !old)}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: "25px",
          py: "15px",
          cursor: "pointer",
        }}
      >
        <Typography
          sx={{ fontSize: "14px", fontWeight: "700", color: "gray.50" }}
        >
          {props.session.name.en}
        </Typography>
        {isOpen ? (
          <ExpandLess sx={{ color: "gray.50" }} />
        ) : (
          <ExpandMore sx={{ color: "gray.50" }} />
        )}
      </Box>
      {attachmentSelected && (
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <Box sx={{ pt: "15px", pb: "30px" }}>
            {props.session.attachments?.map((attachment, index) => (
              <Box key={index} onClick={() => handleChangeLesson(attachment)}>
                {!attachment.locked ? (
                  <AttachmentLinkEnabled
                    attachment={attachment}
                    attachmentSelected={attachmentSelected}
                  />
                ) : (
                  <AttachmentLinkDisabled attachment={attachment} />
                )}
              </Box>
            ))}
          </Box>
        </Collapse>
      )}
    </Box>
  );
};
