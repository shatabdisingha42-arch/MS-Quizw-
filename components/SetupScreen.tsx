import React, { useState } from 'react';
import { Subject, QuizConfig } from '../types';
import { Slider } from './Slider';
import { BookOpen, Globe, Atom, Clock, TrendingUp, Minus, Plus } from 'lucide-react';

interface SetupScreenProps {
  onStart: (config: QuizConfig) => void;
}

const subjects = [
  { id: Subject.MATHEMATICS, icon: TrendingUp, color: 'bg-blue-100 text-blue-600' },
  { id: Subject.SCIENCE, icon: Atom, color: 'bg-green-100 text-green-600' },
  { id: Subject.HISTORY, icon: Clock, color: 'bg-amber-100 text-amber-600' },
  { id: Subject.GEOGRAPHY, icon: Globe, color: 'bg-teal-100 text-teal-600' },
  { id: Subject.CURRENT_AFFAIRS, icon: BookOpen, color: 'bg-purple-100 text-purple-600' },
];

export const SetupScreen: React.FC<SetupScreenProps> = ({ onStart }) => {
  const [subject, setSubject] = useState<Subject>(Subject.MATHEMATICS);
  const [level, setLevel] = useState<number>(500);
  const [count, setCount] = useState<number>(10);

  const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow empty string for typing experience, but clamp on blur or submission
    const valStr = e.target.value;
    if (valStr === '') {
      setLevel(0); // Temporary state for empty input
      return;
    }
    
    let val = parseInt(valStr);
    if (isNaN(val)) return;

    if (val > 1000) val = 1000;
    setLevel(val);
  };

  const handleLevelBlur = () => {
    let val = level;
    if (val < 1) val = 1;
    if (val > 1000) val = 1000;
    setLevel(val);
  };

  const adjustLevel = (amount: number) => {
    setLevel(prev => {
      let newVal = prev + amount;
      if (newVal < 1) newVal = 1;
      if (newVal > 1000) newVal = 1000;
      return newVal;
    });
  };

  const handleStart = () => {
    // Final safety clamp
    const safeLevel = Math.max(1, Math.min(1000, level));
    onStart({ subject, level: safeLevel, questionCount: count });
  };

  return (
    <div className="max-w-4xl mx-auto w-full p-4 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-3 mb-10">
        <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-slate-900">
          MS <span className="text-indigo-600">Quiz</span>
        </h1>
        <p className="text-slate-500 font-medium">
          Master your knowledge across multiple subjects.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Subject Selection */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold">1</span>
              Choose Subject
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {subjects.map((s) => {
                const Icon = s.icon;
                const isSelected = subject === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSubject(s.id)}
                    className={`
                      relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 group
                      ${isSelected 
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-inner' 
                        : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50'}
                    `}
                  >
                    <div className={`p-3 rounded-xl mb-2 transition-all duration-300 ${isSelected ? s.color + ' scale-110' : 'bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-indigo-400'}`}>
                      <Icon size={24} strokeWidth={2.5} />
                    </div>
                    <span className={`text-xs font-bold text-center leading-tight ${isSelected ? 'text-indigo-900' : 'text-slate-500'}`}>
                      {s.id}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Difficulty & Count */}
        <div className="lg:col-span-5 space-y-6 flex flex-col">
          
          {/* Level Selector */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold">2</span>
              Difficulty Level
            </h2>
            
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-between w-full gap-4 mb-2">
                <button 
                  onClick={() => adjustLevel(-50)}
                  className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all active:scale-90"
                  aria-label="Decrease level"
                >
                  <Minus size={24} strokeWidth={3} />
                </button>
                
                <div className="flex-1 relative">
                  <input
                    type="number"
                    min={1}
                    max={1000}
                    value={level === 0 ? '' : level}
                    onChange={handleLevelChange}
                    onBlur={handleLevelBlur}
                    className="w-full text-center text-5xl font-black text-slate-900 bg-transparent focus:outline-none p-2 border-b-2 border-slate-100 focus:border-indigo-500 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder-slate-200"
                    placeholder="1-1000"
                  />
                  <div className="absolute top-0 right-0 text-xs font-bold text-slate-300 pointer-events-none">/1000</div>
                </div>

                <button 
                  onClick={() => adjustLevel(50)}
                  className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all active:scale-90"
                  aria-label="Increase level"
                >
                  <Plus size={24} strokeWidth={3} />
                </button>
              </div>
              
              <div className="text-sm font-bold uppercase tracking-wide text-indigo-500 mt-2">
                {level <= 200 && 'Beginner'}
                {level > 200 && level <= 500 && 'Intermediate'}
                {level > 500 && level <= 800 && 'Advanced'}
                {level > 800 && 'Expert'}
              </div>
            </div>
          </div>

          {/* Question Count Slider */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex-1 flex flex-col justify-center">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold">3</span>
              Quiz Length
            </h2>
            <Slider 
              min={10} 
              max={50} 
              value={count} 
              onChange={setCount} 
              label="Total Questions" 
            />
          </div>
        </div>
      </div>

      {/* Start Button */}
      <div className="mt-10">
        <button
          onClick={handleStart}
          className="group w-full bg-slate-900 hover:bg-indigo-600 text-white text-xl font-bold py-5 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-indigo-500/30 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3"
        >
          <span>Start Challenge</span>
          <div className="bg-white/20 p-1 rounded-full group-hover:translate-x-1 transition-transform">
             <Plus size={20} />
          </div>
        </button>
      </div>
    </div>
  );
};