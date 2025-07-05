import React from "react";
import Image from "next/image";

import { Box, Typography } from "@mui/material";
import useTranslation from "next-translate/useTranslation";

export const DownloadApp = () => {
  const { t } = useTranslation("home");
  return (
    <Box
      sx={{
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "warning.main",
        py: { xs: "25px", md: "60px" },
      }}
    >
      <Box
        sx={{
          width: "80%",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          rowGap: "10px",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: [12, 18, 22, 30, 36],
              fontWeight: "700",
              color: "primary.main",
            }}
          >
            {t("download app")}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", columnGap: "30px" }}>
          <Box
            sx={{
              cursor: "pointer",
              width: { md: "180px", xs: "103px" },
              height: { md: "52px", xs: "30px" },
              position: "relative",
            }}
          >
            <Image
              src="/assets/images/apple-store.svg"
              layout="fill"
              objectFit="contain"
              alt="apple store"
              objectPosition="bottom"
            />
          </Box>
          <Box
            sx={{
              cursor: "pointer",
              width: { md: "180px", xs: "103px" },
              height: { md: "52px", xs: "30px" },
              position: "relative",
            }}
          >
            <Image
              src="/assets/images/google-play.svg"
              layout="fill"
              objectFit="contain"
              alt="Google play"
              objectPosition="bottom"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
