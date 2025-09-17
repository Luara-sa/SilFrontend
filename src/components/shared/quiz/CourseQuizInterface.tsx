import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  LinearProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  TextField,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Chip,
} from "@mui/material";
import {
  _QuizService,
  QuizAnswerRequest,
  QuizSubmissionRequest,
} from "services/quiz.service";
import {
  TopicQuiz,
  TopicQuizQuestion,
  TopicQuizAnswer,
} from "interface/common";

interface CourseQuizInterfaceProps {
  courseId: string;
  topicId: string;
  quiz: TopicQuiz;
  onQuizComplete?: (result: any) => void;
  onQuizExit?: () => void;
}

export const CourseQuizInterface: React.FC<CourseQuizInterfaceProps> = ({
  courseId,
  topicId,
  quiz,
  onQuizComplete,
  onQuizExit,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: number]: string[] }>(
    {}
  );
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Initialize timer
  useEffect(() => {
    if (quizStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quizStarted, timeLeft]);

  const startQuiz = async () => {
    setLoading(true);
    try {
      await _QuizService.startQuiz({
        quiz_type: "topic",
        course_id: courseId,
        topic_id: topicId,
        quiz_id: quiz.id.toString(),
      });

      setQuizStarted(true);
      setTimeLeft(parseInt(quiz.duration) * 60); // Convert minutes to seconds
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to start quiz");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (
    questionId: number,
    selectedAnswers: string[]
  ) => {
    try {
      const answerData: QuizAnswerRequest = {
        quiz_type: "topic",
        course_id: courseId,
        topic_id: topicId,
        quiz_id: quiz.id.toString(),
        type: getCurrentQuestion()?.type || "single-choice",
        question_id: questionId.toString(),
        answers: selectedAnswers,
      };

      await _QuizService.submitQuizAnswer(answerData);
    } catch (err: any) {
      console.error("Error submitting answer:", err);
      // Don't show error to user for individual answer submissions
    }
  };

  const handleAnswerChange = (
    questionId: number,
    answerId: string,
    checked: boolean
  ) => {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return;

    setAnswers((prev) => {
      const currentAnswers = prev[questionId] || [];
      let newAnswers: string[];

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

      // Auto-submit the answer
      if (newAnswers.length > 0) {
        submitAnswer(questionId, newAnswers);
      }

      return {
        ...prev,
        [questionId]: newAnswers,
      };
    });
  };

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

  const handleSubmitQuiz = async () => {
    setSubmitting(true);
    try {
      const submissionData: QuizSubmissionRequest = {
        quiz_type: "topic",
        course_id: courseId,
        topic_id: topicId,
        quiz_id: quiz.id.toString(),
      };

      const result = await _QuizService.submitQuiz(submissionData);
      onQuizComplete?.(result);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to submit quiz");
    } finally {
      setSubmitting(false);
      setShowConfirmDialog(false);
    }
  };

  const getCurrentQuestion = (): TopicQuizQuestion | null => {
    if (!quizStarted || currentQuestionIndex >= quiz.questions.length)
      return null;
    return quiz.questions[currentQuestionIndex];
  };

  const renderFillInBlankQuestion = (question: TopicQuizQuestion) => {
    const questionText = question.name;
    const selectedAnswerId = answers[question.id]?.[0];
    const selectedAnswer = question.answers.find(
      (ans) => ans.id.toString() === selectedAnswerId
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
          value={selectedAnswerId || ""}
          onChange={(e) =>
            handleAnswerChange(question.id, e.target.value, true)
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

  const renderSingleChoiceQuestion = (question: TopicQuizQuestion) => {
    const selectedAnswerId = answers[question.id]?.[0];

    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 3 }}>
          {question.name}
        </Typography>

        <RadioGroup
          value={selectedAnswerId || ""}
          onChange={(e) =>
            handleAnswerChange(question.id, e.target.value, true)
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
                checked={selectedAnswers.includes(answer.id.toString())}
                onChange={(e) =>
                  handleAnswerChange(
                    question.id,
                    answer.id.toString(),
                    e.target.checked
                  )
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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  if (!quizStarted) {
    return (
      <Card sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
        <CardContent sx={{ textAlign: "center", p: 4 }}>
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

          <Button
            variant="contained"
            size="large"
            onClick={startQuiz}
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : "Start Quiz"}
          </Button>
        </CardContent>
      </Card>
    );
  }

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
              {formatTime(timeLeft)}
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
            >
              Previous
            </Button>

            <Box sx={{ display: "flex", gap: 1 }}>
              <Button variant="outlined" onClick={onQuizExit}>
                Exit Quiz
              </Button>

              <Button
                variant="contained"
                onClick={nextQuestion}
                disabled={!answers[currentQuestion?.id || 0]?.length}
              >
                {currentQuestionIndex === quiz.questions.length - 1
                  ? "Finish"
                  : "Next"}
              </Button>
            </Box>
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
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={20} /> : "Submit"}
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
};
