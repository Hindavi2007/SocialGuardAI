import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Activity,
  Layers,
  Search,
  MessageSquare,
  Mail,
  ArrowUpRight,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  PieChart,
  BarChart3
} from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { RiskDistributionDonut, RiskTrendLineChart, TopIndicatorsBarChart } from '../components/Charts';
import Modal from '../components/Modal';
import ResultCard from '../components/ResultCard';

export default function DashboardPage({ onNavigate }) {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to load dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleViewDetail = async (id) => {
    setModalLoading(true);
    try {
      const data = await api.getHistoryDetail(id);
      setSelectedAnalysis(data.analysis);
    } catch (err) {
      console.error("Failed to fetch detail:", err);
    } finally {
      setModalLoading(false);
    }
  };

  if (loading && !stats) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-medium tracking-wide">Loading Security Intelligence...</p>
      </div>
    );
  }

  const { cards = {}, distribution = [], trend = [], top_indicators = [], recent_analyses = [] } = stats || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4" />
            <span>Threat Intelligence Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Welcome back, {user?.name || 'Analyst'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time telemetry and risk profiling for your scanned communications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchStats}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
            title="Refresh statistics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('analyze-message')}
            className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-linear-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-md shadow-cyan-500/20 transition cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
            New Scan
          </button>
        </div>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Analyses */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Scans</span>
            <Layers className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-mono">
            {cards.total || 0}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Total communications verified
          </p>
        </div>

        {/* Low Risk */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Low Risk</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-emerald-500 font-mono">
            {cards.low_risk || 0}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Standard or benign messages
          </p>
        </div>

        {/* Suspicious */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Suspicious</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-amber-500 font-mono">
            {cards.suspicious || 0}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Subtle pressure or cues
          </p>
        </div>

        {/* High Risk */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">High / Critical</span>
            <ShieldAlert className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-3xl font-black text-red-500 font-mono">
            {cards.high_risk || 0}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Confirmed scam tactics
          </p>
        </div>
      </div>

      {/* 3 Interactive Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Chart 1: Distribution */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <PieChart className="w-4 h-4 text-cyan-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Risk Distribution
              </h3>
            </div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              Category
            </span>
          </div>
          <RiskDistributionDonut data={distribution} />
        </div>

        {/* Chart 2: Trend Over Time */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Risk Trend Over Time
              </h3>
            </div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              Last 7 Days
            </span>
          </div>
          <RiskTrendLineChart data={trend} />
        </div>

        {/* Chart 3: Top Detected Indicators */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Frequent Indicators
              </h3>
            </div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              Top Scams
            </span>
          </div>
          <TopIndicatorsBarChart data={top_indicators} />
        </div>
      </div>

      {/* Recent Analyses Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Recent Threat Analyses
            </h3>
            <p className="text-xs text-slate-400">
              Latest items evaluated by SocialGuard AI.
            </p>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center"
          >
            View Full History
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>

        {recent_analyses.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No analyses recorded yet. Run a message or email scan to see results here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Type</th>
                  <th className="px-6 py-3.5">Classification</th>
                  <th className="px-6 py-3.5">Risk Score</th>
                  <th className="px-6 py-3.5">Key Indicators</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recent_analyses.map((item) => {
                  let badgeStyle = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
                  if (item.classification === 'Critical Risk') {
                    badgeStyle = 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
                  } else if (item.classification === 'High Risk') {
                    badgeStyle = 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
                  } else if (item.classification === 'Suspicious') {
                    badgeStyle = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
                  }

                  const formattedDate = item.created_at
                    ? new Date(item.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'N/A';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono">
                        {formattedDate}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 capitalize">
                          {item.content_type === 'email' ? <Mail className="w-3 h-3 mr-1 text-indigo-500" /> : <MessageSquare className="w-3 h-3 mr-1 text-cyan-500" />}
                          {item.content_type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeStyle}`}>
                          {item.classification}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">
                        {item.risk_score}%
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                        {item.indicator_names && item.indicator_names.length > 0
                          ? item.indicator_names.join(', ')
                          : 'None'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleViewDetail(item.id)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 transition"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Analysis Detail Modal */}
      <Modal
        isOpen={!!selectedAnalysis}
        onClose={() => setSelectedAnalysis(null)}
        title="Threat Analysis Inspection"
        maxWidth="max-w-3xl"
      >
        {selectedAnalysis && (
          <div className="space-y-6">
            {/* Original content snippet */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <span className="font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Scanned {selectedAnalysis.content_type}:
              </span>
              <p className="font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
                {selectedAnalysis.content}
              </p>
            </div>

            <ResultCard
              result={selectedAnalysis}
              onReset={() => setSelectedAnalysis(null)}
              onViewHistory={() => {
                setSelectedAnalysis(null);
                onNavigate('history');
              }}
              isSaved={true}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
