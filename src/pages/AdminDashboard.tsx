// src/pages/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { AdminMetrics, User, AuditLog } from '../types';
import {
  ShieldAlert,
  Users,
  Activity,
  Languages,
  Server,
  CheckCircle,
  XCircle,
  Clock,
  RotateCcw,
  Zap,
  TrendingUp,
  FileText
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const loadMetrics = async () => {
    try {
      const data = await api.getAdminMetrics();
      setMetrics(data);
    } catch (err) {
      console.error('Failed to load admin metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  const handleToggleUserActive = async (userId: string) => {
    setTogglingId(userId);
    try {
      await api.toggleUserActive(userId);
      await loadMetrics();
    } catch (err: any) {
      alert(err.message || 'Failed to toggle status');
    } finally {
      setTogglingId(null);
    }
  };

  if (loading || !metrics) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-xs text-slate-400">
        Loading administrator metrics and telemetry...
      </div>
    );
  }

  const COLORS = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold mb-2">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Platform Governance & Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Administrator Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time analytics, multilingual usage telemetry, account governance, and system safety monitoring.
          </p>
        </div>

        <button
          onClick={loadMetrics}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold border border-white/10 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* 5 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Users */}
        <div className="rounded-2xl bg-surface-elevated/70 border border-white/10 p-5 shadow-glass">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Total Users</span>
            <Users className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-white">{metrics.totalUsers}</div>
          <p className="text-[11px] text-slate-500 mt-1">Registered profiles</p>
        </div>

        {/* Active Users */}
        <div className="rounded-2xl bg-surface-elevated/70 border border-white/10 p-5 shadow-glass">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Active Users</span>
            <CheckCircle className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-400">{metrics.activeUsers}</div>
          <p className="text-[11px] text-slate-500 mt-1">Non-deactivated</p>
        </div>

        {/* Total Demo Analyses */}
        <div className="rounded-2xl bg-surface-elevated/70 border border-white/10 p-5 shadow-glass">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Total Analyses</span>
            <FileText className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-blue-400">{metrics.totalSummaries}</div>
          <p className="text-[11px] text-slate-500 mt-1">AI Summaries generated</p>
        </div>

        {/* AI Engine Status */}
        <div className="rounded-2xl bg-surface-elevated/70 border border-white/10 p-5 shadow-glass">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">AI Engine</span>
            <Activity className="h-4 w-4 text-violet-400" />
          </div>
          <div className="mt-2 text-base font-bold text-violet-300">
            {metrics.systemStatus.aiEngine}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Multilingual ready</p>
        </div>

        {/* System Health & Latency */}
        <div className="rounded-2xl bg-surface-elevated/70 border border-white/10 p-5 shadow-glass">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">System Latency</span>
            <Server className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-white">
            {metrics.systemStatus.latencyMs} <span className="text-xs text-slate-400 font-normal">ms</span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-1">● Operational</p>
        </div>
      </div>

      {/* Charts Section: Language Usage & Priority Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language Usage Breakdown */}
        <div className="rounded-2xl border border-white/10 bg-surface-elevated/70 p-6 shadow-glass space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Language Intake Distribution
              </h3>
            </div>
            <span className="text-xs text-slate-400">Tamil vs English</span>
          </div>

          <div className="h-60 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.languageUsage} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#06b6d4', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="rounded-2xl border border-white/10 bg-surface-elevated/70 p-6 shadow-glass space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-violet-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Informational Priority Distribution
              </h3>
            </div>
            <span className="text-xs text-slate-400">Clinical Safety Triage</span>
          </div>

          <div className="h-60 w-full flex items-center justify-center pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.priorityDistribution}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  innerRadius={45}
                  paddingAngle={5}
                >
                  {metrics.priorityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 text-xs text-slate-300 pt-2 border-t border-white/5">
            {metrics.priorityDistribution.map(p => (
              <div key={p.name} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                <span>{p.name} ({p.count})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Governance Table */}
      <div className="rounded-2xl border border-white/10 bg-surface-elevated/70 shadow-glass overflow-hidden">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              User Accounts & Role Permissions
            </h3>
            <p className="text-xs text-slate-400">
              Manage accounts, inspect roles, and deactivate demo accounts (passwords never exposed).
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/10">
              <tr>
                <th className="py-3.5 px-4 font-semibold">User</th>
                <th className="py-3.5 px-4 font-semibold">Email</th>
                <th className="py-3.5 px-4 font-semibold">Role</th>
                <th className="py-3.5 px-4 font-semibold">Language</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {metrics.users.map((u: User) => (
                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">
                    {u.fullName}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 font-mono text-[11px]">
                    {u.email}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-white/10 text-cyan-300">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 uppercase text-slate-400">
                    {u.preferredLanguage}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.isActive
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      {u.isActive ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleToggleUserActive(u.id)}
                      disabled={togglingId === u.id}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        u.isActive
                          ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20'
                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {u.isActive ? 'Deactivate' : 'Reactivate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-Time Audit Logs */}
      <div className="rounded-2xl border border-white/10 bg-surface-elevated/70 p-6 shadow-glass space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              System Audit Logs & Security Activity
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Auto-recorded</span>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {metrics.recentLogs.map((log: AuditLog) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
                <span className="font-mono text-cyan-300 font-bold">{log.action}</span>
                <span className="text-slate-400">on {log.resourceType}</span>
              </div>
              <span className="font-mono text-[10px] text-slate-500">
                {new Date(log.createdAt).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
