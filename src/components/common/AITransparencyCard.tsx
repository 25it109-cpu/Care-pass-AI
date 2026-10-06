// src/components/common/AITransparencyCard.tsx
import React from 'react';
import { ShieldCheck, CheckCircle2, XCircle, Info } from 'lucide-react';

export const AITransparencyCard: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const whatAIDoes = [
    'Organizes health concerns chronologically and categorically',
    'Extracts user-provided symptoms, duration, and severity',
    'Creates clear structured summaries for doctor visits',
    'Suggests intelligent follow-up questions to discuss with professionals'
  ];

  const whatAIDoesNotDo = [
    'Diagnose diseases or medical conditions',
    'Replace licensed doctors or healthcare providers',
    'Prescribe medicines or dosage instructions',
    'Guarantee clinical outcomes or emergency triage'
  ];

  if (compact) {
    return (
      <div className="rounded-xl border border-white/10 bg-surface-elevated/40 p-3 text-xs text-slate-300">
        <div className="flex items-center gap-2 mb-2 font-semibold text-white">
          <ShieldCheck className="h-4 w-4 text-cyan-400" />
          <span>AI Transparency & Safety Guardrails</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
          <div className="text-emerald-300">✓ Organizes user details, never diagnoses</div>
          <div className="text-rose-300">✗ No medical advice or prescriptions</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-surface-elevated/60 backdrop-blur-md p-6 shadow-glass">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            AI Transparency & Safety Protocol
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 uppercase font-semibold">
              Hackathon Verified
            </span>
          </h3>
          <p className="text-xs text-slate-400">Clear boundaries ensuring patient safety and ethical AI assistance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* What AI Does */}
        <div className="rounded-xl bg-emerald-950/20 border border-emerald-500/20 p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2 mb-3">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            WHAT CARE-PASS AI DOES:
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            {whatAIDoes.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold shrink-0">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* What AI Does Not Do */}
        <div className="rounded-xl bg-rose-950/20 border border-rose-500/20 p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2 mb-3">
            <XCircle className="h-4 w-4 shrink-0" />
            WHAT CARE-PASS AI DOES NOT DO:
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            {whatAIDoesNotDo.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-rose-400 font-bold shrink-0">✗</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 text-[11px] text-slate-400">
        <Info className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
        <span>This is a student innovation prototype. Always consult a certified healthcare professional for medical decisions.</span>
      </div>
    </div>
  );
};
