import React from "react";
import { Box, Typography, Grid, Card, CardContent } from "@mui/material";
import { useAuth } from "contexts/AuthContext";
import { Seo } from "components/shared";
import useTranslation from "next-translate/useTranslation";

const CompanyDashboard: React.FC = () => {
  const { t } = useTranslation("common");
  const { user } = useAuth();

  return (
    <>
      <Seo title="SIL | Company Dashboard" />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Welcome back, {user?.first_name || "Company"}!
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Courses
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage and view available courses for your employees.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Students
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View and manage your enrolled students.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Notifications
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Stay updated with the latest notifications.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default CompanyDashboard;
