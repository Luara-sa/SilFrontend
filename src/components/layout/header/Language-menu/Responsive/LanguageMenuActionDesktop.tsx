import { Box, IconButton } from "@mui/material";
import { MenuLangStyled } from "components/styled";
import { useRouter } from "next/router";
import { useState } from "react";
import { LanguageMenuOptions } from "../LanguageMenuOptions";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";

export const LanguageMenuActionDesktop = () => {
  const { locale } = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const flag =
    locale === "en" ? "/assets/icons/uk-flag.svg" : "/assets/icons/sa-flag.svg";
  const Language = locale === "en" ? "English" : "Arabic";
  return (
    <>
      <IconButton onClick={handleClick} sx={{ borderRadius: "50px" }}>
        <Box
          sx={{
            backgroundColor: "red",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            border: "2px solid ",
            borderColor: "warning.main",
          }}
        >
          <img src={flag} />
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
        <LanguageMenuOptions handleClose={handleClose} />
      </MenuLangStyled>
    </>
  );
};
