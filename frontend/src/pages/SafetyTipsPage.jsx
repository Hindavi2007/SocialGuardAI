import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  MessageSquare,
  Mail,
  KeyRound,
  ShieldCheck,
  ExternalLink,
  Users,
  ShoppingBag,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { api } from '../api/client';

export default function SafetyTipsPage({ onNavigate }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState(null);

  useEffect(() => {
    api.getSafetyTips()
      .then(data => {
        setCategories(data.categories || []);
        if (data.categories && data.categories.length > 0) {
          setSelectedCat(data.categories[0].id);
        }
      })
      .catch(err => console.error("Failed to load safety tips:", err))
      .finally(() => setLoading(false));
  }, []);

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'MessageSquare': return <MessageSquare className="w-5 h-5 text-cyan-500" />;
      case 'Mail': return <Mail className="w-5 h-5 text-indigo-500" />;
      case 'KeyRound': return <KeyRound className="w-5 h-5 text-amber-500" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5 text-red-500" />;
      case 'ExternalLink': return <ExternalLink className="w-5 h-5 text-sky-500" />;
      case 'Users': return <Users className="w-5 h-5 text-purple-500" />;
      case 'ShoppingBag': return <ShoppingBag className="w-5 h-5 text-emerald-500" />;
      default: return <ShieldCheck className="w-5 h-5 text-cyan-500" />;
    }
  };

  const currentCategory = categories.find(c => c.id === selectedCat) || categories[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors">
      {/* Header */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 mb-3">
          <BookOpen className="w-5 h-5 mr-2" />
          <span className="text-xs font-bold uppercase tracking-wider">Cybersecurity Education Hub</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          Social Engineering Defense Manual
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
          Arm yourself with practical behavioral countermeasures against digital fraud, manipulation,
          and credential interception.
        </p>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center">
          <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Category Selector Pills */}
          <div className="lg:col-span-4 space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3 px-1">
              Safety Categories ({categories.length})
            </span>
            {categories.map((cat) => {
              const active = cat.id === selectedCat;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCat(cat.id)}
                  className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition cursor-pointer ${
                    active
                      ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-700 dark:text-cyan-300 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {getCategoryIcon(cat.icon)}
                    <div>
                      <span className="text-xs font-bold block">{cat.category}</span>
                      <span className="text-[10px] text-slate-400 truncate max-w-[180px] block">
                        {cat.title}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className={`w-3.5 h-3.5 transition-transform ${active ? 'text-cyan-500 translate-x-1' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </div>

          {/* Right Detail Card for selected category */}
          <div className="lg:col-span-8">
            {currentCategory && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-8 animate-in fade-in duration-300">
                {/* Header */}
                <div className="border-b border-slate-100 dark:border-slate-800 pb-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                      {getCategoryIcon(currentCategory.icon)}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                        {currentCategory.category}
                      </span>
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                        {currentCategory.title}
                      </h2>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 italic">
                    "{currentCategory.tagline}"
                  </p>
                </div>

                {/* Red Flags Section */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center mb-3">
                    <AlertTriangle className="w-4 h-4 mr-1.5" />
                    Common Red Flags & Attack Signs
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentCategory.red_flags.map((flag, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 text-xs text-slate-700 dark:text-slate-300 leading-relaxed flex items-start"
                      >
                        <span className="text-red-500 font-bold mr-2 text-sm leading-none">•</span>
                        <span>{flag}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Defense Action Checklist */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center mb-3">
                    <ShieldCheck className="w-4 h-4 mr-1.5" />
                    Actionable Defense Checklist
                  </h3>
                  <div className="space-y-2.5">
                    {currentCategory.defense_steps.map((step, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-700 dark:text-slate-300 flex items-start"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2.5 shrink-0 mt-0.5" />
                        <span className="leading-snug">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Call to Action Bar */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Encountered something that looks like this?
                  </span>
                  <button
                    onClick={() => onNavigate('analyze-message')}
                    className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow-xs"
                  >
                    Scan Suspected Text Now
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
