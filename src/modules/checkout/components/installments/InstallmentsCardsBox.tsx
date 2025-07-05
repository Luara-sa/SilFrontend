import React from "react";

import { Box } from "@mui/material";

interface Props {
  children: React.ReactNode;
}

export const InstallmentsCardsBox = ({ children }: Props) => {
  return (
    <Box
      sx={{
        display: "flex",
        columnGap: "10px",
        overflowX: "scroll",
        mt: "10px",
        "::-webkit-scrollbar": {
          //   width: "5px",
          height: "5px",
        },

        "::-webkit-scrollbar:hover ::-webkit-scrollbar-thumb": {
          backgroundColor: "#1e5b63",
          //   width: "5px",
        },

        "::-webkit-scrollbar-track": {
          backgroundColor: "#ffff",
          height: "5px",
        },

        "::-webkit-scrollbar-thumb": {
          backgroundColor: "#aaaaaa",
          borderRadius: "15px",
          height: "5px",
        },
      }}
    >
      {children}
    </Box>
  );
};
