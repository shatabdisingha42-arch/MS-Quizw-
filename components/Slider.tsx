import React, { useRef } from 'react';

interface SliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  label: string;
}

export const Slider: React.FC<SliderProps> = ({ min, max, value, onChange, label }) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full select-none">
      <div className="flex justify-between items-end mb-4">
        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">{label}</label>
        <span className="text-3xl font-black text-indigo-600 tabular-nums">
          {value}
        </span>
      </div>
      
      <div className="relative w-full h-8 flex items-center">
        {/* Track Background (Gray) */}
        <div className="absolute w-full h-3 bg-slate-200 rounded-full overflow-hidden">
          {/* Filled Track (Indigo) */}
          <div 
            className="h-full bg-indigo-600 transition-all duration-75 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Thumb Visual */}
        <div 
          className="absolute h-6 w-6 bg-white border-4 border-indigo-600 rounded-full shadow-lg pointer-events-none transition-all duration-75 ease-out"
          style={{ left: `calc(${percentage}% - 12px)` }}
        />

        {/* Invisible Input for Interaction */}
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="absolute w-full h-full opacity-0 cursor-pointer z-10"
          aria-label={label}
        />
      </div>

      <div className="flex justify-between text-xs font-semibold text-slate-400 mt-2">
        <span>{min} Questions</span>
        <span>{max} Questions</span>
      </div>
    </div>
  );
};