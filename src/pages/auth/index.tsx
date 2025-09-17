import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "contexts/AuthContext";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import { Box, Typography, Button } from "@mui/material";
import { LoginLayout } from "components/layout/login-layout/LoginLayout";
import { Seo } from "components/shared";

const AuthIndexPage: React.FC = () => {
  const { t } = useTranslation("auth");
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on user type
      if (user.user_type === "student") {
        router.push("/courses");
      } else if (user.user_type === "company") {
        router.push("/company");
      }
    }
  }, [isAuthenticated, user, router]);

  return (
    <>
      <Seo title="SIL | Login" />
      <LoginLayout>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "32px",
            width: "100%",
            maxWidth: "400px",
            mx: "auto",
            p: 3,
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "primary.main",
                mb: 2,
              }}
            >
              Welcome to SIL
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                mb: 4,
              }}
            >
              Choose your login type to continue
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              width: "100%",
            }}
          >
            <Button
              component={Link}
              href="/auth/student/login"
              variant="contained"
              size="large"
              sx={{
                height: "56px",
                fontSize: "16px",
                fontWeight: 600,
                borderRadius: "12px",
                textTransform: "none",
              }}
            >
              Student Login
            </Button>

            <Button
              component={Link}
              href="/auth/company/login"
              variant="outlined"
              size="large"
              sx={{
                height: "56px",
                fontSize: "16px",
                fontWeight: 600,
                borderRadius: "12px",
                textTransform: "none",
                borderWidth: "2px",
                "&:hover": {
                  borderWidth: "2px",
                },
              }}
            >
              Company Login
            </Button>
          </Box>

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
              Don't have an account?
            </Typography>
            <Button
              component={Link}
              href="/auth/signup"
              variant="text"
              sx={{
                color: "primary.main",
                textDecoration: "underline",
                textTransform: "none",
              }}
            >
              Create New Account
            </Button>
          </Box>
        </Box>
      </LoginLayout>
    </>
  );
};

export default AuthIndexPage;
