import React from "react";
import { useRouter } from "next/router";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Stack,
} from "@mui/material";
import {
  Lock as LockIcon,
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useAuth } from "contexts/AuthContext";
import { Seo } from "components/shared/seo/Seo";

const UnauthorizedPage: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleGoHome = () => {
    router.push("/");
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <>
      <Seo
        title="Access Denied - Unauthorized"
        description="You don't have permission to access this page."
      />
      <Container maxWidth="md">
        <Box
          sx={{
            minHeight: "80vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            py: 4,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 6,
              textAlign: "center",
              maxWidth: 500,
              width: "100%",
            }}
          >
            <Box
              sx={{
                mb: 3,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <LockIcon
                sx={{
                  fontSize: 80,
                  color: "error.main",
                }}
              />
            </Box>

            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              color="error.main"
              fontWeight="bold"
            >
              Access Denied
            </Typography>

            <Typography
              variant="h6"
              color="text.secondary"
              gutterBottom
              sx={{ mb: 3 }}
            >
              You don't have permission to access this page
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              {user ? (
                <>
                  You are logged in as{" "}
                  <strong>{user.username || user.email}</strong>, but your
                  account doesn't have the necessary permissions to view this
                  content.
                </>
              ) : (
                "Please log in with an account that has the appropriate permissions."
              )}
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
            >
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={handleGoBack}
                size="large"
              >
                Go Back
              </Button>

              <Button
                variant="contained"
                startIcon={<HomeIcon />}
                onClick={handleGoHome}
                size="large"
              >
                Go Home
              </Button>

              {user && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleLogout}
                  size="large"
                >
                  Logout
                </Button>
              )}
            </Stack>

            <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: "divider" }}>
              <Typography variant="body2" color="text.secondary">
                If you believe this is a mistake, please contact support or try
                logging in with a different account.
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default UnauthorizedPage;
