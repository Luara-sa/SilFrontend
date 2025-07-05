// import { ThemeOptions } from "@mui/material";
import {
  createTheme as createMuiTheme,
  responsiveFontSizes,
} from "@mui/material/styles";
import { lightColors } from "./colors";
import { components } from "./components";
import { typography } from "./typography";

interface PaletteColor {
  main?: string;
  dark?: string;
  light?: string;
  active?: string;
  50?: string;
  100?: string;
  // 200?: string;
  // 300?: string;
  // 500?: string;
  // 600?: string;
  // 700?: string;
  // 900?: string;
}

declare module "@mui/material/styles" {
  interface Palette {
    wood: PaletteColor;
    gray: PaletteColor;
    bg_header_front: PaletteColor;
    bg_header_back: PaletteColor;
    gr_header: PaletteColor;
    gr: PaletteColor;
    haa: PaletteColor;
    bg_body: PaletteColor;

    //
    orange: PaletteColor;
    textColor: PaletteColor;
    card: PaletteColor;
    borderColor: PaletteColor;
    linkColor: PaletteColor;
  }
  interface PaletteOptions {
    wood: PaletteColor;
    gray: PaletteColor;
    bg_header_front: PaletteColor;
    bg_header_back: PaletteColor;
    gr_header: PaletteColor;
    gr: PaletteColor;
    haa: PaletteColor;
    bg_body: PaletteColor;

    //
    orange: PaletteColor;
    textColor: PaletteColor;
    card: PaletteColor;
    borderColor: PaletteColor;
    linkColor: PaletteColor;
  }
  interface BreakpointOverrides {
    xs: true; // removes the `xs` breakpoint
    sm: true;
    md: true;
    lg: true;
    xl: true;
    // mobile: true; // adds the `mobile` breakpoint
    // tablet: true;
    // laptop: true;
    // desktop: true;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    error: true;
    success: true;
    primary: true;
    main: true;
    light: true;
    default: true;
  }

  interface ButtonPropsColorOverrides {
    error: true;
    success: true;
    primary: true;
    main: true;
    light: true;
    default: true;
  }
}

declare module "@mui/material/Tabs" {
  interface TabsPropsVariantOverrides {
    custom: true;
  }
}

export const themeUI = (props: any) => {
  const theme = createMuiTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 576,
        md: 768,
        lg: 992,
        xl: 1200,
      },
    },
    components: components,
    palette: { ...lightColors, background: {} },
    direction: props.direction,
    typography: typography,
    shape: {
      borderRadius: 8,
    },
    zIndex: {
      appBar: 1200,
      drawer: 1100,
    },
  });
  return theme;
};
