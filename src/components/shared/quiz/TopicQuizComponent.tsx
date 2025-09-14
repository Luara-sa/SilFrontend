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
} from "@mui/material";
import {
  Timer,
  CheckCircle,
  Cancel,
  Quiz as QuizIcon,
} from "@mui/icons-material";
import {
  TopicQuiz,
  TopicQuizQuestion,
  TopicQuizAnswer,
} from "interface/common";
import { useQuizProgressStore } from "store/quizProgressStore";

interface TopicQuizComponentProps {
  courseId: number;
  chapterId: number;
  topicId: number;
  quiz: TopicQuiz;
  onQuizComplete?: (passed: boolean, score: number) => void;
}

interface QuestionAnswer {
  question_id: number;
  answer_ids: number[];
}

interface QuizResult {
  score: number;
  total_mark: number;
  percentage: number;
  passed: boolean;
  correct_answers: number;
  total_questions: number;
  time_taken: number;
}

export const TopicQuizComponent: React.FC<TopicQuizComponentProps> = ({
  courseId,
  chapterId,
  topicId,
  quiz,
  onQuizComplete,
}) => {
  const { addCompletedQuiz } = useQuizProgressStore();

  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [startTime, setStartTime] = useState<number>(0);

  // Initialize quiz when started
  const handleStartQuiz = useCallback(() => {
    const duration = parseInt(quiz.duration) * 60; // Convert minutes to seconds
    setTimeRemaining(duration);
    setAnswers(
      quiz.questions.map((q) => ({ question_id: q.id, answer_ids: [] }))
    );
    setQuizStarted(true);
    setStartTime(Date.now());
  }, [quiz]);

  // Submit quiz handler
  const handleSubmitQuiz = useCallback(() => {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    // Simple scoring logic (this would normally be done on the server)
    let correctAnswers = 0;
    const totalQuestions = quiz.questions.length;

    // For demo purposes, we'll just calculate a score based on answered questions
    const answeredQuestions = answers.filter(
      (a) => a.answer_ids.length > 0
    ).length;
    const percentage = Math.round((answeredQuestions / totalQuestions) * 100);
    const score = Math.round((percentage / 100) * quiz.total_mark);
    const passed = score >= quiz.pass_mark;

    const result: QuizResult = {
      score,
      total_mark: quiz.total_mark,
      percentage,
      passed,
      correct_answers: answeredQuestions, // Simplified
      total_questions: totalQuestions,
      time_taken: timeTaken,
    };

    setQuizResult(result);
    setQuizStarted(false);

    // Save progress
    addCompletedQuiz({
      courseId,
      chapterId,
      topicId,
      quizId: quiz.id,
      completed: true,
      passed: result.passed,
      score: result.score,
      completedAt: new Date().toISOString(),
    });

    // Notify parent
    if (onQuizComplete) {
      onQuizComplete(result.passed, result.score);
    }
  }, [
    quiz,
    answers,
    startTime,
    courseId,
    chapterId,
    topicId,
    addCompletedQuiz,
    onQuizComplete,
  ]);

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (quizStarted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Auto-submit when time runs out
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [quizStarted, timeRemaining, handleSubmitQuiz]);

  const handleAnswerChange = useCallback(
    (questionId: number, answerId: number, isMultiple: boolean = false) => {
      setAnswers((prev) =>
        prev.map((answer) => {
          if (answer.question_id === questionId) {
            if (isMultiple) {
              // Multiple choice - toggle answer
              const exists = answer.answer_ids.includes(answerId);
              return {
                ...answer,
                answer_ids: exists
                  ? answer.answer_ids.filter((id) => id !== answerId)
                  : [...answer.answer_ids, answerId],
              };
            } else {
              // Single choice - replace answer
              return { ...answer, answer_ids: [answerId] };
            }
          }
          return answer;
        })
      );
    },
    []
  );

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const renderQuestion = (question: TopicQuizQuestion, index: number) => {
    const questionAnswer = answers.find((a) => a.question_id === question.id);

    return (
      <Card key={question.id} sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Question {index + 1}
            </Typography>
          </Box>

          <Typography variant="body1" sx={{ mb: 3 }}>
            {question.name}
          </Typography>

          <FormControl component="fieldset" fullWidth>
            {question.type === "single-choice" && (
              <RadioGroup
                value={questionAnswer?.answer_ids[0] || ""}
                onChange={(e) =>
                  handleAnswerChange(question.id, parseInt(e.target.value))
                }
              >
                {question.answers.map((answer: TopicQuizAnswer) => (
                  <FormControlLabel
                    key={answer.id}
                    value={answer.id}
                    control={<Radio />}
                    label={answer.name}
                  />
                ))}
              </RadioGroup>
            )}

            {question.type === "multiple-choice" && (
              <FormGroup>
                {question.answers.map((answer: TopicQuizAnswer) => (
                  <FormControlLabel
                    key={answer.id}
                    control={
                      <Checkbox
                        checked={
                          questionAnswer?.answer_ids.includes(answer.id) ||
                          false
                        }
                        onChange={() =>
                          handleAnswerChange(question.id, answer.id, true)
                        }
                      />
                    }
                    label={answer.name}
                  />
                ))}
              </FormGroup>
            )}

            {question.type === "true-false" && (
              <RadioGroup
                value={questionAnswer?.answer_ids[0] || ""}
                onChange={(e) =>
                  handleAnswerChange(question.id, parseInt(e.target.value))
                }
              >
                {question.answers.map((answer: TopicQuizAnswer) => (
                  <FormControlLabel
                    key={answer.id}
                    value={answer.id}
                    control={<Radio />}
                    label={answer.name}
                  />
                ))}
              </RadioGroup>
            )}

            {question.type === "fill-in-blank" && (
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type your answer here..."
                onChange={(e) => {
                  // For text answers, we'd need to handle this differently
                  // This is a simplified implementation
                }}
              />
            )}
          </FormControl>
        </CardContent>
      </Card>
    );
  };

  // Show quiz results
  if (quizResult) {
    return (
      <Card sx={{ m: 2 }}>
        <CardContent sx={{ textAlign: "center" }}>
          {quizResult.passed ? (
            <CheckCircle sx={{ fontSize: 64, color: "success.main", mb: 2 }} />
          ) : (
            <Cancel sx={{ fontSize: 64, color: "error.main", mb: 2 }} />
          )}

          <Typography variant="h4" gutterBottom>
            {quizResult.passed ? "Congratulations!" : "Better Luck Next Time"}
          </Typography>

          <Typography variant="h6" sx={{ mb: 2 }}>
            Score: {quizResult.score}/{quizResult.total_mark} (
            {quizResult.percentage}%)
          </Typography>

          <Typography variant="body1" sx={{ mb: 2 }}>
            Correct Answers: {quizResult.correct_answers}/
            {quizResult.total_questions}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Time Taken: {Math.floor(quizResult.time_taken / 60)}:
            {(quizResult.time_taken % 60).toString().padStart(2, "0")}
          </Typography>

          <Button
            variant="contained"
            onClick={() => {
              setQuizResult(null);
              setQuizStarted(false);
            }}
          >
            Retake Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Show active quiz
  if (quizStarted) {
    return (
      <Box sx={{ m: 2 }}>
        {/* Quiz Header */}
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
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Timer />
                <Typography
                  variant="h6"
                  color={timeRemaining < 300 ? "error" : "primary"}
                >
                  {formatTime(timeRemaining)}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <Chip label={`${quiz.questions_count} Questions`} />
              <Chip label={`${quiz.total_mark} Total Marks`} />
              <Chip label={`Pass Mark: ${quiz.pass_mark}`} />
            </Box>

            <LinearProgress
              variant="determinate"
              value={
                (answers.filter((a) => a.answer_ids.length > 0).length /
                  quiz.questions.length) *
                100
              }
              sx={{ mt: 2 }}
            />
            <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
              Progress: {answers.filter((a) => a.answer_ids.length > 0).length}/
              {quiz.questions.length} questions answered
            </Typography>
          </CardContent>
        </Card>

        {/* Questions */}
        {quiz.questions.map((question, index) =>
          renderQuestion(question, index)
        )}

        {/* Submit Button */}
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button variant="contained" size="large" onClick={handleSubmitQuiz}>
            Submit Quiz
          </Button>
        </Box>
      </Box>
    );
  }

  // Show quiz start screen
  return (
    <Box sx={{ m: 2 }}>
      <Card>
        <CardContent sx={{ textAlign: "center" }}>
          <QuizIcon sx={{ fontSize: 64, color: "primary.main", mb: 2 }} />

          <Typography variant="h5" gutterBottom>
            {quiz.name}
          </Typography>

          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 3 }}
          >
            <Chip label={`${quiz.questions_count} Questions`} />
            <Chip label={`${quiz.duration} minutes`} />
            <Chip label={`Pass: ${quiz.pass_mark}/${quiz.total_mark}`} />
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            You have {quiz.duration} minutes to complete this quiz. You need to
            score at least {quiz.pass_mark} out of {quiz.total_mark} to pass.
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={handleStartQuiz}
            sx={{ minWidth: 200 }}
          >
            Start Quiz
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};
