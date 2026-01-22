import React, { useState, useMemo, useEffect } from 'react';
import { Page, Answers, RecommendationResult, Language } from './types';
import LandingPage from './components/LandingPage';
import QuizPage from './components/QuizPage';
import ResultPage from './components/ResultPage';
import ComparisonPage from './components/ComparisonPage';
import DashboardPage from './components/DashboardPage';
import Footer from './components/Footer';
import LanguageSwitcher from './components/LanguageSwitcher';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { getProductRecommendations, getLocalizedFeatures } from './lib/data';
import { locales } from './lib/locales';
import { trackPageView, trackQuizStart, trackQuizComplete, saveQuizResult } from './services/trackingService';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Landing);
  const [answers, setAnswers] = useState<Answers>({});
  // Temporary secret way to access dashboard (e.g. check for query param ?admin=true)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setCurrentPage(Page.Dashboard);
    }
  }, []);
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    const userLang = navigator.language.split('-')[0];
    if (userLang === 'en' || userLang === 'de') {
      setLanguage(userLang as Language);
    }
  }, [setLanguage]);

  // Track page views when page changes
  useEffect(() => {
    trackPageView();
  }, [currentPage]);

  const startQuiz = () => {
    setAnswers({});
    setCurrentPage(Page.Quiz);
    trackQuizStart(); // TRACKING
  };

  const submitQuiz = (finalAnswers: Answers) => {
    setAnswers(finalAnswers);
    setCurrentPage(Page.Result);
    // Tracking is handled in ResultPage or calculated here
    const result = getProductRecommendations(finalAnswers);
    if (result?.topProduct) {
      trackQuizComplete(result.topProduct.name, finalAnswers);
      saveQuizResult(result.topProduct.name);
    }
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
          return (
            <ResultPage
              recommendations={recommendations}
              answers={answers}
              onRestart={startQuiz}
              onCompare={() => setCurrentPage(Page.Comparison)}
            />
          );
        }
        return <div>{locales[language].app.loading}</div>;
      case Page.Comparison:
        if (recommendations) {
          return (
            <ComparisonPage
              products={[recommendations.topProduct, ...recommendations.alternatives]}
              features={getLocalizedFeatures(language)}
              onBack={() => setCurrentPage(Page.Result)}
            />
          );
        }
        return <div>No comparison data</div>;
      case Page.Dashboard:
        return <DashboardPage />;
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
    </div>
  );
};

const App: React.FC = () => (
  <LanguageProvider>
    <AppContent />
  </LanguageProvider>
);


export default App;