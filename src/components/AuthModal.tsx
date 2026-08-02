import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { X, Lock, Key, ShieldCheck, UserPlus, LogIn, Sparkles, Building, Phone, Mail, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserLoggedIn: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onUserLoggedIn
}) => {
  const [tab, setTab] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Form State
  const [userId, setUserId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [pin, setPin] = useState<string>('');

  // Password / PIN Visibility toggles
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPin, setShowPin] = useState<boolean>(false);
  const [showRegPassword, setShowRegPassword] = useState<boolean>(false);

  // Register state
  const [regName, setRegName] = useState<string>('');
  const [regUserId, setRegUserId] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regCompany, setRegCompany] = useState<string>('');
  const [regRole, setRegRole] = useState<UserRole>('MERCHANT');

  // Feedback State
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPinInput, setShowPinInput] = useState<boolean>(false);

  if (!isOpen) return null;

  // Autofill Fixed Admin credentials for quick verification
  const handleAutofillAdmin = () => {
    setTab('LOGIN');
    setUserId('mtd006');
    setPassword('manoJ@123');
    setPin('100001');
    setShowPinInput(true);
    setErrorMsg(null);
  };

  // Submit Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password, pin })
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch (e) {
        data = { error: `Server response error (${res.status})` };
      }

      if (res.status === 403 && data.pinRequired) {
        setShowPinInput(true);
        setErrorMsg('Security PIN required for Admin login. Please enter your 6-digit Admin PIN.');
        setIsLoading(false);
        return;
      }

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Login failed. Please verify credentials.');
        setIsLoading(false);
        return;
      }

      setSuccessMsg(`Welcome back, ${data.user.name}!`);
      setTimeout(() => {
        onUserLoggedIn(data.user);
        onClose();
      }, 600);
    } catch (err: any) {
      setErrorMsg('Unable to connect to authentication service. Please check connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: regUserId,
          name: regName,
          email: regEmail,
          password: regPassword,
          phone: regPhone,
          companyName: regCompany,
          role: regRole
        })
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch (e) {
        data = { error: `Server response error (${res.status})` };
      }

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Registration failed.');
        setIsLoading(false);
        return;
      }

      setSuccessMsg('Account registered successfully! Logging you in...');
      setTimeout(() => {
        onUserLoggedIn(data.user);
        onClose();
      }, 700);
    } catch (err: any) {
      setErrorMsg('Unable to connect to registration service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-slate-100 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header & Close Button */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800/80 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif text-white">
                {tab === 'LOGIN' ? 'QC Portal Sign-In' : 'Create Merchant / Inspector Account'}
              </h2>
              <p className="text-xs text-slate-400">Secure access to diamond inspection dossiers & admin controls</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => {
              setTab('LOGIN');
              setErrorMsg(null);
            }}
            className={`py-2 rounded-lg flex items-center justify-center space-x-2 transition ${
              tab === 'LOGIN'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In / Admin Login</span>
          </button>

          <button
            onClick={() => {
              setTab('REGISTER');
              setErrorMsg(null);
            }}
            className={`py-2 rounded-lg flex items-center justify-center space-x-2 transition ${
              tab === 'REGISTER'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register Account</span>
          </button>
        </div>

        {/* Alert Messages */}
        {errorMsg && (
          <div className="bg-rose-950/80 border border-rose-800 text-rose-300 p-3 rounded-xl text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-300 p-3 rounded-xl text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab 1: LOGIN FORM */}
        {tab === 'LOGIN' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                User ID / Email Address <span className="text-cyan-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. User ID or email@domain.com"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Password <span className="text-cyan-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3.5 pr-10 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* PIN Field */}
            {(showPinInput || userId.trim() === 'mtd006') && (
              <div className="p-3 bg-slate-950 rounded-xl border border-cyan-800/80 space-y-1">
                <label className="block text-cyan-300 font-semibold flex items-center space-x-1.5">
                  <Key className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Admin Security PIN</span>
                </label>
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    maxLength={6}
                    placeholder="Enter 6-digit PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-3 pr-10 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono text-center tracking-widest text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition"
                    title={showPin ? 'Hide PIN' : 'Show PIN'}
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg transition active:scale-95 flex items-center justify-center space-x-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{isLoading ? 'Authenticating Credentials...' : 'Sign In to Portal'}</span>
            </button>
          </form>
        ) : (
          /* Tab 2: REGISTER FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Full Name <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Manoj Dhopat"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Desired User ID <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. merchant_001"
                  value={regUserId}
                  onChange={(e) => setRegUserId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Email Address <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. user@company.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Password <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-9 py-2 text-slate-100 font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition"
                    title={showRegPassword ? 'Hide password' : 'Show password'}
                  >
                    {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Company / Jeweler Name</label>
                <input
                  type="text"
                  placeholder="e.g. Apex Diamond Vault"
                  value={regCompany}
                  onChange={(e) => setRegCompany(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Role / Account Type</label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as UserRole)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="MERCHANT">Diamond Merchant / Jeweler</option>
                  <option value="GEMOLOGIST">Independent Gemologist</option>
                  <option value="INSPECTOR">Quality Inspector</option>
                  <option value="BUYER">Retail Buyer / Investor</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg transition active:scale-95 flex items-center justify-center space-x-2 mt-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isLoading ? 'Creating Account...' : 'Complete User Registration'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
