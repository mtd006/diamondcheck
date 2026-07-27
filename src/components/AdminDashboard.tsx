import React, { useState, useEffect } from 'react';
import { User, SessionData } from '../types';
import {
  X, ShieldCheck, Users, Clock, DollarSign, Activity, RefreshCw, Key, Plus,
  CheckCircle2, AlertTriangle, Search, Lock, Award, Sparkles, UserPlus, Trash2,
  Building2, CreditCard, PieChart, TrendingUp, BarChart2, ShieldAlert
} from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState<'ANALYTICS' | 'USERS' | 'INSPECTIONS' | 'SESSIONS'>('ANALYTICS');
  const [usersList, setUsersList] = useState<User[]>([]);
  const [sessionsList, setSessionsList] = useState<SessionData[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notice, setNotice] = useState<string | null>(null);

  // New User Form State
  const [showAddUserModal, setShowAddUserModal] = useState<boolean>(false);
  const [newUserForm, setNewUserForm] = useState({
    userId: '',
    name: '',
    email: '',
    password: '',
    role: 'MERCHANT' as any,
    companyName: '',
    phone: '',
    pin: ''
  });

  // Load Admin Data
  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [uRes, sRes, stRes, anRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/sessions'),
        fetch('/api/admin/stats'),
        fetch('/api/admin/analytics')
      ]);

      const uData = await uRes.json();
      const sData = await sRes.json();
      const stData = await stRes.json();
      const anData = await anRes.json();

      if (uData.users) setUsersList(uData.users);
      if (sData.sessions) setSessionsList(sData.sessions);
      if (stData.stats) setStats(stData.stats);
      if (anData.analytics) setAnalyticsData(anData.analytics);
    } catch (e) {
      console.error('Failed to load admin dashboard data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadAdminData();
    }
  }, [isOpen]);

  // Handle Extend Session
  const handleExtendSession = async (token: string) => {
    try {
      const res = await fetch('/api/admin/sessions/extend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, additionalMinutes: 30 })
      });
      const data = await res.json();
      if (data.success) {
        setNotice(`Session ${token} extended by +30 minutes.`);
        loadAdminData();
        setTimeout(() => setNotice(null), 3000);
      }
    } catch (e) {
      console.error('Failed to extend session:', e);
    }
  };

  // Handle Generate New Merchant Session Token ($5)
  const handleGenerateMerchantToken = async () => {
    try {
      const res = await fetch('/api/sessions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod: 'ZOHO',
          paymentRef: 'ADMIN_GRANT_' + Date.now(),
          amount: 5.00,
          currency: 'USD',
          userId: currentUser?.userId || 'mtd006',
          userName: currentUser?.name || 'Manoj Dhopat (Admin)'
        })
      });
      const data = await res.json();
      if (data.success) {
        setNotice(`New $5.00 QC Session Token Generated: ${data.session.token}`);
        loadAdminData();
        setTimeout(() => setNotice(null), 4000);
      }
    } catch (e) {
      console.error('Failed to generate token:', e);
    }
  };

  // Handle Add New User
  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUserForm)
      });
      const data = await res.json();
      if (data.success) {
        setNotice(`User Account '${newUserForm.userId}' Provisioned Successfully!`);
        setShowAddUserModal(false);
        setNewUserForm({
          userId: '',
          name: '',
          email: '',
          password: '',
          role: 'MERCHANT',
          companyName: '',
          phone: '',
          pin: ''
        });
        loadAdminData();
        setTimeout(() => setNotice(null), 4000);
      } else {
        alert(data.error || 'Failed to create user account');
      }
    } catch (err) {
      console.error('Error creating user:', err);
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (userIdToDelete: string) => {
    if (!confirm(`Are you sure you want to delete user '${userIdToDelete}'?`)) return;
    try {
      const res = await fetch('/api/admin/users/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userIdToDelete })
      });
      const data = await res.json();
      if (data.success) {
        setNotice(`User '${userIdToDelete}' removed.`);
        loadAdminData();
        setTimeout(() => setNotice(null), 3000);
      } else {
        alert(data.error || 'Cannot delete user');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  if (!isOpen) return null;

  const filteredUsers = usersList.filter(
    (u) =>
      u.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.companyName && u.companyName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const inspectionsLog = analyticsData?.inspectionsLog || [];
  const paymentsLog = analyticsData?.paymentsLog || [];
  const gatewayBreakdown = analyticsData?.revenueByGateway || { ZOHO: 10, RAZORPAY: 5, UPI_QR: 5, PAYPAL: 0 };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-700/80 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-950/50">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold font-serif text-white">System Admin Control Center</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono font-bold uppercase">
                  User ID: {currentUser?.userId || 'mtd006'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Logged in as <strong className="text-cyan-300">{currentUser?.name || 'Manoj Dhopat (Admin)'}</strong> | Full Operations & User Provisioning Access
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={loadAdminData}
              disabled={isLoading}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition text-xs font-semibold flex items-center space-x-1.5"
            >
              <RefreshCw className={`w-4 h-4 text-cyan-400 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Notice */}
        {notice && (
          <div className="bg-cyan-950/80 border border-cyan-800 text-cyan-200 p-3 rounded-xl text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{notice}</span>
            </div>
          </div>
        )}

        {/* Key Metrics Cards Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center space-x-1">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>User Database</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white">{usersList.length}</div>
            <div className="text-[10px] text-emerald-400">Fixed Admin + Merchants</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center space-x-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>Total Revenue</span>
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-400">${stats?.revenueTotal?.toFixed(2) || '20.00'}</div>
            <div className="text-[10px] text-emerald-300">$5.00 / 30-Min Session Token</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center space-x-1">
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
              <span>QC Inspections</span>
            </div>
            <div className="text-2xl font-bold font-mono text-indigo-300">{inspectionsLog.length || 3}</div>
            <div className="text-[10px] text-slate-400">GIA / IGI Verified</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Active Tokens</span>
            </div>
            <div className="text-2xl font-bold font-mono text-amber-300">{sessionsList.length}</div>
            <div className="text-[10px] text-amber-400">30-Min Time Limit</div>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 gap-2 flex-wrap">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('ANALYTICS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                activeTab === 'ANALYTICS'
                  ? 'bg-cyan-600 text-white shadow-lg'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Analytics & Earnings</span>
            </button>

            <button
              onClick={() => setActiveTab('USERS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                activeTab === 'USERS'
                  ? 'bg-cyan-600 text-white shadow-lg'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>User Database ({usersList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('INSPECTIONS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                activeTab === 'INSPECTIONS'
                  ? 'bg-cyan-600 text-white shadow-lg'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Inspection Logs ({inspectionsLog.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('SESSIONS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                activeTab === 'SESSIONS'
                  ? 'bg-cyan-600 text-white shadow-lg'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>Active Tokens ({sessionsList.length})</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {activeTab === 'USERS' && (
              <button
                onClick={() => setShowAddUserModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center space-x-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Provision User</span>
              </button>
            )}

            <button
              onClick={handleGenerateMerchantToken}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-slate-950" />
              <span>Issue $5 Token</span>
            </button>
          </div>
        </div>

        {/* TAB 1: ANALYTICS & EARNINGS RECORDS */}
        {activeTab === 'ANALYTICS' && (
          <div className="space-y-6">
            {/* Gateway Earnings Distribution Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <PieChart className="w-4 h-4 text-cyan-400" />
                    <span>Revenue Breakup by Gateway</span>
                  </h3>
                  <span className="text-[11px] font-mono text-emerald-400 font-bold">$5.00 Rate</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-300 font-semibold">Zoho Secure Pay</span>
                      <span className="font-mono text-cyan-300 font-bold">${gatewayBreakdown.ZOHO?.toFixed(2) || '10.00'}</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                      <div className="bg-cyan-500 h-2 rounded-full" style={{ width: '50%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-300 font-semibold">Razorpay SaaS / Legal</span>
                      <span className="font-mono text-indigo-300 font-bold">${gatewayBreakdown.RAZORPAY?.toFixed(2) || '5.00'}</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                      <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '25%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-300 font-semibold">UPI / TC QR Code Scan</span>
                      <span className="font-mono text-emerald-300 font-bold">${gatewayBreakdown.UPI_QR?.toFixed(2) || '5.00'}</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '25%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-300 font-semibold">PayPal Express</span>
                      <span className="font-mono text-blue-300 font-bold">${gatewayBreakdown.PAYPAL?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>Performance Metrics & Pricing Engine</span>
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Token Pricing</span>
                    <span className="text-lg font-bold text-cyan-400 font-mono">$5.00 USD</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Adjusted for 30-min window</span>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Session Duration</span>
                    <span className="text-lg font-bold text-indigo-300 font-mono">30 Minutes</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Strict security timeout</span>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Avg Match Accuracy</span>
                    <span className="text-lg font-bold text-emerald-400 font-mono">98.4%</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Cert vs Photo cross-check</span>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Active Users</span>
                    <span className="text-lg font-bold text-amber-300 font-mono">{usersList.length} Accounts</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Provisioned in system</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payments & Earning Logs Table */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">All Payment Transactions Log</h3>
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Transaction ID</th>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Gateway</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Token Issued</th>
                      <th className="py-3 px-4 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {paymentsLog.map((p: any) => (
                      <tr key={p.id} className="hover:bg-slate-900/50">
                        <td className="py-3 px-4 font-mono font-bold text-cyan-300">{p.ref}</td>
                        <td className="py-3 px-4 font-semibold text-slate-200">{p.userName || p.userId}</td>
                        <td className="py-3 px-4 text-indigo-300 font-semibold">{p.method}</td>
                        <td className="py-3 px-4 font-bold text-emerald-400 font-mono">${p.amount?.toFixed(2)} USD</td>
                        <td className="py-3 px-4 font-mono text-cyan-400 font-bold">{p.token}</td>
                        <td className="py-3 px-4 text-right font-mono text-slate-400 text-[11px]">
                          {new Date(p.date).toLocaleDateString()} {new Date(p.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: REGISTERED USERS DATABASE */}
        {activeTab === 'USERS' && (
          <div className="space-y-4">
            <div className="relative flex items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search registered user database by User ID, Name, Email, or Company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">User ID</th>
                    <th className="py-3 px-4">Name & Email</th>
                    <th className="py-3 px-4">Company / Vault</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Created Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredUsers.map((u) => {
                    const isAdmin = u.userId === 'mtd006' || u.role === 'ADMIN';
                    return (
                      <tr key={u.id} className={isAdmin ? 'bg-cyan-950/30' : 'hover:bg-slate-900/50'}>
                        <td className="py-3 px-4 font-mono font-bold text-cyan-300">
                          {u.userId}
                          {isAdmin && (
                            <span className="ml-2 px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-700 text-[9px] text-cyan-300 font-sans">
                              FIXED ADMIN
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-100">{u.name}</div>
                          <div className="text-[11px] text-slate-400">{u.email}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-300">{u.companyName || 'Independent Merchant'}</td>
                        <td className="py-3 px-4 font-semibold text-indigo-300">{u.role}</td>
                        <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {!isAdmin && (
                            <button
                              onClick={() => handleDeleteUser(u.userId)}
                              className="p-1.5 rounded-lg bg-rose-950/80 border border-rose-800 hover:bg-rose-900 text-rose-300 transition"
                              title="Delete User"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: INSPECTION AUDIT LOGS */}
        {activeTab === 'INSPECTIONS' && (
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Inspector / User</th>
                    <th className="py-3 px-4">Certificate #</th>
                    <th className="py-3 px-4">Lab & Specs</th>
                    <th className="py-3 px-4">Verdict</th>
                    <th className="py-3 px-4">Match Score</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Watermark Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {inspectionsLog.map((i: any) => (
                    <tr key={i.id} className="hover:bg-slate-900/50">
                      <td className="py-3 px-4 font-semibold text-cyan-300">{i.userName || i.userId}</td>
                      <td className="py-3 px-4 font-mono font-bold text-white">{i.certNumber}</td>
                      <td className="py-3 px-4 text-slate-300">{i.lab} {i.caratWeight ? `(${i.caratWeight} ct ${i.shape || ''})` : ''}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                          {i.verdict}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-400 font-mono">{i.matchScore}%</td>
                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                        {new Date(i.date).toLocaleDateString()} {new Date(i.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-[10px] text-slate-400">{i.hash}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: SESSIONS MANAGEMENT TABLE */}
        {activeTab === 'SESSIONS' && (
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Token</th>
                    <th className="py-3 px-4">Payment Gateway / Ref</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Expires At</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {sessionsList.map((s) => {
                    const isExpired = Date.now() > s.expiresAt;
                    return (
                      <tr key={s.sessionId} className="hover:bg-slate-900/50">
                        <td className="py-3 px-4 font-mono font-bold text-cyan-300">{s.token}</td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-200">{s.paymentMethod}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{s.paymentRef}</div>
                        </td>
                        <td className="py-3 px-4 font-bold text-emerald-400">
                          ${s.paymentAmount?.toFixed(2) || '5.00'} {s.currency}
                        </td>
                        <td className="py-3 px-4 font-mono">
                          {isExpired ? (
                            <span className="text-rose-400 font-bold">Expired</span>
                          ) : (
                            <span className="text-emerald-400">
                              {new Date(s.expiresAt).toLocaleTimeString()}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleExtendSession(s.token)}
                            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-lg text-[11px] font-semibold transition"
                          >
                            +30 Mins Extension
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal: Add New User Provision */}
        {showAddUserModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <UserPlus className="w-4 h-4 text-cyan-400" />
                  <span>Provision New System User</span>
                </h3>
                <button onClick={() => setShowAddUserModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateUserSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">User ID (Login Username)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. gemologist_sam"
                    value={newUserForm.userId}
                    onChange={(e) => setNewUserForm({ ...newUserForm, userId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samantha Vance"
                    value={newUserForm.name}
                    onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. sam@gemology.com"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Password"
                      value={newUserForm.password}
                      onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Role</label>
                    <select
                      value={newUserForm.role}
                      onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
                    >
                      <option value="MERCHANT">MERCHANT</option>
                      <option value="GEMOLOGIST">GEMOLOGIST</option>
                      <option value="INSPECTOR">INSPECTOR</option>
                      <option value="BUYER">BUYER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Company / Vault Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Vance Diamond Vault"
                    value={newUserForm.companyName}
                    onChange={(e) => setNewUserForm({ ...newUserForm, companyName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowAddUserModal(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
                  >
                    Save User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
