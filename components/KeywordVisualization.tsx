import React from 'react';
import { KeywordSuggestion } from '../types';

interface KeywordVisualizationProps {
  suggestion: KeywordSuggestion;
}

const Bar: React.FC<{ value: number; maxValue: number; colorClass: string; label: string }> = ({ value, maxValue, colorClass, label }) => {
  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{label}</span>
        <span className={`text-xs font-semibold ${colorClass}`}>{value.toLocaleString()}</span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${colorClass.replace('text-', 'bg-')}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};


export const KeywordVisualization: React.FC<KeywordVisualizationProps> = ({ suggestion }) => {
  const { original, suggestion: newSuggestion, reason } = suggestion;
  const maxVolume = Math.max(original.volume, newSuggestion.volume, 1); // Avoid division by zero
  const maxKd = 100;

  const kdColor = (kd: number) => {
    if (kd <= 30) return 'text-green-500';
    if (kd <= 60) return 'text-yellow-500';
    return 'text-red-500';
  }

  return (
    <div className="bg-slate-100 dark:bg-slate-900/70 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
      <div className="mb-4">
        <p className="text-sm text-slate-600 dark:text-slate-400 italic">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Reason:</span> {reason}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {/* Original Keyword */}
        <div className="space-y-3">
          <h4 className="font-semibold text-slate-800 dark:text-slate-200 break-all">
            Original: <span className="font-normal text-slate-500 line-through">{original.text}</span>
          </h4>
          <Bar value={original.kd} maxValue={maxKd} colorClass={kdColor(original.kd)} label="Keyword Difficulty" />
          <Bar value={original.volume} maxValue={maxVolume} colorClass="text-blue-500" label="Search Volume" />
        </div>
        {/* Suggested Keyword */}
        <div className="space-y-3">
           <h4 className="font-semibold text-slate-800 dark:text-slate-200 break-all">
            Suggestion: <span className="font-normal text-teal-600 dark:text-teal-400">{newSuggestion.text}</span>
          </h4>
          <Bar value={newSuggestion.kd} maxValue={maxKd} colorClass={kdColor(newSuggestion.kd)} label="Keyword Difficulty" />
          <Bar value={newSuggestion.volume} maxValue={maxVolume} colorClass="text-blue-500" label="Search Volume" />
        </div>
      </div>
    </div>
  );
};
