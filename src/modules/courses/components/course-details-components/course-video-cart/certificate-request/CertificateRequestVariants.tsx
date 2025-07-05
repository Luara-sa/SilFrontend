import React from "react";

import { Box, Button, Typography } from "@mui/material";

import {
  CertifcateStatus,
  statusProperties,
} from "modules/courses/helper/certifcateRequestProperties";
import { useRouter } from "next/router";
import { StringDouble } from "interface/common";

interface Props {
  status: CertifcateStatus;
}

export const CertificateRequestVariants = (props: Props) => {
  const { locale } = useRouter();
  console.log("locale", locale);
  return (
    <>
      <Button
        startIcon={statusProperties[props.status].icon}
        disableFocusRipple
        disableTouchRipple
        sx={{
          width: "100%",
          py: "8px",
          backgroundColor: statusProperties[props.status].primaryBackground,
          color: statusProperties[props.status].primaryColor,
          borderRadius: "10px",
          fontSize: "12px",
          fontWeight: "700",
          cursor: "default",
          ":hover": {
            backgroundColor: statusProperties[props.status].primaryBackground,
          },
        }}
      >
        {
          statusProperties[props.status].buttonText[
            locale as keyof StringDouble
          ]
        }
      </Button>
      {/* <Box
        sx={{
          backgroundColor: statusProperties[props.status].secondaryBackground,
          borderRadius: "5px",
          borderLeft: `2px solid ${
            statusProperties[props.status].secondaryBorder
          }`,
          padding: "2px 8px",
          mt: "10px",
          width: "100%",
        }}
      >
        <Typography
          sx={{
            fontSize: "8px",
            fontWeight: "500",
            color: statusProperties[props.status].secondaryColor,
          }}
        >
          {statusProperties[props.status].secondaryText}
        </Typography>
      </Box> */}
    </>
  );
};
