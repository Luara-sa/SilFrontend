import React, { useState } from "react";

import useTranslation from "next-translate/useTranslation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import { Box, Button, Dialog, Typography } from "@mui/material";

import { _StudentRoleService } from "services/studentRole.service";
import { testStore } from "store/testStore";

import ButtonLoader from "components/custom/ButtonLoader";
import { TextFieldStyled } from "components/styled";

interface Props {
  handleClose: () => void;
  open: boolean;
  onSuccess: () => void | undefined;
}

export const ExperimentalPopup = (props: Props) => {
  const [loading, setLoading] = useState(false);

  const [test, answers] = testStore((state) => [state.test, state.answers]);

  const validationSchema = Yup.object().shape({
    test_city: Yup.string().required().label("Address"),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState, setValue, getValues } =
    useForm(formOptions);
  const { errors } = formState;

  const { t } = useTranslation("test");

  const onSubmit = async (input: any) => {
    setLoading(true);
    _StudentRoleService
      .userPassedTest({
        test_id: test?.id,
        answers: answers,
        test_city: input.test_city,
      })
      .then((res) => {
        props.handleClose();
        props.onSuccess();
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      sx={{
        "& .MuiDialog-paper ": {
          px: "22px",
          pb: "30px",
          backgroundColor: "#FFFEFA",
          width: "35vw",
          minWidth: "290px",
        },
      }}
    >
      <Box>
        <Typography
          sx={{
            mt: "15px",
            fontSize: "22px",
            fontWeight: "700",
            color: "primary.main",
          }}
        >
          {t("exprimental")}
        </Typography>
        <Box sx={{ mt: "20px" }}>
          <TextFieldStyled
            variant="outlined"
            fullWidth
            placeholder="Address"
            {...register("test_city")}
            error={Boolean(errors.test_city?.message)}
            helperText={(errors.test_city?.message as any) || ""}
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          columnGap: "15px",
          mt: "25px",
        }}
      >
        <ButtonLoader
          loading={loading}
          disableOnLoading
          onClick={() => handleSubmit(onSubmit)()}
          endIcon={!loading && <img src="/assets/icons/send-icon.svg" />}
          variant="contained"
          textstyle={{ fontSize: "16px", fontWeight: "700" }}
          sx={{
            color: "gray.active",
            px: "30px",
            borderRadius: "10px",
            "&:hover": {
              color: "gray.active",
            },
          }}
        >
          {t("submit")}
        </ButtonLoader>
      </Box>
    </Dialog>
  );
};
