import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import * as Yup from "yup";

import { Box, Button, Typography } from "@mui/material";

import { TextFieldStyled } from "components/styled/TextFiled";
import { Seo } from "components/shared";

import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import ButtonLoader from "components/custom/ButtonLoader";
import { _WithoutAuthService } from "services/withoutAuth.service";
import { eventEmitter } from "services/eventEmitter";

const defaultFormValues = {
  name: "",
  email: "",
  description: "",
};

const ContactUS = () => {
  const router = useRouter();

  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string().email().required(),
    description: Yup.string().required(),
  });

  const formOptions = {
    resolver: yupResolver(validationSchema),
    defaultValues: { defaultFormValues },
  };
  const { register, handleSubmit, formState, reset } = useForm(formOptions);
  const { errors } = formState;

  const onSubmit = (input: any) => {
    setIsSubmitLoading(true);
    _WithoutAuthService
      .contactUs(input)
      .then((res: any) => {
        reset(defaultFormValues);
        eventEmitter.emit("enqueueSnackbar", {
          message: "Email Sent Successfuly",
          variant: "success",
          snack: {
            autoHideDuration: 3000,
            preventDuplicate: true,
          },
        });
      })
      .catch((err) => console.log(err))
      .finally(() => setIsSubmitLoading(false));
  };

  return (
    <>
      <Seo title="SIL | Contact Us" />
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
              width: { xs: "95vw", xl: "62vw" },
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
                display: { xs: "none", md: "block" },
              }}
            >
              <Box
                sx={{
                  minHeight: "530px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography
                  sx={{
                    color: "gray.active",
                    fontWeight: "700",
                    fontSize: "30px",
                  }}
                >
                  Get in touch
                </Typography>
                <Box sx={{ mt: "20px" }}>
                  <Typography
                    sx={{
                      fontSize: "16px",
                      color: "wood.main",
                      //  mt: "20vh"
                    }}
                  >
                    In diam consequat nec eu. Eu sem nec vel, sollicitudin ipsum
                    viverra sed nibh amet. Nunc, et pharetra, duis tortor dictum
                    nisl. Id vestibulum tincidunt adipiscing gravida risus.
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                flex: { xs: "1", md: "0.6" },
                px: "5vw",
                py: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  mb: "20px",
                  display: { xs: "block", md: "none" },
                }}
              >
                <Typography
                  sx={{
                    color: "primary.main",
                    fontSize: "30px",
                    fontWeight: "700",
                  }}
                >
                  Get in touch
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  columnGap: "20px",
                }}
              >
                <TextFieldStyled
                  variant="outlined"
                  fullWidth
                  placeholder="Full Name"
                  {...register("name")}
                  error={Boolean(errors.name?.message)}
                  helperText={(errors.name?.message as any) || ""}
                />
                <TextFieldStyled
                  variant="outlined"
                  fullWidth
                  placeholder="Email"
                  {...register("email")}
                  error={Boolean(errors.email?.message)}
                  helperText={(errors.email?.message as any) || ""}
                />
              </Box>
              <Box
                sx={{
                  width: "100%",
                  postion: "relative",
                  mt: "20px",
                }}
              >
                <TextFieldStyled
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={10}
                  placeholder="Description"
                  {...register("description")}
                  error={Boolean(errors.description?.message)}
                  helperText={(errors.description?.message as any) || ""}
                  sx={{
                    "& .MuiInputBase-multiline ": { padding: 0 },
                  }}
                />
              </Box>
              <Box sx={{ width: "100%", mt: "40px" }}>
                <ButtonLoader
                  loading={isSubmitLoading}
                  disableOnLoading
                  variant="contained"
                  onClick={() => handleSubmit(onSubmit)()}
                  sx={{
                    height: "45px",
                    borderRadius: "10px",
                    fontSize: { xs: "14px", md: "19px" },
                    fontWeight: "700",
                    // height: "34px",
                    width: "100%",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  Send
                </ButtonLoader>
                <Button
                  startIcon={<CallOutlinedIcon />}
                  variant="contained"
                  sx={{
                    mt: "20px",
                    backgroundColor: "warning.main",
                    color: "#000",
                    borderRadius: "10px",
                    fontSize: { xs: "14px", md: "19px" },
                    fontWeight: "700",
                    height: "45px",
                    width: "100%",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
                    ":hover": {
                      backgroundColor: "#ffca2b",
                    },
                  }}
                >
                  Call Us
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ContactUS;
