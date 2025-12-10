
import React, { useState, useMemo, useCallback } from 'react';
import { Answers, Question } from '../types';
import { QUIZ_STEPS } from '../lib/quizData';
import ProgressBar from './ProgressBar';
import QuestionBlock from './QuestionBlock';
import { trackEvent } from '../lib/tracking';
import { useLanguage } from '../contexts/LanguageContext';
import { locales } from '../lib/locales';


interface QuizPageProps {
  onSubmit: (answers: Answers) => void;
}

const QuizPage: React.FC<QuizPageProps> = ({ onSubmit }) => {
  const { language } = useLanguage();
  const [answers, setAnswers] = useState<Answers>({ lang: language });
  const [currentStep, setCurrentStep] = useState(0);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const t = locales[language].quiz;
  const stepContent = locales[language].quizSteps;

  const handleAnswer = useCallback((questionId: string, answer: number | string) => {
    setAnswers(prev => {
        const newAnswers = { ...prev, [questionId]: answer };
        // Track every answer given by the user for detailed analytics
        trackEvent('quiz_answer', { 
            'question_id': questionId, 
            'answer_value': answer 
        });
        return newAnswers;
    });
  }, []);
  
  const getVisibleQuestions = (qs: Question[]): Question[] => {
    return qs.filter(q => {
      if (!q.dependsOn) return true;
      return answers[q.dependsOn.questionId] === q.dependsOn.value;
    });
  };
  
  const totalSteps = QUIZ_STEPS.length;
  const currentQuestions = useMemo(() => {
    const questionsInStep = QUIZ_STEPS[currentStep]?.questions || [];
    // FIX: Cast question skeletons to Question[] to satisfy getVisibleQuestions signature.
    // This is safe because getVisibleQuestions only accesses properties present in the skeleton.
    return getVisibleQuestions(questionsInStep as Question[]);
  }, [currentStep, answers]);
  
  const allQuestionsForType = useMemo(() => QUIZ_STEPS.flatMap(step => step.questions), []);

  const allQuestionsInStepAnswered = currentQuestions.every(q => {
    if (q.type === 'textarea' || q.type === 'text') return true; 
    const answer = answers[q.id];
    return answer !== undefined && answer !== null && answer !== '';
  });

  const handleNext = () => {
    if (!allQuestionsInStepAnswered) {
      setAttemptedSubmit(true);
      return;
    }
    setAttemptedSubmit(false);
    window.scrollTo(0, 0); 
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      trackEvent('quiz_completed', { answers: answers });
      onSubmit(answers);
    }
  };
  
  const handleBack = () => {
    setAttemptedSubmit(false);
    window.scrollTo(0, 0);
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }
  
  const visibleQuestionsForProgress = useMemo(() => getVisibleQuestions(allQuestionsForType as Question[]), [allQuestionsForType, answers]);
  
  const mandatoryQuestions = visibleQuestionsForProgress.filter(q => q.type !== 'textarea' && q.type !== 'text');
  const totalQuestions = mandatoryQuestions.length;

  const answeredQuestionsCount = Object.keys(answers).filter(key => {
    const question = mandatoryQuestions.find(q => q.id === key);
    return question && answers[key] !== null && answers[key] !== '' && key !== 'lang';
  }).length;
  
  return (
    <div className="max-w-3xl w-full mx-auto animate-fade-in">
      <h3 className="text-center text-2xl font-bold text-brand-primary mb-2">{stepContent[currentStep]?.title}</h3>
      {stepContent[currentStep]?.subtitle && <p className="text-center text-brand-text mb-4">{stepContent[currentStep]?.subtitle}</p>}
      <ProgressBar current={answeredQuestionsCount} total={totalQuestions} />

      {currentQuestions.map(question => (
        <QuestionBlock
          key={`${currentStep}-${question.id}`}
          question={question}
          answer={answers[question.id] as number | string | null}
          onAnswer={handleAnswer}
          isMissing={attemptedSubmit && !(question.type === 'textarea' || question.type === 'text') && (answers[question.id] === undefined || answers[question.id] === null || answers[question.id] === '')}
        />
      ))}

      <div className="flex justify-between mt-8">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className="bg-white border-2 border-brand-secondary text-brand-primary font-bold py-3 px-8 rounded-lg shadow-md hover:bg-brand-secondary transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.back}
        </button>
        <button
          onClick={handleNext}
          className="bg-brand-primary text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-opacity-90 transition-colors duration-300"
        >
          {currentStep < totalSteps - 1 ? t.next : t.submit}
        </button>
      </div>
       {attemptedSubmit && !allQuestionsInStepAnswered && (
          <p className="text-center text-red-600 mt-4 font-semibold">
              {t.validationError}
          </p>
       )}
    </div>
  );
};

export default QuizPage;