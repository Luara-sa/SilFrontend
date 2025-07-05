import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { setLocale } from "yup";
import en from "yup/lib/locale";
import { ar } from "yup-locales";

import { Box, MenuItem, Typography } from "@mui/material";

interface Props {
  handleClose: () => void;
}

export const LanguageMenuOptions = (props: Props) => {
  const router = useRouter();

  const handleChange = (lang: "ar" | "en") => {
    lang === "ar" ? setLocale(ar) : setLocale(en);
    // router.push(
    //   {
    //     pathname: router.pathname,
    //     query: router.query,
    //   },
    //   router.asPath,
    //   { locale: lang }
    // );
    // i18n.changeLanguage(lang);
    props.handleClose();
  };
  return (
    <>
      <Link
        href={{
          pathname: router.pathname,
          query: router.query,
        }}
        locale="en"
      >
        <MenuItem
          onClick={() => handleChange("en")}
          disableRipple
          sx={{
            display: "flex",
            columnGap: "15px",
            backgroundColor: router.locale === "en" ? "#EFEFEF" : "",
          }}
        >
          <Box
            sx={{
              width: "30px",
              height: "30px",
              position: "relative",
              border: router.locale === "en" ? "2px solid " : "none",
              borderColor: "wood.main",
              borderRadius: "50%",
            }}
          >
            <Image
              src="/assets/icons/uk-flag.svg"
              layout="fill"
              objectFit="cover"
              loading="lazy"
            />
          </Box>
          <Typography
            sx={{
              color: "gray.50",
              fontSize: [12, 12, 15, "1.042vw", "1.042vw"],
            }}
          >
            English
          </Typography>
        </MenuItem>
      </Link>
      <Link
        href={{
          pathname: router.pathname,
          query: router.query,
        }}
        locale="ar"
      >
        <MenuItem
          onClick={() => handleChange("ar")}
          disableRipple
          sx={{
            display: "flex",
            columnGap: "15px",
            backgroundColor: router.locale === "ar" ? "#EFEFEF" : "",
          }}
        >
          <Box
            sx={{
              width: "30px",
              height: "30px",
              position: "relative",
              border: router.locale === "ar" ? "2px solid " : "none",
              borderColor: "wood.main",
              borderRadius: "50%",
            }}
          >
            <Image
              src="/assets/icons/sa-flag.svg"
              layout="fill"
              objectFit="cover"
              loading="lazy"
            />
          </Box>
          <Typography
            sx={{
              color: "gray.50",
              fontSize: [12, 12, 15, "1.042vw", "1.042vw"],
            }}
          >
            Arabic
          </Typography>
        </MenuItem>
      </Link>
    </>
  );
};
