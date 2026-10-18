'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { CheckCircle, Info, AlertTriangle, AlertCircle, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, dismissToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let bg = 'bg-vestora-jet text-white border-vestora-charcoal';
        let icon = <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />;

        if (toast.type === 'info') {
          bg = 'bg-[#1C2430] text-white border-blue-900';
          icon = <Info className="w-4 h-4 text-sky-400 flex-shrink-0" />;
        } else if (toast.type === 'warning') {
          bg = 'bg-[#2B2317] text-[#FEF3C7] border-amber-900';
          icon = <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />;
        } else if (toast.type === 'error') {
          bg = 'bg-[#2E1A1A] text-[#FEE2E2] border-red-900';
          icon = <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-lg shadow-float border ${bg} transition-all duration-300 animate-in slide-in-from-top-2`}
          >
            <div className="flex items-center space-x-3 text-xs leading-snug">
              {icon}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="ml-3 p-1 text-vestora-taupe hover:text-white transition"
              aria-label="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
