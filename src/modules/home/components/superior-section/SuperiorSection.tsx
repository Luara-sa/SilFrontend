import React from "react";

import { Box, Typography } from "@mui/material";

import { AvatarCustom } from "components/shared";

export const SuperiorSection = () => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", py: "100px" }}>
      <Box sx={{ width: { xs: "100vw", md: "80%" } }}>
        <Typography
          sx={{
            fontSize: [32, 34, 35, "2.344vw", "2.344vw"],
            fontWeight: "700",
            color: "primary.main",
            textAlign: { xs: "center", md: "start" },
          }}
        >
          Superior
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: { xs: "nowrap", md: "wrap" },
            overflowX: { xs: "scroll", md: "hidden" },
            mt: "50px",
            columnGap: "25px",
            rowGap: "40px",
            px: { xs: "40px", md: "0" },
          }}
        >
          {[1, 2, 3, 4].map((person, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",

                maxWidth: "205px",
              }}
            >
              <Box
                sx={{
                  width: { xs: "125px", md: "10.417vw" },
                  height: { xs: "125px", md: "10.417vw" },
                }}
              >
                <AvatarCustom />
              </Box>
              <Typography
                sx={{
                  fontSize: [16, 17, 18, "1.354vw", "1.354vw"],
                  fontWeight: "700",
                  color: "primary.main",
                  mt: "25px",
                }}
              >
                Mohammad Ali
              </Typography>
              <Typography
                sx={{
                  fontSize: [12, 13, 14, "0.938vw", "0.938vw"],
                  textAlign: "center",
                  color: "gray.50",
                  mt: "10px",
                }}
              >
                Outstanding in the training course
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
