import React, { memo, useEffect } from "react";
import Image from "next/image";

import { Box, Typography } from "@mui/material";

import { accountsColors } from "helper/accountsColors";

import { useMe } from "hooks/useMe";
import { dateToString } from "helper/dateToString";
import useTranslation from "next-translate/useTranslation";

export const ProfileHero = memo(() => {
  const { me, isDelegate } = useMe();
  const { t } = useTranslation("profile");

  // Get display name - prefer first_name + last_name, fallback to username
  const displayName =
    me?.first_name && me?.last_name
      ? `${me.first_name} ${me.last_name}`
      : me?.username || "";

  // Get profile image - prefer profile_img, fallback to personal_image
  const profileImage = me?.profile_img || me?.personal_image || "";

  return (
    <Box
      sx={{
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
        borderRadius: "10px",
        overflow: "hidden",
        width: { xs: "90%", md: "100%" },
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "210px",
        }}
      >
        <Image
          // src={accountsColors[isDelegate ? "delegate" : "default"].profileBgImg}
          src="/assets/images/profile/profile-hero.png"
          layout="fill"
          objectFit="cover"
          style={{ backgroundColor: "#CCCCCC" }}
        />
        <Box
          sx={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: "0",
            left: "0",
            backgroundColor: isDelegate
              ? "rgba(150, 124, 253, 0.7)"
              : "rgba(12, 128, 144, 0.7)",
          }}
        ></Box>
      </Box>
      {/* Bottom section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: "20px",
          borderTop: "2px solid",
          borderColor:
            accountsColors[isDelegate ? "delegate" : "default"].borderColor,
          backgroundColor: "#FFFEFA",
        }}
      >
        <Box
          sx={{
            width: "90%",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: { xs: "center", md: "right" },
          }}
        >
          {/* Left Side */}
          <Box
            sx={{
              display: "flex",
              columnGap: "20px",
              position: "relative",
              width: "100%",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: { xs: "center", md: "start" },
            }}
          >
            <Box sx={{ mt: "-80px", width: "auto" }}>
              {/* <ProfileImageEdit personalImage={me?.user.personal_image ?? ""} /> */}
              <Box
                sx={{
                  width: "130px",
                  height: "130px",
                  border: "3px solid",
                  borderColor:
                    accountsColors[isDelegate ? "delegate" : "default"]
                      .borderColor,
                  alignSelf: { xs: "center", md: "auto" },
                  backgroundImage: profileImage
                    ? `url(${profileImage})`
                    : "none",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  borderRadius: "50%",
                  backgroundColor: "#EEEEEE",
                  position: "relative",
                  overflow: "hidden",
                }}
              ></Box>
            </Box>
            <Box sx={{ ml: "10px" }}>
              <Typography
                sx={{
                  fontSize: "26px",
                  color: "primary.main",
                  fontWeight: "700",
                }}
              >
                {displayName}
              </Typography>
              <Typography sx={{ fontSize: "12px", color: "primary.main" }}>
                {me?.email}
              </Typography>
              {me?.enrollments_count !== undefined && (
                <Typography sx={{ fontSize: "12px", color: "gray.main" }}>
                  {t("enrollments")}: {me.enrollments_count}
                </Typography>
              )}
            </Box>
          </Box>
          {/* Right Side */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              pt: { xs: "10px", md: "0" },
              gap: { xs: "5px", md: "0" },
              alignItems: { xs: "center", md: "end" },
              whiteSpace: "pre",
            }}
          >
            <Typography
              sx={{
                fontSize: "18px",
                color: "primary.main",
                fontWeight: "700",
              }}
            >
              {t("profile hero text")}
            </Typography>
            <Typography sx={{ fontSize: "14px" }}>
              {me?.created_at
                ? dateToString(me.created_at)
                : dateToString(new Date())}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
});

ProfileHero.displayName = "ProfileHero";
