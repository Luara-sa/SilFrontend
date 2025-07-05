import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import axios from "axios";
import shallow from "zustand/shallow";

import { Box, Button, Dialog, Typography } from "@mui/material";

import { eventEmitter } from "services/eventEmitter";
import { _WithAuthService } from "services/withAuth.service";
import { checkoutStore } from "store/checkoutStore";
import { StringDouble } from "interface/common";

import ButtonLoader from "components/custom/ButtonLoader";
import { CheckoutCourse } from "../Checkout-course-card/CheckoutCourse";
import { PaymentCompleted } from "./PaymentCompleted";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import useTranslation from "next-translate/useTranslation";

interface Props {
  name: StringDouble;
  rate: number;
  // handleConfirm: () => void;
  totalPrice: number;
}

export const ConfirmCheckout = (props: Props) => {
  const { query } = useRouter();

  const [dataForApi, clearDataForApi, dialogOpen, setDialog, selectedMethod] =
    checkoutStore(
      (state) => [
        state.dataForApi,
        state.clearDataForApi,
        state.dialogOpen,
        state.setDialog,
        state.selectedMethod,
      ],
      shallow
    );

  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);

  const handleClose = () => setDialog(false);
  const { t } = useTranslation("checkout");
  const handleOpen = () => {
    eventEmitter.emit("checkout", {});
  };

  function onSubmit() {
    setLoading(true);

    axios
      .post("https://api.moyasar.com/v1/payments", {
        ...dataForApi.dataForMoyasar,
        source: {
          name: "ouis nasli",
          first_name: "ouis",
          ...dataForApi.dataForMoyasar.source,
        },
      })
      .then((res) => {
        console.log(res);
        window.location.href = res.data.source.transaction_url;
      })
      .catch((err) => {
        const errors = err.response.data.errors;
        const firstObjElment: keyof Error = Object.keys(
          errors
        )[0] as unknown as keyof Error;
        eventEmitter.emit("enqueueSnackbar", {
          message: `${firstObjElment} ${errors[firstObjElment]}`,
          variant: "error",
          snack: {
            autoHideDuration: 3000,
            preventDuplicate: true,
          },
        });
      })
      .finally(() => setLoading(false));
  }

  return (
    <Box>
      <ButtonLoader
        onClick={handleOpen}
        loading={false}
        type="submit"
        variant="contained"
        textstyle={{ fontSize: "19px", fontWeight: "600" }}
      >
        {t("checkout")}
      </ButtonLoader>
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box sx={{ width: "470px", display: "flex", justifyContent: "center" }}>
          <Box
            sx={{
              width: "85%",
              py: "40px",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {!isSuccess ? (
              <>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <img src="/assets/icons/question.svg" />
                </Box>
                <Typography
                  sx={{
                    mt: "15px",
                    fontSize: "30px",
                    fontWeight: 700,
                    color: "warning.main",
                    textAlign: "center",
                  }}
                >
                  {t("are you sure")}
                </Typography>
                <Box sx={{ mt: "25px" }}>
                  <CheckoutCourse name={props.name} rate={props.rate} />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    columnGap: "5px",
                    alignItems: "end",
                    justifyContent: "center",
                    mt: "10px",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "30px",
                      fontWeight: "700",
                      color: "primary.main",
                      textAlign: "center",
                    }}
                  >
                    {props.totalPrice}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "20px",
                      fontWeight: "700",
                      color: "primary.main",
                    }}
                  >
                    {t("sar")}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    columnGap: "15px",
                    mt: "25px",
                  }}
                >
                  <ButtonLoader
                    loading={loading}
                    disableOnLoading
                    onClick={onSubmit}
                    startIcon={!loading && <CheckCircleOutlineIcon />}
                    variant="contained"
                    textstyle={{ fontSize: "16px" }}
                    sx={{
                      color: "primary.main",
                      px: "30px",
                      borderRadius: "10px",
                      backgroundColor: "rgba(30, 91, 99, 0.2)",
                      "&:hover": {
                        color: "gray.active",
                      },
                    }}
                  >
                    {t("sure")}
                  </ButtonLoader>
                  <Button
                    onClick={handleClose}
                    startIcon={<CancelOutlinedIcon />}
                    variant="contained"
                    sx={{
                      color: "#FF5252",
                      fontSize: "16px",
                      px: "30px",
                      borderRadius: "10px",
                      backgroundColor: "rgba(255, 82, 82, 0.2)",
                      "&:hover": {
                        backgroundColor: "#FF5252",
                        color: "gray.active",
                      },
                    }}
                  >
                    {t("cancel")}
                  </Button>
                </Box>
              </>
            ) : (
              <PaymentCompleted />
            )}
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};
