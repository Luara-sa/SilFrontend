import { styled } from "@mui/material/styles";
import { FormControlLabel } from "@mui/material";

export const CheckBoxStyled = styled(FormControlLabel)(({ theme }) => ({
  "& .MuiFormControlLabel-label": {
    fontSize: "12px",
    fontWeight: "600",
  },
}));
