import { Collapse, IconButton, MenuItem, Typography } from "@mui/material";
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
import { MenuLangStyled } from "components/styled";

export const ProfileMenuActionDesktop = () => {
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
      <IconButton onClick={handleClick} sx={{ borderRadius: "50px" }}>
        {/* <Avatar src={me?.user.personal_image}>H</Avatar> */}
        <Box
          sx={{
            width: "40px",
            height: "40px",
            position: "relative",
            borderRadius: "50%",
            overflow: "hidden",
            backgroundColor: "gray.light",
            border: "2px solid",
            borderColor: "warning.main",
          }}
        >
          <Image
            src={me?.user?.personal_image ?? ""}
            layout="fill"
            objectFit="cover"
            loading="lazy"
          />
        </Box>
        <ArrowDropDownOutlinedIcon />
      </IconButton>
      {/* ----------Styled Menu-------- */}
      <MenuLangStyled
        sx={{ mt: "10px", zIndex: "11000" }}
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <Link href="/profile">
          <MenuItem
            onClick={() => handleClose()}
            disableRipple
            sx={{
              display: "flex",
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
          </MenuItem>
        </Link>
        <MenuItem
          onClick={() => handleLogout()}
          disableRipple
          sx={{
            display: "flex",
            backgroundColor: router.locale === "ar" ? "#EFEFEF" : "",
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
        </MenuItem>
      </MenuLangStyled>
    </>
  );
};
