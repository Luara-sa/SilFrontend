import { Box, Typography } from "@mui/material";

import React from "react";
import TimePending from "../../../../../../../public/assets/icons/shared/time-pending";

interface Props {
  status: string | undefined;
}

export const OrderStatus = (props: Props) => {
  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "40px",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          alignItems: "center",
          py: "8px",
          backgroundColor:
            props?.status === "pending"
              ? "rgba(255, 245, 215, 0.4);"
              : "#FFB8B8",
          borderRadius: "10px",
          padding: "8px, 55px, 8px, 55px",
          cursor: "default",
          ":hover": {
            backgroundColor:
              props?.status === "pending"
                ? "rgba(255, 245, 215, 0.4);"
                : "#FFB8B8",
          },
        }}
      >
        {props?.status === "pending" ? (
          <TimePending
            customWidth={"16px"}
            customHeight={"20px"}
            customcolor={"#FFC107"}
          />
        ) : (
          <img
            src="/assets/icons/shared/rejected.svg"
            style={{ width: "16px", height: "16px" }}
          />
        )}
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: "600",
            color: props?.status === "pending" ? "#FFC107" : "#1E5B63",
          }}
        >
          Course Order is {props?.status}...
        </Typography>
      </Box>
    </>
  );
};
