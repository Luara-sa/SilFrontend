import React, { useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  capitalize,
  Dialog,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ButtonLoader from "components/custom/ButtonLoader";
import { _StudentRoleService } from "services/studentRole.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { delegateRegisterSchema } from "validation";
import { TextFieldStyled } from "components/styled";
import PasswordInput from "components/custom/PasswordInput";
import { _AuthService } from "services/auth.service";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";

interface Props {
  handleClose: () => void;
  open: boolean;
}

export const BeDelegateRegister = (props: Props) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = useTranslation("course");

  // State for gender select;
  //  because the react-hooks-form does make a rerender to update the value
  const [gender, setGender] = useState<string | null>(null);

  const formOptions = { resolver: yupResolver(delegateRegisterSchema) };
  const { register, handleSubmit, formState, setValue, getValues, reset } =
    useForm(formOptions);
  const { errors } = formState;

  const onSubmit = (input: any) => {
    const data = input;
    delete data.password2;
    setLoading(true);
    _AuthService
      .delegateRegister(data)
      .then((res) => {
        reset();
        props.handleClose();
        router.push("/auth/login");
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  return (
    <Dialog
      open={props.open}
      onClose={() => {
        reset();
        props.handleClose();
      }}
      sx={{
        "& .MuiDialog-paper ": {
          px: "25px",
          pb: "20px",
          pt: "0px",
          backgroundColor: "#FFFEFA",
          maxWidth: "100%",
          minWidth: "290px",
        },
        height: "110%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          columnGap: "15px",
          mt: "25px",
        }}
      >
        <Box
          sx={{
            backgroundImage: theme.palette.bg_header_front.main,
            width: "420px",
            py: "50px",
            px: "40px",
            display: { xs: "none", xl: "flex" },
            flexDirection: "column",
            rowGap: "40px",
            borderRadius: "10px",
          }}
        >
          <Typography
            sx={{ color: "gray.light", fontSize: "30px", fontWeight: 700 }}
          >
            {t("sign up as a delegate")}
          </Typography>
          <Typography sx={{ color: "gray.light", fontSize: "16px" }}>
            Lorem ipsum is placeholder text commonly used in the graphic, print,
            and publishing industries for previewing layouts and visual mockups.
          </Typography>
        </Box>
        <Box
          sx={{
            px: "20px",
            minWidth: "300px",
            width: "32vw",
            py: "20px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              rowGap: "5px",
              width: "100%",
            }}
          >
            <Typography
              sx={{
                display: { xs: "block", xl: "none" },
                color: "primary.main",
                fontSize: "22px",
                fontWeight: 700,
                textAlign: "center",
                textTransform: "capitalize",
              }}
            >
              {t("sign up as a delegate")}
            </Typography>
            <TextFieldStyled
              variant="outlined"
              fullWidth
              placeholder={t("full name")}
              {...register("username")}
              error={Boolean(errors.username?.message)}
              helperText={(errors.username?.message as any) || " "}
            />
            <TextFieldStyled
              variant="outlined"
              fullWidth
              placeholder={t("email")}
              {...register("email")}
              error={Boolean(errors.email?.message)}
              helperText={(errors.email?.message as any) || " "}
            />
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
                  placeholder={t("gender")}
                  error={!!errors.gender?.message}
                  helperText={(errors.gender?.message as string) || " "}
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

            <TextFieldStyled
              variant="outlined"
              fullWidth
              placeholder="ID Number"
              {...register("id_number")}
              error={Boolean(errors.id_number?.message)}
              helperText={(errors.id_number?.message as any) || " "}
            />
            <TextFieldStyled
              {...register("phone")}
              variant="outlined"
              fullWidth
              placeholder={t("mobile number")}
              {...register("phone")}
              error={Boolean(errors.phone?.message)}
              helperText={(errors.phone?.message as any) || " "}
            />
            <PasswordInput
              name="password"
              register={register}
              error={Boolean(errors.password?.message)}
              helpertext={errors.password?.message as any}
            />
            <PasswordInput
              name="password2"
              register={register}
              placeholder={t("confirm password")}
              error={Boolean(errors.password2?.message)}
              helpertext={errors.password2?.message as any}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: { xs: "column", xl: "row" },
              rowGap: { xs: "15px", xl: "0" },
              mt: "20px",
            }}
          >
            <ButtonLoader
              loading={loading}
              disableOnLoading
              onClick={() => handleSubmit(onSubmit)()}
              variant="contained"
              textstyle={{ fontSize: "16px", fontWeight: "700" }}
              sx={{
                color: "fray.light",
                px: "30px",
                borderRadius: "10px",
                backgroundColor: "primary.main",
                padding: "10px 20px",
                width: { xs: "100%", xl: "180px" },
                "&:hover": {
                  backgroundColor: "rgba(30, 91, 99, 0.2)",
                  color: "primary.main",
                },
              }}
            >
              {t("submit")}
            </ButtonLoader>
            <Button
              onClick={() => {
                reset();
                props.handleClose();
              }}
              startIcon={<CancelOutlinedIcon />}
              variant="outlined"
              color="error"
              sx={{
                color: "#FF5252",
                fontSize: "16px",
                fontWeight: "700",
                px: "30px",

                width: { xs: "100%", xl: "180px" },
                borderRadius: "10px",
              }}
            >
              {t("cancel")}
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};
