import React, { useState } from 'react';
import {
  Shield,
  Cpu,
  Search,
  Lock,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Zap,
  Eye,
  ShieldAlert,
  Mail,
  MessageSquare,
  ChevronRight,
  Terminal,
  Activity
} from 'lucide-react';
import { api } from '../api/client';
import ResultCard from '../components/ResultCard';

const SAMPLE_PRESETS = [
  {
    label: "Fake Bank Alert (High Risk)",
    text: "URGENT: Your bank account will be blocked today! Send your OTP immediately to verify your account."
  },
  {
    label: "Lottery Scam (High Risk)",
    text: "Congratulations! You have won ₹50,000 cash prize. Send your bank details to claim your prize immediately."
  },
  {
    label: "College Meeting (Low Risk)",
    text: "Your college meeting is scheduled for tomorrow at 10 AM in the main auditorium."
  }
];

export default function LandingPage({ onNavigate }) {
  const [demoInput, setDemoInput] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [demoResult, setDemoResult] = useState(null);
  const [error, setError] = useState('');

  const runDemoAnalysis = async (textToAnalyze) => {
    const text = textToAnalyze || demoInput;
    if (!text.trim()) {
      setError('Please paste or select a message to test.');
      return;
    }
    setError('');
    setAnalyzing(true);
    try {
      const res = await api.analyzeMessage(text);
      setDemoResult(res);
    } catch (err) {
      setError(err.message || 'Failed to complete analysis.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handlePresetSelect = (presetText) => {
    setDemoInput(presetText);
    runDemoAnalysis(presetText);
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200 dark:border-slate-800">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-linear-to-tr from-cyan-500/15 via-indigo-500/15 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            {/* Tagline Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 mb-6 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Detect. Understand. Stay Safe.</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6">
              Detect Social Engineering{' '}
              <span className="bg-linear-to-r from-cyan-600 via-indigo-600 to-cyan-500 dark:from-cyan-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Before You Trust
              </span>{' '}
              the Message.
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Analyze suspicious messages and emails with AI-powered risk analysis. Identify urgency,
              credential theft, authority impersonation, and fraudulent links before you click.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <button
                onClick={() => onNavigate('analyze-message')}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-semibold text-sm bg-linear-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Analyze a Message
              </button>

              <button
                onClick={() => onNavigate('safety-tips')}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-semibold text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs transition cursor-pointer"
              >
                Learn More
                <ChevronRight className="w-4 h-4 ml-1.5" />
              </button>
            </div>
          </div>

          {/* Interactive Live Quick-Test Card */}
          <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                <Terminal className="w-4 h-4" />
                <span>Instant Risk Scanner Preview</span>
              </div>
              <span className="text-[11px] text-slate-400">No account required to test</span>
            </div>

            {/* Sample Presets */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs font-semibold text-slate-500">Quick Test Samples:</span>
              {SAMPLE_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePresetSelect(preset.text)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Textarea */}
            <div className="relative mb-4">
              <textarea
                rows={3}
                value={demoInput}
                onChange={(e) => setDemoInput(e.target.value)}
                placeholder="Paste a suspicious SMS, WhatsApp message, social media message, or other text here…"
                className="w-full p-4 text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition resize-none"
              />
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2 shrink-0" />
                {error}
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {demoInput.length} characters
              </span>
              <button
                onClick={() => runDemoAnalysis()}
                disabled={analyzing}
                className="inline-flex items-center px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-500/20 disabled:opacity-50 transition"
              >
                {analyzing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Analyzing Patterns...
                  </>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5 mr-2" />
                    Scan Content Now
                  </>
                )}
              </button>
            </div>

            {/* Demo Result Output */}
            {demoResult && (
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                <ResultCard
                  result={demoResult}
                  onReset={() => {
                    setDemoResult(null);
                    setDemoInput('');
                  }}
                  onViewHistory={() => onNavigate('history')}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trust & Feature Pillars */}
      <section className="py-12 bg-white dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start space-x-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold">AI-Powered Analysis</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  NLP classification model trained on modern social engineering attack data.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold">Calibrated Risk Scoring</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  0-100 risk rating with Low Risk, Suspicious, High Risk, and Critical bands.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold">Explainable AI</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Understand exactly why a message is flagged with plain-English rationales.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold">Privacy-Focused</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Zero external link visits. Untrusted URLs are never requested over the web.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-500">
            Intelligent Defense Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-black mt-2">
            How SocialGuard AI Protects You
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
            A three-tier inspection pipeline blending machine learning classification,
            heuristic deception matching, and safe link parsing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 font-bold flex items-center justify-center mb-4">
              01
            </div>
            <h3 className="text-base font-bold mb-2">1. Paste Message or Email</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Input any suspicious text, WhatsApp forward, SMS alert, or email body.
              URLs and headers are safely isolated.
            </p>
          </div>

          <div className="relative p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 font-bold flex items-center justify-center mb-4">
              02
            </div>
            <h3 className="text-base font-bold mb-2">2. Deep Multi-Layer Scan</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              The engine checks for urgency, authority impersonation, financial demands,
              threat cues, and deceptive link structures.
            </p>
          </div>

          <div className="relative p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 font-bold flex items-center justify-center mb-4">
              03
            </div>
            <h3 className="text-base font-bold mb-2">3. Actionable Defense Verdict</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Receive a 0-100 risk score, explanation of deception techniques used,
              and step-by-step guidance on how to respond safely.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-linear-to-b from-slate-900 to-slate-950 text-white border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">
            Stay One Step Ahead of Social Engineering
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto mb-8">
            Create an account to track your analysis history, review security trends,
            and monitor risk profiles over time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('register')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 transition"
            >
              Create Free Account
            </button>
            <button
              onClick={() => onNavigate('analyze-message')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition"
            >
              Try Message Analyzer
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
