import React, { useState } from "react";

import { Button, Dialog } from "@mui/material";

import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import useTranslation from "next-translate/useTranslation";
import { CancelPopup } from "./CancelPopup";

export const CancelButton = () => {
  const { t } = useTranslation("test");

  const [isCancelPopup, setIsCancelPopup] = useState(false);

  const handleCloseCancelPopup = () => setIsCancelPopup(false);
  const handleOpenCancelPopup = () => setIsCancelPopup(true);

  return (
    <>
      <Button
        onClick={handleOpenCancelPopup}
        startIcon={<CancelOutlinedIcon />}
        variant="contained"
        sx={{
          px: "40px",
          borderRadius: "10px",
          backgroundColor: "#FF5252",
          "&:hover": { backgroundColor: "rgb(202, 45, 45)" },
        }}
      >
        {t("cancel")}
      </Button>
      <Dialog
        open={isCancelPopup}
        onClose={() => handleCloseCancelPopup()}
        sx={{
          "& .MuiDialog-paper ": {
            px: "40px",
            py: "20px",
            backgroundColor: "#FFFEFA",
            maxWidth: "100%",
            width: { xs: "80vw", md: "50vw", lg: "40vw", xl: "35vw" },
            minWidth: "290px",
            padding: "0",
          },
        }}
      >
        <CancelPopup handleClose={handleCloseCancelPopup} />
      </Dialog>
    </>
  );
};
