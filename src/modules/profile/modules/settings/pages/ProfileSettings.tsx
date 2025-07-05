import React, { useEffect } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import { Box, Grid, InputLabel } from "@mui/material";

import { useMe } from "hooks/useMe";
import { profileSettingsStore } from "store/profileSettingsStore";

import { TextFieldStyled } from "components/styled";
import { ProfileImageInput } from "../components/image-input/ProfileImageInput";
import useTranslation from "next-translate/useTranslation";

export const ProfileSettings = () => {
  const { me, isCompany } = useMe();
  const { t } = useTranslation("profile");

  const [setProfileSettingForm, profileSettingForm] = profileSettingsStore(
    (state) => [state.setProfileSettingForm, state.profileSettingForm]
  );

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    // Removed validation for disabled fields
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState, trigger, setValue } =
    useForm(formOptions);
  const { errors } = formState;

  const handleInputsChange = async (e: any) => {
    await trigger(["first_name", "last_name"]);
    const { name, value } = e.target;

    setProfileSettingForm({
      ...profileSettingForm,
      profileChanged: true,
      // error: [
      //   ...(profileSettingForm.error.length > 0
      //     ? profileSettingForm.error.filter((item) => item !== "profile")
      //     : ["profile"]),
      //   "profile",
      // ],
      [name]: value,
    });
  };

  // This useEffect to handle the senario of changing the tab and coming back
  useEffect(() => {
    if (profileSettingForm?.profileChanged) {
      setValue("first_name", profileSettingForm?.first_name);
      setValue("last_name", profileSettingForm?.last_name);
    } else {
      setProfileSettingForm({
        ...profileSettingForm,
        first_name: me?.first_name,
        last_name: me?.last_name,
      });
      setValue("first_name", me?.first_name);
      setValue("last_name", me?.last_name);
    }

    // Set readonly field values (these won't be validated or submitted)
    setValue("email", me?.email);
    setValue("id_number", me?.id_number);
    setValue("username", me?.username);
    setValue("phone", me?.phone);
    setValue("extra_phone", me?.extra_phone);

    return () => {};
  }, [me]);

  // Update ProfileSettingsForm state for any changes on the errors
  useEffect(() => {
    if (Object.keys(errors).length !== 0) {
      if (profileSettingForm?.error) {
        const error = profileSettingForm.error;
        const errorSet = new Set(error);
        errorSet.add("profile");
        profileSettingForm.error = [...errorSet];
      } else {
        setProfileSettingForm({
          ...profileSettingForm,
          error: ["profile"],
        });
      }
    } else {
      if (profileSettingForm?.error) {
        const error = profileSettingForm.error;
        const errorSet = new Set(error);
        errorSet.delete("profile");
        profileSettingForm.error = [...errorSet];
      }
    }
    return () => {};
  }, [errors, profileSettingForm]);

  useEffect(() => {
    trigger(["first_name", "last_name"]);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        columnGap: "30px",
        rowGap: "30px",
        alignItems: { xs: "center", md: "start" },
      }}
    >
      <Box>
        <Box
          sx={{
            width: "250px",
            height: "250px",
          }}
        >
          <ProfileImageInput
            key={me?.profile_img || me?.personal_image || "no-image"}
            personalImage={me?.profile_img || me?.personal_image}
          />
        </Box>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} xl={6}>
          <InputLabel sx={{ color: "primary.main" }}>
            {t("first name") || "First Name"}
          </InputLabel>
          <TextFieldStyled
            variant="outlined"
            fullWidth
            placeholder={t("first name") || "First Name"}
            {...register("first_name", {
              onChange: (e) => handleInputsChange(e),
            })}
            error={Boolean(errors.first_name?.message)}
            helperText={(errors.first_name?.message as any) || ""}
          />
        </Grid>
        <Grid item xs={12} xl={6}>
          <InputLabel sx={{ color: "primary.main" }}>
            {t("last name") || "Last Name"}
          </InputLabel>
          <TextFieldStyled
            variant="outlined"
            fullWidth
            placeholder={t("last name") || "Last Name"}
            {...register("last_name", {
              onChange: (e) => handleInputsChange(e),
            })}
            error={Boolean(errors.last_name?.message)}
            helperText={(errors.last_name?.message as any) || ""}
          />
        </Grid>
        <Grid item xs={12} xl={6}>
          <InputLabel sx={{ color: "primary.main" }}>
            {t("username")}
          </InputLabel>
          <TextFieldStyled
            variant="outlined"
            fullWidth
            placeholder={t("username")}
            {...register("username", {
              onChange: (e) => handleInputsChange(e),
            })}
            error={Boolean(errors.username?.message)}
            helperText={(errors.username?.message as any) || ""}
            disabled={true}
            sx={{
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "rgba(0, 0, 0, 0.6)",
                backgroundColor: "#f5f5f5",
              },
            }}
          />
        </Grid>
        <Grid item xs={12} xl={6}>
          <InputLabel sx={{ color: "primary.main" }}>{t("email")}</InputLabel>
          <TextFieldStyled
            variant="outlined"
            fullWidth
            placeholder={t("email")}
            {...register("email", {
              onChange: (e) => handleInputsChange(e),
            })}
            error={Boolean(errors.email?.message)}
            helperText={(errors.email?.message as any) || ""}
            disabled={true}
            sx={{
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "rgba(0, 0, 0, 0.6)",
                backgroundColor: "#f5f5f5",
              },
            }}
          />
        </Grid>
        <Grid item xs={12} xl={6}>
          <InputLabel sx={{ color: "primary.main" }}>{t("phone")}</InputLabel>
          <TextFieldStyled
            variant="outlined"
            fullWidth
            placeholder={t("phone")}
            {...register("phone", {
              onChange: (e) => handleInputsChange(e),
            })}
            error={Boolean(errors.phone?.message)}
            helperText={(errors.phone?.message as any) || ""}
            disabled={true}
            sx={{
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "rgba(0, 0, 0, 0.6)",
                backgroundColor: "#f5f5f5",
              },
            }}
          />
        </Grid>
        <Grid item xs={12} xl={6}>
          <InputLabel sx={{ color: "primary.main" }}>
            {t("extra phone")}
          </InputLabel>

          <TextFieldStyled
            variant="outlined"
            fullWidth
            placeholder={t("extra phone")}
            {...register("extra_phone", {
              onChange: (e) => handleInputsChange(e),
            })}
            error={Boolean(errors.extra_phone?.message)}
            helperText={(errors.extra_phone?.message as any) || ""}
            disabled={true}
            sx={{
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "rgba(0, 0, 0, 0.6)",
                backgroundColor: "#f5f5f5",
              },
            }}
          />
        </Grid>
        {!isCompany && (
          <Grid item xs={12} xl={6}>
            <InputLabel sx={{ color: "primary.main" }}>
              {t("id number")}
            </InputLabel>

            <TextFieldStyled
              variant="outlined"
              fullWidth
              placeholder={t("id number")}
              {...register("id_number", {
                onChange: (e) => handleInputsChange(e),
                required: isCompany ? false : true,
              })}
              error={Boolean(errors.id_number?.message)}
              helperText={(errors.id_number?.message as any) || ""}
              disabled={true}
              sx={{
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "rgba(0, 0, 0, 0.6)",
                  backgroundColor: "#f5f5f5",
                },
              }}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
