import { Box, Typography } from "@mui/material";
import { PaymentStatus } from "interface/common";
import {
  renderColorPayment,
  renderStatusPayment,
} from "modules/profile/helper/renderSwitch";
import React from "react";

interface Props {
  paymentStatus: PaymentStatus;
}

export const PaymentStatusShip = (props: Props) => {
  return (
    <Box
      sx={{
        backgroundColor: renderColorPayment(props.paymentStatus),
        borderRadius: "5px",
        padding: "2px 4px",
      }}
    >
      <Typography
        sx={{
          color: props.paymentStatus === "pending" ? "#000" : "gray.active",
          fontSize: "10px",
        }}
      >
        {renderStatusPayment(props.paymentStatus)}
      </Typography>
    </Box>
  );
};
