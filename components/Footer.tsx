import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { locales } from '../lib/locales';

const Footer: React.FC = () => {
  const { language } = useLanguage();
  const t = locales[language].footer;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full max-w-5xl mx-auto mt-12 pt-8 pb-8 border-t border-gray-200 text-center text-gray-500 text-sm">
      <img
        src="https://i.imgur.com/BvPBpf3.png" // Using the same logo URL as header
        alt="STP Group Logo"
        className="h-8 mx-auto mb-6"
      />

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 my-8 text-brand-primary font-medium">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{t.experience}</span>
        </div>
        <div className="flex items-center gap-2">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          <span>{t.customers}</span>
        </div>
        <div className="flex items-center gap-2">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          <span>{t.compliance}</span>
        </div>
      </div>

      <div className="flex justify-center gap-8 mb-6">
        <a href="#" className="text-lg font-semibold text-brand-primary hover:text-brand-accent transition-colors duration-300">{t.privacy}</a>
        <a href="#" className="text-lg font-semibold text-brand-primary hover:text-brand-accent transition-colors duration-300">{t.imprint}</a>
      </div>
      <p className="max-w-3xl mx-auto mb-6 px-4 text-xs">
        {t.disclaimer}
      </p>
      <p>
        © {currentYear} STP Informationstechnologie GmbH
      </p>
    </footer>
  );
};

export default Footer;