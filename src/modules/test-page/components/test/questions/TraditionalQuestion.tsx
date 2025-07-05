import React from "react";

import { Box, Typography } from "@mui/material";

import { Question } from "interface/common";
import { TextFieldStyled } from "components/styled";
import { testStore } from "store/testStore";
import { useDebounce } from "hooks/useDebounce";
import shallow from "zustand/shallow";

interface Props {
  question: Question;
  questionNumber: number;
  isPlacement?: boolean;
  isReview?: boolean;
}

export const TraditionalQuestion = (props: Props) => {
  const { question, questionNumber, isPlacement, isReview } = props;
  const [answers, setAnswers] = testStore(
    (state) => [state.answers, state.setAnswers],
    shallow
  );

  const handleAnswerChange = useDebounce(
    (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      if (answers) {
        if (answers.find((answer) => answer.question_id === question.id)) {
          setAnswers([
            ...answers.filter((answer) => answer.question_id !== question.id),
            {
              question_id: question.id,
              student_answer: event.target.value,
              correct_answer: question.correct_answer.en,
            },
          ]);
        } else {
          setAnswers([
            ...answers,
            {
              question_id: question.id,
              student_answer: event.target.value,
              correct_answer: question.correct_answer.en,
            },
          ]);
        }
      } else {
        setAnswers([
          {
            question_id: question.id,
            student_answer: event.target.value,
            correct_answer: question.correct_answer.en,
          },
        ]);
      }
    },
    1000
  );

  return (
    <Box
      sx={{
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.25)",
        borderRadius: "10px",
        px: "50px",
        py: "30px",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          sx={{ fontSize: "16px", fontWeight: "700", color: "primary.main" }}
        >
          Question #{questionNumber}
        </Typography>
      </Box>
      {/* Question title */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: "25px",
        }}
      >
        <Typography sx={{ fontSize: "18px", flex: { xs: "1", lg: "0.85" } }}>
          <div dangerouslySetInnerHTML={{ __html: question.question.en }} />
        </Typography>
        {!isPlacement && (
          <Typography
            sx={{
              display: { xs: "none", lg: "flex" },
              color: "warning.main",
              fontWeight: "700",
              fontSize: "18px",
            }}
          >
            {question.points}
            <Typography
              component="span"
              sx={{
                color: "warning.main",
                fontWeight: "700",
                fontSize: "18px",
                ml: "5px",
              }}
            >
              deg
            </Typography>
          </Typography>
        )}
      </Box>
      {/* Question Answer */}
      <Box
        sx={{
          mt: "25px",
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          rowGap: "10px",
        }}
      >
        <TextFieldStyled
          variant="outlined"
          fullWidth
          multiline
          rows={10}
          placeholder={
            !isReview ? "Enter your answer..." : "There is no answer"
          }
          disabled={isReview}
          onChange={handleAnswerChange}
          sx={{
            "& .MuiInputBase-multiline ": { padding: 0 },
          }}
        />
      </Box>
    </Box>
  );
};
