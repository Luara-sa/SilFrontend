import * as React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import { OutlinedInputProps, Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { FieldValues, UseFormRegister } from "react-hook-form";

interface State {
  showPassword: boolean;
}

interface Props extends OutlinedInputProps {
  helpertext?: string;
  register: UseFormRegister<FieldValues>;
  name: string;
  handleChange: (e: any) => void;
}

export const AccountPasswordInput = (props: Props) => {
  const { register, ...rest } = props;
  const [values, setValues] = React.useState<State>({
    showPassword: false,
  });

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  return (
    <FormControl sx={{}} fullWidth variant="outlined">
      <OutlinedInput
        id="outlined-adornment-password"
        type={values.showPassword ? "text" : "password"}
        {...register(props.name, {
          onChange: (e) => props.handleChange(e),
        })}
        {...rest}
        // value={values.password}
        // onChange={handleChange("password")}
        placeholder={props.placeholder ? props.placeholder : "Password"}
        fullWidth
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {values.showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        sx={{
          backgroundColor: "gray.active",
          fontSize: "16px",
          "& .MuiInputBase-input ": {
            padding: "9px 14px",
          },

          "& input::placeholder": {
            color: "gray.main",
          },
        }}
      />
      {/* Because the MUI helperText take place if it's (" ")  */}
      {props.helpertext ? (
        <Typography sx={{ color: "#d32f2f", fontSize: "12px", ml: "15px" }}>
          {props.helpertext}
        </Typography>
      ) : (
        <Typography sx={{ visibility: "hidden" }}></Typography>
      )}
    </FormControl>
  );
};
