import React, { Fragment, useEffect } from "react";

import { Box } from "@mui/material";

import { ICorrectAnswer, IStudentAnswer } from "interface/common";
import { testReviewStore } from "store/test-review/testreviewStore";

interface Props {
  question: string;
  children?: JSX.Element;
  questionId: number;
  studentAnswer: IStudentAnswer[];
  correct_answer: ICorrectAnswer[];
}

export const Blanks = (props: Props) => {
  const { correct_answer, studentAnswer } = props;

  return (
    <>
      {props.question.split("[balnk]").map((part, index) => (
        <Fragment key={index + Math.random()}>
          {part}

          <Box>
            {part !== "" &&
              studentAnswer.map((sAnswer) => {
                if (+sAnswer.blank_id === index + 1)
                  return (
                    <Box
                      key={`answer-${index + 10}`}
                      sx={{
                        display: "inline-block",
                        backgroundColor:
                          +sAnswer.blank_id === +sAnswer.answer
                            ? "rgba(76, 175, 80, 0.5)"
                            : "#FFC1C1",
                        color:
                          +sAnswer.blank_id === +sAnswer.answer
                            ? "#1E5B63"
                            : "#FF5252",
                        padding: "0 10px",
                        mx: "5px",
                        minWidth: "100px",
                        borderRadius: "3px",
                        minHeight: "30px",
                      }}
                    >
                      <Box>
                        {
                          correct_answer.filter(
                            (cAnswer) => cAnswer.blank_id === +sAnswer.answer
                          )[0]?.answer
                        }
                      </Box>
                    </Box>
                  );
              })}
          </Box>
        </Fragment>
      ))}
    </>
  );
};
