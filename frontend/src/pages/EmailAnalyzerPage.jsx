import React, { useState } from 'react';
import {
  Mail,
  Search,
  Trash2,
  Sparkles,
  AlertTriangle,
  User,
  Type,
  FileText,
  Link2
} from 'lucide-react';
import { api } from '../api/client';
import ResultCard from '../components/ResultCard';
import { useToast } from '../components/Toast';

const EMAIL_EXAMPLES = [
  {
    title: "PayPal Phishing Alert",
    sender: "security-team@paypal-security-alert.xyz",
    subject: "Urgent: Your account is suspended due to unauthorized access",
    body: "Dear customer,\n\nWe detected a sign-in attempt to your PayPal account from an unrecognized IP in Moscow. To prevent permanent suspension of your balance, verify your details immediately at http://paypal-security-alert.xyz/verify-login\n\nIf you do not update within 24 hours, your account will be permanently blocked."
  },
  {
    title: "CEO Impersonation (Whaling)",
    sender: "mark.ceo.urgent@gmail.com",
    subject: "QUICK REQUEST - In meeting right now",
    body: "Hi,\n\nI am currently in an urgent board meeting and cannot talk on the phone. I need you to purchase 5 Apple gift cards worth $200 each for our prospective clients right away. Send the codes to me here directly. I will reimburse you by tomorrow."
  },
  {
    title: "Netflix Billing Scam",
    sender: "support@netflix-renew-bill.online",
    subject: "Final Notice: Your membership payment declined",
    body: "Your Netflix subscription could not be renewed. To continue watching your favorite shows, please update your credit card number, CVV, and billing address at http://netflix-renew-bill.online/restore"
  },
  {
    title: "Safe Corporate Newsletter",
    sender: "digest@github.com",
    subject: "GitHub Community Updates - September 2026",
    body: "Hello developer!\n\nHere is your monthly recap of open-source projects, trending repositories, and the latest developer tooling updates from the community. Let us know your feedback!"
  }
];

export default function EmailAnalyzerPage({ onNavigate }) {
  const [sender, setSender] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const { addToast } = useToast();

  const handleAnalyze = async () => {
    if (!body.trim() && !subject.trim()) {
      setError('Please provide at least an email subject or email body to analyze.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const data = await api.analyzeEmail({ sender, subject, body });
      setResult(data);
      addToast('Email analysis completed successfully', 'success');
    } catch (err) {
      setError(err.message || 'Email analysis request failed.');
      addToast(err.message || 'Analysis failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSender('');
    setSubject('');
    setBody('');
    setResult(null);
    setError('');
  };

  const loadExample = (ex) => {
    setSender(ex.sender);
    setSubject(ex.subject);
    setBody(ex.body);
    setError('');
    setResult(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Analyze Suspicious Email
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Inspect sender addresses, spoofed domains, phishing subjects, and email body contents.
            </p>
          </div>
        </div>
      </div>

      {/* Input Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl mb-8">
        {/* Preset Selector */}
        <div className="mb-5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center mb-2">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-indigo-500" />
            Load Sample Phishing Emails:
          </span>
          <div className="flex flex-wrap gap-2">
            {EMAIL_EXAMPLES.map((ex, i) => (
              <button
                key={i}
                type="button"
                onClick={() => loadExample(ex)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-700 dark:text-slate-300 border border-transparent hover:border-indigo-500/30 transition shadow-xs"
              >
                {ex.title}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Sender Email or Header (Optional)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  placeholder="e.g. security-alert@paypal-update.xyz"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Subject Line
              </label>
              <div className="relative">
                <Type className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. URGENT: Your account has been suspended"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Email Body Content & Hyperlinks
            </label>
            <textarea
              rows={6}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Paste the full body of the email here, including any links, greetings, and signature lines…"
              className="w-full p-4 text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition leading-relaxed resize-y"
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center space-x-4 text-xs text-slate-400">
            <span>{body.length} characters in body</span>
            <span>•</span>
            <span className="flex items-center">
              <Link2 className="w-3.5 h-3.5 mr-1 text-indigo-500" />
              Automated safe URL scan active
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {(sender || subject || body) && (
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
              disabled={loading || (!body.trim() && !subject.trim())}
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-linear-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-md shadow-indigo-500/20 disabled:opacity-50 transition cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Analyzing Email...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Analyze Suspicious Email
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Result Card */}
      {result && (
        <div className="transition-all animate-in fade-in duration-500">
          <ResultCard
            result={result}
            originalText={body}
            onReset={handleClear}
            onViewHistory={() => onNavigate('history')}
            isSaved={result.saved}
          />
        </div>
      )}
    </div>
  );
}
