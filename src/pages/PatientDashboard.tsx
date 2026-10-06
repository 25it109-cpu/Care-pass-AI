// src/pages/PatientDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { HealthSummary, Appointment } from '../types';
import { CarePassScore } from '../components/common/CarePassScore';
import { UrgencyBadge } from '../components/common/UrgencyBadge';
import { EmergencySafetyCard } from '../components/common/EmergencySafetyCard';
import {
  Sparkles,
  PlusCircle,
  History,
  User,
  PhoneCall,
  Calendar,
  FileText,
  Activity,
  ArrowRight,
  Clock,
  Compass,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const PatientDashboard: React.FC = () => {
  const { user, activeLanguage, setActiveLanguage } = useAuth();
  const navigate = useNavigate();

  const [summaries, setSummaries] = useState<HealthSummary[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [quickInput, setQuickInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [sumData, aptData] = await Promise.all([
          api.getHistory(),
          api.getAppointments()
        ]);
        setSummaries(sumData);
        setAppointments(aptData);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleQuickAnalyze = () => {
    if (!quickInput.trim()) return;
    navigate(`/analyze?text=${encodeURIComponent(quickInput)}`);
  };

  const recentSummary = summaries.length > 0 ? summaries[0] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {getGreeting()}, <span className="text-cyan-400">{user?.fullName || 'Patient'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Welcome to your CARE-PASS AI health navigation hub. Review past notes or prepare for your next consultation.
          </p>
        </div>

        {/* Quick Language Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Language:</span>
          <div className="flex items-center rounded-xl bg-surface-elevated border border-white/10 p-1 text-xs font-semibold">
            <button
              onClick={() => setActiveLanguage('en')}
              className={`px-3 py-1 rounded-lg ${
                activeLanguage === 'en' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setActiveLanguage('ta')}
              className={`px-3 py-1 rounded-lg ${
                activeLanguage === 'ta' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              தமிழ்
            </button>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards (Requirement 9) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* 1. Total Health Entries */}
        <div className="rounded-2xl bg-surface-elevated/70 border border-white/10 p-5 shadow-glass">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Health Entries
            </span>
            <div className="h-8 w-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{summaries.length}</span>
            <span className="text-xs text-slate-400">records</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Saved consultations & notes</p>
        </div>

        {/* 2. Recent Concern */}
        <div className="rounded-2xl bg-surface-elevated/70 border border-white/10 p-5 shadow-glass">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Recent Concern
            </span>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-sm font-bold text-white truncate">
              {recentSummary ? recentSummary.mainConcern : 'No entries yet'}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              {recentSummary ? new Date(recentSummary.createdAt).toLocaleDateString() : 'Ready for first input'}
            </p>
          </div>
        </div>

        {/* 3. Saved Summaries */}
        <div className="rounded-2xl bg-surface-elevated/70 border border-white/10 p-5 shadow-glass">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Saved Summaries
            </span>
            <div className="h-8 w-8 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">
              {summaries.filter(s => s.priority).length}
            </span>
            <span className="text-xs text-emerald-400 font-semibold">Doctor-Ready</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Organized clinical notes</p>
        </div>

        {/* 4. Upcoming Reminders */}
        <div className="rounded-2xl bg-surface-elevated/70 border border-white/10 p-5 shadow-glass">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Upcoming Reminders
            </span>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{appointments.length}</span>
            <span className="text-xs text-amber-400 font-semibold">Scheduled</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Upcoming appointments</p>
        </div>
      </div>

      {/* Main Actions Bar (Requirement 9) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          to="/analyze"
          className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-glow-cyan transition-all hover:scale-[1.02]"
        >
          <PlusCircle className="h-4 w-4" />
          <span>+ New Health Concern</span>
        </Link>

        <Link
          to="/history"
          className="p-4 rounded-2xl bg-surface-elevated hover:bg-white/5 border border-white/10 text-slate-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <History className="h-4 w-4 text-cyan-400" />
          <span>View History</span>
        </Link>

        <Link
          to="/profile"
          className="p-4 rounded-2xl bg-surface-elevated hover:bg-white/5 border border-white/10 text-slate-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <User className="h-4 w-4 text-violet-400" />
          <span>My Profile</span>
        </Link>

        <Link
          to="/emergency-contacts"
          className="p-4 rounded-2xl bg-surface-elevated hover:bg-white/5 border border-white/10 text-slate-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <PhoneCall className="h-4 w-4 text-rose-400" />
          <span>Emergency Contacts</span>
        </Link>
      </div>

      {/* AI Assistant Quick Card (Requirement 9) */}
      <div className="rounded-2xl border border-cyan-500/30 bg-surface-elevated/70 backdrop-blur-md p-6 shadow-glass space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">AI Health Assistant Intake</h3>
              <p className="text-xs text-slate-400">Describe what you are experiencing in everyday words</p>
            </div>
          </div>
          <span className="text-[10px] text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 font-semibold">
            Tamil + English
          </span>
        </div>

        <div className="space-y-3">
          <textarea
            rows={3}
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            placeholder={
              activeLanguage === 'ta'
                ? 'நீங்கள் அனுபவிக்கும் அறிகுறிகளை இங்கே எழுதுங்கள்...'
                : 'Describe what you are experiencing (e.g. fever, headache since 2 days, medications taken)...'
            }
            className="w-full rounded-xl bg-slate-900/80 border border-white/10 p-3.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 leading-relaxed"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-[11px] text-slate-400">
              ⚡ Instant zero-hallucination extraction with doctor questions.
            </div>
            <button
              onClick={handleQuickAnalyze}
              disabled={!quickInput.trim()}
              className="px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold text-xs shadow-glow-cyan transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              <span>Analyze with AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Activity & Safety Guidance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Activity Timeline */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <History className="h-4 w-4 text-cyan-400" />
              <span>Recent Health Consultations & Notes</span>
            </h2>
            <Link to="/history" className="text-xs text-cyan-400 hover:underline font-semibold flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {summaries.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="rounded-2xl bg-surface-elevated/50 border border-white/10 p-5 hover:bg-surface-elevated hover:border-cyan-500/30 transition-all shadow-glass"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400">
                        {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                      {item.isDemo && (
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-300 border border-violet-500/20 font-bold">
                          DEMO
                        </span>
                      )}
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/5 text-slate-300">
                        {item.language === 'ta' ? 'தமிழ்' : 'English'}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white pt-1">{item.mainConcern}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{item.priorityReason}</p>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-2">
                    <span
                      className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border ${
                        item.priority === 'urgent'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : item.priority === 'attention'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {item.priority}
                    </span>
                    <Link
                      to={`/summary/${item.id}`}
                      className="text-xs text-cyan-400 hover:underline font-semibold"
                    >
                      Review Report →
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {summaries.length === 0 && !loading && (
              <div className="rounded-2xl border border-white/10 bg-surface-elevated/30 p-8 text-center text-slate-400 text-xs">
                No health concerns recorded yet. Click “+ New Health Concern” to start.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Emergency & Care Navigation Tips */}
        <div className="lg:col-span-4 space-y-6">
          <EmergencySafetyCard />

          {/* Wellness & Care Navigation (Requirement 3H) */}
          <div className="rounded-2xl border border-white/10 bg-surface-elevated/70 p-5 shadow-glass space-y-3">
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-cyan-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Care-Navigation Tips
              </h3>
            </div>
            <p className="text-[11px] text-slate-400">
              Low-risk guidance to help you prepare before seeing your doctor:
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>Write down when your symptoms first began and how they evolved.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>Keep an organized list of all active medications and dosages.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>Print or export your CARE-PASS AI doctor-ready summary.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>Review the smart follow-up questions ahead of your appointment.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
