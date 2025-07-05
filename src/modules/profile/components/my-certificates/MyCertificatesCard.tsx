import React from "react";

import { Box, Typography } from "@mui/material";

import { BootstrapTooltip } from "components/styled";

import TimePending from "../../../../../public/assets/icons/shared/time-pending";

interface Props {
  courseName: string;
  certifcateName: string;
  isPending?: boolean;
  date: string;
  evaluation?: string;
}

export const MyCertificatesCard = (props: Props) => {
  return (
    <Box
      sx={{
        backgroundColor: props.isPending ? "#FFF7E0" : "#FFFEFA",
        boxShadow: " 1px 2px 5px rgba(0, 0, 0, 0.25)",
        borderRadius: "5px",
        display: "flex",
        alignItems: "center",
        py: "20px",
        px: "13px",
        minWidth: { xs: "320px", lg: "400px" },
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          rowGap: "7px",
          flex: "0.65",
        }}
      >
        <BootstrapTooltip
          title={
            props.certifcateName &&
            props.certifcateName?.length > 20 &&
            props.certifcateName
          }
        >
          <Typography
            sx={{ fontSize: "22px", color: "gray.50", fontWeight: "700" }}
          >
            {props.certifcateName && props.certifcateName?.length > 20
              ? props.certifcateName?.substring(0, 20) + "..."
              : props.certifcateName}
          </Typography>
        </BootstrapTooltip>
        <Box sx={{ display: "flex", alignItems: "center", columnGap: "10px" }}>
          <BootstrapTooltip
            title={
              props.courseName &&
              props.courseName?.length > 11 &&
              props.courseName
            }
          >
            <Box
              sx={{
                backgroundColor: "#FFF0C4",
                maxWidth: "103px",
                minWidth: "103px",
                borderRadius: "8px",
                py: "5px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{
                  color: "#000000",
                  fontSize: "12px",
                  fontWeight: 400,
                  textTransform: "capitalize",
                }}
              >
                {props.courseName && props.courseName?.length > 11
                  ? props.courseName?.substring(0, 11) + "..."
                  : props.courseName}
              </Typography>
            </Box>
          </BootstrapTooltip>

          {props.isPending && (
            <Box
              sx={{ display: "flex", alignItems: "center", columnGap: "5px" }}
            >
              <TimePending
                customcolor="#FFC107"
                customWidth={9.5}
                customHeight={11.5}
              />
              <Typography sx={{ color: "#FFC107", fontSize: "12px" }}>
                Pending...
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
      <Box
        sx={{
          flex: "0.35",
          display: "flex",
          flexDirection: "column",
          rowGap: "7px",
          borderLeft: "0.5px solid #EEEEEE",
          pl: "15px",
        }}
      >
        <Typography
          sx={{ fontSize: "12px", color: "primary.main", fontWeight: "500" }}
        >
          {props.date}
        </Typography>
        {props.evaluation && (
          <Box sx={{ display: "flex", columnGap: "5px", alignItems: "center" }}>
            <Typography sx={{ fontSize: "18px", color: "primary.main" }}>
              Evaluation:
            </Typography>
            <Typography
              sx={{
                fontSize: "18px",
                color: "primary.main",
                fontWeight: "700",
                textTransform: "capitalize",
              }}
            >
              {props.evaluation}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};
