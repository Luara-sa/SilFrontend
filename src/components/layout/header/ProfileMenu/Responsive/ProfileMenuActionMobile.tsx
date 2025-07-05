import { Collapse, IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { _AuthService } from "services/auth.service";
import { meStore } from "store/meStore";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

export const ProfileMenuActionMobile = () => {
  const router = useRouter();
  const { t } = useTranslation("header");
  const [clearMe, me] = meStore((state) => [state.clearMe, state.me]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    _AuthService
      .logout()
      .then(() => {
        // Auth service now handles comprehensive cleanup including clearMe()
        handleClose();
        router.push("/");
      })
      .catch((err) => {
        console.error("Logout error:", err);
        // Even if logout API fails, still clear local state as fallback
        clearMe();
        // Force clear localStorage as fallback
        if (typeof window !== "undefined") {
          localStorage.clear();
          sessionStorage.clear();
        }
        handleClose();
        router.push("/");
      });
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <IconButton
          onClick={open ? handleClose : handleClick}
          sx={{ borderRadius: "50px" }}
        >
          {open ? (
            <ArrowDropUpIcon sx={{ color: "#1E5B63" }} />
          ) : (
            <ArrowDropDownOutlinedIcon sx={{ color: "#1E5B63" }} />
          )}
        </IconButton>

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography
            sx={{
              fontWeight: "300",
              fontSize: "16px",
              lineHeight: "20px",
              color: "#178695",
            }}
          >
            ! Hello
          </Typography>
          <Link href="/profile">
            <Typography
              sx={{
                fontWeight: "700",
                fontSize: "16px",
                lineHeight: "20px",
                color: "#178695",
              }}
            >
              {me?.user?.username?.slice(0, 10) || ""}
            </Typography>
          </Link>
        </Box>
        <Box
          sx={{
            width: "40px",
            height: "40px",
            position: "relative",
            borderRadius: "50%",
            overflow: "hidden",
          }}
        >
          <Image
            src={me?.user?.personal_image ?? ""}
            layout="fill"
            objectFit="cover"
            loading="lazy"
          />
        </Box>
      </Box>
      <Collapse in={open}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link href="/profile">
            <Box
              onClick={() => handleClose()}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <SettingsOutlinedIcon
                sx={{
                  "&.MuiSvgIcon-root": {
                    fontSize: "30px !important",
                    color: "#1E5B63 !important",
                  },
                }}
              />
              <Typography
                sx={{
                  color: "gray.50",
                  fontSize: [12, 12, 15, "1.042vw", "1.042vw"],
                }}
              >
                {t("profile")}
              </Typography>
            </Box>
          </Link>
          <Box
            onClick={() => handleLogout()}
            sx={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              // backgroundColor: router.locale === "ar" ? "#EFEFEF" : "",
            }}
          >
            <LogoutOutlinedIcon
              sx={{
                "&.MuiSvgIcon-root": {
                  fontSize: "30px !important",
                  color: "#1E5B63 !important",
                },
              }}
            />
            <Typography
              sx={{
                color: "gray.50",
                fontSize: [12, 12, 15, "1.042vw", "1.042vw"],
              }}
            >
              {t("logout")}
            </Typography>
          </Box>
        </Box>
      </Collapse>
    </>
  );
};
