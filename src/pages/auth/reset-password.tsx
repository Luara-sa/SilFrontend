import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";

import { Box, Button, Typography } from "@mui/material";

import { LoginLayout } from "components/layout/login-layout/LoginLayout";
import { Seo } from "components/shared";
import PasswordInput from "components/custom/PasswordInput";

import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, SubmitHandler } from "react-hook-form";
import { _AuthService } from "services/auth.service";
import ButtonLoader from "components/custom/ButtonLoader";
import { resetPasswordSchema } from "validation";
import useDeviceSize from "hooks/useDeviceSize";

interface ResetPasswordFormData {
  password: string;
  password_confirmation: string;
}

const ResetPassword = () => {
  const { lang, t } = useTranslation("auth");
  const router = useRouter();
  const DeviceSize = useDeviceSize();

  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const formOptions = { resolver: yupResolver(resetPasswordSchema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  useEffect(() => {
    // Get token from session storage
    const resetToken = sessionStorage.getItem("reset_token");
    if (!resetToken) {
      // If no token, redirect back to forgot password
      router.push("/auth/forget-password");
      return;
    }
    setToken(resetToken);
  }, [router]);

  function submitHandler(input: any) {
    if (!token) return;

    setLoading(true);

    _AuthService
      .resetPassword(token, input)
      .then((res) => {
        console.log("Reset password response:", res);
        // Clear token from session storage
        sessionStorage.removeItem("reset_token");

        // Redirect to login page
        router.push("/auth/login");
      })
      .catch((err) => {
        console.error("Reset password error:", err);
      })
      .finally(() => setLoading(false));
  }

  if (!token) {
    return null; // Will redirect
  }

  return (
    <>
      <Seo title="SIL | Reset Password" />
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
            {DeviceSize !== "mobile" && (
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
            )}
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
                <Typography
                  variant="h4"
                  sx={{
                    color: "primary.main",
                    mb: "20px",
                    textAlign: "center",
                    fontWeight: "600",
                  }}
                >
                  Reset Your Password
                </Typography>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: "15px" }}
                >
                  <PasswordInput
                    name="password"
                    register={register}
                    placeholder="New Password"
                    error={Boolean(errors.password?.message)}
                    helpertext={(errors.password?.message as any) || ""}
                  />
                  <PasswordInput
                    name="password_confirmation"
                    register={register}
                    placeholder="Confirm New Password"
                    error={Boolean(errors.password_confirmation?.message)}
                    helpertext={
                      (errors.password_confirmation?.message as any) || ""
                    }
                  />
                </Box>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "gray.main", mt: "10px" }}
                >
                  Please enter your new password and confirm it.
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
                  Reset Password
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
                  <Link href={"/auth/login"}>Login</Link>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ResetPassword;

ResetPassword.layout = LoginLayout;
