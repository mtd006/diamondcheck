import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle, ShieldCheck, RefreshCw, Key } from 'lucide-react';
import { SessionData } from '../types';

interface SessionTimerBarProps {
  session: SessionData | null;
  onExpire: () => void;
  onRenew: () => void;
}

export const SessionTimerBar: React.FC<SessionTimerBarProps> = ({
  session,
  onExpire,
  onRenew
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(1800); // 30 minutes default

  useEffect(() => {
    if (!session) return;

    const calcRemaining = () => {
      const now = Date.now();
      const diff = Math.floor((session.expiresAt - now) / 1000);
      if (diff <= 0) {
        setSecondsLeft(0);
        onExpire();
      } else {
        setSecondsLeft(diff);
      }
    };

    calcRemaining();
    const interval = setInterval(calcRemaining, 1000);
    return () => clearInterval(interval);
  }, [session, onExpire]);

  if (!session) {
    return (
      <div className="bg-amber-950/60 border-b border-amber-800/80 text-amber-200 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Demo Session Mode:</strong> Unlocked for preview. To enable time-stamped official verification, acquire an active 30-minute session token.
            </span>
          </div>
          <button
            onClick={onRenew}
            className="underline hover:text-amber-100 font-semibold text-xs ml-auto"
          >
            Activate 30-Min Token ($5)
          </button>
        </div>
      </div>
    );
  }

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const isUrgent = secondsLeft < 300; // < 5 mins
  const progressPercent = Math.max(0, Math.min(100, (secondsLeft / 1800) * 100));

  return (
    <div
      className={`border-b text-xs py-2.5 px-4 transition-colors ${
        isUrgent
          ? 'bg-rose-950/90 border-rose-800 text-rose-200 animate-pulse'
          : 'bg-slate-900 border-slate-800 text-slate-200'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 font-mono text-sm font-bold bg-slate-950 px-3 py-1 rounded border border-slate-700/80">
            <Clock className={`w-4 h-4 ${isUrgent ? 'text-rose-400' : 'text-cyan-400'} animate-spin`} />
            <span className={isUrgent ? 'text-rose-400' : 'text-cyan-300'}>
              {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </span>
          </div>

          <div>
            <span className="font-semibold text-slate-100">30-Min Time-Limited QC Session Active</span>
            <span className="hidden sm:inline text-slate-400 ml-2">
              Token: <code className="text-cyan-400 bg-slate-950 px-1.5 py-0.5 rounded text-[11px] font-mono">{session.token}</code>
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="hidden md:flex items-center space-x-2 flex-1 max-w-xs mx-4">
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                isUrgent ? 'bg-rose-500' : 'bg-gradient-to-r from-cyan-500 to-emerald-400'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-400 font-mono">{Math.round(progressPercent)}%</span>
        </div>

        <div className="flex items-center space-x-2">
          {isUrgent && (
            <span className="text-[11px] font-bold text-rose-300 flex items-center">
              <AlertTriangle className="w-3.5 h-3.5 mr-1 text-rose-400" />
              Expiring Soon!
            </span>
          )}
          <button
            onClick={onRenew}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs transition"
          >
            <RefreshCw className="w-3 h-3 text-cyan-400" />
            <span>Extend / Renew Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};
