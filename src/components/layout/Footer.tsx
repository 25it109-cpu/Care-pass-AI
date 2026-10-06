// src/components/layout/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, ShieldAlert, Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-[#070b14] text-slate-400 text-xs">
      {/* Prominent Hackathon Disclaimer Strip */}
      <div className="bg-cyan-950/30 border-b border-cyan-500/20 py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2 text-cyan-300 font-medium text-[11px]">
            <ShieldAlert className="h-4 w-4 shrink-0 text-cyan-400" />
            <span>
              <strong>HACKATHON PROTOTYPE NOTICE:</strong> CARE-PASS AI is strictly an informational tool. It does NOT diagnose diseases, prescribe medications, or replace certified healthcare professionals.
            </span>
          </div>
          <span className="text-[10px] text-slate-400 shrink-0">
            Emergency? Dial <strong className="text-rose-400">108 / Local Emergency</strong>
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950">
                <HeartPulse className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-sm tracking-tight text-white">
                CARE-PASS <span className="text-cyan-400">AI</span>
              </span>
            </Link>
            <p className="text-slate-300 font-medium italic text-xs">
              “Organize. Understand. Prepare.”
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Transform everyday health concerns into clear, structured information that helps you communicate better with healthcare professionals.
            </p>
          </div>

          {/* Platform Links */}
          <div className="space-y-2">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">Platform</h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link to="/analyze" className="hover:text-cyan-400 transition-colors">Analyze Health Concern</Link></li>
              <li><Link to="/how-it-works" className="hover:text-cyan-400 transition-colors">How It Works</Link></li>
              <li><Link to="/history" className="hover:text-cyan-400 transition-colors">Health Timeline</Link></li>
              <li><Link to="/emergency-contacts" className="hover:text-cyan-400 transition-colors">Emergency Safety Card</Link></li>
            </ul>
          </div>

          {/* Hackathon & Demo */}
          <div className="space-y-2">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">Demo & Roles</h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link to="/analyze?scenario=1" className="hover:text-cyan-400 transition-colors">Scenario 1 (Fever & Fatigue)</Link></li>
              <li><Link to="/analyze?scenario=2" className="hover:text-cyan-400 transition-colors">Scenario 2 (Doctor Prep)</Link></li>
              <li><Link to="/professional" className="hover:text-cyan-400 transition-colors">Healthcare Professional View</Link></li>
              <li><Link to="/admin" className="hover:text-cyan-400 transition-colors">Admin & Metrics Panel</Link></li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div className="space-y-2">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">Trust & Policy</h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link to="/about" className="hover:text-cyan-400 transition-colors">About Project</Link></li>
              <li><Link to="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Center</Link></li>
              <li><Link to="/terms" className="hover:text-cyan-400 transition-colors">Terms of Use</Link></li>
              <li><a href="#contact" className="hover:text-cyan-400 transition-colors">Contact Innovations</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px]">
          <p>© {new Date().getFullYear()} CARE-PASS AI. All rights reserved.</p>
          <p className="text-cyan-300/80 font-medium">
            “Built as a student innovation prototype for global hackathon demonstration.”
          </p>
        </div>
      </div>
    </footer>
  );
};
