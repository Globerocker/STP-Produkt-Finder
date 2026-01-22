-- 1. Tracking Events Table (Generic events like page_view, clicks)
CREATE TABLE IF NOT EXISTS public.tracking_events (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    session_id TEXT NOT NULL,
    event_type TEXT NOT NULL, -- 'page_view', 'quiz_start', 'quiz_complete', 'comparison_view'
    path TEXT,
    payload JSONB, -- Stores flexible data
    CONSTRAINT tracking_events_pkey PRIMARY KEY (id)
);

-- 2. Quiz Submissions Table (Dedicated table for full answer sets)
CREATE TABLE IF NOT EXISTS public.quiz_submissions (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    session_id TEXT NOT NULL,
    answers JSONB NOT NULL, -- The full answers object
    result_product TEXT, -- The recommended product name/ID
    language TEXT DEFAULT 'de',
    
    -- Granular Tracking Columns
    location TEXT,
    lawyer_count INTEGER,
    refa_count INTEGER,
    current_software TEXT,
    current_software_other TEXT,
    work_focus TEXT,
    billing_type TEXT,
    notary BOOLEAN,
    notary_count INTEGER,
    average_hourly_rate INTEGER,

    -- Maturity Questions (Boolean/YesNo)
    maturity_q1 BOOLEAN,
    maturity_q3 BOOLEAN, -- q2 is missing/skipped in source
    maturity_q4 BOOLEAN,
    maturity_q5 BOOLEAN,
    maturity_q6 BOOLEAN,
    maturity_q7 BOOLEAN,
    maturity_q8 BOOLEAN,
    maturity_q9 BOOLEAN,
    maturity_q10 BOOLEAN,
    maturity_q11 BOOLEAN,
    maturity_q12 BOOLEAN,
    maturity_q13 BOOLEAN,
    maturity_q14 BOOLEAN,
    maturity_q15 BOOLEAN,
    maturity_q16 BOOLEAN,

    CONSTRAINT quiz_submissions_pkey PRIMARY KEY (id)
);

-- 3. Leads Table (For contact forms/newsletter)
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    email TEXT NOT NULL,
    name TEXT,
    company TEXT,
    source TEXT,
    status TEXT DEFAULT 'new', -- 'new', 'contacted', 'converted'
    CONSTRAINT leads_pkey PRIMARY KEY (id)
);

-- 4. Enable Row Level Security (RLS) - Security Best Practice
ALTER TABLE public.tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 5. Policies to allow public access (since your app is public)
-- Allow anyone to INSERT data (Submissions)
DROP POLICY IF EXISTS "Allow public insert for tracking" ON public.tracking_events;
CREATE POLICY "Allow public insert for tracking" ON public.tracking_events FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public insert for submissions" ON public.quiz_submissions;
CREATE POLICY "Allow public insert for submissions" ON public.quiz_submissions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public insert for leads" ON public.leads;
CREATE POLICY "Allow public insert for leads" ON public.leads FOR INSERT WITH CHECK (true);

-- Allow only authenticated admins to READ data (Dashboard)
-- Note: 'authenticated' role usually means logged-in Supabase users
DROP POLICY IF EXISTS "Allow read for admins" ON public.tracking_events;
CREATE POLICY "Allow read for admins" ON public.tracking_events FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow read for admins" ON public.quiz_submissions;
CREATE POLICY "Allow read for admins" ON public.quiz_submissions FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow read for admins" ON public.leads;
CREATE POLICY "Allow read for admins" ON public.leads FOR SELECT USING (auth.role() = 'authenticated');
