import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import useTranslation from "next-translate/useTranslation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import { parsePhoneNumber } from "react-phone-number-input";

import {
  Autocomplete,
  Box,
  Button,
  capitalize,
  TextField,
  Typography,
} from "@mui/material";

import { signupSchema } from "validation";
import { _AuthService } from "services/auth.service";

import PasswordInput from "components/custom/PasswordInput";
import { TextFieldStyled } from "components/styled/TextFiled";
import { InputHelperText, Seo } from "components/shared";
import { LoginLayout } from "components/layout/login-layout/LoginLayout";
import ButtonLoader from "components/custom/ButtonLoader";
import { AgreeToPolicyCheckbox } from "modules/auth";

import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";

import "react-phone-number-input/style.css";
import { useGoogleLogin } from "@react-oauth/google";
import { meStore } from "store/meStore";
import { eventEmitter } from "services/eventEmitter";
import useDeviceSize from "hooks/useDeviceSize";

const Signup = () => {
  const { lang, t } = useTranslation("auth");

  const router = useRouter();

  const setMe = meStore((state) => state.setMe);

  const DeviceSize = useDeviceSize();

  const [loading, setLoading] = useState(false);
  const [showExtraPhone, setShowExtraPhone] = useState(false);
  // State for gender select;
  //  because the react-hooks-form does make a rerender to update the value
  const [gender, setGender] = useState<string | null>(null);

  const handleShowExtraPhone = () => setShowExtraPhone((old) => !old);

  const formOptions = { resolver: yupResolver(signupSchema) };
  const { register, handleSubmit, formState, setValue, getValues } =
    useForm(formOptions);
  const { errors } = formState;

  function RegisterHandler(input: any) {
    console.log("Form submitted with data:", input);
    setLoading(true);
    const data = { ...input };
    delete data.isTermAgreed;

    // Remove any legacy fields that shouldn't be sent to backend
    delete data.password2;
    delete data.id_number;
    delete data.extra_phone; // This is handled separately if needed

    // Split phone number into prefix and number
    if (data.phone) {
      try {
        const phoneNumber = parsePhoneNumber(data.phone);
        if (phoneNumber) {
          data.prefix_phone_number = `+${phoneNumber.countryCallingCode}`;
          data.phone = phoneNumber.nationalNumber;
        }
      } catch (error) {
        console.warn("Phone number parsing failed:", error);
      }
    }

    console.log("Data being sent to API:", data);

    // Create clean payload with only expected backend fields
    const cleanPayload = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: data.password,
      password_confirmation: data.password_confirmation,
      prefix_phone_number: data.prefix_phone_number,
      phone: data.phone,
      gender: data.gender,
    };

    console.log("Clean payload being sent to API:", cleanPayload);

    _AuthService
      .register(cleanPayload)
      .then((res) => {
        console.log("Registration successful:", res);
        // Handle new response structure: { status: true, message: "Success", data: { profile: {...}, token: "..." } }
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

        eventEmitter.emit("enqueueSnackbar", {
          message: "Registration successful! Welcome to SIL.",
          variant: "success",
          snack: {
            autoHideDuration: 3000,
            preventDuplicate: true,
          },
        });

        // Redirect to placement tests after successful registration
        router.push("/placement-tests");
      })
      .catch((err) => {
        console.error("Registration error:", err);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
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
      <Seo title="SIL | Signup" />
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
                px: { xs: "0", md: "5vw" },
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
                  "& img": {
                    width: "100%",
                  },
                }}
              >
                <img
                  src="/assets/images/logo.svg"
                  style={{ width: "25.438vw" }}
                />{" "}
              </Box>
              <Box
                sx={{
                  width: { xs: "77%", md: "100%" },
                  mt: "40px",
                  display: "flex",
                  flexDirection: "column",
                  rowGap: "13px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    columnGap: "10px",
                    rowGap: "15px",
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <TextFieldStyled
                    variant="outlined"
                    fullWidth
                    placeholder="First Name"
                    {...register("first_name")}
                    error={Boolean(errors.first_name?.message)}
                    helperText={(errors.first_name?.message as any) || ""}
                  />
                  <TextFieldStyled
                    variant="outlined"
                    fullWidth
                    placeholder="Last Name"
                    {...register("last_name")}
                    error={Boolean(errors.last_name?.message)}
                    helperText={(errors.last_name?.message as any) || ""}
                  />
                </Box>
                <Box>
                  <TextFieldStyled
                    variant="outlined"
                    fullWidth
                    placeholder="Email"
                    {...register("email")}
                    error={Boolean(errors.email?.message)}
                    helperText={(errors.email?.message as any) || ""}
                  />
                </Box>
                <Box>
                  <Autocomplete
                    disablePortal
                    onChange={(e: any, newValue: any) => {
                      setValue("gender", newValue ?? "", {
                        shouldValidate: true,
                      });
                      setGender(newValue);
                    }}
                    value={gender}
                    getOptionLabel={(option) => capitalize(option)}
                    options={["male", "female"]}
                    fullWidth
                    sx={{
                      "& .MuiInputBase-root MuiOutlinedInput-root": {
                        padding: "5px 14px !important",
                      },
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        id="gender"
                        name="gender"
                        placeholder="Gender"
                        error={!!errors.gender?.message}
                        helperText={errors.gender?.message as string}
                        sx={{
                          backgroundColor: "gray.active",
                          fontWeight: 700,
                          fontSize: "20px",

                          "& .MuiInputBase-root.MuiInputBase-formControl": {
                            padding: "5px 14px !important",
                          },
                          "& .MuiFormHelperText-root ": {
                            fontSize: "12px",
                          },
                        }}
                      />
                    )}
                  />
                </Box>
                <Box sx={{ display: "flex" }}>
                  <Box sx={{ width: "calc(100% - 56px)" }}>
                    <PhoneInput
                      className={errors.phone?.message ? "error" : ""}
                      international={false}
                      defaultCountry="SA"
                      // value={phone}
                      onChange={(newValue) =>
                        setValue("phone", newValue, {
                          shouldValidate: true,
                        })
                      }
                    />
                    <InputHelperText
                      helpertext={(errors.phone?.message as any) || ""}
                    />
                  </Box>
                  <Button
                    onClick={handleShowExtraPhone}
                    variant="contained"
                    sx={{
                      backgroundColor: "#0B8090",
                      borderRadius: "5px",
                      width: { xs: "41px", md: "56px" },
                      maxHeight: "41px",
                      ml: { xs: "0", md: "13px" },
                      fontSize: "20px",
                      display: "flex",
                      alignItems: "center",
                      "&:hover": {
                        backgroundColor: "#0e92a4",
                      },
                    }}
                  >
                    {showExtraPhone ? "-" : "+"}
                  </Button>
                </Box>
                {showExtraPhone && (
                  <Box>
                    <PhoneInput
                      className={errors.extra_phone?.message ? "error" : ""}
                      international={false}
                      defaultCountry="SA"
                      onChange={(newValue) =>
                        setValue("extra_phone", newValue, {
                          shouldValidate: true,
                        })
                      }
                      // {...register("extra_phone")}
                    />
                    <InputHelperText
                      helpertext={(errors.extra_phone?.message as any) || ""}
                    />
                  </Box>
                )}
                <Box>
                  <PasswordInput
                    name="password"
                    register={register}
                    error={Boolean(errors.password?.message)}
                    helpertext={(errors.password?.message as any) || ""}
                  />
                </Box>
                <Box>
                  <PasswordInput
                    name="password_confirmation"
                    register={register}
                    placeholder="Confirm Password"
                    error={Boolean(errors.password_confirmation?.message)}
                    helpertext={
                      (errors.password_confirmation?.message as any) || ""
                    }
                  />
                </Box>
              </Box>
              <Box sx={{ width: { xs: "77%", md: "100%" }, mt: "10px" }}>
                <AgreeToPolicyCheckbox
                  setValue={setValue}
                  error={(errors.isTermAgreed?.message as any) || ""}
                />
              </Box>

              <Box sx={{ width: "70%", mt: "40px" }}>
                <ButtonLoader
                  loading={loading}
                  disableOnLoading
                  variant="contained"
                  onClick={() => handleSubmit(RegisterHandler)()}
                  sx={{
                    borderRadius: "10px",
                    fontSize: "0.938vw",
                    fontWeight: "700",
                    height: "34px",
                    width: "100%",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  Sign Up
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
                  {t("signup with google account")}
                </Button>
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
                  <Typography variant="subtitle1" sx={{ color: "wood.main" }}>
                    i have an account
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

export default Signup;

Signup.layout = LoginLayout;
