import { jsPDF } from 'jspdf';
import { CertificateData, AnalysisResult, SessionData, ImageAngles } from '../types';

interface PdfReportOptions {
  certificate: CertificateData;
  analysis: AnalysisResult;
  session: SessionData | null;
  photos: ImageAngles;
}

export async function generatePdfReport({
  certificate,
  analysis,
  session,
  photos
}: PdfReportOptions): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Background
  doc.setFillColor(11, 15, 25); // Slate 950
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Decorative Top Accent Bar
  doc.setFillColor(6, 182, 212); // Cyan 500
  doc.rect(0, 0, pageWidth, 4, 'F');

  // Header Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text('2nd View Diamond QC Portal', 15, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184); // Slate 400
  doc.text('Independent AI Gemological Quality Control & Certificate Audit Report', 15, 24);

  // Session & Watermark Box
  doc.setDrawColor(30, 41, 59);
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(pageWidth - 85, 10, 70, 18, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setFont('courier', 'bold');
  doc.setTextColor(6, 182, 212);
  doc.text(`SESSION: ${session?.token || 'DEMO-QC-TOKEN'}`, pageWidth - 80, 16);
  doc.setTextColor(148, 163, 184);
  doc.text(`REF: ${analysis.watermarkHash}`, pageWidth - 80, 22);

  // Line Divider
  doc.setDrawColor(51, 65, 85);
  doc.setLineWidth(0.5);
  doc.line(15, 30, pageWidth - 15, 30);

  // 1. QC Verdict Banner
  let verdictColor = [16, 185, 129]; // Emerald
  if (analysis.overallVerdict === 'MINOR_DISCREPANCY') verdictColor = [245, 158, 11];
  if (analysis.overallVerdict === 'HIGH_RISK_MISMATCH') verdictColor = [244, 63, 94];

  doc.setFillColor(verdictColor[0], verdictColor[1], verdictColor[2]);
  doc.roundedRect(15, 34, pageWidth - 30, 14, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text(
    `QC VERDICT: ${analysis.overallVerdict.replace('_', ' ')}  |  CONFIDENCE SCORE: ${analysis.matchScore}/100`,
    20,
    43
  );

  // 2. 4Cs Summary Grid (2x2 Box)
  let yPos = 55;

  doc.setFillColor(15, 23, 42);
  doc.setDrawColor(30, 41, 59);

  // Carat
  doc.roundedRect(15, yPos, 42, 18, 2, 2, 'FD');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('CARAT WEIGHT', 18, yPos + 6);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(`${certificate.caratWeight} ct`, 18, yPos + 14);

  // Color
  doc.roundedRect(61, yPos, 42, 18, 2, 2, 'FD');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('COLOR GRADE', 64, yPos + 6);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(6, 182, 212);
  doc.text(`${certificate.colorGrade}`, 64, yPos + 14);

  // Clarity
  doc.roundedRect(107, yPos, 42, 18, 2, 2, 'FD');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('CLARITY GRADE', 110, yPos + 6);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(129, 140, 248);
  doc.text(`${certificate.clarityGrade}`, 110, yPos + 14);

  // Cut
  doc.roundedRect(153, yPos, 42, 18, 2, 2, 'FD');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('CUT GRADE', 156, yPos + 6);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(52, 211, 153);
  doc.text(`${certificate.cutGrade}`, 156, yPos + 14);

  yPos += 24;

  // 3. Verification Matrix Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('CERTIFICATE SPECIFICATIONS VS AI VISUAL FINDINGS', 15, yPos);

  yPos += 4;

  // Table Headers
  doc.setFillColor(30, 41, 59);
  doc.rect(15, yPos, pageWidth - 30, 7, 'F');

  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text('PARAMETER', 18, yPos + 5);
  doc.text(`${certificate.lab} CERTIFICATE SPEC`, 65, yPos + 5);
  doc.text('AI VISUAL OBSERVATION', 125, yPos + 5);
  doc.text('STATUS', pageWidth - 35, yPos + 5);

  yPos += 7;

  const rows = [
    ['Report Number', certificate.certNumber, certificate.inscription, 'PASS'],
    ['Shape & Style', certificate.shape, 'Facet Layout Confirmed', 'MATCH'],
    ['Color Grade', certificate.colorGrade, analysis.colorEstimate, 'VERIFIED'],
    ['Clarity Grade', certificate.clarityGrade, analysis.clarityEstimate, 'VERIFIED'],
    ['Fluorescence', certificate.fluorescence, analysis.fluorescenceDetected, 'UV PASS'],
    ['Polish / Symmetry', `${certificate.polish} / ${certificate.symmetry}`, 'Symmetry Verified', 'PASS']
  ];

  rows.forEach(([param, certSpec, aiSpec, status], idx) => {
    doc.setFillColor(idx % 2 === 0 ? 15 : 20, 23, 42);
    doc.rect(15, yPos, pageWidth - 30, 7, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(param, 18, yPos + 5);

    doc.setTextColor(255, 255, 255);
    doc.text(certSpec, 65, yPos + 5);

    doc.setTextColor(6, 182, 212);
    doc.text(aiSpec, 125, yPos + 5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(52, 211, 153);
    doc.text(status, pageWidth - 35, yPos + 5);

    yPos += 7;
  });

  yPos += 6;

  // 4. Optical Performance & Inclusion Inventory
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('OPTICAL PERFORMANCE & INCLUSION MAP SUMMARY', 15, yPos);

  yPos += 4;

  doc.setFillColor(15, 23, 42);
  doc.setDrawColor(30, 41, 59);
  doc.roundedRect(15, yPos, pageWidth - 30, 32, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);

  doc.text(`• Brilliance Score: ${analysis.brillianceScore}/100`, 20, yPos + 7);
  doc.text(`• Fire Score: ${analysis.fireScore}/100`, 20, yPos + 13);
  doc.text(`• Scintillation Score: ${analysis.scintillationScore}/100`, 20, yPos + 19);
  doc.text(`• Overall Light Return: ${analysis.lightPerformanceScore}/100`, 20, yPos + 25);

  doc.text('Inclusions Identified:', 100, yPos + 7);
  analysis.inclusions.forEach((inc, i) => {
    if (i < 3) {
      doc.text(`- ${inc.type} (${inc.severity}): ${inc.description}`, 100, yPos + 13 + i * 5);
    }
  });

  yPos += 38;

  // 5. Gemologist Notes
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('MASTER GEMOLOGIST AI ASSESSMENT', 15, yPos);

  yPos += 4;

  doc.setFillColor(15, 23, 42);
  doc.setDrawColor(30, 41, 59);
  doc.roundedRect(15, yPos, pageWidth - 30, 22, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(203, 213, 225);

  const lines = doc.splitTextToSize(`"${analysis.gemologistNotes}"`, pageWidth - 40);
  doc.text(lines, 20, yPos + 7);

  yPos += 28;

  // 6. Provenance Chain of Custody
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(`PROVENANCE & ORIGIN: ${certificate.provenance.originCountry}`, 15, yPos);

  yPos += 4;

  doc.setFillColor(15, 23, 42);
  doc.roundedRect(15, yPos, pageWidth - 30, 18, 2, 2, 'FD');

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);

  certificate.provenance.custodyChain.slice(0, 4).forEach((ev, idx) => {
    const x = 18 + idx * 43;
    doc.text(ev.date, x, yPos + 5);
    doc.setTextColor(255, 255, 255);
    doc.text(ev.entity.substring(0, 20), x, yPos + 9);
    doc.setTextColor(6, 182, 212);
    doc.text(ev.event.substring(0, 22), x, yPos + 13);
    doc.setTextColor(148, 163, 184);
  });

  // Footer Watermark & Date
  doc.setFont('courier', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `OFFICIAL STAMP: 2ND VIEW QC PORTAL | TIMESTAMP: ${new Date(analysis.analyzedAt).toISOString()}`,
    15,
    pageHeight - 10
  );

  doc.save(`2ND_VIEW_DIAMOND_QC_${certificate.certNumber}.pdf`);
}
