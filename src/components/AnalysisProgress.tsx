import React, { useEffect, useState } from 'react';
import { Diamond, Sparkles, FileSearch, ShieldCheck, Cpu, CheckCircle2 } from 'lucide-react';

interface AnalysisProgressProps {
  onComplete?: () => void;
}

const STEPS = [
  'Initializing Multi-Spectral Image Analyzer...',
  'Querying Official GIA/IGI Certificate Dossier Database...',
  'Extracting Diamond Facet Geometry & Proportions...',
  'Running AI Inclusion Mapping & Clarity Cross-Check...',
  'Performing UV 365nm Luminescence & Color Evaluation...',
  'Generating Time-Stamped QC Report & Security Watermark...'
];

export const AnalysisProgress: React.FC<AnalysisProgressProps> = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 700);
    return () => clearInterval(interval);
  }, []);

  const progressPercent = Math.round(((currentStep + 1) / STEPS.length) * 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-6 shadow-2xl my-6">
      {/* Animated Glowing Gemology Scanner Icon */}
      <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 rounded-2xl bg-cyan-500/20 animate-ping" />
        <div className="relative w-full h-full rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shadow-xl shadow-cyan-500/30">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <Diamond className="w-10 h-10 text-cyan-400 animate-pulse" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-white font-serif">AI Quality Control Inspection in Progress</h3>
        <p className="text-xs text-slate-400 mt-1">Cross-referencing diamond photos with official grading lab data</p>
      </div>

      {/* Progress Bar */}
      <div className="max-w-md mx-auto space-y-2">
        <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400 font-mono">
          <span>{STEPS[currentStep]}</span>
          <span className="font-bold text-cyan-400">{progressPercent}%</span>
        </div>
      </div>

      {/* Step checklist */}
      <div className="max-w-md mx-auto text-left space-y-2 bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-xs">
        {STEPS.map((step, idx) => (
          <div key={idx} className="flex items-center space-x-2.5">
            {idx < currentStep ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : idx === currentStep ? (
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
            ) : (
              <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
            )}
            <span className={idx <= currentStep ? 'text-slate-200 font-medium' : 'text-slate-600'}>
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
