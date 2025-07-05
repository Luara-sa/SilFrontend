import { TestType } from "interface/common";
import create from "zustand";

export type AnswersType = {
  question_id: number;
  student_answer: number | string | { answer: string; blank_id: number }[];
  correct_answer: number | string | { answer: string; blank_id: number }[];
};

interface TestStoreInterface {
  test?: TestType;
  setTest: (res: any) => void;
  clearTest: () => void;

  answers?: AnswersType[];
  setAnswers: (data: AnswersType[]) => void;
  clearAnswer: () => void;

  mark?: number;
  setMark: (data: any) => void;
  clearMark: () => void;
  totalDefaultPoint: number;
  claculateTotalDefaultPoint: (test: TestType) => void;
}

export const testStore = create<TestStoreInterface>((set: any) => ({
  setTest: (res: any) => set(() => ({ test: res })),
  clearTest: () => set(() => ({ test: undefined })),

  setAnswers: (res) => set(() => ({ answers: res })),
  clearAnswer: () => set(() => ({ answers: undefined })),

  setMark: (res) => set(() => ({ mark: res })),
  clearMark: () => set(() => ({ mark: undefined })),

  totalDefaultPoint: 0,
  claculateTotalDefaultPoint: (test) =>
    set(() => {
      let total = 0;
      test?.questions.map((question) => {
        total += question.points;
      });
      return {
        totalDefaultPoint: total,
      };
    }),
}));
