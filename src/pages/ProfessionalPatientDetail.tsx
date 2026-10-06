// src/pages/ProfessionalPatientDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { HealthSummary } from '../types';
import { DoctorSummaryCard } from '../components/common/DoctorSummaryCard';
import { UrgencyBadge } from '../components/common/UrgencyBadge';
import { CarePassScore } from '../components/common/CarePassScore';
import { ArrowLeft, Stethoscope, User, Calendar, ShieldCheck, Loader2 } from 'lucide-react';

export const ProfessionalPatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<{ summary: HealthSummary; patient: { id: string; fullName: string; email: string } | null } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDetail() {
      if (!id) return;
      try {
        const res = await api.getProfessionalPatientDetail(id);
        setData(res);
      } catch (err: any) {
        setError(err.message || 'Failed to load patient summary');
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <Loader2 className="h-8 w-8 text-blue-400 animate-spin mx-auto mb-3" />
        <p className="text-slate-400 text-xs">Loading clinical summary...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Record Not Found</h2>
        <p className="text-xs text-slate-400">{error || 'This record is not accessible.'}</p>
        <Link
          to="/professional"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 text-cyan-400 text-xs font-semibold"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Doctor Dashboard</span>
        </Link>
      </div>
    );
  }

  const { summary, patient } = data;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <Link
          to="/professional"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Intake Queue</span>
        </Link>

        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
          Clinical Review Mode
        </span>
      </div>

      {/* Patient Header Box */}
      <div className="rounded-2xl border border-white/10 bg-surface-elevated/70 p-5 shadow-glass flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg">
            {(patient?.fullName || 'Patient').charAt(0)}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{patient?.fullName || 'Ananya Sharma'}</h2>
            <p className="text-xs text-slate-400">
              Consultation Intake: {new Date(summary.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-medium">Input Language:</span>
          <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-cyan-300">
            {summary.language === 'ta' ? 'Tamil (தமிழ்)' : 'English'}
          </span>
        </div>
      </div>

      {/* Overview badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UrgencyBadge priority={summary.priority} reason={summary.priorityReason} />
        <CarePassScore score={summary.completenessScore} breakdown={summary.completenessBreakdown} />
      </div>

      {/* Original Patient description */}
      {summary.inputText && (
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            PATIENT NATURAL LANGUAGE SUBMISSION:
          </span>
          <p className="text-slate-200 italic leading-relaxed">
            "{summary.inputText}"
          </p>
        </div>
      )}

      {/* Doctor Summary Card */}
      <DoctorSummaryCard
        summary={summary}
        patientName={patient?.fullName || 'Patient'}
      />
    </div>
  );
};
