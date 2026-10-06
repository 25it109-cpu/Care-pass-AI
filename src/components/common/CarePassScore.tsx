// src/components/common/CarePassScore.tsx
import React from 'react';
import { CompletenessBreakdown } from '../../types';
import { Check, X, ShieldAlert, Sparkles } from 'lucide-react';

interface CarePassScoreProps {
  score: number;
  breakdown?: CompletenessBreakdown;
  compact?: boolean;
}

export const CarePassScore: React.FC<CarePassScoreProps> = ({ score, breakdown, compact = false }) => {
  const roundedScore = Math.round(score || 0);

  // Gradient based on completeness
  const getColor = (s: number) => {
    if (s >= 80) return 'from-emerald-400 to-cyan-400 text-emerald-400';
    if (s >= 50) return 'from-cyan-400 to-blue-400 text-cyan-400';
    return 'from-amber-400 to-rose-400 text-amber-400';
  };

  const getBarGradient = (s: number) => {
    if (s >= 80) return 'bg-gradient-to-r from-emerald-500 to-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.5)]';
    if (s >= 50) return 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.4)]';
    return 'bg-gradient-to-r from-amber-500 to-rose-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]';
  };

  const items = [
    { key: 'mainConcern', label: 'Primary Concern', valid: breakdown?.mainConcern ?? true },
    { key: 'symptoms', label: 'Identified Symptoms', valid: breakdown?.symptoms ?? true },
    { key: 'duration', label: 'Onset / Duration', valid: breakdown?.duration ?? false },
    { key: 'medications', label: 'Medications Mentioned', valid: breakdown?.medications ?? false },
    { key: 'severity', label: 'Severity Rating', valid: breakdown?.severity ?? false },
    { key: 'additionalDetails', label: 'Context / Prior Info', valid: breakdown?.additionalDetails ?? false },
  ];

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="flex justify-between text-xs mb-1 font-medium">
            <span className="text-slate-400">Info Completeness</span>
            <span className={getColor(roundedScore)}>{roundedScore}%</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5">
            <div
              className={`h-full transition-all duration-700 rounded-full ${getBarGradient(roundedScore)}`}
              style={{ width: `${roundedScore}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-surface-elevated/60 backdrop-blur-md p-5 shadow-glass">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide flex items-center gap-1.5">
              CARE-PASS SCORE
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                Signature Feature
              </span>
            </h4>
            <p className="text-xs text-slate-400 font-medium">Information Completeness Metric</p>
          </div>
        </div>
        <div className="text-right">
          <span className={`text-2xl font-extrabold tracking-tight ${getColor(roundedScore)}`}>
            {roundedScore}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="h-3 w-full bg-slate-800/80 rounded-full overflow-hidden border border-white/10 p-[1px]">
          <div
            className={`h-full transition-all duration-1000 ease-out rounded-full ${getBarGradient(roundedScore)}`}
            style={{ width: `${roundedScore}%` }}
          />
        </div>
      </div>

      {/* Breakdown Checklist */}
      <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-2 text-xs">
        {items.map(item => (
          <div
            key={item.key}
            className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 border transition-all ${
              item.valid
                ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300'
                : 'bg-slate-800/40 border-white/5 text-slate-400'
            }`}
          >
            {item.valid ? (
              <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            ) : (
              <X className="h-3.5 w-3.5 text-slate-500 shrink-0" />
            )}
            <span className="truncate">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Mandatory Regulatory Hackathon Note */}
      <div className="mt-4 rounded-xl bg-cyan-950/30 border border-cyan-500/20 p-2.5 flex items-start gap-2 text-[11px] text-cyan-200/80">
        <ShieldAlert className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-cyan-300">Important Note:</strong> This score measures{' '}
          <em>information completeness</em> for your doctor discussion,{' '}
          <strong>not health status or clinical wellness</strong>.
        </p>
      </div>
    </div>
  );
};
