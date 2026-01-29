
import React from 'react';
import { Subject } from '../types';

interface SubjectCardProps {
  subject: Subject;
  icon: string;
  color: string;
  isSelected: boolean;
  onSelect: (s: Subject) => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ subject, icon, color, isSelected, onSelect }) => {
  return (
    <button 
      onClick={() => onSelect(subject)}
      className={`relative group p-6 rounded-3xl transition-all duration-300 text-left border-2 ${
        isSelected 
          ? `bg-white border-indigo-500 shadow-xl scale-[1.02]` 
          : 'bg-white border-transparent hover:border-slate-200 hover:shadow-md'
      }`}
    >
      <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-sm group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">{subject}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">Master the fundamentals and advanced concepts of {subject.toLowerCase()}.</p>
      
      {isSelected && (
        <div className="absolute top-4 right-4 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </button>
  );
};
