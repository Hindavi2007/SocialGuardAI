import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  Trash2,
  Sparkles,
  AlertTriangle,
  FileText,
  Shield,
  Clock,
  ExternalLink
} from 'lucide-react';
import { api } from '../api/client';
import ResultCard from '../components/ResultCard';
import { useToast } from '../components/Toast';

const EXAMPLES = [
  {
    title: "Fake Bank Alert",
    category: "High Risk",
    text: "URGENT: Your bank account will be blocked today! Send your OTP immediately to verify your account."
  },
  {
    title: "Prize / Lottery Scam",
    category: "High Risk",
    text: "Congratulations! You have won ₹50,000 cash prize in our international lottery! Send bank details to claim."
  },
  {
    title: "Account Verification Scam",
    category: "Suspicious",
    text: "Your Netflix subscription has expired. Click http://netflix-billing-resolve.top to update your card details immediately."
  },
  {
    title: "OTP Request",
    category: "Critical Risk",
    text: "CRITICAL: Immediate action required. Share your One-Time Password (OTP) to stop unauthorized withdrawal of $1,200."
  },
  {
    title: "Safe Meeting Notice",
    category: "Low Risk",
    text: "Your college meeting is scheduled for tomorrow at 10 AM in the main auditorium. Bring your student ID."
  }
];

export default function MessageAnalyzerPage({ onNavigate }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const { addToast } = useToast();

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError('Please enter or paste a message to analyze.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const data = await api.analyzeMessage(text);
      setResult(data);
      addToast('Message analysis completed successfully', 'success');
    } catch (err) {
      setError(err.message || 'Analysis request failed. Please check connection.');
      addToast(err.message || 'Analysis failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText('');
    setResult(null);
    setError('');
  };

  const loadExample = (exampleText) => {
    setText(exampleText);
    setError('');
    setResult(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Analyze Suspicious Message
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Paste SMS, WhatsApp, social media DMs, or suspicious chat alerts to scan for manipulation patterns.
            </p>
          </div>
        </div>
      </div>

      {/* Main Analysis Input Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl mb-8">
        {/* Example Presets Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-cyan-500" />
              Load Real-World Examples:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                type="button"
                onClick={() => loadExample(ex.text)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 hover:text-cyan-600 dark:hover:text-cyan-400 text-slate-700 dark:text-slate-300 border border-transparent hover:border-cyan-500/30 transition shadow-xs"
              >
                <span>{ex.title}</span>
                <span className="ml-1.5 text-[10px] text-slate-400">({ex.category})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Textarea */}
        <div className="relative mb-3">
          <textarea
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste a suspicious SMS, WhatsApp message, social media message, or other text here…"
            className="w-full p-4 text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition leading-relaxed resize-y"
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Bottom controls: Character count & Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center space-x-4 text-xs text-slate-400">
            <span>{text.length} characters</span>
            <span>•</span>
            <span className="italic">Max recommended: 15,000</span>
          </div>

          <div className="flex items-center space-x-3">
            {text && (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                Clear
              </button>
            )}

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={loading || !text.trim()}
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-linear-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-md shadow-cyan-500/20 disabled:opacity-50 transition cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Analyzing Message...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Analyze Suspicious Text
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Result Display Component */}
      {result && (
        <div className="transition-all animate-in fade-in duration-500">
          <ResultCard
            result={result}
            originalText={text}
            onReset={handleClear}
            onViewHistory={() => onNavigate('history')}
            isSaved={result.saved}
          />
        </div>
      )}
    </div>
  );
}
