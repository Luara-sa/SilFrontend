import { OutlinedInputProps, TextField, TextFieldProps } from "@mui/material";
import { styled } from "@mui/material/styles";

export const TextFieldStyled = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-input ": {
    padding: "9px 14px",
    fontSize: "16px",
    "&::placeholder": {
      color: theme.palette.gray.main,
      fontSize: "16px",
      fontWeight: "500",
    },
    borderRadius: "5px !important",
    backgroundColor: theme.palette.gray.active,
    borderColor: "red",
    // boxShadow: "inset 0px 1px 2px rgba(0, 0, 0, 0.1)",
  },
  "&:hover": {
    borderColor: theme.palette.text.primary,
  },
  "& .MuiInputBase-formControl ": {
    borderRadius: "5px !important",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    "&:hover": {
      borderColor: theme.palette.text.primary,
    },
  },
  "& .MuiFormHelperText-root ": {
    fontSize: "12px",
  },
}));
