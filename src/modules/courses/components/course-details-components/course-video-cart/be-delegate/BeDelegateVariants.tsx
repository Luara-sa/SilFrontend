import { Box, Button, Typography } from "@mui/material";
import { StringDouble } from "interface/common";
import {
  Status,
  statusProperties,
} from "modules/courses/helper/delegateStatusProperties";
import { useRouter } from "next/router";
import React, { useState } from "react";

import { CopyLink } from "./CopyLink";

interface Props {
  status: Status;
  link?: string;
}

export const BeDelegateVariants = (props: Props) => {
  const { locale } = useRouter();
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
      <Box
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
          {
            statusProperties[props.status].secondaryText[
              locale as keyof StringDouble
            ]
          }
        </Typography>
      </Box>

      {props.status === "success" && <CopyLink link={props?.link} />}
    </>
  );

  //   return <div>BeDelegateVariants</div>;
};
