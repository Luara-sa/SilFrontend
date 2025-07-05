import React from "react";
import Image from "next/image";

import { Box, Button, Typography, useTheme } from "@mui/material";
import useTranslation from "next-translate/useTranslation";

export const JoinForFree1 = () => {
  const theme = useTheme();
  const { t } = useTranslation("home");

  return (
    <Box sx={{ background: "url('/assets/images/home/chares.png')" }}>
      <Box
        sx={{
          background:
            "linear-gradient(180deg, rgba(11, 129, 145,0.9) 0%, rgba(30, 91, 99,0.9) 100%)",
          height: { sx: "auto", md: "600px" },
          minHeight: { xs: "auto", md: "600px" },
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
            height: { sx: "auto", md: "600px" },
          }}
        >
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              position: "relative",
              width: "300px",
              height: "80%",
              alignSelf: "end",
            }}
          >
            <Image
              src="/assets/images/student-img-1.png"
              layout="fill"
              objectFit="contain"
              alt="student"
              objectPosition="bottom"
            />
          </Box>
          <Box
            sx={{
              width: { xs: "73.660vw", md: "50%" },
              ml: { xs: "0", md: "50px" },
            }}
          >
            <Typography
              sx={{
                fontSize: [14, 15, 20, 25, "1.563vw"],
                color: "gray.active",
                fontWeight: 500,
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
                  fontSize: [16, 17, 18, 19, 19],
                  fontWeight: "700",
                  p: "5px 10px",
                }}
              >
                {t("join for free")}
              </Typography>
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
