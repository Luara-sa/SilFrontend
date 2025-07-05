import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";

import { Box, Button, Typography } from "@mui/material";

import { TextFieldStyled } from "components/styled/TextFiled";
import { LoginLayout } from "components/layout/login-layout/LoginLayout";
import { Seo } from "components/shared";

import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, SubmitHandler } from "react-hook-form";
import { _AuthService } from "services/auth.service";
import ButtonLoader from "components/custom/ButtonLoader";
import { forgotPasswordSchema } from "validation";

interface ForgotPasswordFormData {
  email: string;
}

const ForgetPassword = () => {
  const { lang, t } = useTranslation("auth");
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const formOptions = { resolver: yupResolver(forgotPasswordSchema) };
  const { register, handleSubmit, formState } =
    useForm<ForgotPasswordFormData>(formOptions);
  const { errors } = formState;

  const submitHandler: SubmitHandler<ForgotPasswordFormData> = (input) => {
    setLoading(true);

    _AuthService
      .forgotPassword(input)
      .then((res) => {
        console.log("Forgot password response:", res);
        // Store token temporarily for the next step
        const token = res.data.result.token;
        sessionStorage.setItem("reset_token", token);

        // Redirect to OTP verification page
        router.push(`/auth/verify-reset-code`);
      })
      .catch((err) => {
        console.error("Forgot password error:", err);
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Seo title="SIL | Forget Password" />
      <Box
        sx={{
          minHeight: "100vh",
          backgroundImage:
            "linear-gradient(252.31deg, #EDFFEE -0.77%, #FFF0E1 25.26%, #FFF6E9 50.14%, #EDFFEE 75.86%, #FFFFFF 100%)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100vw",
            height: "100vh",
            backgroundImage: "url(/assets/images/bg.svg)",
            backgroundPosition: "-20vw 15vh",
            backgroundSize: "70%",
            backgroundRepeat: "no-repeat",
          }}
        >
          <Box
            sx={{
              borderRadius: "15px",
              width: { xs: "95vw", md: "62vw" },
              minHeight: "650px",
              display: "flex",
              alignItems: "center",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
              backgroundImage:
                "linear-gradient(66.04deg, rgba(254, 254, 254, 0.3) 0%, rgba(254, 254, 254, 0.6) 48.75%, rgba(255, 255, 255, 0.8) 100%)",
              padding: "20px",
              my: "20px",
            }}
          >
            <Box
              sx={{
                backgroundImage:
                  "linear-gradient(180deg, #0B8191 0%, #1E5B63 100%)",
                flex: "0.4",
                px: "2.083vw",
                py: "2.083vw",
                borderRadius: "10px",
                height: "100%",
                display: { xs: "none", lg: "flex" },
              }}
            >
              <Box
                sx={{
                  minHeight: "530px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  variant="h1"
                  sx={{ color: "gray.active", fontWeight: "700" }}
                >
                  {t("login")}
                </Typography>
                <Box>
                  <Typography
                    variant="h2"
                    sx={{
                      color: "gray.active",
                      fontWeight: "700",
                      //  mt: "20vh"
                    }}
                  >
                    {t("lorem")}
                  </Typography>

                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "gray.active",
                      mt: "5vh",
                    }}
                  >
                    {t("lorem2")}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: "14px", color: "gray.active" }}>
                    Go to Home
                  </Typography>
                  <Button
                    onClick={() => router.push("/")}
                    variant="contained"
                    endIcon={<ArrowForwardOutlinedIcon />}
                    sx={{
                      backgroundColor: "#FEFEFE",
                      mt: "5px",
                      fontWeight: 700,
                      fontSize: "15px",
                      color: "primary.main",
                      px: "25px",
                      "&:hover": {
                        backgroundColor: "#d8d8d8",
                      },
                    }}
                  >
                    Get Started
                  </Button>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                flex: { xs: "1", lg: "0.6" },
                px: "5vw",
                py: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: "250px",
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <img src="/assets/images/logo.svg" style={{ width: "200px" }} />
              </Box>
              <Box sx={{ width: "100%", mt: "40px" }}>
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "primary.main", mb: "10px" }}
                  >
                    YOUR EMAIL ADDRESS:
                  </Typography>
                  <TextFieldStyled
                    variant="outlined"
                    fullWidth
                    placeholder="Email"
                    {...register("email")}
                    error={Boolean(errors.email?.message)}
                    helperText={(errors.email?.message as any) || ""}
                  />
                </Box>
                <Typography variant="subtitle1" sx={{ color: "gray.main" }}>
                  We will email you with info on how to reset your password.
                </Typography>
              </Box>

              <Box sx={{ width: { xs: "95%", sm: "70%" }, mt: "40px" }}>
                <ButtonLoader
                  loading={loading}
                  disableOnLoading
                  onClick={() => handleSubmit(submitHandler)()}
                  variant="contained"
                  sx={{
                    borderRadius: "10px",
                    fontSize: "0.938vw",
                    fontWeight: "700",
                    height: "34px",
                    width: "100%",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  Send
                </ButtonLoader>
                <Box
                  sx={{
                    mt: "48px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    columnGap: "5px",
                    "& a": { color: "primary.main", fontSize: "13px" },
                  }}
                >
                  <Typography variant="subtitle1" sx={{ color: "wood.main" }}>
                    Remember your password?
                  </Typography>
                  <Link href={"login"}>Login</Link>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ForgetPassword;

ForgetPassword.layout = LoginLayout;
