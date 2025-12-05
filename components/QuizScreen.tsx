import React, { useState } from 'react';
import { Question } from '../types';
import { CheckCircle2, XCircle, ArrowRight, BrainCircuit } from 'lucide-react';

interface QuizScreenProps {
  questions: Question[];
  onFinish: (score: number, total: number) => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({ questions, onFinish }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQuestion = questions[currentIdx];
  const progress = ((currentIdx) / questions.length) * 100;

  const handleOptionClick = (idx: number) => {
    if (isAnswered) return;
    setSelectedOptionIdx(idx);
    setIsAnswered(true);
    if (idx === currentQuestion.correctAnswerIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(curr => curr + 1);
      setSelectedOptionIdx(null);
      setIsAnswered(false);
    } else {
      onFinish(score, questions.length);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 flex flex-col min-h-screen sm:min-h-0 sm:h-auto animate-in fade-in zoom-in-95 duration-500">
      {/* Header / Progress */}
      <div className="mb-6 space-y-2">
        <div className="flex justify-between items-center text-sm font-medium text-slate-500">
          <span>Question {currentIdx + 1} of {questions.length}</span>
          <span>Score: {score}</span>
        </div>
        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 flex-1 sm:flex-none mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 leading-relaxed">
          {currentQuestion.text}
        </h2>

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex justify-between items-center group ";
            
            if (!isAnswered) {
              btnClass += "border-slate-100 hover:border-indigo-200 hover:bg-slate-50 cursor-pointer";
            } else {
              if (idx === currentQuestion.correctAnswerIndex) {
                btnClass += "border-green-500 bg-green-50 text-green-800";
              } else if (idx === selectedOptionIdx) {
                btnClass += "border-red-500 bg-red-50 text-red-800";
              } else {
                btnClass += "border-slate-100 opacity-50";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={isAnswered}
                className={btnClass}
              >
                <span className="font-medium">{option}</span>
                {isAnswered && idx === currentQuestion.correctAnswerIndex && (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                )}
                {isAnswered && idx === selectedOptionIdx && idx !== currentQuestion.correctAnswerIndex && (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation (Shown after answer) */}
        {isAnswered && currentQuestion.explanation && (
          <div className="mt-6 p-4 bg-indigo-50 rounded-lg text-indigo-800 text-sm flex gap-3 items-start animate-in fade-in slide-in-from-top-2">
            <BrainCircuit className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{currentQuestion.explanation}</p>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-auto sm:mt-0">
        <button
          onClick={handleNext}
          disabled={!isAnswered}
          className={`
            w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300
            ${isAnswered 
              ? 'bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 active:scale-95' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
          `}
        >
          {currentIdx === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};
