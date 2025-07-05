import React, { useEffect, useState } from "react";

import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { Box, Button, InputLabel, Typography } from "@mui/material";

import { _AuthService } from "services/auth.service";
import { profileSettingsStore } from "store/profileSettingsStore";

import { TextFieldStyled } from "components/styled";
import { DeleteAccount } from "../components/delete-account/DeleteAccount";
import useTranslation from "next-translate/useTranslation";
import PasswordInput from "components/custom/PasswordInput";
import { AccountPasswordInput } from "../components/input/AccountPasswordInput";

export const Account = () => {
  const { t } = useTranslation("profile");

  const [setProfileSettingForm, profileSettingForm] = profileSettingsStore(
    (state) => [state.setProfileSettingForm, state.profileSettingForm]
  );

  const validationSchema = Yup.object().shape(
    {
      old_password: Yup.string()
        .label("Old Password")
        .when(["new_password"], {
          is: (new_password: any) => (new_password ? true : false),
          then: Yup.string().required("Must enter the old password"),
        }),
      new_password: Yup.string()
        .nullable()
        .min(5, "The password should be at least 5 charcter")
        .transform((value) => (value === "" ? undefined : value))
        .when(["old_password"], {
          is: (old_password: any) => (old_password ? true : false),
          then: Yup.string()
            .required("Must enter a new password")
            .label("New Password"),
        }),
      confirm_password: Yup.string()
        .transform((value) => (value === "" ? undefined : value))
        .when(["new_password"], {
          is: (new_password: any) => (new_password ? true : false),
          then: Yup.string()
            .required("Must reinter the password")
            .oneOf([Yup.ref("new_password")], "The passwords are not a match")
            .label("Confirm Password"),
        }),
    },
    [["old_password", "new_password"]]
  );

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState, trigger, setValue, getValues } =
    useForm(formOptions);
  const { errors } = formState;

  const handleInputsChange = async (e: any) => {
    await trigger(["old_password", "new_password", "confirm_password"]);
    const { name, value } = e.target;

    setProfileSettingForm({
      ...profileSettingForm,
      accountChanged: true,
      [name]: value,
    });
  };

  // This useEffect to handle the senario of changing the tab and coming back
  useEffect(() => {
    if (profileSettingForm?.accountChanged) {
      setValue("old_password", profileSettingForm?.old_password);
      setValue("new_password", profileSettingForm?.new_password);
      setValue("confirm_password", profileSettingForm?.confirm_password);
    }
    return () => {};
  }, []);

  // Update ProfileSettingsForm state for any changes on the errors
  useEffect(() => {
    if (Object.keys(errors).length !== 0) {
      if (profileSettingForm?.error) {
        const error = profileSettingForm.error;
        const errorSet = new Set(error);
        errorSet.add("account");
        profileSettingForm.error = [...errorSet];
      } else {
        setProfileSettingForm({
          ...profileSettingForm,
          error: ["account"],
        });
      }
    } else {
      if (profileSettingForm?.error) {
        const error = profileSettingForm.error;
        const errorSet = new Set(error);
        errorSet.delete("account");
        profileSettingForm.error = [...errorSet];
      }
    }
    return () => {};
  }, [errors, profileSettingForm]);

  useEffect(() => {
    if (
      getValues("old_password") ||
      getValues("new_password") ||
      getValues("confirm_password")
    ) {
      trigger(["old_password", "new_password", "confirm_password"]);
    }
    return () => {};
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <Typography sx={{ color: "primary.main", fontSize: "18px" }}>
        {t("change password")}
      </Typography>
      <Box
        sx={{
          mt: "20px",
          width: { xs: "100%", lg: "70%" },
          display: "flex",
          flexDirection: "column",
          rowGap: "20px",
          pb: "30px",
          borderBottom: "1px solid #EEEEEE",
        }}
      >
        {/* <TextFieldStyled
          variant="outlined"
          fullWidth
          placeholder={t("old password")}
          {...register("old_password", {
            onChange: (e) => handleInputsChange(e),
          })}
          id="change-old-password"
          error={Boolean(errors.old_password?.message)}
          helperText={(errors.old_password?.message as any) || ""}
          type="password"
        /> */}
        <Box>
          <InputLabel sx={{ color: "primary.main" }}>
            {t("old password")}
          </InputLabel>
          <AccountPasswordInput
            handleChange={handleInputsChange}
            register={register}
            name="old_password"
            placeholder={t("old password")}
            helpertext={errors.old_password?.message as any}
          />
        </Box>
        <Box>
          <InputLabel sx={{ color: "primary.main" }}>
            {t("new password")}
          </InputLabel>
          <AccountPasswordInput
            handleChange={handleInputsChange}
            register={register}
            name="new_password"
            placeholder={t("new password")}
            helpertext={errors.new_password?.message as any}
          />
        </Box>
        <Box>
          <InputLabel sx={{ color: "primary.main" }}>
            {t("confirm password")}
          </InputLabel>
          <AccountPasswordInput
            handleChange={handleInputsChange}
            register={register}
            name="confirm_password"
            placeholder={t("confirm password")}
            helpertext={errors.confirm_password?.message as any}
          />
        </Box>
        {/* <TextFieldStyled
          variant="outlined"
          fullWidth
          placeholder={t("new password")}
          {...register("new_password", {
            onChange: (e) => handleInputsChange(e),
          })}
          error={Boolean(errors.new_password?.message)}
          helperText={(errors.new_password?.message as any) || ""}
          type="password"
        />
        <TextFieldStyled
          variant="outlined"
          fullWidth
          placeholder={t("confirm password")}
          {...register("confirm_password", {
            onChange: (e) => handleInputsChange(e),
          })}
          error={Boolean(errors.confirm_password?.message)}
          helperText={(errors.confirm_password?.message as any) || ""}
          type="password"
        /> */}
      </Box>
      <DeleteAccount />
    </Box>
  );
};
