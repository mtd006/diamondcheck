import { CertificateData } from '../types';

export const SAMPLE_CERTIFICATES: Record<string, CertificateData> = {
  '5213456789': {
    certNumber: '5213456789',
    lab: 'GIA',
    shape: 'Round',
    caratWeight: 1.50,
    colorGrade: 'D',
    clarityGrade: 'VVS1',
    cutGrade: 'Excellent',
    polish: 'Excellent',
    symmetry: 'Excellent',
    fluorescence: 'None',
    measurements: '7.35 - 7.39 x 4.52 mm',
    tablePercent: 57,
    depthPercent: 61.3,
    crownAngle: 34.5,
    pavilionAngle: 40.8,
    girdle: 'Medium to Slightly Thick (faceted)',
    culet: 'None',
    inscription: 'GIA 5213456789',
    keyToSymbols: ['Pinpoint', 'Internal Graining'],
    comments: 'Surface graining is not shown. Additional pinpoints are not shown.',
    reportDate: 'June 14, 2025',
    provenance: {
      originCountry: 'Botswana (Jwaneng Mine)',
      currentVault: 'Malca-Amit Vault, Antwerp',
      blockchainHash: '0x8f2c...9e41b7a2d04',
      custodyChain: [
        { date: '2025-01-10', entity: 'De Beers Group', location: 'Gaborone, Botswana', event: 'Rough Extraction & Sorting' },
        { date: '2025-03-22', entity: 'Diakur Master Cutters', location: 'Antwerp, Belgium', event: 'Precision Polishing & Laser Inscription' },
        { date: '2025-06-14', entity: 'GIA Laboratory', location: 'Carlsbad, CA, USA', event: 'Official Grading & Certificate Issued' },
        { date: '2025-07-02', entity: 'Malca-Amit High-Security Vault', location: 'Antwerp, Belgium', event: 'Vault Deposit & Custody Verification' }
      ]
    }
  },
  '2221948572': {
    certNumber: '2221948572',
    lab: 'GIA',
    shape: 'Round',
    caratWeight: 2.01,
    colorGrade: 'E',
    clarityGrade: 'VS2',
    cutGrade: 'Excellent',
    polish: 'Excellent',
    symmetry: 'Very Good',
    fluorescence: 'Faint',
    measurements: '8.12 - 8.16 x 4.98 mm',
    tablePercent: 58,
    depthPercent: 61.1,
    crownAngle: 35.0,
    pavilionAngle: 40.6,
    girdle: 'Slightly Thick',
    culet: 'None',
    inscription: 'GIA 2221948572',
    keyToSymbols: ['Feather', 'Crystal', 'Cloud'],
    comments: 'Clouds are not shown. Additional feathers are not shown.',
    reportDate: 'April 02, 2025',
    provenance: {
      originCountry: 'Canada (Ekati Mine)',
      currentVault: 'Brink’s Vault, New York',
      blockchainHash: '0x3a91...41c8802f1d9',
      custodyChain: [
        { date: '2024-11-15', entity: 'Arctic Canadian Diamond Company', location: 'NWT, Canada', event: 'Mining & Rough Audit' },
        { date: '2025-02-01', entity: 'Eurostar Diamonds', location: 'New York, USA', event: 'Laser Planning & Faceting' },
        { date: '2025-04-02', entity: 'GIA Laboratory', location: 'New York, NY, USA', event: 'Full Dossier Analysis' },
        { date: '2025-05-18', entity: 'Brink’s Vault', location: 'New York, NY, USA', event: 'Vault Storage & Merchant Transfer' }
      ]
    }
  },
  '6382940123': {
    certNumber: '6382940123',
    lab: 'IGI',
    shape: 'Princess',
    caratWeight: 1.05,
    colorGrade: 'F',
    clarityGrade: 'IF',
    cutGrade: 'Ideal',
    polish: 'Excellent',
    symmetry: 'Excellent',
    fluorescence: 'None',
    measurements: '5.62 x 5.58 x 3.98 mm',
    tablePercent: 68,
    depthPercent: 71.3,
    crownAngle: 12.5,
    pavilionAngle: 54.0,
    girdle: 'Thick',
    culet: 'Pointed',
    inscription: 'IGI 6382940123',
    keyToSymbols: ['None'],
    comments: 'Minor details of polish not shown.',
    reportDate: 'May 20, 2025',
    provenance: {
      originCountry: 'South Africa (Venetia Mine)',
      currentVault: 'Freeport Vault, Geneva',
      blockchainHash: '0x12d4...78a0029b31e',
      custodyChain: [
        { date: '2025-01-05', entity: 'De Beers Venetia', location: 'Limpopo, South Africa', event: 'Rough Ore Recovery' },
        { date: '2025-03-12', entity: 'Geneva Diamond Works', location: 'Geneva, Switzerland', event: 'Princess Ideal Cut Faceting' },
        { date: '2025-05-20', entity: 'IGI Lab', location: 'Antwerp, Belgium', event: 'IGI Laboratory Certification' },
        { date: '2025-06-01', entity: 'Geneva FreePort Vault', location: 'Geneva, Switzerland', event: 'Insured Vault Storage' }
      ]
    }
  }
};

/**
 * Generate synthetic certified data if a user inputs an arbitrary 10-digit certificate number.
 */
export function getOrCreateCertificate(certNum: string, lab: 'GIA' | 'IGI' | 'HRD' | 'AGS' = 'GIA'): CertificateData {
  const clean = certNum.trim().replace(/[^0-9A-Z]/gi, '');
  if (SAMPLE_CERTIFICATES[clean]) {
    return { ...SAMPLE_CERTIFICATES[clean], lab };
  }

  // Generate reproducible deterministic diamond specs based on hash of input string
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = (hash << 5) - hash + clean.charCodeAt(i);
    hash |= 0;
  }
  const posHash = Math.abs(hash);

  const carats = [0.85, 1.01, 1.20, 1.52, 1.75, 2.05, 2.50];
  const colors = ['D', 'E', 'F', 'G', 'H'];
  const clarities = ['VVS1', 'VVS2', 'VS1', 'VS2', 'SI1'];
  const cuts = ['Excellent', 'Very Good', 'Ideal'];
  const shapes: Array<CertificateData['shape']> = ['Round', 'Princess', 'Cushion', 'Oval', 'Emerald'];
  const origins = [
    'Botswana (Jwaneng)',
    'Canada (Ekati Mine)',
    'South Africa (Venetia)',
    'Namibia (Namdeb Offshore)',
    'Australia (Argyle Vault)'
  ];

  const caratWeight = carats[posHash % carats.length];
  const colorGrade = colors[(posHash >> 2) % colors.length];
  const clarityGrade = clarities[(posHash >> 4) % clarities.length];
  const cutGrade = cuts[(posHash >> 3) % cuts.length];
  const shape = shapes[(posHash >> 5) % shapes.length];
  const origin = origins[(posHash >> 6) % origins.length];

  return {
    certNumber: clean || '5213456789',
    lab,
    shape,
    caratWeight,
    colorGrade,
    clarityGrade,
    cutGrade,
    polish: 'Excellent',
    symmetry: 'Excellent',
    fluorescence: posHash % 3 === 0 ? 'Faint' : 'None',
    measurements: `${(6.4 + (caratWeight * 0.9)).toFixed(2)} - ${(6.43 + (caratWeight * 0.9)).toFixed(2)} x ${(3.9 + (caratWeight * 0.5)).toFixed(2)} mm`,
    tablePercent: 57 + (posHash % 4),
    depthPercent: 61 + ((posHash % 15) / 10),
    crownAngle: 34.5,
    pavilionAngle: 40.8,
    girdle: 'Medium to Slightly Thick',
    culet: 'None',
    inscription: `${lab} ${clean || '5213456789'}`,
    keyToSymbols: clarityGrade.startsWith('VVS') ? ['Pinpoint'] : ['Feather', 'Crystal'],
    comments: 'Laser inscription verified on girdle. Grade check completed.',
    reportDate: 'July 15, 2025',
    provenance: {
      originCountry: origin,
      currentVault: 'Malca-Amit Vault, Antwerp',
      blockchainHash: `0x${posHash.toString(16).padEnd(16, 'a')}...88f1`,
      custodyChain: [
        { date: '2025-02-10', entity: 'Primary Extraction Co.', location: origin, event: 'Rough Mining Audit' },
        { date: '2025-05-14', entity: 'Master Diamond Cutters', location: 'Antwerp, Belgium', event: 'Faceting & Laser Engraving' },
        { date: '2025-07-15', entity: `${lab} Laboratory`, location: 'Carlsbad, CA', event: 'Official Dossier Certification' },
        { date: '2025-07-20', entity: 'High-Security Vault', location: 'Antwerp, Belgium', event: 'Secured Merchant Deposit' }
      ]
    }
  };
}
