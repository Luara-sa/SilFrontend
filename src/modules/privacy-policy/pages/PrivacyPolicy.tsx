import React, { useState } from "react";
import { Box, Button, Dialog, Typography } from "@mui/material";

import ButtonLoader from "components/custom/ButtonLoader";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

interface Props {
  handleClose: () => void;
  open: boolean;
  onSubmit: () => void;
  handleCancel: () => void;
}

export const PrivacyPolicy = (props: Props) => {
  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      sx={{
        "& .MuiDialog-paper": {
          px: "22px",
          pb: "30px",
          backgroundColor: "#FFFEFA",
          width: "80vw",
          //   height:'90vh',
          minWidth: "290px",
          maxWidth: "100%",
        },
      }}
    >
      <Box>
        <Typography
          sx={{
            mt: "15px",
            fontSize: "30px",
            fontWeight: "700",
            color: "primary.main",
          }}
        >
          Experimental test
        </Typography>
        <Box sx={{ px: "40px", mt: "40px" }}>
          <Typography
            sx={{ color: "#888888", fontSize: "20px", fontWeight: "500" }}
          >
            Lorem ipsum, or lipsum as it is sometimes known, is dummy text used
            in laying out print, graphic or web designs. The passage is
            attributed to an unknown typesetter in the 15th century who is
            thought to have scrambled parts of Cicero&apos;s De Finibus Bonorum
            et Malorum for use in a type specimen book. It usually begins with:
            “Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.” The
            purpose of lorem ipsum is to create a natural looking block of text
            (sentence, paragraph, page, etc.) that doesn&apos;t distract from
            the layout. A practice not without controversy, laying out pages
            with meaningless filler text can be very useful when the focus is
            meant to be on design, not content. The passage experienced a surge
            in popularity during the 1960s when Letraset used it on their
            dry-transfer sheets, and again during the 90s as desktop publishers
            bundled the text with their software. Today it&apos;s seen all
            around the web; on templates, websites, and stock designs. Use our
            generator to get your own, or read on for the authoritative history
            of lorem ipsum.
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          columnGap: "10px",
          mt: "25px",
        }}
      >
        <Button
          onClick={props.onSubmit}
          startIcon={<CheckCircleOutlineIcon />}
          variant="contained"
          sx={{
            color: "primary.main",
            px: "30px",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: "700",
            backgroundColor: "rgba(30, 91, 99, 0.2)",
            "&:hover": {
              color: "gray.active",
            },
          }}
        >
          I Agree
        </Button>
        <Button
          onClick={props.handleCancel}
          startIcon={<CancelOutlinedIcon />}
          variant="contained"
          sx={{
            color: "#FF5252",
            fontSize: "16px",
            fontWeight: "700",
            px: "30px",
            borderRadius: "10px",
            backgroundColor: "rgba(255, 82, 82, 0.2)",
            "&:hover": {
              backgroundColor: "#FF5252",
              color: "gray.active",
            },
          }}
        >
          No
        </Button>
      </Box>
    </Dialog>
  );
};
