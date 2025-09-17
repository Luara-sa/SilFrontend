import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Checkbox,
  FormGroup,
  TextField,
  LinearProgress,
  Alert,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import {
  Timer,
  CheckCircle,
  Cancel,
  Quiz as QuizIcon,
  ArrowBack,
  ArrowForward,
} from "@mui/icons-material";
import {
  TopicQuiz,
  TopicQuizQuestion,
  TopicQuizAnswer,
} from "interface/common";
import { useQuizProgressStore } from "store/quizProgressStore";
import { _QuizService } from "services/quiz.service";

interface TopicQuizComponentProps {
  courseId: number;
  chapterId: number;
  topicId: number;
  quiz: TopicQuiz;
  topicProgressStatus?: string | null; // Add progress status from topic data
  onQuizComplete?: (passed: boolean, score: number) => void;
}

interface QuestionAnswer {
  question_id: number;
  answer_ids: number[];
}

interface QuizResult {
  passed: boolean;
  score: number;
  total_score: number;
  correct_answers: number;
  total_questions: number;
  time_taken: number;
}

export const TopicQuizComponent: React.FC<TopicQuizComponentProps> = ({
  courseId,
  chapterId,
  topicId,
  quiz,
  topicProgressStatus,
  onQuizComplete,
}) => {
  const { addCompletedQuiz, isQuizCompleted, getQuizScore } =
    useQuizProgressStore();

  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [questionId: number]: number[] }>(
    {}
  );
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [quizStatus, setQuizStatus] = useState<
    "not_started" | "started" | "completed" | "checking"
  >("checking");

  // Check quiz status when component mounts
  useEffect(() => {
    const checkQuizStatus = async () => {
      setLoading(true);
      setError("");

      try {
        // First, check if quiz is completed via topic progress status
        if (topicProgressStatus === "completed") {
          const score = getQuizScore(courseId, topicId);
          setQuizStatus("completed");
          // Set local result for display
          setQuizResult({
            passed: score !== null && score >= quiz.pass_mark,
            score: score || quiz.pass_mark, // Assume passed if no local score
            total_score: quiz.total_mark,
            correct_answers: 0, // We don't store this locally
            total_questions: quiz.questions.length,
            time_taken: 0, // We don't store this locally
          });
          setLoading(false);
          return;
        }

        // Second, check if quiz is completed locally
        if (isQuizCompleted(courseId, topicId)) {
          const score = getQuizScore(courseId, topicId);
          setQuizStatus("completed");
          // Set local result for display
          setQuizResult({
            passed: score !== null && score >= quiz.pass_mark,
            score: score || 0,
            total_score: quiz.total_mark,
            correct_answers: 0, // We don't store this locally
            total_questions: quiz.questions.length,
            time_taken: 0, // We don't store this locally
          });
          setLoading(false);
          return;
        }

        // Try to get quiz result first to check status
        try {
          const resultResponse = await _QuizService.getQuizResult(
            quiz.id.toString(),
            {
              course_id: courseId.toString(),
              topic_id: topicId.toString(),
              quiz_id: quiz.id.toString(),
            }
          );

          if (resultResponse.data.status && resultResponse.data.data) {
            const result = resultResponse.data.data;

            // Check if quiz is completed (has submit_at and score)
            if (
              result.submit_at &&
              (result.score !== null || result.student_mark !== null)
            ) {
              // Quiz is completed
              const finalScore = result.score ?? result.student_mark ?? 0;
              setQuizStatus("completed");
              setQuizResult({
                passed: finalScore >= quiz.pass_mark,
                score: finalScore,
                total_score: result.total_mark,
                correct_answers:
                  result.questions?.filter((q: any) => q.is_correct)?.length ||
                  0,
                total_questions:
                  result.questions?.length || quiz.questions.length,
                time_taken: 0, // Calculate if needed
              });
              setLoading(false);
              return;
            } else if (
              (result.started_at || result.start_at) &&
              !result.submit_at
            ) {
              // Quiz was started but not submitted
              setQuizStatus("started");
              setLoading(false);
              return;
            }
            // If we have result data but no start_at, treat as not started
          }
        } catch (resultErr: any) {
          // Result API failed, continue with start API check
          console.log(
            "Quiz result check failed:",
            resultErr.response?.data?.message
          );
        }

        // If we reach here, quiz result API failed and no local completion data
        // Default to not_started state
        setQuizStatus("not_started");
      } catch (err: any) {
        // General error in status checking
        console.error("Error checking quiz status:", err);
        setQuizStatus("not_started");
        setError("Failed to check quiz status");
      } finally {
        setLoading(false);
      }
    };

    checkQuizStatus();
  }, [
    courseId,
    topicId,
    quiz,
    topicProgressStatus,
    isQuizCompleted,
    getQuizScore,
  ]);

  // Initialize quiz when started
  const handleStartQuiz = useCallback(async () => {
    if (quizStatus === "started") {
      // Quiz already started, just resume
      const duration = parseInt(quiz.duration) * 60; // Convert minutes to seconds
      setTimeRemaining(duration);
      setAnswers({});
      setQuizStarted(true);
      setCurrentQuestionIndex(0);
      setStartTime(Date.now());
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Start quiz via API
      await _QuizService.startQuiz({
        quiz_type: "topic",
        course_id: courseId.toString(),
        topic_id: topicId.toString(),
        quiz_id: quiz.id.toString(),
      });

      const duration = parseInt(quiz.duration) * 60; // Convert minutes to seconds
      setTimeRemaining(duration);
      setAnswers({});
      setQuizStarted(true);
      setCurrentQuestionIndex(0);
      setStartTime(Date.now());
      setQuizStatus("started");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to start quiz");
    } finally {
      setLoading(false);
    }
  }, [quiz, courseId, topicId, quizStatus]);

  // Handle answer selection
  const handleAnswerChange = useCallback(
    async (questionId: number, answerId: number, checked: boolean) => {
      const currentQuestion = quiz.questions.find((q) => q.id === questionId);
      if (!currentQuestion) return;

      setAnswers((prev) => {
        const currentAnswers = prev[questionId] || [];
        let newAnswers: number[];

        if (
          currentQuestion.type === "single-choice" ||
          currentQuestion.type === "fill-in-blank"
        ) {
          // Single choice or fill-in-blank: only one answer
          newAnswers = checked ? [answerId] : [];
        } else {
          // Multiple choice: multiple answers allowed
          if (checked) {
            newAnswers = [...currentAnswers, answerId];
          } else {
            newAnswers = currentAnswers.filter((id) => id !== answerId);
          }
        }

        // Auto-submit the answer to the API
        if (newAnswers.length > 0) {
          _QuizService
            .submitQuizAnswer({
              quiz_type: "topic",
              course_id: courseId.toString(),
              topic_id: topicId.toString(),
              quiz_id: quiz.id.toString(),
              type: currentQuestion.type as
                | "single-choice"
                | "multiple-choice"
                | "fill-in-blank",
              question_id: questionId.toString(),
              answers: newAnswers.map((id) => id.toString()),
            })
            .catch((err) => {
              console.error("Error submitting answer:", err);
            });
        }

        return {
          ...prev,
          [questionId]: newAnswers,
        };
      });
    },
    [quiz, courseId, topicId]
  );

  // Navigation functions
  const nextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowConfirmDialog(true);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Submit quiz handler
  const handleSubmitQuiz = useCallback(async () => {
    setLoading(true);
    setShowConfirmDialog(false);

    try {
      // Submit final quiz
      await _QuizService.submitQuiz({
        quiz_type: "topic",
        course_id: courseId.toString(),
        topic_id: topicId.toString(),
        quiz_id: quiz.id.toString(),
      });

      // Get quiz result - for now we'll simulate since result endpoint has issues
      // TODO: Fix result endpoint when backend resolves the 403 issue

      // Simulate quiz grading locally until result endpoint works
      let correctAnswers = 0;
      const totalQuestions = quiz.questions.length;

      // For demo purposes, we'll simulate some correct answers
      // In a real implementation, this would come from the API
      quiz.questions.forEach((question, index) => {
        const userAnswers = answers[question.id] || [];
        // Simulate: first answer choice is correct for demo
        if (
          userAnswers.length > 0 &&
          userAnswers[0] === question.answers[0].id
        ) {
          correctAnswers++;
        }
      });

      const score = Math.floor(
        (correctAnswers / totalQuestions) * quiz.total_mark
      );
      const passed = score >= quiz.pass_mark;

      setQuizResult({
        passed,
        score,
        total_score: quiz.total_mark,
        correct_answers: correctAnswers,
        total_questions: totalQuestions,
        time_taken: Math.floor((Date.now() - startTime) / 1000),
      });

      // Add to completed quizzes
      addCompletedQuiz({
        courseId,
        chapterId: 0, // We don't have chapterId in this context
        topicId,
        quizId: quiz.id,
        completed: true,
        passed,
        score,
        completedAt: new Date().toISOString(),
      });

      // Notify parent component
      onQuizComplete?.(passed, score);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to submit quiz");
    } finally {
      setLoading(false);
    }
  }, [quiz, courseId, topicId, startTime, addCompletedQuiz, onQuizComplete]);

  // Get current question
  const getCurrentQuestion = (): TopicQuizQuestion | null => {
    if (!quizStarted || currentQuestionIndex >= quiz.questions.length)
      return null;
    return quiz.questions[currentQuestionIndex];
  };

  // Render fill-in-blank question with {{'BLANK'}} replacement
  const renderFillInBlankQuestion = (question: TopicQuizQuestion) => {
    const questionText = question.name;
    const selectedAnswerId = answers[question.id]?.[0];
    const selectedAnswer = question.answers.find(
      (ans) => ans.id === selectedAnswerId
    );

    // Replace {{'BLANK'}} with the selected answer or a placeholder
    const displayText = questionText.replace(
      /{{'BLANK'}}/g,
      selectedAnswer ? `[${selectedAnswer.name}]` : "[____]"
    );

    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 3, lineHeight: 1.6 }}>
          {displayText}
        </Typography>

        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          Choose the correct answer:
        </Typography>

        <RadioGroup
          value={selectedAnswerId?.toString() || ""}
          onChange={(e) =>
            handleAnswerChange(question.id, parseInt(e.target.value), true)
          }
        >
          {question.answers.map((answer) => (
            <FormControlLabel
              key={answer.id}
              value={answer.id.toString()}
              control={<Radio />}
              label={answer.name}
              sx={{
                mb: 1,
                p: 1,
                border: "1px solid #e0e0e0",
                borderRadius: 1,
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            />
          ))}
        </RadioGroup>
      </Box>
    );
  };

  // Render single choice question
  const renderSingleChoiceQuestion = (question: TopicQuizQuestion) => {
    const selectedAnswerId = answers[question.id]?.[0];

    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 3 }}>
          {question.name}
        </Typography>

        <RadioGroup
          value={selectedAnswerId?.toString() || ""}
          onChange={(e) =>
            handleAnswerChange(question.id, parseInt(e.target.value), true)
          }
        >
          {question.answers.map((answer) => (
            <FormControlLabel
              key={answer.id}
              value={answer.id.toString()}
              control={<Radio />}
              label={answer.name}
              sx={{
                mb: 1,
                p: 1,
                border: "1px solid #e0e0e0",
                borderRadius: 1,
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            />
          ))}
        </RadioGroup>
      </Box>
    );
  };

  // Render multiple choice question
  const renderMultipleChoiceQuestion = (question: TopicQuizQuestion) => {
    const selectedAnswers = answers[question.id] || [];

    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 3 }}>
          {question.name}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Select all correct answers:
        </Typography>

        {question.answers.map((answer) => (
          <FormControlLabel
            key={answer.id}
            control={
              <Checkbox
                checked={selectedAnswers.includes(answer.id)}
                onChange={(e) =>
                  handleAnswerChange(question.id, answer.id, e.target.checked)
                }
              />
            }
            label={answer.name}
            sx={{
              display: "block",
              mb: 1,
              p: 1,
              border: "1px solid #e0e0e0",
              borderRadius: 1,
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          />
        ))}
      </Box>
    );
  };

  // Render question based on type
  const renderQuestion = (question: TopicQuizQuestion) => {
    switch (question.type) {
      case "fill-in-blank":
        return renderFillInBlankQuestion(question);
      case "single-choice":
        return renderSingleChoiceQuestion(question);
      case "multiple-choice":
        return renderMultipleChoiceQuestion(question);
      default:
        return renderSingleChoiceQuestion(question);
    }
  };

  // Timer effect
  useEffect(() => {
    if (quizStarted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quizStarted, timeRemaining, handleSubmitQuiz]);

  // Format time display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Calculate progress
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  // Show loading state while checking quiz status
  if (quizStatus === "checking") {
    return (
      <Card sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
        <CardContent sx={{ textAlign: "center", p: 4 }}>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Checking quiz status...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // Show quiz result if completed
  if (quizStatus === "completed" && quizResult) {
    return (
      <Card sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
        <CardContent sx={{ textAlign: "center", p: 4 }}>
          {quizResult.passed ? (
            <CheckCircle sx={{ fontSize: 80, color: "success.main", mb: 2 }} />
          ) : (
            <Cancel sx={{ fontSize: 80, color: "error.main", mb: 2 }} />
          )}

          <Typography variant="h4" gutterBottom>
            {quizResult.passed ? "Quiz Passed!" : "Quiz Not Passed"}
          </Typography>

          <Typography variant="h6" color="text.secondary" gutterBottom>
            {quizResult.passed
              ? "Congratulations! You can proceed to the next topic."
              : "Please review the material and try again."}
          </Typography>

          <Box sx={{ my: 3 }}>
            <Typography
              variant="h3"
              color={quizResult.passed ? "success.main" : "error.main"}
            >
              {quizResult.score}/{quizResult.total_score}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              ({Math.round((quizResult.score / quizResult.total_score) * 100)}%)
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Chip
              label={`${quizResult.correct_answers}/${quizResult.total_questions} Correct`}
              color="success"
              variant="outlined"
            />
            <Chip
              label={`Time: ${formatTime(quizResult.time_taken)}`}
              variant="outlined"
            />
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Show active quiz (one question at a time)
  if (quizStarted) {
    const currentQuestion = getCurrentQuestion();

    return (
      <Box sx={{ maxWidth: 800, mx: "auto", mt: 2 }}>
        {/* Header */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h5">{quiz.name}</Typography>
              <Typography variant="h6" color="primary">
                {formatTime(timeRemaining)}
              </Typography>
            </Box>

            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ height: 8, borderRadius: 4 }}
            />

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </Typography>
          </CardContent>
        </Card>

        {/* Question */}
        {currentQuestion && (
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 4 }}>
              {renderQuestion(currentQuestion)}
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <Card>
          <CardContent>
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
                startIcon={<ArrowBack />}
              >
                Previous
              </Button>

              <Button
                variant="contained"
                onClick={nextQuestion}
                disabled={
                  !currentQuestion || !answers[currentQuestion.id]?.length
                }
                endIcon={
                  currentQuestionIndex ===
                  quiz.questions.length - 1 ? undefined : (
                    <ArrowForward />
                  )
                }
              >
                {currentQuestionIndex === quiz.questions.length - 1
                  ? "Finish"
                  : "Next"}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Confirm Dialog */}
        <Dialog
          open={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
        >
          <DialogTitle>Submit Quiz</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to submit your quiz? You cannot change your
              answers after submission.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
            <Button
              onClick={handleSubmitQuiz}
              variant="contained"
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : "Submit"}
            </Button>
          </DialogActions>
        </Dialog>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
    );
  }

  // Show quiz start screen
  return (
    <Card sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <CardContent sx={{ textAlign: "center", p: 4 }}>
        <QuizIcon sx={{ fontSize: 80, color: "primary.main", mb: 2 }} />

        <Typography variant="h4" gutterBottom>
          {quiz.name}
        </Typography>

        <Box sx={{ my: 3 }}>
          <Chip
            label={`${quiz.questions_count} Questions`}
            sx={{ mr: 1, mb: 1 }}
          />
          <Chip label={`${quiz.duration} Minutes`} sx={{ mr: 1, mb: 1 }} />
          <Chip
            label={`Pass Mark: ${quiz.pass_mark}/${quiz.total_mark}`}
            sx={{ mr: 1, mb: 1 }}
          />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {quizStatus === "started" && (
          <Alert severity="info" sx={{ mb: 3 }}>
            You have already started this quiz. Click "Resume Quiz" to continue
            where you left off.
          </Alert>
        )}

        <Button
          variant="contained"
          size="large"
          onClick={handleStartQuiz}
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : quizStatus === "started" ? (
            "Resume Quiz"
          ) : (
            "Start Quiz"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
