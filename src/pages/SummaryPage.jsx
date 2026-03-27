import React, { useState } from 'react';
import {
  RagDot,
  RagBadge,
  TrendIcon,
  plantOverallRag,
  topRisk,
  countRedKpis,
  computeSeverityIndex,
  overallOperationRag,
} from '../components/shared';

// ---------------------------------------------------------------------------
// Design tokens
// ---------------------------------------------------------------------------
const glass = {
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 16,
};

const glassStrong = {
  background: 'rgba(255,255,255,0.08)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: 16,
};

// ---------------------------------------------------------------------------
// SECTION 1: Hero Banner
// ---------------------------------------------------------------------------
function HeroBanner({ kpiData, plants, kpis }) {
  const score = computeSeverityIndex(kpiData, plants, kpis);
  const scoreColor = score > 65 ? '#ef4444' : score >= 40 ? '#f59e0b' : '#22c55e';
  const scoreLabel = score > 65 ? 'CRITICAL' : score >= 40 ? 'ELEVATED' : 'STABLE';
  const circumference = 2 * Math.PI * 52;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div
      style={{
        ...glass,
        background: 'linear-gradient(135deg, rgba(127,0,0,0.25) 0%, rgba(30,10,10,0.35) 50%, rgba(10,10,30,0.3) 100%)',
        border: '1px solid rgba(239,68,68,0.3)',
        borderRadius: 20,
        padding: '28px 32px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle glow */}
      <div style={{
        position: 'absolute', top: -60, left: -60, width: 200, height: 200,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(239,68,68,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
        {/* Left: text */}
        <div style={{ flex: 1, minWidth: 280 }}>
          {/* Pulsing alert + title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <span style={{ position: 'relative', flexShrink: 0, width: 14, height: 14 }}>
              <span style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                background: '#ef4444', opacity: 0.6,
                animation: 'ping 1.4s cubic-bezier(0,0,0.2,1) infinite',
              }} />
              <span style={{
                position: 'relative', display: 'block', width: 14, height: 14,
                borderRadius: '50%', background: '#ef4444',
                boxShadow: '0 0 10px rgba(239,68,68,0.8)',
              }} />
            </span>
            <h1 style={{
              fontSize: 20, fontWeight: 900, letterSpacing: '0.04em',
              color: '#fff', lineHeight: 1.2, margin: 0,
              textShadow: '0 0 20px rgba(239,68,68,0.5)',
            }}>
              ASEAN ME CRISIS — STRAIT OF HORMUZ CLOSURE
            </h1>
          </div>

          <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.6, margin: '0 0 8px', maxWidth: 560 }}>
            US military strike on Iran (13 March 2026) triggered closure of the Strait of Hormuz,
            disrupting ~21% of global oil supply. ASEAN manufacturing operations face elevated
            cost, supply shortfall, and energy security risk.
          </p>
          <p style={{ color: '#94a3b8', fontSize: 12, marginBottom: 20 }}>
            Crisis declared: 13 March 2026&nbsp;&nbsp;·&nbsp;&nbsp;Status as of: 27 March 2026&nbsp;&nbsp;·&nbsp;&nbsp;Day 14
          </p>

          {/* Stat pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {[
              { icon: '🏭', label: '7 Plants Monitored', color: 'rgba(239,68,68,0.25)', border: 'rgba(239,68,68,0.5)' },
              { icon: '🌏', label: '4 Countries', color: 'rgba(245,158,11,0.2)', border: 'rgba(245,158,11,0.5)' },
              { icon: '📅', label: 'Crisis Day 14', color: 'rgba(99,102,241,0.2)', border: 'rgba(99,102,241,0.4)' },
            ].map(({ icon, label, color, border }) => (
              <span key={label} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', borderRadius: 999,
                background: color, border: `1px solid ${border}`,
                color: '#e2e8f0', fontSize: 13, fontWeight: 600,
              }}>
                {icon} {label}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Severity ring */}
        <div style={{ flexShrink: 0, textAlign: 'center' }}>
          <p style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', marginBottom: 8, textTransform: 'uppercase' }}>
            Crisis Severity Index
          </p>
          <div style={{ position: 'relative', width: 130, height: 130, margin: '0 auto' }}>
            <svg width="130" height="130" viewBox="0 0 130 130">
              {/* Track */}
              <circle cx="65" cy="65" r="52" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
              {/* Progress */}
              <circle
                cx="65" cy="65" r="52"
                fill="none"
                stroke={scoreColor}
                strokeWidth="10"
                strokeDasharray={`${circumference}`}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                transform="rotate(-90 65 65)"
                style={{ filter: `drop-shadow(0 0 8px ${scoreColor})`, transition: 'stroke-dashoffset 0.8s ease' }}
              />
              {/* Score text */}
              <text x="65" y="60" textAnchor="middle" fontSize="30" fontWeight="900" fill={scoreColor} style={{ filter: `drop-shadow(0 0 6px ${scoreColor})` }}>
                {score}
              </text>
              <text x="65" y="76" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.5)">/ 100</text>
            </svg>
          </div>
          <span style={{
            display: 'inline-block', marginTop: 8,
            padding: '3px 12px', borderRadius: 999,
            background: scoreColor, color: '#fff',
            fontSize: 11, fontWeight: 800, letterSpacing: '0.1em',
            boxShadow: `0 0 12px ${scoreColor}`,
          }}>
            {scoreLabel}
          </span>
        </div>
      </div>

      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SECTION 2: ASEAN SVG Map
// ---------------------------------------------------------------------------

// RAG fill + stroke lookup
function countryRagColors(rag) {
  if (rag === 'red')   return { fill: 'rgba(220,38,38,0.35)',  stroke: 'rgba(220,38,38,0.8)' };
  if (rag === 'amber') return { fill: 'rgba(217,119,6,0.35)', stroke: 'rgba(217,119,6,0.8)' };
  if (rag === 'green') return { fill: 'rgba(22,163,74,0.35)', stroke: 'rgba(22,163,74,0.8)' };
  return { fill: 'rgba(100,116,139,0.22)', stroke: 'rgba(100,116,139,0.45)' };
}

// Transform lon/lat to SVG coords: x = (lon-90)*15, y = (27-lat)*15
function ll(lon, lat) { return `${(lon - 90) * 15},${(27 - lat) * 15}`; }

// Build polygon points string from array of [lon, lat]
function pts(arr) { return arr.map(([lo, la]) => ll(lo, la)).join(' '); }

// Country shapes (approximate outlines as polygon vertices [lon, lat])
const SHAPES = {
  MM: pts([[92,28],[96,26],[99,26],[101,22],[101,18],[99,16],[98,14],[97,14],[97,18],[95,20],[95,22],[92,24],[90,22],[88,20],[88,24],[90,28]]),
  TH: pts([[98,20],[102,20],[102,16],[100,14],[100,12],[101,10],[100,8],[99,6],[98,6],[98,8],[97,10],[97,13],[97,15],[98,16],[98,18]]),
  LA: pts([[100,22],[104,22],[106,20],[106,18],[104,16],[102,16],[100,18],[100,20]]),
  VN: pts([[104,22],[108,22],[108,18],[106,16],[106,14],[104,12],[104,10],[106,8],[105,8],[103,10],[103,14],[104,16],[104,18],[104,20]]),
  KH: pts([[103,14],[106,14],[106,12],[104,10],[102,10],[102,12]]),
  // Malaysia peninsula
  MY_W: pts([[99.6,6.5],[103.5,6.5],[104,4],[103,2],[101,2],[100,3],[99.6,5]]),
  // Malaysia Borneo
  MY_E: pts([[109,7],[117,7],[118,5],[117,3],[115,3],[112,4],[109,5]]),
  BN:  pts([[114,5],[115.5,5],[115.5,4.2],[114,4.2]]),
  // Philippines: Luzon + Mindanao
  PH_L: pts([[120,18],[122,18],[122,16],[121,14],[120,12],[119,14],[119,16]]),
  PH_M: pts([[121,10],[126,10],[126,7],[124,6],[122,6],[120,7],[120,8]]),
  // Indonesia islands
  ID_S:  pts([[95,6],[104,6],[106,2],[104,0],[100,-2],[97,-2],[95,0],[95,4]]),
  ID_J:  pts([[104,-6],[108,-6],[112,-7],[114,-7],[111,-9],[107,-9],[104,-8]]),
  ID_K:  pts([[108,2],[117,2],[118,0],[117,-2],[114,-4],[110,-4],[108,-2],[108,0]]),
  ID_SU: pts([[120,0],[123,2],[124,0],[125,-2],[124,-4],[122,-5],[120,-4],[120,-2]]),
  ID_P:  pts([[131,-2],[141,-2],[141,-8],[138,-8],[131,-4]]),
  TL:    pts([[124,-8],[127,-8],[127,-9.5],[124,-9.5]]),
};

// Label centers [lon, lat]
const LABELS = {
  MM: [96, 21],
  TH: [100.5, 14],
  LA: [103, 19],
  VN: [106, 15],
  KH: [104, 12],
  MY: [101.5, 4],
  BN: [114.7, 4.6],
  SG: [103.8, 1.35],
  PH: [122, 12],
  ID: [117, -2],
  TL: [125.5, -8.8],
};

// Singapore dot [lon, lat]
const SG_POS = [103.8, 1.35];

function AseanMap({ plants = [], kpiData = {} }) {
  const [hovered, setHovered] = useState(null);

  // Compute worst RAG per country from tracked plants
  function countryWorstRag(countryCode) {
    const countryPlants = plants.filter(p =>
      (p.countryCode === countryCode) ||
      (countryCode === 'MY' && (p.countryCode === 'MY' || p.country === 'Malaysia')) ||
      (countryCode === 'ID' && (p.countryCode === 'ID' || p.country === 'Indonesia')) ||
      (countryCode === 'TH' && (p.countryCode === 'TH' || p.country === 'Thailand')) ||
      (countryCode === 'VN' && (p.countryCode === 'VN' || p.country === 'Vietnam'))
    );
    if (!countryPlants.length) return null;
    const rags = countryPlants.map(p => plantOverallRag(kpiData, p.id));
    if (rags.includes('red')) return 'red';
    if (rags.includes('amber')) return 'amber';
    return 'green';
  }

  const TRACKED = ['TH', 'MY', 'VN', 'ID'];
  function getColors(code) {
    if (TRACKED.includes(code)) {
      const rag = countryWorstRag(code);
      return countryRagColors(rag);
    }
    return { fill: 'rgba(100,116,139,0.18)', stroke: 'rgba(100,116,139,0.4)' };
  }

  // Polygon component
  function Poly({ id, points, label, labelPos }) {
    const { fill, stroke } = getColors(id);
    const isHov = hovered === id;
    return (
      <g
        onMouseEnter={() => setHovered(id)}
        onMouseLeave={() => setHovered(null)}
        style={{ cursor: 'pointer' }}
      >
        <polygon
          points={points}
          fill={isHov ? fill.replace(/[\d.]+\)$/, m => String(Math.min(1, parseFloat(m) + 0.2)) + ')') : fill}
          stroke={stroke}
          strokeWidth={isHov ? 2 : 1}
          style={{ transition: 'all 0.15s ease' }}
        />
        {labelPos && (
          <text
            x={(labelPos[0] - 90) * 15}
            y={(27 - labelPos[1]) * 15}
            textAnchor="middle"
            fontSize="7"
            fontWeight="600"
            fill="rgba(255,255,255,0.75)"
            style={{ pointerEvents: 'none', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
          >
            {id === 'MY' ? 'MY' : id === 'ID' ? 'ID' : id}
          </text>
        )}
      </g>
    );
  }

  return (
    <div style={{ ...glass, padding: '24px 28px' }}>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ color: '#f8fafc', fontSize: 16, fontWeight: 800, margin: 0, letterSpacing: '0.03em' }}>
          ASEAN Oil Supply Risk Map — Strait of Hormuz Crisis
        </h2>
        <p style={{ color: '#94a3b8', fontSize: 12, margin: '4px 0 0' }}>
          Country fill reflects worst-case RAG across monitored plants
        </p>
      </div>

      <div style={{
        borderRadius: 12, overflow: 'hidden',
        background: 'linear-gradient(160deg, rgba(3,10,30,0.9) 0%, rgba(5,18,50,0.85) 60%, rgba(2,8,20,0.95) 100%)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}>
        <svg viewBox="0 0 860 600" style={{ width: '100%', display: 'block' }}>
          {/* Ocean gradient */}
          <defs>
            <radialGradient id="oceanGrad" cx="50%" cy="60%" r="70%">
              <stop offset="0%" stopColor="rgba(14,40,90,0.6)" />
              <stop offset="100%" stopColor="rgba(5,10,30,0.95)" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          <rect width="860" height="600" fill="url(#oceanGrad)" />

          {/* Subtle grid lines */}
          {[95,100,105,110,115,120,125,130,135,140].map(lon => (
            <line key={lon}
              x1={(lon-90)*15} y1="0" x2={(lon-90)*15} y2="600"
              stroke="rgba(255,255,255,0.04)" strokeWidth="1"
            />
          ))}
          {[25,20,15,10,5,0,-5,-10].map(lat => (
            <line key={lat}
              x1="0" y1={(27-lat)*15} x2="860" y2={(27-lat)*15}
              stroke="rgba(255,255,255,0.04)" strokeWidth="1"
            />
          ))}

          {/* Myanmar */}
          <Poly id="MM" points={SHAPES.MM} labelPos={LABELS.MM} />
          {/* Thailand */}
          <Poly id="TH" points={SHAPES.TH} labelPos={LABELS.TH} />
          {/* Laos */}
          <Poly id="LA" points={SHAPES.LA} labelPos={LABELS.LA} />
          {/* Vietnam */}
          <Poly id="VN" points={SHAPES.VN} labelPos={LABELS.VN} />
          {/* Cambodia */}
          <Poly id="KH" points={SHAPES.KH} labelPos={LABELS.KH} />
          {/* Malaysia peninsula */}
          <Poly id="MY" points={SHAPES.MY_W} labelPos={LABELS.MY} />
          {/* Malaysia Borneo */}
          <g onMouseEnter={() => setHovered('MY')} onMouseLeave={() => setHovered(null)} style={{ cursor: 'pointer' }}>
            <polygon
              points={SHAPES.MY_E}
              fill={hovered === 'MY' ? getColors('MY').fill.replace(/[\d.]+\)$/, m => String(Math.min(1, parseFloat(m) + 0.2)) + ')') : getColors('MY').fill}
              stroke={getColors('MY').stroke}
              strokeWidth={hovered === 'MY' ? 2 : 1}
              style={{ transition: 'all 0.15s ease' }}
            />
            <text
              x={(114 - 90) * 15} y={(27 - 5) * 15}
              textAnchor="middle" fontSize="6" fontWeight="600"
              fill="rgba(255,255,255,0.65)" style={{ pointerEvents: 'none' }}
            >MY-B</text>
          </g>
          {/* Brunei */}
          <Poly id="BN" points={SHAPES.BN} labelPos={LABELS.BN} />
          {/* Singapore dot */}
          <g style={{ cursor: 'pointer' }} onMouseEnter={() => setHovered('SG')} onMouseLeave={() => setHovered(null)}>
            <circle
              cx={(SG_POS[0]-90)*15} cy={(27-SG_POS[1])*15} r={hovered === 'SG' ? 6 : 4}
              fill="rgba(100,116,139,0.6)" stroke="rgba(148,163,184,0.8)" strokeWidth="1"
              style={{ transition: 'all 0.15s ease' }}
            />
            <text x={(SG_POS[0]-90)*15} y={(27-SG_POS[1])*15 - 7}
              textAnchor="middle" fontSize="6" fill="rgba(255,255,255,0.6)"
              style={{ pointerEvents: 'none' }}>SG</text>
          </g>
          {/* Philippines */}
          <Poly id="PH" points={SHAPES.PH_L} labelPos={null} />
          <g onMouseEnter={() => setHovered('PH')} onMouseLeave={() => setHovered(null)} style={{ cursor: 'pointer' }}>
            <polygon
              points={SHAPES.PH_M}
              fill={hovered === 'PH' ? 'rgba(120,130,155,0.35)' : 'rgba(100,116,139,0.18)'}
              stroke="rgba(100,116,139,0.4)" strokeWidth={hovered === 'PH' ? 2 : 1}
              style={{ transition: 'all 0.15s ease' }}
            />
          </g>
          <text x={(LABELS.PH[0]-90)*15} y={(27-LABELS.PH[1])*15}
            textAnchor="middle" fontSize="7" fontWeight="600" fill="rgba(255,255,255,0.65)"
            style={{ pointerEvents: 'none' }}>PH</text>

          {/* Indonesia */}
          {[SHAPES.ID_S, SHAPES.ID_J, SHAPES.ID_K, SHAPES.ID_SU, SHAPES.ID_P].map((shape, i) => (
            <g key={i} onMouseEnter={() => setHovered('ID')} onMouseLeave={() => setHovered(null)} style={{ cursor: 'pointer' }}>
              <polygon
                points={shape}
                fill={hovered === 'ID' ? getColors('ID').fill.replace(/[\d.]+\)$/, m => String(Math.min(1, parseFloat(m) + 0.2)) + ')') : getColors('ID').fill}
                stroke={getColors('ID').stroke}
                strokeWidth={hovered === 'ID' ? 2 : 1}
                style={{ transition: 'all 0.15s ease' }}
              />
            </g>
          ))}
          <text x={(LABELS.ID[0]-90)*15} y={(27-LABELS.ID[1])*15}
            textAnchor="middle" fontSize="7" fontWeight="600" fill="rgba(255,255,255,0.65)"
            style={{ pointerEvents: 'none' }}>ID</text>

          {/* Timor-Leste */}
          <Poly id="TL" points={SHAPES.TL} labelPos={LABELS.TL} />

          {/* ⚡ Strait of Hormuz callout box — top right */}
          <g>
            <rect x="660" y="14" width="188" height="46" rx="8"
              fill="rgba(239,68,68,0.18)" stroke="rgba(239,68,68,0.6)" strokeWidth="1.5" />
            <text x="754" y="33" textAnchor="middle" fontSize="8.5" fontWeight="800"
              fill="#fca5a5">⚡ STRAIT OF HORMUZ</text>
            <text x="754" y="47" textAnchor="middle" fontSize="8" fontWeight="700"
              fill="rgba(239,68,68,0.9)">CLOSED — Day 14</text>
          </g>
          {/* Arrow pointing east off map */}
          <g>
            <line x1="848" y1="37" x2="848" y2="37" stroke="rgba(239,68,68,0.5)" strokeWidth="1.5" />
          </g>

          {/* Compass rose — bottom right */}
          <g transform="translate(820, 540)">
            <circle r="18" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
            <text x="0" y="-7" textAnchor="middle" fontSize="9" fontWeight="800" fill="rgba(255,255,255,0.7)">N</text>
            <polygon points="0,-16 3,-6 0,-9 -3,-6" fill="rgba(255,255,255,0.7)" />
            <text x="0" y="16" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.35)">S</text>
            <text x="14" y="3" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.35)">E</text>
            <text x="-14" y="3" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.35)">W</text>
          </g>
        </svg>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 14, justifyContent: 'center' }}>
        {[
          { color: '#ef4444', label: 'Very High Risk' },
          { color: '#f59e0b', label: 'High Risk' },
          { color: '#22c55e', label: 'Moderate / Lower' },
          { color: 'rgba(100,116,139,0.55)', label: 'Not Tracked' },
        ].map(({ color, label }) => (
          <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: 12 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0, boxShadow: color !== 'rgba(100,116,139,0.55)' ? `0 0 6px ${color}` : 'none' }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SECTION 3: Status Grid — Overall RAG + 4 Country Cards
// ---------------------------------------------------------------------------
const COUNTRY_INFO_STATIC = {
  TH: { flag: '🇹🇭', name: 'Thailand', dependency: 38, reserve: 90, exposure: 'MODERATE' },
  MY: { flag: '🇲🇾', name: 'Malaysia', dependency: 62, reserve: 45, exposure: 'HIGH' },
  VN: { flag: '🇻🇳', name: 'Vietnam',  dependency: 22, reserve: 60, exposure: 'LOWER' },
  ID: { flag: '🇮🇩', name: 'Indonesia', dependency: 71, reserve: 30, exposure: 'VERY HIGH' },
};

function exposureBadgeColor(exp) {
  const e = (exp || '').toLowerCase();
  if (e.includes('very')) return '#dc2626';
  if (e === 'high') return '#dc2626';
  if (e === 'moderate') return '#d97706';
  return '#16a34a';
}

function StatusGrid({ kpiData, plants, countryInfo }) {
  const rag = overallOperationRag(kpiData, plants);
  const ragColors = { red: '#ef4444', amber: '#f59e0b', green: '#22c55e' };
  const ragColor = ragColors[rag] || '#22c55e';
  const ragLabels = {
    red: 'CRITICAL — Immediate action required across multiple plants',
    amber: 'ELEVATED RISK — Active mitigation in progress',
    green: 'STABLE — Monitoring in progress',
  };

  const COUNTRY_ORDER = ['TH', 'MY', 'VN', 'ID'];

  return (
    <div>
      {/* Overall banner */}
      <div style={{
        ...glass,
        background: `linear-gradient(135deg, ${ragColor}22 0%, rgba(15,23,42,0.6) 100%)`,
        border: `1px solid ${ragColor}44`,
        borderRadius: 16, padding: '16px 24px',
        display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16,
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: '50%',
          background: ragColor, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 20px ${ragColor}80`,
        }}>
          <span style={{ color: '#fff', fontWeight: 900, fontSize: 11, letterSpacing: '0.05em' }}>
            {rag.toUpperCase()}
          </span>
        </div>
        <div>
          <p style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 3px' }}>
            Overall Operation Status
          </p>
          <p style={{ color: ragColor, fontWeight: 700, fontSize: 15, margin: 0 }}>
            {ragLabels[rag]}
          </p>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <RagBadge status={rag} />
        </div>
      </div>

      {/* 4 Country cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {COUNTRY_ORDER.map(code => {
          const info = countryInfo?.[code] || COUNTRY_INFO_STATIC[code] || {};
          const staticInfo = COUNTRY_INFO_STATIC[code] || {};
          const flag = info.flag || staticInfo.flag;
          const name = info.name || staticInfo.name;
          const dep = info.hormuzDependency ?? staticInfo.dependency ?? 0;
          const reserve = info.strategicReserveDays ?? staticInfo.reserve ?? 0;
          const exposure = info.exposureLevel || staticInfo.exposure || '';
          const badgeColor = exposureBadgeColor(exposure);
          const plantCount = plants.filter(p => p.countryCode === code).length;

          // Worst RAG for this country
          const countryPlants = plants.filter(p => p.countryCode === code);
          const rags = countryPlants.map(p => plantOverallRag(kpiData, p.id));
          const worstRag = rags.includes('red') ? 'red' : rags.includes('amber') ? 'amber' : rags.length ? 'green' : null;
          const countryRagColor = ragColors[worstRag] || '#64748b';

          return (
            <div key={code} style={{
              ...glass,
              border: `1px solid ${badgeColor}33`,
              background: `linear-gradient(160deg, ${badgeColor}11 0%, rgba(15,23,42,0.4) 100%)`,
              padding: '16px', borderRadius: 16,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 22 }}>{flag}</span>
                <div>
                  <p style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 14, margin: 0, lineHeight: 1.2 }}>{name}</p>
                  <p style={{ color: '#64748b', fontSize: 11, margin: 0 }}>{code}</p>
                </div>
              </div>
              {/* Exposure badge */}
              <div style={{ marginBottom: 10 }}>
                <span style={{
                  display: 'inline-block', padding: '2px 10px', borderRadius: 999,
                  background: badgeColor, color: '#fff',
                  fontSize: 10, fontWeight: 800, letterSpacing: '0.08em',
                }}>
                  {exposure.toUpperCase()}
                </span>
              </div>
              {/* Stats */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 12 }}>
                {[
                  { label: 'Hormuz dep.', value: `${dep}%` },
                  { label: 'Reserve days', value: `${reserve}d` },
                  { label: 'Plants', value: plantCount },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#94a3b8' }}>{label}</span>
                    <span style={{ color: '#e2e8f0', fontWeight: 700 }}>{value}</span>
                  </div>
                ))}
              </div>
              {/* Dep bar */}
              <div style={{ height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.08)', marginTop: 10, overflow: 'hidden' }}>
                <div style={{ height: 4, borderRadius: 99, background: badgeColor, width: `${Math.min(dep, 100)}%`, boxShadow: `0 0 6px ${badgeColor}` }} />
              </div>
              {/* Avg RAG */}
              {worstRag && (
                <div style={{ marginTop: 10 }}>
                  <RagBadge status={worstRag} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SECTION 4: Plant Summary Table
// ---------------------------------------------------------------------------
function PlantSummaryTable({ plants, kpis, measures, kpiData, measuresData, plantTrends, navigate }) {
  const handleRowClick = () => { if (navigate) navigate('plants'); };

  const headers = ['Plant', 'Country', 'Status', 'Red KPIs', 'Top Risk', 'Trend', 'Top Active Measure'];

  return (
    <div style={{ ...glass, padding: 0, overflow: 'hidden' }}>
      {/* Header bar */}
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <h2 style={{ color: '#f1f5f9', fontSize: 15, fontWeight: 800, margin: 0, letterSpacing: '0.03em' }}>
          Plant Summary
        </h2>
        {navigate && (
          <button
            onClick={handleRowClick}
            style={{
              background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)',
              color: '#a5b4fc', fontSize: 12, fontWeight: 600,
              padding: '5px 14px', borderRadius: 999, cursor: 'pointer',
            }}
          >
            View all →
          </button>
        )}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
              {headers.map(h => (
                <th key={h} style={{
                  padding: '10px 16px', textAlign: 'left',
                  color: '#64748b', fontSize: 11, fontWeight: 700,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  borderBottom: '1px solid rgba(255,255,255,0.07)',
                  whiteSpace: 'nowrap',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {plants.map((plant, idx) => {
              const rag = plantOverallRag(kpiData, plant.id);
              const redCount = countRedKpis(kpiData, plant.id);
              const risk = topRisk(kpiData, kpis, plant.id);
              const trend = plantTrends?.[plant.id] || 'stable';
              const plantMeasuresObj = measuresData?.[plant.id] || {};
              const activeMeasureId = Object.entries(plantMeasuresObj).find(([, v]) => v === 'active')?.[0];
              const activeMeasure = activeMeasureId
                ? (measures.find(m => m.id === activeMeasureId)?.label || activeMeasureId)
                : '—';
              const ragColor = rag === 'red' ? '#ef4444' : rag === 'amber' ? '#f59e0b' : '#22c55e';

              return (
                <tr
                  key={plant.id}
                  onClick={handleRowClick}
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    cursor: 'pointer',
                    background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)'}
                >
                  <td style={{ padding: '11px 16px', color: '#f1f5f9', fontWeight: 700, whiteSpace: 'nowrap' }}>
                    {plant.name}
                  </td>
                  <td style={{ padding: '11px 16px', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                    {plant.country || plant.countryCode}
                  </td>
                  <td style={{ padding: '11px 16px' }}>
                    <RagBadge status={rag} />
                  </td>
                  <td style={{ padding: '11px 16px', textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 24, height: 24, borderRadius: '50%',
                      background: redCount > 0 ? 'rgba(239,68,68,0.25)' : 'rgba(100,116,139,0.2)',
                      border: `1px solid ${redCount > 0 ? '#ef4444' : 'rgba(100,116,139,0.4)'}`,
                      color: redCount > 0 ? '#fca5a5' : '#64748b',
                      fontSize: 11, fontWeight: 800,
                    }}>
                      {redCount}
                    </span>
                  </td>
                  <td style={{ padding: '11px 16px', color: '#94a3b8', fontSize: 12, maxWidth: 140 }}>
                    <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={risk}>
                      {risk}
                    </span>
                  </td>
                  <td style={{ padding: '11px 16px' }}>
                    <TrendIcon trend={trend} />
                  </td>
                  <td style={{ padding: '11px 16px', color: '#94a3b8', fontSize: 12, maxWidth: 200 }}>
                    <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={activeMeasure}>
                      {activeMeasure}
                    </span>
                  </td>
                </tr>
              );
            })}
            {plants.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: '#475569' }}>
                  No plant data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SECTION 5: Most Adopted Measures
// ---------------------------------------------------------------------------
function MostAdoptedMeasures({ measures, measuresData, plants }) {
  const adoptionCounts = {};
  for (const measure of measures) {
    let count = 0;
    for (const plant of plants) {
      const pm = measuresData?.[plant.id] || {};
      if (pm[measure.id] === 'active') count++;
    }
    adoptionCounts[measure.id] = count;
  }

  const top5 = [...measures]
    .sort((a, b) => adoptionCounts[b.id] - adoptionCounts[a.id])
    .slice(0, 5);

  const totalPlants = plants.length;

  function barColor(pct) {
    if (pct >= 80) return '#22c55e';
    if (pct >= 50) return '#f59e0b';
    return '#6366f1';
  }

  return (
    <div style={{ ...glass, padding: '20px 24px' }}>
      <h2 style={{ color: '#f1f5f9', fontSize: 15, fontWeight: 800, margin: '0 0 16px', letterSpacing: '0.03em' }}>
        Most Adopted Mitigation Measures
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {top5.map((measure, idx) => {
          const count = adoptionCounts[measure.id];
          const pct = totalPlants > 0 ? Math.round((count / totalPlants) * 100) : 0;
          const bc = barColor(pct);

          return (
            <div key={measure.id} style={{
              ...glass,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12, padding: '12px 16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                    background: `${bc}33`, border: `1px solid ${bc}66`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: bc, fontSize: 11, fontWeight: 800,
                  }}>{idx + 1}</span>
                  <span style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600 }}>
                    {measure.label || measure.name || measure.id}
                  </span>
                </div>
                <span style={{
                  padding: '2px 10px', borderRadius: 999,
                  background: `${bc}22`, border: `1px solid ${bc}55`,
                  color: bc, fontSize: 11, fontWeight: 700,
                }}>
                  {count}/{totalPlants} plants
                </span>
              </div>
              {/* Progress bar with glow */}
              <div style={{ height: 5, borderRadius: 99, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                <div style={{
                  height: 5, borderRadius: 99, background: bc,
                  width: `${pct}%`,
                  boxShadow: `0 0 8px ${bc}`,
                  transition: 'width 0.6s ease',
                }} />
              </div>
              <p style={{ color: '#475569', fontSize: 11, textAlign: 'right', margin: '4px 0 0' }}>{pct}% adoption</p>
            </div>
          );
        })}
        {top5.length === 0 && (
          <p style={{ color: '#475569', textAlign: 'center', padding: '20px 0', fontSize: 13 }}>
            No active measures data available.
          </p>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main SummaryPage
// ---------------------------------------------------------------------------
export default function SummaryPage({
  plants = [],
  kpis = [],
  measures = [],
  kpiData = {},
  measuresData = {},
  plantNotes = {},
  plantTrends = {},
  countryInfo = {},
  lastUpdated,
  nextUpdate,
  navigate,
}) {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* 1. Hero Banner */}
      <HeroBanner kpiData={kpiData} plants={plants} kpis={kpis} />

      {/* 2. ASEAN SVG Map */}
      <AseanMap plants={plants} kpiData={kpiData} />

      {/* 3. Status Grid */}
      <StatusGrid kpiData={kpiData} plants={plants} countryInfo={countryInfo} />

      {/* 4. Plant Summary Table */}
      <PlantSummaryTable
        plants={plants}
        kpis={kpis}
        measures={measures}
        kpiData={kpiData}
        measuresData={measuresData}
        plantTrends={plantTrends}
        navigate={navigate}
      />

      {/* 5. Most Adopted Measures */}
      <MostAdoptedMeasures measures={measures} measuresData={measuresData} plants={plants} />

      {/* Footer */}
      {(lastUpdated || nextUpdate) && (
        <div style={{ textAlign: 'right', color: '#475569', fontSize: 11, paddingBottom: 8 }}>
          {lastUpdated && <span>Last updated: {lastUpdated}</span>}
          {lastUpdated && nextUpdate && <span style={{ margin: '0 8px' }}>·</span>}
          {nextUpdate && <span>Next update: {nextUpdate}</span>}
        </div>
      )}
    </div>
  );
}
