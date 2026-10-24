import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  History,
  ExternalLink,
  Lock,
  ArrowRight
} from 'lucide-react';
import RiskMeter from './RiskMeter';
import IndicatorBadge from './IndicatorBadge';

export default function ResultCard({
  result,
  onReset,
  onViewHistory,
  originalText = '',
  isSaved = false
}) {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const {
    classification = 'Low Risk',
    risk_score = 0,
    confidence = 0.9,
    indicators = [],
    indicator_details = [],
    explanation = '',
    recommendations = [],
    url_scan = {}
  } = result;

  const copyReport = () => {
    const reportText = `[SocialGuard AI Security Assessment]
Classification: ${classification}
Risk Score: ${risk_score}%
Confidence: ${Math.round(confidence * 100)}%

Detected Indicators:
${indicators.map(i => `- ${i}`).join('\n') || '- None'}

Why is this suspicious?
${explanation}

Recommended Actions:
${recommendations.map(r => `- ${r}`).join('\n')}

Notice: AI-generated risk estimate. Always verify independently through official channels.`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Header banner styling
  const isCritical = classification === 'Critical Risk';
  const isHigh = classification === 'High Risk';
  const isSuspicious = classification === 'Suspicious';
  const isLow = classification === 'Low Risk';

  let bannerBg = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300';
  let bannerIcon = <ShieldCheck className="w-6 h-6 text-emerald-500 mr-3 shrink-0" />;
  let badgeColor = 'bg-emerald-500 text-white';

  if (isCritical) {
    bannerBg = 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300';
    bannerIcon = <ShieldAlert className="w-6 h-6 text-red-500 mr-3 shrink-0 animate-pulse" />;
    badgeColor = 'bg-red-600 text-white';
  } else if (isHigh) {
    bannerBg = 'bg-orange-500/10 border-orange-500/30 text-orange-700 dark:text-orange-300';
    bannerIcon = <AlertTriangle className="w-6 h-6 text-orange-500 mr-3 shrink-0" />;
    badgeColor = 'bg-orange-600 text-white';
  } else if (isSuspicious) {
    bannerBg = 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300';
    bannerIcon = <Info className="w-6 h-6 text-amber-500 mr-3 shrink-0" />;
    badgeColor = 'bg-amber-500 text-white';
  }

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl transition-all">
      {/* Top Banner */}
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border ${bannerBg} mb-8 gap-4`}>
        <div className="flex items-center">
          {bannerIcon}
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${badgeColor}`}>
                {classification}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Confidence: {Math.round(confidence * 100)}%
              </span>
            </div>
            <p className="text-sm font-medium mt-1">
              {isCritical || isHigh
                ? 'Strong social engineering deception cues detected. Proceed with extreme caution.'
                : isSuspicious
                ? 'Suspicious manipulation characteristics detected. Do not click unverified links.'
                : 'No immediate signs of social engineering detected. Standard communication.'}
            </p>
          </div>
        </div>

        <button
          onClick={copyReport}
          className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-xs shrink-0"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500 mr-1.5" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
          {copied ? 'Copied Report' : 'Copy Report'}
        </button>
      </div>

      {/* Main Grid: Meter + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
        {/* Left Column: Risk Gauge */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-100 dark:border-slate-800/80">
          <RiskMeter score={risk_score} size="lg" showLabel={false} />
          <div className="mt-4 text-center">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Risk Level Category
            </span>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {classification} ({risk_score}/100)
            </h4>
            <div className="flex items-center justify-center gap-1.5 mt-2 text-[11px] text-slate-400">
              <Lock className="w-3 h-3 text-cyan-500" />
              <span>Calibrated AI Risk Engine</span>
            </div>
          </div>
        </div>

        {/* Right Column: Detected Indicators & Explanation */}
        <div className="lg:col-span-8 space-y-6">
          {/* Detected Indicators */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Detected Indicators ({indicators.length})
              </h4>
            </div>

            {indicators.length === 0 ? (
              <div className="p-4 bg-emerald-500/5 rounded-lg border border-emerald-500/20 text-sm text-emerald-700 dark:text-emerald-400 flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-2 shrink-0" />
                No deceptive indicators or known scam signatures were triggered.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {indicator_details.length > 0 ? (
                  indicator_details.map((ind, idx) => (
                    <IndicatorBadge
                      key={idx}
                      indicator={ind.indicator_name}
                      severity={ind.severity}
                    />
                  ))
                ) : (
                  indicators.map((name, idx) => (
                    <IndicatorBadge
                      key={idx}
                      indicator={name}
                      severity={isCritical ? 'critical' : isHigh ? 'high' : 'medium'}
                    />
                  ))
                )}
              </div>
            )}
          </div>

          {/* Why is this suspicious? */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Why is this {classification === 'Low Risk' ? 'classified as Low Risk' : 'suspicious'}?
            </h4>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-800 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {explanation}
            </div>
          </div>

          {/* Suspicious Links detail if present */}
          {url_scan?.suspicious_urls?.length > 0 && (
            <div className="p-4 bg-red-500/5 dark:bg-red-500/10 rounded-xl border border-red-500/20 space-y-2">
              <div className="flex items-center text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                <Link2Off className="w-3.5 h-3.5 mr-1.5" />
                Flagged Link Anomalies
              </div>
              <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                {url_scan.risk_flags.map((flag, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Recommended Actions */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-6 mb-8">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-4 flex items-center">
          <ShieldCheck className="w-4 h-4 text-cyan-500 mr-2" />
          Recommended Actions & Defenses
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className="flex items-start p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2.5 shrink-0 mt-0.5" />
              <span className="leading-snug">{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="text-xs text-slate-400 italic">
          * AI-generated risk assessment. Do not rely on automated tools as a 100% guarantee.
        </div>

        <div className="flex items-center gap-3">
          {onReset && (
            <button
              onClick={onReset}
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Analyze Another
            </button>
          )}

          {onViewHistory && (
            <button
              onClick={onViewHistory}
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition shadow-sm"
            >
              <History className="w-4 h-4 mr-2" />
              View History
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
