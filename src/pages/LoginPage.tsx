// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';
import {
  HeartPulse,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Zap,
  AlertCircle,
  Loader2
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, quickDemoLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role: Role) => {
    setError(null);
    setLoading(true);
    try {
      await quickDemoLogin(role);
      if (role === 'PATIENT') navigate('/dashboard');
      else if (role === 'HEALTHCARE_PROFESSIONAL') navigate('/professional');
      else if (role === 'ADMIN') navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Quick login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <Link to="/" className="inline-flex items-center gap-2 group mb-2">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-glow-cyan">
            <HeartPulse className="h-5 w-5 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">
            CARE-PASS <span className="text-cyan-400">AI</span>
          </span>
        </Link>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Sign In to Your Account
        </h1>
        <p className="text-xs text-slate-400">
          Access your health concerns, summaries, and care navigation notes
        </p>
      </div>

      {/* 1-Click Persona Demo Login for Judges */}
      <div className="rounded-2xl border border-violet-500/30 bg-surface-elevated/80 p-4 shadow-glass space-y-3">
        <div className="flex items-center gap-2 text-violet-300 font-bold text-xs">
          <Zap className="h-4 w-4" />
          <span>Hackathon Judges: 1-Click Quick Demo Sign-In</span>
        </div>
        <p className="text-[11px] text-slate-400">
          Instant test access with preloaded personas:
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleQuickLogin('PATIENT')}
            disabled={loading}
            className="p-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-center transition-all group"
          >
            <span className="block font-bold text-xs text-cyan-300">Patient</span>
            <span className="text-[9px] text-slate-400">Ananya</span>
          </button>

          <button
            onClick={() => handleQuickLogin('HEALTHCARE_PROFESSIONAL')}
            disabled={loading}
            className="p-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-center transition-all group"
          >
            <span className="block font-bold text-xs text-blue-300">Doctor</span>
            <span className="text-[9px] text-slate-400">Dr. Rajesh</span>
          </button>

          <button
            onClick={() => handleQuickLogin('ADMIN')}
            disabled={loading}
            className="p-2.5 rounded-xl bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 text-center transition-all group"
          >
            <span className="block font-bold text-xs text-violet-300">Admin</span>
            <span className="text-[9px] text-slate-400">Karthik</span>
          </button>
        </div>
      </div>

      {/* Login Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-white/10 bg-surface-elevated p-6 shadow-glass space-y-4"
      >
        {error && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-300">Email Address</label>
          <div className="relative">
            <Mail className="h-4 w-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. demo.patient@example.com"
              className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-300">Password</label>
            <Link to="/forgot-password" className="text-[11px] text-cyan-400 hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="h-4 w-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow-glow-cyan transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Signing In...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer Link */}
      <div className="text-center text-xs text-slate-400">
        Don’t have an account?{' '}
        <Link to="/register" className="text-cyan-400 font-semibold hover:underline">
          Create one now
        </Link>
      </div>
    </div>
  );
};
