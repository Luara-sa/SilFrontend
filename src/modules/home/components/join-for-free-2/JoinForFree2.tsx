import React from "react";
import Image from "next/image";

import { Box, Button, Typography, useTheme } from "@mui/material";
import useTranslation from "next-translate/useTranslation";

export const JoinForFree2 = () => {
  const theme = useTheme();
  const { t } = useTranslation("home");
  return (
    <Box
      sx={{
        background: `linear-gradient(270deg, #CBFFE8 0%, #E9FCFF 100%)`,
        height: { sx: "auto", md: "550px" },
        minHeight: { xs: "auto", md: "550px" },
        py: { xs: "30px", md: "100px" },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "80%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: { sx: "auto", md: "550px" },
        }}
      >
        <Box
          sx={{
            width: { xs: "73.660vw", md: "50%" },
            ml: { xs: "0", md: "50px" },
          }}
        >
          <Typography
            sx={{
              fontSize: [14, 15, 20, 25, "1.563vw"],
              color: "primary.main",
              fontWeight: "500",
            }}
          >
            {t("join")}
          </Typography>
          <Button
            variant="contained"
            color="warning"
            sx={{ mt: { xs: "20px", md: "35px" }, color: "primary.main" }}
          >
            <Typography
              sx={{
                fontWeight: "700",
                p: "5px 10px",
                fontSize: [16, 17, 18, 19, 19],
              }}
            >
              {t("join for free")}
            </Typography>
          </Button>
        </Box>
        <Box
          sx={{
            position: "relative",
            width: "380px",
            height: "90%",
            alignSelf: "end",
            display: { xs: "none", md: "block" },
          }}
        >
          <Image
            src="/assets/images/student-img-2.png"
            layout="fill"
            objectFit="contain"
            alt="student"
            objectPosition="bottom"
          />
        </Box>
      </Box>
    </Box>
  );
};
