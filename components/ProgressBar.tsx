import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { locales } from '../lib/locales';

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const { language } = useLanguage();
  const t = locales[language].progressBar;
  const percentage = total > 0 ? (current / total) * 100 : 0;
  const roundedPercentage = Math.round(percentage);

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-base font-semibold text-brand-primary">{t.label}</span>
        <span className="text-base font-bold text-brand-accent">{roundedPercentage}%</span>
      </div>
      <div className="w-full bg-brand-secondary rounded-full h-4 shadow-inner">
        <div
          className="bg-gradient-to-r from-brand-accent to-orange-500 h-4 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;