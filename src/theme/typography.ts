import { Palette } from "@mui/material";
import { TypographyOptions } from "@mui/material/styles/createTypography";

export const typography:
  | TypographyOptions
  | ((palette: Palette) => TypographyOptions)
  | undefined = {
  button: {
    fontWeight: 600,
  },
  fontFamily:
    '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
  h1: {
    fontSize: "30px",
    // fontSize: "1.563vw",
    // lineHeight: "25px",
  },
  h2: {
    fontSize: "26px",
    // fontSize: "1.354vw",
    // lineHeight: "25px",
  },
  h3: {
    fontSize: "20px",
    // fontSize: "1.042vw",
    // lineHeight: "25px",
  },
  h4: {
    fontSize: "18px",
    // fontSize: "0.938vw",
    // lineHeight: "25px",
  },
  subtitle1: {
    fontSize: "16px",
    // fontSize: "0.833vw",
    // lineHeight: "25px",
  },
  subtitle2: {
    fontSize: "14px",
    // fontSize: "0.729vw",
    // lineHeight: "25px",
  },
  body1: {
    fontSize: "12px",
    // fontSize: "0.625vw",
    // lineHeight: "25px",
  },
  body2: {
    fontSize: "10px",
    // fontSize: "0.521vw",
    // lineHeight: "25px",
  },
  caption: {
    fontSize: "8px",
    // fontSize: "0.417vw",
    // lineHeight: "25px",
  },
};
