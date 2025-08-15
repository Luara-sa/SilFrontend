import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Typography,
  Box,
  Button,
  Alert,
  LinearProgress,
  Card,
  CardContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  TextField,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Seo } from "components/shared";
import { Layout } from "components/layout";
import {
  _PlacementTestService,
  PlacementTestDetail,
  QuizQuestion,
  QuestionAnswer,
} from "services/placement-test.service";
import { placementTestStore } from "store/placementTestStore";

import TimerIcon from "@mui/icons-material/Timer";
import QuizIcon from "@mui/icons-material/Quiz";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RestoreIcon from "@mui/icons-material/Restore";

const PlacementTest = () => {
  const router = useRouter();
  const { id } = router.query;

  // Enhanced state management with persistence
  const {
    currentTest,
    initializeTest,
    startTest,
    updateProgress,
    updateTimeLeft,
    completeTest,
    clearTest,
    isTestInProgress,
    getTestProgress,
  } = placementTestStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showUnansweredDialog, setShowUnansweredDialog] = useState(false);
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [unansweredQuestions, setUnansweredQuestions] = useState<number[]>([]);
  const [testResults, setTestResults] = useState<any>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isTestCompletedOnServer, setIsTestCompletedOnServer] = useState(false);
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const preventNavigationRef = useRef(false);

  // Derived state from store
  const testData = currentTest?.testData || null;
  const testStarted = currentTest?.isStarted || false;
  const currentQuestionIndex = currentTest?.currentQuestionIndex || 0;
  const answers = currentTest?.answers || {};
  const timeLeft = currentTest?.timeLeft || 0;
  const testCompleted = currentTest?.isCompleted || false;

  // Calculate progress percentage
  const progress = testData
    ? ((currentQuestionIndex + 1) / testData.topic.quiz.questions.length) * 100
    : 0;

  // Define callback functions first
  const setPreventNavigation = useCallback((prevent: boolean) => {
    preventNavigationRef.current = prevent;
    setHasUnsavedChanges(prevent);
  }, []);

  const fetchTestData = useCallback(
    async (testId?: number) => {
      const targetId = testId || Number(id);
      try {
        setLoading(true);
        setError("");

        const response = await _PlacementTestService.getPlacementTestQuestions(
          targetId
        );

        if (response.data.status) {
          const test = response.data.data;
          // Calculate total time for the test
          const totalMinutes = parseInt(test.topic.quiz.duration) || 30;
          const totalSeconds = totalMinutes * 60;

          // Initialize test in store
          initializeTest(targetId, test, totalSeconds);
          setPreventNavigation(true);
        } else {
          setError(response.data.message);
        }
      } catch (err: any) {
        console.error("Error fetching test data:", err);
        // Handle the specific "must start test" error gracefully
        const errorMessage = err?.response?.data?.message || "";
        if (errorMessage.includes("You must start the placement test")) {
          // This is expected - show pre-test screen
          setError("");
        } else {
          setError(errorMessage || "Failed to load test");
        }
      } finally {
        setLoading(false);
      }
    },
    [id, initializeTest, setPreventNavigation]
  );

  const submitCurrentAnswer = useCallback(async () => {
    if (!testData) return;

    const currentQuestion = testData.topic.quiz.questions[currentQuestionIndex];
    const questionAnswers = answers[currentQuestion.id] || [];

    if (questionAnswers.length === 0) {
      return; // Don't submit empty answers
    }

    try {
      const answerData: QuestionAnswer = {
        placement_test_id: testData.id.toString(),
        quiz_id: testData.topic.quiz.id.toString(),
        type: currentQuestion.type,
        question_id: currentQuestion.id.toString(),
        answers: questionAnswers,
      };

      const response = await _PlacementTestService.submitQuizAnswer(answerData);

      if (response.data.status) {
        setHasUnsavedChanges(false);
      } else {
        console.warn("Answer submission warning:", response.data.message);
      }
    } catch (err: any) {
      console.error("Error submitting answer:", err);
    }
  }, [testData, currentQuestionIndex, answers]);

  const fetchTestResults = useCallback(async () => {
    try {
      const response = await _PlacementTestService.getPlacementTestResult(
        Number(id)
      );
      if (response.data.status) {
        setTestResults(response.data.data);
      }
      // If no results, silently ignore - this is expected behavior
    } catch (err: any) {
      // Silently handle "no results" case - this is expected when user hasn't completed the test
      if (
        err?.response?.status === 404 ||
        err?.response?.data?.message === "response.not_found"
      ) {
        return;
      }
      console.error("Error fetching test results:", err);
    }
  }, [id]);

  const submitFinalQuiz = useCallback(async () => {
    if (!testData) return;

    try {
      setSubmitting(true);

      // Submit current answer if any
      await submitCurrentAnswer();

      // Submit final quiz
      const finalSubmission = {
        placement_test_id: testData.id.toString(),
        quiz_id: testData.topic.quiz.id.toString(),
      };

      const response = await _PlacementTestService.submitFinalQuiz(
        finalSubmission
      );

      if (response.data.status) {
        completeTest();
        setShowConfirmDialog(false);
        setPreventNavigation(false);
        setHasUnsavedChanges(false);
        // Fetch and show results
        await fetchTestResults();
      } else {
        setError(response.data.message);
      }
    } catch (err: any) {
      console.error("Error submitting final quiz:", err);
      setError(err?.response?.data?.message || "Failed to submit test");
    } finally {
      setSubmitting(false);
    }
  }, [
    testData,
    submitCurrentAnswer,
    completeTest,
    setPreventNavigation,
    fetchTestResults,
  ]);

  const handleTimeExpired = useCallback(
    async (testId: number) => {
      try {
        // Auto-submit the test when time expires
        if (currentTest?.testData) {
          await submitFinalQuiz();
        }
      } catch (err) {
        console.error("Error auto-submitting expired test:", err);
      }
    },
    [currentTest, submitFinalQuiz]
  );

  const initializeTestFlow = useCallback(
    async (testId: number) => {
      try {
        setLoading(true);
        setError("");

        // First check if test is submitted on server by checking placement tests list
        try {
          const testsResponse = await _PlacementTestService.getPlacementTests();
          if (testsResponse.data.status && testsResponse.data.data.content) {
            const currentTestInfo = testsResponse.data.data.content.find(
              (test) => test.id === testId
            );

            if (currentTestInfo?.submit_at) {
              // Test is submitted, fetch results if visible
              if (currentTestInfo.is_visible_result === 1) {
                try {
                  const resultsResponse =
                    await _PlacementTestService.getPlacementTestResult(testId);
                  if (
                    resultsResponse.data.status &&
                    resultsResponse.data.data
                  ) {
                    setTestResults(resultsResponse.data.data);
                  }
                } catch (err) {
                  console.warn("No results available yet");
                }
              }
              // Set server completion state instead of calling completeTest()
              setIsTestCompletedOnServer(true);
              setLoading(false);
              setIsInitializing(false);
              return;
            }
          }
        } catch (err) {
          console.warn("Failed to check test status:", err);
        }

        // Check for existing progress for this specific test
        const existingProgress = getTestProgress(testId);

        if (
          existingProgress &&
          existingProgress.isStarted &&
          !existingProgress.isCompleted
        ) {
          // Calculate remaining time based on elapsed time
          const elapsedTime = Math.floor(
            (Date.now() - existingProgress.testStartedAt) / 1000
          );
          const calculatedTimeLeft = Math.max(
            0,
            existingProgress.totalTime - elapsedTime
          );

          if (calculatedTimeLeft > 0) {
            // Update time left and show resume dialog
            updateTimeLeft(calculatedTimeLeft);
            setShowResumeDialog(true);
            setPreventNavigation(true);
          } else {
            // Time expired, auto-submit
            await handleTimeExpired(testId);
          }
        }

        // If no server submission and no local progress, show start screen
      } catch (err: any) {
        console.error("Error initializing test:", err);
        setError(err?.response?.data?.message || "Failed to initialize test");
      } finally {
        setLoading(false);
        setIsInitializing(false);
      }
    },
    [getTestProgress, updateTimeLeft, handleTimeExpired, setPreventNavigation]
  );

  const handleTimeUp = useCallback(() => {
    if (!testCompleted) {
      submitFinalQuiz();
    }
  }, [testCompleted, submitFinalQuiz]);

  const autoSaveProgress = useCallback(async () => {
    if (!testData || !currentTest) return;

    try {
      // Submit current answer if any
      const currentQuestion =
        testData.topic.quiz.questions[currentQuestionIndex];
      const questionAnswers = answers[currentQuestion.id] || [];

      if (questionAnswers.length > 0) {
        await submitCurrentAnswer();
        setHasUnsavedChanges(false);
      }
    } catch (err) {
      console.error("Auto-save failed:", err);
    }
  }, [
    testData,
    currentTest,
    currentQuestionIndex,
    answers,
    submitCurrentAnswer,
  ]);

  // Clear ALL state when test ID changes
  useEffect(() => {
    if (id) {
      // Always clear store state when navigating to any test page
      clearTest();

      // Clear all local state
      setTestResults(null);
      setError("");
      setIsInitializing(true);
      setIsTestCompletedOnServer(false);
      setHasUnsavedChanges(false);
      setShowConfirmDialog(false);
      setShowUnansweredDialog(false);
      setShowResumeDialog(false);
    }
  }, [id, clearTest]);

  // Robust initialization and resume logic
  useEffect(() => {
    if (id && isInitializing) {
      const testId = Number(id);
      initializeTestFlow(testId);
    }
  }, [id, isInitializing, initializeTestFlow]);

  // Timer logic
  useEffect(() => {
    if (testStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        const newTimeLeft = timeLeft - 1;
        if (newTimeLeft <= 0) {
          handleTimeUp();
          updateTimeLeft(0);
        } else {
          updateTimeLeft(newTimeLeft);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [testStarted, timeLeft, updateTimeLeft, handleTimeUp]);

  // Browser navigation protection
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (preventNavigationRef.current && testStarted && !testCompleted) {
        e.preventDefault();
        e.returnValue =
          "You have an active test in progress. Leaving will not save your current progress. Are you sure you want to leave?";
        return e.returnValue;
      }
    };

    const handleRouteChange = (url: string) => {
      if (preventNavigationRef.current && testStarted && !testCompleted) {
        const confirmLeave = window.confirm(
          "You have an active test in progress. Leaving will not save your current progress. Are you sure you want to leave?"
        );
        if (!confirmLeave) {
          router.events.emit("routeChangeError");
          throw "Route change aborted by user";
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      router.events.off("routeChangeStart", handleRouteChange);
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [testStarted, testCompleted, router]);

  // Auto-save functionality
  useEffect(() => {
    if (testStarted && !testCompleted) {
      // Auto-save every 10 seconds
      autoSaveIntervalRef.current = setInterval(() => {
        if (hasUnsavedChanges) {
          autoSaveProgress();
        }
      }, 10000);

      return () => {
        if (autoSaveIntervalRef.current) {
          clearInterval(autoSaveIntervalRef.current);
        }
      };
    }
  }, [testStarted, testCompleted, hasUnsavedChanges, autoSaveProgress]);

  const handleStartTest = async () => {
    // Prevent multiple simultaneous calls
    if (loading || submitting) return;

    if (!id) {
      console.error("❌ No ID available");
      return;
    }

    setLoading(true);
    const testId = Number(id);

    try {
      // Check if test is submitted on server first
      try {
        const testsResponse = await _PlacementTestService.getPlacementTests();
        if (testsResponse.data.status && testsResponse.data.data.content) {
          const currentTestInfo = testsResponse.data.data.content.find(
            (test) => test.id === testId
          );

          if (currentTestInfo?.submit_at) {
            // Test is submitted, fetch results if visible
            if (currentTestInfo.is_visible_result === 1) {
              try {
                const resultsResponse =
                  await _PlacementTestService.getPlacementTestResult(testId);
                if (resultsResponse.data.status && resultsResponse.data.data) {
                  setTestResults(resultsResponse.data.data);
                }
              } catch (err) {
                console.warn("No results available yet");
              }
            }
            // Set server completion state instead of calling completeTest()
            setIsTestCompletedOnServer(true);
            setPreventNavigation(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Failed to check test status:", err);
      }

      // Try to start the test on the server
      let testAlreadyStarted = false;
      try {
        const response = await _PlacementTestService.startPlacementTest(testId);

        if (
          !response.data.status &&
          response.data.message.includes("already started")
        ) {
          testAlreadyStarted = true;
        }
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message || "";
        if (errorMessage.includes("already started")) {
          testAlreadyStarted = true;
        } else {
          throw err; // Re-throw if it's a different error
        }
      }

      // Fetch test data regardless of whether start call succeeded
      await fetchTestData(testId);

      // Start the test in the store
      startTest();
      setPreventNavigation(true);

      // If test was already started, ensure we have the correct state
      if (testAlreadyStarted) {
        console.log("ℹ️ Test was already started on server, resuming...");
      }
    } catch (err: any) {
      console.error("❌ Error in startTest:", err);
      setError(err?.response?.data?.message || "Failed to start test");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (
    questionId: number,
    answerId: string,
    isMultiple: boolean
  ) => {
    const newAnswers = { ...answers };

    if (isMultiple) {
      const currentAnswers = newAnswers[questionId] || [];
      const isSelected = currentAnswers.includes(answerId);

      if (isSelected) {
        newAnswers[questionId] = currentAnswers.filter((id) => id !== answerId);
      } else {
        newAnswers[questionId] = [...currentAnswers, answerId];
      }
    } else {
      newAnswers[questionId] = [answerId];
    }

    // Update store with new answers
    updateProgress(currentQuestionIndex, newAnswers);
    setHasUnsavedChanges(true);
  };

  const nextQuestion = async () => {
    await submitCurrentAnswer();

    if (currentQuestionIndex < testData!.topic.quiz.questions.length - 1) {
      const newIndex = currentQuestionIndex + 1;
      updateProgress(newIndex, answers);
    } else {
      handleFinishTest();
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      const newIndex = currentQuestionIndex - 1;
      updateProgress(newIndex, answers);
    }
  };

  const getUnansweredQuestions = () => {
    if (!testData) return [];

    const unanswered: number[] = [];
    testData.topic.quiz.questions.forEach((question, index) => {
      const hasAnswer = answers[question.id] && answers[question.id].length > 0;
      if (!hasAnswer) {
        unanswered.push(index);
      }
    });
    return unanswered;
  };

  const navigateToQuestion = (questionIndex: number) => {
    updateProgress(questionIndex, answers);
    setShowUnansweredDialog(false);
  };

  const handleFinishTest = () => {
    const unanswered = getUnansweredQuestions();
    if (unanswered.length > 0) {
      setUnansweredQuestions(unanswered);
      setShowUnansweredDialog(true);
    } else {
      setShowConfirmDialog(true);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getCurrentQuestion = (): QuizQuestion | null => {
    if (!testData || !testStarted) return null;
    return testData.topic.quiz.questions[currentQuestionIndex];
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

  if (testCompleted || isTestCompletedOnServer) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ textAlign: "center" }}>
          <CheckCircleIcon
            sx={{ fontSize: 80, color: "success.main", mb: 2 }}
          />
          <Typography variant="h4" sx={{ mb: 2, color: "success.main" }}>
            Test Completed Successfully!
          </Typography>

          {testResults ? (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, color: "text.secondary" }}>
                Your Results:
              </Typography>
              <Card sx={{ p: 3, maxWidth: 400, mx: "auto" }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Typography variant="body1">
                    <strong>Score:</strong>{" "}
                    {testResults.score !== null &&
                    testResults.score !== undefined
                      ? testResults.score
                      : "N/A"}
                  </Typography>
                  {testResults.percentage && (
                    <Typography variant="body1">
                      <strong>Percentage:</strong>{" "}
                      {testResults.percentage || "N/A"}%
                    </Typography>
                  )}
                  <Typography variant="body1">
                    <strong>Status:</strong>{" "}
                    {testResults.status !== null &&
                    testResults.status !== undefined
                      ? testResults.status
                      : "Completed"}
                  </Typography>
                  {testResults.level && (
                    <Typography variant="body1">
                      <strong>Level:</strong> {testResults.level}
                    </Typography>
                  )}
                </Box>
              </Card>
            </Box>
          ) : (
            <Typography variant="h6" sx={{ mb: 4, color: "text.secondary" }}>
              Your answers have been submitted. Processing results...
            </Typography>
          )}

          <Button
            variant="contained"
            size="large"
            onClick={() => router.push("/placement-tests")}
          >
            Back to Placement Tests
          </Button>
        </Box>
      </Container>
    );
  }

  if (!testStarted) {
    return (
      <>
        <Seo title={`SIL | Placement Test ${id}`} />
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Card sx={{ p: 4 }}>
            <CardContent>
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <QuizIcon sx={{ fontSize: 80, color: "primary.main", mb: 2 }} />
                <Typography variant="h4" sx={{ mb: 2, color: "primary.main" }}>
                  Placement Test
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ mb: 4, color: "text.secondary" }}
                >
                  Ready to start your placement test?
                </Typography>
              </Box>

              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  • This is a timed placement test
                </Typography>
                <Typography variant="body2">
                  • Answer all questions to the best of your ability
                </Typography>
                <Typography variant="body2">
                  • You can navigate between questions before submitting
                </Typography>
                <Typography variant="body2">
                  • The test will auto-submit when time runs out
                </Typography>
              </Alert>

              <Box sx={{ textAlign: "center" }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => {
                    // Start test button clicked
                    handleStartTest();
                  }}
                  sx={{ px: 6, py: 2, fontSize: "1.1rem" }}
                >
                  Start Test
                </Button>

                <Typography
                  variant="body2"
                  sx={{ mt: 2, color: "text.secondary" }}
                >
                  Click &quot;Start Test&quot; to begin your placement test.
                  Test details will be loaded once started.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </>
    );
  }

  if (!testData) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          Failed to load test data. Please try again.
        </Alert>
        <Button
          variant="contained"
          onClick={() => router.push("/placement-tests")}
          sx={{ mt: 2 }}
        >
          Back to Placement Tests
        </Button>
      </Container>
    );
  }

  const currentQuestion = getCurrentQuestion();

  return (
    <>
      <Seo
        title={`SIL | ${testData.name} - Question ${currentQuestionIndex + 1}`}
      />
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Timer and Progress */}
        <Card sx={{ mb: 3, p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TimerIcon color="primary" />
              <Typography
                variant="h6"
                sx={{ color: timeLeft < 300 ? "error.main" : "primary.main" }}
              >
                {formatTime(timeLeft)}
              </Typography>
            </Box>
            <Typography variant="h6">
              Question {currentQuestionIndex + 1} of{" "}
              {testData.topic.quiz.questions.length}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Card>

        {/* Question */}
        {currentQuestion && (
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 4 }}>
              {currentQuestion.type !== "fill-in-blank" && (
                <Typography variant="h6" sx={{ mb: 3, color: "primary.main" }}>
                  {currentQuestion.name}
                </Typography>
              )}

              {currentQuestion.type === "single-choice" && (
                <RadioGroup
                  value={answers[currentQuestion.id]?.[0] || ""}
                  onChange={(e) =>
                    handleAnswerChange(
                      currentQuestion.id,
                      e.target.value,
                      false
                    )
                  }
                >
                  {currentQuestion.answers.map((answer) => (
                    <FormControlLabel
                      key={answer.id}
                      value={answer.id.toString()}
                      control={<Radio />}
                      label={answer.name}
                      sx={{ mb: 1 }}
                    />
                  ))}
                </RadioGroup>
              )}

              {currentQuestion.type === "multiple-choice" && (
                <Box>
                  {currentQuestion.answers.map((answer) => (
                    <FormControlLabel
                      key={answer.id}
                      control={
                        <Checkbox
                          checked={
                            answers[currentQuestion.id]?.includes(
                              answer.id.toString()
                            ) || false
                          }
                          onChange={(e) =>
                            handleAnswerChange(
                              currentQuestion.id,
                              answer.id.toString(),
                              true
                            )
                          }
                        />
                      }
                      label={answer.name}
                      sx={{ display: "block", mb: 1 }}
                    />
                  ))}
                </Box>
              )}

              {currentQuestion.type === "fill-in-blank" && (
                <Box sx={{ mt: 0 }}>
                  {/* Question header for fill-in-blank */}
                  <Typography
                    variant="h6"
                    sx={{ mb: 3, color: "primary.main" }}
                  >
                    Complete the sentence:
                  </Typography>

                  {/* Render question with interactive blanks */}
                  <Box
                    sx={{
                      mb: 3,
                      fontSize: "1.1rem",
                      lineHeight: 1.8,
                      p: 2,
                      backgroundColor: "grey.25",
                      borderRadius: "12px",
                      border: "1px solid",
                      borderColor: "grey.200",
                    }}
                  >
                    {currentQuestion.name
                      .split('{"BLANK"}')
                      .map((part, index, parts) => (
                        <span key={index}>
                          {part}
                          {index < parts.length - 1 && (
                            <TextField
                              variant="outlined"
                              size="small"
                              value={
                                answers[currentQuestion.id]?.[index]
                                  ? currentQuestion.answers.find(
                                      (ans) =>
                                        ans.id.toString() ===
                                        answers[currentQuestion.id]?.[index]
                                    )?.name || ""
                                  : ""
                              }
                              placeholder="___"
                              sx={{
                                mx: 1,
                                "& .MuiOutlinedInput-root": {
                                  minWidth: "100px",
                                  height: "40px",
                                  backgroundColor: "grey.50",
                                  borderRadius: "8px",
                                  "& fieldset": {
                                    borderColor: "grey.300",
                                    borderWidth: 1,
                                    borderStyle: "dashed",
                                  },
                                  "&:hover fieldset": {
                                    borderColor: "grey.400",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "primary.main",
                                    borderStyle: "solid",
                                  },
                                },
                                "& .MuiOutlinedInput-input": {
                                  textAlign: "center",
                                  fontWeight: "500",
                                  color: answers[currentQuestion.id]?.[index]
                                    ? "text.primary"
                                    : "grey.500",
                                  cursor: "pointer",
                                  fontSize: "0.95rem",
                                  "&::placeholder": {
                                    color: "grey.400",
                                    opacity: 0.8,
                                    fontStyle: "italic",
                                  },
                                },
                              }}
                              InputProps={{
                                readOnly: true,
                              }}
                              onClick={() => {
                                // Focus will be handled by clicking answer options
                              }}
                            />
                          )}
                        </span>
                      ))}
                  </Box>

                  {/* Answer options as clickable chips */}
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 2,
                      color: "text.secondary",
                      fontWeight: "500",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    💡 Click on an answer to fill in the blank:
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1.5,
                      p: 2,
                      backgroundColor: "background.paper",
                      borderRadius: "8px",
                      border: "1px solid",
                      borderColor: "grey.200",
                    }}
                  >
                    {currentQuestion.answers.map((answer) => {
                      const isSelected = answers[currentQuestion.id]?.includes(
                        answer.id.toString()
                      );
                      return (
                        <Button
                          key={answer.id}
                          variant={isSelected ? "contained" : "outlined"}
                          size="medium"
                          onClick={() => {
                            // For fill-in-blank with options, treat it as single choice
                            // Store the answer ID, not the text
                            const newAnswers = {
                              ...answers,
                              [currentQuestion.id]: [answer.id.toString()],
                            };
                            updateProgress(currentQuestionIndex, newAnswers);
                            setHasUnsavedChanges(true);
                          }}
                          sx={{
                            textTransform: "none",
                            fontWeight: isSelected ? "600" : "500",
                            minWidth: "80px",
                            px: 3,
                            py: 1.5,
                            borderRadius: "20px",
                            fontSize: "0.95rem",
                            backgroundColor: isSelected
                              ? "primary.main"
                              : "grey.100",
                            color: isSelected ? "white" : "text.primary",
                            border: isSelected
                              ? "2px solid transparent"
                              : "2px solid",
                            borderColor: isSelected
                              ? "transparent"
                              : "grey.300",
                            "&:hover": {
                              transform: "translateY(-2px)",
                              boxShadow: isSelected ? 3 : 2,
                              backgroundColor: isSelected
                                ? "primary.dark"
                                : "grey.200",
                              borderColor: isSelected
                                ? "transparent"
                                : "grey.400",
                            },
                            transition: "all 0.2s ease-in-out",
                          }}
                        >
                          {answer.name}
                        </Button>
                      );
                    })}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            variant="outlined"
            onClick={previousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>

          <Button
            variant="contained"
            onClick={
              currentQuestionIndex === testData.topic.quiz.questions.length - 1
                ? handleFinishTest
                : nextQuestion
            }
            sx={{ px: 4 }}
          >
            {currentQuestionIndex === testData.topic.quiz.questions.length - 1
              ? "Finish Test"
              : "Next"}
          </Button>
        </Box>

        {/* Unanswered Questions Dialog */}
        <Dialog
          open={showUnansweredDialog}
          onClose={() => setShowUnansweredDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ color: "warning.main" }}>
            Unanswered Questions
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              You have {unansweredQuestions.length} unanswered question(s):
            </Typography>
            <Box sx={{ mb: 3 }}>
              {unansweredQuestions.map((questionIndex) => (
                <Box
                  key={questionIndex}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 1,
                    border: "1px solid #e0e0e0",
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">
                    Question {questionIndex + 1}:{" "}
                    {testData?.topic?.quiz?.questions[
                      questionIndex
                    ]?.name.substring(0, 50)}
                    {(testData?.topic?.quiz?.questions[questionIndex]?.name
                      .length || 0) > 50
                      ? "..."
                      : ""}
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => navigateToQuestion(questionIndex)}
                  >
                    Go to Question
                  </Button>
                </Box>
              ))}
            </Box>
            <Typography variant="body2" color="text.secondary">
              You can go back to answer these questions or submit the test with
              unanswered questions.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowUnansweredDialog(false)}>
              Continue Answering
            </Button>
            <Button
              onClick={() => {
                setShowUnansweredDialog(false);
                setShowConfirmDialog(true);
              }}
              variant="contained"
              color="warning"
            >
              Submit Anyway
            </Button>
          </DialogActions>
        </Dialog>

        {/* Confirmation Dialog */}
        <Dialog
          open={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
        >
          <DialogTitle>Submit Test</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to submit your test? This action cannot be
              undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
            <Button
              onClick={submitFinalQuiz}
              variant="contained"
              disabled={submitting}
            >
              {submitting ? <CircularProgress size={20} /> : "Submit Test"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Resume Test Dialog */}
        <Dialog
          open={showResumeDialog}
          onClose={() => setShowResumeDialog(false)}
        >
          <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <RestoreIcon color="primary" />
            Resume Placement Test
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              You have a placement test in progress. Would you like to resume
              from where you left off or start over?
            </Typography>
            {currentTest && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Progress:</strong> Question{" "}
                  {currentTest.currentQuestionIndex + 1} of{" "}
                  {currentTest.testData?.topic.quiz.questions.length || 0}
                </Typography>
                <Typography variant="body2">
                  <strong>Time Remaining:</strong>{" "}
                  {formatTime(currentTest.timeLeft)}
                </Typography>
                <Typography variant="body2">
                  <strong>Answers Saved:</strong>{" "}
                  {Object.keys(currentTest.answers).length} questions
                </Typography>
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                clearTest();
                setShowResumeDialog(false);
                setPreventNavigation(false);
                // Force re-initialization
                setIsInitializing(true);
              }}
              color="inherit"
            >
              Start Over
            </Button>
            <Button
              onClick={() => {
                setShowResumeDialog(false);
                setPreventNavigation(true);
                // Test data is already loaded from store
              }}
              variant="contained"
            >
              Resume Test
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default PlacementTest;

PlacementTest.layout = Layout;
