import { Box, Button, Collapse, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { LanguageMenuOptions } from "../LanguageMenuOptions";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";

export const LanguageMenuActionMobile = () => {
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
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <>
          <Button
            sx={{
              width: "90%",
              height: "56px",
              backgroundColor: "#178695",
              borderRadius: "15px",
              display: "flex",
              justifyContent: "space-between",
              "&:hover": {
                backgroundColor: "#178695",
              },
            }}
            onClick={open ? handleClose : handleClick}
          >
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
            <Typography sx={{ color: "#FFFFFF" }}>{Language}</Typography>
            <ArrowDropDownOutlinedIcon />
          </Button>
          <Box sx={{ width: "90%" }}>
            <Collapse in={open}>
              <LanguageMenuOptions handleClose={handleClose} />
            </Collapse>
          </Box>
        </>
      </Box>
    </>
  );
};
