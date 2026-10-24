import React from 'react';
import { Shield, Cpu, ShieldCheck, Heart, Lock, AlertCircle } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="w-full bg-slate-900 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-linear-to-tr from-cyan-600 to-indigo-600 text-white">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                SocialGuard<span className="text-cyan-400">AI</span>
              </span>
            </div>
            <p className="text-slate-400 max-w-md text-xs leading-relaxed">
              “Detect. Understand. Stay Safe.” An AI-powered system that analyzes messages and emails
              for social engineering risks and explains suspicious patterns.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-slate-500">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Zero external link visitation • Safe offline parsing • Privacy focused</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              Detection Tools
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('analyze-message')}
                  className="hover:text-cyan-400 transition"
                >
                  Analyze Message / SMS
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('analyze-email')}
                  className="hover:text-cyan-400 transition"
                >
                  Analyze Phishing Email
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('safety-tips')}
                  className="hover:text-cyan-400 transition"
                >
                  Cyber Safety Guidelines
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-cyan-400 transition"
                >
                  Threat Intelligence Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Legal / Ethics Disclaimer */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              Safety Advisory
            </h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              SocialGuard AI delivers probabilistic risk estimates using machine learning and heuristic pattern rules.
              It does not provide guaranteed immunity. When in doubt, contact official organizations directly.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-4">
          <div>
            © {new Date().getFullYear()} SocialGuard AI. All rights reserved.
          </div>
          <div className="flex items-center space-x-4">
            <span>Built for Modern Cyber Defense</span>
            <span>•</span>
            <span>Machine Learning & NLP Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
