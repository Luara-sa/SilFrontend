import { Question, StringDouble } from "interface/common";

interface Data {
  id: number;
  user_id: number;
  test_id: number;
  mark: number;
  is_placement_done: number;
  test_city: string;
  answers: string;
  test: {
    active: number;
    id: number;
    created_at: Date;
    deleted_at?: Date;
    is_experimental: number;
    is_placement: number;
    is_question_test: number;
    is_required: number;
    name: StringDouble;
    updated_at?: Date;
  };
}

export interface TestReviewType {
  data: Data;
  questions: Question[];
}
