import { Box, Button, Typography } from "@mui/material";
import { BootstrapTooltip } from "components/styled";
import React from "react";
import TimePending from "../../../../../../../public/assets/icons/shared/time-pending";

interface Props {
  courseName: string;
  orderType: string;
  date: string;
}

export const MyOrdersCard = (props: Props) => {
  return (
    <Box
      sx={{
        backgroundColor: "#FFFEFA",
        boxShadow: " 1px 2px 5px rgba(0, 0, 0, 0.25)",
        borderRadius: "5px",
        minWidth: { xs: "320px", lg: "400px" },
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pt: "10px",
          px: "13px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <BootstrapTooltip
            title={
              props.orderType && props.orderType?.length > 40 && props.orderType
            }
          >
            <Typography
              sx={{ fontSize: "14px", color: "gray.50", fontWeight: "700" }}
            >
              {props.orderType && props.orderType?.length > 40
                ? props.orderType?.substring(0, 40) + "..."
                : props.orderType}
            </Typography>
          </BootstrapTooltip>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            rowGap: "7px",
            pl: "15px",
            mt: "11px",
          }}
        >
          <Typography
            sx={{ fontSize: "12px", color: "gray.50", fontWeight: "500" }}
          >
            {props.date}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ pt: "6px", pb: "8px", px: "13px", display: "flex" }}>
        <BootstrapTooltip
          title={
            props.courseName &&
            props.courseName?.length > 25 &&
            props.courseName
          }
        >
          <Box
            sx={{
              backgroundColor: "#FFF0C4",
              maxWidth: "200px",
              minWidth: "103px",
              borderRadius: "8px",
              py: "5px",
              display: "flex",
              justifyContent: "center",
              px: "10px",
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
              {props.courseName && props.courseName?.length > 25
                ? props.courseName?.substring(0, 25) + "..."
                : props.courseName}
            </Typography>
          </Box>
        </BootstrapTooltip>
      </Box>
    </Box>
  );
};
