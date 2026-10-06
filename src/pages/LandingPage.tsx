// src/pages/LandingPage.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeroVisual } from '../components/3d/HeroVisual';
import { AITransparencyCard } from '../components/common/AITransparencyCard';
import {
  ArrowRight,
  Sparkles,
  Languages,
  FileText,
  AlertTriangle,
  Stethoscope,
  Download,
  ShieldCheck,
  Smartphone,
  History,
  MessageSquare,
  CheckCircle2,
  Compass,
  Zap,
  Clock,
  Play
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { quickDemoLogin } = useAuth();
  const navigate = useNavigate();

  const handleQuickDemo = async () => {
    await quickDemoLogin('PATIENT');
    navigate('/analyze?scenario=1');
  };

  const steps = [
    {
      step: '01',
      title: 'DESCRIBE',
      desc: 'Tell us your health concern in everyday words (English or Tamil).',
      icon: Languages,
      color: 'from-cyan-500 to-blue-500'
    },
    {
      step: '02',
      title: 'UNDERSTAND',
      desc: 'AI extracts only explicitly provided symptoms, onset, and context.',
      icon: Sparkles,
      color: 'from-blue-500 to-violet-500'
    },
    {
      step: '03',
      title: 'PRIORITIZE',
      desc: 'Receive an informational urgency indication with clinical safety alerts.',
      icon: AlertTriangle,
      color: 'from-violet-500 to-rose-500'
    },
    {
      step: '04',
      title: 'PREPARE',
      desc: 'Generate an organized doctor-ready summary with PDF and copy options.',
      icon: Stethoscope,
      color: 'from-emerald-500 to-cyan-500'
    }
  ];

  const features = [
    {
      icon: Languages,
      title: 'Multilingual Input',
      desc: 'Express yourself naturally in English or Tamil. Preserves full cultural context without loss of meaning.',
      tag: 'Tamil + English'
    },
    {
      icon: Sparkles,
      title: 'AI Information Extraction',
      desc: 'Categorizes symptoms, onset, duration, and severity strictly without hallucinating or inventing data.',
      tag: 'Zero-Hallucination'
    },
    {
      icon: FileText,
      title: 'Patient Summary',
      desc: 'Transforms fragmented, stressful health descriptions into clean, structured clinical handoffs.',
      tag: 'Concise & Structured'
    },
    {
      icon: AlertTriangle,
      title: 'Priority Indicator',
      desc: 'Informational Routine 🟢, Needs Attention 🟠, and Urgent 🔴 flags to guide timely action.',
      tag: 'Non-Diagnostic'
    },
    {
      icon: Stethoscope,
      title: 'Professional-Ready Report',
      desc: 'Formats information exactly how doctors prefer to review patient history during busy clinics.',
      tag: 'Clinical Handoff'
    },
    {
      icon: Download,
      title: 'PDF & Print Export',
      desc: 'One-click downloadable PDF and clean print formatting ready to take into your clinic appointment.',
      tag: 'Offline Ready'
    },
    {
      icon: ShieldCheck,
      title: 'Privacy & Data Ownership',
      desc: 'Full control with instant JSON data export and permanent one-click data deletion.',
      tag: 'User-Owned Data'
    },
    {
      icon: Smartphone,
      title: 'Mobile Responsive',
      desc: 'Feels like a native mobile healthcare app on iPhones, Android devices, tablets, and laptops.',
      tag: 'Any Device'
    },
    {
      icon: History,
      title: 'Health Timeline',
      desc: 'Chronological timeline of your symptoms and concerns over time to track health patterns.',
      tag: 'Longitudinal View'
    },
    {
      icon: MessageSquare,
      title: 'Smart Follow-Up Questions',
      desc: 'Thoughtful, calm questions doctors usually ask so you never freeze up during your visit.',
      tag: 'Visit Preparation'
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-cyan-500/10 via-blue-500/5 to-transparent blur-[120px] pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Hackathon Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold shadow-glow-cyan animate-pulse-slow">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Student Hackathon Innovation Prototype</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Your Health Story, <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                Organized by AI.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Transform everyday health concerns into clear, structured information that helps you communicate better with healthcare professionals.
            </p>

            {/* Tagline Box */}
            <div className="p-3.5 rounded-xl bg-surface-elevated/70 border border-white/10 text-xs sm:text-sm text-cyan-200/90 font-medium italic flex items-center justify-center lg:justify-start gap-2 max-w-xl">
              <span className="text-cyan-400 font-bold not-italic">TAGLINE:</span>
              “Turn health concerns into clear, organized information — in seconds.”
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={handleQuickDemo}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-sm shadow-glow-cyan transition-all hover:scale-[1.02]"
              >
                <Zap className="h-4 w-4 fill-current" />
                <span>🚀 ENTER HACKATHON DEMO</span>
              </button>

              <Link
                to="/how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-sm border border-white/10 transition-all hover:border-white/20"
              >
                <Play className="h-4 w-4 text-cyan-400" />
                <span>See How It Works</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Non-Diagnostic</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                <span>English & Tamil Support</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-violet-400" />
                <span>Zero AI Hallucinations</span>
              </div>
            </div>
          </div>

          {/* Right Visual Column (3D Canvas Interactive Sphere) */}
          <div className="lg:col-span-5 flex justify-center">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* 4-Step "HOW IT WORKS" Section */}
      <section className="py-20 border-t border-white/10 bg-slate-950/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase font-extrabold tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
              Structured Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              From Confusion to Clarity in 4 Simple Steps
            </h2>
            <p className="text-slate-400 text-sm">
              Patients often freeze up or forget vital details in front of doctors. CARE-PASS AI organizes your symptoms beforehand.
            </p>
          </div>

          {/* Step Grid with connecting indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.step}
                  className="relative rounded-2xl bg-surface-elevated/70 border border-white/10 p-6 shadow-glass hover:border-cyan-500/30 transition-all duration-300 group hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-slate-600 group-hover:text-cyan-400/80 transition-colors font-mono">
                      {s.step}
                    </span>
                    <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${s.color} p-[1px]`}>
                      <div className="h-full w-full bg-[#070b14] rounded-xl flex items-center justify-center text-white">
                        <Icon className="h-5 w-5 text-cyan-300" />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-white tracking-wide mb-2">
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Section (Requirement 7) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase font-extrabold tracking-widest text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">
            Platform Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Designed for Modern Patient-Provider Communication
          </h2>
          <p className="text-slate-400 text-sm">
            Carefully crafted features ensuring clarity, linguistic inclusivity, and patient empowerment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-surface-elevated/50 border border-white/10 p-6 hover:bg-surface-elevated/80 hover:border-cyan-500/30 transition-all duration-300 shadow-glass group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                    {f.tag}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trust & Transparency Section (Requirement 27) */}
      <section className="py-16 border-t border-white/10 bg-slate-950/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AITransparencyCard />
        </div>
      </section>

      {/* Hackathon Call-To-Action Banner */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-cyan-950/40 via-surface-elevated to-blue-950/40 border border-cyan-500/30 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-radial-glow pointer-events-none opacity-40"></div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 bg-cyan-500/20 px-3 py-1 rounded-full border border-cyan-500/30 inline-block">
              Hackathon Ready • 2-Minute Judge Walkthrough
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to experience CARE-PASS AI?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Test Tamil or English input, see instantaneous completeness scoring, inspect doctor handoff summaries, and explore the admin analytics panel.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={handleQuickDemo}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm shadow-glow-cyan transition-all"
              >
                Launch Live Demo (Scenario 1)
              </button>
              <Link
                to="/register"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-sm border border-white/10"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
