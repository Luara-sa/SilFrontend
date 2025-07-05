import {
  OutlinedInputProps,
  TextField,
  TextFieldProps,
  OutlinedInput,
} from "@mui/material";
import { styled } from "@mui/material/styles";

export const TextFieldWithIconStyled = styled(OutlinedInput)(({ theme }) => ({
  "& .MuiInputBase-input ": {
    padding: "10px 14px",
    fontSize: "16px",
    "&::placeholder": {
      color: theme.palette.gray.main,
      fontSize: "16px",
      fontWeight: "500",
    },
    borderRadius: "5px !important",
    backgroundColor: theme.palette.gray.active,
    borderColor: "#D9D9D9",
    boxShadow: "inset 0px 1px 2px rgba(0, 0, 0, 0.1)",
  },
  "&:hover": {
    borderColor: theme.palette.text.primary,
  },
  "& .MuiOutlinedInput-notchedOutline": {
    // borderColor: theme.palette.borderColor.main,
    "&:hover": {
      borderColor: theme.palette.text.primary,
    },
  },
}));
