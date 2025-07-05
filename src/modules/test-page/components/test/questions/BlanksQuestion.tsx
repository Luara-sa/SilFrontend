import React, { useState } from "react";

interface QuestionData {
  question_id: number;
  type: string;
  points: number;
  question: string;
  question_extension: any[];
  correct_answer: string;
}

interface Blank {
  blank_id: number;
  answer: string;
}

export const BlanksQuestion = () => {
  const [questionData, setQuestionData] = useState<QuestionData>({
    question_id: 102,
    type: "blanks",
    points: 50,
    question:
      "text text [blank] text text text text text [blank] text text [blank]",
    question_extension: [],
    correct_answer:
      '[{"blank_id":1,"answer":"answer 1"},{"blank_id":2,"answer":"answer 2"},{"blank_id":3,"answer":"answer 3"},{"blank_id":4,"answer":"answer 4"}]',
  });

  const [draggedItem, setDraggedItem] = useState<Blank | null>(null);
  const [submittedAnswers, setSubmittedAnswers] = useState<
    Array<{ answer: string; blank_id: number }>
  >([]);

  const handleDragStart = (e: React.DragEvent, answer: Blank) => {
    setDraggedItem(answer);
  };

  const handleDrop = (e: React.DragEvent, blank_id: number) => {
    e.preventDefault();
    const updatedAnswers = [
      ...submittedAnswers,
      { answer: draggedItem?.answer || "", blank_id },
    ];
    setSubmittedAnswers(updatedAnswers);
    setDraggedItem(null);
  };

  const handleSubmit = () => {
    // send the submittedAnswers array to the backend
    console.log(submittedAnswers);
  };

  const correctAnswers = JSON.parse(questionData.correct_answer).map(
    (answer: any, index: any) => (
      <div
        key={answer.blank_id}
        onDragStart={(e) => handleDragStart(e, answer)}
        onDrop={(e) => handleDrop(e, index + 1)}
        draggable
      >
        {answer.answer}
      </div>
    )
  );

  const blanks = questionData.question.split("[blank]").map((part, index) => (
    <React.Fragment key={index}>
      {part}
      <div
        onDrop={(e) => handleDrop(e, index + 1)}
        onDragOver={(e) => e.preventDefault()}
        style={{
          display: "inline-block",
          backgroundColor: "#ddd",
          padding: "0 10px",
        }}
      >
        {submittedAnswers.find((answer) => answer.blank_id === index + 1)
          ?.answer || ""}
      </div>
    </React.Fragment>
  ));

  return (
    <div>
      <div>{blanks}</div>
      <div>{correctAnswers}</div>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};
