import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requireAdmin = false, onNavigate }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-2">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-slate-400">Authenticating session...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Authentication Required
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-4">
          Please log in to your SocialGuard AI account to access this page.
        </p>
        <button
          onClick={() => onNavigate('login')}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white shadow-xs"
        >
          Sign In
        </button>
      </div>
    );
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-red-500 mb-2">
          Admin Access Required
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-4">
          This section is restricted to administrative personnel.
        </p>
        <button
          onClick={() => onNavigate('dashboard')}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-white hover:bg-slate-700"
        >
          Return to User Dashboard
        </button>
      </div>
    );
  }

  return children;
}
