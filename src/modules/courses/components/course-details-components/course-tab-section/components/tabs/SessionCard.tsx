import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

import { Box, Collapse, Typography } from "@mui/material";

import { courseStore } from "store/courseStore";
import { Attachment } from "interface/common";

import {
  AttachmentLinkDisabled,
  AttachmentLinkEnabled,
} from "modules/courses/components/course-sessions-components";
import { NonUserAttachmentLink } from "modules/courses/components/course-sessions-components/attachment-links/NonUserAttachmentLink";

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
interface Props {
  attachments: Attachment[];
}

export const SessionCard = (props: Props) => {
  const [course] = courseStore((state) => [state.course]);

  const isOrderStatus = course?.order?.order_status === "completed";
  const isStudentStatus =
    course?.order?.student_status !== "stopped" &&
    course?.order?.student_status !== "frozen";

  const hasStudentAttachmentCard = useMemo(() => {
    if (course?.order) {
      if (isOrderStatus) {
        if (isStudentStatus) return true;
        else return false;
      }
      return false;
    } else return false;
  }, [isOrderStatus, isStudentStatus, course?.order]);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const router = useRouter();

  const handleAttachmentClick = (attach: Attachment) => {
    router.push({
      pathname: `${router.pathname}/lesson`,
      query: {
        ...router.query,
        session: attach.session_id,
        attachment: attach.id,
      },
    });
  };

  return (
    <Box
      sx={{
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
        borderRadius: "5px",
        py: "10px",
        backgroundColor: "#FFFFFF",
      }}
    >
      <Box>
        <Box
          onClick={() => setIsOpen((old) => !old)}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
            pl: "33px",
            pr: "20px",
            cursor: "pointer",
          }}
        >
          <Typography
            sx={{
              fontSize: "14px !important",
              color: "gray.50",
              fontWeight: "700 !important",
            }}
          >
            Session
          </Typography>
          {isOpen ? (
            <ExpandLess sx={{ color: "gray.50" }} />
          ) : (
            <ExpandMore sx={{ color: "gray.50" }} />
          )}
        </Box>
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <Box sx={{ pt: "45px", pb: "20px" }}>
            {props.attachments?.map((attachment, index) => (
              <Box key={index}>
                {hasStudentAttachmentCard ? (
                  !attachment.locked ? (
                    <Box onClick={() => handleAttachmentClick(attachment)}>
                      <AttachmentLinkEnabled attachment={attachment} />
                    </Box>
                  ) : (
                    <AttachmentLinkDisabled attachment={attachment} />
                  )
                ) : (
                  <NonUserAttachmentLink attachment={attachment} />
                )}
              </Box>
            ))}
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
};
