import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import useTranslation from "next-translate/useTranslation";

import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Typography,
} from "@mui/material";

import { useMe } from "hooks/useMe";

import { ProfileMenuAction } from "../ProfileMenu/ProfileMenuAction";
import { CategoriesMenu } from "../CategoriesMenu/CategoriesMenu";
import { PlacementTestButton } from "../placement-test/PlacementTestButton";
import { LanguageMenuAction } from "../Language-menu/LanguageMenuAction";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";

export const HeaderMobile = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const { isLogged } = useMe();
  const { t } = useTranslation("header");
  const handleClick = () => {
    setDrawerOpen((prev) => !prev);
  };
  const handleClose = () => {
    setDrawerOpen(false);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "80px",
        backgroundColor: "#FFFFFF",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 16px 10px 16px",
        alignItems: "center",
      }}
    >
      <Box>
        <IconButton
          onClick={() => handleClick()}
          sx={{
            width: "40px",
            height: "40px",
            backgroundColor: "rgba(203, 167, 112, 0.15)",
            boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.25)",
            borderRadius: "5px",
          }}
        >
          <MoreVertIcon />
        </IconButton>
        <Drawer open={drawerOpen} onClose={() => handleClose()}>
          <Box
            sx={{
              width: "280px",
              height: "903px",
              px: "1rem",
              paddingTop: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              backgroundColor: "#FFFEFA",
              boxShadow: "-2px 2px 10px rgba(0, 0, 0, 0.25)",
              borderRadius: "15px 0px 0px 15px",
            }}
          >
            <Box sx={{ width: "100%" }}>
              <IconButton
                onClick={() => handleClose()}
                sx={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "rgba(203, 167, 112, 0.15)",
                  boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.25)",
                  borderRadius: "5px",
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            {isLogged ? (
              <>
                <ProfileMenuAction />
              </>
            ) : (
              <Link href="/auth/login">
                <Button variant="contained" color="primary" sx={{ px: "25px" }}>
                  {t("login")}
                </Button>
              </Link>
            )}
            <Divider sx={{ borderColor: "#E0E0E0" }} />
            <CategoriesMenu />
            <Divider sx={{ borderColor: "#E0E0E0" }} />
            <Link href="/courses">
              <Typography
                sx={{
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "gray.50",
                  alignSelf: "center",
                }}
              >
                {t("courses")}
              </Typography>
            </Link>
            <Link href="/contact-us">
              <Typography
                sx={{
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "gray.50",
                  alignSelf: "center",
                }}
              >
                {t("contact us")}
              </Typography>
            </Link>
            <Divider sx={{ borderColor: "#E0E0E0" }} />
            <PlacementTestButton />
            <Divider sx={{ borderColor: "#E0E0E0" }} />
            <Typography
              sx={{ fontSize: "16px", fontWeight: "700", color: "#555555" }}
            >
              {t("languages")} :
            </Typography>
            <LanguageMenuAction />
          </Box>
        </Drawer>
      </Box>
      <Link href="/">
        <Box
          sx={{
            width: "97px",
            cursor: "pointer",
            position: "relative",
            height: "100%",
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
    </Box>
  );
};
