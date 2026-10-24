import React from 'react';

export function RiskDistributionDonut({ data = [] }) {
  const total = data.reduce((acc, curr) => acc + curr.count, 0);

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-52 text-slate-400 text-sm">
        No analysis data available yet.
      </div>
    );
  }

  // Calculate SVG arc paths
  const radius = 65;
  const strokeWidth = 24;
  const dimension = 170;
  const circumference = 2 * Math.PI * radius;
  let accumulatedOffset = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
      <div className="relative flex items-center justify-center shrink-0">
        <svg width={dimension} height={dimension} className="transform -rotate-90">
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-slate-100 dark:text-slate-800"
          />
          {data.map((item, index) => {
            const ratio = item.count / total;
            const strokeDasharray = `${ratio * circumference} ${circumference}`;
            const strokeDashoffset = -accumulatedOffset;
            accumulatedOffset += ratio * circumference;

            return (
              <circle
                key={index}
                cx={dimension / 2}
                cy={dimension / 2}
                r={radius}
                stroke={item.color || '#0ea5e9'}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
            );
          })}
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
            {total}
          </span>
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
            Total Scans
          </span>
        </div>
      </div>

      {/* Legend list */}
      <div className="flex-1 w-full space-y-2.5">
        {data.map((item, idx) => {
          const percent = total > 0 ? Math.round((item.count / total) * 100) : 0;
          return (
            <div key={idx} className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center space-x-2 font-mono">
                <span className="font-bold text-slate-900 dark:text-white">{item.count}</span>
                <span className="text-slate-400">({percent}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function RiskTrendLineChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-52 text-slate-400 text-sm">
        No trend records recorded yet.
      </div>
    );
  }

  const maxCount = Math.max(...data.map(d => d.analyses), 5);
  const chartHeight = 140;
  const chartWidth = 320;
  const padding = 20;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1 || 1)) * (chartWidth - padding * 2);
    const y = chartHeight - padding - (d.analyses / maxCount) * (chartHeight - padding * 2);
    return { x, y, ...d };
  });

  const pathD = points.length > 1
    ? points.reduce((acc, curr, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${curr.x} ${curr.y}`, '')
    : '';

  return (
    <div className="w-full py-2">
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-40">
          {/* Subtle grid lines */}
          <line
            x1={padding}
            y1={chartHeight - padding}
            x2={chartWidth - padding}
            y2={chartHeight - padding}
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-800"
            strokeDasharray="4 4"
          />
          <line
            x1={padding}
            y1={chartHeight / 2}
            x2={chartWidth - padding}
            y2={chartHeight / 2}
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-800"
            strokeDasharray="4 4"
          />

          {/* Line Path */}
          {points.length > 1 && (
            <path
              d={pathD}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Data Points */}
          {points.map((p, idx) => (
            <g key={idx} className="group">
              <circle
                cx={p.x}
                cy={p.y}
                r="4"
                fill="#06b6d4"
                className="transition-transform group-hover:scale-150 cursor-pointer"
              />
              <text
                x={p.x}
                y={chartHeight - 4}
                textAnchor="middle"
                className="text-[9px] fill-slate-400 font-sans"
              >
                {p.date}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-2 px-1">
        <span>7-day scan history</span>
        <span className="font-mono text-cyan-500 font-medium">Daily scan volume</span>
      </div>
    </div>
  );
}

export function TopIndicatorsBarChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-52 text-slate-400 text-sm">
        No indicators detected in your history yet.
      </div>
    );
  }

  const maxCount = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="space-y-3.5 py-2">
      {data.map((item, idx) => {
        const percentage = Math.round((item.count / maxCount) * 100);
        return (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-slate-700 dark:text-slate-300 truncate max-w-[220px]">
                {item.indicator}
              </span>
              <span className="font-mono text-slate-500 dark:text-slate-400 font-bold">
                {item.count} {item.count === 1 ? 'hit' : 'hits'}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-linear-to-r from-cyan-500 to-indigo-500 transition-all duration-700 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
