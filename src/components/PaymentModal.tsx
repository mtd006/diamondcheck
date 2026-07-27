import React, { useState } from 'react';
import { X, ShieldCheck, Zap, CreditCard, QrCode, ExternalLink, CheckCircle2, Lock, Sparkles, Building2 } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionCreated: (session: any) => void;
  currency: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSessionCreated,
  currency
}) => {
  const [activeTab, setActiveTab] = useState<'DEMO' | 'ZOHO' | 'RAZORPAY' | 'PAYPAL' | 'QR'>('DEMO');
  const [loading, setLoading] = useState<boolean>(false);
  const [paymentRefInput, setPaymentRefInput] = useState<string>('');

  if (!isOpen) return null;

  const handleCreateSession = async (method: string, ref?: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/sessions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod: method,
          paymentRef: ref || paymentRefInput || 'TXN_' + Math.floor(10000000 + Math.random() * 90000000),
          amount: 5.00,
          currency
        })
      });
      const data = await res.json();
      if (data.success && data.session) {
        onSessionCreated(data.session);
        onClose();
      }
    } catch (e) {
      console.error('Failed to create session:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-slate-100 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-serif">Acquire 30-Minute QC Session Link</h2>
              <p className="text-xs text-slate-400">Time-gated session token for certified diamond visual QC inspection & PDF report</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pricing Summary Badge */}
        <div className="bg-slate-950/80 p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-bold text-cyan-400 font-mono">$5.00 <span className="text-xs font-normal text-slate-400">USD / Session</span></span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">30-Min Time Window</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Includes AI Multi-Angle Photo QC + GIA/IGI Cert Lookup + Dynamic PDF</span>
          </div>
        </div>

        {/* Gateway Selection Tabs */}
        <div className="flex border-b border-slate-800 overflow-x-auto bg-slate-950/40 text-xs font-medium">
          <button
            onClick={() => setActiveTab('DEMO')}
            className={`flex items-center space-x-1.5 px-4 py-3 border-b-2 whitespace-nowrap transition ${
              activeTab === 'DEMO'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-950/30 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Instant Demo Token ($0)</span>
          </button>
          <button
            onClick={() => setActiveTab('ZOHO')}
            className={`flex items-center space-x-1.5 px-4 py-3 border-b-2 whitespace-nowrap transition ${
              activeTab === 'ZOHO'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-950/30 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Zoho Secure Pay</span>
          </button>
          <button
            onClick={() => setActiveTab('RAZORPAY')}
            className={`flex items-center space-x-1.5 px-4 py-3 border-b-2 whitespace-nowrap transition ${
              activeTab === 'RAZORPAY'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-950/30 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Razorpay (SaaS / Legal)</span>
          </button>
          <button
            onClick={() => setActiveTab('PAYPAL')}
            className={`flex items-center space-x-1.5 px-4 py-3 border-b-2 whitespace-nowrap transition ${
              activeTab === 'PAYPAL'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-950/30 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>PayPal Express</span>
          </button>
          <button
            onClick={() => setActiveTab('QR')}
            className={`flex items-center space-x-1.5 px-4 py-3 border-b-2 whitespace-nowrap transition ${
              activeTab === 'QR'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-950/30 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode className="w-4 h-4 text-indigo-400" />
            <span>UPI / TC QR Scan</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6">
          {/* TAB 1: Instant Demo Token */}
          {activeTab === 'DEMO' && (
            <div className="space-y-4 text-center py-2">
              <div className="w-12 h-12 rounded-full bg-amber-950/60 border border-amber-800/80 text-amber-400 mx-auto flex items-center justify-center">
                <Sparkles className="w-6 h-6 animate-spin" />
              </div>
              <h3 className="text-base font-bold text-white">Instant 30-Minute Access Token</h3>
              <p className="text-xs text-slate-300 max-w-lg mx-auto">
                Generate an immediate active session token (`2ND-QC-XXXXXX`) to inspect diamond photos, perform GIA/IGI cert lookups, and export custom watermarked PDF reports without delay.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => handleCreateSession('INSTANT_DEMO', 'DEMO_ACC_' + Date.now())}
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-cyan-950/50 transition transform active:scale-95"
                >
                  {loading ? 'Activating Session...' : 'Activate 30-Min QC Session Now'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Zoho Secure Pay */}
          {activeTab === 'ZOHO' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span>Zoho Secure Checkout Embedded Page</span>
                <a
                  href="https://zohosecurepay.in/checkout/ylsr5sbs-qvcezqivl2mze/Ecommerce-Sale"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:underline flex items-center space-x-1"
                >
                  <span>Open in Zoho Tab</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              {/* Zoho iframe */}
              <div className="w-full h-80 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                <iframe
                  title="Zoho Payment"
                  width="100%"
                  height="100%"
                  src="https://zohosecurepay.in/checkout/ylsr5sbs-qvcezqivl2mze/Ecommerce-Sale"
                  style={{ border: 'none' }}
                />
              </div>
              <div className="flex items-center space-x-3 pt-2">
                <input
                  type="text"
                  value={paymentRefInput}
                  onChange={(e) => setPaymentRefInput(e.target.value)}
                  placeholder="Enter Zoho Transaction Ref ID (e.g. ZOHO_894123)"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-500"
                />
                <button
                  onClick={() => handleCreateSession('ZOHO', paymentRefInput || 'ZOHO_' + Date.now())}
                  disabled={loading}
                  className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition"
                >
                  Confirm & Activate
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Razorpay */}
          {activeTab === 'RAZORPAY' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300">
                Select your preferred Razorpay gateway link below to process payment via Credit Card, Debit Card, NetBanking, or Wallet:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="https://rzp.io/rzp/sYIeLsN"
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/50 transition group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-cyan-300">Razorpay SaaS Portal</span>
                      <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
                    </div>
                    <p className="text-xs text-slate-400">Official SaaS Diamond QC Checkout Link</p>
                  </div>
                  <span className="mt-3 text-[11px] text-cyan-400 font-mono">https://rzp.io/rzp/sYIeLsN</span>
                </a>

                <a
                  href="https://rzp.io/rzp/BOogaCE"
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/50 transition group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-indigo-300">Razorpay Legal Service</span>
                      <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
                    </div>
                    <p className="text-xs text-slate-400">Online Diamond Certification Portal Link</p>
                  </div>
                  <span className="mt-3 text-[11px] text-indigo-400 font-mono">https://rzp.io/rzp/BOogaCE</span>
                </a>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  value={paymentRefInput}
                  onChange={(e) => setPaymentRefInput(e.g.target.value)}
                  placeholder="Enter Razorpay Payment ID (e.g. pay_P2a9x0182)"
                  className="w-full sm:flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-500"
                />
                <button
                  onClick={() => handleCreateSession('RAZORPAY', paymentRefInput || 'RZP_' + Date.now())}
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition"
                >
                  Validate & Start Session
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: PayPal */}
          {activeTab === 'PAYPAL' && (
            <div className="space-y-4 text-center py-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 max-w-md mx-auto space-y-3">
                <CreditCard className="w-8 h-8 text-blue-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">PayPal Express Checkout</h4>
                <p className="text-xs text-slate-400">
                  Click below to launch PayPal payment link ($5.00 USD) for instant session issuance.
                </p>
                <a
                  href="https://www.paypal.com/ncp/payment/H6BGWLEK2T8ZS"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-xs shadow-lg transition"
                >
                  <span>Pay with PayPal</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <div className="max-w-md mx-auto pt-2 flex items-center space-x-2">
                <input
                  type="text"
                  value={paymentRefInput}
                  onChange={(e) => setPaymentRefInput(e.target.value)}
                  placeholder="PayPal Transaction Ref Number"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none"
                />
                <button
                  onClick={() => handleCreateSession('PAYPAL', paymentRefInput || 'PP_' + Date.now())}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs"
                >
                  Confirm Token
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: QR Code Scan */}
          {activeTab === 'QR' && (
            <div className="space-y-4 text-center py-2">
              <p className="text-xs text-slate-300">
                Scan the merchant TC QR Code below with any UPI / Banking App to complete instant payment:
              </p>
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 inline-block">
                <div className="w-48 h-48 bg-white p-2 rounded-xl flex items-center justify-center mx-auto shadow-inner">
                  <a
                    href="https://drive.google.com/file/d/1oueNbACIat1J2TqY57nu55Y_lNui9vi0/view?usp=sharing"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <QrCode className="w-40 h-40 text-slate-900" />
                  </a>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 font-mono">TC QR Code (Google Drive Asset)</p>
              </div>

              <div className="max-w-md mx-auto flex items-center space-x-2">
                <input
                  type="text"
                  value={paymentRefInput}
                  onChange={(e) => setPaymentRefInput(e.target.value)}
                  placeholder="Enter UPI UTR / Reference No."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none"
                />
                <button
                  onClick={() => handleCreateSession('UPI_QR', paymentRefInput || 'UTR_' + Date.now())}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs"
                >
                  Verify & Activate
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span>256-Bit Encrypted Session Authorization</span>
          </div>
          <span>Automatic 30-Minute Expiry Enforcement</span>
        </div>
      </div>
    </div>
  );
};
