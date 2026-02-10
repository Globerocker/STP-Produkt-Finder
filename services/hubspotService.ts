
import { Answers, Language } from '../types';
import { maturityNeedsMap } from '../lib/quizData';
import { HUBSPOT_FORM_ID, HUBSPOT_PORTAL_ID } from '../constants';

const getHubspotPropertyName = (questionId: string): string => {
  // Manual mapping for fields that don't map to a feature
  const manualMap: Record<string, string> = {
    lawyerCount: 'kanzleigroesse_anwaelte',
    refaCount: 'kanzleigroesse_refas',
    notaryCount: 'kanzleigroesse_notare',
    workFocus: 'kanzlei_ausrichtung',
    billingType: 'abrechnungsart',
    notary: 'notariat_vorhanden',
    location: 'standort_land',
    averageHourlyRate: 'durchschnittlicher_stundensatz',
    currentSoftware: 'aktuell_genutzte_software',
    currentSoftwareOther: 'aktuell_genutzte_software_sonstige',
    lang: 'quiz_language',
  };

  if (questionId.startsWith('maturity_q')) {
    return questionId;
  }

  return manualMap[questionId] || questionId;
};

export const prepareHubspotPayload = (answers: Answers, topProductName: string): { name: string; value: string }[] => {
  const payload: { name: string; value: string }[] = [];

  // Add recommended product first
  payload.push({ name: 'empfohlenes_produkt', value: topProductName });

  // Derive and add user_type
  const lawyerCount = parseInt(answers.lawyerCount as string, 10);
  if (!isNaN(lawyerCount)) {
    payload.push({ name: 'user_type', value: lawyerCount === 1 ? 'Einzelanwalt' : 'Kanzlei' });
  }

  for (const [questionId, answer] of Object.entries(answers)) {
    if (answer === null || answer === undefined || answer === '') continue;

    let propertyName = getHubspotPropertyName(questionId);
    let propertyValue = String(answer);

    if (questionId.startsWith('maturity_q') || questionId === 'notary') {
      // Use language-neutral values for better data processing
      propertyValue = answer === 1 ? 'yes' : 'no';
    }

    if (propertyName) {
      payload.push({ name: propertyName, value: propertyValue });
    }
  }
  return payload;
};

export const getHubspotUrlParams = (answers: Answers, topProductName: string, language: Language): URLSearchParams => {
  const params = new URLSearchParams();
  const payload = prepareHubspotPayload(answers, topProductName);
  payload.forEach(item => {
    params.set(item.name, item.value);
  });

  // Add UTM parameters for tracking
  params.set('utm_source', 'ProductFinder');
  params.set('utm_medium', 'ProductFinder');
  params.set('utm_campaign', 'ProductFinder_Recommendation');

  // Custom HubSpot Source Tracking (Drill down)
  params.set('hs_latest_source_drill_down_1', 'Productfinder');
  params.set('hs_latest_source_drill_down_2', topProductName);

  return params;
}

export const submitToHubspot = async (answers: Answers, topProductName: string, language: Language): Promise<void> => {
  const payload = prepareHubspotPayload(answers, topProductName);

  console.log("--- Preparing to submit to HubSpot ---");
  console.log("Formatted Payload for HubSpot API:", payload);

  // Check if IDs are set (and not just the default placeholders or empty)
  if (HUBSPOT_PORTAL_ID && HUBSPOT_PORTAL_ID !== 'YOUR_PORTAL_ID' && HUBSPOT_FORM_ID && HUBSPOT_FORM_ID !== 'YOUR_FORM_ID') {
    const url = `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_ID}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: payload,
          context: {
            pageUri: window.location.href,
            pageName: document.title
          }
        }),
      });

      if (response.ok) {
        console.log('Successfully submitted to HubSpot');
      } else {
        const errorData = await response.json();
        console.error('Failed to submit to HubSpot', errorData);
      }
    } catch (error) {
      console.error('Error submitting to HubSpot:', error);
    }
  } else {
    console.warn('HubSpot Portal ID or Form ID is not set correctly. Skipping actual submission.');
    console.warn('Check your .env file: VITE_HUBSPOT_PORTAL_ID and VITE_HUBSPOT_FORM_ID');
  }
};