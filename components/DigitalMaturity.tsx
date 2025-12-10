import React from 'react';
import { Answers, MaturityLevel } from '../types';
import { QUIZ_STEPS } from '../lib/quizData';
import { useLanguage } from '../contexts/LanguageContext';
import { locales } from '../lib/locales';

const maturityQuestionIds = QUIZ_STEPS.find(step => step.id === 'step2')
    ?.questions.map(q => q.id) || [];

const calculateMaturity = (answers: Answers, maturityLevels: MaturityLevel[]): { points: number; level: MaturityLevel } => {
  let points = 0;
  maturityQuestionIds.forEach(id => {
      if (answers[id] === 1) { // 1 is 'Yes'
          points++;
      }
  });

  const level = maturityLevels.find(l => points >= l.min && points <= l.max) || maturityLevels[0];
  return { points, level };
};

const DigitalMaturity: React.FC<{ answers: Answers }> = ({ answers }) => {
  const { language } = useLanguage();
  const t = locales[language].maturity;
  const MATURITY_LEVELS = t.levels;
  const { level } = calculateMaturity(answers, MATURITY_LEVELS);

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl mt-8 w-full animate-fade-in-delay-1">
      <h3 className="text-2xl font-bold text-brand-primary mb-2 text-center">{t.title}</h3>
       <p className="text-center text-brand-text mb-6">{t.subtitle}</p>

      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-4">
          <p className="text-sm font-semibold text-brand-text">{t.stage} {level.stage} / 8</p>
          <h4 className="text-xl font-bold text-brand-accent">{level.title}</h4>
        </div>

        {/* Maturity Stages Visualization */}
        <div className="flex justify-between items-end gap-1 mb-2">
            {MATURITY_LEVELS.map(l => (
                <div key={l.stage} className="w-full flex flex-col items-center">
                    <div className={`w-full h-8 rounded-t-md transition-all duration-500 ${level.stage >= l.stage ? 'bg-brand-accent' : 'bg-brand-secondary'}`}
                         style={{ height: `${2 + l.stage * 0.7}rem` }}>
                    </div>
                </div>
            ))}
        </div>
        <div className="flex justify-between items-start gap-1 text-xs text-gray-500">
            {MATURITY_LEVELS.map(l => (
                 <div key={l.stage} className="w-full text-center font-semibold">
                    {l.stage}
                </div>
            ))}
        </div>
        
        <p className="text-center text-gray-600 mt-6 bg-brand-light-bg p-4 rounded-lg">{level.description}</p>
      </div>
    </div>
  );
};

export default DigitalMaturity;