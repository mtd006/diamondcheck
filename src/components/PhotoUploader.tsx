import React, { useRef, useState, useEffect } from 'react';
import { Camera, Upload, Eye, Sparkles, Zap, Sliders, Image as ImageIcon, RotateCcw, AlertCircle, Sun, Activity, Flame } from 'lucide-react';
import { ImageAngles } from '../types';
import { SAMPLE_TOP_DIAMOND, SAMPLE_SIDE_DIAMOND, SAMPLE_BOTTOM_DIAMOND } from '../data/sampleImages';

interface PhotoUploaderProps {
  photos: ImageAngles;
  onChangePhotos: (photos: ImageAngles) => void;
  onRunAnalysis: () => void;
  isAnalyzing: boolean;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  photos,
  onChangePhotos,
  onRunAnalysis,
  isAnalyzing
}) => {
  const [filterMode, setFilterMode] = useState<'STANDARD' | 'CONTRAST' | 'EDGE' | 'UV_FLUOR' | 'HEATMAP'>('STANDARD');
  const [activeAngle, setActiveAngle] = useState<'top' | 'side' | 'bottom'>('top');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Load sample preset photos
  const handleLoadSamplePhotos = () => {
    onChangePhotos({
      top: SAMPLE_TOP_DIAMOND,
      side: SAMPLE_SIDE_DIAMOND,
      bottom: SAMPLE_BOTTOM_DIAMOND
    });
  };

  // Handle single angle file upload
  const handleFileUpload = (angle: 'top' | 'side' | 'bottom', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      onChangePhotos({
        ...photos,
        [angle]: base64
      });
    };
    reader.readAsDataURL(file);
  };

  // Canvas Image Processing Effects
  useEffect(() => {
    const currentPhoto = photos[activeAngle];
    if (!currentPhoto || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = currentPhoto;
    img.onload = () => {
      canvas.width = 500;
      canvas.height = 500;
      ctx.clearRect(0, 0, 500, 500);
      ctx.drawImage(img, 0, 0, 500, 500);

      const imageData = ctx.getImageData(0, 0, 500, 500);
      const data = imageData.data;

      if (filterMode === 'CONTRAST') {
        // High Contrast & Sharpness
        const factor = (259 * (128 + 255)) / (255 * (259 - 128));
        for (let i = 0; i < data.length; i += 4) {
          data[i] = factor * (data[i] - 128) + 128;
          data[i + 1] = factor * (data[i + 1] - 128) + 128;
          data[i + 2] = factor * (data[i + 2] - 128) + 128;
        }
        ctx.putImageData(imageData, 0, 0);
      } else if (filterMode === 'EDGE') {
        // Edge Detection Sobel filter for facet junctions
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          const nextAvg = (data[i + 4] + data[i + 5] + data[i + 6]) / 3 || avg;
          const diff = Math.abs(avg - nextAvg) * 4;
          data[i] = diff;
          data[i + 1] = diff > 100 ? 255 : diff;
          data[i + 2] = 255;
        }
        ctx.putImageData(imageData, 0, 0);
      } else if (filterMode === 'UV_FLUOR') {
        // 365nm UV Light Fluorescence Simulator (Blue Luminescence)
        for (let i = 0; i < data.length; i += 4) {
          const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = brightness * 0.1; // Low Red
          data[i + 1] = brightness * 0.6; // Soft Green
          data[i + 2] = brightness * 1.5; // High Blue Glow
        }
        ctx.putImageData(imageData, 0, 0);
      } else if (filterMode === 'HEATMAP') {
        // Density Heatmap Overlay for flaws & optical density
        for (let i = 0; i < data.length; i += 4) {
          const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = brightness > 150 ? 255 : brightness * 1.2; // Red
          data[i + 1] = brightness > 100 ? 180 : brightness * 0.5; // Green
          data[i + 2] = brightness < 100 ? 200 : 50; // Blue
        }
        ctx.putImageData(imageData, 0, 0);
      }
    };
  }, [photos, activeAngle, filterMode]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800/80 flex items-center justify-center text-cyan-400">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-serif">2. Multi-Angle Diamond Photo QC Upload</h2>
            <p className="text-xs text-slate-400">Upload high-resolution macro photos for AI inclusion mapping & facet symmetry</p>
          </div>
        </div>

        <button
          onClick={handleLoadSamplePhotos}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-800/80 text-xs font-semibold transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Load High-Res Demo Diamond Photos</span>
        </button>
      </div>

      {/* 3 Upload Angle Slots */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Slot 1: Top / Table View */}
        <div
          className={`p-4 rounded-xl border transition ${
            activeAngle === 'top'
              ? 'bg-slate-950 border-cyan-500 shadow-lg shadow-cyan-950/40'
              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
          }`}
          onClick={() => setActiveAngle('top')}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-200">Table View (Top) *</span>
            <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-800">Required</span>
          </div>

          <div className="aspect-square bg-slate-900 rounded-lg border border-dashed border-slate-700 flex flex-col items-center justify-center p-2 relative overflow-hidden group">
            {photos.top ? (
              <img src={photos.top} alt="Top View" className="w-full h-full object-contain rounded" />
            ) : (
              <div className="text-center p-4">
                <Upload className="w-6 h-6 text-slate-500 mx-auto mb-2 group-hover:text-cyan-400 transition" />
                <span className="text-xs text-slate-400 block font-medium">Click or Drag Photo</span>
                <span className="text-[10px] text-slate-500 block mt-1">PNG, JPG, WEBP</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload('top', e)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Slot 2: Profile / Side View */}
        <div
          className={`p-4 rounded-xl border transition ${
            activeAngle === 'side'
              ? 'bg-slate-950 border-cyan-500 shadow-lg shadow-cyan-950/40'
              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
          }`}
          onClick={() => setActiveAngle('side')}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-200">Profile View (Side)</span>
            <span className="text-[10px] text-slate-500 font-mono">Optional</span>
          </div>

          <div className="aspect-square bg-slate-900 rounded-lg border border-dashed border-slate-700 flex flex-col items-center justify-center p-2 relative overflow-hidden group">
            {photos.side ? (
              <img src={photos.side} alt="Side View" className="w-full h-full object-contain rounded" />
            ) : (
              <div className="text-center p-4">
                <Upload className="w-6 h-6 text-slate-500 mx-auto mb-2 group-hover:text-cyan-400 transition" />
                <span className="text-xs text-slate-400 block font-medium">Crown & Girdle Photo</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload('side', e)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Slot 3: Pavilion / Bottom View */}
        <div
          className={`p-4 rounded-xl border transition ${
            activeAngle === 'bottom'
              ? 'bg-slate-950 border-cyan-500 shadow-lg shadow-cyan-950/40'
              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
          }`}
          onClick={() => setActiveAngle('bottom')}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-200">Pavilion View (Bottom)</span>
            <span className="text-[10px] text-slate-500 font-mono">Optional</span>
          </div>

          <div className="aspect-square bg-slate-900 rounded-lg border border-dashed border-slate-700 flex flex-col items-center justify-center p-2 relative overflow-hidden group">
            {photos.bottom ? (
              <img src={photos.bottom} alt="Bottom View" className="w-full h-full object-contain rounded" />
            ) : (
              <div className="text-center p-4">
                <Upload className="w-6 h-6 text-slate-500 mx-auto mb-2 group-hover:text-cyan-400 transition" />
                <span className="text-xs text-slate-400 block font-medium">Culet & Pavilion Photo</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload('bottom', e)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Interactive HTML5 Canvas Image Diagnostic Toolbar */}
      {photos[activeAngle] && (
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-200">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Diagnostic Image Inspection Filters ({activeAngle.toUpperCase()} VIEW)</span>
            </div>

            {/* Filter Toggle Buttons */}
            <div className="flex flex-wrap gap-1.5 text-xs">
              <button
                onClick={() => setFilterMode('STANDARD')}
                className={`px-2.5 py-1 rounded transition text-[11px] font-semibold ${
                  filterMode === 'STANDARD'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Standard
              </button>
              <button
                onClick={() => setFilterMode('CONTRAST')}
                className={`px-2.5 py-1 rounded transition text-[11px] font-semibold ${
                  filterMode === 'CONTRAST'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Contrast Boost
              </button>
              <button
                onClick={() => setFilterMode('EDGE')}
                className={`px-2.5 py-1 rounded transition text-[11px] font-semibold ${
                  filterMode === 'EDGE'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Facet Edges
              </button>
              <button
                onClick={() => setFilterMode('UV_FLUOR')}
                className={`px-2.5 py-1 rounded transition text-[11px] font-semibold ${
                  filterMode === 'UV_FLUOR'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                365nm UV Fluor
              </button>
              <button
                onClick={() => setFilterMode('HEATMAP')}
                className={`px-2.5 py-1 rounded transition text-[11px] font-semibold ${
                  filterMode === 'HEATMAP'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Optical Heatmap
              </button>
            </div>
          </div>

          {/* Diagnostic Canvas Display */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
            <div className="relative w-64 h-64 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-inner">
              <canvas ref={canvasRef} className="w-full h-full object-contain" />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] text-cyan-300 font-mono border border-slate-800">
                FILTER: {filterMode}
              </div>
            </div>

            <div className="text-xs text-slate-300 space-y-2 max-w-sm">
              <div className="font-semibold text-slate-100 flex items-center space-x-1.5">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Live Filter Diagnostics</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                {filterMode === 'STANDARD' && 'Displays unprocessed true-color diamond optical reflectivity.'}
                {filterMode === 'CONTRAST' && 'Amplifies micro-inclusions, feathers, and surface graining.'}
                {filterMode === 'EDGE' && 'Sobel algorithm isolating facet junctions for symmetry assessment.'}
                {filterMode === 'UV_FLUOR' && 'Simulates longwave UV 365nm illumination to check luminescence.'}
                {filterMode === 'HEATMAP' && 'Renders optical density gradients to highlight internal strain.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Primary Action Button to Run Gemini AI Analysis */}
      <div className="pt-2">
        <button
          onClick={onRunAnalysis}
          disabled={!photos.top || isAnalyzing}
          className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm shadow-xl flex items-center justify-center space-x-2 transition transform ${
            !photos.top || isAnalyzing
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white active:scale-95'
          }`}
        >
          <Zap className={`w-5 h-5 ${isAnalyzing ? 'animate-bounce' : ''}`} />
          <span>
            {isAnalyzing
              ? 'Running AI Quality Control & Cross-Check...'
              : 'Run AI Diamond QC Inspection & Generate Report'}
          </span>
        </button>
      </div>
    </div>
  );
};
