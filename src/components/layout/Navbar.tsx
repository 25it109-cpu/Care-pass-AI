// src/components/layout/Navbar.tsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HeartPulse,
  Menu,
  X,
  Languages,
  User,
  LogOut,
  Stethoscope,
  ShieldAlert,
  Sparkles,
  Zap,
  Activity,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, activeLanguage, setActiveLanguage, quickDemoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLaunchDemo = async (role: 'PATIENT' | 'HEALTHCARE_PROFESSIONAL' | 'ADMIN') => {
    setDemoMenuOpen(false);
    setMobileMenuOpen(false);
    await quickDemoLogin(role);
    if (role === 'PATIENT') navigate('/analyze?scenario=1');
    else if (role === 'HEALTHCARE_PROFESSIONAL') navigate('/professional');
    else if (role === 'ADMIN') navigate('/admin');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#070b14]/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-glow-cyan transition-transform group-hover:scale-105">
            <HeartPulse className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
              CARE-PASS <span className="text-cyan-400">AI</span>
            </span>
            <span className="text-[10px] text-slate-400 block -mt-1 font-medium tracking-wide">
              Patient Care Navigation
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              isActive('/') ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Home
          </Link>
          <Link
            to="/how-it-works"
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              isActive('/how-it-works') ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            How It Works
          </Link>
          <Link
            to="/about"
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              isActive('/about') ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            About
          </Link>

          {user && (
            <>
              <Link
                to="/dashboard"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  isActive('/dashboard') ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/analyze"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  isActive('/analyze') ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Analyze Concern
              </Link>
              <Link
                to="/history"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  isActive('/history') ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Timeline
              </Link>

              {(user.role === 'HEALTHCARE_PROFESSIONAL' || user.role === 'ADMIN') && (
                <Link
                  to="/professional"
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                    isActive('/professional') ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Stethoscope className="h-3.5 w-3.5 text-blue-400" />
                  <span>Doctor View</span>
                </Link>
              )}

              {user.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                    isActive('/admin') ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <ShieldAlert className="h-3.5 w-3.5 text-violet-400" />
                  <span>Admin</span>
                </Link>
              )}
            </>
          )}
        </nav>

        {/* Right Action Cluster */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Language Selector */}
          <div className="flex items-center rounded-xl bg-surface-elevated border border-white/10 p-0.5 text-xs font-semibold">
            <button
              onClick={() => setActiveLanguage('en')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeLanguage === 'en'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setActiveLanguage('ta')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeLanguage === 'ta'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              தமிழ்
            </button>
          </div>

          {/* 🚀 ENTER HACKATHON DEMO DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setDemoMenuOpen(!demoMenuOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold text-xs shadow-glow-cyan transition-all"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>🚀 ENTER HACKATHON DEMO</span>
              <ChevronDown className="h-3 w-3" />
            </button>

            {demoMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-surface-elevated border border-white/10 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="p-2 border-b border-white/5 text-[11px] text-slate-400">
                  Select a hackathon persona to experience instant demo workflows:
                </div>
                <button
                  onClick={() => handleLaunchDemo('PATIENT')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-white/5 transition flex items-center gap-2.5 text-xs text-white"
                >
                  <span className="h-7 w-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                    P
                  </span>
                  <div>
                    <div className="font-bold">Demo Patient (Ananya)</div>
                    <div className="text-[10px] text-slate-400">AI Intake & Preloaded 3 Scenarios</div>
                  </div>
                </button>

                <button
                  onClick={() => handleLaunchDemo('HEALTHCARE_PROFESSIONAL')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-white/5 transition flex items-center gap-2.5 text-xs text-white"
                >
                  <span className="h-7 w-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                    D
                  </span>
                  <div>
                    <div className="font-bold">Doctor User (Dr. Rajesh)</div>
                    <div className="text-[10px] text-slate-400">Patient Summaries & Clinical Handoff</div>
                  </div>
                </button>

                <button
                  onClick={() => handleLaunchDemo('ADMIN')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-white/5 transition flex items-center gap-2.5 text-xs text-white"
                >
                  <span className="h-7 w-7 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center font-bold">
                    A
                  </span>
                  <div>
                    <div className="font-bold">Administrator (Karthik)</div>
                    <div className="text-[10px] text-slate-400">Metrics, System Status & Audit Logs</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* User Auth Info */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-elevated border border-white/10 hover:border-white/20 text-xs font-semibold text-white transition-colors"
              >
                <div className="h-6 w-6 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-[11px]">
                  {user.fullName.charAt(0)}
                </div>
                <span className="max-w-[100px] truncate">{user.fullName.split(' ')[0]}</span>
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                  {user.role === 'HEALTHCARE_PROFESSIONAL' ? 'Doctor' : user.role}
                </span>
              </Link>
              <button
                onClick={() => logout()}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-glow-cyan"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden items-center gap-2">
          {/* Quick Demo button on mobile */}
          <button
            onClick={() => handleLaunchDemo('PATIENT')}
            className="px-2.5 py-1 rounded-lg bg-cyan-500 text-slate-950 font-bold text-[11px]"
          >
            🚀 Demo
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#070b14] px-4 pt-3 pb-6 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <span className="text-xs text-slate-400">Language:</span>
            <div className="flex gap-1">
              <button
                onClick={() => setActiveLanguage('en')}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  activeLanguage === 'en' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setActiveLanguage('ta')}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  activeLanguage === 'ta' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'
                }`}
              >
                தமிழ்
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:bg-white/5"
            >
              Home
            </Link>
            <Link
              to="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:bg-white/5"
            >
              How It Works
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:bg-white/5"
            >
              About
            </Link>
            {user && (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:bg-white/5"
                >
                  Dashboard
                </Link>
                <Link
                  to="/analyze"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:bg-white/5"
                >
                  Analyze Health Concern
                </Link>
                <Link
                  to="/history"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:bg-white/5"
                >
                  Health Timeline
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:bg-white/5"
                >
                  Profile & Privacy Center
                </Link>
                <Link
                  to="/emergency-contacts"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:bg-white/5"
                >
                  Emergency Contacts
                </Link>
              </>
            )}
          </div>

          <div className="pt-3 border-t border-white/5 flex flex-col gap-2">
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2 rounded-xl bg-rose-500/10 text-rose-400 font-bold text-xs border border-rose-500/20"
              >
                Sign Out ({user.fullName})
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-xl bg-white/5 text-slate-200 font-semibold text-xs border border-white/10"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
