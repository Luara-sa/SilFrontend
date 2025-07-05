import React from "react";
import Image from "next/image";
import useTranslation from "next-translate/useTranslation";

import { Box, Button, Typography, useTheme } from "@mui/material";
import { HeroCard } from "../hero-card/HeroCard";
import { useRouter } from "next/router";
import Link from "next/link";

export const HeroSection = () => {
  const theme = useTheme();

  const { t } = useTranslation("home");
  const { locale } = useRouter();

  return (
    <Box
      sx={{
        background: theme.palette.bg_body?.main,
        display: "flex",
        flexDirection: { xs: "column-reverse", lg: "row" },
        height: { xs: "80vh", lg: "70vh" },
        minHeight: "600px",
        pb: { xs: "35px", lg: 0 },
      }}
    >
      <Box
        sx={{
          flex: "0.5",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "80%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: { xs: "center", md: "start" },
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "32px", md: "42px" },
              fontWeight: "700",
              lineHeight: { xs: "35px", lg: "70px" },
              color: "primary.main",
              textTransform: "uppercase",
              // textAlign: { xs: "center", lg: "start" },
            }}
          >
            {t("inistitute")}
          </Typography>
          <Typography
            sx={{
              fontSize: [16, 17, 18, "1.042vw", "1.042vw"],
              color: "#888888",
              mt: "15px",
              lineHeight: "35px",
              textAlign: { xs: "center", lg: "start" },
            }}
          >
            {t("lorem")}
          </Typography>
          <Box
            sx={{
              width: "100%",
              mt: "50px",
              display: "flex",
              justifyContent: "start",
            }}
          >
            <Link href={`/courses`}>
              <Button
                variant="contained"
                sx={{ fontSize: ["3.839vw", "4.439vw", 19, 19, 19] }}
              >
                {t("explore courses")}
              </Button>
            </Link>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          position: "relative",
          flex: "0.5",
          width: "100%",
          backgroundImage: "url(/assets/images/hero-section-bg.svg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: { xs: "93%", lg: "90%" },
          backgroundPosition: {
            xs: "bottom -90px center",
            lg: "bottom -150px left",
          },
        }}
      >
        {/* <Image src={`/assets/images/hero-section-bg.svg`} /> */}
        <Box
          sx={{
            position: "absolute",
            left: { xs: "53%", md: locale === "ar" ? "-5rem" : "0" },
            top: { xs: "45%", md: "20%" },
          }}
        >
          <HeroCard
            title={t("e-learninig")}
            desc={t("e-learning content")}
            icon={
              <Image
                src="/assets/icons/learning.svg"
                width="60"
                height="60"
                alt="E-Learning"
              />
            }
          />
        </Box>
        <Box
          sx={{
            position: "absolute",
            right: { xs: "50%", md: "5%" },
            bottom: { xs: "2%", md: "20%" },
          }}
        >
          <HeroCard
            title={t("e-learninig")}
            desc={t("e-learning content")}
            icon={
              <Image
                src="/assets/icons/distance.svg"
                width="60"
                height="60"
                alt="E-Learning"
              />
            }
          />
        </Box>
      </Box>
    </Box>
  );
};
