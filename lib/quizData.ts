import { Question } from '../types';

export interface QuizStep {
    id: string;
    questions: Omit<Question, 'text' | 'description' | 'placeholder' | 'options'>[];
}

export const QUIZ_STEPS: QuizStep[] = [
    {
      id: 'step1',
      questions: [
        { id: 'location', type: 'select' },
        { id: 'lawyerCount', type: 'number', min: 1 },
        { id: 'refaCount', type: 'number', min: 0 },
        { id: 'currentSoftware', type: 'select' },
        { 
          id: 'currentSoftwareOther', 
          type: 'text',
          dependsOn: { questionId: 'currentSoftware', value: 'other' }
        },
        { id: 'workFocus', type: 'select' },
        { id: 'billingType', type: 'select' },
        { id: 'notary', type: 'yesno' },
        { id: 'notaryCount', type: 'number', min: 1, dependsOn: { questionId: 'notary', value: 1 } },
        { id: 'averageHourlyRate', type: 'number', min: 0 },
      ]
    },
    {
      id: 'step2',
      questions: [
        { id: 'maturity_q1', type: 'yesno' },
        { id: 'maturity_q3', type: 'yesno' },
        { id: 'maturity_q4', type: 'yesno' },
        { id: 'maturity_q5', type: 'yesno' },
        { id: 'maturity_q6', type: 'yesno' },
        { id: 'maturity_q7', type: 'yesno' },
        { id: 'maturity_q8', type: 'yesno' },
        { id: 'maturity_q9', type: 'yesno' },
        { id: 'maturity_q10', type: 'yesno' },
        { id: 'maturity_q11', type: 'yesno' },
        { id: 'maturity_q12', type: 'yesno' },
        { id: 'maturity_q13', type: 'yesno' },
        { id: 'maturity_q14', type: 'yesno' },
        { id: 'maturity_q16', type: 'yesno' },
        { id: 'maturity_q15', type: 'yesno' },
      ]
    }
];

// Maps a 'no' answer on a maturity question to a feature need
export const maturityNeedsMap: { [key: string]: string } = {
  maturity_q5: 'advanced_dms',
  maturity_q8: 'client_portal',
  maturity_q10: 'cloud_hosting',
  maturity_q11: 'bea_interface',
  maturity_q13: 'business_analytics',
  maturity_q14: 'ai_integrated_addons',
};