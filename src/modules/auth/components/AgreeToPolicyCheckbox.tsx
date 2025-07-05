import React, { useEffect, useState } from "react";
import { Box, Checkbox, Typography } from "@mui/material";

import { FieldValues, UseFormSetValue } from "react-hook-form";

import { InputHelperText } from "components/shared";
import { CheckBoxStyled } from "modules/courses";
import { PrivacyPolicy } from "modules/privacy-policy";

interface Props {
  error?: string;
  setValue: UseFormSetValue<FieldValues>;
}

export const AgreeToPolicyCheckbox = (props: Props) => {
  const [open, setOpen] = useState(false);

  const [isTermAgreed, setIsTermAgreed] = useState(false);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const handleTermAgree = (
    event: React.SyntheticEvent<Element, Event>,
    checked: boolean
  ) => {
    setIsTermAgreed(checked);
    props.setValue("isTermAgreed", checked, { shouldValidate: true });
  };

  const handleAgree = () => {
    setIsTermAgreed(true);
    props.setValue("isTermAgreed", true, { shouldValidate: true });
    handleClose();
  };

  const handleCancel = () => {
    setIsTermAgreed(false);
    props.setValue("isTermAgreed", false, { shouldValidate: true });
    handleClose();
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <CheckBoxStyled
          sx={{
            "& .MuiFormControlLabel-label ": {
              color: "wood.main",
              fontWeight: "500",
              fontSize: "14px",
            },
            marginRight: "5px",
          }}
          label="I agree to the"
          name="cat_ids"
          onChange={handleTermAgree}
          checked={isTermAgreed}
          control={<Checkbox size="small" />}
        />
        <Box onClick={handleOpen}>
          <Typography
            sx={{
              color: "primary.main",
              fontWeight: "500",
              fontSize: "14px",
              borderBottom: "1px solid #1E5B63",
              cursor: "pointer",
            }}
          >
            Terms Privacy Policy
          </Typography>
        </Box>
      </Box>
      <InputHelperText helpertext={(props.error as any) || ""} />
      <PrivacyPolicy
        handleClose={handleClose}
        open={open}
        onSubmit={handleAgree}
        handleCancel={handleCancel}
      />
    </>
  );
};
