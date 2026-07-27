import React from 'react';
import { Diamond, ShieldCheck, Clock, CreditCard, Sparkles, FileSearch, Lock, User as UserIcon, LogOut, ShieldAlert } from 'lucide-react';
import { SessionData, User } from '../types';

interface HeaderProps {
  session: SessionData | null;
  currentUser: User | null;
  onOpenPayment: () => void;
  onOpenAuth: () => void;
  onOpenAdminDashboard: () => void;
  onLogout: () => void;
  onSelectSampleCert: (certNo: string) => void;
  currency: string;
  setCurrency: (curr: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  session,
  currentUser,
  onOpenPayment,
  onOpenAuth,
  onOpenAdminDashboard,
  onLogout,
  onSelectSampleCert,
  currency,
  setCurrency
}) => {
  const isAdmin = currentUser?.userId === 'mtd006' || currentUser?.role === 'ADMIN';

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-500 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Diamond className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-white font-serif">
                Diamond Check <span className="text-cyan-400 font-sans text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60 ml-1">AI QC Portal</span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400 inline" />
              <span>GIA / IGI Diamond Quality Control & Certificate Audit</span>
            </p>
          </div>
        </div>

        {/* Preset Sample Quick Cert Buttons */}
        <div className="hidden lg:flex items-center space-x-2 bg-slate-950/70 p-1.5 rounded-lg border border-slate-800/80 text-xs text-slate-300">
          <span className="text-slate-400 font-medium px-2 flex items-center">
            <FileSearch className="w-3.5 h-3.5 mr-1 text-cyan-400" /> Demo Certs:
          </span>
          <button
            onClick={() => onSelectSampleCert('5213456789')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-900/40 hover:text-cyan-300 transition text-slate-200 border border-slate-700/60"
            title="GIA 5213456789 - 1.50ct D VVS1 Round"
          >
            GIA #5213456789 (1.50ct D)
          </button>
          <button
            onClick={() => onSelectSampleCert('2221948572')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-900/40 hover:text-cyan-300 transition text-slate-200 border border-slate-700/60"
            title="GIA 2221948572 - 2.01ct E VS2 Round"
          >
            GIA #2221948572 (2.01ct E)
          </button>
          <button
            onClick={() => onSelectSampleCert('6382940123')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-900/40 hover:text-cyan-300 transition text-slate-200 border border-slate-700/60"
            title="IGI 6382940123 - 1.05ct F IF Princess"
          >
            IGI #6382940123 (1.05ct F)
          </button>
        </div>

        {/* User Auth, Admin Dashboard, & Currency Switcher */}
        <div className="flex items-center space-x-3">
          {/* Currency Switcher */}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-cyan-500 outline-none"
          >
            <option value="USD">$ USD</option>
            <option value="EUR">€ EUR</option>
            <option value="INR">₹ INR</option>
            <option value="GBP">£ GBP</option>
          </select>

          {/* User Profile / Admin Controls */}
          {currentUser ? (
            <div className="flex items-center space-x-2">
              {/* Admin Button if Admin mtd006 */}
              {isAdmin && (
                <button
                  onClick={onOpenAdminDashboard}
                  className="px-3 py-1.5 rounded-lg bg-cyan-950 border border-cyan-700 hover:bg-cyan-900 text-cyan-300 text-xs font-bold transition flex items-center space-x-1.5 shadow"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Admin Control</span>
                </button>
              )}

              {/* User Badge & My History Trigger */}
              <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs cursor-pointer hover:border-cyan-700 transition" onClick={onOpenAuth}>
                <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
                <div className="flex flex-col text-left">
                  <span className="font-bold text-slate-200 leading-none">{currentUser.name}</span>
                  <span className="text-[10px] text-cyan-400 font-mono leading-tight">{currentUser.userId} ({currentUser.role})</span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs px-3.5 py-1.5 rounded-lg border border-slate-700 transition"
            >
              <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>Login / Register (mtd006)</span>
            </button>
          )}

          {/* Session Token Status or Payment Button */}
          {session ? (
            <div className="flex items-center space-x-2 bg-emerald-950/80 border border-emerald-800/80 px-3 py-1.5 rounded-lg text-emerald-300 text-xs">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <div className="flex flex-col text-left">
                <span className="font-semibold tracking-wider">QC Token Active</span>
                <span className="text-[10px] text-emerald-400 font-mono">{session.token}</span>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenPayment}
              className="flex items-center space-x-2 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-medium text-xs px-4 py-2 rounded-lg shadow-lg shadow-cyan-900/30 transition transform active:scale-95"
            >
              <CreditCard className="w-4 h-4" />
              <span>Get Access Token ($5)</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

