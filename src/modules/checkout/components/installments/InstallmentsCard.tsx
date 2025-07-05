import React from "react";

import { Box, Typography } from "@mui/material";

type InstallmentsStatus = "selected" | "disabled";

interface Props {
  percent: number;
  price: number;
  isInstallment: boolean;
  index: number;
}

export const InstallmentsCard = ({
  percent,
  price,
  index,
  isInstallment,
}: Props) => {
  const isInstallmentSelectd = isInstallment && index === 0;
  const InstallmentsStatus = isInstallmentSelectd ? "selected" : "disabled";

  const installmentCountString =
    index <= 3 ? InstallmentCount[index] : `${index} ${InstallmentCount[4]}`;

  return (
    <Box>
      <Box
        sx={{
          border: "2px solid",
          borderColor: InstallmentsCardVariants[InstallmentsStatus].color,
          borderRadius: "10px",
          width: "80px",
          height: "80px",
          backgroundColor:
            InstallmentsCardVariants[InstallmentsStatus].backgroundColor,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-evenly",
          color: InstallmentsCardVariants[InstallmentsStatus].color,
          userSelect: "none",
        }}
      >
        <Typography sx={{ fontWeight: "700", fontSize: "14px" }}>
          {price}{" "}
          <Typography
            component="span"
            sx={{ fontSize: "10px", fontWeight: "700" }}
          >
            SAR
          </Typography>
        </Typography>
      </Box>
      <Typography
        sx={{
          mt: "10px",
          fontSize: "9px",
          color: InstallmentsCardVariants[InstallmentsStatus].color,
          fontWeight: "700",
          textAlign: "center",
        }}
      >
        {installmentCountString}
      </Typography>
    </Box>
  );
};

interface IInstallmentsCardVariantsOptions {
  color: string;
  cursor: string;
  backgroundColor: string;
}

const InstallmentsCardVariants: {
  [key in InstallmentsStatus]: IInstallmentsCardVariantsOptions;
} = {
  disabled: {
    color: "#E1E1E1",
    cursor: "not-allowed",
    backgroundColor: "inherit",
  },

  selected: {
    color: "#1E5B63",
    cursor: "pointer",
    backgroundColor: "#D4FFED",
  },
};

const InstallmentCount = [
  "1st Installment",
  "2nd Installment",
  "3rd Installment",
  "th Installment",
];
