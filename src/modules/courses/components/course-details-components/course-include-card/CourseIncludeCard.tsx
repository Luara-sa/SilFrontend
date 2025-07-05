import { Box, Typography } from "@mui/material";
import { dateToString } from "helper/dateToString";
import useTranslation from "next-translate/useTranslation";
import React, { ReactElement } from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
interface Props {
  hours?: number;
  lessons?: number;
  isCertificate?: boolean;
  isOffline?: boolean;
  date?: Date;
  certificate?: string;
}

export const CourseIncludeCard = (props: Props) => {
  const { t } = useTranslation("course");
  return (
    <Box
      sx={{
        backgroundColor: "#FFFEFA",
        px: "10px",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.4)",
        borderRadius: "5px",
        width: { lg: "290px", xl: "350px" },
      }}
    >
      <Box
        sx={{
          py: "25px",
          px: "20px",
          borderBottom: "1px solid rgba(0, 0, 0, 0.25)",
        }}
      >
        <Typography
          sx={{
            color: "primary.main",
            fontWeight: "700",
            fontSize: "18px",
          }}
        >
          {t("whats include")}
        </Typography>
      </Box>
      <Box sx={{ px: "28px", py: "15px" }}>
        <IncludedRow
          isDisplayBorder
          icon={<AccessTimeIcon sx={{ color: "#1E5B63" }} />}
        >
          <Box sx={{ display: "flex", columnGap: "5px" }}>
            <Typography
              sx={{
                color: "wood.main",
                fontSize: "14px",
                fontWeight: "700",
              }}
            >
              {props.hours}
            </Typography>
            <Typography sx={{ color: "wood.main", fontSize: "14px" }}>
              {t("hours")}
            </Typography>
          </Box>
        </IncludedRow>
        {!!props.lessons && (
          <IncludedRow
            isDisplayBorder
            icon={<PlayCircleOutlineIcon sx={{ color: "#1E5B63" }} />}
          >
            <Box sx={{ display: "flex", columnGap: "5px" }}>
              <Typography
                sx={{
                  color: "wood.main",
                  fontSize: "14px",
                  fontWeight: "700",
                }}
              >
                {props.lessons}
              </Typography>
              <Typography sx={{ color: "wood.main", fontSize: "14px" }}>
                {t("lessons")}
              </Typography>
            </Box>
          </IncludedRow>
        )}
        {!!props.isCertificate && (
          <IncludedRow
            isDisplayBorder
            title={props.certificate}
            icon={<WorkspacePremiumIcon sx={{ color: "#1E5B63" }} />}
          />
        )}
        {props.isOffline && (
          <IncludedRow
            isDisplayBorder
            title="Watch Offline"
            icon={<VideocamOutlinedIcon sx={{ color: "#1E5B63" }} />}
          />
        )}
        {props.date && (
          <IncludedRow
            title={dateToString(props.date)}
            icon={<CalendarMonthIcon sx={{ color: "#1E5B63" }} />}
          />
        )}
      </Box>
    </Box>
  );
};

interface IncludedRowProps {
  icon: any;
  isDisplayBorder?: boolean;
  title?: string;
  children?: ReactElement;
}

const IncludedRow = (props: IncludedRowProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        columnGap: "17px",
        py: "12px",
        borderBottom: props.isDisplayBorder
          ? "0.5px solid rgba(0, 0, 0, 0.1)"
          : "none",
      }}
    >
      {props.icon}
      {props.title ? (
        <Typography sx={{ color: "wood.main", fontSize: "14px" }}>
          {props.title}
        </Typography>
      ) : (
        props.children
      )}
    </Box>
  );
};
