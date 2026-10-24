import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Lock,
  Shield,
  Activity,
  Calendar,
  Save,
  KeyRound,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export default function ProfilePage({ onNavigate }) {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();

  const [profileData, setProfileData] = useState(null);
  const [name, setName] = useState(user?.name || '');
  const [updatingName, setUpdatingName] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    api.getProfile()
      .then(data => {
        setProfileData(data);
        if (data.user?.name) setName(data.user.name);
      })
      .catch(err => console.error("Failed to load profile:", err));
  }, []);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setUpdatingName(true);
    try {
      const res = await api.updateProfile(name);
      updateUser(res.user);
      addToast("Profile information updated successfully", "success");
    } catch (err) {
      addToast(err.message || "Failed to update profile", "error");
    } finally {
      setUpdatingName(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    setPasswordError('');
    setUpdatingPassword(true);
    try {
      await api.changePassword(currentPassword, newPassword, confirmPassword);
      addToast("Password changed successfully", "success");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.message || "Failed to change password.");
      addToast(err.message || "Failed to change password", "error");
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Account Profile & Security
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Manage your personal credentials, preferences, and account telemetry.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Account Stats Card */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm text-center">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-linear-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-black mx-auto mb-4 shadow-md shadow-cyan-500/20">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
              {user?.name}
            </h3>
            <p className="text-xs text-slate-400 truncate mb-3">{user?.email}</p>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
              user?.role === 'admin'
                ? 'bg-red-500/10 text-red-500 border-red-500/30'
                : 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30'
            }`}>
              {user?.role === 'admin' ? 'Security Administrator' : 'Standard User'}
            </span>
          </div>

          {/* Account Statistics */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Account Statistics
            </h4>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 flex items-center">
                <Activity className="w-3.5 h-3.5 mr-2 text-cyan-500" />
                Total Analyses:
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {profileData?.stats?.total_analyses ?? 0}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 flex items-center">
                <Shield className="w-3.5 h-3.5 mr-2 text-red-500" />
                Scams Detected:
              </span>
              <span className="font-mono font-bold text-red-500">
                {profileData?.stats?.high_risk_detections ?? 0}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-2 text-indigo-500" />
                Member Since:
              </span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                {profileData?.stats?.member_since || 'Recently'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Columns: Edit Profile & Change Password */}
        <div className="md:col-span-2 space-y-6">
          {/* Edit Profile Form */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center">
              <User className="w-4 h-4 mr-2 text-cyan-500" />
              Edit Profile Information
            </h3>
            <form onSubmit={handleUpdateName} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Registered Email (Read-Only)
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-slate-500 cursor-not-allowed"
                />
              </div>

              <button
                type="submit"
                disabled={updatingName || name === user?.name}
                className="inline-flex items-center px-4 py-2 text-xs font-semibold rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white shadow-xs disabled:opacity-50 transition cursor-pointer"
              >
                <Save className="w-3.5 h-3.5 mr-1.5" />
                {updatingName ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center">
              <KeyRound className="w-4 h-4 mr-2 text-indigo-500" />
              Update Account Password
            </h3>

            {passwordError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={updatingPassword || !currentPassword || !newPassword}
                className="inline-flex items-center px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs disabled:opacity-50 transition cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 mr-1.5" />
                {updatingPassword ? 'Updating Password...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
