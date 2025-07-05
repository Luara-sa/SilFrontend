import React from "react";

import { Box, Typography } from "@mui/material";
import { DragDropContext, OnDragEndResponder } from "react-beautiful-dnd";

import { Question } from "interface/common";
import { testStore } from "store/testStore";

import { Blanks } from "./Blanks";
import { Options } from "./Options";

interface Props {
  question: Question;
  questionNumber: number;
  isPlacement?: boolean;
}

export const BlankQuestion = (props: Props) => {
  const [answers, setAnswers] = testStore((state) => [
    state.answers,
    state.setAnswers,
  ]);

  const handleDragEnd: OnDragEndResponder = ({
    destination,
    source,
    draggableId,
  }) => {
    console.log("destination: ", destination);
    console.log("source: ", source);
    console.log("draggableId: ", draggableId);
    if (!destination) {
      return;
    }
    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    ) {
      return;
    }

    const isDroppedFromBlank = source.droppableId.includes("blank_id");
    const isDroppedAtBlank = destination?.droppableId.includes("blank_id");

    const destDroppableId = destination?.droppableId.split("&")[1] as string;
    const sourDroppableId = source?.droppableId.split("&")[1] as string;

    // * If there is answers for deferent questions
    if (answers) {
      // * The drag and drop question has already some answers
      if (answers.find((answer) => answer.question_id === props.question.id)) {
        const answerExceptDragQuestion = answers.filter(
          (answer) => answer.question_id !== props.question.id
        );
        const dragQuestion = answers.filter(
          (answer) => answer.question_id === props.question.id
        )[0];

        // * from (blank) to (option)
        if (isDroppedFromBlank && !isDroppedAtBlank) {
          const isOptionDiabled = (dragQuestion.student_answer as any).filter(
            (answer: any) => +answer.blank_id === +destDroppableId
          )[0];
          // * Do no changes if the option already taken
          if (+destDroppableId === +isOptionDiabled.answer) {
            return;
          }
          setAnswers([
            ...answerExceptDragQuestion,
            {
              question_id: props.question.id,
              student_answer: [
                ...(dragQuestion.student_answer as any).filter(
                  (answer: any) => +answer.blank_id !== +sourDroppableId
                ),
                { answer: destDroppableId, blank_id: +sourDroppableId },
              ],
              correct_answer: props.question.correct_answer.en,
            },
          ]);
          return;
        }

        // * from (blank) to (blank)
        else if (isDroppedFromBlank && isDroppedAtBlank) {
          const answerFromBlank = (dragQuestion.student_answer as any).filter(
            (answer: any) => +answer.blank_id === +sourDroppableId
          )[0];
          const answerToBlank = (dragQuestion.student_answer as any).filter(
            (answer: any) => +answer.blank_id === +destDroppableId
          )[0];

          setAnswers([
            ...answerExceptDragQuestion,
            {
              question_id: props.question.id,
              // * handle more than one choise being draggd
              student_answer: [
                ...(dragQuestion.student_answer as any).filter(
                  (answer: any) =>
                    +answer.blank_id !== +destDroppableId &&
                    +answer.blank_id !== +sourDroppableId
                ),
                { ...answerFromBlank, blank_id: +answerToBlank.blank_id },
                { ...answerToBlank, blank_id: +answerFromBlank.blank_id },
              ],
              correct_answer: props.question.correct_answer.en,
            },
          ]);
          return;
        }

        //* from (option) to (blank)
        setAnswers([
          ...answerExceptDragQuestion,
          {
            question_id: props.question.id,
            // * handle more than one choise being draggd
            student_answer: [
              ...(dragQuestion.student_answer as any).filter(
                (answer: any) => +answer.blank_id !== +destDroppableId
              ),
              { answer: draggableId, blank_id: +destDroppableId },
            ],
            correct_answer: props.question.correct_answer.en,
          },
        ]);
        // * If there is answers for deferent questions except drag and drop
      } else {
        setAnswers([
          ...answers,
          {
            question_id: props.question.id,
            student_answer: [
              { answer: draggableId, blank_id: +destDroppableId },
            ],
            correct_answer: props.question.correct_answer.en,
          },
        ]);
      }
      // * No answer found
    } else {
      setAnswers([
        {
          question_id: props.question.id,
          student_answer: [{ answer: draggableId, blank_id: +destDroppableId }],
          correct_answer: props.question.correct_answer.en,
        },
      ]);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
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
            <Blanks
              question={props.question.question.en}
              questionId={props.question.id}
            ></Blanks>
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
          {/* <CorrectAnswers /> */}
          {props.question.correct_answer.en && (
            <Options
              options={props.question.correct_answer.en}
              questionId={props.question.id}
            />
          )}
        </Box>
      </Box>
    </DragDropContext>
  );
};
