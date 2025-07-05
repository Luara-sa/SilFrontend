import React, { Fragment, useMemo } from "react";

import { Draggable, Droppable } from "react-beautiful-dnd";
import { Box } from "@mui/material";

import { testStore } from "store/testStore";

interface Props {
  question: string;
  children?: JSX.Element;
  questionId: number;
}

export const Blanks = (props: Props) => {
  const [answers] = testStore((state) => [state.answers]);

  const questionAnswer = useMemo(
    () =>
      answers?.filter((answer) => answer.question_id === props.questionId)[0],
    [answers]
  );

  return (
    <>
      {props.question.split("[balnk]").map((part, index) => (
        <Fragment key={index + Math.random()}>
          {part}
          <Droppable droppableId={`blank_id&${index + 1}`}>
            {(provided, snapshot) => {
              return (
                <Box ref={provided.innerRef} {...provided.droppableProps}>
                  {part !== "" && (
                    <Box
                      sx={{
                        display: "inline-block",
                        backgroundColor: "#ddd !important",
                        padding: "0 10px",
                        mx: "5px",
                        minWidth: "100px",
                        borderRadius: "3px",
                        minHeight: "30px",
                      }}
                    >
                      {(questionAnswer?.student_answer as any)?.map(
                        (answer: any) => {
                          if (answer.blank_id === index + 1) {
                            return (
                              <Draggable
                                index={index + 10}
                                draggableId={`${index + 10}`}
                                key={index + 10}
                              >
                                {(provided, snapshot) => {
                                  return (
                                    <Box
                                      key={`answer-${index + 10}`}
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                    >
                                      {
                                        JSON.parse(
                                          questionAnswer?.correct_answer as string
                                        )[+answer.answer - 1].answer
                                      }
                                    </Box>
                                  );
                                }}
                              </Draggable>
                            );
                          }
                        }
                      )}
                    </Box>
                  )}
                  {/* {provided.placeholder} */}
                </Box>
              );
            }}
          </Droppable>
        </Fragment>
      ))}
    </>
  );
};
