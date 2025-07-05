import { useState } from "react";

import useTranslation from "next-translate/useTranslation";

import { Button } from "@mui/material";

import CategoriesIcon from "../../../../../../public/assets/icons/CategoriesIcon";
import { MenuLangStyled } from "components/styled";
import { CategoriesMenuOptions } from "../CategoriesMenuOptions";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export const CategoriesMenuDesktop = () => {
  const { t } = useTranslation("header");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        onClick={handleClick}
        sx={{ fontSize: ["1.042vw", "1.042vw"] }}
        startIcon={<CategoriesIcon />}
        endIcon={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      >
        {t("categories")}
      </Button>
      <MenuLangStyled
        open={open}
        anchorEl={anchorEl}
        sx={{ mt: "15px", zIndex: "11000" }}
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        onClose={handleClose}
      >
        <CategoriesMenuOptions />
      </MenuLangStyled>
    </>
  );
};
