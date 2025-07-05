import { Button } from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import { useState } from "react";
import Placement from "../../../../../../public/assets/icons/Placement";
import { PlacementTestConditionalPopup } from "../PlacementTestConditionalPopup";

export const PlacementTestButtonDesktop = () => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const { t } = useTranslation("header");
  const handleOpen = () => setOpen(true);
  return (
    <>
      <Button
        onClick={() => handleOpen()}
        startIcon={<Placement />}
        sx={{ fontSize: ["1.042vw", "1.042vw"], fontWeight: "700" }}
      >
        {t("placement test")}
      </Button>
      <PlacementTestConditionalPopup handleClose={handleClose} open={open} />
    </>
  );
};
