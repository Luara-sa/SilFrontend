import React, { useCallback, useMemo } from "react";

import { Draggable, Droppable } from "react-beautiful-dnd";
import { Box, Typography } from "@mui/material";

import { testStore } from "store/testStore";

interface Props {
  options: string;
  questionId: number;
}

export const Options = (props: Props) => {
  const [answers] = testStore((state) => [state.answers]);

  const questionAnswer = useMemo(
    () =>
      answers?.filter((answer) => answer.question_id === props.questionId)[0],
    [answers]
  );

  const isDisableDrag = useCallback(
    (index: number) =>
      (questionAnswer?.student_answer as any)?.filter(
        (stAnswer: any) => +stAnswer.answer === index + 1
      ).length > 0,
    [answers]
  );

  return JSON.parse(props.options).map((answer: any, index: any) => (
    <Droppable droppableId={`answer&${index + 1}`} key={index + Math.random()}>
      {(providedDrop, snapshot) => {
        return (
          <Box ref={providedDrop.innerRef} {...providedDrop.droppableProps}>
            <Draggable
              index={index + 1}
              draggableId={`${index + 1}`}
              isDragDisabled={isDisableDrag(index)}
            >
              {(provided, snapshot) => {
                return (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      columnGap: "20px",
                    }}
                  >
                    <Box
                      sx={{
                        borderRight: "1px solid gray.main",
                        width: "40.5px",
                      }}
                    >
                      <Box
                        sx={{
                          width: "40px",
                          height: "40px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: isDisableDrag(index)
                            ? "rgba(76, 175, 80, 0.5)"
                            : "#D9D9D9",
                          color: "gray.main",
                          borderRadius: "10px 0 0 10px",
                          fontSize: "14px",
                        }}
                      >
                        {index + 1}
                      </Box>
                    </Box>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        color: isDisableDrag(index) ? "gray.main" : "#000",
                      }}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {answer.answer}
                    </Typography>
                  </Box>
                );
              }}
            </Draggable>
            {/* {providedDrop.placeholder} */}
          </Box>
        );
      }}
    </Droppable>
  ));
};
