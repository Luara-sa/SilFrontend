import React, { useEffect, useState } from "react";

import { Box, Button, Typography } from "@mui/material";

import { BootstrapTooltip } from "components/styled";
import { _StudentRoleService } from "services/studentRole.service";
import { profileStore } from "store/profileStore";
import { CourseInstallmentCard } from "../course-installment/CourseInstallment";

interface Props {
  courseName: string;
  date: string;
  price?: number;
  total: number;
  installments: any;
}

export const MyOrdersCourseCard = (props: Props) => {
  console.log("installment", props?.installments);
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Box
        sx={{
          backgroundColor: "#FFFEFA",
          boxShadow: " 1px 2px 5px rgba(0, 0, 0, 0.25)",
          borderRadius: "5px",
          display: "flex",
          alignItems: "center",
          py: "20px",
          px: "13px",
          minWidth: { xs: "320px", lg: "400px" },
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            rowGap: "7px",
            flex: "0.75",
          }}
        >
          <BootstrapTooltip
            title={
              props.courseName &&
              props.courseName?.length > 18 &&
              props.courseName
            }
          >
            <Typography
              sx={{ fontSize: "22px", color: "gray.50", fontWeight: "700" }}
            >
              {props.courseName && props.courseName?.length > 18
                ? props.courseName?.substring(0, 18) + "..."
                : props.courseName}
            </Typography>
          </BootstrapTooltip>
          <Button
            onClick={handleOpen}
            sx={{
              background: "#FFF0C4",
              height: "31px",
              width: "103px",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            Click Me
          </Button>
        </Box>
        <Box
          sx={{
            flex: "0.25",
            display: "flex",
            flexDirection: "column",
            rowGap: "7px",
            borderLeft: "0.5px solid #EEEEEE",
            pl: "15px",
          }}
        >
          <Typography
            sx={{ fontSize: "12px", color: "primary.main", fontWeight: "500" }}
          >
            {props.date}
          </Typography>
          <Box sx={{ display: "flex", columnGap: "5px", alignItems: "center" }}>
            <Typography
              sx={{
                fontSize: "18px",
                color: "primary.main",
                fontWeight: "700",
                textTransform: "capitalize",
              }}
            >
              {props.price}
            </Typography>
            <Typography
              sx={{
                fontSize: "18px",
                color: "primary.main",
                fontWeight: "700",
                textTransform: "capitalize",
              }}
            >
              SAR
            </Typography>
          </Box>
        </Box>
      </Box>
      <CourseInstallmentCard
        handleClose={handleClose}
        open={open}
        courseName={props.courseName}
        total={props?.total}
        installments={props?.installments}
      />
    </>
  );
};
