import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";

import { Seo } from "components/shared";
import { Layout } from "components/layout";
import {
  _PlacementTestService,
  PlacementTest,
} from "services/placement-test.service";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ScoreIcon from "@mui/icons-material/Score";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const PlacementTests = () => {
  const { t } = useTranslation("common");
  const router = useRouter();

  const [placementTests, setPlacementTests] = useState<PlacementTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchPlacementTests();
  }, []);

  const fetchPlacementTests = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await _PlacementTestService.getPlacementTests();

      if (response.data.status) {
        setPlacementTests(response.data.data.content);
      } else {
        setError(response.data.message || "Failed to fetch placement tests");
      }
    } catch (err: any) {
      console.error("Error fetching placement tests:", err);
      setError(
        err?.response?.data?.message || "Failed to fetch placement tests"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isExpired = (expireDate: string) => {
    return new Date(expireDate) < new Date();
  };

  const handleStartTest = async (testId: number) => {
    try {
      // First check if test is already completed
      const resultsResponse =
        await _PlacementTestService.getPlacementTestResult(testId);

      if (resultsResponse.data.status && resultsResponse.data.data) {
        // Show results in a modal or navigate to results view
        // For now, let's create a results route
        router.push(`/placement-test/${testId}/result`);
        return;
      }
    } catch (err: any) {
      // This is expected if test hasn't been completed yet
    }

    // No results found, proceed to test page normally
    router.push(`/placement-test/${testId}`);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchPlacementTests}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <>
      <Seo title="SIL | Placement Tests" />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: "bold",
              color: "primary.main",
              mb: 2,
              textAlign: { xs: "center", md: "left" },
            }}
          >
            Placement Tests
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              textAlign: { xs: "center", md: "left" },
            }}
          >
            Choose a placement test to assess your current level
          </Typography>
        </Box>

        {placementTests.length === 0 ? (
          <Alert severity="info">
            No placement tests available at the moment.
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {placementTests.map((test) => (
              <Grid item xs={12} md={6} lg={4} key={test.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 4,
                    },
                    opacity: isExpired(test.expire_date) ? 0.6 : 1,
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="h6"
                        component="h2"
                        sx={{
                          fontWeight: "bold",
                          color: "primary.main",
                          mb: 1,
                        }}
                      >
                        {test.name}
                      </Typography>

                      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                        {isExpired(test.expire_date) ? (
                          <Chip
                            label="Expired"
                            color="error"
                            size="small"
                            variant="outlined"
                          />
                        ) : (
                          <Chip
                            label="Available"
                            color="success"
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1,
                          color: "text.secondary",
                        }}
                      >
                        <AccessTimeIcon sx={{ mr: 1, fontSize: 20 }} />
                        <Typography variant="body2">
                          Duration: {test.duration} minutes
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1,
                          color: "text.secondary",
                        }}
                      >
                        <AssignmentIcon sx={{ mr: 1, fontSize: 20 }} />
                        <Typography variant="body2">
                          Total Marks: {test.total_mark}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1,
                          color: "text.secondary",
                        }}
                      >
                        <ScoreIcon sx={{ mr: 1, fontSize: 20 }} />
                        <Typography variant="body2">
                          Pass Mark: {test.pass_mark}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1,
                          color: "text.secondary",
                        }}
                      >
                        <CalendarTodayIcon sx={{ mr: 1, fontSize: 20 }} />
                        <Typography variant="body2">
                          Expires: {formatDate(test.expire_date)}
                        </Typography>
                      </Box>
                    </Box>

                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handleStartTest(test.id)}
                      disabled={isExpired(test.expire_date)}
                      sx={{
                        mt: "auto",
                        py: 1.5,
                        fontSize: "1rem",
                        fontWeight: "bold",
                      }}
                    >
                      {isExpired(test.expire_date) ? "Expired" : "Start Test"}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
};

export default PlacementTests;

PlacementTests.layout = Layout;
