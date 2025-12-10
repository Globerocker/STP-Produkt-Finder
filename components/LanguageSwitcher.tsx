import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../types';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  const buttonClass = (lang: Language) =>
    `px-3 py-1 rounded-md text-sm font-bold transition-colors duration-300 ` +
    (language === lang
      ? 'bg-brand-primary text-white cursor-default'
      : 'bg-transparent text-brand-primary hover:bg-brand-secondary');

  return (
    <div className="flex items-center space-x-1 border border-brand-secondary p-1 rounded-lg">
      <button onClick={() => handleLanguageChange('de')} className={buttonClass('de')}>
        DE
      </button>
      <button onClick={() => handleLanguageChange('en')} className={buttonClass('en')}>
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;