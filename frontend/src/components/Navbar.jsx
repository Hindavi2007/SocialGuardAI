import React, { useState } from 'react';
import {
  ShieldCheck,
  Cpu,
  Sun,
  Moon,
  Menu,
  X,
  User,
  LogOut,
  Sparkles,
  Mail,
  MessageSquare,
  LayoutDashboard,
  History,
  Shield,
  BookOpen,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ currentRoute, onNavigate }) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleNav = (route) => {
    onNavigate(route);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    handleNav('home');
  };

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => handleNav('home')}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-tr from-cyan-600 via-indigo-600 to-cyan-500 text-white shadow-md shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
              <Shield className="w-5 h-5" />
              <Cpu className="w-2.5 h-2.5 absolute text-cyan-200 animate-pulse" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight bg-linear-to-r from-cyan-600 via-indigo-600 to-cyan-500 dark:from-cyan-400 dark:to-indigo-300 bg-clip-text text-transparent">
                SocialGuard<span className="text-cyan-500">AI</span>
              </span>
              <span className="hidden sm:block text-[9px] uppercase tracking-widest text-slate-400 font-semibold leading-none">
                Risk Analysis System
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => handleNav('home')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentRoute === 'home'
                  ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/50'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNav('analyze-message')}
              className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentRoute === 'analyze-message'
                  ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/50'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
              Analyze Message
            </button>

            <button
              onClick={() => handleNav('analyze-email')}
              className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentRoute === 'analyze-email'
                  ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/50'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5 mr-1.5" />
              Analyze Email
            </button>

            <button
              onClick={() => handleNav('safety-tips')}
              className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentRoute === 'safety-tips'
                  ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/50'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 mr-1.5" />
              Safety Tips
            </button>

            {isAuthenticated && (
              <>
                <button
                  onClick={() => handleNav('dashboard')}
                  className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    currentRoute === 'dashboard'
                      ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/50'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 mr-1.5" />
                  Dashboard
                </button>

                <button
                  onClick={() => handleNav('history')}
                  className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    currentRoute === 'history'
                      ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/50'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <History className="w-3.5 h-3.5 mr-1.5" />
                  History
                </button>

                {isAdmin && (
                  <button
                    onClick={() => handleNav('admin')}
                    className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      currentRoute === 'admin'
                        ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50'
                        : 'text-slate-600 dark:text-slate-300 hover:text-red-500'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5 mr-1.5 text-red-500" />
                    Admin
                  </button>
                )}
              </>
            )}
          </div>

          {/* Right Controls: Theme Toggle + Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Prominent Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
              title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 shadow-2xs transition cursor-pointer"
            >
              {isDark ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Light</span>
                </>
              )}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <div className="w-7 h-7 rounded-lg bg-linear-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-200 max-w-[90px] truncate">
                    {user?.name}
                  </span>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1 z-50 text-xs animate-in fade-in">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="font-semibold text-slate-900 dark:text-white truncate">{user?.name}</p>
                      <p className="text-slate-400 text-[10px] truncate">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => handleNav('profile')}
                      className="w-full text-left px-3 py-2 flex items-center text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                    >
                      <User className="w-3.5 h-3.5 mr-2 text-cyan-500" />
                      Account Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 flex items-center text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition border-t border-slate-100 dark:border-slate-800"
                    >
                      <LogOut className="w-3.5 h-3.5 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleNav('login')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-cyan-500 dark:hover:text-cyan-400 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-linear-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-xs shadow-cyan-500/20 transition"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 px-4 pt-2 pb-6 space-y-2 backdrop-blur-lg">
          <button
            onClick={() => handleNav('home')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            Home
          </button>
          <button
            onClick={() => handleNav('analyze-message')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center"
          >
            <MessageSquare className="w-4 h-4 mr-2 text-cyan-500" />
            Analyze Message
          </button>
          <button
            onClick={() => handleNav('analyze-email')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center"
          >
            <Mail className="w-4 h-4 mr-2 text-indigo-500" />
            Analyze Email
          </button>
          <button
            onClick={() => handleNav('safety-tips')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center"
          >
            <BookOpen className="w-4 h-4 mr-2 text-amber-500" />
            Safety Tips
          </button>

          {/* Explicit Mobile Theme Switcher */}
          <div className="pt-2 pb-1 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={toggleTheme}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 transition"
            >
              <span className="flex items-center">
                {isDark ? (
                  <Moon className="w-4 h-4 text-cyan-400 mr-2" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-500 mr-2" />
                )}
                <span>Theme: <strong className="text-cyan-600 dark:text-cyan-400">{isDark ? 'Dark Mode' : 'Light Mode'}</strong></span>
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                Switch to {isDark ? 'Light' : 'Dark'}
              </span>
            </button>
          </div>

          {isAuthenticated ? (
            <>
              <button
                onClick={() => handleNav('dashboard')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center"
              >
                <LayoutDashboard className="w-4 h-4 mr-2 text-cyan-500" />
                Dashboard
              </button>
              <button
                onClick={() => handleNav('history')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center"
              >
                <History className="w-4 h-4 mr-2 text-emerald-500" />
                Analysis History
              </button>
              <button
                onClick={() => handleNav('profile')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center"
              >
                <User className="w-4 h-4 mr-2 text-cyan-500" />
                Profile ({user?.name})
              </button>
              {isAdmin && (
                <button
                  onClick={() => handleNav('admin')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center"
                >
                  <Lock className="w-4 h-4 mr-2 text-red-500" />
                  Admin Console
                </button>
              )}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col space-y-2">
              <button
                onClick={() => handleNav('login')}
                className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                Sign In
              </button>
              <button
                onClick={() => handleNav('register')}
                className="w-full py-2.5 rounded-xl bg-linear-to-r from-cyan-600 to-indigo-600 text-center text-sm font-semibold text-white shadow-xs"
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
