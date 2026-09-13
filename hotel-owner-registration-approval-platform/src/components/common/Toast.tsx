import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage, toastType } = useApp();

  if (!toastMessage) return null;

  const bgStyles = {
    success: 'bg-emerald-900/90 text-emerald-100 border-emerald-700/50',
    error: 'bg-rose-900/90 text-rose-100 border-rose-700/50',
    info: 'bg-slate-900/90 text-slate-100 border-slate-700/50',
  }[toastType];

  const Icon = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
  }[toastType];

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-bounce-short shadow-2xl">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md ${bgStyles}`}>
        <Icon className="w-5 h-5 shrink-0" />
        <p className="text-sm font-medium pr-2 leading-snug">{toastMessage}</p>
      </div>
    </div>
  );
};
