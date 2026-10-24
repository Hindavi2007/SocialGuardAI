import React from 'react';
import {
  Clock,
  ShieldAlert,
  KeyRound,
  CreditCard,
  Gift,
  UserCheck,
  HeartCrack,
  Link2Off,
  AlertTriangle,
  FileWarning
} from 'lucide-react';

export default function IndicatorBadge({ indicator, severity }) {
  const name = typeof indicator === 'object' ? indicator.indicator_name : indicator;
  const sev = (typeof indicator === 'object' ? indicator.severity : severity) || 'medium';

  // Select appropriate icon
  const getIcon = () => {
    const lower = (name || '').toLowerCase();
    if (lower.includes('urgency')) return <Clock className="w-3.5 h-3.5 mr-1.5" />;
    if (lower.includes('fear') || lower.includes('threat')) return <ShieldAlert className="w-3.5 h-3.5 mr-1.5" />;
    if (lower.includes('otp') || lower.includes('password') || lower.includes('credential')) return <KeyRound className="w-3.5 h-3.5 mr-1.5" />;
    if (lower.includes('financial') || lower.includes('bank') || lower.includes('card') || lower.includes('payment') || lower.includes('billing')) return <CreditCard className="w-3.5 h-3.5 mr-1.5" />;
    if (lower.includes('reward') || lower.includes('prize') || lower.includes('lottery')) return <Gift className="w-3.5 h-3.5 mr-1.5" />;
    if (lower.includes('authority') || lower.includes('impersonation')) return <UserCheck className="w-3.5 h-3.5 mr-1.5" />;
    if (lower.includes('emotion')) return <HeartCrack className="w-3.5 h-3.5 mr-1.5" />;
    if (lower.includes('link')) return <Link2Off className="w-3.5 h-3.5 mr-1.5" />;
    return <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />;
  };

  // Severity color styles
  const getSeverityStyle = () => {
    switch (sev.toLowerCase()) {
      case 'critical':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30';
      case 'high':
        return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30';
      case 'medium':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
      default:
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getSeverityStyle()} transition-all shadow-xs`}>
      {getIcon()}
      <span>{name}</span>
      {sev && (
        <span className="ml-1.5 text-[9px] uppercase tracking-wider opacity-75 font-semibold">
          ({sev})
        </span>
      )}
    </span>
  );
}
