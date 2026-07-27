import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, ShieldCheck, Diamond, Zap, FileCheck } from 'lucide-react';

const FAQS = [
  {
    q: 'How does the "Diamond Check" AI Quality Control analysis work?',
    a: 'When you upload diamond photos and enter a Certificate Number (GIA, IGI, or HRD), "Diamond Check" fetches official grading laboratory specs. Our multi-spectral AI vision model then inspects the high-resolution photo for color grade consistency, clarity inclusions (feathers, pinpoints, crystals), facet symmetry, and optical light return, providing a side-by-side verification matrix.'
  },
  {
    q: 'Why are inspection sessions strictly limited to 30 minutes?',
    a: 'Time-gated sessions ensure security, auditability, and chain-of-custody integrity for diamond merchants and buyers. The 30-minute window guarantees that the QC report represents a live inspection timestamped at the exact moment of transaction, preventing stale or reused reports.'
  },
  {
    q: 'Which grading laboratories are supported for automatic certificate lookup?',
    a: 'We support GIA (Gemological Institute of America), IGI (International Gemological Institute), HRD Antwerp, and AGS Laboratories. You can enter any 10-digit report number to instantly retrieve verified carat weight, color, clarity, cut proportions, key-to-symbols, laser inscriptions, and provenance data.'
  },
  {
    q: 'How are payment options handled for merchants and buyers?',
    a: 'You can acquire a 30-minute session via Zoho Secure Pay, Razorpay (SaaS & Legal Services), PayPal, or UPI QR code scan. You can also generate an instant $0 Demo Access Token for testing.'
  },
  {
    q: 'Can I export watermarked PDF reports for clients or insurance audits?',
    a: 'Yes. Once the AI QC inspection completes, you can view the interactive inclusion map and download an official, encrypted PDF dossier complete with diamond specs, inclusion inventory, light performance scores, provenance chain, and a time-stamped verification security hash.'
  }
];

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
        <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white font-serif">Frequently Asked Questions & Gemology Guidelines</h2>
          <p className="text-xs text-slate-400">Everything you need to know about AI diamond quality control & session tokens</p>
        </div>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden transition"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-slate-200 hover:text-cyan-300 transition"
              >
                <span className="flex items-center space-x-2">
                  <Diamond className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{faq.q}</span>
                </span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>

              {isOpen && (
                <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
