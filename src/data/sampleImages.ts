/**
 * High quality SVG Data URLs representing multi-angle diamond photos for instant testing.
 */

// Top View - Round Brilliant Diamond with Facets
export const SAMPLE_TOP_DIAMOND = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="%231a2035"/>
      <stop offset="100%" stop-color="%230b0e17"/>
    </radialGradient>
    <radialGradient id="diaSparkle" cx="45%" cy="40%" r="60%">
      <stop offset="0%" stop-color="%23ffffff"/>
      <stop offset="25%" stop-color="%23f0f7ff"/>
      <stop offset="55%" stop-color="%23d8e9ff"/>
      <stop offset="85%" stop-color="%23b0d2fe"/>
      <stop offset="100%" stop-color="%237caef3"/>
    </radialGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
  <rect width="500" height="500" fill="url(%23bgGrad)"/>
  <circle cx="250" cy="250" r="185" fill="%23000000" opacity="0.4" filter="url(%23glow)"/>
  
  <!-- Outer Girdle Polygon -->
  <polygon points="250,65 318,78 376,115 415,171 430,238 418,306 380,364 322,405 254,420 186,407 128,370 88,312 71,245 83,177 121,119 179,78" fill="url(%23diaSparkle)" stroke="%23ffffff" stroke-width="2"/>
  
  <!-- Table Facet (Octagon) -->
  <polygon points="215,185 285,185 315,215 315,285 285,315 215,315 185,285 185,215" fill="%23ffffff" opacity="0.9" stroke="%2394a3b8" stroke-width="1.5"/>
  
  <!-- Star & Kite Facets (Crown) -->
  <line x1="215" y1="185" x2="250" y2="65" stroke="%23475569" stroke-width="1.5"/>
  <line x1="285" y1="185" x2="250" y2="65" stroke="%23475569" stroke-width="1.5"/>
  <line x1="285" y1="185" x2="376" y2="115" stroke="%23475569" stroke-width="1.5"/>
  <line x1="315" y1="215" x2="376" y2="115" stroke="%23475569" stroke-width="1.5"/>
  <line x1="315" y1="215" x2="430" y2="238" stroke="%23475569" stroke-width="1.5"/>
  <line x1="315" y1="285" x2="430" y2="238" stroke="%23475569" stroke-width="1.5"/>
  <line x1="315" y1="285" x2="380" y2="364" stroke="%23475569" stroke-width="1.5"/>
  <line x1="285" y1="315" x2="380" y2="364" stroke="%23475569" stroke-width="1.5"/>
  <line x1="285" y1="315" x2="254" y2="420" stroke="%23475569" stroke-width="1.5"/>
  <line x1="215" y1="315" x2="254" y2="420" stroke="%23475569" stroke-width="1.5"/>
  <line x1="215" y1="315" x2="128" y2="370" stroke="%23475569" stroke-width="1.5"/>
  <line x1="185" y1="285" x2="128" y2="370" stroke="%23475569" stroke-width="1.5"/>
  <line x1="185" y1="285" x2="71" y2="245" stroke="%23475569" stroke-width="1.5"/>
  <line x1="185" y1="215" x2="71" y2="245" stroke="%23475569" stroke-width="1.5"/>
  <line x1="185" y1="215" x2="121" y2="119" stroke="%23475569" stroke-width="1.5"/>
  <line x1="215" y1="185" x2="121" y2="119" stroke="%23475569" stroke-width="1.5"/>

  <!-- Subtle Inclusion Marking for Visual QC test -->
  <circle cx="290" cy="230" r="2.5" fill="%23334155" opacity="0.8"/>
  <path d="M 220 280 Q 225 282 230 278" stroke="%23475569" stroke-width="1.2" fill="none"/>

  <text x="250" y="470" text-anchor="middle" fill="%23cbd5e1" font-family="sans-serif" font-size="14" font-weight="600">TABLE VIEW (TOP) - 1.50 CT D-VVS1</text>
</svg>`;

// Side View - Diamond Profile
export const SAMPLE_SIDE_DIAMOND = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <radialGradient id="bgGrad2" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="%231a2035"/>
      <stop offset="100%" stop-color="%230b0e17"/>
    </radialGradient>
    <linearGradient id="sideGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%23ffffff"/>
      <stop offset="30%" stop-color="%23e2e8f0"/>
      <stop offset="70%" stop-color="%2394a3b8"/>
      <stop offset="100%" stop-color="%2364748b"/>
    </linearGradient>
  </defs>
  <rect width="500" height="500" fill="url(%23bgGrad2)"/>
  
  <!-- Crown Profile -->
  <polygon points="180,160 320,160 410,230 90,230" fill="url(%23sideGrad)" stroke="%23334155" stroke-width="2"/>
  
  <!-- Girdle Line -->
  <rect x="86" y="230" width="328" height="12" rx="2" fill="%23cbd5e1" stroke="%23475569" stroke-width="1.5"/>
  
  <!-- Pavilion Cone Profile -->
  <polygon points="90,242 410,242 250,410" fill="url(%23sideGrad)" stroke="%23334155" stroke-width="2"/>
  
  <!-- Internal Ray Reflections -->
  <line x1="180" y1="160" x2="250" y2="410" stroke="%23ffffff" stroke-width="1" opacity="0.6"/>
  <line x1="320" y1="160" x2="250" y2="410" stroke="%23ffffff" stroke-width="1" opacity="0.6"/>
  <line x1="250" y1="160" x2="150" y2="242" stroke="%23ffffff" stroke-width="1" opacity="0.4"/>
  <line x1="250" y1="160" x2="350" y2="242" stroke="%23ffffff" stroke-width="1" opacity="0.4"/>

  <text x="250" y="460" text-anchor="middle" fill="%23cbd5e1" font-family="sans-serif" font-size="14" font-weight="600">PROFILE VIEW (SIDE) - CROWN & PAVILION</text>
</svg>`;

// Bottom View - Diamond Pavilion Facets
export const SAMPLE_BOTTOM_DIAMOND = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <radialGradient id="bgGrad3" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="%231a2035"/>
      <stop offset="100%" stop-color="%230b0e17"/>
    </radialGradient>
    <radialGradient id="pavilGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="%23ffffff"/>
      <stop offset="40%" stop-color="%23e2e8f0"/>
      <stop offset="100%" stop-color="%23334155"/>
    </radialGradient>
  </defs>
  <rect width="500" height="500" fill="url(%23bgGrad3)"/>
  
  <polygon points="250,70 377,123 430,250 377,377 250,430 123,377 70,250 123,123" fill="url(%23pavilGrad)" stroke="%23ffffff" stroke-width="2"/>
  
  <!-- Culet Center Point -->
  <circle cx="250" cy="250" r="4" fill="%230f172a"/>
  
  <!-- Pavilion Main Lines from Culet to Girdle Vertices -->
  <line x1="250" y1="250" x2="250" y2="70" stroke="%231e293b" stroke-width="1.5"/>
  <line x1="250" y1="250" x2="377" y2="123" stroke="%231e293b" stroke-width="1.5"/>
  <line x1="250" y1="250" x2="430" y2="250" stroke="%231e293b" stroke-width="1.5"/>
  <line x1="250" y1="250" x2="377" y2="377" stroke="%231e293b" stroke-width="1.5"/>
  <line x1="250" y1="250" x2="250" y2="430" stroke="%231e293b" stroke-width="1.5"/>
  <line x1="250" y1="250" x2="123" y2="377" stroke="%231e293b" stroke-width="1.5"/>
  <line x1="250" y1="250" x2="70" y2="250" stroke="%231e293b" stroke-width="1.5"/>
  <line x1="250" y1="250" x2="123" y2="123" stroke="%231e293b" stroke-width="1.5"/>

  <text x="250" y="470" text-anchor="middle" fill="%23cbd5e1" font-family="sans-serif" font-size="14" font-weight="600">PAVILION VIEW (BOTTOM) - CULET FOCUS</text>
</svg>`;
