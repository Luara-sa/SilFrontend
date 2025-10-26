import React, { useEffect } from "react";

import { Box, useTheme } from "@mui/material";

import { useRender } from "hooks/useRender";
import { useAuthGuard } from "hooks/useProtectedRoute";

import { ProfileIndex } from "modules/profile/ProfileIndex";
import { profileStore } from "store/profileStore";

const Profile = () => {
  const theme = useTheme();

  // Protect this route - require authentication
  const { isLoading } = useAuthGuard();

  const [clearData] = profileStore((state) => [state.clearData]);

  const { render } = useRender();

  useEffect(() => {
    return () => clearData();
  }, [clearData]);

  // Show loading state while checking auth or preventing hydration error
  if (isLoading || !render) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box sx={{ width: { xs: "100%", md: "80%" } }}>
        <ProfileIndex />
      </Box>
    </Box>
  );
};

export default Profile;
