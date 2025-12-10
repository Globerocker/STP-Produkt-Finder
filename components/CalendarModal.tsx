import React, { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { locales } from '../lib/locales';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  productName: string;
}

const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose, url, productName }) => {
  const { language } = useLanguage();
  const t = locales[language].calendarModal;

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col relative animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
            <h2 className="text-xl font-bold text-brand-primary">{t.title.replace('{productName}', productName)}</h2>
            <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition-colors"
            aria-label={t.close}
            >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            </button>
        </div>
        <div className="flex-grow p-1 overflow-hidden">
          <iframe
            src={url}
            className="w-full h-full border-0"
            title={t.iframeTitle.replace('{productName}', productName)}
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;