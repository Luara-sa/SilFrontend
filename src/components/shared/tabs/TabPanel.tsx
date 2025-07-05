import { Box, SxProps, Theme } from "@mui/material";
import React from "react";

interface TabPanelProps {
  children?: React.ReactNode;
  index: string;
  value: string;
  sx?: SxProps<Theme> | undefined;
}
export const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, sx, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{ width: "100%" }}
      {...other}
    >
      {value === index && <Box sx={{ p: 3, ...sx }}>{children}</Box>}
    </div>
  );
};
