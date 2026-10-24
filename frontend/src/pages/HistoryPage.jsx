import React, { useState, useEffect } from 'react';
import {
  History,
  Search,
  Trash2,
  Filter,
  Mail,
  MessageSquare,
  AlertTriangle,
  RefreshCw,
  Eye,
  AlertCircle
} from 'lucide-react';
import { api } from '../api/client';
import Modal from '../components/Modal';
import ResultCard from '../components/ResultCard';
import { useToast } from '../components/Toast';

export default function HistoryPage({ onNavigate }) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [classificationFilter, setClassificationFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const { addToast } = useToast();

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const params = {};
      if (classificationFilter !== 'All') params.classification = classificationFilter;
      if (typeFilter !== 'All') params.type = typeFilter;
      if (search.trim()) params.search = search.trim();

      const data = await api.getHistory(params);
      setItems(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Failed to load history:", err);
      addToast("Failed to load analysis history", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [classificationFilter, typeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHistory();
  };

  const handleViewDetail = async (id) => {
    try {
      const data = await api.getHistoryDetail(id);
      setSelectedAnalysis(data.analysis);
    } catch (err) {
      addToast("Could not load details for this record", "error");
    }
  };

  const handleDeleteItem = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this scan record?")) return;

    setDeletingId(id);
    try {
      await api.deleteHistory(id);
      setItems(prev => prev.filter(item => item.id !== id));
      setTotal(prev => Math.max(0, prev - 1));
      addToast("Record deleted successfully", "success");
    } catch (err) {
      addToast(err.message || "Failed to delete record", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAll = async () => {
    try {
      await api.clearAllHistory();
      setItems([]);
      setTotal(0);
      setConfirmClearOpen(false);
      addToast("All history records cleared", "success");
    } catch (err) {
      addToast("Failed to clear history", "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Analysis History
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Review and audit previous message and email risk assessments ({total} total records).
            </p>
          </div>
        </div>

        {items.length > 0 && (
          <button
            onClick={() => setConfirmClearOpen(true)}
            className="inline-flex items-center px-3.5 py-2 text-xs font-semibold rounded-xl text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-900/50 transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Clear All History
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by keyword, subject, sender…"
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </form>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-start md:justify-end">
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400 font-medium">Risk Level:</span>
            <select
              value={classificationFilter}
              onChange={(e) => setClassificationFilter(e.target.value)}
              className="py-1.5 px-3 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="All">All Levels</option>
              <option value="Low Risk">Low Risk</option>
              <option value="Suspicious">Suspicious</option>
              <option value="High Risk">High Risk</option>
              <option value="Critical Risk">Critical Risk</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400 font-medium">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="py-1.5 px-3 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="All">All Types</option>
              <option value="message">Message</option>
              <option value="email">Email</option>
            </select>
          </div>

          <button
            onClick={fetchHistory}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
            title="Refresh history"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span className="text-xs text-slate-400">Loading history logs...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <History className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              No Analysis Records Found
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {search || classificationFilter !== 'All'
                ? "No scans match your current search and filter criteria."
                : "You haven't scanned any messages or emails while logged in yet."}
            </p>
            <button
              onClick={() => onNavigate('analyze-message')}
              className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow-xs"
            >
              Start New Analysis
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">Date & Time</th>
                  <th className="px-6 py-3.5">Channel</th>
                  <th className="px-6 py-3.5">Classification</th>
                  <th className="px-6 py-3.5">Risk Score</th>
                  <th className="px-6 py-3.5">Content Preview</th>
                  <th className="px-6 py-3.5">Detected Indicators</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {items.map((item) => {
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
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'N/A';

                  return (
                    <tr
                      key={item.id}
                      onClick={() => handleViewDetail(item.id)}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer"
                    >
                      <td className="px-6 py-4 font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {formattedDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 capitalize">
                          {item.content_type === 'email' ? <Mail className="w-3 h-3 mr-1 text-indigo-500" /> : <MessageSquare className="w-3 h-3 mr-1 text-cyan-500" />}
                          {item.content_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeStyle}`}>
                          {item.classification}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        {item.risk_score}%
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate text-slate-600 dark:text-slate-400">
                        {item.content_preview || item.subject || 'No preview'}
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 max-w-[200px] truncate">
                        {item.indicator_names && item.indicator_names.length > 0
                          ? item.indicator_names.join(', ')
                          : 'None'}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetail(item.id);
                            }}
                            className="p-1.5 rounded-lg text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 transition"
                            title="View Full Analysis"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteItem(item.id, e)}
                            disabled={deletingId === item.id}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition disabled:opacity-50"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedAnalysis}
        onClose={() => setSelectedAnalysis(null)}
        title="Threat Analysis Record Details"
        maxWidth="max-w-3xl"
      >
        {selectedAnalysis && (
          <div className="space-y-6">
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <span className="font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Full Scanned Content ({selectedAnalysis.content_type}):
              </span>
              <p className="font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                {selectedAnalysis.content}
              </p>
            </div>

            <ResultCard
              result={selectedAnalysis}
              onReset={() => setSelectedAnalysis(null)}
              isSaved={true}
            />
          </div>
        )}
      </Modal>

      {/* Confirm Clear All Modal */}
      <Modal
        isOpen={confirmClearOpen}
        onClose={() => setConfirmClearOpen(false)}
        title="Confirm History Reset"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>
              This will permanently delete all {total} scanned analysis records associated with your account.
              This action cannot be undone.
            </p>
          </div>
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              onClick={() => setConfirmClearOpen(false)}
              className="px-4 py-2 text-xs rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleClearAll}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-red-600 hover:bg-red-500 text-white shadow-xs"
            >
              Confirm & Clear All
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
