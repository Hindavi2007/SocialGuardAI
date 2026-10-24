import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MessageAnalyzerPage from './pages/MessageAnalyzerPage';
import EmailAnalyzerPage from './pages/EmailAnalyzerPage';
import HistoryPage from './pages/HistoryPage';
import SafetyTipsPage from './pages/SafetyTipsPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function AppContent() {
  const [currentRoute, setCurrentRoute] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'home';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setCurrentRoute(hash);
      } else {
        setCurrentRoute('home');
      }
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route) => {
    window.location.hash = route;
    setCurrentRoute(route);
    window.scrollTo(0, 0);
  };

  const renderCurrentPage = () => {
    switch (currentRoute) {
      case 'home':
        return <LandingPage onNavigate={navigateTo} />;
      case 'login':
        return <LoginPage onNavigate={navigateTo} />;
      case 'register':
        return <RegisterPage onNavigate={navigateTo} />;
      case 'analyze-message':
        return <MessageAnalyzerPage onNavigate={navigateTo} />;
      case 'analyze-email':
        return <EmailAnalyzerPage onNavigate={navigateTo} />;
      case 'safety-tips':
        return <SafetyTipsPage onNavigate={navigateTo} />;
      case 'dashboard':
        return (
          <ProtectedRoute onNavigate={navigateTo}>
            <DashboardPage onNavigate={navigateTo} />
          </ProtectedRoute>
        );
      case 'history':
        return (
          <ProtectedRoute onNavigate={navigateTo}>
            <HistoryPage onNavigate={navigateTo} />
          </ProtectedRoute>
        );
      case 'profile':
        return (
          <ProtectedRoute onNavigate={navigateTo}>
            <ProfilePage onNavigate={navigateTo} />
          </ProtectedRoute>
        );
      case 'admin':
        return (
          <ProtectedRoute requireAdmin onNavigate={navigateTo}>
            <AdminDashboardPage onNavigate={navigateTo} />
          </ProtectedRoute>
        );
      default:
        return <LandingPage onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar currentRoute={currentRoute} onNavigate={navigateTo} />
      <main className="flex-1 w-full">
        {renderCurrentPage()}
      </main>
      <Footer onNavigate={navigateTo} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
