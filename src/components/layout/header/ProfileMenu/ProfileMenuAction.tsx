import { Box } from "@mui/material";
import { ProfileMenuActionDesktop } from "./Responsive/ProfileMenuActionDesktop";
import { ProfileMenuActionMobile } from "./Responsive/ProfileMenuActionMobile";

export const ProfileMenuAction = () => {
  return (
    <>
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <ProfileMenuActionDesktop />
      </Box>
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <ProfileMenuActionMobile />
      </Box>
    </>
  );
};
