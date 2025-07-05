import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Typography,
  Box,
  Button,
  Alert,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { Seo } from "components/shared";
import { Layout } from "components/layout";
import { _PlacementTestService } from "services/placement-test.service";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ScoreIcon from "@mui/icons-material/Score";

const PlacementTestResult = () => {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetchResults();
    }
  }, [id]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await _PlacementTestService.getPlacementTestResult(
        Number(id)
      );

      if (response.data.status && response.data.data) {
        setResults(response.data.data);
      } else {
        setError("No results found for this test");
      }
    } catch (err: any) {
      console.error("Error fetching test results:", err);
      setError(err?.response?.data?.message || "Failed to load results");
    } finally {
      setLoading(false);
    }
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
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={() => router.push("/placement-tests")}
        >
          Back to Placement Tests
        </Button>
      </Container>
    );
  }

  return (
    <>
      <Seo title={`SIL | Placement Test Results`} />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <CheckCircleIcon
            sx={{ fontSize: 80, color: "success.main", mb: 2 }}
          />
          <Typography variant="h4" sx={{ mb: 2, color: "success.main" }}>
            Test Results
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, color: "text.secondary" }}>
            Here are your placement test results
          </Typography>
        </Box>

        {results && (
          <Card sx={{ p: 3, maxWidth: 500, mx: "auto", mb: 4 }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3,
                }}
              >
                <ScoreIcon sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  Your Score
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h2"
                    sx={{ fontWeight: "bold", color: "primary.main", mb: 1 }}
                  >
                    {results.score !== null && results.score !== undefined
                      ? results.score
                      : "N/A"}
                  </Typography>
                  {results.percentage && (
                    <Typography variant="h6" sx={{ color: "text.secondary" }}>
                      ({results.percentage}%)
                    </Typography>
                  )}
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {results.start_at && (
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        Started:
                      </Typography>
                      <Typography variant="body1">
                        {new Date(results.start_at).toLocaleString()}
                      </Typography>
                    </Box>
                  )}

                  {results.submit_at && (
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        Completed:
                      </Typography>
                      <Typography variant="body1">
                        {new Date(results.submit_at).toLocaleString()}
                      </Typography>
                    </Box>
                  )}

                  {results.level && (
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        Level:
                      </Typography>
                      <Typography variant="body1">{results.level}</Typography>
                    </Box>
                  )}

                  {results.status && (
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        Status:
                      </Typography>
                      <Typography variant="body1">{results.status}</Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        <Box sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => router.push("/placement-tests")}
            sx={{ px: 4 }}
          >
            Back to Placement Tests
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default PlacementTestResult;

PlacementTestResult.layout = Layout;
