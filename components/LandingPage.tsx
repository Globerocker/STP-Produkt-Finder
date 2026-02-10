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
      <div className="bg-white/80 backdrop-blur-lg p-8 sm:p-14 rounded-2xl shadow-premium border border-white/50 w-full relative z-10">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-brand-primary mb-6 tracking-tight leading-tight">
          {t.title}
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
          {t.description}
        </p>
        <button
          onClick={onStart}
          className="bg-brand-accent text-white font-bold text-xl py-4 px-12 rounded-full shadow-lg hover:shadow-xl hover:bg-opacity-90 transform hover:-translate-y-1 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-brand-accent focus:ring-opacity-50 animate-pulse-cta"
        >
          {t.cta}
        </button>
      </div>
    </div>
  );
};

export default LandingPage;