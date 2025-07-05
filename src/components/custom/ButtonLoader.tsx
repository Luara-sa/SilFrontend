import React from "react";

import {
  Box,
  Button,
  CircularProgress,
  Typography,
  ButtonProps,
  SxProps,
  Theme,
} from "@mui/material";

interface Props extends ButtonProps {
  loading: boolean;
  disableOnLoading?: boolean;
  textstyle?: SxProps<Theme>;
}

const ButtonLoader: React.FC<Props> = ({
  loading,
  disableOnLoading,
  textstyle,
  children,
  ...rest
}) => {
  return (
    <Button {...rest} disabled={disableOnLoading && loading}>
      {loading && (
        <Box
          sx={{
            position: "absolute",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress sx={{ color: "white" }} size="25px" />
        </Box>
      )}
      <Typography
        sx={{
          visibility: loading ? "hidden" : "visible",
          ...textstyle,
        }}
      >
        {children}
      </Typography>
    </Button>
  );
};

export default ButtonLoader;
