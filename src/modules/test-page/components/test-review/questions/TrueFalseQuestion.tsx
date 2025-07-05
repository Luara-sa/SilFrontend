import { Box, Typography } from "@mui/material";
import { Question } from "interface/common";
import React, { MouseEvent } from "react";
import { testStore } from "store/testStore";
import { RadioOption } from "./RadioOption";
import { testReviewStore } from "store/test-review/testreviewStore";

interface Props {
  question: Question;
  type: "multiple_choice" | "blanks" | "true_false" | "traditional";
  questionNumber: number;
  isPlacement?: boolean;
}

export const TrueFalseQuestion = (props: Props) => {
  const [test] = testReviewStore((state) => [state.test]);
  const answers = JSON.parse(test?.data?.answers ?? "");

  const question = answers.find(
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
        {[true, false].map((bool, index) => (
          <Box key={index}>
            <RadioOption
              optioncount={index + 1 === 1 ? "A" : "B"}
              title={`${bool}`}
              type={props?.type}
              question={question}
              optionId={index + 1}
              active={Boolean(
                props?.question?.correct_answer?.en === `${bool}`
              )}
            />
          </Box>
        ))}

        {/* {props.question.question_extension.en.map((answer, index) => (
          <Box onClick={(e) => handleCheckAnswer(e, index + 1)} key={index}>
            <RadioOption
              title={answer}
              active={Boolean(
                answers?.find(
                  (answer) => answer.question_id === props.question.id
                )?.student_answer ===
                  index + 1
              )}
            />
          </Box>
        ))} */}
      </Box>
    </Box>
  );
};
