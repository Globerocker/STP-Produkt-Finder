
import React from 'react';
import { UserType } from '../types';
import { CONTENT_BY_USER_TYPE, ContentItem } from '../lib/contentData';
import { DownloadIcon, PresentationChartBarIcon, NewspaperIcon } from './IconComponents';
import { useLanguage } from '../contexts/LanguageContext';
import { locales } from '../lib/locales';
import { trackEvent } from '../lib/tracking';

interface ContentHubProps {
  userType: UserType | undefined;
}

const ICONS: { [key in ContentItem['type']]: React.FC<{className?: string}> } = {
    Download: DownloadIcon,
    Webinar: PresentationChartBarIcon,
    Blog: NewspaperIcon,
}

const ContentHub: React.FC<ContentHubProps> = ({ userType }) => {
  const { language } = useLanguage();
  const t = locales[language].contentHub;

  // Default to LawFirm content if userType is not determined
  const effectiveUserType = userType || UserType.LawFirm;
  const content = CONTENT_BY_USER_TYPE[effectiveUserType] || [];

  if (content.length === 0) {
    return null;
  }

  return (
    <div className="bg-brand-light-bg p-6 sm:p-8 rounded-xl mt-12 w-full animate-fade-in-delay-3">
      <h3 className="text-2xl font-bold text-brand-primary mb-6 text-center">{t.title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {content.map((item) => {
          const Icon = ICONS[item.type];
          const contentText = t.items[item.id];
          if (!contentText) return null;

          return (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('content_click', { 'content_id': item.id, 'content_type': item.type, 'content_title': contentText.title })}
              className="block bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg hover:border-brand-accent transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-brand-light-bg p-3 rounded-lg">
                  <Icon className="h-6 w-6 text-brand-primary" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-brand-accent">{item.type}</span>
                  <h4 className="font-bold text-brand-primary mt-1">{contentText.title}</h4>
                  <p className="text-sm text-brand-text mt-2">{contentText.description}</p>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

// FIX: Added default export to make the component importable.
export default ContentHub;