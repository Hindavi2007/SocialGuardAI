import React from 'react';

export default function RiskMeter({ score = 0, size = 'md', showLabel = true }) {
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));

  // Color selection based on risk band
  let strokeColor = '#10B981'; // Low Risk
  let textColor = 'text-emerald-500 dark:text-emerald-400';
  let badgeBg = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
  let riskLabel = 'Low Risk';

  if (clampedScore > 80) {
    strokeColor = '#EF4444'; // Critical
    textColor = 'text-red-500 dark:text-red-400';
    badgeBg = 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
    riskLabel = 'Critical Risk';
  } else if (clampedScore > 60) {
    strokeColor = '#F97316'; // High
    textColor = 'text-orange-500 dark:text-orange-400';
    badgeBg = 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
    riskLabel = 'High Risk';
  } else if (clampedScore > 30) {
    strokeColor = '#F59E0B'; // Suspicious
    textColor = 'text-amber-500 dark:text-amber-400';
    badgeBg = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    riskLabel = 'Suspicious';
  }

  // Dimensions
  const dimension = size === 'sm' ? 80 : size === 'lg' ? 180 : 130;
  const strokeWidth = size === 'sm' ? 7 : size === 'lg' ? 12 : 10;
  const radius = (dimension - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative inline-flex items-center justify-center">
        <svg
          width={dimension}
          height={dimension}
          className="transform -rotate-90 transition-all duration-700 ease-out"
        >
          {/* Background track */}
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-slate-200 dark:text-slate-800"
          />
          {/* Active progress ring */}
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`font-extrabold tracking-tight font-mono ${textColor} ${
            size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-4xl' : 'text-2xl'
          }`}>
            {clampedScore}%
          </span>
          {size !== 'sm' && (
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              Risk Score
            </span>
          )}
        </div>
      </div>

      {showLabel && (
        <span className={`mt-2.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeBg}`}>
          {riskLabel}
        </span>
      )}
    </div>
  );
}
