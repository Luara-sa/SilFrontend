import { Box, Typography } from "@mui/material";
import { Question } from "interface/common";
import React, { MouseEvent, useEffect } from "react";
import { testStore } from "store/testStore";
import { RadioOption } from "./RadioOption";
import { testReviewStore } from "store/test-review/testreviewStore";

interface Props {
  question: Question;
  type: "multiple_choice" | "blanks" | "true_false" | "traditional";
  questionNumber: number;
  isPlacement?: boolean;
}

export const McqQuestion = (props: Props) => {
  const [test] = testReviewStore((state) => [state.test]);
  const answers = JSON.parse(test?.data?.answers ?? "");

  const question = answers.find(
    (answer: any) => answer?.question_id === props?.question?.id
  );

  // test?.data?.find((item)=>item?.answers)

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
        {/* <Typography
          sx={{
            display: { xs: "flex", lg: "none" },
            color: "warning.main",
            fontWeight: "700",
            fontSize: "18px",
          }}
        >
          20 Deg
        </Typography> */}
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
        {props.question.question_extension.en.map((answer, index) => (
          <Box key={index}>
            <RadioOption
              optioncount={
                index + 1 === 1
                  ? "A"
                  : index + 1 === 2
                  ? "B"
                  : index + 1 === 3
                  ? "C"
                  : index + 1 === 4
                  ? "D"
                  : index + 1 === 5
                  ? "E"
                  : "F"
              }
              title={answer}
              type={props?.type}
              question={question}
              optionId={index + 1}
              active={Boolean(
                props?.question?.correct_answer?.en === `${index + 1}`
              )}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};
