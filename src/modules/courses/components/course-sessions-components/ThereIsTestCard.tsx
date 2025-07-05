import { Box, Button, Typography } from "@mui/material";
import React from "react";

import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import { AttchmentsTests } from "interface/common";
import Link from "next/link";
import { useRouter } from "next/router";

interface Props {
  testId: number;
  message?: string;
}

export const ThereIsTestCard = (props: Props) => {
  const router = useRouter();

  return (
    <Box
      sx={{
        backgroundColor: "rgba(255, 193, 7, 0.4)",
        border: "2px solid #FFC107",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
        borderRadius: "10px",
        py: "20px",
        mt: "20px",
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          //   justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: "20px",
            fontWeight: "500",
            color: "primary.main",
            width: "87%",
            textAlign: "center",
          }}
        >
          {props.message}
        </Typography>
        <Link
          href={{
            pathname: `${router.pathname}/test/[testId]`,
            query: { ...router.query, testId: props.testId },
            // query: { ...router.query, testId: props.attachmentTest.test_id },
          }}
        >
          <Button
            endIcon={
              <ArrowForwardIosOutlinedIcon
                sx={{ width: "15px", color: "#000000" }}
              />
            }
            sx={{
              fontSze: "18px",
              fontWeight: "700",
              color: "#000000",
              position: "absolute",
              right: "20px",
            }}
          >
            Next
          </Button>
        </Link>
      </Box>
    </Box>
  );
};
