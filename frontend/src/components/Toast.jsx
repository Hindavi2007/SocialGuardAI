import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map(toast => {
          let bg = 'bg-slate-900 border-slate-700 text-white';
          let icon = <Info className="w-4 h-4 text-cyan-400 shrink-0" />;

          if (toast.type === 'success') {
            bg = 'bg-emerald-950/95 border-emerald-700 text-emerald-100';
            icon = <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />;
          } else if (toast.type === 'error') {
            bg = 'bg-red-950/95 border-red-700 text-red-100';
            icon = <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />;
          } else if (toast.type === 'warning') {
            bg = 'bg-amber-950/95 border-amber-700 text-amber-100';
            icon = <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl border shadow-xl backdrop-blur-md text-xs font-medium transition-all transform duration-300 animate-in fade-in slide-in-from-bottom-2 ${bg}`}
            >
              <div className="flex items-center space-x-2.5">
                {icon}
                <span>{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-3 p-1 rounded-md opacity-70 hover:opacity-100 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
