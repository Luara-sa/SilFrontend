import React, { useEffect, useState } from "react";
import {
  Card,
  Grid,
  Dialog,
  Typography,
  Button,
  Divider,
  Box,
} from "@mui/material";
import { PaymentCard } from "./PaymentCard";
import { ReminingCard } from "./ReminingCard";
import useTranslation from "next-translate/useTranslation";

interface Props {
  open: boolean;
  handleClose: () => void;
  courseName: string;
  total: number;
  installments: any[];
}

export const CourseInstallmentCard = (props: Props) => {
  let amounts: number[] = [];
  const [sum, setSum] = useState<number>(0);
  useEffect(() => {
    props?.installments?.map((installment) => {
      amounts.push(installment?.amount);
    });
    setSum(amounts.reduce((a, b) => a + b, 0));
  }, [props?.open === true]);

  const { t } = useTranslation("course");

  return (
    <>
      <Dialog open={props?.open} onClose={() => props.handleClose()}>
        <Card
          sx={{
            width: { xs: "330px", md: "530px" },
            height: { xs: "528px", md: "396px" },
            padding: "1rem",
            overflowY: "scroll",
          }}
        >
          <Grid container xs={12} justifyContent={`space-between`}>
            <Grid
              xs={12}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <Typography
                sx={{ fontSize: "18px", color: "#888888", fontWeight: "500" }}
              >
                {t("course installmet")}
              </Typography>
              <Button onClick={() => props.handleClose()}>X</Button>
            </Grid>
            <Grid xs={12} sx={{ paddingBottom: "0.5rem" }}>
              <Typography
                sx={{ fontSize: "22px", color: "gray.50", fontWeight: "700" }}
              >
                {props?.courseName}
              </Typography>
            </Grid>
          </Grid>
          <Grid
            xs={12}
            sx={{
              display: "flex",
              height: "100%",
              justifyContent: "space-between",
              maxHeight: "280px",
              overflow: "hidden",
            }}
            container
          >
            <Grid
              xs={12}
              md={7}
              sx={{
                maxHeight: "100%",
                overflowY: { xs: "scroll", lg: "scroll" },
                overflowX: "hidden",
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
              }}
              className="scrollbar-mobile"
            >
              {props?.installments &&
                props?.installments.length > 0 &&
                props?.installments.map((installment, i) => (
                  <PaymentCard
                    key={i}
                    created_at={installment?.created_at}
                    amount={installment?.amount}
                    date={installment?.Date_of_paid}
                  />
                ))}
            </Grid>

            <Grid
              xs={12}
              md={5}
              container
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                gap: "10px",
              }}
            >
              <Divider
                sx={{
                  height: { xs: "1px", md: "265px" },
                  width: { xs: "100%", md: "1px" },
                  border: "1px solid rgba(170, 170, 170, 0.2)",
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "row", md: "column" },
                  width: { xs: "95%", md: "auto" },
                  height: "100%",
                  justifyContent: "space-between",
                  maxHeight: "265px",
                }}
              >
                <ReminingCard sum={sum} />
                <Box>
                  <Divider
                    sx={{
                      border: {
                        xs: "0px",
                        md: "1px solid rgba(170, 170, 170, 0.2)",
                      },
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: "18px",
                      color: "primary.main",
                      fontWeight: "700",
                      textTransform: "uppercase",
                    }}
                  >
                    {t("total")}
                  </Typography>
                  <Box
                    sx={{ display: "flex", gap: "4px", alignItems: "baseline" }}
                  >
                    <Typography
                      sx={{
                        fontSize: "18px",
                        color: "primary.main",
                        fontWeight: "700",
                      }}
                    >
                      {props?.total}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        color: "primary.main",
                        fontWeight: "700",
                      }}
                    >
                      {t("sar")}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Dialog>
    </>
  );
};
