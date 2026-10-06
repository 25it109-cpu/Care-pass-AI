// src/pages/AboutPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { AITransparencyCard } from '../components/common/AITransparencyCard';
import {
  HeartPulse,
  Sparkles,
  ShieldCheck,
  Languages,
  CheckCircle2,
  Stethoscope,
  Code2,
  Zap,
  ArrowRight
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Hero Title */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Student Hackathon Innovation Prototype</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          About CARE-PASS <span className="text-cyan-400">AI</span>
        </h1>
        <p className="text-base text-slate-300 leading-relaxed">
          AI-Powered Multilingual Patient Information & Care-Navigation Platform designed to bridge the communication gap between patients and healthcare professionals.
        </p>
        <div className="p-3.5 rounded-xl bg-surface-elevated/70 border border-white/10 text-xs sm:text-sm text-cyan-200 font-medium italic max-w-xl mx-auto">
          “Turn health concerns into clear, organized information — in seconds.”
        </div>
      </div>

      {/* Core Problem & Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/10 bg-surface-elevated/70 p-6 shadow-glass space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rose-400"></span>
            <span>The Core Healthcare Problem</span>
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Healthcare information is often scattered, emotionally difficult to express, and language-dependent. In high-stress clinical moments, patients frequently forget onset dates, omit medications, or struggle with terminology.
          </p>
          <ul className="space-y-1.5 text-xs text-slate-400 pt-1">
            <li>• Difficulty remembering when symptoms began</li>
            <li>• Language barriers (e.g. expressing Tamil symptoms in English clinics)</li>
            <li>• Forgetting over-the-counter tablets taken</li>
            <li>• Anxiety during short 7-minute doctor appointments</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-cyan-500/30 bg-surface-elevated/70 p-6 shadow-glass space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
            <span>The CARE-PASS AI Solution</span>
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            CARE-PASS AI does NOT diagnose. Instead, it serves as an informational cognitive organizer that extracts patient-provided statements into a doctor-ready structured summary with a unique Care-Pass Completeness metric.
          </p>
          <ul className="space-y-1.5 text-xs text-slate-400 pt-1">
            <li>• English and Tamil natural-language input support</li>
            <li>• Zero-hallucination extraction (explicit data only)</li>
            <li>• Informational urgency triage flags</li>
            <li>• Doctor-ready PDF consultation export</li>
          </ul>
        </div>
      </div>

      {/* Architecture Highlights */}
      <div className="rounded-2xl border border-white/10 bg-surface-elevated/70 p-8 shadow-glass space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center font-bold">
            <Code2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Full-Stack Hackathon Architecture</h3>
            <p className="text-xs text-slate-400">Engineered for resiliency, performance, and accessibility</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1.5">
            <span className="text-cyan-400 font-bold block uppercase tracking-wider text-[11px]">Frontend</span>
            <p className="text-white font-medium">React + TypeScript + Vite</p>
            <p className="text-slate-400 text-[11px]">Tailwind CSS, Framer Motion, HTML5 3D Canvas visual, Lucide icons, jsPDF.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1.5">
            <span className="text-violet-400 font-bold block uppercase tracking-wider text-[11px]">Backend API</span>
            <p className="text-white font-medium">Node.js + Express</p>
            <p className="text-slate-400 text-[11px]">Multilingual NLP extraction engine, LLM cloud connector, robust offline fallback.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1.5">
            <span className="text-emerald-400 font-bold block uppercase tracking-wider text-[11px]">Database & Security</span>
            <p className="text-white font-medium">Supabase PostgreSQL</p>
            <p className="text-slate-400 text-[11px]">Row Level Security (RLS) policies, password hashing, privacy center export.</p>
          </div>
        </div>
      </div>

      {/* AI Transparency & Ethical Safety Protocol */}
      <AITransparencyCard />

      {/* Action CTA */}
      <div className="text-center pt-4">
        <Link
          to="/analyze"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm shadow-glow-cyan transition-all"
        >
          <span>Try CARE-PASS AI Now</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};
