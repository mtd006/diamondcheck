import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { X, History, CreditCard, ShieldCheck, FileCheck, Search, Sparkles, ExternalLink, RefreshCw, Calendar, DollarSign, Award, Lock } from 'lucide-react';

interface UserHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
}

export const UserHistoryModal: React.FC<UserHistoryModalProps> = ({
  isOpen,
  onClose,
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState<'INSPECTIONS' | 'PAYMENTS'>('INSPECTIONS');
  const [inspections, setInspections] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const userId = currentUser?.userId || 'mtd006';

  const loadHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/user/history?userId=${encodeURIComponent(userId)}`);
      const data = await res.json();
      if (data.success) {
        setInspections(data.inspections || []);
        setPayments(data.payments || []);
      }
    } catch (e) {
      console.error('Failed to load user history:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const filteredInspections = inspections.filter(
    (i) =>
      i.certNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.lab?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.verdict?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.hash?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPayments = payments.filter(
    (p) =>
      p.ref?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.token?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.method?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-950/50">
              <History className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold font-serif text-white">My Client Activity & History</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono font-bold">
                  {userId}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                View past diamond inspection records, verification logs, and payment receipts
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={loadHistory}
              disabled={loading}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition text-xs font-semibold flex items-center space-x-1.5"
            >
              <RefreshCw className={`w-4 h-4 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Overview Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center space-x-1">
              <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Total Inspections</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white">{inspections.length}</div>
            <div className="text-[10px] text-cyan-400">Verified Diamond Dossiers</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center space-x-1">
              <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
              <span>Payments Conducted</span>
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-400">{payments.length}</div>
            <div className="text-[10px] text-emerald-400">$5.00 / 30-Min Token</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1 col-span-2 sm:col-span-1">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center space-x-1">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Avg Match Score</span>
            </div>
            <div className="text-2xl font-bold font-mono text-amber-300">
              {inspections.length > 0
                ? Math.round(inspections.reduce((a, b) => a + (b.matchScore || 95), 0) / inspections.length) + '%'
                : '96%'}
            </div>
            <div className="text-[10px] text-slate-400">Multi-Angle Vision QC</div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('INSPECTIONS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              activeTab === 'INSPECTIONS'
                ? 'bg-cyan-600 text-white shadow-lg'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Inspection Records ({inspections.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('PAYMENTS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              activeTab === 'PAYMENTS'
                ? 'bg-cyan-600 text-white shadow-lg'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Payment History ({payments.length})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={
              activeTab === 'INSPECTIONS'
                ? 'Filter inspections by Cert #, Lab (GIA/IGI), or Verdict...'
                : 'Filter payments by Payment Ref ID or Method...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* TAB 1: INSPECTION RECORDS */}
        {activeTab === 'INSPECTIONS' && (
          <div className="space-y-3">
            {filteredInspections.length === 0 ? (
              <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <FileCheck className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">No inspection history records found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Certificate #</th>
                      <th className="py-3 px-4">Lab / Spec</th>
                      <th className="py-3 px-4">Verdict</th>
                      <th className="py-3 px-4">Match Score</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 text-right">Watermark Hash</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredInspections.map((i) => (
                      <tr key={i.id} className="hover:bg-slate-900/50">
                        <td className="py-3 px-4 font-mono font-bold text-cyan-300">
                          {i.certNumber}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-200">
                          {i.lab} {i.caratWeight ? `(${i.caratWeight} ct ${i.shape || ''})` : ''}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                            {i.verdict}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-emerald-400 font-mono">
                          {i.matchScore}%
                        </td>
                        <td className="py-3 px-4 text-slate-400 text-[11px] font-mono">
                          {new Date(i.date).toLocaleDateString()} {new Date(i.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-[10px] text-slate-400">
                          {i.hash}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PAYMENT HISTORY */}
        {activeTab === 'PAYMENTS' && (
          <div className="space-y-3">
            {filteredPayments.length === 0 ? (
              <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <CreditCard className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">No payment transaction records found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Payment Ref</th>
                      <th className="py-3 px-4">Gateway Method</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Issued Token</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-900/50">
                        <td className="py-3 px-4 font-mono font-bold text-slate-200">
                          {p.ref}
                        </td>
                        <td className="py-3 px-4 font-semibold text-cyan-300">
                          {p.method}
                        </td>
                        <td className="py-3 px-4 font-bold text-emerald-400 font-mono">
                          ${p.amount?.toFixed(2) || '5.00'} {p.currency || 'USD'}
                        </td>
                        <td className="py-3 px-4 font-mono text-cyan-400 font-bold">
                          {p.token}
                        </td>
                        <td className="py-3 px-4 text-slate-400 text-[11px] font-mono">
                          {new Date(p.date).toLocaleDateString()} {new Date(p.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                            {p.status || 'COMPLETED'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
