// src/pages/ProfilePage.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { AITransparencyCard } from '../components/common/AITransparencyCard';
import {
  User,
  Shield,
  Download,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Languages,
  Lock,
  Mail,
  FileCheck
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, activeLanguage, setActiveLanguage } = useAuth();
  const [exporting, setExporting] = useState<boolean>(false);
  const [purging, setPurging] = useState<boolean>(false);
  const [purgeSuccess, setPurgeSuccess] = useState<string | null>(null);

  const handleExportData = async () => {
    setExporting(true);
    try {
      await api.exportUserData();
    } catch (err: any) {
      alert(err.message || 'Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteData = async () => {
    const confirmation = prompt(
      'WARNING: This will permanently delete all your saved health summaries, contacts, and consultation records.\nType "DELETE" to confirm:'
    );
    if (confirmation !== 'DELETE') return;

    setPurging(true);
    try {
      const res = await api.deleteUserData();
      setPurgeSuccess(res.message);
      setTimeout(() => setPurgeSuccess(null), 6000);
    } catch (err: any) {
      alert(err.message || 'Failed to delete user records');
    } finally {
      setPurging(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-white/10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-2">
          <User className="h-3.5 w-3.5" />
          <span>Patient Account</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Profile & Privacy Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your personal details, language preferences, and exercise full sovereign ownership over your health notes.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="rounded-2xl border border-white/10 bg-surface-elevated/70 p-6 shadow-glass space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <User className="h-4 w-4 text-cyan-400" />
          <span>Account Information</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-white/5">
            <span className="text-slate-400 block text-[11px] mb-1 font-medium">Full Name</span>
            <div className="text-sm font-bold text-white">{user?.fullName}</div>
          </div>

          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-white/5">
            <span className="text-slate-400 block text-[11px] mb-1 font-medium">Registered Email</span>
            <div className="text-sm font-bold text-white font-mono">{user?.email}</div>
          </div>

          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-white/5">
            <span className="text-slate-400 block text-[11px] mb-1 font-medium">Role & Permissions</span>
            <div className="text-sm font-bold text-cyan-400 uppercase">{user?.role}</div>
          </div>

          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-white/5">
            <span className="text-slate-400 block text-[11px] mb-1 font-medium">Default Language</span>
            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={() => setActiveLanguage('en')}
                className={`px-3 py-1 rounded-lg font-bold text-xs ${
                  activeLanguage === 'en' ? 'bg-cyan-500 text-slate-950' : 'bg-white/5 text-slate-400'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setActiveLanguage('ta')}
                className={`px-3 py-1 rounded-lg font-bold text-xs ${
                  activeLanguage === 'ta' ? 'bg-cyan-500 text-slate-950' : 'bg-white/5 text-slate-400'
                }`}
              >
                தமிழ் (Tamil)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Requirement 28: Privacy Center */}
      <div className="rounded-2xl border border-cyan-500/30 bg-surface-elevated/70 p-6 shadow-glass space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Privacy Center — My Data</h3>
              <p className="text-xs text-slate-400">Strict patient data sovereignty and export controls</p>
            </div>
          </div>
          <span className="text-[10px] text-cyan-300 font-semibold uppercase px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
            Hackathon Prototype
          </span>
        </div>

        <div className="text-xs text-slate-300 leading-relaxed space-y-3 bg-black/20 p-4 rounded-xl border border-white/5">
          <p>
            <strong>Educational Prototype Disclaimer:</strong> CARE-PASS AI is built for hackathon demonstration. For the demo environment, sample and fictional health data are used. No data is sold or shared with third-party advertisers.
          </p>
          <p>
            You hold total sovereignty over your inputs. You may download a full machine-readable JSON copy of your entire profile, summaries, and contacts at any time, or permanently purge your records from this instance.
          </p>
        </div>

        {purgeSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="h-4 w-4 shrink-0" />
            <span>{purgeSuccess}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Download My Data */}
          <div className="rounded-xl bg-slate-900/60 border border-white/5 p-4 space-y-3">
            <div className="flex items-center gap-2 font-bold text-white text-xs">
              <Download className="h-4 w-4 text-cyan-400" />
              <span>Export Personal Archive</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Download all your health concerns, summaries, appointments, and emergency contacts as an offline JSON package.
            </p>
            <button
              onClick={handleExportData}
              disabled={exporting}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow-cyan transition-colors"
            >
              {exporting ? 'Preparing Archive...' : 'Download My Data (.JSON)'}
            </button>
          </div>

          {/* Delete My Data */}
          <div className="rounded-xl bg-slate-900/60 border border-rose-500/20 p-4 space-y-3">
            <div className="flex items-center gap-2 font-bold text-rose-400 text-xs">
              <Trash2 className="h-4 w-4 text-rose-400" />
              <span>Permanent Data Purge</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Permanently wipe all health consultation notes and timeline records from this device and session.
            </p>
            <button
              onClick={handleDeleteData}
              disabled={purging}
              className="w-full py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold text-xs transition-colors"
            >
              {purging ? 'Purging Records...' : 'Delete My Data'}
            </button>
          </div>
        </div>
      </div>

      {/* AI Transparency Card */}
      <AITransparencyCard />
    </div>
  );
};
