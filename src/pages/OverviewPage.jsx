import { useState } from 'react';
import {
  RagDot, RagBadge, GlassCard, Card, SectionCard,
  WeekSelector, TrendIcon, MeasureBadge,
  RAG, plantRag, countRag, severityScore, operationRag, topRisk, weekTrend,
} from '../components/shared';

// ── Helpers ───────────────────────────────────────────────────

function daysBetween(dateA, dateB) {
  return Math.max(0, Math.floor((new Date(dateB) - new Date(dateA)) / 86400000));
}

function severityLabel(score) {
  if (score > 65) return { text: 'CRITICAL ALERT',  color: '#DC2626', glow: 'rgba(220,38,38,0.55)' };
  if (score > 40) return { text: 'ELEVATED RISK',   color: '#D97706', glow: 'rgba(217,119,6,0.55)'  };
  return             { text: 'STABLE',           color: '#16A34A', glow: 'rgba(22,163,74,0.55)'  };
}

function ragStatusLabel(rag) {
  if (rag === 'red')   return { text: 'CRITICAL ALERT', color: '#DC2626', glow: 'rgba(220,38,38,0.55)' };
  if (rag === 'amber') return { text: 'ELEVATED RISK',  color: '#D97706', glow: 'rgba(217,119,6,0.55)'  };
  return                      { text: 'STABLE',         color: '#16A34A', glow: 'rgba(22,163,74,0.55)'  };
}

function trendMeta(trend) {
  if (trend === 'worsening') return { icon: '↑', text: 'Situation Worsening', color: '#fca5a5' };
  if (trend === 'improving') return { icon: '↓', text: 'Situation Improving', color: '#86efac' };
  return                            { icon: '→', text: 'Situation Stable',    color: '#fcd34d' };
}

function exposureBadge(color) {
  const map = {
    red:   { bg: 'rgba(220,38,38,0.15)',  border: 'rgba(220,38,38,0.35)',  text: '#fca5a5' },
    amber: { bg: 'rgba(217,119,6,0.15)',  border: 'rgba(217,119,6,0.35)',  text: '#fcd34d' },
    green: { bg: 'rgba(22,163,74,0.15)',  border: 'rgba(22,163,74,0.35)',  text: '#86efac' },
  };
  return map[color] || map.green;
}

function kpiWorstRag(kpiData, plants, kpiId) {
  const vals = plants.map(p => (kpiData?.[p.id] || {})[kpiId]).filter(Boolean);
  if (vals.includes('red')) return 'red';
  if (vals.includes('amber')) return 'amber';
  return 'green';
}

function kpiCountByColor(kpiData, plants, kpiId, color) {
  return plants.filter(p => (kpiData?.[p.id] || {})[kpiId] === color).length;
}

// ── SVG Severity Ring ─────────────────────────────────────────

function SeverityRing({ score }) {
  const r = 40;
  const cx = 52;
  const cy = 52;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;
  const color = score > 65 ? '#DC2626' : score > 40 ? '#D97706' : '#16A34A';
  const glow  = score > 65 ? 'rgba(220,38,38,0.6)' : score > 40 ? 'rgba(217,119,6,0.6)' : 'rgba(22,163,74,0.6)';
  return (
    <svg width={104} height={104} style={{ display: 'block' }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={10} />
      <circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke={color} strokeWidth={10}
        strokeDasharray={`${filled} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ filter: `drop-shadow(0 0 8px ${glow})` }}
      />
      <text x={cx} y={cy - 5} textAnchor="middle" fill={color} fontSize={18} fontWeight={800}>{score}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="#64748b" fontSize={9} fontWeight={600}>/ 100</text>
    </svg>
  );
}

// ── Section label ─────────────────────────────────────────────

function SectionHeader({ children, action, onAction }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 style={{ color: '#94a3b8', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
        {children}
      </h2>
      {action && (
        <button onClick={onAction}
          style={{ color: '#60a5fa', fontSize: 10, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          {action} →
        </button>
      )}
    </div>
  );
}

// ── A) COUNTRY CARD ───────────────────────────────────────────

function CountryCard({ code, info, plants, kpiData }) {
  const countryPlants = plants.filter(p => p.country === code);
  const worstRag = countryPlants.reduce((worst, p) => {
    const r = plantRag(kpiData, p.id);
    if (r === 'red') return 'red';
    if (r === 'amber' && worst !== 'red') return 'amber';
    return worst;
  }, 'green');
  const exp = exposureBadge(info.exposureColor);
  const depNum = parseInt(info.hormuzDependency, 10) || 0;
  const depColor = depNum > 55 ? '#DC2626' : depNum > 35 ? '#D97706' : '#16A34A';

  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255,255,255,0.09)',
      borderRadius: 14,
      padding: '14px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 24, lineHeight: 1 }}>{info.flag}</span>
          <div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>{info.name}</div>
            <span style={{ background: exp.bg, border: `1px solid ${exp.border}`, color: exp.text, fontSize: 9, fontWeight: 700, padding: '1px 8px', borderRadius: 20 }}>
              {info.exposureLevel}
            </span>
          </div>
        </div>
        <RagBadge status={worstRag} />
      </div>

      {/* Hormuz bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
          <span style={{ color: '#64748b', fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Hormuz Dependency</span>
          <span style={{ color: depColor, fontSize: 10, fontWeight: 700 }}>{info.hormuzDependency}</span>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 5, overflow: 'hidden' }}>
          <div style={{
            width: info.hormuzDependency,
            height: '100%',
            borderRadius: 4,
            background: depColor,
            boxShadow: `0 0 6px ${depColor}66`,
          }} />
        </div>
      </div>

      {/* Reserve */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#64748b', fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Strategic Reserve</span>
        <span style={{
          color: info.strategicReserveDays < 35 ? '#fca5a5' : info.strategicReserveDays < 60 ? '#fcd34d' : '#86efac',
          fontSize: 11, fontWeight: 700,
        }}>{info.strategicReserveDays} days</span>
      </div>

      {/* Plants */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {countryPlants.map(p => (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <RagDot status={plantRag(kpiData, p.id)} size={8} />
            <span style={{ color: '#cbd5e1', fontSize: 11, fontWeight: 600 }}>{p.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── B) PLANT CARD ─────────────────────────────────────────────

function PlantCard({ plant, kpiData, prevKpiData, kpis, onClick }) {
  const rag = plantRag(kpiData, plant.id);
  const prevRag = prevKpiData ? plantRag(prevKpiData, plant.id) : null;
  const redCount   = countRag(kpiData, plant.id, 'red');
  const amberCount = countRag(kpiData, plant.id, 'amber');
  const greenCount = countRag(kpiData, plant.id, 'green');
  const risk = topRisk(kpiData, kpis, plant.id);
  const ragColor = RAG[rag];

  let trendText = '→ Unchanged';
  let trendColor = '#fcd34d';
  if (prevRag) {
    const order = { green: 0, amber: 1, red: 2 };
    if (order[rag] > order[prevRag]) { trendText = '↑ Worsened'; trendColor = '#fca5a5'; }
    else if (order[rag] < order[prevRag]) { trendText = '↓ Improved'; trendColor = '#86efac'; }
  }

  return (
    <div onClick={onClick} style={{
      background: 'rgba(255,255,255,0.05)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderLeft: `4px solid ${ragColor.bg}`,
      borderRadius: 12,
      padding: '12px 14px',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      transition: 'background 0.15s',
    }}
    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 16 }}>{plant.flag}</span>
          <span style={{ color: 'white', fontWeight: 700, fontSize: 13 }}>{plant.name}</span>
        </div>
        <RagBadge status={rag} />
      </div>

      {/* KPI pill counts */}
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
        {redCount > 0 && (
          <span style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', color: '#fca5a5', fontSize: 9, fontWeight: 700, padding: '1px 7px', borderRadius: 20 }}>
            {redCount} Red
          </span>
        )}
        {amberCount > 0 && (
          <span style={{ background: 'rgba(217,119,6,0.15)', border: '1px solid rgba(217,119,6,0.3)', color: '#fcd34d', fontSize: 9, fontWeight: 700, padding: '1px 7px', borderRadius: 20 }}>
            {amberCount} Amber
          </span>
        )}
        {greenCount > 0 && (
          <span style={{ background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(22,163,74,0.3)', color: '#86efac', fontSize: 9, fontWeight: 700, padding: '1px 7px', borderRadius: 20 }}>
            {greenCount} Green
          </span>
        )}
      </div>

      {/* Top risk */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ color: '#475569', fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Top Risk </span>
          <span style={{ color: '#e2e8f0', fontSize: 10, fontWeight: 600 }}>{risk}</span>
        </div>
        <span style={{ color: trendColor, fontSize: 9, fontWeight: 700 }}>{trendText}</span>
      </div>
    </div>
  );
}

// ── C) KPI CELL ───────────────────────────────────────────────

function KpiCell({ kpi, kpiData, prevKpiData, plants, onClick }) {
  const worst     = kpiWorstRag(kpiData,     plants, kpi.id);
  const prevWorst = prevKpiData ? kpiWorstRag(prevKpiData, plants, kpi.id) : null;
  const redCount   = kpiCountByColor(kpiData, plants, kpi.id, 'red');
  const amberCount = kpiCountByColor(kpiData, plants, kpi.id, 'amber');
  const ragColor   = RAG[worst];

  let trendIcon = '→'; let trendColor = '#fcd34d';
  if (prevWorst) {
    const order = { green: 0, amber: 1, red: 2 };
    if (order[worst] > order[prevWorst]) { trendIcon = '↑'; trendColor = '#fca5a5'; }
    else if (order[worst] < order[prevWorst]) { trendIcon = '↓'; trendColor = '#86efac'; }
  }

  return (
    <div onClick={onClick} style={{
      background: 'rgba(255,255,255,0.04)',
      backdropFilter: 'blur(12px)',
      border: `1px solid ${ragColor.border}`,
      borderRadius: 10,
      padding: '10px 12px',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      gap: 5,
    }}
    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: '#cbd5e1', fontSize: 11, fontWeight: 700, lineHeight: 1.2 }}>{kpi.short}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ color: trendColor, fontSize: 10, fontWeight: 700 }}>{trendIcon}</span>
          <RagDot status={worst} size={10} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {redCount > 0 && (
          <span style={{ color: '#fca5a5', fontSize: 9, fontWeight: 700 }}>{redCount}R</span>
        )}
        {amberCount > 0 && (
          <span style={{ color: '#fcd34d', fontSize: 9, fontWeight: 700 }}>{redCount > 0 ? '·' : ''} {amberCount}A</span>
        )}
        {redCount === 0 && amberCount === 0 && (
          <span style={{ color: '#86efac', fontSize: 9, fontWeight: 700 }}>All Green</span>
        )}
      </div>
    </div>
  );
}

// ── D) MEASURE ROW ────────────────────────────────────────────

function MeasureRow({ measure, measuresData, plants }) {
  const activeCount  = plants.filter(p => (measuresData?.[p.id] || {})[measure.id] === 'active').length;
  const plannedCount = plants.filter(p => (measuresData?.[p.id] || {})[measure.id] === 'planned').length;
  const pct = (activeCount / plants.length) * 100;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ flex: '1 1 0', minWidth: 0 }}>
        <span style={{ color: '#e2e8f0', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
          {measure.label}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        {plannedCount > 0 && (
          <span style={{ color: '#fcd34d', fontSize: 9, fontWeight: 700, whiteSpace: 'nowrap' }}>{plannedCount} planned</span>
        )}
        <span style={{ color: '#86efac', fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap' }}>{activeCount}/{plants.length}</span>
      </div>
      <div style={{ width: 80, flexShrink: 0 }}>
        <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
          <div style={{
            width: `${pct}%`,
            height: '100%',
            borderRadius: 4,
            background: '#16A34A',
            boxShadow: pct > 0 ? '0 0 6px rgba(22,163,74,0.6)' : 'none',
            transition: 'width 0.3s',
          }} />
        </div>
      </div>
    </div>
  );
}

// ── E) NEWS CARD ──────────────────────────────────────────────

const NEWS_CATEGORY_COLORS = {
  Energy:    { bg: 'rgba(220,38,38,0.15)',  border: 'rgba(220,38,38,0.3)',  color: '#fca5a5' },
  Logistics: { bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)', color: '#93c5fd' },
  FX:        { bg: 'rgba(217,119,6,0.15)',  border: 'rgba(217,119,6,0.3)',  color: '#fcd34d' },
  Industry:  { bg: 'rgba(168,85,247,0.15)', border: 'rgba(168,85,247,0.3)', color: '#d8b4fe' },
  Policy:    { bg: 'rgba(20,184,166,0.15)', border: 'rgba(20,184,166,0.3)', color: '#99f6e4' },
  Macro:     { bg: 'rgba(234,179,8,0.15)',  border: 'rgba(234,179,8,0.3)',  color: '#fde047' },
};

function NewsCard({ item, countryFlag, onNavigate }) {
  const cc = NEWS_CATEGORY_COLORS[item.category] || NEWS_CATEGORY_COLORS.Macro;
  return (
    <div onClick={onNavigate} style={{
      background: 'rgba(255,255,255,0.04)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 12,
      padding: '12px 14px',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      cursor: 'pointer',
      minWidth: 220,
      flex: '1 1 220px',
    }}
    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
        <span style={{ background: cc.bg, border: `1px solid ${cc.border}`, color: cc.color, fontSize: 8, fontWeight: 700, padding: '1px 6px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {item.category}
        </span>
        <span style={{ color: '#475569', fontSize: 10 }}>{countryFlag}</span>
      </div>
      <p style={{ color: '#e2e8f0', fontSize: 11, fontWeight: 600, lineHeight: 1.35, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {item.title}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: '#475569', fontSize: 9 }}>{item.source} · {item.date}</span>
        <span style={{ color: '#60a5fa', fontSize: 10, fontWeight: 700 }}>→</span>
      </div>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────

export default function OverviewPage({
  plants, kpis, measures, kpiHistory,
  selectedWeek, prevWeek,
  selectedWeekIdx, setSelectedWeekIdx,
  countryInfo, newsByCountry,
  crisisStart, navigate,
}) {
  if (!selectedWeek) return <div className="text-white p-8">Loading...</div>;

  const { kpiData, measuresData, overallNotes } = selectedWeek;
  const prevKpiData = prevWeek?.kpiData || null;

  const opRag      = operationRag(kpiData, plants);
  const score      = severityScore(kpiData, plants, kpis);
  const sLabel     = severityLabel(score);
  const ragLabel   = ragStatusLabel(opRag);
  const trend      = weekTrend(kpiData, prevKpiData, plants, kpis);
  const tMeta      = trendMeta(trend);
  const crisisDays = daysBetween(crisisStart, selectedWeek.date) + 1;

  const scoreColor = score > 65 ? '#DC2626' : score > 40 ? '#D97706' : '#16A34A';

  // Top 5 measures by active count
  const measuresSorted = [...measures].sort((a, b) => {
    const aActive = plants.filter(p => (measuresData?.[p.id] || {})[a.id] === 'active').length;
    const bActive = plants.filter(p => (measuresData?.[p.id] || {})[b.id] === 'active').length;
    return bActive - aActive;
  }).slice(0, 5);

  // Latest news (1 per country)
  const COUNTRIES = ['TH', 'MY', 'VN', 'ID'];
  const latestNews = COUNTRIES
    .map(code => {
      const items = newsByCountry[code] || [];
      return items.length ? { item: items[0], flag: countryInfo[code]?.flag || '' } : null;
    })
    .filter(Boolean);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── A) TOP BAR ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <WeekSelector
          kpiHistory={kpiHistory}
          selectedWeekIdx={selectedWeekIdx}
          setSelectedWeekIdx={setSelectedWeekIdx}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <RagBadge status={opRag} />
          <span style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 20,
            padding: '3px 12px',
            color: scoreColor,
            fontSize: 11,
            fontWeight: 700,
            boxShadow: `0 0 10px ${scoreColor}33`,
          }}>
            Crisis Severity: {score}/100
          </span>
        </div>
      </div>

      {/* ── B) HERO CRISIS SUMMARY ─────────────────────────────── */}
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 18,
        padding: '20px 24px',
        boxShadow: `0 0 40px ${ragLabel.color}18, 0 8px 32px rgba(0,0,0,0.4)`,
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 104px', gap: 24, alignItems: 'center' }}>

          {/* Left: status indicator */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, borderRight: '1px solid rgba(255,255,255,0.06)', paddingRight: 20 }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: `${ragLabel.color}22`,
              border: `2px solid ${ragLabel.color}`,
              boxShadow: `0 0 24px ${ragLabel.glow}, inset 0 0 20px ${ragLabel.color}11`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: ragLabel.color,
                boxShadow: `0 0 16px ${ragLabel.glow}`,
              }} />
            </div>
            <div style={{
              color: ragLabel.color,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              textAlign: 'center',
              textShadow: `0 0 12px ${ragLabel.color}88`,
            }}>
              {ragLabel.text}
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#64748b', fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Crisis Day</div>
              <div style={{ color: 'white', fontSize: 22, fontWeight: 800, lineHeight: 1 }}>{crisisDays}</div>
            </div>
          </div>

          {/* Center: details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div>
              <h1 style={{ color: 'white', fontSize: 16, fontWeight: 800, margin: 0, letterSpacing: '-0.01em' }}>
                ASEAN ME Operations — Crisis Status Overview
              </h1>
              <p style={{ color: '#64748b', fontSize: 11, margin: '2px 0 0', fontWeight: 500 }}>
                {selectedWeek.week} · {selectedWeek.date} · {selectedWeek.label}
                {selectedWeek.status === 'forecast' && (
                  <span style={{ marginLeft: 8, color: '#fcd34d', fontSize: 9, fontWeight: 700 }}>FORECAST</span>
                )}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ color: '#64748b', fontSize: 11, fontWeight: 600 }}>Crisis Severity Index:</span>
              <span style={{
                color: scoreColor,
                fontSize: 32,
                fontWeight: 900,
                lineHeight: 1,
                textShadow: `0 0 20px ${scoreColor}66`,
              }}>{score}</span>
              <span style={{ color: '#475569', fontSize: 13, fontWeight: 600 }}>/ 100</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: tMeta.color, fontSize: 16, fontWeight: 800 }}>{tMeta.icon}</span>
              <span style={{ color: tMeta.color, fontSize: 12, fontWeight: 700 }}>{tMeta.text}</span>
              {!prevWeek && (
                <span style={{ color: '#475569', fontSize: 10 }}>(no prior week)</span>
              )}
            </div>

            {overallNotes && (
              <p style={{
                color: '#94a3b8', fontSize: 11, margin: 0, lineHeight: 1.5,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 8,
                padding: '8px 10px',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                {overallNotes}
              </p>
            )}
          </div>

          {/* Right: severity ring */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <SeverityRing score={score} />
            <span style={{ color: '#475569', fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Severity</span>
          </div>
        </div>
      </div>

      {/* ── C) COUNTRY EXPOSURE GRID ──────────────────────────── */}
      <div>
        <SectionHeader>Country Exposure</SectionHeader>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {COUNTRIES.map(code => countryInfo[code] && (
            <CountryCard
              key={code}
              code={code}
              info={countryInfo[code]}
              plants={plants}
              kpiData={kpiData}
            />
          ))}
        </div>
      </div>

      {/* ── D) PLANT STATUS GRID ──────────────────────────────── */}
      <div>
        <SectionHeader action="View Plants" onAction={() => navigate('plants')}>
          Plant Status — {plants.length} Plants
        </SectionHeader>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 10 }}>
          {plants.map(plant => (
            <PlantCard
              key={plant.id}
              plant={plant}
              kpiData={kpiData}
              prevKpiData={prevKpiData}
              kpis={kpis}
              onClick={() => navigate('plants')}
            />
          ))}
        </div>
      </div>

      {/* ── E) KPI SUMMARY GRID ───────────────────────────────── */}
      <div>
        <SectionHeader action="View KPIs" onAction={() => navigate('kpi')}>
          KPI Worst-Case Summary — {kpis.length} KPIs Across All Plants
        </SectionHeader>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
          {kpis.map(kpi => (
            <KpiCell
              key={kpi.id}
              kpi={kpi}
              kpiData={kpiData}
              prevKpiData={prevKpiData}
              plants={plants}
              onClick={() => navigate('kpi')}
            />
          ))}
        </div>
      </div>

      {/* ── BOTTOM ROW: MEASURES + NEWS ───────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>

        {/* ── F) MEASURES ADOPTION ──────────────────────────────── */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 14,
          padding: '14px 16px',
        }}>
          <SectionHeader action="View Measures" onAction={() => navigate('measures')}>
            Top 5 Active Measures
          </SectionHeader>
          <div>
            {measuresSorted.map(m => (
              <MeasureRow
                key={m.id}
                measure={m}
                measuresData={measuresData}
                plants={plants}
              />
            ))}
          </div>
        </div>

        {/* ── G) NEWS STRIP ────────────────────────────────────── */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 14,
          padding: '14px 16px',
        }}>
          <SectionHeader action="View News" onAction={() => navigate('news')}>
            Breaking News
          </SectionHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {latestNews.map(({ item, flag }, i) => (
              <NewsCard
                key={i}
                item={item}
                countryFlag={flag}
                onNavigate={() => navigate('news')}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── H) OVERALL SITUATION NOTES ───────────────────────── */}
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14,
        padding: '16px 20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <h2 style={{ color: '#94a3b8', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>
            Situation Assessment — {selectedWeek.week}
          </h2>
          {selectedWeek.status === 'actual' && (
            <span style={{
              background: 'rgba(22,163,74,0.12)',
              border: '1px solid rgba(22,163,74,0.25)',
              color: '#86efac',
              fontSize: 9, fontWeight: 700,
              padding: '2px 8px', borderRadius: 20,
            }}>
              ✅ Actual — editable in plant views
            </span>
          )}
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 10,
          padding: '12px 14px',
          color: '#94a3b8',
          fontSize: 12,
          lineHeight: 1.65,
          minHeight: 52,
        }}>
          {overallNotes || <span style={{ color: '#334155', fontStyle: 'italic' }}>No situation notes recorded for this week.</span>}
        </div>
      </div>

    </div>
  );
}
