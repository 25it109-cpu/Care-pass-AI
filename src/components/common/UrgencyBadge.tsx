// src/components/common/UrgencyBadge.tsx
import React from 'react';
import { Priority } from '../../types';
import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface UrgencyBadgeProps {
  priority: Priority;
  reason?: string;
  showDetails?: boolean;
}

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({ priority, reason, showDetails = true }) => {
  const config = {
    routine: {
      label: 'ROUTINE',
      tamilLabel: 'வழக்கமானது (ROUTINE)',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/30',
      glow: 'shadow-[0_0_15px_rgba(16,185,129,0.25)]',
      icon: CheckCircle,
      description: 'Standard, non-urgent concern suitable for discussion during a routine consultation.'
    },
    attention: {
      label: 'NEEDS ATTENTION',
      tamilLabel: 'கவனம் தேவை (NEEDS ATTENTION)',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/30',
      glow: 'shadow-[0_0_15px_rgba(245,158,11,0.25)]',
      icon: AlertTriangle,
      description: 'Persistent symptoms or elevated discomfort that warrant timely clinical assessment.'
    },
    urgent: {
      label: 'URGENT',
      tamilLabel: 'அவசரம் (URGENT)',
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/30',
      glow: 'shadow-[0_0_20px_rgba(239,68,68,0.35)]',
      icon: AlertCircle,
      description: 'Potential red-flag warning indicators mentioned. Prompt or emergency professional care is strongly advised.'
    }
  };

  const item = config[priority] || config.routine;
  const Icon = item.icon;

  return (
    <div className={`rounded-xl border p-4 ${item.bg} ${item.glow} transition-all duration-300`}>
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-elevated/80 border border-white/10">
          <Icon className={`h-5 w-5 ${item.color}`} />
        </span>
        <div>
          <span className="text-xs uppercase tracking-wider text-slate-400 block font-medium">Informational Priority</span>
          <span className={`text-base font-bold tracking-wide ${item.color}`}>
            {item.label}
          </span>
        </div>
      </div>

      {showDetails && (
        <div className="mt-3 space-y-2 border-t border-white/5 pt-3 text-xs leading-relaxed text-slate-300">
          {reason && (
            <p className="text-slate-300">
              <strong className="text-white">Analysis Reason:</strong> {reason}
            </p>
          )}
          <p className="text-slate-400 italic flex items-start gap-1.5 pt-1">
            <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-cyan-400" />
            <span>This priority indicator is informational and does not replace professional medical assessment.</span>
          </p>
        </div>
      )}
    </div>
  );
};
