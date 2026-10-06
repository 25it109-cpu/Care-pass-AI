// src/pages/AnalyzePage.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { HealthSummary, Priority } from '../types';
import { CarePassScore } from '../components/common/CarePassScore';
import { UrgencyBadge } from '../components/common/UrgencyBadge';
import { EmergencySafetyCard } from '../components/common/EmergencySafetyCard';
import { DoctorSummaryCard } from '../components/common/DoctorSummaryCard';
import { AITransparencyCard } from '../components/common/AITransparencyCard';
import {
  Sparkles,
  Languages,
  RotateCcw,
  Save,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  Loader2,
  FileCheck,
  Zap,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AnalyzePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, activeLanguage, setActiveLanguage } = useAuth();

  const [inputText, setInputText] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'ta'>(activeLanguage || 'en');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<HealthSummary | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [consentGiven, setConsentGiven] = useState<boolean>(true);
  const [activeScenario, setActiveScenario] = useState<number | null>(null);

  // Preloaded Demo Scenarios (Requirement 16)
  const demoScenarios = [
    {
      id: 1,
      name: 'Scenario 1 (Fever & Fatigue)',
      en: 'I have been feeling unwell for the past two days with a fever and body weakness. Took one paracetamol yesterday night which gave temporary relief.',
      ta: 'எனக்கு இரண்டு நாட்களாக காய்ச்சல் இருக்கு, உடம்பு ரொம்ப சோர்வா இருக்கு. நேற்று இரவு பாரசிட்டமால் மாத்திரை சாப்பிட்டேன், கொஞ்சம் குறைந்தது ஆனால் மீண்டும் சூடு இருக்கு.',
      desc: 'Fever & weakness persisting 2 days (Needs Attention)'
    },
    {
      id: 2,
      name: 'Scenario 2 (Doctor Prep / Back Strain)',
      en: 'I have had mild lower back stiffness since this morning after lifting heavy grocery bags. Want to prepare questions before visiting my physiotherapist. No leg numbness.',
      ta: 'இன்று காலை கனமான பொருளை தூக்கியதில் இருந்து கீழ் முதுகு லேசாக பிடித்துக்கொண்டது போல வலிக்குது. மருத்துவரிடம் கேட்க என்ன விவரங்கள் தயார் செய்ய வேண்டும்?',
      desc: 'Mechanical strain & appointment preparation (Routine / Attention)'
    },
    {
      id: 3,
      name: 'Scenario 3 (Urgent Safety Escalation)',
      en: 'Experiencing sudden crushing chest pain radiating to my left arm and severe shortness of breath since 20 minutes ago. Feeling very dizzy and cold sweat.',
      ta: 'திடீரென கடுமையான நெஞ்சு வலி வந்து இடது கைக்கு பரவுது. மூச்சு விட ரொம்ப கஷ்டமா இருக்கு, 20 நிமிடங்களாக மயக்கம் வருது.',
      desc: 'Critical red flag demonstration (Urgent Emergency Trigger)'
    }
  ];

  const loadScenario = (scenarioId: number) => {
    const sc = demoScenarios.find(s => s.id === scenarioId);
    if (!sc) return;
    setActiveScenario(scenarioId);
    const textToLoad = selectedLanguage === 'ta' ? sc.ta : sc.en;
    setInputText(textToLoad);
    setAnalysisResult(null);
    setErrorMessage(null);
    setIsSaved(false);
  };

  // Check URL search params for quick scenario launch
  useEffect(() => {
    const scParam = searchParams.get('scenario');
    if (scParam) {
      const scId = parseInt(scParam, 10);
      if (!isNaN(scId)) {
        loadScenario(scId);
      }
    }
  }, [searchParams, selectedLanguage]);

  const handleLanguageSwitch = (lang: 'en' | 'ta') => {
    setSelectedLanguage(lang);
    setActiveLanguage(lang);
    if (activeScenario !== null) {
      const sc = demoScenarios.find(s => s.id === activeScenario);
      if (sc) {
        setInputText(lang === 'ta' ? sc.ta : sc.en);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      setErrorMessage('Please enter your health concerns or select one of the demo scenarios.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);
    setIsSaved(false);

    try {
      const result = await api.analyzeHealthConcern(inputText, selectedLanguage);
      setAnalysisResult(result);
      if (result.priority === 'urgent') {
        window.scrollTo({ top: 300, behavior: 'smooth' });
      }
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setErrorMessage(err.message || 'AI service is temporarily unavailable. Please review manually.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveSummary = async () => {
    if (!analysisResult) return;
    if (!consentGiven) {
      alert('Please check the consent checkbox to save your summary.');
      return;
    }

    try {
      await api.saveSummary({
        ...analysisResult,
        inputText,
        language: selectedLanguage,
        isDemo: activeScenario !== null
      });
      setIsSaved(true);
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.8 }
      });
    } catch (err: any) {
      alert(err.message || 'Failed to save summary.');
    }
  };

  const handleReset = () => {
    setInputText('');
    setAnalysisResult(null);
    setErrorMessage(null);
    setIsSaved(false);
    setActiveScenario(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Health Information Organizer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Analyze Health Concern
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Turn your symptoms into clear, doctor-ready notes. Never diagnoses diseases or prescribes medication.
          </p>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-medium">Input Language:</span>
          <div className="flex items-center rounded-xl bg-surface-elevated border border-white/10 p-1">
            <button
              onClick={() => handleLanguageSwitch('en')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedLanguage === 'en'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => handleLanguageSwitch('ta')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedLanguage === 'ta'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              தமிழ் (Tamil)
            </button>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Input & Demo Scenarios */}
        <div className="lg:col-span-5 space-y-6">
          {/* Demo Mode Box (Requirement 16) */}
          <div className="rounded-2xl border border-violet-500/30 bg-surface-elevated/70 p-5 shadow-glass">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-violet-500/20 text-violet-400 flex items-center justify-center">
                  <Zap className="h-3.5 w-3.5" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-violet-300">
                  Hackathon Demo Scenarios
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                Quick Evaluator
              </span>
            </div>

            <p className="text-[11px] text-slate-400 mb-3">
              Click any scenario to populate instant realistic test data for judges:
            </p>

            <div className="space-y-2">
              {demoScenarios.map(sc => (
                <button
                  key={sc.id}
                  onClick={() => loadScenario(sc.id)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between gap-2 ${
                    activeScenario === sc.id
                      ? 'bg-violet-500/20 border-violet-500 text-white font-medium shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                      : 'bg-black/30 border-white/5 text-slate-300 hover:bg-white/5 hover:border-white/10'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-white">{sc.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{sc.desc}</div>
                  </div>
                  <span className="text-[11px] text-violet-400 font-bold shrink-0">
                    Load →
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-3 text-[10px] text-slate-400 italic">
              DEMO DATA — NOT REAL PATIENT INFORMATION
            </div>
          </div>

          {/* User Input Panel */}
          <div className="rounded-2xl border border-white/10 bg-surface-elevated/60 backdrop-blur-md p-5 shadow-glass space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="health-concern" className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Languages className="h-4 w-4 text-cyan-400" />
                <span>Your Health Concern</span>
              </label>
              {inputText && (
                <button
                  onClick={handleReset}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            <div className="relative">
              <textarea
                id="health-concern"
                rows={7}
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  setActiveScenario(null);
                }}
                placeholder={
                  selectedLanguage === 'ta'
                    ? 'உங்கள் உடல்நலக் கவலையை இங்கே விவரிக்கவும் (எ.கா: எனக்கு இரண்டு நாட்களாக காய்ச்சல் இருக்கு, உடம்பு ரொம்ப சோர்வா இருக்கு...)'
                    : 'Describe what symptoms you are experiencing, how long they have lasted, severity, and any medications taken...'
                }
                className="w-full rounded-xl bg-slate-900/80 border border-white/10 p-3.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 leading-relaxed transition-all resize-y"
              />
            </div>

            {/* Character & language note */}
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>{inputText.length} characters</span>
              <span className="text-cyan-400/80">
                {selectedLanguage === 'ta' ? 'தமிழ் உள்ளீடு செயலில் உள்ளது' : 'English input active'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !inputText.trim()}
                className={`w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                  isAnalyzing || !inputText.trim()
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                    : 'bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 shadow-glow-cyan'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Extracting Structured Information...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Analyze with AI</span>
                  </>
                )}
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">{errorMessage}</p>
                  <p className="text-[11px] text-rose-300/80 mt-1">
                    Please review your information manually and consult a qualified healthcare professional.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quick AI Boundary card */}
          <AITransparencyCard compact />
        </div>

        {/* RIGHT COLUMN: AI Structured Output */}
        <div className="lg:col-span-7 space-y-6">
          {!analysisResult && !isAnalyzing && (
            <div className="rounded-2xl border border-dashed border-white/10 bg-surface-elevated/30 p-12 text-center space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
                <FileCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">AI Structured Output Awaiting Input</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                  Type your health concern on the left or select a Demo Scenario. CARE-PASS AI will immediately organize symptoms, calculate your completeness score, and prepare a doctor summary.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => loadScenario(1)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-400 text-xs font-semibold border border-white/10 transition-colors"
                >
                  Load Scenario 1 (Fever & Fatigue)
                </button>
              </div>
            </div>
          )}

          {isAnalyzing && (
            <div className="rounded-2xl border border-cyan-500/30 bg-surface-elevated/60 p-12 text-center space-y-4 shadow-glow-cyan animate-pulse">
              <Loader2 className="h-8 w-8 text-cyan-400 animate-spin mx-auto" />
              <div>
                <h3 className="text-base font-bold text-white">AI Health Information Organizer at Work</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Filtering for user-reported symptoms, onset timeline, and zero-hallucination extraction...
                </p>
              </div>
            </div>
          )}

          {analysisResult && (
            <div className="space-y-6 animate-in fade-in duration-500">
              {/* Emergency Card if urgent */}
              {analysisResult.priority === 'urgent' && (
                <EmergencySafetyCard urgentDetected={true} />
              )}

              {/* Informational Priority Badge & Care-Pass Score */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UrgencyBadge
                  priority={analysisResult.priority}
                  reason={analysisResult.reason || analysisResult.priorityReason}
                />
                <CarePassScore
                  score={analysisResult.completenessScore}
                  breakdown={analysisResult.completenessBreakdown}
                />
              </div>

              {/* AI Organized Summary Card (Requirement 10) */}
              <div className="rounded-2xl border border-white/10 bg-surface-elevated/70 backdrop-blur-md p-6 shadow-glass space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
                    <h3 className="text-sm font-bold tracking-wider text-white uppercase">
                      AI ORGANIZED SUMMARY
                    </h3>
                  </div>
                  <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                    Extraction Mode
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium block text-[11px] uppercase tracking-wider mb-0.5">
                      Main concern:
                    </span>
                    <p className="text-white font-semibold text-sm bg-black/20 p-2.5 rounded-lg border border-white/5">
                      {analysisResult.mainConcern}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-400 font-medium block text-[11px] uppercase tracking-wider mb-0.5">
                        Symptoms mentioned:
                      </span>
                      <div className="bg-black/20 p-2.5 rounded-lg border border-white/5 space-y-1">
                        {analysisResult.symptoms.map((s, idx) => (
                          <div key={idx} className="text-slate-200 flex items-center gap-1.5">
                            <span className="h-1 w-1 rounded-full bg-cyan-400"></span>
                            {s}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium block text-[11px] uppercase tracking-wider mb-0.5">
                        Duration & Severity:
                      </span>
                      <div className="bg-black/20 p-2.5 rounded-lg border border-white/5 space-y-1 text-slate-200">
                        <p><strong className="text-slate-400 font-normal">Duration:</strong> {analysisResult.duration}</p>
                        <p><strong className="text-slate-400 font-normal">Severity:</strong> {analysisResult.severity}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-400 font-medium block text-[11px] uppercase tracking-wider mb-0.5">
                        Medications mentioned:
                      </span>
                      <div className="bg-black/20 p-2.5 rounded-lg border border-white/5 text-slate-300">
                        {analysisResult.medicationsMentioned.join(', ') || 'Not provided'}
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium block text-[11px] uppercase tracking-wider mb-0.5">
                        Other information / Context:
                      </span>
                      <div className="bg-black/20 p-2.5 rounded-lg border border-white/5 text-slate-300">
                        {analysisResult.relevantInformation?.join(', ') || 'Not provided'}
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-amber-400 font-bold block text-[11px] uppercase tracking-wider mb-0.5">
                      Missing information:
                    </span>
                    <div className="bg-amber-950/20 p-2.5 rounded-lg border border-amber-500/20 text-slate-300 space-y-1">
                      {analysisResult.missingInformation.length > 0 ? (
                        analysisResult.missingInformation.map((m, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-amber-200/90">
                            <span className="h-1 w-1 rounded-full bg-amber-400"></span>
                            {m}
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-400 italic">All key communication data was provided.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Questions to Discuss with Professional */}
              <div className="rounded-2xl border border-white/10 bg-surface-elevated/70 backdrop-blur-md p-6 shadow-glass space-y-3">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-cyan-400" />
                  <h3 className="text-sm font-bold tracking-wider text-white uppercase">
                    SMART QUESTIONS TO DISCUSS WITH A PROFESSIONAL
                  </h3>
                </div>
                <p className="text-xs text-slate-400">
                  Formulated to empower you during your clinic visit based on what you shared:
                </p>
                <div className="space-y-2 pt-1">
                  {analysisResult.followUpQuestions.map((q, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-xs text-slate-200 flex items-start gap-2.5"
                    >
                      <span className="font-bold text-cyan-400 shrink-0">{idx + 1}.</span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Doctor-Ready Summary Card (PDF Export, Print, Copy) */}
              <DoctorSummaryCard
                summary={analysisResult}
                patientName={user?.fullName || 'Patient'}
              />

              {/* Consent and Save Actions */}
              <div className="rounded-2xl border border-white/10 bg-surface-elevated/80 p-5 shadow-glass space-y-4">
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <input
                    type="checkbox"
                    id="consent-check"
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                    className="mt-0.5 rounded border-white/20 bg-slate-900 text-cyan-500 focus:ring-cyan-400"
                  />
                  <label htmlFor="consent-check" className="cursor-pointer leading-relaxed">
                    “I understand that this prototype organizes information for demonstration and does not provide medical diagnosis.”
                  </label>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveSummary}
                      disabled={isSaved || !consentGiven}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                        isSaved
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                          : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-glow-cyan'
                      }`}
                    >
                      {isSaved ? <CheckCircle className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                      <span>{isSaved ? 'Saved to Health Timeline!' : 'Save Summary'}</span>
                    </button>

                    <button
                      onClick={handleReset}
                      className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold border border-white/10 transition-colors"
                    >
                      Start New Analysis
                    </button>
                  </div>

                  {isSaved && (
                    <button
                      onClick={() => navigate('/history')}
                      className="text-cyan-400 hover:underline text-xs font-semibold flex items-center gap-1"
                    >
                      <span>View in Timeline</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
