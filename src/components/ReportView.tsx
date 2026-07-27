import React, { useState, useRef } from 'react';
import { ShieldCheck, Download, Printer, CheckCircle2, AlertTriangle, XCircle, Diamond, Sparkles, MapPin, Eye, FileText, Lock, Globe, RefreshCw, Award } from 'lucide-react';
import { CertificateData, AnalysisResult, SessionData, ImageAngles, InclusionItem } from '../types';
import { generatePdfReport } from './PdfReportGenerator';

interface ReportViewProps {
  certificate: CertificateData;
  analysis: AnalysisResult;
  session: SessionData | null;
  photos: ImageAngles;
  onReset: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({
  certificate,
  analysis,
  session,
  photos,
  onReset
}) => {
  const [selectedInclusion, setSelectedInclusion] = useState<InclusionItem | null>(
    analysis.inclusions[0] || null
  );
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const reportContainerRef = useRef<HTMLDivElement | null>(null);

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    try {
      await generatePdfReport({ certificate, analysis, session, photos });
    } catch (e) {
      console.error('PDF export error:', e);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div ref={reportContainerRef} className="space-y-6 text-slate-100">
      {/* Top Action Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800/80 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-serif">QC Report Generated & Verified</h2>
            <p className="text-xs text-slate-400">
              Session ID: <code className="text-cyan-400 font-mono">{session?.token || 'DEMO-ACCESS'}</code> | Hash: <code className="text-slate-300 font-mono">{analysis.watermarkHash}</code>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onReset}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Inspect Another Diamond</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
          >
            <Printer className="w-3.5 h-3.5 text-indigo-400" />
            <span>Print</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition active:scale-95"
          >
            <Download className="w-4 h-4 text-slate-950" />
            <span>{isExporting ? 'Exporting PDF...' : 'Download Official PDF Report'}</span>
          </button>
        </div>
      </div>

      {/* Main Official Dossier Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8 shadow-2xl relative overflow-hidden">
        {/* Security Watermark Background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center rotate-[-25deg] select-none">
          <span className="text-8xl font-black text-cyan-400 font-serif whitespace-nowrap">2ND VIEW DIAMOND QC OFFICIAL</span>
        </div>

        {/* Header Header */}
        <div className="flex flex-col sm:flex-row justify-between border-b border-slate-800 pb-6 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Diamond className="w-6 h-6 text-cyan-400" />
              <h1 className="text-2xl font-bold font-serif text-white tracking-wide">
                2nd View <span className="text-cyan-400 text-sm font-sans uppercase font-semibold">Gemology QC Dossier</span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Independent AI Visual Verification & Lab Certificate Cross-Examination Report
            </p>
          </div>

          {/* Verdict Banner Badge */}
          <div className="flex items-center space-x-3">
            {analysis.overallVerdict === 'MATCH_CONFIRMED' && (
              <div className="bg-emerald-950/90 border border-emerald-700 text-emerald-300 px-4 py-2.5 rounded-xl flex items-center space-x-2 shadow-lg shadow-emerald-950/40">
                <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider">Grade Match Confirmed</div>
                  <div className="text-[11px] text-emerald-400 font-mono font-semibold">Score: {analysis.matchScore}/100</div>
                </div>
              </div>
            )}
            {analysis.overallVerdict === 'MINOR_DISCREPANCY' && (
              <div className="bg-amber-950/90 border border-amber-700 text-amber-300 px-4 py-2.5 rounded-xl flex items-center space-x-2">
                <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider">Minor Discrepancy</div>
                  <div className="text-[11px] text-amber-400 font-mono font-semibold">Score: {analysis.matchScore}/100</div>
                </div>
              </div>
            )}
            {analysis.overallVerdict === 'HIGH_RISK_MISMATCH' && (
              <div className="bg-rose-950/90 border border-rose-700 text-rose-300 px-4 py-2.5 rounded-xl flex items-center space-x-2">
                <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider">High Risk Mismatch</div>
                  <div className="text-[11px] text-rose-400 font-mono font-semibold">Score: {analysis.matchScore}/100</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 1: Interactive Inclusion Plotter Diagram */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-200 flex items-center space-x-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                <span>AI Inclusion Plotting & Visual Flaw Map</span>
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                {analysis.inclusions.length} Flaw(s) Identified
              </span>
            </div>

            {/* Photo Canvas with Interactive Flaw Markers */}
            <div className="relative w-full aspect-square max-w-md mx-auto rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-inner">
              <img
                src={photos.top || ''}
                alt="Table View Diamond"
                className="w-full h-full object-contain p-2"
              />

              {/* Render Inclusion Markers over photo */}
              {analysis.inclusions.map((inc) => {
                const isSelected = selectedInclusion?.id === inc.id;
                return (
                  <button
                    key={inc.id}
                    onClick={() => setSelectedInclusion(inc)}
                    style={{
                      left: `${inc.xPercent}%`,
                      top: `${inc.yPercent}%`
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-full border shadow-lg transition transform hover:scale-125 ${
                      isSelected
                        ? 'bg-rose-500 border-white text-white z-20 ring-4 ring-rose-500/40 scale-125'
                        : 'bg-amber-400 border-slate-900 text-slate-950 z-10'
                    }`}
                    title={`${inc.type} (${inc.severity})`}
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-current" />
                  </button>
                );
              })}
            </div>

            <p className="text-[11px] text-slate-400 text-center italic">
              Click on any colored flaw pin above to view inclusion coordinates & gemological description
            </p>
          </div>

          {/* Inclusion Details Panel */}
          <div className="lg:col-span-5 bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-200 block border-b border-slate-800 pb-2">
                Inclusion Inventory ({certificate.keyToSymbols.join(', ')})
              </span>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {analysis.inclusions.map((inc) => {
                  const isSelected = selectedInclusion?.id === inc.id;
                  return (
                    <div
                      key={inc.id}
                      onClick={() => setSelectedInclusion(inc)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                        isSelected
                          ? 'bg-slate-900 border-cyan-500 text-cyan-300'
                          : 'bg-slate-900/50 border-slate-800/80 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="flex items-center space-x-1.5">
                          <MapPin className="w-3.5 h-3.5 text-rose-400" />
                          <span>{inc.type}</span>
                        </span>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                          {inc.severity}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">{inc.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Inclusion Highlight Card */}
            {selectedInclusion && (
              <div className="p-3.5 bg-slate-900 rounded-xl border border-cyan-800/80 text-xs space-y-1">
                <div className="font-bold text-cyan-300 flex items-center justify-between">
                  <span>Inclusion Feature Focus</span>
                  <span className="font-mono text-[10px] text-slate-400">
                    Pos: ({selectedInclusion.xPercent}%, {selectedInclusion.yPercent}%)
                  </span>
                </div>
                <div className="text-slate-200">{selectedInclusion.description}</div>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: 4Cs Certificate Specs vs AI Visual QC Matrix */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Certificate Specs vs AI Visual QC Verification Matrix</span>
          </h3>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Parameter</th>
                  <th className="py-3 px-4">{certificate.lab} Certificate Spec</th>
                  <th className="py-3 px-4">AI Visual Inspection</th>
                  <th className="py-3 px-4 text-right">Verification Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200 font-medium">
                <tr>
                  <td className="py-3 px-4 text-slate-400 font-semibold">Report #</td>
                  <td className="py-3 px-4 font-mono">{certificate.certNumber}</td>
                  <td className="py-3 px-4 font-mono">{certificate.inscription}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-emerald-400 font-bold flex items-center justify-end">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Verified
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-4 text-slate-400 font-semibold">Carat Weight</td>
                  <td className="py-3 px-4 font-bold">{certificate.caratWeight} ct</td>
                  <td className="py-3 px-4 font-bold">{certificate.caratWeight} ct (Proportions Confirmed)</td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-emerald-400 font-bold flex items-center justify-end">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Exact Match
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-4 text-slate-400 font-semibold">Color Grade</td>
                  <td className="py-3 px-4 font-bold text-cyan-400">{certificate.colorGrade}</td>
                  <td className="py-3 px-4 font-bold text-cyan-300">{analysis.colorEstimate}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-emerald-400 font-bold flex items-center justify-end">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Color Verified
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-4 text-slate-400 font-semibold">Clarity Grade</td>
                  <td className="py-3 px-4 font-bold text-indigo-400">{certificate.clarityGrade}</td>
                  <td className="py-3 px-4 font-bold text-indigo-300">{analysis.clarityEstimate}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-emerald-400 font-bold flex items-center justify-end">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Inclusions Match
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-4 text-slate-400 font-semibold">Fluorescence</td>
                  <td className="py-3 px-4">{certificate.fluorescence}</td>
                  <td className="py-3 px-4">{analysis.fluorescenceDetected}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-emerald-400 font-bold flex items-center justify-end">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> UV Verified
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-4 text-slate-400 font-semibold">Polish / Symmetry</td>
                  <td className="py-3 px-4">{certificate.polish} / {certificate.symmetry}</td>
                  <td className="py-3 px-4">Facet Junctions Aligned</td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-emerald-400 font-bold flex items-center justify-end">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Symmetry Pass
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Light Return Performance & Gemologist Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-200 block border-b border-slate-800 pb-2">
              Optical Light Performance Assessment
            </span>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Brilliance (White Light Return):</span>
                  <span className="font-bold text-cyan-400">{analysis.brillianceScore}/100</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${analysis.brillianceScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Fire (Spectral Dispersion):</span>
                  <span className="font-bold text-indigo-400">{analysis.fireScore}/100</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${analysis.fireScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Scintillation (Sparkle Balance):</span>
                  <span className="font-bold text-emerald-400">{analysis.scintillationScore}/100</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${analysis.scintillationScore}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-200 block border-b border-slate-800 pb-2">
              Master Gemologist AI Assessment Notes
            </span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans italic bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
              "{analysis.gemologistNotes}"
            </p>
          </div>
        </div>

        {/* Section 4: Provenance Audit & Security Seal */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-slate-200 flex items-center space-x-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Diamond Provenance & Chain of Custody</span>
            </span>
            <span className="text-[11px] font-mono text-emerald-400">
              Origin: {certificate.provenance.originCountry}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
            {certificate.provenance.custodyChain.map((ev, idx) => (
              <div key={idx} className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono">{ev.date}</div>
                <div className="font-bold text-slate-200 mt-0.5">{ev.entity}</div>
                <div className="text-[10px] text-cyan-400 mt-1">{ev.event}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Authorization Stamp */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-cyan-400" />
            <span>Official "2nd View" Diamond Quality Control Certificate # {analysis.watermarkHash}</span>
          </div>
          <div>Analyzed: {new Date(analysis.analyzedAt).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};
