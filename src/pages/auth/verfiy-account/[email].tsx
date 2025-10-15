import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { _AuthService } from "services/auth.service";
import { eventEmitter } from "services/eventEmitter";

import { LoginLayout } from "components/layout/login-layout/LoginLayout";
import { Box, Button, InputAdornment, Typography } from "@mui/material";
import { TextFieldStyled } from "components/styled/TextFiled";
import { Seo } from "components/shared";

import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import ButtonLoader from "components/custom/ButtonLoader";
import { meStore } from "store/meStore";

import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import useDeviceSize from "hooks/useDeviceSize";
import { Timer } from "modules/courses/components/courses-filter/components/Timer";

const VerfiyAccount = () => {
  const router = useRouter();

  const setMe = meStore((state) => state.setMe);

  const [loading, setLoading] = useState(false);
  const [resendCode, setResendCode] = useState<boolean>(false);
  const [email, setEmail] = useState<any>();
  const [verifyEmailToken, setVerifyEmailToken] = useState<string>("");

  useEffect(() => {
    setEmail(router.query.email);

    // Get verify_email_token from localStorage
    const storedToken = localStorage.getItem("verify_email_token");
    if (storedToken) {
      setVerifyEmailToken(storedToken);
    } else {
      // If no token found, redirect back to login
      console.warn("No verification token found, redirecting to login");
      router.push("/auth/login");
    }

    return () => {};
  }, [router]);
  const validationSchema = Yup.object().shape({
    code: Yup.string().required(),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;
  const DeviceSize = useDeviceSize();

  function SubmitHandler(input: any) {
    if (!verifyEmailToken) {
      eventEmitter.emit("enqueueSnackbar", {
        message: "Verification token not found. Please try logging in again.",
        snack: {
          variant: "error",
          autoHideDuration: 3000,
          preventDuplicate: true,
        },
      });
      return;
    }

    setLoading(true);

    _AuthService
      .verifyEmail(verifyEmailToken, {
        code: input.code,
        email: email,
      })
      .then((res) => {
        console.log("Email verification response:", res);

        // Clear verification data from localStorage
        localStorage.removeItem("verify_email_token");
        localStorage.removeItem("verification_email");

        // eventEmitter.emit("enqueueSnackbar", {
        //   message: "Email verified successfully!",
        //   snack: {
        //     variant: "success",
        //     autoHideDuration: 3000,
        //     preventDuplicate: true,
        //   },
        // });

        // Check if user is already authenticated (has valid token)
        if (_AuthService.isLoggedIn()) {
          console.log("User is authenticated, redirecting to main page");
          router.push("/");
        } else {
          console.log("User not authenticated, redirecting to login");
          router.push("/auth/login");
        }
      })
      .catch((err) => {
        console.error("Email verification error:", err);
        const errorMessage =
          err?.response?.data?.message ||
          "Verification failed. Please try again.";
        eventEmitter.emit("enqueueSnackbar", {
          message: errorMessage,
          snack: {
            variant: "error",
            autoHideDuration: 3000,
            preventDuplicate: true,
          },
        });
      })
      .finally(() => setLoading(false));
  }

  const handleResendCode = () => {
    if (!email) {
      eventEmitter.emit("enqueueSnackbar", {
        message: "Email not found. Please try again.",
        snack: {
          variant: "error",
          autoHideDuration: 3000,
          preventDuplicate: true,
        },
      });
      return;
    }

    setResendCode(true);
    _AuthService
      .resendVerificationCode(email)
      .then((res) => {
        console.log("Resend verification code response:", res);
        eventEmitter.emit("enqueueSnackbar", {
          message: "Verification code sent successfully!",
          snack: {
            variant: "success",
            autoHideDuration: 3000,
            preventDuplicate: true,
          },
        });
      })
      .catch((err) => {
        console.error("Resend verification code error:", err);
        const errorMessage =
          err?.response?.data?.message ||
          "Failed to resend code. Please try again.";
        eventEmitter.emit("enqueueSnackbar", {
          message: errorMessage,
          snack: {
            variant: "error",
            autoHideDuration: 3000,
            preventDuplicate: true,
          },
        });
        setResendCode(false); // Reset resend state on error
      });
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
              width: { xs: "77%", md: "62vw" },
              minHeight: { xs: "550px", md: "650px" },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
              backgroundImage:
                "linear-gradient(66.04deg, rgba(254, 254, 254, 0.3) 0%, rgba(254, 254, 254, 0.6) 48.75%, rgba(255, 255, 255, 0.8) 100%)",
              padding: { xs: "0", md: "20px" },
              my: "20px",
            }}
          >
            {DeviceSize !== "mobile" && (
              <Box
                sx={{
                  backgroundImage:
                    "linear-gradient(180deg, #0B8191 0%, #1E5B63 100%)",
                  flex: "0.4",
                  minWidth: "250px",
                  height: "650px",
                  px: "2.083vw",
                  py: "2.083vw",
                  borderRadius: "10px",
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography
                      variant="h1"
                      sx={{ color: "gray.active", fontWeight: "700" }}
                    >
                      Verify Your Account
                    </Typography>
                    <Typography sx={{ color: "wood.main", fontSize: "16px" }}>
                      Registration confirmation
                    </Typography>
                  </Box>

                  <Typography
                    variant="h2"
                    sx={{
                      color: "gray.active",
                      fontWeight: "700",
                      //  mt: "20vh"
                    }}
                  >
                    Verify Your Account
                  </Typography>

                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "gray.active",
                      //  mt: "5vh"
                    }}
                  >
                    We&apos;ve sent a verification code to your email address.
                    Please enter the code below to activate your account and
                    start learning.
                  </Typography>
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
                flex: "0.6",
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
                <img
                  src="/assets/images/logo.svg"
                  style={{ width: "29.438vw" }}
                />
              </Box>
              <Box sx={{ width: "100%", mt: "40px" }}>
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "primary.main" }}
                  >
                    Verify YOUR EMAIL ADDRESS:
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "18px",
                      mb: "10px",
                      color: "primary.main",
                      fontWeight: 600,
                    }}
                  >
                    {email}
                  </Typography>
                  <TextFieldStyled
                    {...register("code")}
                    error={Boolean(errors.code?.message)}
                    helperText={(errors.code?.message as any) || ""}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography
                            sx={{
                              fontSize: "16px",
                              fontWeight: "500",
                              color: "gray.main",
                            }}
                          >
                            G -
                          </Typography>
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                    fullWidth
                  />
                </Box>
                <Typography
                  sx={{
                    color: "gray.main",
                    fontSize: "16px",
                    mt: "10px",
                    lineHeight: "20px",
                  }}
                >
                  We&apos;ll send you an email with a verification number to
                  confirm your account
                </Typography>
              </Box>

              <Box sx={{ width: "70%", mt: "40px" }}>
                <ButtonLoader
                  loading={loading}
                  disableOnLoading
                  onClick={() => handleSubmit(SubmitHandler)()}
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
                  Verify
                </ButtonLoader>

                {resendCode === true && (
                  <Box
                    sx={{
                      mt: "48px",
                      textAlign: "center",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      columnGap: "5px",
                      "& a": { color: "primary.main", fontSize: "0.833vw" },
                    }}
                  >
                    <Timer setResend={setResendCode} />
                  </Box>
                )}

                {resendCode === false && (
                  <Box
                    sx={{
                      mt: "48px",
                      textAlign: "center",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      columnGap: "5px",
                      "& a": { color: "primary.main", fontSize: "0.833vw" },
                    }}
                  >
                    <Button
                      onClick={handleResendCode}
                      disableRipple
                      disableTouchRipple
                      sx={{
                        color: "wood.main",
                        fontSize: "14px",
                      }}
                    >
                      <Typography
                        sx={{
                          borderBottom: "0.5px solid #CBA770",
                          cursor: "pointer",
                        }}
                      >
                        Resend code
                      </Typography>
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default VerfiyAccount;

VerfiyAccount.layout = LoginLayout;
