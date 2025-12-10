import React from 'react';
import { Question, UserType } from '../types';

interface UserTypeSelectorProps {
  question: Question;
  onSelect: (userType: UserType) => void;
}

const UserTypeSelector: React.FC<UserTypeSelectorProps> = ({ question, onSelect }) => {
  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="bg-white p-8 rounded-xl shadow-lg mb-6 w-full">
        <h2 className="text-2xl font-bold text-brand-primary mb-6 text-center">
          {question.text}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {question.options?.map(option => (
            <button
              key={option.value}
              onClick={() => onSelect(option.value as UserType)}
              className="p-6 text-center bg-brand-light-bg rounded-lg border-2 border-transparent hover:border-brand-accent hover:bg-brand-accent-light transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              <span className="font-semibold text-brand-text text-lg">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelector;
