import React, { useState } from "react";

import * as Yup from "yup";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { Box, TextareaAutosize, Typography } from "@mui/material";

import { _WithoutAuthService } from "services/withoutAuth.service";
import { useMe } from "hooks/useMe";
import { _AuthService } from "services/auth.service";
import { profileSettingsStore } from "store/profileSettingsStore";

import ButtonLoader from "components/custom/ButtonLoader";
import { InputHelperText } from "components/shared";
import useTranslation from "next-translate/useTranslation";

export const DeleteAccountPopupStep2 = () => {
  const [setDeleteAccoutPopupStep] = profileSettingsStore((state) => [
    state.setDeleteAccoutPopupStep,
  ]);

  const { me } = useMe();

  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    description: Yup.string().required(),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { t } = useTranslation("profile");
  const { errors } = formState;

  const onSubmit = async (input: any) => {
    setLoading(true);
    await _WithoutAuthService
      .contactUs({
        name: me?.username,
        email: me?.email,
        description: input.description,
      })
      .then(() => {
        _AuthService
          .deleteAccount()
          .then((res) => {
            setDeleteAccoutPopupStep(3);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  return (
    <Box sx={{ backgroundColor: "#fff", padding: "20px 40px" }}>
      <Box>
        <Box sx={{ display: "flex", flexDirection: "column", rowGap: "10px" }}>
          <Typography
            sx={{ color: "primary.main", fontSize: "24px", fontWeight: "700" }}
          >
            {t("thank you")}
          </Typography>
          <Typography
            sx={{ color: "#9098A3", fontSize: "12px", fontWeight: "500" }}
          >
            {t("delete step two")}
          </Typography>
          <Typography
            sx={{ color: "#333333", fontSize: "16px", fontWeight: "600" }}
          >
            {t("delete step two question")}
          </Typography>
        </Box>
        <Box sx={{ mt: "20px" }}>
          <TextareaAutosize
            aria-label="Description"
            placeholder={t("descreption")}
            {...register("description")}
            style={{
              width: "100%",
              maxWidth: "100%",
              maxHeight: "150px",
              height: "150px",
              borderRadius: "5px",
              outline: "none",
              padding: "10px",
              borderColor: errors.description?.message ? "#FF5252" : "#c0c0c0",
            }}
          />
          <InputHelperText
            helpertext={(errors.description?.message as any) || ""}
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", mt: "35px" }}>
          <ButtonLoader
            onClick={() => handleSubmit(onSubmit)()}
            loading={loading}
            endIcon={!loading && <img src="/assets/icons/send-icon.svg" />}
            textstyle={{ fontSize: "19px", fontWeight: "700" }}
            sx={{
              backgroundColor: "primary.main",
              color: "gray.active",
              "&:hover": { backgroundColor: "#1f6670" },
            }}
          >
            {t("submit")}
          </ButtonLoader>
        </Box>
      </Box>
    </Box>
  );
};
