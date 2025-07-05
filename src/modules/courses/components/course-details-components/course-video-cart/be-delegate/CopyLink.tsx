import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

import { CopyToClipboard } from "react-copy-to-clipboard";

import CopyAllRoundedIcon from "@mui/icons-material/CopyAllRounded";

interface Props {
  link?: string;
}

export const CopyLink = (props: Props) => {
  const [value, setValue] = useState({ copied: false, text: "ouis" });

  useEffect(() => {
    if (props?.link) {
      setValue({ copied: false, text: props?.link });
    }
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          mt: "15px",
          // boxShadow: "inset 0px 1px 2px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box
          sx={{
            backgroundColor: "primary.main",
            px: "20px",
            py: "5px",
            borderRadius: "5px 0px 0px 5px",
          }}
        >
          <img src="/assets/icons/chain.svg" />
        </Box>
        <CopyToClipboard
          text={value.text}
          onCopy={() =>
            setValue((old) => ({
              ...old,
              copied: true,
            }))
          }
        >
          <Box
            sx={{
              border: "1px solid #D9D9D9",
              backgroundColor: "#FFFFFF",
              borderLeft: "none",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              px: "10px",
              borderRadius: "0px 5px 5px 0px",
              cursor: "pointer",
            }}
          >
            <Typography
              sx={{ fontSize: "16px", color: "gray.main", fontWeight: "500px" }}
            >
              {`${props?.link}`.substring(0, 23)}...
            </Typography>
            <CopyAllRoundedIcon sx={{ color: "gray.main" }} />
          </Box>
        </CopyToClipboard>
      </Box>
      <Box sx={{ mt: "5px" }}>
        <Typography
          sx={{ color: "primary.main", fontSize: "10px", fontWeight: "500" }}
        >
          {value.copied ? "Text Copied" : "Press to copy the link"}
        </Typography>
      </Box>
    </Box>
  );
};
