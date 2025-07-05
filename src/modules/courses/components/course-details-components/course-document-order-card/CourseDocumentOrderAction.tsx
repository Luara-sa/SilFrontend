import React, { useEffect, useMemo, useState } from "react";

import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import {
  Autocomplete,
  Box,
  Button,
  capitalize,
  Dialog,
  TextField,
  Typography,
} from "@mui/material";

import { meStore } from "store/meStore";
import { useMe } from "hooks/useMe";
import { _WithAuthService } from "services/withAuth.service";
import { courseStore } from "store/courseStore";

import { TextFieldStyled } from "components/styled/TextFiled";
import ButtonLoader from "components/custom/ButtonLoader";

import CloseIcon from "@mui/icons-material/Close";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import useTranslation from "next-translate/useTranslation";
import { eventEmitter } from "services/eventEmitter";

export const CourseDocumentOrderAction = () => {
  // const [me] = meStore((state) => [state.me]);
  const { info_system, me } = useMe();
  const [course] = courseStore((state) => [state.course]);

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);

  const validationSchema = Yup.object().shape({
    nationality: Yup.string().required(),
    document_type: Yup.string().required().label("document type"),
    to: Yup.string().required(),
  });
  const { t } = useTranslation("course");

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState, setValue, resetField } =
    useForm(formOptions);
  const { errors } = formState;

  const LoginHandler = (input: any) => {
    setLoading(true);

    _WithAuthService
      .createDocumentRequest({
        ...input,
        course_id: course?.course_id,
        user_id: me?.id ?? "",
        from_date: course?.start_date,
        to_date: course?.end_date,
      })
      .then((res) => {
        handleClose();
        eventEmitter.emit("enqueueSnackbar", {
          message: "The document was sent to your e-mail successfully.",
          // res?.message
          variant: "success",
          snack: {
            autoHideDuration: 3000,
            preventDuplicate: true,
          },
        });
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    resetField("nationality");
    resetField("to");
    resetField("document_type");
    setOpen(false);
  };

  const DocumentTypeOptions = useMemo(
    () =>
      course?.order
        ? [
            ...Object.keys(info_system?.document_type_enum).map((key) => ({
              label: info_system?.document_type_enum[key],
              value: key,
            })),
          ]
        : [
            {
              label: Object.values(info_system?.document_type_enum)[0],
              value: Object.keys(info_system?.document_type_enum)[0],
            },
          ],
    [info_system?.document_type_enum, course?.order]
  );

  // useEffect(() => {
  //   console.log(info_system?.document_type_enum);
  //   return () => {};
  // }, [info_system?.document_type_enum]);

  return (
    <>
      <Button
        onClick={handleOpen}
        variant="contained"
        endIcon={<WorkspacePremiumOutlinedIcon />}
        sx={{ px: "30px" }}
      >
        {t("order")}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiDialog-paper ": {
            px: "40px",
            py: "20px",
            backgroundColor: "#FFFEFA",
            maxWidth: "100%",
            minWidth: "290px",
            width: "35vw",
          },
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{
                fontSize: "22px",
                color: "primary.main",
                fontWeight: "700",
              }}
            >
              {t("order")}
            </Typography>
            <Box onClick={handleClose} sx={{ cursor: "pointer" }}>
              <CloseIcon />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              rowGap: "20px",
              mt: "30px",
            }}
          >
            <TextFieldStyled
              variant="outlined"
              fullWidth
              placeholder={t("nationality")}
              {...register("nationality")}
              error={Boolean(errors.nationality?.message)}
              helperText={(errors.nationality?.message as any) || ""}
            />
            {info_system?.document_type_enum && (
              <Autocomplete
                disablePortal
                onChange={(e: any, newValue: any) => {
                  setValue("document_type", newValue.value.slice(3), {
                    shouldValidate: true,
                  });
                }}
                getOptionLabel={(option) => {
                  return option?.label.split("_").join(" ");
                }}
                options={DocumentTypeOptions}
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
                    id="document_type"
                    name="document_type"
                    placeholder={t("document type")}
                    error={!!errors.document_type?.message}
                    helperText={errors.document_type?.message as string}
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
            )}
            <TextFieldStyled
              variant="outlined"
              fullWidth
              placeholder={t("to")}
              {...register("to")}
              error={Boolean(errors.to?.message)}
              helperText={(errors.to?.message as any) || ""}
              sx={{
                "& .MuiInputBase-multiline ": { padding: 0 },
              }}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", mt: "35px" }}>
            <ButtonLoader
              onClick={() => handleSubmit(LoginHandler)()}
              variant="contained"
              loading={loading}
              endIcon={<img src="/assets/icons/send-icon.svg" />}
              sx={{ backgroundColor: "secondary.main" }}
              textstyle={{ fontSize: "19px", fontWeight: "700" }}
            >
              {t("submit")}
            </ButtonLoader>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};
