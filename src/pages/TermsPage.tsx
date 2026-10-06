// src/pages/TermsPage.tsx
import React from 'react';
import { ShieldAlert, AlertTriangle, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="pb-6 border-b border-white/10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold mb-2">
          <ShieldAlert className="h-3.5 w-3.5" />
          <span>Terms & Disclaimers</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Terms of Use</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Hackathon Prototype Terms • Informational Use Only
        </p>
      </div>

      <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-300 space-y-6 leading-relaxed">
        {/* Core Mandatory Warning Banner */}
        <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-200 space-y-2">
          <div className="flex items-center gap-2 font-bold text-rose-300 uppercase tracking-wider text-xs">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>MANDATORY NON-DIAGNOSTIC NOTICE</span>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed">
            CARE-PASS AI is a student hackathon prototype, <strong>NOT a medical diagnosis system</strong>. The application must never be construed as diagnosing diseases, prescribing medicines, replacing licensed physicians, or guaranteeing medical outcomes. Users must always consult certified medical doctors for diagnosis, prescription, and treatment.
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">1. Nature of the Service</h2>
          <p>
            CARE-PASS AI provides structured organization of patient-submitted text. It translates everyday colloquial health narratives (in English or Tamil) into standardized formats so that patients can present their thoughts more clearly during clinical encounters.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">2. Emergency Situations</h2>
          <p>
            If you or someone around you experiences severe acute symptoms (such as crushing chest pain, difficulty breathing, sudden paralysis, severe trauma, or anaphylaxis), do NOT rely on web applications. Immediately contact emergency dispatch (dial <strong>108, 911, or your regional emergency line</strong>) or proceed to the nearest emergency clinic.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">3. Care-Pass Score Interpretation</h2>
          <p>
            The signature "Care-Pass Score" represents <em>Information Completeness</em>—evaluating how thoroughly a user has described onset, symptoms, duration, and context. It is strictly a documentation completeness metric, <strong>NOT a clinical wellness or health score</strong>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">4. User Agreement</h2>
          <p>
            By continuing to access and use CARE-PASS AI, you acknowledge that outputs are solely informational and intended for pre-consultation doctor preparation.
          </p>
        </section>
      </div>
    </div>
  );
};
