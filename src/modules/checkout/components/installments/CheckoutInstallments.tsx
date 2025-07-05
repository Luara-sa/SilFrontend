import React from "react";

import { Box, Switch, Typography } from "@mui/material";

import { InstallmentsCard } from "./InstallmentsCard";
import { InstallmentsCardsBox } from "./InstallmentsCardsBox";
import { checkoutStore } from "store/checkoutStore";
import useTranslation from "next-translate/useTranslation";

const label = { inputProps: { "aria-label": "installments" } };

interface Props {
  percent: number;
  price: number;
}

export const CheckoutInstallments = () => {
  const [course, isInstallment, setIsInstallment] = checkoutStore((state) => [
    state.course,
    state.isInstallment,
    state.setIsInstallment,
  ]);
  const installments = course?.installments;
  const { t } = useTranslation("checkout");

  const handleInstallmentsChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setIsInstallment(checked);
  };

  if (!!installments && !!installments[0])
    return (
      <div>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Switch
            {...label}
            value={isInstallment}
            color="success"
            onChange={handleInstallmentsChange}
          />
          <Typography sx={{ fontSize: "16px", color: "primary.main" }}>
            {t("installments")}
          </Typography>
        </Box>

        <InstallmentsCardsBox>
          {installments?.map((installment, index) => (
            <InstallmentsCard
              key={index}
              index={index}
              percent={25}
              price={installment?.amount}
              isInstallment={!!isInstallment}
              // InstallmentsStatus="selected"
            />
          ))}
        </InstallmentsCardsBox>
      </div>
    );
  return <></>;
};
