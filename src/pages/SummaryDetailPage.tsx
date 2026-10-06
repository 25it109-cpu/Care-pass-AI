// src/pages/SummaryDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { HealthSummary } from '../types';
import { DoctorSummaryCard } from '../components/common/DoctorSummaryCard';
import { CarePassScore } from '../components/common/CarePassScore';
import { UrgencyBadge } from '../components/common/UrgencyBadge';
import { ArrowLeft, Calendar, User, Trash2, ShieldAlert, Loader2 } from 'lucide-react';

export const SummaryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [summary, setSummary] = useState<HealthSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSummary() {
      if (!id) return;
      try {
        const data = await api.getSummaryById(id);
        setSummary(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load summary');
      } finally {
        setLoading(false);
      }
    }
    loadSummary();
  }, [id]);

  const handleDelete = async () => {
    if (!summary || !confirm('Are you sure you want to delete this consultation report?')) return;
    try {
      await api.deleteSummary(summary.id);
      navigate('/history');
    } catch (err: any) {
      alert(err.message || 'Failed to delete record');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <Loader2 className="h-8 w-8 text-cyan-400 animate-spin mx-auto mb-3" />
        <p className="text-slate-400 text-xs">Loading structured consultation report...</p>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <ShieldAlert className="h-10 w-10 text-rose-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Summary Not Found</h2>
        <p className="text-xs text-slate-400">{error || 'This record may have been deleted.'}</p>
        <Link
          to="/history"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-400 text-xs font-semibold"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Health Timeline</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      {/* Back button & top bar */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <Link
          to="/history"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Timeline</span>
        </Link>

        <div className="flex items-center gap-2">
          {summary.isDemo && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
              DEMO RECORD
            </span>
          )}
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Delete record"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Overview badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UrgencyBadge priority={summary.priority} reason={summary.priorityReason} />
        <CarePassScore score={summary.completenessScore} breakdown={summary.completenessBreakdown} />
      </div>

      {/* Original Input block */}
      {summary.inputText && (
        <div className="rounded-2xl border border-white/10 bg-surface-elevated/40 p-4 text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            ORIGINAL PATIENT INPUT ({summary.language === 'ta' ? 'Tamil' : 'English'})
          </span>
          <p className="text-slate-200 italic bg-black/20 p-3 rounded-xl border border-white/5 leading-relaxed">
            "{summary.inputText}"
          </p>
        </div>
      )}

      {/* Main Doctor Ready Summary Card with PDF, Copy & Print */}
      <DoctorSummaryCard
        summary={summary}
        patientName={user?.fullName || 'Patient'}
      />
    </div>
  );
};
