import React, { useState, useEffect, useCallback } from "react";
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

import TimerIcon from "@mui/icons-material/Timer";
import QuizIcon from "@mui/icons-material/Quiz";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const PlacementTest = () => {
  const router = useRouter();
  const { id } = router.query;

  // State management
  const [testData, setTestData] = useState<PlacementTestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: number]: string[] }>(
    {}
  );
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showUnansweredDialog, setShowUnansweredDialog] = useState(false);
  const [unansweredQuestions, setUnansweredQuestions] = useState<number[]>([]);
  const [testResults, setTestResults] = useState<any>(null);

  // Don't fetch test data automatically - wait for user to start test
  useEffect(() => {
    if (id) {
      setLoading(false); // Just stop loading to show the pre-test screen
    }
  }, [id]);

  // Timer logic
  useEffect(() => {
    if (testStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [testStarted, timeLeft]);

  const fetchTestData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await _PlacementTestService.getPlacementTestQuestions(
        Number(id)
      );

      if (response.data.status) {
        setTestData(response.data.data);
        // Set timer duration (convert minutes to seconds)
        setTimeLeft(parseInt(response.data.data.topic.quiz.duration) * 60);
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
  }, [id]);

  const fetchTestResults = async () => {
    try {
      const response = await _PlacementTestService.getPlacementTestResult(
        Number(id)
      );
      if (response.data.status) {
        setTestResults(response.data.data);
      } else {
        console.error("Failed to fetch results:", response.data.message);
      }
    } catch (err: any) {
      console.error("Error fetching test results:", err);
    }
  };

  const startTest = async () => {
    // Prevent multiple simultaneous calls
    if (loading) return;

    // Check if user is logged in and has token
    const token = localStorage.getItem("token");

    if (!id) {
      console.error("❌ No ID available");
      return;
    }

    setLoading(true);

    try {
      // First, check if test is already completed by checking for results
      const resultsResponse =
        await _PlacementTestService.getPlacementTestResult(Number(id));

      if (resultsResponse.data.status && resultsResponse.data.data) {
        setTestResults(resultsResponse.data.data);
        setTestCompleted(true);
        return;
      }
    } catch (resultsErr: any) {
      // This is expected if test hasn't been completed yet
    }

    try {
      const response = await _PlacementTestService.startPlacementTest(
        Number(id)
      );

      if (response.data.status) {
        setTestStarted(true);
        await fetchTestData();
      } else {
        // Check if test was already started
        if (response.data.message.includes("already started")) {
          setTestStarted(true);
          await fetchTestData();
        } else {
          setError(response.data.message);
        }
      }
    } catch (err: any) {
      console.error("❌ Error in startTest:", err);

      // Check if the error indicates test already started
      const errorMessage = err?.response?.data?.message || "";
      if (errorMessage.includes("already started")) {
        setTestStarted(true);
        await fetchTestData();
      } else {
        setError(err?.response?.data?.message || "Failed to start test");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (
    questionId: number,
    answerId: string,
    isMultiple: boolean
  ) => {
    setAnswers((prev) => {
      if (isMultiple) {
        const currentAnswers = prev[questionId] || [];
        const isSelected = currentAnswers.includes(answerId);

        if (isSelected) {
          return {
            ...prev,
            [questionId]: currentAnswers.filter((id) => id !== answerId),
          };
        } else {
          return {
            ...prev,
            [questionId]: [...currentAnswers, answerId],
          };
        }
      } else {
        return {
          ...prev,
          [questionId]: [answerId],
        };
      }
    });
  };

  const handleTextAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: [value],
    }));
  };

  const submitCurrentAnswer = async () => {
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

      if (!response.data.status) {
        console.warn("Answer submission warning:", response.data.message);
      }
    } catch (err: any) {
      console.error("Error submitting answer:", err);
    }
  };

  const nextQuestion = async () => {
    await submitCurrentAnswer();

    if (currentQuestionIndex < testData!.topic.quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleFinishTest();
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
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
    setCurrentQuestionIndex(questionIndex);
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

  const submitFinalQuiz = async () => {
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
        setTestCompleted(true);
        setShowConfirmDialog(false);
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
  };

  const handleTimeUp = useCallback(() => {
    if (!testCompleted) {
      submitFinalQuiz();
    }
  }, [testCompleted]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getCurrentQuestion = (): QuizQuestion | null => {
    if (!testData || !testStarted) return null;
    return testData.topic.quiz.questions[currentQuestionIndex];
  };

  const progress = testData
    ? ((currentQuestionIndex + 1) / testData.topic.quiz.questions.length) * 100
    : 0;

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

  if (testCompleted) {
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
                    startTest();
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
              <Typography variant="h6" sx={{ mb: 3, color: "primary.main" }}>
                {currentQuestion.name}
              </Typography>

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
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter your answer..."
                  value={answers[currentQuestion.id]?.[0] || ""}
                  onChange={(e) =>
                    handleTextAnswerChange(currentQuestion.id, e.target.value)
                  }
                  sx={{ mt: 2 }}
                />
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
      </Container>
    </>
  );
};

export default PlacementTest;

PlacementTest.layout = Layout;
