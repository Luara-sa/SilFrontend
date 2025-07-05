import { _axios } from "interceptors/http-config";
import { AxiosResponse } from "axios";

export interface PlacementTest {
  id: number;
  name: string;
  duration: number;
  total_mark: number;
  pass_mark: number;
  expire_date: string;
  created_at: string;
}

export interface PlacementTestPagination {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
  count: number;
  has_next: boolean;
  next_page_url: string | null;
  previous_page_url: string | null;
  pagination_name: string;
}

export interface PlacementTestResponse {
  status: boolean;
  message: string;
  data: {
    content: PlacementTest[];
    pagination: PlacementTestPagination;
  };
}

// Quiz Question Interfaces
export interface QuizAnswer {
  id: number;
  name: string;
}

export interface QuizQuestion {
  id: number;
  type: "single-choice" | "multiple-choice" | "fill-in-blank";
  name: string;
  answers: QuizAnswer[];
}

export interface Quiz {
  id: number;
  name: string;
  total_mark: number;
  pass_mark: number;
  expire_date: string;
  duration: string;
  questions_count: number;
  questions: QuizQuestion[];
}

export interface PlacementTestDetail {
  id: number;
  name: string;
  topic: {
    id: number;
    quiz: Quiz;
  };
}

export interface PlacementTestDetailResponse {
  status: boolean;
  message: string;
  data: PlacementTestDetail;
}

export interface BasicResponse {
  status: boolean;
  message: string;
  data: null;
}

// Answer submission interfaces
export interface QuestionAnswer {
  placement_test_id: string;
  quiz_id: string;
  type: "single-choice" | "multiple-choice" | "fill-in-blank";
  question_id: string;
  answers: string[]; // Array of answer IDs
}

export interface FinalQuizSubmission {
  placement_test_id: string;
  quiz_id: string;
}

class PlacementTestService {
  private static _instance: PlacementTestService;

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  getPlacementTests(page: number = 1): Promise<AxiosResponse<PlacementTestResponse>> {
    return _axios.get<PlacementTestResponse>(`student/placement-tests?page=${page}`);
  }

  startPlacementTest(id: number): Promise<AxiosResponse<BasicResponse>> {
    return _axios.post<BasicResponse>(`student/placement-tests/${id}/start`);
  }

  getPlacementTestQuestions(id: number): Promise<AxiosResponse<PlacementTestDetailResponse>> {
    return _axios.get<PlacementTestDetailResponse>(`student/placement-tests/${id}`);
  }

  submitQuizAnswer(answer: QuestionAnswer): Promise<AxiosResponse<BasicResponse>> {
    const formData = new FormData();
    formData.append('placement_test_id', answer.placement_test_id);
    formData.append('quiz_id', answer.quiz_id);
    formData.append('type', answer.type);
    formData.append('question_id', answer.question_id);
    
    // Handle multiple answers
    answer.answers.forEach(answerId => {
      formData.append('answers[]', answerId);
    });

    return _axios.post<BasicResponse>(`student/submit-quiz-answer`, formData);
  }

  submitFinalQuiz(submission: FinalQuizSubmission): Promise<AxiosResponse<BasicResponse>> {
    const formData = new FormData();
    formData.append('placement_test_id', submission.placement_test_id);
    formData.append('quiz_id', submission.quiz_id);

    return _axios.post<BasicResponse>(`student/submit-quiz`, formData);
  }

  getPlacementTestResult(id: number): Promise<AxiosResponse<any>> {
    return _axios.get(`student/placement-tests/${id}/result`);
  }
}

export const _PlacementTestService = PlacementTestService.Instance; 