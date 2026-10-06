// src/pages/HistoryPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { HealthSummary } from '../types';
import { UrgencyBadge } from '../components/common/UrgencyBadge';
import { CarePassScore } from '../components/common/CarePassScore';
import {
  History,
  Calendar,
  Trash2,
  FileText,
  Search,
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const [summaries, setSummaries] = useState<HealthSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'routine' | 'attention' | 'urgent'>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadHistory = async () => {
    try {
      const data = await api.getHistory();
      setSummaries(data);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this consultation record? This cannot be undone.')) {
      return;
    }
    try {
      await api.deleteSummary(id);
      setSummaries(prev => prev.filter(s => s.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete summary.');
    }
  };

  const filteredSummaries = summaries.filter(item => {
    const matchesSearch =
      item.mainConcern.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.symptoms.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.inputText && item.inputText.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPriority =
      selectedFilter === 'all' ? true : item.priority === selectedFilter;

    return matchesSearch && matchesPriority;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-2">
            <History className="h-3.5 w-3.5" />
            <span>Health History Timeline</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Consultation Timeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Visual longitudinal timeline of your concerns, AI structured notes, and doctor summaries.
          </p>
        </div>

        <Link
          to="/analyze"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow-cyan transition-all self-start sm:self-auto"
        >
          <span>+ New Health Concern</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl bg-surface-elevated/70 border border-white/10 p-4 shadow-glass flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search symptoms or concerns..."
            className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs font-semibold">
          <Filter className="h-3.5 w-3.5 text-slate-400 mr-1" />
          {(['all', 'routine', 'attention', 'urgent'] as const).map(p => (
            <button
              key={p}
              onClick={() => setSelectedFilter(p)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                selectedFilter === p
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {p === 'all' ? 'All Priorities' : p}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Timeline Section */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-cyan-500/20 space-y-8 my-6">
        {filteredSummaries.map((item) => {
          const date = new Date(item.createdAt);
          const formattedDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

          return (
            <div key={item.id} className="relative group">
              {/* Timeline Node Icon */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 h-6 w-6 rounded-full bg-[#070b14] border-2 border-cyan-400 flex items-center justify-center shadow-glow-cyan">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
              </div>

              {/* Timeline Card */}
              <div className="rounded-2xl bg-surface-elevated/70 border border-white/10 p-6 shadow-glass hover:border-cyan-500/30 transition-all duration-300">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-xs font-bold text-cyan-400 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formattedDate}
                    </span>
                    {item.isDemo && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
                        DEMO DATA — SAMPLE RECORD
                      </span>
                    )}
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white/5 text-slate-300">
                      {item.language === 'ta' ? 'தமிழ் (Tamil)' : 'English'}
                    </span>
                  </div>

                  {/* Actions: View & Delete */}
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/summary/${item.id}`}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <span>Doctor Summary</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete this saved entry"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="mt-4 space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-white tracking-wide">
                      {item.mainConcern}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {item.priorityReason}
                    </p>
                  </div>

                  {/* Badges row */}
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <span className="text-[11px] text-slate-400">Symptoms:</span>
                    {item.symptoms.map((s, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] bg-slate-900 border border-white/10 px-2.5 py-0.5 rounded-full text-slate-200"
                      >
                        {s}
                      </span>
                    ))}
                    {item.duration && (
                      <span className="text-[11px] bg-cyan-950/40 border border-cyan-500/20 px-2.5 py-0.5 rounded-full text-cyan-300">
                        Duration: {item.duration}
                      </span>
                    )}
                  </div>

                  {/* Completeness & Urgency Row */}
                  <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="w-full sm:w-56">
                      <CarePassScore score={item.completenessScore} compact={true} />
                    </div>

                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border self-start sm:self-auto ${
                        item.priority === 'urgent'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : item.priority === 'attention'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      Priority: {item.priority}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredSummaries.length === 0 && !loading && (
          <div className="rounded-2xl border border-dashed border-white/10 bg-surface-elevated/30 p-12 text-center text-slate-400 text-xs">
            No consultation notes match your search or filter.
          </div>
        )}
      </div>
    </div>
  );
};
