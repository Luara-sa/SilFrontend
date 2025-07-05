import { Typography, Box } from "@mui/material";
import { StringDouble } from "interface/common";
import React from "react";

interface Props {
  description: StringDouble;
}

export const DescriptionTab = (props: Props) => {
  return (
    <Box>
      <Box sx={{ px: { xs: "10px", lg: "20px" } }}>
        <div dangerouslySetInnerHTML={{ __html: props.description.en }} />
      </Box>
    </Box>
  );
};
