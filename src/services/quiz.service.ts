import { _axios } from "interceptors/http-config";
import { AxiosResponse } from "axios";
import { ApiUtils } from "utils/apiUtils";

// Quiz List Interfaces
export interface QuizListItem {
  id: number;
  name: string;
  total_mark: number;
  pass_mark: number;
  expire_date: string;
  duration: string;
  questions_count: number;
}

export interface QuizListResponse {
  status: boolean;
  message: string;
  data: {
    content: QuizListItem[];
    pagination: {
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
    };
  };
}

// Quiz Result Interfaces
export interface QuizResult {
  id: number;
  name: string;
  course: string;
  quiz_id?: number;
  student_id?: number;
  total_mark: number;
  score: number | null; // API returns 'score' not 'student_mark'
  student_mark?: number; // Keep for compatibility
  pass_mark?: number;
  is_passed?: boolean;
  start_at: string | null; // API returns 'start_at' not 'started_at'  
  submit_at: string | null; // API returns 'submit_at' not 'finished_at'
  started_at?: string; // Keep for compatibility
  finished_at?: string; // Keep for compatibility
  questions: QuizResultQuestion[];
}

export interface QuizResultQuestion {
  id: number;
  type: "single-choice" | "multiple-choice" | "fill-in-blank" | "true-false";
  name: string;
  student_answers: string[];
  correct_answers: string[];
  is_correct: boolean;
  mark: number;
}

export interface QuizResultResponse {
  status: boolean;
  message: string;
  data: QuizResult;
}

// Quiz Start/Answer Interfaces
export interface QuizStartRequest {
  quiz_type: "topic";
  course_id: string;
  topic_id: string;
  quiz_id: string;
}

export interface QuizAnswerRequest {
  quiz_type: "topic";
  course_id: string;
  topic_id: string;
  quiz_id: string;
  type: "single-choice" | "multiple-choice" | "fill-in-blank" | "true-false";
  question_id: string;
  answers: string[]; // Array of answer IDs
}

export interface QuizSubmissionRequest {
  quiz_type: "topic";
  course_id: string;
  topic_id: string;
  quiz_id: string;
}

export interface BasicResponse {
  status: boolean;
  message: string;
  data: null;
}

class QuizService {
  private static _instance: QuizService;

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  // Get list of quizzes for a topic
  getQuizList(params: {
    course_id: string;
    topic_id: string;
    quiz_id: string;
    is_placement_test?: boolean;
  }): Promise<AxiosResponse<QuizListResponse>> {
    const queryParams = new URLSearchParams();
    
    if (params.is_placement_test) {
      queryParams.append('is_placement_test', '1');
    }
    
    const url = `${ApiUtils.buildEndpoint('quizzes/list')}?${queryParams.toString()}`;
    
    const formData = new FormData();
    formData.append('type', 'topic');
    formData.append('course_id', params.course_id);
    formData.append('topic_id', params.topic_id);
    formData.append('quiz_id', params.quiz_id);

    return _axios.get<QuizListResponse>(url, {
      data: formData
    });
  }

  // Get quiz result
  getQuizResult(quizId: string, params: {
    course_id: string;
    topic_id: string;
    quiz_id: string;
    is_placement_test?: boolean;
  }): Promise<AxiosResponse<QuizResultResponse>> {
    const queryParams = new URLSearchParams();
    
    if (params.is_placement_test) {
      queryParams.append('is_placement_test', '1');
    }
    
    const url = `${ApiUtils.buildEndpoint(`quizzes/${quizId}/result`)}?${queryParams.toString()}`;
    
    // According to Postman, this is a GET request with form data in body
    const formData = new FormData();
    formData.append('type', 'topic');
    formData.append('course_id', params.course_id);
    formData.append('topic_id', params.topic_id);
    formData.append('quiz_id', params.quiz_id);

    // Use GET with body data (unusual but as per Postman collection)
    return _axios.request<QuizResultResponse>({
      method: 'GET',
      url: url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
  }

  // Start a quiz
  startQuiz(request: QuizStartRequest): Promise<AxiosResponse<BasicResponse>> {
    const formData = new FormData();
    formData.append('quiz_type', request.quiz_type);
    formData.append('course_id', request.course_id);
    formData.append('topic_id', request.topic_id);
    formData.append('quiz_id', request.quiz_id);

    return _axios.post<BasicResponse>(`${ApiUtils.buildEndpoint('quizzes/start')}`, formData);
  }

  // Submit answer to a quiz question
  submitQuizAnswer(answer: QuizAnswerRequest): Promise<AxiosResponse<BasicResponse>> {
    const formData = new FormData();
    formData.append('quiz_type', answer.quiz_type);
    formData.append('course_id', answer.course_id);
    formData.append('topic_id', answer.topic_id);
    formData.append('quiz_id', answer.quiz_id);
    formData.append('type', answer.type);
    formData.append('question_id', answer.question_id);
    
    // Handle multiple answers
    answer.answers.forEach(answerId => {
      formData.append('answers[]', answerId);
    });

    return _axios.post<BasicResponse>(`${ApiUtils.buildEndpoint('quizzes/questions/answer')}`, formData);
  }

  // Final submission of quiz
  submitQuiz(submission: QuizSubmissionRequest): Promise<AxiosResponse<BasicResponse>> {
    const formData = new FormData();
    formData.append('quiz_type', submission.quiz_type);
    formData.append('course_id', submission.course_id);
    formData.append('topic_id', submission.topic_id);
    formData.append('quiz_id', submission.quiz_id);

    return _axios.post<BasicResponse>(`${ApiUtils.buildEndpoint('quizzes/submit')}`, formData);
  }
}

export const _QuizService = QuizService.Instance;
