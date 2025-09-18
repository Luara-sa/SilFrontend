import React, { useState, useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useAuth } from "contexts/AuthContext";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  FormControl,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { LoginLayout } from "components/layout/login-layout/LoginLayout";
import { Seo } from "components/shared";
import { TextFieldStyled } from "components/styled/TextFiled";
import ButtonLoader from "components/custom/ButtonLoader";
import { _AuthService } from "services/auth.service";
import { eventEmitter } from "services/eventEmitter";
import { meStore } from "store/meStore";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useGoogleLogin } from "@react-oauth/google";
import { useGuestOnly } from "hooks/useProtectedRoute";

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: NextPage = () => {
  const { t } = useTranslation("auth");
  const router = useRouter();
  const { isAuthenticated, user, login } = useAuth();
  const [activeTab, setActiveTab] = useState(0); // 0 = Student, 1 = Company
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Use guest-only hook to redirect authenticated users
  useGuestOnly();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().required(),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState, reset } =
    useForm<LoginFormData>(formOptions);
  const { errors } = formState;

  const { onChange: onEmailChange, ...emailRegister } = register("email");
  const { onChange: onPasswordChange, ...passwordRegister } =
    register("password");

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on user type
      if (user.user_type === "student") {
        router.push("/courses");
      } else if (user.user_type === "company") {
        router.push("/company");
      }
    }
  }, [isAuthenticated, user, router]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setError("");
    reset();
  };

  const handleLogin = async (data: LoginFormData) => {
    setLoading(true);
    setError("");

    try {
      const loginMethod =
        activeTab === 0 ? _AuthService.login : _AuthService.loginCompany;
      const userType = activeTab === 0 ? "student" : "company";

      console.log(`Starting ${userType} login process...`);

      const response = await loginMethod.call(_AuthService, data);
      console.log(`${userType} login response:`, response.data);

      const responseData = response.data as any;

      if (!responseData.status) {
        throw new Error(responseData.message || "Login failed");
      }

      const { profile, token, verify_email_token } = responseData.data;

      if (!token) {
        throw new Error("No token received from server");
      }

      // For student login, check email verification
      if (
        activeTab === 0 &&
        (profile.is_verify === 0 || profile.is_verify === false)
      ) {
        console.log(
          "User email not verified, redirecting to verification page"
        );

        const userData = {
          user: profile,
          token: token,
          role: [userType],
          info_system: {
            english_level_enum: [],
            document_type_enum: {},
            vat_value: { vat: 0 },
          },
        };

        login(userData.token, userData);

        if (verify_email_token) {
          localStorage.setItem("verify_email_token", verify_email_token);
        }
        localStorage.setItem("verification_email", profile.email);

        router.push(
          `/auth/verfiy-account/${encodeURIComponent(profile.email)}`
        );
        return;
      }

      const userData = {
        user: profile,
        token: token,
        role: [userType],
        info_system: {
          english_level_enum: [],
          document_type_enum: {},
          vat_value: { vat: 0 },
        },
      };

      console.log(
        `Calling auth context login with ${userType} userData:`,
        userData
      );

      login(userData.token, userData);

      // For student, fetch updated profile
      if (activeTab === 0) {
        _AuthService
          .fetchAndUpdateStudentProfile(meStore)
          .then((updatedUser) => {
            if (updatedUser) {
              console.log("Student profile updated successfully");
            }
          })
          .catch((err) => {
            console.warn("Failed to update student profile after login:", err);
          });
      }

      eventEmitter.emit("enqueueSnackbar", {
        message: "Login successful!",
        variant: "success",
        autoHideDuration: 3000,
        preventDuplicate: true,
      });

      // Redirect based on user type
      const redirectUrl = activeTab === 0 ? "/courses" : "/company";
      router.push(redirectUrl);
    } catch (err: any) {
      console.error(
        `${activeTab === 0 ? "Student" : "Company"} login error:`,
        err
      );

      let errorMessage = "Login failed. Please try again.";
      if (
        err?.response?.data?.message === "error_email_or_password" ||
        err?.response?.data?.message === "Invalid login credentials"
      ) {
        errorMessage = t("error email or passowrd");
      } else if (err?.response?.data?.message === "activate_account") {
        router.push(`/auth/verfiy-account/${data.email}`);
        return;
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);

      eventEmitter.emit("enqueueSnackbar", {
        message: errorMessage,
        variant: "error",
        autoHideDuration: 5000,
        preventDuplicate: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const onGoogleAuth = useGoogleLogin({
    onSuccess: (codeResponse) => {
      if (activeTab !== 0) {
        eventEmitter.emit("enqueueSnackbar", {
          message: "Google login is only available for students",
          variant: "warning",
          autoHideDuration: 3000,
          preventDuplicate: true,
        });
        return;
      }

      _AuthService
        .socialLogin({
          access_token: codeResponse.access_token,
          provider: "google",
        })
        .then((res) => {
          const responseData = res.data as any;

          if (!responseData.status) {
            throw new Error(responseData.message || "Social login failed");
          }

          const { profile, token } = responseData.data;

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

          login(userData.token, userData);

          _AuthService
            .fetchAndUpdateStudentProfile(meStore)
            .then((updatedUser) => {
              if (updatedUser) {
                console.log("Student profile updated after social login");
              }
            })
            .catch((err) => {
              console.warn(
                "Failed to update student profile after social login:",
                err
              );
            });

          router.push("/courses");
        })
        .catch((err) => {
          console.error("Social login error:", err);
          eventEmitter.emit("enqueueSnackbar", {
            message: "Social login failed. Please try again.",
            variant: "error",
            autoHideDuration: 3000,
            preventDuplicate: true,
          });
        });
    },
    onError: (error) => {
      eventEmitter.emit("enqueueSnackbar", {
        message: "Something went wrong, please check your internet connection",
        variant: "error",
        autoHideDuration: 3000,
        preventDuplicate: true,
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
              width: { xs: "90%", md: "70vw", lg: "60vw" },
              minHeight: "600px",
              display: "flex",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
              justifyContent: "center",
              backgroundImage:
                "linear-gradient(66.04deg, rgba(254, 254, 254, 0.3) 0%, rgba(254, 254, 254, 0.6) 48.75%, rgba(255, 255, 255, 0.8) 100%)",
              padding: { xs: "20px", md: "20px" },
              my: "20px",
            }}
          >
            {/* Left Side - Welcome Section */}
            <Box
              sx={{
                backgroundImage:
                  "linear-gradient(180deg, #0B8191 0%, #1E5B63 100%)",
                flex: { xs: "0", md: "0.4" },
                minWidth: { xs: "0", md: "250px" },
                px: { xs: "0", md: "2.083vw" },
                py: { xs: "0", md: "2.083vw" },
                borderRadius: "10px",
                display: { xs: "none", md: "flex" },
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  color: "gray.active",
                  fontWeight: "700",
                  fontSize: "2rem",
                }}
              >
                {t("login")}
              </Typography>
              <Box>
                <Typography
                  variant="h2"
                  sx={{
                    color: "gray.active",
                    fontWeight: "700",
                    fontSize: "1.5rem",
                    mb: "20px",
                  }}
                >
                  {t("lorem")}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "gray.active",
                    fontSize: "1rem",
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

            {/* Right Side - Login Form */}
            <Box
              sx={{
                flex: { xs: "1", md: "0.6" },
                px: { xs: "0", md: "3vw" },
                py: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Logo */}
              <Box
                sx={{
                  width: { xs: "200px", md: "250px" },
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  mb: "30px",
                }}
              >
                <img
                  src="/assets/images/logo.svg"
                  alt="SIL Logo"
                  style={{ width: "100%", maxWidth: "200px" }}
                />
              </Box>

              {/* Tab Switch */}
              <Box sx={{ width: "100%", maxWidth: "400px", mb: "30px" }}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  variant="fullWidth"
                  sx={{
                    mb: 2,
                    "& .MuiTab-root": {
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "16px",
                      color: "primary.main",
                    },
                    "& .MuiTabs-indicator": {
                      height: 3,
                      backgroundColor: "primary.main",
                    },
                    "& .Mui-selected": {
                      color: "primary.main",
                    },
                  }}
                >
                  <Tab label="Student Login" />
                  <Tab label="Company Login" />
                </Tabs>
              </Box>

              {/* Login Form */}
              <Box
                component="form"
                onSubmit={handleSubmit(handleLogin)}
                sx={{ width: "100%", maxWidth: "400px" }}
              >
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: "20px" }}
                >
                  {/* Email Field */}
                  <Box>
                    <TextFieldStyled
                      fullWidth
                      placeholder="Email"
                      {...emailRegister}
                      onChange={(e: any) => {
                        setError("");
                        onEmailChange(e);
                      }}
                      error={!!errors.email || !!error}
                      helperText={(errors.email?.message as string) || ""}
                    />
                  </Box>

                  {/* Password Field */}
                  <Box>
                    <FormControl fullWidth variant="outlined">
                      <OutlinedInput
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        {...passwordRegister}
                        onChange={(e: any) => {
                          setError("");
                          onPasswordChange(e);
                        }}
                        error={!!errors.password || !!error}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        sx={{
                          backgroundColor: "gray.active",
                          fontSize: "16px",
                          "& .MuiInputBase-input": {
                            padding: "13px 14px",
                          },
                          "& input::placeholder": {
                            color: "gray.main",
                          },
                        }}
                      />
                      {(errors.password || error) && (
                        <Typography
                          sx={{
                            color: "error.main",
                            fontSize: "12px",
                            mt: "4px",
                            ml: "14px",
                          }}
                        >
                          {(errors.password?.message as string) || error}
                        </Typography>
                      )}
                    </FormControl>
                  </Box>

                  {/* Remember Me & Forgot Password */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label={t("remember me")}
                      sx={{
                        "& .MuiFormControlLabel-label": {
                          color: "primary.main",
                          fontWeight: "700",
                          fontSize: "12px",
                        },
                      }}
                    />
                    <Link href="/auth/forget-password">
                      <Typography
                        sx={{
                          fontSize: "14px",
                          color: "primary.main",
                          cursor: "pointer",
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                      >
                        {t("forgot password")}
                      </Typography>
                    </Link>
                  </Box>

                  {/* Login Button */}
                  <ButtonLoader
                    loading={loading}
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                      height: "48px",
                      fontSize: "19px",
                      fontWeight: 700,
                      borderRadius: "10px",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    {t("login")}
                  </ButtonLoader>

                  {/* Google Login - Only for Students */}
                  {activeTab === 0 && (
                    <Button
                      onClick={() => onGoogleAuth()}
                      fullWidth
                      variant="outlined"
                      startIcon={
                        <img src="/assets/icons/google-icon.svg" alt="Google" />
                      }
                      sx={{
                        height: "48px",
                        fontSize: "14px",
                        fontWeight: 700,
                        borderRadius: "10px",
                        textTransform: "none",
                        backgroundColor: "gray.active",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
                        border: "none",
                        py: "2px",
                        "&:hover": {
                          border: "none",
                          backgroundColor: "rgba(0, 0, 0, 0.04)",
                        },
                      }}
                    >
                      {t("login with google account")}
                    </Button>
                  )}

                  {/* Sign Up Link */}
                  <Box sx={{ textAlign: "center", mt: "20px" }}>
                    <Link href="/auth/signup">
                      <Typography
                        sx={{
                          color: "wood.main",
                          fontSize: "14px",
                          cursor: "pointer",
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                      >
                        {t("create new account")}
                      </Typography>
                    </Link>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default LoginPage;
LoginPage.layout = LoginLayout;
