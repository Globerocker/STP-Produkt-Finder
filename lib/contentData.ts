import { UserType } from '../types';

export interface ContentItem {
  id: string;
  link: string;
  type: 'Download' | 'Webinar' | 'Blog';
}

export const CONTENT_BY_USER_TYPE: { [key in UserType]: ContentItem[] } = {
  [UserType.LawFirm]: [
    { id: 'webinar_digital_firm_2025', link: '#', type: 'Webinar' },
    { id: 'whitepaper_increase_efficiency', link: '#', type: 'Download' },
    { id: 'blog_legal_tech_trends', link: '#', type: 'Blog' },
  ],
  [UserType.SolePractitioner]: [
    { id: 'blog_successful_solo', link: '#', type: 'Blog' },
    { id: 'checklist_firm_foundation', link: '#', type: 'Download' },
    { id: 'webinar_cloud_beginners', link: '#', type: 'Webinar' },
  ],
  [UserType.InsolvencyAdmin]: [
    { id: 'webinar_digital_insolvency', link: '#', type: 'Webinar' },
    { id: 'whitepaper_new_gis', link: '#', type: 'Download' },
    { id: 'blog_insolvency_law_news', link: '#', type: 'Blog' },
  ],
  [UserType.LegalDepartment]: [
    { id: 'whitepaper_ai_legal_dept', link: '#', type: 'Download' },
    { id: 'blog_cost_to_value', link: '#', type: 'Blog' },
    { id: 'webinar_knowledge_management', link: '#', 'type': 'Webinar' },
  ],
  [UserType.LargeCreditor]: [
     { id: 'blog_creditor_rights', link: '#', type: 'Blog' },
     { id: 'tour_creditor_hub', link: '#', type: 'Webinar' },
     { id: 'download_claims_management', link: '#', type: 'Download' },
  ],
};