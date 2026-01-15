import React, { useState, useMemo, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Page, Answers, RecommendationResult, Language } from './types';
import LandingPage from './components/LandingPage';
import QuizPage from './components/QuizPage';
import ResultPage from './components/ResultPage';
import Footer from './components/Footer';
import LanguageSwitcher from './components/LanguageSwitcher';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { getProductRecommendations } from './lib/data';
import { locales } from './lib/locales';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Landing);
  const [answers, setAnswers] = useState<Answers>({});
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    const userLang = navigator.language.split('-')[0];
    if (userLang === 'en' || userLang === 'de') {
      setLanguage(userLang as Language);
    }
  }, [setLanguage]);

  const startQuiz = () => {
    setAnswers({});
    setCurrentPage(Page.Quiz);
  };

  const submitQuiz = (finalAnswers: Answers) => {
    setAnswers(finalAnswers);
    setCurrentPage(Page.Result);
  };
  
  const recommendations: RecommendationResult | null = useMemo(() => {
    if (currentPage === Page.Result && Object.keys(answers).length > 0) {
      return getProductRecommendations(answers);
    }
    return null;
  }, [currentPage, answers]);

  const isLanding = currentPage === Page.Landing;

  const renderPage = () => {
    switch (currentPage) {
      case Page.Quiz:
        return <QuizPage onSubmit={submitQuiz} />;
      case Page.Result:
        if (recommendations) {
            return <ResultPage recommendations={recommendations} answers={answers} onRestart={startQuiz} />;
        }
        return <div>{locales[language].app.loading}</div>;
      case Page.Landing:
      default:
        return <LandingPage onStart={startQuiz} />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-light-bg text-brand-text font-sans flex flex-col items-center">
      <header className="sticky top-0 z-20 w-full bg-white/95 backdrop-blur-sm shadow-sm transition-all duration-300">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-brand-primary text-center animate-slide-down-fade-in">{locales[language].app.title}</h1>
            <LanguageSwitcher />
        </div>
      </header>
      <main className={`w-full flex-grow flex ${isLanding ? 'items-center justify-center' : 'flex-col items-center'} p-4 sm:p-6 lg:p-8`}>
        {renderPage()}
      </main>
      <Footer />
      <Analytics />
    </div>
  );
};

const App: React.FC = () => (
  <LanguageProvider>
    <AppContent />
  </LanguageProvider>
);


export default App;