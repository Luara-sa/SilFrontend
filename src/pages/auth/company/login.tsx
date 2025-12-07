import Link from "next/link";
import React, { useEffect, useState } from "react";

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
import PasswordInput from "components/custom/PasswordInput";
import ButtonLoader from "components/custom/ButtonLoader";
import { LoginLayout } from "components/layout/login-layout/LoginLayout";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import useDeviceSize from "hooks/useDeviceSize";

import { useAuth } from "contexts/AuthContext";
import { useGuestOnly } from "hooks/useProtectedRoute";

const CompanyLogin = () => {
  const { t } = useTranslation("auth");

  const router = useRouter();
  const theme = useTheme();

  const setMe = meStore((state) => state.setMe);
  const Device = useDeviceSize();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  const { login } = useAuth();

  // Redirect if already authenticated
  useGuestOnly();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().required(),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  const { onChange: onEmailChange, ...emailRegister } = register("email");
  const { onChange: onPasswordChange, ...passwordRegister } =
    register("password");

  const DeviceSize = useDeviceSize();

  function CompanyLoginHandler(input: any) {
    setLoading(true);
    setError("");
    console.log("Starting company login process...");

    _AuthService
      .loginCompany(input)
      .then((res) => {
        console.log("Company login response received:", res.data);

        // Handle new response structure: { status: true, message: "...", data: { profile: {...}, token: "..." } }
        const responseData = res.data as any;

        if (!responseData.status) {
          throw new Error(responseData.message || "Login failed");
        }

        const { profile, token } = responseData.data;

        if (!token) {
          throw new Error("No token received from server");
        }

        console.log("Token received:", token);
        console.log("Company profile received:", profile);

        const userData = {
          user: profile,
          token: token,
          role: ["company"], // Company role
          info_system: {
            english_level_enum: [],
            document_type_enum: {},
            vat_value: { vat: 0 },
          },
        };

        console.log(
          "Calling auth context login with company userData:",
          userData
        );

        try {
          login(userData.token, userData);
          console.log("Company auth context login completed successfully");
        } catch (loginError) {
          console.error("Company auth context login failed:", loginError);
          throw loginError;
        }

        console.log("Final token check:", !!_AuthService.getJwtToken());

        eventEmitter.emit("enqueueSnackbar", {
          message: "Login successful!",
          variant: "success",
          snack: {
            autoHideDuration: 3000,
            preventDuplicate: true,
          },
        });

        // Redirect to company dashboard
        router.push("/profile?page=dashboard");
      })
      .catch((err: any) => {
        console.error("Company login error:", err);

        let errorMessage = "Login failed. Please try again.";

        if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }

        setError(errorMessage);

        eventEmitter.emit("enqueueSnackbar", {
          message: errorMessage,
          variant: "error",
          snack: {
            autoHideDuration: 5000,
            preventDuplicate: true,
          },
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      <Seo title={`SIL | ${t("companyLogin")}`} />
      <LoginLayout>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            width: "100%",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "30px",
                fontWeight: 700,
                color: "primary.main",
                textAlign: "center",
                mb: 1,
              }}
            >
              {t("companyLogin")}
            </Typography>
            <Typography
              sx={{
                fontSize: "16px",
                color: "text.secondary",
                textAlign: "center",
              }}
            >
              Sign in to your company account
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <form onSubmit={handleSubmit(CompanyLoginHandler)}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                {/* Email Field */}
                <Box>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "text.primary",
                      mb: "8px",
                    }}
                  >
                    {t("Email")}
                  </Typography>
                  <TextFieldStyled
                    fullWidth
                    placeholder={t("Enter your email")}
                    {...emailRegister}
                    onChange={(e: any) => {
                      setError("");
                      onEmailChange(e);
                    }}
                    error={!!errors.email}
                    helperText={errors.email?.message as string}
                  />
                </Box>

                {/* Password Field */}
                <Box>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "text.primary",
                      mb: "8px",
                    }}
                  >
                    {t("Password")}
                  </Typography>
                  <FormControl fullWidth variant="outlined">
                    <OutlinedInput
                      type={showPassword ? "text" : "password"}
                      placeholder={t("Enter your password")}
                      {...passwordRegister}
                      onChange={(e: any) => {
                        setError("");
                        onPasswordChange(e);
                      }}
                      error={!!errors.password}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      sx={{
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: errors.password
                            ? "error.main"
                            : "divider",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: errors.password
                            ? "error.main"
                            : "primary.main",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: errors.password
                            ? "error.main"
                            : "primary.main",
                        },
                      }}
                    />
                    {errors.password && (
                      <Typography
                        sx={{
                          color: "error.main",
                          fontSize: "12px",
                          mt: "4px",
                          ml: "14px",
                        }}
                      >
                        {errors.password.message as string}
                      </Typography>
                    )}
                  </FormControl>
                </Box>

                {/* Error Message */}
                {error && (
                  <Box>
                    <Typography
                      sx={{
                        color: "error.main",
                        fontSize: "14px",
                        textAlign: "center",
                        p: 2,
                        backgroundColor: "error.light",
                        borderRadius: 1,
                      }}
                    >
                      {error}
                    </Typography>
                  </Box>
                )}

                {/* Login Button */}
                <ButtonLoader
                  loading={loading}
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    height: "48px",
                    fontSize: "16px",
                    fontWeight: 600,
                  }}
                  endIcon={<ArrowForwardOutlinedIcon />}
                >
                  {t("Login")}
                </ButtonLoader>

                {/* Links */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 2,
                  }}
                >
                  <Link href="/auth/login" passHref>
                    <Typography
                      component="a"
                      sx={{
                        color: "primary.main",
                        textDecoration: "none",
                        fontSize: "14px",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                                        {t("studentLogin")}
                    </Typography>
                  </Link>
                </Box>
              </Box>
            </form>
          </Box>
        </Box>
      </LoginLayout>
    </>
  );
};

export default CompanyLogin;
