import React, { useState } from "react";
import { useRouter } from "next/router";

import {
  FieldErrorsImpl,
  FieldValues,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormTrigger,
} from "react-hook-form";
import useTranslation from "next-translate/useTranslation";

import {
  Typography,
  Box,
  InputAdornment,
  Autocomplete,
  TextField,
} from "@mui/material";

import { _WithAuthService } from "services/withAuth.service";
import { _CourseService } from "services/course.service";

import { TextFieldWithIconStyled } from "components/styled/TextFiledWithIcon";
import { TextFieldStyled } from "components/styled";
import BasicDatePicker from "components/shared/date-picker/BasicDatePicker";
import { PaymentMethods } from "./PaymentMethods";

import LockOpenIcon from "@mui/icons-material/LockOpen";

interface Props {
  register: UseFormRegister<FieldValues>;
  setForm: UseFormSetValue<FieldValues>;
  getFormValue: UseFormGetValues<FieldValues>;
  errors: Partial<
    FieldErrorsImpl<{
      [x: string]: any;
    }>
  >;
  triggerForm: UseFormTrigger<FieldValues>;
}

export const BillinDetails = (props: Props) => {
  const { register, errors, setForm, getFormValue, triggerForm } = props;

  const { t } = useTranslation("checkout");

  return (
    <Box
      sx={{
        p: "45px",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
        borderRadius: "10px",
        border: "2px solid #EEEEEE",
        backgroundColor: "#FFFEFA",
      }}
    >
      <Box>
        <Typography
          sx={{ fontSize: "30px", fontWeight: "700", color: "primary.main" }}
        >
          {t("billing details")}
        </Typography>
      </Box>
      {/* Select Credit section */}
      <PaymentMethods />
      <Box
        sx={{
          mt: "25px",
          display: "flex",
          flexDirection: "column",
          rowGap: "20px",
        }}
      >
        <Box sx={{ flex: "1" }}>
          <TextFieldWithIconStyled
            fullWidth
            id="input-with-icon-adornment"
            placeholder="Card Number"
            endAdornment={
              <InputAdornment position="end">
                <LockOpenIcon />
              </InputAdornment>
            }
            {...register("number")}
            error={Boolean(errors.number?.message)}
            // helperText={(errors.number?.message as any) || ""}
          />
          {(errors.number?.message as any) ? (
            <Typography sx={{ color: "#d32f2f", fontSize: "12px", ml: "15px" }}>
              {errors.number?.message as any}
            </Typography>
          ) : (
            <Typography sx={{ visibility: "hidden" }}></Typography>
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            columnGap: "15px",
            flexDirection: { xs: "column", lg: "row" },
            rowGap: { xs: "20px", lg: 0 },
            width: "100%",
          }}
        >
          <TextFieldStyled
            variant="outlined"
            fullWidth
            placeholder="CVC"
            {...register("cvc")}
            error={Boolean(errors.cvc?.message)}
            helperText={(errors.cvc?.message as any) || ""}
          />
          <BasicDatePicker
            views={["month", "year"]}
            placeholder="Expiry Date"
            // helperText={
            //   // errors.dateOfBirth?.message ?? "Enter Driver's Date Of Birth"
            // }
            error={
              Boolean(errors.year?.message) || Boolean(errors.month?.message)
            }
            value={null}
            onChange={(e) => {
              // trigger("dateOfBirth");
              setForm("year", e?.year);
              setForm("month", e?.month);
              triggerForm("year");
              triggerForm("month");
            }}
          ></BasicDatePicker>
        </Box>
        <Box
          sx={{
            display: "flex",
            columnGap: "15px",
            flexDirection: { xs: "column", lg: "row" },
            rowGap: { xs: "20px", lg: 0 },
          }}
        ></Box>
      </Box>
    </Box>
  );
};
