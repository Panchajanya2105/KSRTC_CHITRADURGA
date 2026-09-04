import React from 'react';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'info' | 'warning';
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info' }) => {
  if (!message) return null;

  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    info: <Info className="w-5 h-5 text-sky-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900/95 text-white dark:bg-slate-800/95 rounded-xl shadow-2xl border border-slate-700/60 backdrop-blur-md animate-bounce">
      {iconMap[type]}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};
