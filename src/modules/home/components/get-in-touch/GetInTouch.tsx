import React, { useState, useEffect } from "react";
import useTranslation from "next-translate/useTranslation";
import useDeviceSize from "hooks/useDeviceSize";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Box, Typography } from "@mui/material";
import { TextareaAutosize } from "@mui/base";

import { TextFieldStyled } from "components/styled";
import ButtonLoader from "components/custom/ButtonLoader";
import { _WithoutAuthService } from "services/withoutAuth.service";
import { eventEmitter } from "services/eventEmitter";

const defaultFormValues = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export const GetInTouch = () => {
  const DeviceSize = useDeviceSize();
  const { t } = useTranslation("home");
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string().required("Phone is required"),
    subject: Yup.string().required("Subject is required"),
    message: Yup.string().required("Message is required"),
  });

  const formOptions = {
    resolver: yupResolver(validationSchema),
    defaultValues: defaultFormValues,
  };
  const { register, handleSubmit, formState, reset } = useForm(formOptions);
  const { errors } = formState;

  const onSubmit = (input: any) => {
    setIsSubmitLoading(true);
    const { defaultFormValues: _, ...data } = input;
    _WithoutAuthService
      .contactUs(data)
      .then((res: any) => {
        reset(defaultFormValues);
        eventEmitter.emit("enqueueSnackbar", {
          message: "Email Sent Successfully",
          variant: "success",
          autoHideDuration: 3000,
          preventDuplicate: true,
        });
      })
      .catch((err) => console.log(err))
      .finally(() => setIsSubmitLoading(false));
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        py: { xs: "1rem", md: "80px" },
        backgroundImage: `url('/assets/images/home/background.png')`,
      }}
    >
      <Box sx={{ width: { xs: "75%", md: "65vw" } }}>
        <Box>
          <Typography
            sx={{
              fontSize: { xs: "26px", md: "40px" },
              fontWeight: "600",
              color: "primary.main",
              textAlign: { xs: "center", md: "start" },
            }}
          >
            {t("get in touch")}
          </Typography>
          {isMounted && DeviceSize !== "mobile" && (
            <Typography
              variant="subtitle1"
              sx={{
                color: "wood.main",
                width: "60%",
                paddingTop: "1rem",
                paddingBottom: "2rem",
              }}
            >
              {t("lorem")}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: { xs: "20px", md: "3%" },
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            <TextFieldStyled
              variant="outlined"
              fullWidth
              placeholder={t("full name")}
              {...register("name")}
              error={Boolean(errors.name?.message)}
              helperText={(errors.name?.message as any) || ""}
              sx={{
                borderColor: "#EEEEEE",
                border: " 1px solid #EEEEEE",
                boxShadow: "inset 0px 1px 2px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#FFFFFF",
                borderRadius: "5px",
                "& .MuiInputBase-input": {
                  borderColor: "#EEEEEE",
                  boxShadow: "none",
                },
              }}
            />
            <TextFieldStyled
              variant="outlined"
              {...register("email")}
              error={Boolean(errors.email?.message)}
              helperText={(errors.email?.message as any) || ""}
              sx={{
                borderColor: "#EEEEEE",
                border: " 1px solid #EEEEEE",
                boxShadow: "inset 0px 1px 2px rgba(0, 0, 0, 0.1)",
                borderRadius: "5px",
                backgroundColor: "#FFFFFF",
                "& .MuiInputBase-input": {
                  borderColor: "#EEEEEE",
                  boxShadow: "none",
                },
              }}
              fullWidth
              placeholder={t("email")}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: { xs: "20px", md: "3%" },
              flexDirection: { xs: "column", md: "row" },
              mt: "20px",
            }}
          >
            <TextFieldStyled
              variant="outlined"
              fullWidth
              placeholder={t("phone")}
              {...register("phone")}
              error={Boolean(errors.phone?.message)}
              helperText={(errors.phone?.message as any) || ""}
              sx={{
                borderColor: "#EEEEEE",
                border: " 1px solid #EEEEEE",
                boxShadow: "inset 0px 1px 2px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#FFFFFF",
                borderRadius: "5px",
                "& .MuiInputBase-input": {
                  borderColor: "#EEEEEE",
                  boxShadow: "none",
                },
              }}
            />
            <TextFieldStyled
              variant="outlined"
              {...register("subject")}
              error={Boolean(errors.subject?.message)}
              helperText={(errors.subject?.message as any) || ""}
              sx={{
                borderColor: "#EEEEEE",
                border: " 1px solid #EEEEEE",
                boxShadow: "inset 0px 1px 2px rgba(0, 0, 0, 0.1)",
                borderRadius: "5px",
                backgroundColor: "#FFFFFF",
                "& .MuiInputBase-input": {
                  borderColor: "#EEEEEE",
                  boxShadow: "none",
                },
              }}
              fullWidth
              placeholder={t("subject")}
            />
          </Box>
          <TextareaAutosize
            placeholder={t("description")}
            {...register("message")}
            minRows={isMounted && DeviceSize === "mobile" ? 5 : 12}
            style={{
              width: "100%",
              // boxSizing: "border-box",
              maxWidth: "100%",
              maxHeight: "200px",
              borderRadius: "5px",
              outline: "none",
              marginTop: "20px",
              padding: "10px",
              borderColor: errors.message ? "#d32f2f" : "#c0c0c0",
              paddingBottom: "20px",
            }}
          />
          {errors.message && (
            <Typography
              variant="caption"
              color="error"
              sx={{ mt: 0.5, ml: 1.75 }}
            >
              {errors.message.message as any}
            </Typography>
          )}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              py: { xs: "40px", md: "16px" },
            }}
          >
            <ButtonLoader
              loading={isSubmitLoading}
              disableOnLoading
              onClick={() => handleSubmit(onSubmit)()}
              textstyle={{ color: "#FFFFFF", fontSize: "18px", fontWeight: "600" }}
              sx={{
                backgroundColor: "#1E5B63",
                width: { xs: "100%", md: "212px" },
                height: "52px",
                borderRadius: "3px",
                textAlign: "center",
                "&:hover": {
                  backgroundColor: "#1E5B63",
                },
              }}
            >
              {t("send")}
            </ButtonLoader>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
