import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SessionTimerBar } from './components/SessionTimerBar';
import { PaymentModal } from './components/PaymentModal';
import { AuthModal } from './components/AuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { CertLookup } from './components/CertLookup';
import { PhotoUploader } from './components/PhotoUploader';
import { AnalysisProgress } from './components/AnalysisProgress';
import { ReportView } from './components/ReportView';
import { ExpiredSessionView } from './components/ExpiredSessionView';
import { FaqSection } from './components/FaqSection';
import { UserHistoryModal } from './components/UserHistoryModal';

import { CertificateData, AnalysisResult, SessionData, ImageAngles, User } from './types';
import { getOrCreateCertificate } from './data/sampleCertificates';
import { SAMPLE_TOP_DIAMOND, SAMPLE_SIDE_DIAMOND, SAMPLE_BOTTOM_DIAMOND } from './data/sampleImages';

export default function App() {
  // Session State
  const [session, setSession] = useState<SessionData | null>(null);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState<boolean>(false);
  const [currency, setCurrency] = useState<string>('USD');

  // User Auth & Admin State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('qc_portal_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isUserHistoryOpen, setIsUserHistoryOpen] = useState<boolean>(false);

  // Diamond QC Workflow State
  const [certificate, setCertificate] = useState<CertificateData | null>(
    getOrCreateCertificate('5213456789', 'GIA')
  );
  const [photos, setPhotos] = useState<ImageAngles>({
    top: SAMPLE_TOP_DIAMOND,
    side: SAMPLE_SIDE_DIAMOND,
    bottom: SAMPLE_BOTTOM_DIAMOND
  });
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Persist logged in user
  const handleUserLoggedIn = (user: User) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('qc_portal_user', JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save user in storage:', e);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('qc_portal_user');
  };

  // Automatically create initial demo session on mount for frictionless evaluation
  useEffect(() => {
    const initSession = async () => {
      try {
        const res = await fetch('/api/sessions/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentMethod: 'INSTANT_DEMO',
            paymentRef: 'INIT_DEMO_' + Date.now(),
            amount: 5.00,
            currency: 'USD',
            userId: currentUser?.userId || 'mtd006',
            userName: currentUser?.name || 'Manoj Dhopat (Admin)'
          })
        });
        const data = await res.json();
        if (data.success && data.session) {
          setSession(data.session);
        }
      } catch (e) {
        console.error('Failed to initialize demo session:', e);
      }
    };
    initSession();
  }, []);

  // Handle Quick Sample Certificate selection
  const handleSelectSampleCert = (certNo: string) => {
    const cert = getOrCreateCertificate(certNo, certNo.startsWith('6') ? 'IGI' : 'GIA');
    setCertificate(cert);
    setAnalysis(null);
  };

  // Run AI Diamond QC Analysis
  const handleRunAnalysis = async () => {
    if (!certificate || !photos.top) return;

    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const res = await fetch('/api/analyze-diamond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photos,
          certificate,
          token: session?.token,
          userId: currentUser?.userId || 'mtd006',
          userName: currentUser?.name || 'Manoj Dhopat (Admin)'
        })
      });

      const data = await res.json();

      if (data.error && data.error.includes('expired')) {
        setIsExpired(true);
        setIsAnalyzing(false);
        return;
      }

      if (data.success && data.analysis) {
        setAnalysis(data.analysis);
      }
    } catch (e) {
      console.error('Analysis error:', e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Renew / Create Session
  const handleRenewSession = async () => {
    try {
      const res = await fetch('/api/sessions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod: 'INSTANT_DEMO',
          paymentRef: 'RENEW_' + Date.now(),
          amount: 5.00,
          currency,
          userId: currentUser?.userId || 'mtd006',
          userName: currentUser?.name || 'Manoj Dhopat (Admin)'
        })
      });
      const data = await res.json();
      if (data.success && data.session) {
        setSession(data.session);
        setIsExpired(false);
      }
    } catch (e) {
      console.error('Failed to renew session:', e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 flex flex-col justify-between">
      <div>
        {/* Header Navigation */}
        <Header
          session={session}
          currentUser={currentUser}
          onOpenPayment={() => setIsPaymentOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenAdminDashboard={() => setIsAdminOpen(true)}
          onLogout={handleLogout}
          onSelectSampleCert={handleSelectSampleCert}
          currency={currency}
          setCurrency={setCurrency}
        />

        {/* Sticky Session Countdown Timer Bar */}
        <SessionTimerBar
          session={session}
          onExpire={() => setIsExpired(true)}
          onRenew={handleRenewSession}
        />

        {/* Main Application Container */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Expired Session View */}
          {isExpired ? (
            <ExpiredSessionView
              onRenew={handleRenewSession}
              onOpenPayment={() => setIsPaymentOpen(true)}
            />
          ) : analysis ? (
            /* Analysis Completed -> Show Interactive Report */
            <ReportView
              certificate={certificate!}
              analysis={analysis}
              session={session}
              photos={photos}
              onReset={() => setAnalysis(null)}
            />
          ) : isAnalyzing ? (
            /* AI Scanning Progress Indicator */
            <AnalysisProgress />
          ) : (
            /* Primary Workflow Steps: Cert Lookup + Photo Uploader */
            <div className="space-y-8">
              {/* Hero Banner Intro */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/80 border border-slate-800/80 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
                <div className="space-y-2 max-w-2xl">
                  <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-semibold uppercase tracking-wider">
                    Official Gemological Verification Engine
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight">
                    "2nd View" Diamond Quality Control Portal
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Verify diamond physical condition against GIA, IGI & HRD grading certificates. Upload multi-angle macro photos to run AI visual inclusion mapping, color grade verification, and download time-stamped QC PDF reports.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                  <button
                    onClick={() => setIsUserHistoryOpen(true)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-950 border border-cyan-700/80 hover:bg-cyan-900 text-cyan-300 font-bold text-xs shadow-lg transition active:scale-95"
                  >
                    My History & Payments
                  </button>
                  <button
                    onClick={() => setIsAuthOpen(true)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg transition active:scale-95"
                  >
                    Admin Login (User ID: mtd006)
                  </button>
                  <button
                    onClick={() => setIsPaymentOpen(true)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition"
                  >
                    Acquire $5 Session Token
                  </button>
                </div>
              </div>

              {/* Step 1: Certificate Lookup */}
              <CertLookup
                certificate={certificate}
                onCertificateLoaded={(cert) => {
                  setCertificate(cert);
                  setAnalysis(null);
                }}
                onSelectSampleCert={handleSelectSampleCert}
              />

              {/* Step 2: Multi-Angle Photo Upload & Canvas Diagnostic Filters */}
              <PhotoUploader
                photos={photos}
                onChangePhotos={setPhotos}
                onRunAnalysis={handleRunAnalysis}
                isAnalyzing={isAnalyzing}
              />
            </div>
          )}

          {/* FAQs & Guidelines */}
          <FaqSection />
        </main>
      </div>

      {/* User Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onUserLoggedIn={handleUserLoggedIn}
      />

      {/* User Activity & Payment History Modal */}
      <UserHistoryModal
        isOpen={isUserHistoryOpen}
        onClose={() => setIsUserHistoryOpen(false)}
        currentUser={currentUser}
      />

      {/* Admin Management Dashboard Modal */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        currentUser={currentUser}
      />

      {/* Payment Gateway Modal */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onSessionCreated={(sess) => {
          setSession(sess);
          setIsExpired(false);
        }}
        currency={currency}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-serif font-bold text-slate-300">2nd View Diamond QC Portal</span>
            <span>— Time-Gated Gemological Audit & Verification</span>
          </div>
          <div>© {new Date().getFullYear()} 2nd View Gemological AI Systems. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}

