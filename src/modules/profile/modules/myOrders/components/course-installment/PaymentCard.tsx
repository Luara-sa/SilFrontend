import React from "react";
import { Card, Typography, Box, Divider } from "@mui/material";
import AccessAlarmsIcon from "@mui/icons-material/AccessAlarms";
import { dateToString } from "helper/dateToString";

interface Props {
  created_at: string;
  amount: number;
  date: string;
}

export const PaymentCard = (props: Props) => {
  console.log("payment", props?.date);
  return (
    <Card
      sx={{
        display: "flex",
        justifyContent: "space-between",
        padding: "15px 20px",
        width: "100%",
        height: "61px",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        borderRadius: "15px",
        marginBottom: "5px",
        position: "relative",
        overflow: "none",
      }}
    >
      {props?.date === null ? (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{ fontSize: "12px", color: "#555555", fontWeight: "400" }}
            >
              Down Payment
            </Typography>
            <Typography
              sx={{
                fontSize: "12px",
                color: "primary.main",
                fontWeight: "500",
              }}
            >
              {dateToString(props.created_at)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: "5px" }}>
            <Divider sx={{ marginTop: "0", border: "1px solid #D9D9D9" }} />
            <Box sx={{ display: "flex", gap: "3px", alignItems: "baseline" }}>
              <Typography
                sx={{
                  fontSize: "18px",
                  color: "primary.main",
                  fontWeight: "700",
                }}
              >
                {props.amount}
              </Typography>
              <Typography
                sx={{
                  fontSize: "13px",
                  color: "primary.main",
                  fontWeight: "700",
                }}
              >
                SAR
              </Typography>
            </Box>
          </Box>
        </>
      ) : (
        <>
          <Box
            sx={{
              position: "absolute",
              width: "100%",
              height: "100%",
              borderRadius: "15px",
              backgroundColor: "rgba(12, 128, 144, 0.5)",
              backdropFilter: "blur(3.5px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              top: "0px",
              left: "0px",
              bottom: "0px",
            }}
          >
            <Card
              sx={{
                width: "154px",
                height: "38px",
                backgroundColor: "#FFE9A8",
                borderRadius: "10px",
                padding: "10px 20px",
                display: "flex",
                gap: "5px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AccessAlarmsIcon
                sx={{ color: "#188389", width: "18px", height: "18px" }}
              />
              <Typography
                sx={{
                  color: " rgba(12, 128, 144, 0.95)",
                  fontSize: "10px",
                  fontWeight: "700",
                }}
              >
                {dateToString(props?.date)}
              </Typography>
            </Card>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{ fontSize: "12px", color: "#555555", fontWeight: "400" }}
            >
              Down Payment
            </Typography>
            <Typography
              sx={{
                fontSize: "12px",
                color: "primary.main",
                fontWeight: "500",
              }}
            >
              {dateToString(props.created_at)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: "5px" }}>
            <Divider sx={{ marginTop: "0", border: "1px solid #D9D9D9" }} />
            <Box sx={{ display: "flex", gap: "3px", alignItems: "baseline" }}>
              <Typography
                sx={{
                  fontSize: "18px",
                  color: "primary.main",
                  fontWeight: "700",
                }}
              >
                {props.amount}
              </Typography>
              <Typography
                sx={{
                  fontSize: "13px",
                  color: "primary.main",
                  fontWeight: "700",
                }}
              >
                SAR
              </Typography>
            </Box>
          </Box>
        </>
      )}
    </Card>
  );
};
