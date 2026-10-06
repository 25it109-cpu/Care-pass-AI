// src/pages/PrivacyPage.tsx
import React from 'react';
import { ShieldCheck, Lock, EyeOff, Server, Download, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="pb-6 border-b border-white/10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-2">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Patient Privacy Protocol</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Privacy Policy</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Last updated: October 2026 • Student Hackathon Innovation Prototype
        </p>
      </div>

      <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-300 space-y-6 leading-relaxed">
        <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-cyan-200">
          <strong>Non-Commercial Prototype:</strong> CARE-PASS AI is built for global hackathon evaluation. We do not monetize patient health entries, sell data to pharmaceutical advertisers, or engage in medical surveillance.
        </div>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">1. Scope of Information Gathered</h2>
          <p>
            CARE-PASS AI collects only the text you explicitly provide in the health concern input box (such as symptoms, onset timing, severity descriptions, and medications). If an input is left blank or not provided, the platform explicitly marks it as "Not provided" and never hallucinates medical records.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">2. Purpose of Processing</h2>
          <p>
            Information is strictly processed to:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li>Generate structured summaries for your personal doctor appointments</li>
            <li>Provide an informational priority indication (Routine, Attention, Urgent)</li>
            <li>Calculate the Care-Pass Information Completeness score</li>
            <li>Formulate calm follow-up questions you can ask during your clinical consultation</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">3. Data Sovereignty & Portability</h2>
          <p>
            You hold uncompromised ownership over your records. You may visit the{' '}
            <Link to="/profile" className="text-cyan-400 underline font-semibold">
              Privacy Center
            </Link>{' '}
            at any time to export all your saved notes as a JSON archive, or execute an irreversible one-click data deletion.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">4. Row Level Security & Access Control</h2>
          <p>
            When connected to PostgreSQL/Supabase, Row Level Security (RLS) guarantees that patient records are strictly inaccessible by unauthorized third parties. Doctor demo accounts only inspect fictional simulated patients.
          </p>
        </section>
      </div>
    </div>
  );
};
