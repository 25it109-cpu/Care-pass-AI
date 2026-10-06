// src/pages/HowItWorksPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Languages,
  Sparkles,
  AlertTriangle,
  Stethoscope,
  ArrowRight,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Zap
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'DESCRIBE',
      subtitle: 'Express your symptoms in everyday words',
      desc: 'No medical jargon needed. Speak or write naturally in English or Tamil. Describe what hurts, how long it has been going on, and any remedies you took.',
      icon: Languages,
      color: 'text-cyan-400',
      border: 'border-cyan-500/30',
      sample: '“எனக்கு இரண்டு நாட்களாக காய்ச்சல் இருக்கு, உடம்பு ரொம்ப சோர்வா இருக்கு.”'
    },
    {
      num: '02',
      title: 'UNDERSTAND',
      subtitle: 'AI organizes the information cleanly',
      desc: 'The AI engine isolates distinct variables: primary concern, specific symptoms, duration, reported severity, medications, and clinical context without hallucination.',
      icon: Sparkles,
      color: 'text-blue-400',
      border: 'border-blue-500/30',
      sample: 'Symptoms: Fever, Fatigue | Duration: 2 days | Severity: High weakness'
    },
    {
      num: '03',
      title: 'PRIORITIZE',
      subtitle: 'Receive an informational urgency indication',
      desc: 'Calculates an informational priority: Routine 🟢, Needs Attention 🟠, or Urgent 🔴. If critical red-flags appear, safe emergency instructions are triggered.',
      icon: AlertTriangle,
      color: 'text-amber-400',
      border: 'border-amber-500/30',
      sample: 'Priority: Needs Attention (Persistent fever requiring clinical assessment)'
    },
    {
      num: '04',
      title: 'PREPARE',
      subtitle: 'Generate a doctor-ready clinical handoff summary',
      desc: 'Receive a professional-ready summary, smart questions to ask your physician, a completeness score, and instant PDF download/print buttons.',
      icon: Stethoscope,
      color: 'text-emerald-400',
      border: 'border-emerald-500/30',
      sample: 'Doctor-ready PDF generated with patient history and follow-up questions'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Title */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs uppercase font-extrabold tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
          The CARE-PASS AI Pipeline
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          How CARE-PASS AI Works
        </h1>
        <p className="text-base text-slate-300">
          A seamless 4-step workflow that transforms messy, stressful health concerns into clear, structured clinical handoffs.
        </p>
      </div>

      {/* Step by Step Breakdown */}
      <div className="space-y-6">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={s.num}
              className={`rounded-2xl bg-surface-elevated/70 border ${s.border} p-6 sm:p-8 shadow-glass transition-all hover:scale-[1.01]`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center shrink-0">
                    <Icon className={`h-6 w-6 ${s.color}`} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-slate-500">Step {s.num}</span>
                      <h2 className="text-lg font-bold text-white tracking-wide">{s.title}</h2>
                    </div>
                    <p className={`text-xs font-semibold ${s.color}`}>{s.subtitle}</p>
                    <p className="text-xs text-slate-300 leading-relaxed pt-1 max-w-2xl">
                      {s.desc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sample output box */}
              <div className="mt-4 pt-4 border-t border-white/5 bg-black/20 p-3 rounded-xl border border-white/5 text-xs text-slate-300 flex items-center gap-2 font-mono">
                <span className="text-slate-500 font-bold shrink-0">Example:</span>
                <span className="truncate text-cyan-200">{s.sample}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tamil Multilingual Highlight Box */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-surface-elevated to-slate-900 p-8 shadow-glass space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
            <Languages className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Multilingual Architecture (Tamil + English)</h3>
            <p className="text-xs text-slate-400">Zero-hallucination semantic parsing</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
          <div className="bg-slate-900/80 p-4 rounded-xl border border-white/5 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
              TAMIL USER SUBMISSION
            </span>
            <p className="text-white text-sm leading-relaxed">
              “எனக்கு இரண்டு நாட்களாக காய்ச்சல் இருக்கு, உடம்பு ரொம்ப சோர்வா இருக்கு.”
            </p>
            <p className="text-[11px] text-slate-400">
              Expressing symptoms in native Tamil without struggling for English medical terms.
            </p>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-white/5 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              AI STRUCTURED EXTRACTION
            </span>
            <div className="space-y-1 text-slate-300">
              <div>• <strong>Main Concern:</strong> Fever with fatigue</div>
              <div>• <strong>Symptoms:</strong> Fever (காய்ச்சல்), Weakness (சோர்வு)</div>
              <div>• <strong>Duration:</strong> 2 days (இரண்டு நாட்கள்)</div>
              <div>• <strong>Severity:</strong> Reported pronounced fatigue</div>
              <div>• <strong>Missing Info:</strong> Exact thermometer reading</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link
          to="/analyze"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm shadow-glow-cyan transition-all"
        >
          <Zap className="h-4 w-4" />
          <span>Launch AI Analyzer</span>
        </Link>
      </div>
    </div>
  );
};
