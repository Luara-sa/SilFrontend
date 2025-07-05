import { Box, Button, Typography } from "@mui/material";
import React from "react";

import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import { checkoutStore } from "store/checkoutStore";

export const PaymentCompleted = () => {
  const [clearDataForApi, setDialog] = checkoutStore((state) => [
    state.clearDataForApi,
    state.setDialog,
  ]);

  const handleDone = () => {
    clearDataForApi();
    setDialog(false);
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <img src="/assets/icons/payment-completed.svg" />
      </Box>
      <Typography
        sx={{
          mt: "40px",
          fontSize: "30px",
          fontWeight: 700,
          color: "#4CAF50",
          textAlign: "center",
        }}
      >
        Payment Completed
      </Typography>
      <Box
        sx={{
          mt: "30px",
          display: "flex",
          justifyContent: "center",
          fontSize: "20px",
          color: "#1E5B6380",
          fontWeight: "500",
        }}
      >
        <Typography>Order number: </Typography>
        <Typography>#963852741</Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", mt: "40px" }}>
        <Button
          onClick={handleDone}
          startIcon={<CheckOutlinedIcon />}
          variant="contained"
          sx={{
            color: "primary.main",
            fontSize: "16px",
            px: "30px",
            borderRadius: "10px",
            backgroundColor: "rgba(30, 91, 99, 0.2)",
            "&:hover": {
              color: "gray.active",
            },
          }}
        >
          Done
        </Button>
      </Box>
    </>
  );
};
