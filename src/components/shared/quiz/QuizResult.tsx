import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Alert,
  LinearProgress,
  Grid,
  Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { QuizResult as QuizResultType } from "services/quiz.service";

interface QuizResultProps {
  result: QuizResultType;
  onRetakeQuiz?: () => void;
  onContinue?: () => void;
  showRetakeOption?: boolean;
}

export const QuizResult: React.FC<QuizResultProps> = ({
  result,
  onRetakeQuiz,
  onContinue,
  showRetakeOption = false,
}) => {
  const isPassed = result.is_passed;
  const scorePercentage =
    ((result.student_mark || result.score || 0) / result.total_mark) * 100;
  const passPercentage = ((result.pass_mark || 0) / result.total_mark) * 100;

  const correctAnswers = result.questions.filter((q) => q.is_correct).length;
  const totalQuestions = result.questions.length;

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      {/* Main Result Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ textAlign: "center", p: 4 }}>
          {isPassed ? (
            <CheckCircleIcon
              sx={{ fontSize: 80, color: "success.main", mb: 2 }}
            />
          ) : (
            <CancelIcon sx={{ fontSize: 80, color: "error.main", mb: 2 }} />
          )}

          <Typography variant="h4" gutterBottom>
            {isPassed ? "Congratulations!" : "Quiz Not Passed"}
          </Typography>

          <Typography variant="h6" color="text.secondary" gutterBottom>
            {isPassed
              ? "You have successfully passed the quiz!"
              : "You need to improve your score to pass."}
          </Typography>

          <Box sx={{ my: 3 }}>
            <Typography
              variant="h3"
              color={isPassed ? "success.main" : "error.main"}
            >
              {result.student_mark}/{result.total_mark}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              ({scorePercentage.toFixed(1)}%)
            </Typography>
          </Box>

          <Alert
            severity={isPassed ? "success" : "warning"}
            sx={{ mb: 3, maxWidth: 400, mx: "auto" }}
          >
            {isPassed
              ? `You scored above the pass mark of ${result.pass_mark}/${result.total_mark}`
              : `You need ${result.pass_mark}/${result.total_mark} to pass`}
          </Alert>
        </CardContent>
      </Card>

      {/* Score Details */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quiz Summary
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Your Score
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={scorePercentage}
                  sx={{ height: 8, borderRadius: 4, mb: 1 }}
                  color={isPassed ? "success" : "error"}
                />
                <Typography variant="body2">
                  {result.student_mark} / {result.total_mark} (
                  {scorePercentage.toFixed(1)}%)
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Pass Mark
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={passPercentage}
                  sx={{ height: 8, borderRadius: 4, mb: 1 }}
                  color="primary"
                />
                <Typography variant="body2">
                  {result.pass_mark} / {result.total_mark} (
                  {passPercentage.toFixed(1)}%)
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Chip
                  label={`${correctAnswers}/${totalQuestions} Correct`}
                  color="success"
                  variant="outlined"
                />
                <Chip
                  label={`${
                    totalQuestions - correctAnswers
                  }/${totalQuestions} Incorrect`}
                  color="error"
                  variant="outlined"
                />
                {(result.started_at || result.start_at) && (
                  <Chip
                    label={`Started: ${new Date(
                      result.started_at || result.start_at || ""
                    ).toLocaleString()}`}
                    variant="outlined"
                  />
                )}
                {(result.finished_at || result.submit_at) && (
                  <Chip
                    label={`Finished: ${new Date(
                      result.finished_at || result.submit_at || ""
                    ).toLocaleString()}`}
                    variant="outlined"
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Question Review */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Question Review
          </Typography>

          {result.questions.map((question, index) => (
            <Box key={question.id} sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography variant="subtitle1" sx={{ mr: 2 }}>
                  Question {index + 1}
                </Typography>
                {question.is_correct ? (
                  <Chip
                    icon={<CheckCircleIcon />}
                    label="Correct"
                    color="success"
                    size="small"
                  />
                ) : (
                  <Chip
                    icon={<CancelIcon />}
                    label="Incorrect"
                    color="error"
                    size="small"
                  />
                )}
                <Typography variant="body2" sx={{ ml: "auto" }}>
                  {question.mark} points
                </Typography>
              </Box>

              <Typography variant="body1" sx={{ mb: 2 }}>
                {question.name}
              </Typography>

              <Box sx={{ pl: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Your answer: {question.student_answers.join(", ")}
                </Typography>
                <Typography variant="body2" color="success.main">
                  Correct answer: {question.correct_answers.join(", ")}
                </Typography>
              </Box>

              {index < result.questions.length - 1 && (
                <Divider sx={{ mt: 2 }} />
              )}
            </Box>
          ))}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent sx={{ textAlign: "center" }}>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {showRetakeOption && !isPassed && (
              <Button variant="outlined" onClick={onRetakeQuiz}>
                Retake Quiz
              </Button>
            )}

            <Button variant="contained" onClick={onContinue}>
              {isPassed ? "Continue Learning" : "Review Material"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
