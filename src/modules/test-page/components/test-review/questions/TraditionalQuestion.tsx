import React from "react";

import { Box, Typography } from "@mui/material";

import { Question } from "interface/common";
import { testReviewStore } from "store/test-review/testreviewStore";

import { TextFieldStyled } from "components/styled";

interface Props {
  question: Question;
  questionNumber: number;
  isPlacement?: boolean;
}

export const TraditionalQuestion = (props: Props) => {
  const { questionNumber, isPlacement } = props;
  const test = testReviewStore((state) => state.test);

  const answers = JSON.parse(test?.data?.answers ?? "");

  const questionAnswer = answers.find(
    (answer: any) => answer?.question_id === props?.question?.id
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
          <div
            dangerouslySetInnerHTML={{ __html: props.question.question.en }}
          />
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
          defaultValue={questionAnswer.student_answer}
          disabled
          placeholder={"There is no answer"}
          sx={{
            "& .MuiInputBase-multiline ": { padding: 0 },
          }}
        />
      </Box>
    </Box>
  );
};
