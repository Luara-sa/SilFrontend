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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";

const PlacementTests = () => {
  const { t } = useTranslation("common");
  const router = useRouter();

  const [placementTests, setPlacementTests] = useState<PlacementTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [testResults, setTestResults] = useState<{ [key: number]: any }>({});
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [selectedTestResult, setSelectedTestResult] = useState<any>(null);

  useEffect(() => {
    fetchPlacementTests();
  }, []);

  // Fetch test results for completed tests
  const fetchTestResults = async (testIds: number[]) => {
    const results: { [key: number]: any } = {};

    for (const testId of testIds) {
      try {
        const response = await _PlacementTestService.getPlacementTestResult(
          testId
        );
        if (response.data.status && response.data.data) {
          results[testId] = response.data.data;
        }
      } catch (err) {
        // Silently ignore errors for tests without results
      }
    }

    setTestResults(results);
  };

  const fetchPlacementTests = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await _PlacementTestService.getPlacementTests();

      if (response.data.status) {
        const tests = response.data.data.content;
        setPlacementTests(tests);

        // Fetch results for completed tests
        const completedTestIds = tests
          .filter((test) => test.submit_at && test.is_visible_result === 1)
          .map((test) => test.id);

        if (completedTestIds.length > 0) {
          await fetchTestResults(completedTestIds);
        }
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
    router.push(`/placement-test/${testId}`);
  };

  const handleViewResults = (testId: number) => {
    const result = testResults[testId];
    if (result) {
      setSelectedTestResult(result);
      setShowResultDialog(true);
    }
  };

  const renderTestButton = (test: PlacementTest) => {
    const isExpired = new Date(test.expire_date) < new Date();
    const isCompleted = test.submit_at;
    const hasVisibleResults = test.is_visible_result === 1;
    const hasResults = testResults[test.id];

    if (isExpired) {
      return (
        <Button
          variant="outlined"
          fullWidth
          disabled
          sx={{
            mt: "auto",
            py: 1.5,
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          Expired
        </Button>
      );
    }

    if (isCompleted && hasVisibleResults && hasResults) {
      return (
        <Box
          sx={{ mt: "auto", display: "flex", flexDirection: "column", gap: 1 }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              p: 1,
              bgcolor: "success.light",
              borderRadius: 1,
            }}
          >
            <CheckCircleIcon sx={{ color: "success.main", fontSize: 20 }} />
            <Typography
              variant="body2"
              sx={{ color: "success.main", fontWeight: "bold" }}
            >
              Completed
            </Typography>
          </Box>
          <Button
            variant="contained"
            fullWidth
            onClick={() => handleViewResults(test.id)}
            startIcon={<VisibilityIcon />}
            sx={{
              py: 1.5,
              fontSize: "1rem",
              fontWeight: "bold",
            }}
          >
            View Results
          </Button>
        </Box>
      );
    }

    if (isCompleted && hasVisibleResults && !hasResults) {
      return (
        <Box
          sx={{ mt: "auto", display: "flex", flexDirection: "column", gap: 1 }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              p: 1,
              bgcolor: "info.light",
              borderRadius: 1,
            }}
          >
            <CheckCircleIcon sx={{ color: "info.main", fontSize: 20 }} />
            <Typography
              variant="body2"
              sx={{ color: "info.main", fontWeight: "bold" }}
            >
              Completed - Processing Results
            </Typography>
          </Box>
        </Box>
      );
    }

    if (isCompleted && !hasVisibleResults) {
      return (
        <Box
          sx={{ mt: "auto", display: "flex", flexDirection: "column", gap: 1 }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              p: 1,
              bgcolor: "warning.light",
              borderRadius: 1,
            }}
          >
            <CheckCircleIcon sx={{ color: "warning.main", fontSize: 20 }} />
            <Typography
              variant="body2"
              sx={{ color: "warning.main", fontWeight: "bold" }}
            >
              Completed - Results Not Available
            </Typography>
          </Box>
        </Box>
      );
    }

    return (
      <Button
        variant="contained"
        fullWidth
        onClick={() => handleStartTest(test.id)}
        sx={{
          mt: "auto",
          py: 1.5,
          fontSize: "1rem",
          fontWeight: "bold",
        }}
      >
        Start Test
      </Button>
    );
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
                    opacity: new Date(test.expire_date) < new Date() ? 0.6 : 1,
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

                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          mb: 2,
                          flexWrap: "wrap",
                        }}
                      >
                        {new Date(test.expire_date) < new Date() ? (
                          <Chip
                            label="Expired"
                            color="error"
                            size="small"
                            variant="outlined"
                          />
                        ) : test.submit_at ? (
                          <Chip
                            label="Completed"
                            color="success"
                            size="small"
                            variant="filled"
                            icon={<CheckCircleIcon />}
                          />
                        ) : (
                          <Chip
                            label="Available"
                            color="primary"
                            size="small"
                            variant="outlined"
                          />
                        )}
                        {test.submit_at && testResults[test.id] && (
                          <Chip
                            label={`Score: ${
                              testResults[test.id].score || "N/A"
                            }`}
                            color="info"
                            size="small"
                            variant="filled"
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

                    {renderTestButton(test)}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Test Results Dialog */}
        <Dialog
          open={showResultDialog}
          onClose={() => setShowResultDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ScoreIcon color="primary" />
            Test Results
          </DialogTitle>
          <DialogContent>
            {selectedTestResult && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Card sx={{ p: 2, bgcolor: "background.default" }}>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Typography variant="body1">
                      <strong>Score:</strong>{" "}
                      {selectedTestResult.score !== null &&
                      selectedTestResult.score !== undefined
                        ? selectedTestResult.score
                        : "N/A"}
                    </Typography>
                    {selectedTestResult.percentage && (
                      <Typography variant="body1">
                        <strong>Percentage:</strong>{" "}
                        {selectedTestResult.percentage}%
                      </Typography>
                    )}
                    <Typography variant="body1">
                      <strong>Status:</strong>{" "}
                      {selectedTestResult.status !== null &&
                      selectedTestResult.status !== undefined
                        ? selectedTestResult.status
                        : "Completed"}
                    </Typography>
                    {selectedTestResult.level && (
                      <Typography variant="body1">
                        <strong>Level:</strong> {selectedTestResult.level}
                      </Typography>
                    )}
                    {selectedTestResult.total_questions && (
                      <Typography variant="body1">
                        <strong>Total Questions:</strong>{" "}
                        {selectedTestResult.total_questions}
                      </Typography>
                    )}
                    {selectedTestResult.correct_answers !== undefined && (
                      <Typography variant="body1">
                        <strong>Correct Answers:</strong>{" "}
                        {selectedTestResult.correct_answers}
                      </Typography>
                    )}
                  </Box>
                </Card>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setShowResultDialog(false)}
              variant="contained"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default PlacementTests;

PlacementTests.layout = Layout;
