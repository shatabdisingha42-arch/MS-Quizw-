export enum Subject {
  MATHEMATICS = 'Mathematics',
  SCIENCE = 'Science',
  HISTORY = 'History',
  GEOGRAPHY = 'Geography',
  CURRENT_AFFAIRS = 'Current Affairs'
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
}

export interface QuizConfig {
  subject: Subject;
  level: number; // 1 to 1000
  questionCount: number; // 10 to 50
}

export enum AppState {
  SETUP = 'SETUP',
  LOADING = 'LOADING',
  QUIZ = 'QUIZ',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR'
}
