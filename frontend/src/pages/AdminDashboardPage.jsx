import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Users,
  Activity,
  Layers,
  Lock,
  RefreshCw,
  Search,
  CheckCircle2,
  PieChart,
  BarChart3,
  TrendingUp,
  Sliders,
  FileSpreadsheet
} from 'lucide-react';
import { api } from '../api/client';
import { RiskDistributionDonut, TopIndicatorsBarChart } from '../components/Charts';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export default function AdminDashboardPage({ onNavigate }) {
  const { user, isAdmin } = useAuth();
  const { addToast } = useToast();

  const [adminStats, setAdminStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' or 'users'

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsData, usersData] = await Promise.all([
        api.getAdminStats(),
        api.getAdminUsers()
      ]);
      setAdminStats(statsData);
      setUsersList(usersData.users || []);
    } catch (err) {
      console.error("Admin fetch error:", err);
      addToast(err.message || "Admin authorization required", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mb-4">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
          Access Restricted
        </h2>
        <p className="text-xs text-slate-400 max-w-sm mb-4">
          This portal requires administrative credentials. Please log in with an authorized administrator account.
        </p>
        <button
          onClick={() => onNavigate('login')}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow-xs"
        >
          Switch Account
        </button>
      </div>
    );
  }

  const { cards = {}, distribution = [], daily_volume = [], top_indicators = [] } = adminStats || {};

  const filteredUsers = usersList.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors">
      {/* Admin Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-red-500 uppercase tracking-wider mb-1">
            <Lock className="w-4 h-4" />
            <span>Master Administration Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            System Security Operations Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            System-wide attack intelligence, user accounts, and classifier activity logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'overview'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'users'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Users Directory ({usersList.length})
          </button>
          <button
            onClick={fetchAdminData}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition ml-2"
            title="Refresh Admin Data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-2">
          <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-400">Aggregating system logs...</span>
        </div>
      ) : activeTab === 'overview' ? (
        <div className="space-y-8">
          {/* Admin KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Total Users
              </span>
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                {cards.total_users || 0}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Total Analyses
              </span>
              <span className="text-2xl font-black text-cyan-500 font-mono">
                {cards.total_analyses || 0}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                High / Critical Detections
              </span>
              <span className="text-2xl font-black text-red-500 font-mono">
                {cards.high_risk || 0}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Suspicious Cues
              </span>
              <span className="text-2xl font-black text-amber-500 font-mono">
                {cards.suspicious || 0}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs col-span-2 lg:col-span-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Low Risk Benign
              </span>
              <span className="text-2xl font-black text-emerald-500 font-mono">
                {cards.low_risk || 0}
              </span>
            </div>
          </div>

          {/* Admin Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                <PieChart className="w-4 h-4 mr-2 text-cyan-500" />
                Global Threat Classification Breakdown
              </h3>
              <RiskDistributionDonut data={distribution} />
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                <BarChart3 className="w-4 h-4 mr-2 text-indigo-500" />
                System-Wide Social Engineering Indicators
              </h3>
              <TopIndicatorsBarChart data={top_indicators} />
            </div>
          </div>

          {/* System Health Status Panel */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  ML Inference Engine & Safe Parser: Online
                </span>
                <span className="text-[11px] text-slate-400">
                  Model: Scikit-learn TF-IDF Calibrated Classifier • Zero-visit untrusted URL sandbox
                </span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              Optimal Health
            </span>
          </div>
        </div>
      ) : (
        /* Users Directory Tab */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search user by name or email…"
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <span className="text-xs text-slate-400 whitespace-nowrap">
              Showing {filteredUsers.length} of {usersList.length} users
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">User</th>
                  <th className="px-6 py-3.5">Email</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Total Analyses</th>
                  <th className="px-6 py-3.5">Last Activity</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.map((u) => {
                  const lastAct = u.last_activity && u.last_activity !== "No activity yet"
                    ? new Date(u.last_activity).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : "No scans yet";

                  return (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white flex items-center space-x-2.5">
                        <div className="w-7 h-7 rounded-lg bg-linear-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{u.name}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono">
                        {u.email}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          u.role === 'admin'
                            ? 'bg-red-500/10 text-red-500 border-red-500/30'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">
                        {u.total_analyses}
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono">
                        {lastAct}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center text-emerald-500 font-medium text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          {u.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
