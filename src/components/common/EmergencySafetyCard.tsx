// src/components/common/EmergencySafetyCard.tsx
import React, { useState } from 'react';
import { PhoneCall, AlertTriangle, ShieldCheck, Settings, ExternalLink } from 'lucide-react';

interface EmergencySafetyCardProps {
  urgentDetected?: boolean;
}

export const EmergencySafetyCard: React.FC<EmergencySafetyCardProps> = ({ urgentDetected = false }) => {
  const [emergencyNumber, setEmergencyNumber] = useState<string>(
    localStorage.getItem('carepass_emergency_num') || (import.meta as any).env?.VITE_DEFAULT_EMERGENCY_NUMBER || '108'
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [customNumInput, setCustomNumInput] = useState<string>(emergencyNumber);

  const handleSaveNumber = () => {
    const trimmed = customNumInput.trim() || '108';
    setEmergencyNumber(trimmed);
    localStorage.setItem('carepass_emergency_num', trimmed);
    setIsEditing(false);
  };

  return (
    <div
      className={`rounded-2xl border p-5 transition-all duration-300 ${
        urgentDetected
          ? 'bg-rose-950/40 border-rose-500/40 shadow-[0_0_30px_rgba(239,68,68,0.25)] ring-1 ring-rose-500/30'
          : 'bg-surface-elevated/70 border-white/10 shadow-glass'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`h-10 w-10 rounded-xl flex items-center justify-center ${
              urgentDetected
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
            }`}
          >
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className={`text-sm font-bold tracking-wide uppercase ${urgentDetected ? 'text-rose-300' : 'text-white'}`}>
              {urgentDetected ? 'Immediate Attention Protocol' : 'Emergency & Safety Guidance'}
            </h3>
            <p className="text-xs text-slate-400">Non-Diagnostic Safety Card</p>
          </div>
        </div>

        {/* Edit emergency number button */}
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-slate-400 hover:text-cyan-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors text-xs flex items-center gap-1"
          title="Configure emergency number for your region"
        >
          <Settings className="h-3.5 w-3.5" />
          <span className="text-[11px] hidden sm:inline">Change Region</span>
        </button>
      </div>

      <div className="mt-4 text-xs text-slate-300 leading-relaxed space-y-2">
        <p className="bg-black/20 p-3 rounded-xl border border-white/5 font-medium">
          “Some health situations may require immediate professional attention. If you believe this is an emergency, contact your local emergency service or seek immediate help from a qualified healthcare professional.”
        </p>
        <p className="text-[11px] text-slate-400">
          CARE-PASS AI does not attempt to diagnose emergencies or clinical conditions. This alert is automatically presented to safeguard users.
        </p>
      </div>

      {isEditing && (
        <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-cyan-500/30 flex items-center gap-2">
          <input
            type="text"
            value={customNumInput}
            onChange={(e) => setCustomNumInput(e.target.value)}
            placeholder="e.g. 108, 911, 112, 999"
            className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
          />
          <button
            onClick={handleSaveNumber}
            className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
          >
            Save
          </button>
        </div>
      )}

      {/* Emergency Call Action */}
      <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Emergency Number:</span>
          <span className="font-mono text-sm font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
            {emergencyNumber}
          </span>
          <span className="text-[10px] text-slate-500">(Configurable)</span>
        </div>

        <a
          href={`tel:${emergencyNumber}`}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all duration-300 ${
            urgentDetected
              ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/30 animate-pulse'
              : 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40'
          }`}
        >
          <PhoneCall className="h-4 w-4" />
          <span>Call Local Emergency ({emergencyNumber})</span>
        </a>
      </div>
    </div>
  );
};
