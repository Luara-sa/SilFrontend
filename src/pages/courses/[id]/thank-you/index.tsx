import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { Box, Button, Typography, useTheme } from "@mui/material";

import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { useMe } from "hooks/useMe";
import useTranslation from "next-translate/useTranslation";

const ThankYou = () => {
  const { me } = useMe();
  const { t } = useTranslation("course");
  const router = useRouter();

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        minHeight: "720px",
        backgroundImage: "url(/assets/images/thankyou-bg.png)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: { xs: "95%", md: "80%", xl: "40vw" },
          "& p": {
            textAlign: "center",
          },
        }}
      >
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <TaskAltOutlinedIcon
            sx={{
              color: "warning.main",
              width: { xs: "120px", md: "160px" },
              height: { xs: "120px", md: "160px" },
            }}
          />
        </Box>
        <Typography
          sx={{
            color: "warning.main",
            fontSize: { xs: "40px", md: "60px" },
            fontWeight: "900",
          }}
        >
          {t("woohoo")} !
        </Typography>
        <Typography
          sx={{
            color: "warning.main",
            fontSize: { xs: "30px", md: "55px" },
            fontWeight: "700",
          }}
        >
          {t("thank you")} {me?.username}
        </Typography>
        <Typography
          sx={{
            color: "gray.active",
            fontSize: { xs: "20px", md: "32px" },
            fontWeight: "500",
            mt: "20px",
          }}
        >
          {t("thank you massage")}
        </Typography>
        <Typography
          sx={{
            color: "gray.active",
            fontSize: { xs: "18px", md: "30px" },
            fontWeight: "300",
            mt: "15px",
          }}
        >
          {t("lets start massage")}
        </Typography>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            mt: "25px",
          }}
        >
          <Link href={`/courses/${router.query.id}/lesson`}>
            <Button
              endIcon={<ArrowForwardOutlinedIcon />}
              sx={{
                color: "primary.main",
                backgroundColor: "warning.main",
                fontSize: "17px",
                fontWeight: "700",
                px: "50px",
                ":hover": { backgroundColor: "#d39e00" },
              }}
            >
              {t("lets start")}
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default ThankYou;
