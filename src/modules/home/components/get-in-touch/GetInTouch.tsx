import React from "react";
import useTranslation from "next-translate/useTranslation";
import useDeviceSize from "hooks/useDeviceSize";

import { Box, Button, Typography } from "@mui/material";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import { TextareaAutosize } from "@mui/base";

import { TextFieldStyled } from "components/styled";

export const GetInTouch = () => {
  const DeviceSize = useDeviceSize();
  const { t } = useTranslation("home");
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        py: { xs: "1rem", md: "80px" },
        backgroundImage: `url('/assets/images/home/background.png')`,
      }}
    >
      <Box sx={{ width: { xs: "75%", md: "65vw" } }}>
        <Box>
          <Typography
            sx={{
              fontSize: { xs: "26px", md: "40px" },
              fontWeight: "600",
              color: "primary.main",
              textAlign: { xs: "center", md: "start" },
            }}
          >
            {t("get in touch")}
          </Typography>
          {DeviceSize !== "mobile" && (
            <Typography
              variant="subtitle1"
              sx={{
                color: "wood.main",
                width: "60%",
                paddingTop: "1rem",
                paddingBottom: "2rem",
              }}
            >
              {t("lorem")}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: { xs: "20px", md: "3%" },
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            <TextFieldStyled
              variant="outlined"
              fullWidth
              placeholder={t("full name")}
              sx={{
                borderColor: "#EEEEEE",
                border: " 1px solid #EEEEEE",
                boxShadow: "inset 0px 1px 2px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#FFFFFF",
                borderRadius: "5px",
                "& .MuiInputBase-input": {
                  borderColor: "#EEEEEE",
                  boxShadow: "none",
                },
              }}
            />
            <TextFieldStyled
              variant="outlined"
              sx={{
                borderColor: "#EEEEEE",
                border: " 1px solid #EEEEEE",
                boxShadow: "inset 0px 1px 2px rgba(0, 0, 0, 0.1)",
                borderRadius: "5px",
                backgroundColor: "#FFFFFF",
                "& .MuiInputBase-input": {
                  borderColor: "#EEEEEE",
                  boxShadow: "none",
                },
              }}
              fullWidth
              placeholder={t("email")}
            />
          </Box>
          <TextareaAutosize
            placeholder={t("description")}
            minRows={DeviceSize === "mobile" ? 5 : 12}
            style={{
              width: "100%",
              // boxSizing: "border-box",
              maxWidth: "100%",
              maxHeight: "200px",
              borderRadius: "5px",
              outline: "none",
              marginTop: "20px",
              padding: "10px",
              borderColor: "#c0c0c0",
              paddingBottom: "20px",
            }}
          />
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: { xs: "column-reverse", md: "row" },
              justifyContent: { xs: "center", md: "space-between" },
              alignItems: "center",
              py: { xs: "40px", md: "16px" },
              gap: { xs: "40px", md: "0" },
            }}
          >
            <Button
              sx={{
                backgroundColor: "#FFC107",
                width: "212px",
                height: "52px",
                borderRadius: "3px",
                display: "flex",
                gap: "10px",
              }}
              startIcon={<CallOutlinedIcon sx={{ color: "#1E5B63" }} />}
            >
              <Typography
                sx={{ color: "#1E5B63", fontSize: "18px", fontWeight: "600" }}
              >
                {t("call")}
              </Typography>
            </Button>
            <Button
              sx={{
                backgroundColor: "#1E5B63",
                width: { xs: "100%", md: "212px" },
                height: "52px",
                borderRadius: "3px",
                textAlign: "center",
              }}
            >
              <Typography
                sx={{ color: "#FFFFFF", fontSize: "18px", fontWeight: "600" }}
              >
                {t("send")}
              </Typography>
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
