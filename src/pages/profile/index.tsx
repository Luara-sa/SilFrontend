import React, { useEffect } from "react";

import { Box, useTheme } from "@mui/material";

import { useRender } from "hooks/useRender";

import { ProfileIndex } from "modules/profile/ProfileIndex";
import { useMe } from "hooks/useMe";
import { useRouter } from "next/router";
import { profileStore } from "store/profileStore";

const Profile = () => {
  const theme = useTheme();
  const router = useRouter();

  const [clearData] = profileStore((state) => [state.clearData]);

  const { render } = useRender();

  const { isThereIsToken } = useMe();

  useEffect(() => {
    if (!isThereIsToken) {
      router.push("/");
    }
    return () => clearData();
  }, []);

  // To prevent Hydration error
  if (!render) return null;

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
