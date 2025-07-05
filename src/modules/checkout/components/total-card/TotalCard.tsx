import React, { useMemo } from "react";
import { useRouter } from "next/router";

import useTranslation from "next-translate/useTranslation";

import { Typography, Box, Rating, Button, Divider } from "@mui/material";

import { meStore } from "store/meStore";
import { StringDouble } from "interface/common";

import { ConfirmCheckout } from "../confirm-checkout-action/ConfirmCheckout";
import { CheckoutCourse } from "../Checkout-course-card/CheckoutCourse";
import { CheckoutInstallments } from "../installments/CheckoutInstallments";
import { checkoutStore } from "store/checkoutStore";

interface Props {
  price?: number;
  discount?: number;
  courseName: StringDouble;
  courseRating: number;
}

export const TotalCard = (props: Props) => {
  const me = meStore((state) => state.me);

  const [course, isInstallment] = checkoutStore((state) => [
    state.course,
    state.isInstallment,
  ]);

  const router = useRouter();
  const { t } = useTranslation("checkout");

  const vat = me?.info_system.vat_value.vat;
  const coursePrice = isInstallment
    ? course?.price_without_inst
    : course?.price;
  const priceWithVat = isInstallment
    ? course?.total_with_vat_with_inst
    : course?.total_with_vat_without_inst;
  const installmentPrice = course?.installments[0]?.amount;

  const installmentPriceWithVat = useMemo(
    () =>
      !!installmentPrice && !!vat && !!installmentPrice
        ? (installmentPrice * vat) / 100 + installmentPrice
        : 0,
    [installmentPrice, vat]
  );

  const finalPriceForPopup = useMemo(
    () => (isInstallment ? installmentPriceWithVat : priceWithVat),
    [isInstallment]
  );

  return (
    <Box
      sx={{
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
        borderRadius: "10px",
        border: "2px solid #EEEEEE",
        backgroundColor: "#FFFEFA",
        p: "18px",
        height: "100%",
        minWidth: "350px",
        // width: "320px",
        width: "100%",
      }}
    >
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <CheckoutCourse
          name={(course?.name as StringDouble) ?? " "}
          rate={course?.rate}
        />
        <CheckoutInstallments />
        <Box>
          <TotalCardLine
            number={coursePrice}
            title={"course price"}
            numberFollow="SAR"
          />
          <Divider />
          <TotalCardLine number={vat} title={t("vat")} numberFollow="%" />
          <Divider />
          {!!course?.discount && (
            <>
              <TotalCardLine
                number={course?.discount}
                title={"disvount"}
                numberFollow="%"
              />
              <Divider />
            </>
          )}

          <TotalCardLine
            number={priceWithVat}
            title={"course price with vat"}
            numberFollow="SAR"
          />
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Divider sx={{ width: "70%" }} />
          </Box>

          {isInstallment && (
            <Box sx={{ mt: "15px" }}>
              <TotalCardLine
                number={installmentPrice}
                title={"installment price"}
                numberFollow="SAR"
                paddingY="5px"
              />
              <Divider />
              <TotalCardLine
                number={installmentPriceWithVat}
                title={"installment price with vat"}
                numberFollow="SAR"
                paddingY="5px"
              />
            </Box>
          )}
        </Box>

        <Box>
          {props?.discount && props?.discount > 0 ? (
            <TotalCardLine number="15" title={t("discount")} numberFollow="%" />
          ) : (
            ""
          )}
          {/* {props?.price && props.totalPrice ? (
            <TotalCardLine
              number={props.totalPrice}
              title={t("total")}
              numberFollow="SAR"
              isTotal
            />
          ) : (
            ""
          )} */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              columnGap: "15px",
              mt: "20px",
            }}
          >
            <ConfirmCheckout
              name={props.courseName}
              rate={props.courseRating}
              totalPrice={finalPriceForPopup ?? 0}
              // handleConfirm={()=>}
            />
            <Button
              onClick={() => router.push("/courses")}
              sx={{ fontSize: "19px", fontWeight: 700, color: "#FF5252" }}
            >
              {t("cancel")}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const TotalCardLine = ({
  title,
  number,
  numberFollow,
  isTotal,
  paddingY,
}: {
  title: string;
  number?: string | number;
  numberFollow: string;
  isTotal?: boolean;
  paddingY?: string;
}) => {
  return (
    <Box
      sx={{
        py: paddingY ? paddingY : "15px",
        // borderBottom: "1px solid rgba(136, 136, 136, 0.5)"
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          sx={{ fontSize: "19px", color: "primary.main", fontWeight: "600" }}
        >
          {title}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "end",
            color: "primary.main",
          }}
        >
          <Typography
            sx={{ fontSize: isTotal ? "20px" : "19px", fontWeight: "700" }}
          >
            {number}
          </Typography>
          <Typography sx={{ fontSize: "14px", fontWeight: "700", ml: "5px" }}>
            {numberFollow}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
