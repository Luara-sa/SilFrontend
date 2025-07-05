import React, { useEffect } from "react";
import { useRouter } from "next/router";

import { _StudentRoleService } from "services/studentRole.service";
import { courseStore } from "store/courseStore";

import { RenderIcon } from "../../shared";

import { Box, ButtonBase, Typography } from "@mui/material";

interface Props {
  type:
    | "png"
    | "jpg"
    | "pdf"
    | "mp4"
    | "docx"
    | "doc"
    | "xls"
    | "xlsx"
    | "none";
  title: string;
  link: string;
}

export const PdfAttachment = (props: Props) => {
  const [
    course,
    updateAttendence,
    attachmentSelected,
    sessionSelected,
    lastAttachmentId,
  ] = courseStore((state) => [
    state.course,
    state.updateAttendence,
    state.attachmentSelected,
    state.sessionSelected,
    state.lastAttachmentId,
  ]);

  const router = useRouter();

  const handleFileClick = () => {
    const attachmentId = router.query.attachment;
    const sessionId = router.query.session;

    if (attachmentSelected?.attended) return;

    updateAttendence(sessionSelected?.id ?? "", attachmentSelected?.id ?? "");
    _StudentRoleService
      .updateAttendanceStudent({
        student_order_id: course?.order?.id ?? "",
        session_id: sessionSelected?.id ?? "",
        attchment_id: attachmentSelected?.id ?? "",
      })
      .then((res) => {
        if (lastAttachmentId && attachmentSelected)
          if (+lastAttachmentId === +attachmentSelected.id)
            _StudentRoleService
              .completedCourse({ student_order_id: course?.order?.id ?? 0 })
              .then((res) => console.log(res))
              .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

  return (
    <a href={props.link} target="pdf-frame" rel="noreferrer">
      <ButtonBase
        onClick={handleFileClick}
        sx={{
          backgroundColor: "primary.main",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
          px: "40px",
          py: "30px",
          borderRadius: "5px",
          cursor: "pointer",
          width: "100%",
          transition: "0.2s",
          "&:hover": {
            backgroundColor: "#174a51",
            transition: "0.2s",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            columnGap: "15px",
            width: "100%",
          }}
        >
          {RenderIcon({ type: props.type, color: "#ffffff" })}
          <Typography
            sx={{ fontSize: "20px", color: "gray.active", fontWeight: "700" }}
          >
            {props.title}
          </Typography>
        </Box>
      </ButtonBase>
    </a>
  );
};
