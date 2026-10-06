-- CARE-PASS AI Database Schema
-- Supabase PostgreSQL Migration
-- Enables Row Level Security (RLS) and provides structured tables for Patient, Professional, and Admin workflows.

-- 1. Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('PATIENT', 'HEALTHCARE_PROFESSIONAL', 'ADMIN')) DEFAULT 'PATIENT',
    preferred_language TEXT NOT NULL DEFAULT 'en',
    emergency_number TEXT DEFAULT '108',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Health Entries Table
CREATE TABLE IF NOT EXISTS public.health_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    input_text TEXT NOT NULL,
    language TEXT NOT NULL DEFAULT 'en',
    source TEXT DEFAULT 'web',
    is_demo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Health Summaries Table
CREATE TABLE IF NOT EXISTS public.health_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    health_entry_id UUID REFERENCES public.health_entries(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    main_concern TEXT NOT NULL,
    symptoms JSONB NOT NULL DEFAULT '[]'::jsonb,
    duration TEXT DEFAULT 'Not provided',
    severity TEXT DEFAULT 'Not provided',
    relevant_information JSONB NOT NULL DEFAULT '[]'::jsonb,
    medications_mentioned JSONB NOT NULL DEFAULT '[]'::jsonb,
    previous_conditions JSONB NOT NULL DEFAULT '[]'::jsonb,
    other_concerns TEXT DEFAULT 'Not provided',
    missing_information JSONB NOT NULL DEFAULT '[]'::jsonb,
    priority TEXT NOT NULL CHECK (priority IN ('routine', 'attention', 'urgent')),
    priority_reason TEXT NOT NULL,
    follow_up_questions JSONB NOT NULL DEFAULT '[]'::jsonb,
    completeness_score INTEGER DEFAULT 0,
    disclaimer TEXT NOT NULL DEFAULT 'This priority indicator is informational and does not replace professional medical assessment.',
    is_demo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Appointments Table (Pre-visit preparation / reminders)
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    health_summary_id UUID REFERENCES public.health_summaries(id) ON DELETE SET NULL,
    provider_name TEXT NOT NULL,
    specialty TEXT DEFAULT 'General Practice',
    appointment_date TIMESTAMPTZ NOT NULL,
    location TEXT,
    notes TEXT,
    status TEXT CHECK (status IN ('SCHEDULED', 'COMPLETED', 'CANCELLED')) DEFAULT 'SCHEDULED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Emergency Contacts Table
CREATE TABLE IF NOT EXISTS public.emergency_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    contact_name TEXT NOT NULL,
    relationship TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Audit Logs Table (Admin review & safety monitoring)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view and update their own profile. Admins can view all.
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN');

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Health Entries: Patients view & insert their own.
CREATE POLICY "Users can manage own health entries" ON public.health_entries
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Doctors can view shared entries" ON public.health_entries
    FOR SELECT USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'HEALTHCARE_PROFESSIONAL' AND is_demo = TRUE);

-- Health Summaries: Patients manage own summaries.
CREATE POLICY "Users can manage own health summaries" ON public.health_summaries
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Doctors can view shared summaries" ON public.health_summaries
    FOR SELECT USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'HEALTHCARE_PROFESSIONAL' AND is_demo = TRUE);

-- Emergency Contacts: Patients manage their own.
CREATE POLICY "Users can manage own emergency contacts" ON public.emergency_contacts
    FOR ALL USING (auth.uid() = user_id);

-- Appointments: Patients manage their own.
CREATE POLICY "Users can manage own appointments" ON public.appointments
    FOR ALL USING (auth.uid() = user_id);

-- Audit logs: Admins can view audit logs.
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
    FOR SELECT USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN');
