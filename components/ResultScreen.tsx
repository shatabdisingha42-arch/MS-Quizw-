import React from 'react';
import { RefreshCcw, Trophy, Award, Target } from 'lucide-react';

interface ResultScreenProps {
  score: number;
  total: number;
  onRestart: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ score, total, onRestart }) => {
  const percentage = Math.round((score / total) * 100);
  
  let message = "";
  let Icon = Trophy;
  let colorClass = "text-indigo-600";

  if (percentage >= 90) {
    message = "Outstanding! You're an expert!";
    Icon = Trophy;
    colorClass = "text-yellow-500";
  } else if (percentage >= 70) {
    message = "Great job! Very well done.";
    Icon = Award;
    colorClass = "text-green-500";
  } else if (percentage >= 50) {
    message = "Good effort! Keep practicing.";
    Icon = Target;
    colorClass = "text-blue-500";
  } else {
    message = "Keep learning! You'll get there.";
    Icon = Target;
    colorClass = "text-slate-500";
  }

  return (
    <div className="max-w-md mx-auto text-center space-y-8 p-6 animate-in zoom-in-95 duration-500">
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        <div className="flex justify-center mb-6">
          <div className={`p-4 rounded-full bg-slate-50 ${colorClass}`}>
            <Icon size={64} strokeWidth={1.5} />
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
          Score: {percentage}%
        </h2>
        <p className="text-slate-500 mb-6">
          You got {score} out of {total} questions correct.
        </p>

        <div className="p-4 bg-slate-50 rounded-xl mb-8">
          <p className="text-lg font-medium text-slate-800">
            {message}
          </p>
        </div>

        <button
          onClick={onRestart}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
        >
          <RefreshCcw size={20} />
          Play Again
        </button>
      </div>
    </div>
  );
};
