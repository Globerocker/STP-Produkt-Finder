import { Answers, Product, ValuePropositionResult, Language } from '../types';
import { locales } from './locales';

export const calculateValuePropositions = (answers: Answers, topProduct: Product, language: Language): ValuePropositionResult[] => {
    const t = locales[language].calculator;
    const results: ValuePropositionResult[] = [];
    const numberOfLawyers = answers.lawyerCount ? parseInt(answers.lawyerCount as string, 10) : 0;
    const averageHourlyRate = answers.averageHourlyRate ? parseInt(answers.averageHourlyRate as string, 10) : 0;
    const currentSoftware = answers.currentSoftware;

    const stpProducts = ['lexolution', 'advoware', 'winmacs', 'amberlo', 'winjur'];
    if (stpProducts.includes(currentSoftware as string)) {
        return [{
            type: 'efficiency',
            title: t.optimalSoftware.title,
            value: t.optimalSoftware.value,
            unit: t.optimalSoftware.unit,
            description: t.optimalSoftware.description
        }];
    }

    if (isNaN(numberOfLawyers) || numberOfLawyers <= 0) {
        results.push({
            type: 'efficiency',
            title: t.efficiencyGain.title,
            value: '25',
            unit: '%',
            description: t.efficiencyGain.description,
        });
        return results;
    }

    // 1. Calculate Time Savings
    const baseHoursSavedPerLawyer = currentSoftware === 'none' 
        ? 5 // Higher base savings if moving from Word/Excel
        : 2; // Lower base savings if switching from another system

    const aiBonusHours = 3; // Additional savings potential from AI features

    let totalHoursSaved = numberOfLawyers * baseHoursSavedPerLawyer;
    let description = t.timeSavings.descriptionBase;

    const productHasAI = topProduct.id === 'amberlo' || topProduct.id === 'advoware';
    // User gets AI bonus if they DON'T currently use AI, but the recommended product has it.
    const wantsAIBonus = answers.maturity_q14 === 0; 

    if (productHasAI && wantsAIBonus) {
        totalHoursSaved += numberOfLawyers * aiBonusHours;
        description = t.timeSavings.descriptionAI;
    }

    const timeSavingResult: ValuePropositionResult = {
        type: 'time',
        title: t.timeSavings.title,
        value: String(Math.round(totalHoursSaved)),
        unit: t.timeSavings.unit,
        description: description,
    };
    results.push(timeSavingResult);

    // 2. Calculate Monetary Value (ROI)
    if (!isNaN(averageHourlyRate) && averageHourlyRate > 0 && totalHoursSaved > 0) {
        const monetaryValue = Math.round(totalHoursSaved * averageHourlyRate);
        const monetaryResult: ValuePropositionResult = {
            type: 'roi',
            title: t.monetaryValue.title,
            value: monetaryValue.toLocaleString(language === 'de' ? 'de-DE' : 'en-US'),
            unit: t.monetaryValue.unit,
            description: t.monetaryValue.description
        };
        results.push(monetaryResult);
    }
    
    return results;
};