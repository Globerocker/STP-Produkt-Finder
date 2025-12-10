import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { locales } from '../lib/locales';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const { language } = useLanguage();
  const t = locales[language].landing;

  return (
    <div className="text-center max-w-3xl mx-auto animate-fade-in">
      <div className="bg-white p-8 sm:p-12 rounded-xl shadow-xl w-full">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-primary mb-4">
          {t.title}
        </h2>
        <p className="text-lg text-brand-text mb-8">
          {t.description}
        </p>
        <button
          onClick={onStart}
          className="bg-brand-accent text-white font-bold text-xl py-4 px-10 rounded-lg shadow-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-brand-accent focus:ring-opacity-50"
        >
          {t.cta}
        </button>
      </div>
    </div>
  );
};

export default LandingPage;