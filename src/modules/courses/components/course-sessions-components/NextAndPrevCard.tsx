import React, { useMemo } from "react";
import { useRouter } from "next/router";

import shallow from "zustand/shallow";

import { Box, Button, Typography } from "@mui/material";

import { Course } from "interface/common";
import { IAttachmentArray, courseStore } from "store/courseStore";

import { RatingCard } from "components/shared";
import { BootstrapTooltip } from "components/styled";

import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";

export const NextAndPrevCard = () => {
  const router = useRouter();

  const [
    lastAttachmentId,
    attachmentSelected,
    course,
    attachmentsArray,
    setAttachment,
    setSession,
  ] = courseStore(
    (state) => [
      state.lastAttachmentId,
      state.attachmentSelected,
      state.course,
      state.attachmentsArray,
      state.setAttachment,
      state.setSession,
    ],
    shallow
  );

  const showRatingCard =
    course &&
    !course?.user_is_rating &&
    lastAttachmentId === attachmentSelected?.id;

  const nextAttachment: IAttachmentArray | undefined = useMemo(() => {
    if (attachmentSelected && attachmentsArray) {
      const nextIndex = attachmentsArray?.findIndex(
        (attachment) => +attachment.id === +attachmentSelected.id
      ) as any;
      if (nextIndex >= 0 && nextIndex < attachmentsArray.length - 1) {
        return attachmentsArray[nextIndex + 1];
      } else {
        return undefined;
      }
    }
  }, [attachmentSelected]);

  const previousAttachment: IAttachmentArray | undefined = useMemo(() => {
    if (attachmentSelected && attachmentsArray) {
      const nextIndex = attachmentsArray?.findIndex(
        (attachment) => +attachment.id === +attachmentSelected.id
      );
      if (!!nextIndex && nextIndex > 0) {
        return attachmentsArray[nextIndex - 1];
      } else {
        return undefined;
      }
    }
  }, [attachmentSelected]);

  const changeAttachment = (attachment: IAttachmentArray | undefined) => {
    if (!!attachment) {
      setSession(+attachment.session_id);
      setAttachment(+attachment.session_id, +attachment.id, course as Course);
      router.push(
        {
          pathname: router.pathname,
          query: {
            id: router.query.id,
            session: attachment.session_id,
            attachment: attachment.id,
          },
        },
        undefined,
        { shallow: true }
      );
    }
  };

  const arrowLeft = (
    <ArrowBackIosNewOutlinedIcon sx={{ width: "15px", color: "gray.50" }} />
  );

  const arrowRight = (
    <ArrowForwardIosOutlinedIcon sx={{ width: "15px", color: "gray.50" }} />
  );

  return (
    <Box
      sx={{
        // position: "relative",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
        backgroundColor: "gray.active",
        borderRadius: "10px",
        display: "flex",
        justifyContent: "space-between",
        py: "20px",
        px: "20px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", columnGap: "10px" }}>
        <Button
          onClick={() => changeAttachment(previousAttachment)}
          disabled={!Boolean(previousAttachment)}
          startIcon={router.locale === "en" ? arrowLeft : arrowRight}
          sx={{ fontSze: "18px", fontWeight: "700", color: "gray.50" }}
        >
          Prev
        </Button>
        <BootstrapTooltip
          title={
            previousAttachment?.name.en &&
            previousAttachment?.name.en?.length > 14 &&
            previousAttachment?.name.en
          }
        >
          <Typography
            sx={{
              fontSize: "13px",
              color: "primary.main",
              fontWeight: "700",
            }}
          >
            {previousAttachment?.name.en &&
            previousAttachment?.name.en?.length > 14
              ? previousAttachment?.name.en?.substring(0, 20) + "..."
              : previousAttachment?.name.en}
          </Typography>
        </BootstrapTooltip>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", columnGap: "10px" }}>
        <BootstrapTooltip
          title={
            nextAttachment?.name.en &&
            nextAttachment?.name.en?.length > 14 &&
            nextAttachment?.name.en
          }
        >
          <Typography
            sx={{
              fontSize: "13px",
              color: "primary.main",
              fontWeight: "700",
            }}
          >
            {nextAttachment?.name.en && nextAttachment?.name.en?.length > 14
              ? nextAttachment?.name.en?.substring(0, 20) + "..."
              : nextAttachment?.name.en}
          </Typography>
        </BootstrapTooltip>
        <Button
          onClick={() => changeAttachment(nextAttachment)}
          disabled={!Boolean(nextAttachment)}
          endIcon={router.locale === "en" ? arrowRight : arrowLeft}
          sx={{ fontSze: "18px", fontWeight: "700", color: "gray.50" }}
        >
          Next
        </Button>
      </Box>
      {showRatingCard && (
        <Box
          sx={{
            position: "absolute",
            right: { xs: 0, sm: "50px" },
            top: "20vh",
            display: "flex",
            width: "100%",
            justifyContent: "flex-end",
            mt: "20px",
          }}
        >
          <RatingCard />
        </Box>
      )}
    </Box>
  );
};
