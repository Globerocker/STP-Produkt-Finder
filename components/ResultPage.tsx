
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { RecommendationResult, Answers, ValuePropositionResult, UserType, Language } from '../types';
import { submitToHubspot, getHubspotUrlParams } from '../services/hubspotService';
import { CheckmarkIcon, XIcon } from './IconComponents';
import ProductComparisonTable from './ProductComparisonTable';
import ValuePropositionCard from './SavingsCalculator';
import ContentHub from './ContentHub';
import { trackEvent } from '../lib/tracking';
import { PRODUCT_CALENDAR_URLS } from '../lib/productData';
import { calculateValuePropositions } from '../lib/calculator';
import DigitalMaturity from './DigitalMaturity';
import { useLanguage } from '../contexts/LanguageContext';
import { locales } from '../lib/locales';

interface ResultPageProps {
  recommendations: RecommendationResult;
  answers: Answers;
  onRestart: () => void;
}

const ResultPage: React.FC<ResultPageProps> = ({ recommendations, answers, onRestart }) => {
  const { topProduct, alternatives, relevantFeatures, missingFeaturesForTopProduct } = recommendations;
  const [animateFeatures, setAnimateFeatures] = useState(false);
  const [valuePropositions, setValuePropositions] = useState<ValuePropositionResult[]>([]);
  const { language } = useLanguage();
  const t = locales[language].result;
  const submitted = useRef(false);

  const derivedUserType = useMemo(() => {
    const lawyers = answers.lawyerCount ? parseInt(answers.lawyerCount as string, 10) : 0;
    if (lawyers === 1) return UserType.SolePractitioner;
    if (lawyers > 1) return UserType.LawFirm;
    return undefined;
  }, [answers.lawyerCount]);

  useEffect(() => {
    // Submit to Hubspot only once when the component mounts with results
    if (!submitted.current) {
        const quizLanguage = (answers.lang as Language) || 'de';
        submitToHubspot(answers, topProduct.name, quizLanguage);
        submitted.current = true;
    }

    // Re-calculate value propositions whenever the language changes to keep UI in sync
    setValuePropositions(calculateValuePropositions(answers, topProduct, language));
    
    const timer = setTimeout(() => setAnimateFeatures(true), 300);
    return () => clearTimeout(timer);
  }, [topProduct, answers, language]);
  
  const hubspotParams = getHubspotUrlParams(answers, topProduct.name, language);

  const calendarBaseUrl = PRODUCT_CALENDAR_URLS[topProduct.id];
  
  const isHubspotUrl = calendarBaseUrl && calendarBaseUrl.includes('hubspot.com');
    
  const directDemoUrl = calendarBaseUrl
    ? (isHubspotUrl ? `${calendarBaseUrl}?${hubspotParams.toString()}` : calendarBaseUrl)
    : topProduct.demoUrl;

  const renderCtaButton = () => {
    return (
      <a 
        href={directDemoUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        onClick={() => trackEvent('cta_click', { 'cta_type': 'book_demo_external', 'product': topProduct.name })}
        className="inline-block bg-brand-accent text-white font-bold text-lg py-4 px-8 rounded-lg shadow-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 ease-in-out w-full sm:w-auto text-center animate-pulse-cta"
      >
        {t.bookDemo.replace('{productName}', topProduct.name)}
      </a>
    );
  };
  
  const comparisonProducts = [topProduct, ...alternatives];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Top Recommendation */}
      <div className="bg-white rounded-xl shadow-xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center animate-fade-in">
        <div className="md:col-span-1 flex flex-col items-center md:items-start">
          <img src={topProduct.logoUrl} alt={`${topProduct.name} Logo`} className="h-14 mb-4 object-contain" />
          <h2 className="text-4xl font-extrabold text-brand-primary text-center md:text-left">{topProduct.name}</h2>
          <p className="text-brand-accent font-bold text-lg mt-1 text-center md:text-left">{t.topRecommendation}</p>
        </div>
        <div className="md:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {valuePropositions.length > 0 ? (
                    valuePropositions.map(vp => <ValuePropositionCard key={vp.title} value={vp} />)
                ) : (
                    <div className="space-y-2 mb-6">
                        <div className="h-4 bg-gray-200 rounded-full w-full animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded-full w-5/6 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded-full w-3/4 animate-pulse"></div>
                    </div>
                )}
            </div>
          {renderCtaButton()}
        </div>
      </div>

      <DigitalMaturity answers={answers} />
      
      {/* Feature Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in-delay-2">
          <h3 className="text-xl font-bold text-green-700 mb-4 flex items-center">
            <CheckmarkIcon className="h-6 w-6 mr-2 text-green-600" /> {t.fulfilledRequirements}
          </h3>
          <ul className="space-y-2">
            {relevantFeatures.length > 0 ? relevantFeatures.map((f, index) => (
               <li 
                 key={f.id} 
                 className={`flex items-center text-brand-text transition-all duration-500 transform ${animateFeatures ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
                 style={{ transitionDelay: `${index * 100}ms` }}
               >
                 <CheckmarkIcon className="h-5 w-5 mr-3 text-green-600 flex-shrink-0" />
                 {f.name}
               </li>
            )) : <li className="text-gray-500">{t.majorRequirementsMet}</li>}
          </ul>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in-delay-2">
          <h3 className="text-xl font-bold text-red-700 mb-4 flex items-center">
            <XIcon className="h-6 w-6 mr-2 text-red-600" /> {t.potentialGaps}
          </h3>
          <ul className="space-y-2">
            {missingFeaturesForTopProduct.length > 0 ? missingFeaturesForTopProduct.map(f => (
              <li key={f.id} className="text-brand-text">{f.name}</li>
            )) : <li className="text-gray-500">{t.allWishesMet.replace('{productName}', topProduct.name)}</li>}
          </ul>
        </div>
      </div>

      {/* Alternatives */}
      <div className="bg-white p-8 rounded-xl shadow-xl mt-8 animate-fade-in-delay-3">
        <h3 className="text-2xl font-bold text-brand-primary mb-6 text-center">{t.alternativeOptions}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {alternatives.map(alt => (
            <div key={alt.id} className="border border-gray-200 rounded-lg p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow duration-300">
              <img src={alt.logoUrl} alt={`${alt.name} Logo`} className="h-12 mb-3 object-contain" />
              <h4 className="font-bold text-brand-primary">{alt.name}</h4>
              <p className="text-sm text-brand-text mb-4 flex-grow">{alt.shortDescription}</p>
              <a 
                href={alt.demoUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={() => trackEvent('cta_click', { 'cta_type': 'learn_more_alternative', 'product': alt.name })}
                className="mt-auto bg-brand-secondary text-brand-primary font-bold py-2 px-4 rounded-md hover:bg-opacity-80 transition-colors duration-300 text-sm">
                {t.learnMoreShort}
              </a>
            </div>
          ))}
        </div>
      </div>

      <ProductComparisonTable topProductId={topProduct.id} productsToDisplay={comparisonProducts} />

      <ContentHub userType={derivedUserType} />
      
      <div className="text-center mt-12 animate-fade-in-delay-3">
        <button
          onClick={() => {
            trackEvent('restart_quiz', { from_product: topProduct.name });
            onRestart();
          }}
          className="bg-transparent border-2 border-brand-primary text-brand-primary font-bold py-3 px-8 rounded-lg hover:bg-brand-primary hover:text-white transition-colors duration-300"
        >
          {t.restart}
        </button>
      </div>
    </div>
  );
};

export default ResultPage;