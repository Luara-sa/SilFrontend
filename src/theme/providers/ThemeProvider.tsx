import React, { FC } from "react";

import { ThemeProvider } from "@mui/material/styles";
import { themeUI } from "theme/index";

interface ThemeProviderWraperProps {
  children: any;
}

export const ThemeProviderWraper: FC<ThemeProviderWraperProps> = ({
  children,
}) => {
  return <ThemeProvider theme={themeUI}>{children}</ThemeProvider>;
};
