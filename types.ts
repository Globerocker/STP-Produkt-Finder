
// FIX: Removed circular import of 'Page' from itself.

export enum Page {
  Landing,
  Quiz,
  Result,
}

export type Language = 'de' | 'en';

// FIX: Added missing user types to resolve errors in contentData.ts.
export enum UserType {
  LawFirm = 'Kanzlei',
  SolePractitioner = 'Einzelanwalt',
  InsolvencyAdmin = 'Insolvenzverwalter',
  LegalDepartment = 'Rechtsabteilung',
  LargeCreditor = 'Großgläubiger',
}

export interface Product {
  id: string;
  name: string;
  logoUrl: string;
  description: string;
  shortDescription: string;
  demoUrl: string;
}

export interface ProductFeature {
  id: string;
  name:string;
  [productId: string]: boolean | string;
}

export interface FeatureCategory {
  name: string;
  features: ProductFeature[];
}

export interface QuestionOption {
    label: string;
    value: string | number;
}

export interface Question {
  id: string;
  text: string;
  description?: string;
  type: 'select' | 'yesno' | 'usertype' | 'number' | 'scale' | 'textarea' | 'text';
  options?: QuestionOption[];
  placeholder?: string;
  min?: number;
  max?: number;
  dependsOn?: {
    questionId: string;
    value: string | number;
  };
}

export interface Answers {
  [key: string]: string | number | null | undefined; 
}

export interface GeminiSummary {
  productSummary: string;
}


export interface RecommendationResult {
  topProduct: Product;
  alternatives: Product[];
  relevantFeatures: ProductFeature[];
  missingFeaturesForTopProduct: ProductFeature[];
}

export interface ValuePropositionResult {
  type: 'time' | 'roi' | 'efficiency';
  title: string;
  value: string;
  unit: string;
  description: string;
}

export interface MaturityLevel {
    min: number;
    max: number;
    stage: number;
    title: string;
    description: string;
}