import React, { useEffect, useState } from "react";

import { Box, Typography } from "@mui/material";

import { ICorrectAnswer, IStudentAnswer, Question } from "interface/common";
import { testStore } from "store/testStore";

import { Blanks } from "./Blanks";
import { Options } from "./Options";
import { testReviewStore } from "store/test-review/testreviewStore";

interface Props {
  question: Question;
  type: "multiple_choice" | "blanks" | "true_false" | "traditional";
  questionNumber: number;
  isPlacement?: boolean;
}

export const BlankQuestion = (props: Props) => {
  const test = testReviewStore((state) => state.test);

  const [studentAnswer, setStudentAnswer] = useState<
    IStudentAnswer[] | undefined
  >(undefined);

  useEffect(() => {
    test?.data.answers &&
      setStudentAnswer(
        JSON.parse(test?.data.answers).filter(
          (answer: any) => +answer.question_id === +props.question.id
        )[0].student_answer
      );

    return () => {};
  }, [test]);

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
          Question #{props.questionNumber}
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
        <Box
          sx={{
            fontSize: "18px",
            flex: { xs: "1", lg: "0.85" },
            display: "flex",
            flexWrap: "wrap",
            rowGap: "10px",
            maxWidth: "95%",
            wordBreak: "break-word",
          }}
        >
          {studentAnswer && (
            <Blanks
              question={props.question.question.en}
              questionId={props.question.id}
              studentAnswer={studentAnswer}
              correct_answer={
                JSON.parse(props.question.correct_answer.en) as ICorrectAnswer[]
              }
            ></Blanks>
          )}
        </Box>
        {!props.isPlacement && (
          <Typography
            sx={{
              display: { xs: "none", lg: "flex" },
              color: "warning.main",
              fontWeight: "700",
              fontSize: "18px",
            }}
          >
            {props.question.points}
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
    </Box>
  );
};
