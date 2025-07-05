import { Box, Typography } from "@mui/material";
import React from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "next/link";

export const Breadcrumb = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        backgroundColor: "rgba(203, 167, 112, 0.17)",
        py: "37px",
      }}
    >
      <Box sx={{ width: "85.833vw" }}>
        <Box>
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: "700",
              color: "primary.main",
            }}
          >
            Courses
          </Typography>
        </Box>
        <Box sx={{ mt: "5px" }}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
          >
            <Link key="1" href="/">
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "primary.main",
                  fontWeight: "700",
                  "&:hover": {
                    cursor: "pointer",
                    textDecoration: "underline",
                  },
                }}
              >
                Home
              </Typography>
            </Link>

            <Typography
              key="3"
              sx={{
                fontSize: "14px",
                color: "primary.main",
                fontWeight: "700",
              }}
            >
              Courses
            </Typography>
          </Breadcrumbs>
        </Box>
      </Box>
    </Box>
  );
};
