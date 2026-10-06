// src/pages/ProfessionalDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { HealthSummary } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Stethoscope,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Search,
  Filter,
  ShieldCheck,
  FileText,
  Activity
} from 'lucide-react';

export const ProfessionalDashboard: React.FC = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<HealthSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'routine' | 'attention' | 'urgent'>('all');

  useEffect(() => {
    async function loadPatients() {
      try {
        const data = await api.getProfessionalPatients();
        setPatients(data);
      } catch (err) {
        console.error('Failed to load professional patients:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPatients();
  }, []);

  const filteredPatients = patients.filter(p => {
    const matchesSearch =
      (p.patientName && p.patientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.mainConcern.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.symptoms.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPriority = priorityFilter === 'all' ? true : p.priority === priorityFilter;

    return matchesSearch && matchesPriority;
  });

  const urgentCount = patients.filter(p => p.priority === 'urgent').length;
  const attentionCount = patients.filter(p => p.priority === 'attention').length;
  const routineCount = patients.filter(p => p.priority === 'routine').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold mb-2">
            <Stethoscope className="h-3.5 w-3.5" />
            <span>Healthcare Professional Portal (Demo)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Clinical Intake & Handoff Review
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review structured patient summaries and pre-consultation reports before rooming or telehealth visits.
          </p>
        </div>

        <div className="rounded-xl bg-violet-500/10 border border-violet-500/20 px-3 py-1.5 text-xs text-violet-300 font-semibold self-start sm:self-auto">
          Demo Doctor Account: <strong className="text-white">{user?.fullName || 'Dr. Rajesh Varma'}</strong>
        </div>
      </div>

      {/* 4 Metric Cards (Requirement 11) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* 1. Patient Summary Requests */}
        <div className="rounded-2xl bg-surface-elevated/70 border border-white/10 p-5 shadow-glass">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Patient Summary Requests
            </span>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{patients.length}</span>
            <span className="text-xs text-slate-400">intakes</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Active queue</p>
        </div>

        {/* 2. Recent Demo Patients */}
        <div className="rounded-2xl bg-surface-elevated/70 border border-white/10 p-5 shadow-glass">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Recent Demo Patients
            </span>
            <div className="h-8 w-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">3</span>
            <span className="text-xs text-cyan-400 font-semibold">Simulated</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Fictional patient records</p>
        </div>

        {/* 3. Pending Reviews */}
        <div className="rounded-2xl bg-surface-elevated/70 border border-white/10 p-5 shadow-glass">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Pending Reviews
            </span>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{attentionCount + urgentCount}</span>
            <span className="text-xs text-amber-400 font-semibold">Attention</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Requires clinical attention</p>
        </div>

        {/* 4. Total Summaries */}
        <div className="rounded-2xl bg-surface-elevated/70 border border-white/10 p-5 shadow-glass">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Summaries
            </span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{patients.length}</span>
            <span className="text-xs text-emerald-400 font-semibold">Ready</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">All completed records</p>
        </div>
      </div>

      {/* Demo Privacy Banner */}
      <div className="rounded-2xl bg-cyan-950/20 border border-cyan-500/30 p-4 flex items-center gap-3 text-xs text-cyan-200">
        <ShieldCheck className="h-5 w-5 text-cyan-400 shrink-0" />
        <p>
          <strong>DEMO ISOLATION NOTICE:</strong> All patients displayed here are simulated hackathon personas (fictional records). In production, strict patient-doctor authorization policies safeguard all confidential health records.
        </p>
      </div>

      {/* Patient Table & Search Filters */}
      <div className="rounded-2xl border border-white/10 bg-surface-elevated/70 shadow-glass overflow-hidden">
        {/* Controls Bar */}
        <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by patient name, concern, or symptom..."
              className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs font-semibold">
            <Filter className="h-3.5 w-3.5 text-slate-400 mr-1" />
            {(['all', 'routine', 'attention', 'urgent'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  priorityFilter === p
                    ? 'bg-blue-500 text-white font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Patients List Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/10">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Patient Name</th>
                <th className="py-3.5 px-4 font-semibold">Primary Concern</th>
                <th className="py-3.5 px-4 font-semibold">Language</th>
                <th className="py-3.5 px-4 font-semibold">Priority</th>
                <th className="py-3.5 px-4 font-semibold">Completeness</th>
                <th className="py-3.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 font-medium text-white">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-blue-500/20 text-blue-300 font-bold flex items-center justify-center text-xs">
                        {(patient.patientName || 'Patient').charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-100">{patient.patientName || 'Ananya Sharma (Demo)'}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {new Date(patient.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-slate-200 font-medium max-w-xs truncate">
                    {patient.mainConcern}
                  </td>

                  <td className="py-4 px-4">
                    <span className="px-2 py-0.5 rounded bg-white/5 text-[11px] text-slate-300 font-semibold">
                      {patient.language === 'ta' ? 'தமிழ் (Tamil)' : 'English'}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                        patient.priority === 'urgent'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : patient.priority === 'attention'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {patient.priority}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-mono font-bold text-cyan-400">
                    {patient.completenessScore}%
                  </td>

                  <td className="py-4 px-4 text-right">
                    <Link
                      to={`/professional/patient/${patient.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs transition-colors shadow-sm"
                    >
                      <span>Review Report</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
