import React from "react";

import { BASE_URL } from "env";

import { Box } from "@mui/material";

import { checkoutStore } from "store/checkoutStore";

export const PaymentMethods = () => {
  const [paymentMethods, selectedMethod, setSelectedMethod] = checkoutStore(
    (state) => [
      state.paymentMethods,
      state.selectedMethod,
      state.setSelectedMethod,
    ]
  );

  const handleSelectPaymentMethod = (e: any) => {
    setSelectedMethod(e.target.id);
  };

  return (
    <Box
      className="scrollbar-mobile"
      sx={{
        display: "flex",
        columnGap: "10px",
        mt: "20px",
        pt: "20px",
        overflowX: { xs: "scroll", lg: "scroll" },
      }}
    >
      {paymentMethods?.map((method, index) => (
        <Box
          key={index}
          onClick={handleSelectPaymentMethod}
          sx={{
            position: "relative",
            height: "160px",
            width: { xs: "200px", lg: "190px", xl: "230px" },
            minWidth: { xs: "200px", lg: "190px", xl: "230px" },
            "& img.credit-1": {
              border:
                selectedMethod === method.name ? "3.5px solid #4CAF50" : "none",
              borderRadius: "15px",
              width: "100%",
            },
          }}
          id={method.name}
        >
          <img
            className="credit-1"
            src={`${BASE_URL}/${method.image}`}
            alt="credit-1"
            id={method.name}
          />
        </Box>
      ))}
      {/* <Box
        onClick={handleCheckPayment}
        sx={{
          position: "relative",
          height: "120px",
          width: { xs: "200px", lg: "190px", xl: "200px" },
          minWidth: { xs: "200px", lg: "190px", xl: "200px" },
          "& img.credit-2": {
            width: "100%",
            border: checked === "2" ? "3px solid #4CAF50" : "none",
            borderRadius: "10px",
          },
        }}
        id="2"
      >
        <img
          className="credit-2"
          src={`/assets/images/checkout/credit-2.svg`}
          alt="credit-2"
          id="2"
        />
        <Box
          sx={{
            display: checked === "2" ? "flex" : "none",
            position: "absolute",
            top: "-10px",
            right: "-10px",
          }}
        >
          <img src="/assets/icons/checked.svg" />
        </Box>
      </Box>
      <Box
        onClick={handleCheckPayment}
        sx={{
          position: "relative",
          height: "120px",
          width: { xs: "200px", lg: "190px", xl: "200px" },
          minWidth: { xs: "200px", lg: "190px", xl: "200px" },
          transition: "0.1s",
          "& img.credit-3": {
            border: checked === "3" ? "3px solid #4CAF50" : "none",
            borderRadius: "10px",
            width: "100%",
          },
        }}
        id="3"
      >
        <img
          className="credit-3"
          src="/assets/images/checkout/credit-1.svg"
          alt="credit-3"
          id="3"
        />
        <Box
          sx={{
            display: checked === "3" ? "flex" : "none",
            position: "absolute",
            top: "-10px",
            right: "-10px",
          }}
        >
          <img src="/assets/icons/checked.svg" />
        </Box>
      </Box> */}
      {/* Form section */}
    </Box>
  );
};
