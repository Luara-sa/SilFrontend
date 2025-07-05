import { Box, Button, Collapse } from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import { useState } from "react";
import CategoriesIcon from "../../../../../../public/assets/icons/CategoriesIcon";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { CategoriesMenuOptions } from "../CategoriesMenuOptions";

export const CategorisMenuMobile = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t } = useTranslation("header");
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
        onClick={open ? handleClose : handleClick}
        sx={{
          width: "100%",
          height: "46px",
          backgroundColor: "#178695",
          borderRadius: "10px",
          fontSize: "16px",
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#178695",
          },
        }}
        startIcon={<CategoriesIcon />}
        endIcon={
          open ? (
            <KeyboardArrowUpIcon sx={{ color: "#FFFFFF" }} />
          ) : (
            <KeyboardArrowDownIcon />
          )
        }
      >
        {t("categories")}
      </Button>
      <Collapse in={open}>
        <Box sx={{ maxHeight: "12rem", overflowY: "scroll" }}>
          <CategoriesMenuOptions />
        </Box>
      </Collapse>
    </>
  );
};
