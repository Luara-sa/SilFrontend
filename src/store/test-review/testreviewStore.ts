import { TestReviewType } from "./testReview.type";
import create from "zustand";

interface TestReviewStoreInterface {
  test?: TestReviewType | undefined;
  setTest: (res: any) => void;
}
export const testReviewStore = create<TestReviewStoreInterface>((set: any) => ({
  setTest: (res: any) => set(() => ({ test: res })),
}));
