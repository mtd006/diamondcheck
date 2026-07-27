export type GradingLab = 'GIA' | 'IGI' | 'HRD' | 'AGS';

export type DiamondShape =
  | 'Round'
  | 'Princess'
  | 'Cushion'
  | 'Emerald'
  | 'Oval'
  | 'Radiant'
  | 'Pear'
  | 'Marquise'
  | 'Heart';

export interface CustodyEvent {
  date: string;
  entity: string;
  location: string;
  event: string;
}

export interface ProvenanceData {
  originCountry: string;
  currentVault: string;
  blockchainHash: string;
  custodyChain: CustodyEvent[];
}

export interface CertificateData {
  certNumber: string;
  lab: GradingLab;
  shape: DiamondShape;
  caratWeight: number;
  colorGrade: string;
  clarityGrade: string;
  cutGrade: string;
  polish: string;
  symmetry: string;
  fluorescence: string;
  measurements: string;
  tablePercent: number;
  depthPercent: number;
  crownAngle: number;
  pavilionAngle: number;
  girdle: string;
  culet: string;
  inscription: string;
  keyToSymbols: string[];
  comments: string;
  reportDate: string;
  provenance: ProvenanceData;
}

export interface InclusionItem {
  id: string;
  type:
    | 'Feather'
    | 'Pinpoint'
    | 'Cloud'
    | 'Crystal'
    | 'Needle'
    | 'Extra Facet'
    | 'Chip'
    | 'Internal Graining'
    | 'Indented Natural';
  xPercent: number; // 0 to 100
  yPercent: number; // 0 to 100
  severity: 'Minor' | 'Moderate' | 'Noticeable';
  viewAngle: 'top' | 'side' | 'bottom';
  description: string;
}

export interface AnalysisResult {
  matchScore: number; // 0 to 100
  overallVerdict: 'MATCH_CONFIRMED' | 'MINOR_DISCREPANCY' | 'HIGH_RISK_MISMATCH';
  colorEstimate: string;
  colorMatch: boolean;
  clarityEstimate: string;
  clarityMatch: boolean;
  fluorescenceDetected: string;
  lightPerformanceScore: number;
  brillianceScore: number;
  fireScore: number;
  scintillationScore: number;
  inclusions: InclusionItem[];
  gemologistNotes: string;
  confidenceScore: number;
  analyzedAt: string;
  watermarkHash: string;
}

export interface SessionData {
  sessionId: string;
  token: string;
  createdAt: number;
  expiresAt: number;
  paymentStatus: 'PAID' | 'DEMO' | 'PENDING';
  paymentMethod: 'ZOHO' | 'RAZORPAY' | 'PAYPAL' | 'UPI_QR' | 'INSTANT_DEMO';
  paymentRef: string;
  paymentAmount: number;
  currency: string;
  used: boolean;
  reportGenerated: boolean;
}

export interface ImageAngles {
  top: string | null;
  side: string | null;
  bottom: string | null;
}

export type UserRole = 'ADMIN' | 'MERCHANT' | 'GEMOLOGIST' | 'INSPECTOR' | 'BUYER';

export interface User {
  id: string;
  userId: string; // e.g. mtd006
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  role: UserRole;
  createdAt: string;
  pinRequired?: boolean;
}

export interface InspectionRecord {
  id: string;
  userId: string;
  certNumber: string;
  lab: string;
  verdict: string;
  matchScore: number;
  date: string;
  hash: string;
}

