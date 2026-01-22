import { supabase } from '../lib/supabaseClient';
import { Json } from '../types/database.types';

const SESSION_KEY = 'stp_tracker_session';

const getSessionId = (): string => {
    let sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem(SESSION_KEY, sessionId);
    }
    return sessionId;
};

type EventType = 'page_view' | 'quiz_start' | 'quiz_complete' | 'outbound_click' | 'comparison_view' | 'quiz_answer' | 'cta_click' | 'restart_quiz' | 'visit_location';

export const trackEvent = async (eventType: EventType, payload?: Json) => {
    const sessionId = getSessionId();
    const path = window.location.pathname;

    try {
        const { error } = await supabase.from('tracking_events').insert({
            session_id: sessionId,
            event_type: eventType,
            payload: payload as any,
            path
        } as any);

        if (error) {
            console.error('Error tracking event:', error);
        }
    } catch (err) {
        console.error('Failed to send tracking event:', err);
    }
};

// Basic in-memory cache for location to avoid repeated API calls
let cachedLocation: any = null;

export const trackLocation = async () => {
    if (cachedLocation) return cachedLocation;

    try {
        // Using ipapi.co for free IP geolocation (rate limited but sufficient for demo/mvp)
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();

        if (data.error) {
            console.warn('Location tracking failed:', data.reason);
            return null;
        }

        cachedLocation = {
            ip: data.ip,
            city: data.city,
            region: data.region,
            country: data.country_name,
            postal: data.postal
        };

        // Track the visit with location data
        trackEvent('visit_location', cachedLocation);
        return cachedLocation;
    } catch (err) {
        console.error('Failed to track location:', err);
        return null;
    }
};

export const trackPageView = () => {
    trackEvent('page_view');
    // Try to track location on first page view (usually landing)
    if (!cachedLocation) trackLocation();
};
export const trackQuizStart = () => trackEvent('quiz_start');
export const trackQuizComplete = (resultProduct: string, answers?: Record<string, any>) => trackEvent('quiz_complete', { result: resultProduct, answers });
// Map frontend question IDs (camelCase) to DB columns (snake_case)
const QUESTION_MAPPING: Record<string, string> = {
    'location': 'location',
    'lawyerCount': 'lawyer_count',
    'refaCount': 'refa_count',
    'currentSoftware': 'current_software',
    'currentSoftwareOther': 'current_software_other',
    'workFocus': 'work_focus',
    'billingType': 'billing_type',
    'notary': 'notary',
    'notaryCount': 'notary_count',
    'averageHourlyRate': 'average_hourly_rate',
    'maturity_q1': 'maturity_q1',
    'maturity_q3': 'maturity_q3',
    'maturity_q4': 'maturity_q4',
    'maturity_q5': 'maturity_q5',
    'maturity_q6': 'maturity_q6',
    'maturity_q7': 'maturity_q7',
    'maturity_q8': 'maturity_q8',
    'maturity_q9': 'maturity_q9',
    'maturity_q10': 'maturity_q10',
    'maturity_q11': 'maturity_q11',
    'maturity_q12': 'maturity_q12',
    'maturity_q13': 'maturity_q13',
    'maturity_q14': 'maturity_q14',
    'maturity_q15': 'maturity_q15',
    'maturity_q16': 'maturity_q16',
};

export const saveQuizProgress = async (answers: Record<string, any>) => {
    const sessionId = getSessionId();

    // Prepare the update object
    const updateData: Record<string, any> = {
        session_id: sessionId,
        answers: answers, // Store full JSON blob as backup
        updated_at: new Date().toISOString(), // Ensure we update the timestamp if column exists or just metadata
    };

    // Map individual answers to columns
    Object.keys(answers).forEach(key => {
        const dbColumn = QUESTION_MAPPING[key];
        if (dbColumn) {
            let value = answers[key];
            // Convert yes/no (1/0) to boolean if needed, though Postgres often handles integer->boolean 
            // but let's be explicit if our DB expects boolean for maturity questions
            if (key.startsWith('maturity_') || key === 'notary') {
                // in QuestionBlock yes=1, no=0. DB expects boolean
                if (value === 1) value = true;
                else if (value === 0) value = false;
            }
            if (dbColumn.includes('count') || dbColumn === 'average_hourly_rate') {
                value = parseInt(value, 10);
                if (isNaN(value)) value = null;
            }

            updateData[dbColumn] = value;
        }
    });

    try {
        // Upsert based on session_id ?? No, schema defines ID as PK. 
        // We need to look up if a row exists for this session_id. 
        // Or we can rely on session_id being unique constraint? 
        // The schema currently does NOT have a unique constraint on session_id, but it should for this logic to work optimally with onConflict.
        // For now, we'll try to select first.

        const { data: existingRow } = await supabase
            .from('quiz_submissions')
            .select('id')
            .eq('session_id', sessionId)
            .single();

        if (existingRow) {
            const { error } = await supabase
                .from('quiz_submissions')
                .update(updateData as any)
                .eq('id', (existingRow as any).id);
            if (error) console.error('Error updating progress:', error);
        } else {
            const { error } = await supabase
                .from('quiz_submissions')
                .insert(updateData as any);
            if (error) console.error('Error inserting progress:', error);
        }

    } catch (err) {
        console.error('Failed to save quiz progress:', err);
    }
};

export const saveQuizResult = async (resultProduct: string) => {
    const sessionId = getSessionId();
    try {
        const { data: existingRow } = await supabase
            .from('quiz_submissions')
            .select('id')
            .eq('session_id', sessionId)
            .single();

        if (existingRow) {
            const { error } = await supabase
                .from('quiz_submissions')
                .update({ result_product: resultProduct, updated_at: new Date().toISOString() } as any)
                .eq('id', (existingRow as any).id);
            if (error) console.error('Error saving quiz result:', error);
        } else {
            // Should not happen if progress is saved, but safe fallback
            const { error } = await supabase
                .from('quiz_submissions')
                .insert({
                    session_id: sessionId,
                    result_product: resultProduct,
                    answers: {}, // Empty if created here
                } as any);
            if (error) console.error('Error inserting quiz result:', error);
        }
    } catch (err) {
        console.error('Failed to save quiz result:', err);
    }
};

export const trackOutboundClick = (url: string, product: string) => trackEvent('outbound_click', { url, product });
export const trackComparisonView = (products: string[]) => trackEvent('comparison_view', { products });
