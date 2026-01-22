import { Answers, RecommendationResult, ProductFeature, Product, Language } from '../types';
import { PRODUCTS, PRODUCT_FEATURES } from './productData';
import { maturityNeedsMap } from './quizData';
import { locales } from './locales';

const getLocalizedProducts = (language: Language): Product[] => {
  return PRODUCTS.map(p => ({
    ...p,
    ...locales[language].products[p.id]
  }));
};

export const getLocalizedFeatures = (language: Language): ProductFeature[] => {
  return PRODUCT_FEATURES.flatMap(cat =>
    cat.features.map(f => ({
      ...f,
      // FIX: Cast features object to allow indexing by a string variable, resolving type errors.
      name: (locales[language].features as Record<string, { name: string }>)[f.id]?.name || f.id
    }))
  );
};


const calculateFeatureScore = (
  products: Product[],
  allFeatures: ProductFeature[],
  desiredFeatureIds: string[]
): Map<string, number> => {
  const scores = new Map<string, number>();
  products.forEach(product => {
    let matchCount = 0;
    desiredFeatureIds.forEach(featureId => {
      const feature = allFeatures.find(f => f.id === featureId);
      if (feature && (feature[product.id] === true || typeof feature[product.id] === 'string')) {
        matchCount++;
      }
    });
    const fitScore = desiredFeatureIds.length > 0 ? (matchCount / desiredFeatureIds.length) * 100 : 0;
    scores.set(product.id, fitScore);
  });
  return scores;
};


export const getProductRecommendations = (answers: Answers): RecommendationResult => {
  const language: Language = (answers.lang as Language) || 'de'; // Fallback to German
  const ALL_PRODUCTS = getLocalizedProducts(language);
  const ALL_FEATURES = getLocalizedFeatures(language);

  // 1. Hard filter by location and workFocus
  let potentialProducts: Product[];
  const location = answers.location;
  const workFocus = answers.workFocus;

  if (location === 'ch') {
    potentialProducts = ALL_PRODUCTS.filter(p => ['winjur', 'amberlo'].includes(p.id));
  } else { // Germany and Austria
    if (workFocus === 'consulting') {
      potentialProducts = ALL_PRODUCTS.filter(p => ['lexolution'].includes(p.id));
    } else if (workFocus === 'forensic') {
      potentialProducts = ALL_PRODUCTS.filter(p => ['advoware', 'winmacs'].includes(p.id));
    } else {
      // Fallback if workFocus is not selected: all non-CH products
      potentialProducts = ALL_PRODUCTS.filter(p => ['lexolution', 'winmacs', 'advoware'].includes(p.id));
    }
  }

  // 2. Calculate base scores from firmographics
  const baseScores = new Map<string, number>();
  const lawyerCount = answers.lawyerCount ? parseInt(answers.lawyerCount as string, 10) : 0;

  potentialProducts.forEach(p => {
    let score = 50; // Neutral base

    // Score by lawyer count
    if (lawyerCount > 0) {
      if (p.id === 'lexolution') {
        if (lawyerCount > 50) score += 60;
        else if (lawyerCount > 15) score += 50;
        else score -= 30; // Not ideal for small firms
      }
      if (p.id === 'winmacs') {
        if (lawyerCount >= 6 && lawyerCount <= 50) score += 50;
        else score += 10;
      }
      if (p.id === 'advoware' || p.id === 'amberlo') {
        if (lawyerCount <= 15) score += 50;
        else if (lawyerCount <= 50) score += 20;
        else score -= 20; // Less ideal for very large firms
      }
    }

    // Score by work focus
    if (answers.workFocus === 'consulting') {
      if (p.id === 'lexolution' || p.id === 'amberlo') score += 40;
    }

    // Score by billing type
    const billingType = answers.billingType;
    if (billingType === 'hourly') {
      if (p.id === 'lexolution' || p.id === 'amberlo') score += 30;
    } else if (billingType === 'rvg') {
      if (p.id === 'advoware' || p.id === 'winmacs') score += 20;
    } else if (billingType === 'mixed') {
      if (['lexolution', 'amberlo', 'advoware', 'winmacs'].includes(p.id)) score += 10;
    }

    // Score by notary needs
    if (answers.notary === 1) {
      if (p.id === 'winmacs' || p.id === 'advoware') score += 50;
    }

    baseScores.set(p.id, score);
  });

  // 3. Determine feature needs from maturity quiz
  const desiredFeatureIds = Object.entries(answers)
    .filter(([questionId, answer]) => maturityNeedsMap[questionId] && answer === 0) // 'No' means they need the feature
    .map(([questionId]) => maturityNeedsMap[questionId]);

  // 4. Calculate feature-based scores
  const featureScores = calculateFeatureScore(potentialProducts, ALL_FEATURES, desiredFeatureIds);

  // 5. Combine scores and sort
  const finalScoredProducts = potentialProducts.map(p => {
    const baseScore = baseScores.get(p.id) || 50;
    const featureScore = featureScores.get(p.id) || 0;
    // Weight firmographics higher as they are primary decision factors
    const combinedScore = baseScore * 0.7 + featureScore * 0.3;
    return { ...p, fitScore: combinedScore };
  }).sort((a, b) => b.fitScore - a.fitScore);

  if (finalScoredProducts.length === 0) {
    const defaultProduct = ALL_PRODUCTS.find(p => p.id === 'advoware') || ALL_PRODUCTS[0];
    return {
      topProduct: defaultProduct,
      alternatives: ALL_PRODUCTS.filter(p => p.id !== defaultProduct.id).slice(0, 3),
      relevantFeatures: [],
      missingFeaturesForTopProduct: [],
    };
  }

  const topProduct = finalScoredProducts[0];
  const alternatives = finalScoredProducts.slice(1, 4).filter(p => p.id !== topProduct.id);

  const relevantFeatures = ALL_FEATURES.filter(feature =>
    desiredFeatureIds.includes(feature.id) && (feature[topProduct.id] === true || typeof feature[topProduct.id] === 'string')
  );

  const missingFeaturesForTopProduct = ALL_FEATURES.filter(feature =>
    desiredFeatureIds.includes(feature.id) && !feature[topProduct.id]
  );

  return { topProduct, alternatives, relevantFeatures, missingFeaturesForTopProduct };
};