import { Box, useTheme } from "@mui/material";
import React from "react";
import { Footer } from "./footer/Footer";
import { Header } from "./header/Header";

export const Layout = ({ children }: { children: any }) => {
  const theme = useTheme();
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box sx={{ background: theme.palette.bg_body.main }}>{children}</Box>
      <Footer />
    </Box>
  );
};
