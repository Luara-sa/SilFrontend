import Link from "next/link";
import React, { useEffect, useLayoutEffect, useState } from "react";

import useTranslation from "next-translate/useTranslation";

import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  useTheme,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import IconButton from "@mui/material/IconButton";

import { meStore } from "store/meStore";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

import { _AuthService } from "services/auth.service";
import { eventEmitter } from "services/eventEmitter";

import { Seo } from "components/shared";
import { TextFieldStyled } from "components/styled/TextFiled";
import ButtonLoader from "components/custom/ButtonLoader";
import { LoginLayout } from "components/layout/login-layout/LoginLayout";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import useDeviceSize from "hooks/useDeviceSize";
import { useGoogleLogin } from "@react-oauth/google";

import { useAuth } from "contexts/AuthContext";
import { useGuestOnly } from "hooks/useProtectedRoute";

const Login = () => {
  const { t } = useTranslation("auth");
  const router = useRouter();
  const theme = useTheme();

  // مهم: استخدم الـ Auth مبكّراً
  const { login } = useAuth();
  const { isLoading: guestCheckLoading } = useGuestOnly();

  const setMe = meStore((state) => state.setMe);
  const deviceSize = useDeviceSize();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().required(),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  // نفصل onChange حتى نصفر error عند الكتابة
  const { onChange: onEmailChange, ...emailRegister } = register("email");
  const { onChange: onPasswordChange, ...passwordRegister } = register("password");

  function redirectToVerify(email: string, verify_email_token?: string) {
    if (verify_email_token) {
      localStorage.setItem("verify_email_token", verify_email_token);
    }
    localStorage.setItem("verification_email", email);

    eventEmitter.emit("enqueueSnackbar", {
      message: "رجاءً فعِّل بريدك الإلكتروني لإكمال تسجيل الدخول.",
      variant: "info",
      autoHideDuration: 3000,
      preventDuplicate: true,
    });

    router.push(`/auth/verfiy-account/${encodeURIComponent(email)}`);
  }

  function LoginHandler(input: any) {
    setLoading(true);
    setError("");

    _AuthService
      .login(input)
      .then((res) => {
        const responseData = res.data as any;

        if (!responseData?.status) {
          throw new Error(responseData?.message || "Login failed");
        }

        const { profile, token, verify_email_token } = responseData.data || {};

        // ممنوع تسجيل الدخول إن لم يكن مفعلاً
        if (!profile?.is_verify) {
          redirectToVerify(profile?.email, verify_email_token);
          return; // بدون login وبدون تخزين token
        }

        if (!token) {
          throw new Error("No token received from server");
        }

        const userData = {
          user: profile,
          token: token,
          role: ["student"],
          info_system: {
            english_level_enum: [],
            document_type_enum: {},
            vat_value: { vat: 0 },
          },
        };

        // فقط هنا نسجّل الدخول فعلياً
        login(userData.token, userData);

        // تحديث بروفايل الطالب إن لزم
        if (userData.role?.includes("student")) {
          _AuthService
            .fetchAndUpdateStudentProfile(meStore)
            .catch((err) => {
              console.warn("Failed to update student profile after login:", err);
            });
        }

        eventEmitter.emit("enqueueSnackbar", {
          message: "Login successfully.",
          variant: "success",
          autoHideDuration: 3000,
          preventDuplicate: true,
        });

        // نعتمد على useGuestOnly للتحويل، مع Fallback سريع
        const redirectTimeout = setTimeout(() => {
          const returnUrl = router.query.returnUrl as string;
          const redirectTarget =
            returnUrl && returnUrl !== "/" && returnUrl !== "/auth/login"
              ? returnUrl
              : "/";
          router.push(redirectTarget);
        }, 500);

        const cleanup = () => clearTimeout(redirectTimeout);
        router.events.on("routeChangeStart", cleanup);
        setTimeout(() => {
          router.events.off("routeChangeStart", cleanup);
          clearTimeout(redirectTimeout);
        }, 1000);
      })
      .catch((err) => {
        if (err) {
          if (
            err?.response?.data?.message === "error_email_or_password" ||
            err?.response?.data?.message === "Invalid login credentials"
          ) {
            setError(t("error email or passowrd"));
          } else if (err?.response?.data?.message === "activate_account") {
            // بدون login وبلا token
            redirectToVerify(input?.email);
          } else {
            const errorMessage =
              err?.response?.data?.message || err.message || "Login failed";
            setError(errorMessage);
          }
        }
      })
      .finally(() => setLoading(false));
  }

  const handleClickShowPassword = () => setShowPassword((s) => !s);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  useLayoutEffect(() => {
    // check handled by useGuestOnly
  }, []);

  const onGoogleAuth = useGoogleLogin({
    onSuccess: (codeResponse) => {
      _AuthService
        .socialLogin({
          access_token: codeResponse.access_token,
          provider: "google",
        })
        .then((res) => {
          const responseData = res.data as any;
          if (!responseData?.status) {
            throw new Error(responseData?.message || "Social login failed");
          }

          const { profile, token, verify_email_token } = responseData.data || {};

          // نفس شرط التفعيل
          if (!profile?.is_verify) {
            redirectToVerify(profile?.email, verify_email_token);
            return; // لا login
          }

          if (!token) {
            throw new Error("No token received from server");
          }

          const userData = {
            user: profile,
            token: token,
            role: ["student"],
            info_system: {
              english_level_enum: [],
              document_type_enum: {},
              vat_value: { vat: 0 },
            },
          };

          // فقط لو مفعّل
          login(userData.token, userData);

          // كنسل التخزين الاحتياطي للمستخدم غير المفعّل
          localStorage.setItem("user_data", JSON.stringify(userData));

          if (userData.role?.includes("student")) {
            _AuthService
              .fetchAndUpdateStudentProfile(meStore)
              .catch((err) => {
                console.warn(
                  "Failed to update student profile after social login:",
                  err
                );
              });
          }

          const returnUrl = router.query.returnUrl as string;
          if (returnUrl && returnUrl !== "/") {
            router.push(returnUrl);
          } else {
            router.push("/");
          }
        })
        .catch((err) => {
          console.error("Social login error:", err);
          eventEmitter.emit("enqueueSnackbar", {
            message: "Something went wrong, please check you internet conection",
            variant: "error",
            snack: {
              autoHideDuration: 3000,
              preventDuplicate: true,
            },
          });
        });
    },
    onError: () => {
      eventEmitter.emit("enqueueSnackbar", {
        message: "Something went wrong, please check you internet conection",
        variant: "error",
        snack: {
          autoHideDuration: 3000,
          preventDuplicate: true,
        },
      });
    },
  });

  return (
    <>
      <Seo title="SIL | Login" />
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
              minHeight: "500px",
              display: "flex",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
              justifyContent: "center",
              backgroundImage:
                "linear-gradient(66.04deg, rgba(254, 254, 254, 0.3) 0%, rgba(254, 254, 254, 0.6) 48.75%, rgba(255, 255, 255, 0.8) 100%)",
              padding: { xs: "0", md: "20px" },
              my: "20px",
            }}
          >
            {deviceSize !== "mobile" && (
              <Box
                sx={{
                  backgroundImage:
                    "linear-gradient(180deg, #0B8191 0%, #1E5B63 100%)",
                  flex: "0.4",
                  minWidth: "250px",
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
                      {t("goHome")}
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
                      {t("getStarted")}
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
                  style={{ width: "25.438vw" }}
                />
              </Box>
              <Box sx={{ width: "100%", mt: "40px" }}>
                <Box>
                  <TextFieldStyled
                    variant="outlined"
                    fullWidth
                    placeholder="Email"
                    {...emailRegister}
                    onChange={(e) => {
                      onEmailChange(e);
                      setError("");
                    }}
                    error={Boolean(errors.email?.message || error)}
                    helperText={(errors.email?.message as any) || error || ""}
                  />
                </Box>
                <Box sx={{ mt: "40px" }}>
                  <FormControl sx={{}} fullWidth variant="outlined">
                    <OutlinedInput
                      id="outlined-adornment-password"
                      type={showPassword ? "text" : "password"}
                      {...passwordRegister}
                      onChange={(e) => {
                        onPasswordChange(e);
                        setError("");
                      }}
                      error={Boolean(errors.password?.message)}
                      placeholder="Password"
                      fullWidth
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      sx={{
                        backgroundColor: "gray.active",
                        fontSize: "16px",
                        "& .MuiInputBase-input ": {
                          padding: "13px 14px",
                        },

                        "& input::placeholder": {
                          color: "gray.main",
                        },
                      }}
                    />
                  </FormControl>
                  <Typography
                    sx={{ color: "#d32f2f", fontSize: "12px", pl: "15px" }}
                  >
                    {(errors.password?.message as any) || error || ""}
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  mt: "40px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <FormControlLabel
                    control={<Checkbox defaultChecked size="small" />}
                    label={t("remember me")}
                    sx={{
                      "& .MuiFormControlLabel-label ": {
                        color: "primary.main",
                        fontWeight: "700",
                        fontSize: "12px",
                      },
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    "& a": {
                      fontSize: "14px",
                      color: "primary.main",
                    },
                  }}
                >
                  <Link href={"forget-password"}>{t("forgot password")}</Link>
                </Box>
              </Box>
              <Box sx={{ width: "70%", mt: "40px" }}>
                <ButtonLoader
                  loading={loading}
                  disableOnLoading
                  variant="contained"
                  onClick={() => handleSubmit(LoginHandler)()}
                  sx={{
                    borderRadius: "10px",
                    fontSize: "19px",
                    fontWeight: "700",
                    height: "34px",
                    width: "100%",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  {t("login")}
                </ButtonLoader>
                <Button
                  onClick={() => onGoogleAuth()}
                  fullWidth
                  variant="light"
                  startIcon={<img src="/assets/icons/google-icon.svg" />}
                  sx={{
                    mt: "24px",
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor: "gray.active",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
                    borderRadius: "10px",
                    fontSize: "0.938vw",
                    fontWeight: "700",
                    py: "2px",
                  }}
                >
                  {t("login with google account")}
                </Button>
                <Box
                  sx={{
                    mt: "48px",
                    textAlign: "center",
                    "& a": { color: "wood.main", fontSize: "0.833vw" },
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <Link href={"signup"}>{t("create new account")}</Link>
                  <Link href={"/company/login"}>{t("companyLogin")} →</Link>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Login;

Login.layout = LoginLayout;
