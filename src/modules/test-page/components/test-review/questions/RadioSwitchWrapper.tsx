import React, { memo, useEffect, useState } from "react";
import { RadioOptionVariants } from "./RadioOptionVariants";

interface Props {
  question: any;
  optionId?: string | number;
  type: "multiple_choice" | "blanks" | "true_false" | "traditional";
  optioncount: string;
}

const RadioSwitchWrapper = (props: Props) => {
  const [variants, setVariants] = useState<"student" | "correct" | "default">(
    "default"
  );

  const isTrueFalseQuestion = props?.type === "true_false";
  const isMultiChoiceQuestion =
    props?.type === "multiple_choice" && props?.question && props?.optioncount;

  useEffect(() => {
    if (isMultiChoiceQuestion && props.optionId) {
      if (+props?.question?.correct_answer === +props?.optionId) {
        setVariants("correct");
      } else if (+props.optionId === +props?.question?.student_answer) {
        setVariants("student");
      } else {
        setVariants("default");
      }
    } else if (isTrueFalseQuestion && props?.optionId) {
      const studentAnswer = props?.question?.student_answer === "true" ? 1 : 2;
      const correctAnswer = props?.question?.correct_answer === "ture" ? 1 : 2;

      if (correctAnswer === +props.optionId) {
        setVariants("correct");
      } else if (+props.optionId === studentAnswer) {
        setVariants("student");
      } else {
        setVariants("default");
      }
    }
  }, [props]);

  return (
    <RadioOptionVariants
      active
      optioncount={props.optioncount}
      variants={variants}
    />
  );
};

export default memo(RadioSwitchWrapper);
