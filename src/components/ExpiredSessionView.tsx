import React from 'react';
import { Clock, ShieldAlert, RefreshCw, Key, CreditCard, Sparkles } from 'lucide-react';

interface ExpiredSessionViewProps {
  onRenew: () => void;
  onOpenPayment: () => void;
}

export const ExpiredSessionView: React.FC<ExpiredSessionViewProps> = ({
  onRenew,
  onOpenPayment
}) => {
  return (
    <div className="max-w-2xl mx-auto my-12 bg-slate-900 border border-rose-900/60 rounded-3xl p-8 sm:p-10 text-center space-y-6 shadow-2xl relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Expired Shield Icon */}
      <div className="w-20 h-20 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-400 mx-auto flex items-center justify-center shadow-xl shadow-rose-950/40">
        <Clock className="w-10 h-10 animate-pulse" />
      </div>

      <div className="space-y-2">
        <span className="px-3 py-1 rounded-full bg-rose-950 text-rose-300 border border-rose-800 text-xs font-mono font-semibold uppercase tracking-wider">
          Security Alert: Time Limit Reached
        </span>
        <h2 className="text-2xl font-bold font-serif text-white">30-Minute Session Link Expired</h2>
        <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
          For merchant security, anti-fraud compliance, and privacy protection, "2nd View" QC inspection sessions automatically expire 30 minutes post-activation.
        </p>
      </div>

      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 max-w-lg mx-auto text-left space-y-2">
        <div className="font-semibold text-slate-200 flex items-center space-x-1.5">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>Why do QC session links auto-expire?</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-400">
          <li>Prevents unauthorized link sharing of high-value diamond inspection dossiers.</li>
          <li>Ensures time-stamped proof of diamond physical condition at moment of transfer.</li>
          <li>Protects merchant report watermarks from unauthorized post-transaction alteration.</li>
        </ul>
      </div>

      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onRenew}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg transition active:scale-95 flex items-center justify-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Activate New 30-Min Demo Session</span>
        </button>

        <button
          onClick={onOpenPayment}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs border border-slate-700 transition active:scale-95 flex items-center justify-center space-x-2"
        >
          <CreditCard className="w-4 h-4 text-cyan-400" />
          <span>Acquire $5 Merchant Access Token</span>
        </button>
      </div>
    </div>
  );
};
