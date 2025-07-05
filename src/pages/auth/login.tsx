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
import { OutlinedInputProps } from "@mui/material";
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
import PasswordInput from "components/custom/PasswordInput";
import ButtonLoader from "components/custom/ButtonLoader";
import { LoginLayout } from "components/layout/login-layout/LoginLayout";

import googleIcon from "/assets/icons/google-icon.svg";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import useDeviceSize from "hooks/useDeviceSize";
import { useGoogleLogin } from "@react-oauth/google";

const Login = () => {
  const { t } = useTranslation("auth");

  const router = useRouter();
  const theme = useTheme();

  const setMe = meStore((state) => state.setMe);
  const Device = useDeviceSize();

  const [loading, setLoading] = useState(false);
  // Error state for the back error message
  const [error, setError] = useState<string>("");

  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().required(),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  // I did that beacause we need to reset the (error) state when the user start typing
  const { onChange: onEmailChange, ...emailRegister } = register("email");
  const { onChange: onPasswordChange, ...passwordRegister } =
    register("password");

  const DeviceSize = useDeviceSize();

  function LoginHandler(input: any) {
    setLoading(true);
    setError("");
    _AuthService
      .login(input)
      .then((res) => {
        // Handle new response structure: { status: true, message: "...", data: { profile: {...}, token: "..." } }
        const userData = {
          user: (res.data as any).data.profile,
          token: (res.data as any).data.token,
          role: ["student"], // Default role for now
          info_system: {
            // Mock info_system structure to prevent loading state
            english_level_enum: [],
            document_type_enum: {},
            vat_value: { vat: 0 },
          },
        };
        setMe(userData);

        // Save user data to localStorage for persistence
        localStorage.setItem("user_data", JSON.stringify(userData));

        // Fetch updated student profile data after successful login
        if (userData.role?.includes("student")) {
          _AuthService
            .fetchAndUpdateStudentProfile(meStore)
            .then((updatedUser) => {
              if (updatedUser) {
              }
            })
            .catch((err) => {
              console.warn(
                "Failed to update student profile after login:",
                err
              );
            });
        }

        eventEmitter.emit("enqueueSnackbar", {
          message: "Login successfully.",
          variant: "success",
          autoHideDuration: 3000,
          preventDuplicate: true,
        });
        // Redirect to placement tests after login
        router.push("/placement-tests");
      })
      .catch((err) => {
        if (err) {
          if (err?.response?.data?.message === "error_email_or_password") {
            setError(t("error email or passowrd"));
          } else if (err?.response?.data?.message === "activate_account") {
            router.push(`/auth/verfiy-account/${input?.email}`);
          } else {
            setError(err?.response?.data?.message);
          }
        }
      })
      .finally(() => setLoading(false));
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  useLayoutEffect(() => {
    _AuthService.isLoggedIn() && router.push("/");
  }, []);

  const onGoogleAuth = useGoogleLogin({
    onSuccess: (codeResponse) => {
      _AuthService
        .socialLogin({
          access_token: codeResponse.access_token,
          provider_name: "google",
        })
        .then((res) => {
          // Handle social login response - assuming it follows the new structure
          const userData = {
            user: (res.data as any).profile || (res.data as any).result?.user,
            token:
              (res.data as any).token || (res.data as any).result?.access_token,
            role: ["student"], // Default role for now
            info_system: {
              // Mock info_system structure to prevent loading state
              english_level_enum: [],
              document_type_enum: {},
              vat_value: { vat: 0 },
            },
          };
          setMe(userData);

          // Save user data to localStorage for persistence
          localStorage.setItem("user_data", JSON.stringify(userData));

          // Fetch updated student profile data after successful social login
          if (userData.role?.includes("student")) {
            _AuthService
              .fetchAndUpdateStudentProfile(meStore)
              .then((updatedUser) => {
                if (updatedUser) {
                }
              })
              .catch((err) => {});
          }

          router.push("/");
        })
        .catch((err) => console.error(err));
    },
    onError: (error) => {
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
            {DeviceSize !== "mobile" && (
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
                  }}
                >
                  <Link href={"signup"}>{t("create new account")}</Link>
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
