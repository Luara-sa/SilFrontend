import { Button } from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import { useState } from "react";
import Placement from "../../../../../../public/assets/icons/Placement";
import { PlacementTestConditionalPopup } from "../PlacementTestConditionalPopup";

export const PlacementTestButtonMobile = () => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const { t } = useTranslation("header");
  const handleOpen = () => setOpen(true);
  return (
    <>
      <Button
        onClick={() => handleOpen()}
        startIcon={<Placement />}
        sx={{
          fontSize: "16px",
          fontWeight: "700",
          color: "#FFFFFF",
          backgroundColor: "#178695",
          width: "100%",
          height: "46px",
          borderRadius: "10px",
        }}
      >
        {t("placement test")}
      </Button>
      <PlacementTestConditionalPopup handleClose={handleClose} open={open} />
    </>
  );
};
