import React, { useEffect } from 'react';
import { Question } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { locales } from '../lib/locales';

interface QuestionBlockProps {
  question: Question;
  answer: number | string | null;
  onAnswer: (questionId: string, answer: number | string) => void;
  isMissing: boolean;
}

const QuestionBlock: React.FC<QuestionBlockProps> = ({ question, answer, onAnswer, isMissing }) => {
  const { language } = useLanguage();
  const t = locales[language].quiz;
  const qText = locales[language].quizQuestions[question.id] || { text: '', description: '', placeholder: '', options: [] };
  
  useEffect(() => {
    // Set default value for scale questions if no answer is set yet
    if (question.type === 'scale' && (answer === null || answer === undefined)) {
      onAnswer(question.id, 5);
    }
  }, [question.id, question.type, answer, onAnswer]);

  const baseButtonClass = "w-full md:w-48 text-center text-lg font-semibold py-4 px-6 border-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105";
  const selectedButtonClass = "bg-brand-accent-light border-brand-accent text-brand-accent";
  const unselectedButtonClass = "bg-white border-gray-300 text-brand-text hover:border-brand-primary";
  const inputClass = "bg-white text-brand-text w-full text-lg p-3 border-2 border-gray-300 rounded-lg focus:ring-brand-accent focus:border-brand-accent transition-colors duration-300";


  const renderContent = () => {
    switch (question.type) {
      case 'yesno':
        return (
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <button
              onClick={() => onAnswer(question.id, 1)}
              className={`${baseButtonClass} ${answer === 1 ? selectedButtonClass : unselectedButtonClass}`}
            >
              {t.yes}
            </button>
            <button
              onClick={() => onAnswer(question.id, 0)}
              className={`${baseButtonClass} ${answer === 0 ? selectedButtonClass : unselectedButtonClass}`}
            >
              {t.no}
            </button>
          </div>
        );
      case 'select':
        return (
          <div className="flex justify-center">
            <select
              value={answer ?? ''}
              onChange={(e) => onAnswer(question.id, e.target.value)}
              className={`${inputClass} max-w-md`}
            >
              <option value="" disabled>{t.selectPlaceholder}</option>
              {qText.options?.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        );
      case 'text':
        return (
            <div className="flex justify-center">
                <input
                    type="text"
                    value={answer ?? ''}
                    onChange={(e) => onAnswer(question.id, e.target.value)}
                    placeholder={qText.placeholder}
                    className={`${inputClass} max-w-md`}
                />
            </div>
        );
      case 'number':
        return (
          <div className="flex justify-center">
            <input
              type="number"
              min={question.min ?? 0}
              value={answer ?? ''}
              onChange={(e) => onAnswer(question.id, e.target.value)}
              placeholder={qText.placeholder}
              className={`${inputClass} max-w-xs text-center`}
            />
          </div>
        );
      case 'scale':
        const currentValue = typeof answer === 'number' ? answer : 5;
        return (
          <div className="flex flex-col items-center gap-4 px-4">
            <input
              type="range"
              min={question.min ?? 1}
              max={question.max ?? 10}
              value={currentValue}
              onChange={(e) => onAnswer(question.id, parseInt(e.target.value, 10))}
              className="w-full h-2 bg-brand-secondary rounded-lg appearance-none cursor-pointer accent-brand-accent"
            />
            <div className="w-full flex justify-between text-sm text-gray-500 -mt-2">
                <span>{question.min ?? 1}</span>
                <span>{question.max ?? 10}</span>
            </div>
            <div className="text-2xl font-bold text-brand-primary bg-brand-accent-light rounded-full h-12 w-12 flex items-center justify-center">
                {currentValue}
            </div>
          </div>
        );
      case 'textarea':
        return (
          <div className="flex justify-center">
            <textarea
              value={answer as string ?? ''}
              onChange={(e) => onAnswer(question.id, e.target.value)}
              placeholder={qText.placeholder}
              rows={4}
              className={inputClass}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`bg-white p-8 rounded-xl shadow-lg mb-6 w-full transition-all duration-300 ${isMissing ? 'ring-2 ring-red-400 ring-offset-2' : ''}`}>
      <p className="text-xl font-semibold text-brand-text mb-2 text-center">{qText.text}</p>
      {qText.description && <p className="text-center text-gray-500 mb-6">{qText.description}</p>}
      {renderContent()}
    </div>
  );
};

export default QuestionBlock;