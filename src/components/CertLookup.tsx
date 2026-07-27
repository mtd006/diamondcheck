import React, { useState } from 'react';
import { FileCheck, Search, ShieldCheck, Sparkles, Building2, MapPin, Globe, CheckCircle2, ChevronRight, Hash, Layers } from 'lucide-react';
import { CertificateData, GradingLab } from '../types';

interface CertLookupProps {
  certificate: CertificateData | null;
  onCertificateLoaded: (cert: CertificateData) => void;
  onSelectSampleCert: (certNo: string) => void;
}

export const CertLookup: React.FC<CertLookupProps> = ({
  certificate,
  onCertificateLoaded,
  onSelectSampleCert
}) => {
  const [inputCert, setInputCert] = useState<string>('5213456789');
  const [selectedLab, setSelectedLab] = useState<GradingLab>('GIA');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLookup = async (certNumToQuery?: string) => {
    const certToQuery = certNumToQuery || inputCert;
    if (!certToQuery.trim()) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/certificate/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          certNumber: certToQuery.trim(),
          lab: selectedLab
        })
      });
      const data = await res.json();
      if (data.success && data.certificate) {
        onCertificateLoaded(data.certificate);
      } else {
        setErrorMsg(data.error || 'Failed to fetch certificate report.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Certificate service offline.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800/80 flex items-center justify-center text-cyan-400">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-serif">1. Official Grading Certificate Lookup</h2>
            <p className="text-xs text-slate-400">Fetches verified report data from GIA / IGI / HRD Report Check servers</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400">Quick Presets:</span>
          <button
            onClick={() => {
              setInputCert('5213456789');
              onSelectSampleCert('5213456789');
            }}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-cyan-900/40 text-cyan-300 border border-slate-700 font-mono text-[11px]"
          >
            5213456789 (GIA)
          </button>
          <button
            onClick={() => {
              setInputCert('6382940123');
              onSelectSampleCert('6382940123');
            }}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-cyan-900/40 text-cyan-300 border border-slate-700 font-mono text-[11px]"
          >
            6382940123 (IGI)
          </button>
        </div>
      </div>

      {/* Lookup Bar Form */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-3">
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Grading Lab
          </label>
          <select
            value={selectedLab}
            onChange={(e) => setSelectedLab(e.target.value as GradingLab)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-cyan-500 font-medium"
          >
            <option value="GIA">GIA (Gemological Institute of America)</option>
            <option value="IGI">IGI (International Gemological Institute)</option>
            <option value="HRD">HRD Antwerp</option>
            <option value="AGS">AGS Laboratories</option>
          </select>
        </div>

        <div className="sm:col-span-6">
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Report / Certificate Number
          </label>
          <div className="relative">
            <Hash className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={inputCert}
              onChange={(e) => setInputCert(e.target.value)}
              placeholder="e.g. 5213456789 or 2221948572"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-200 outline-none focus:border-cyan-500 font-mono font-medium"
            />
          </div>
        </div>

        <div className="sm:col-span-3 flex items-end">
          <button
            onClick={() => handleLookup()}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg transition active:scale-95"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'Querying Lab...' : 'Fetch Certificate'}</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-950/80 border border-rose-800 rounded-xl text-rose-200 text-xs">
          {errorMsg}
        </div>
      )}

      {/* Rendered Certificate Card */}
      {certificate && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-bold text-xs">
                {certificate.lab} Verified Report
              </span>
              <span className="font-mono text-xs text-slate-300 font-semibold">
                #{certificate.certNumber}
              </span>
            </div>
            <div className="text-xs text-slate-400">
              Report Date: <strong className="text-slate-200">{certificate.reportDate}</strong>
            </div>
          </div>

          {/* 4Cs Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Carat Weight</span>
              <div className="text-lg font-bold text-white font-mono mt-0.5">{certificate.caratWeight} ct</div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Color Grade</span>
              <div className="text-lg font-bold text-cyan-400 font-mono mt-0.5">{certificate.colorGrade}</div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Clarity Grade</span>
              <div className="text-lg font-bold text-indigo-400 font-mono mt-0.5">{certificate.clarityGrade}</div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Cut Grade</span>
              <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">{certificate.cutGrade}</div>
            </div>
          </div>

          {/* Detailed Specs Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
              <div className="font-semibold text-slate-200 border-b border-slate-800 pb-1.5 flex items-center justify-between">
                <span>Proportions & Finish</span>
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div>Shape: <strong className="text-slate-100">{certificate.shape}</strong></div>
                <div>Measurements: <strong className="text-slate-100">{certificate.measurements}</strong></div>
                <div>Table %: <strong className="text-slate-100">{certificate.tablePercent}%</strong></div>
                <div>Depth %: <strong className="text-slate-100">{certificate.depthPercent}%</strong></div>
                <div>Crown Angle: <strong className="text-slate-100">{certificate.crownAngle}°</strong></div>
                <div>Pavilion Angle: <strong className="text-slate-100">{certificate.pavilionAngle}°</strong></div>
                <div>Polish: <strong className="text-slate-100">{certificate.polish}</strong></div>
                <div>Symmetry: <strong className="text-slate-100">{certificate.symmetry}</strong></div>
              </div>
            </div>

            <div className="space-y-2 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
              <div className="font-semibold text-slate-200 border-b border-slate-800 pb-1.5 flex items-center justify-between">
                <span>Verification & Inscription</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="space-y-1.5 text-slate-300">
                <div>Fluorescence: <strong className="text-slate-100">{certificate.fluorescence}</strong></div>
                <div>Laser Inscription: <code className="text-cyan-300 bg-slate-950 px-1.5 py-0.5 rounded font-mono text-[11px]">{certificate.inscription}</code></div>
                <div>Inclusions (Symbols): <span className="text-slate-200">{certificate.keyToSymbols.join(', ') || 'None'}</span></div>
                <div className="text-[11px] text-slate-400 italic">"{certificate.comments}"</div>
              </div>
            </div>
          </div>

          {/* Provenance Chain of Custody */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-200 border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>Diamond Provenance & Chain of Custody</span>
              </div>
              <span className="text-[11px] font-mono text-cyan-400">Origin: {certificate.provenance.originCountry}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
              {certificate.provenance.custodyChain.map((event, idx) => (
                <div key={idx} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 flex flex-col justify-between">
                  <div className="text-[10px] text-slate-400 font-mono">{event.date}</div>
                  <div className="font-bold text-slate-200 mt-1">{event.entity}</div>
                  <div className="text-[11px] text-slate-400 flex items-center mt-1">
                    <MapPin className="w-3 h-3 text-cyan-400 mr-1 shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                  <div className="text-[10px] text-cyan-400 mt-2 font-medium">{event.event}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
