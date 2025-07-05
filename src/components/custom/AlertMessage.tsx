import { useState, forwardRef, useCallback, useEffect } from "react";

import {
  useSnackbar,
  SnackbarContent,
  SnackbarMessage,
  SnackbarKey,
} from "notistack";

import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

interface AlertMessageProps {
  variants: "error" | "warning" | "info" | "success";
  id: SnackbarKey;
  message: SnackbarMessage;
}

const AlertMessage = forwardRef<HTMLDivElement, AlertMessageProps>(
  ({ id, ...props }, ref) => {
    const { closeSnackbar } = useSnackbar();

    const [colors, setColors] = useState<
      | {
          text: string;
          border: string;
          bg: string;
        }
      | undefined
    >();

    useEffect(() => {
      // console.log(props);
      props.variants === "error"
        ? setColors({
            text: "#FF5252",
            border: "#FF8282",
            bg: "#FFE8E8",
          })
        : props.variants === "success"
        ? setColors({ text: "#4CAF50", border: "#4CAF50", bg: "#DCFFDE" })
        : props.variants === "info"
        ? setColors({ text: "#1976D2", border: "#1976D2", bg: "#D6EBFF" })
        : setColors({ text: "#FFC107", border: "#FFC107", bg: "#FFFAE9" });

      return () => {};
    }, []);

    const handleDismiss = useCallback(() => {
      closeSnackbar(id);
    }, [id, closeSnackbar]);

    return (
      <>
        <SnackbarContent ref={ref}>
          <Box
            sx={{
              backgroundColor: colors?.bg,
              px: "25px",
              py: "20px",
              border: "1px solid",
              borderColor: colors?.border,
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              columnGap: "10px",
              width: { xs: "300px", md: "400px", xl: "450px" },
            }}
          >
            <Box>
              <img
                src={`/assets/icons/snackbar/${
                  props.variants ?? "warning"
                }.svg`}
              />
            </Box>
            <Box>
              <Typography
                sx={{
                  color: colors?.text,
                  fontSize: "24px",
                  fontWeight: "700",
                }}
              >
                {props.variants === "error"
                  ? "Error"
                  : props.variants === "info"
                  ? "Information"
                  : props.variants === "success"
                  ? "Success"
                  : "Warning"}
              </Typography>
              <Typography sx={{ fontSize: "16px", color: colors?.text }}>
                {props.message ?? "Call The Administrator"}
              </Typography>
            </Box>
            {/* <Card>
          <CardActions>
          <div>
          <IconButton aria-label="Show more" size="small">
          <ExpandMoreIcon />
          </IconButton>
          <IconButton size="small" onClick={handleDismiss}>
          <CloseIcon fontSize="small" />
          </IconButton>
          </div>
          </CardActions>
        </Card> */}
          </Box>
        </SnackbarContent>
      </>
    );
  }
);

AlertMessage.displayName = "AlertMessage";

export default AlertMessage;
