import React, { useState } from 'react';
import { AppState, QuizConfig, Question } from './types';
import { generateQuizQuestions } from './services/geminiService';
import { SetupScreen } from './components/SetupScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';
import { Loader2, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.SETUP);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [score, setScore] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const startQuiz = async (config: QuizConfig) => {
    setAppState(AppState.LOADING);
    setErrorMsg(null);
    try {
      const generatedQuestions = await generateQuizQuestions(config.subject, config.level, config.questionCount);
      setQuestions(generatedQuestions);
      setAppState(AppState.QUIZ);
    } catch (error) {
      console.error(error);
      setErrorMsg(error instanceof Error ? error.message : "An unexpected error occurred.");
      setAppState(AppState.ERROR);
    }
  };

  const finishQuiz = (finalScore: number) => {
    setScore(finalScore);
    setAppState(AppState.RESULTS);
  };

  const restartApp = () => {
    setAppState(AppState.SETUP);
    setQuestions([]);
    setScore(0);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-900">
      
      {appState === AppState.SETUP && (
        <SetupScreen onStart={startQuiz} />
      )}

      {appState === AppState.LOADING && (
        <div className="text-center space-y-4 animate-in fade-in duration-500">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-pulse" />
            </div>
          </div>
          <p className="text-lg font-medium text-slate-600">Generating your quiz...</p>
          <p className="text-sm text-slate-400">Consulting the AI knowledge base</p>
        </div>
      )}

      {appState === AppState.QUIZ && (
        <QuizScreen questions={questions} onFinish={finishQuiz} />
      )}

      {appState === AppState.RESULTS && (
        <ResultScreen score={score} total={questions.length} onRestart={restartApp} />
      )}

      {appState === AppState.ERROR && (
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center space-y-6 border border-red-100 animate-in shake duration-300">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Something went wrong</h3>
            <p className="text-slate-500 mt-2">{errorMsg || "We couldn't generate the quiz questions. Please check your connection or API key."}</p>
          </div>
          <button
            onClick={restartApp}
            className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
