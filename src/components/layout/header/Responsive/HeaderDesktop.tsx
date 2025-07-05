import React from "react";
import Image from "next/image";
import Link from "next/link";

import useTranslation from "next-translate/useTranslation";

import { Box, Button, Typography } from "@mui/material";

import { useMe } from "hooks/useMe";

import { CategoriesMenu } from "../CategoriesMenu/CategoriesMenu";
import { PlacementTestButton } from "../placement-test/PlacementTestButton";
import { LanguageMenuAction } from "../Language-menu/LanguageMenuAction";
import { NotificationButton } from "../notification-button/NotificationButton";
import { ProfileMenuAction } from "../ProfileMenu/ProfileMenuAction";
import Notification from "components/layout/FireBaseSnack";
import SearchInput from "components/custom/SearchInput";

export const HeaderDesktop = () => {
  const { isLogged } = useMe();
  const { t } = useTranslation("header");

  return (
    <Box
      sx={{
        height: "80px",
        display: "flex",
        alignItems: "center",
        px: "7.656vw",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
        position: "sticky",
        top: "0",
        backgroundColor: "#fff",
        zIndex: "10000",
      }}
    >
      <Notification />
      <Link href="/">
        <Box
          sx={{
            width: "97px",
            mr: 3,
            cursor: "pointer",
            position: "relative",
            height: "60px",
          }}
        >
          <Image
            src="/assets/images/logo.svg"
            alt=""
            layout="fill"
            loading="lazy"
            unoptimized={true}
            objectFit="cover"
          />
        </Box>
      </Link>
      <Box
        sx={{
          // display: { xl: "flex", xs: "none" },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <CategoriesMenu />
        <Link href="/courses">
          <Typography
            sx={{
              cursor: "pointer",
              fontSize: ["1.042vw", "1.042vw"],
              fontWeight: "700",
              color: "gray.50",
            }}
          >
            {t("courses")}
          </Typography>
        </Link>
        <Link href="/contact-us">
          <Typography
            sx={{
              cursor: "pointer",
              fontSize: ["1.042vw", "1.042vw"],
              fontWeight: "700",
              color: "gray.50",
            }}
          >
            {t("contact us")}
          </Typography>
        </Link>

        <Box sx={{ width: "280px" }}>
          <SearchInput />
          {/* <Button
          variant="primary"
          sx={{ minWidth: "10px" }}
          onClick={handleClick}
        >
          <MoreHorizIcon />
        </Button> */}
        </Box>
        <PlacementTestButton />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            columnGap: "10px",
          }}
        >
          <Box>
            <LanguageMenuAction />
          </Box>
          {isLogged ? (
            <>
              <NotificationButton />
              <ProfileMenuAction />
            </>
          ) : (
            <Link href="/auth/login">
              <Button variant="contained" color="primary" sx={{ px: "25px" }}>
                {t("login")}
              </Button>
            </Link>
          )}
        </Box>
      </Box>
    </Box>
  );
};
