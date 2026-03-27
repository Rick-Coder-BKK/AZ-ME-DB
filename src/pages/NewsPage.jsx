import { useState } from 'react';
import { GlassCard, Card, SectionCard, RagBadge, RagDot, RAG, plantRag } from '../components/shared';

// ─── Category badge colours ───────────────────────────────────────────────────
const CATEGORY_STYLES = {
  Energy:    { bg: 'rgba(59,130,246,0.18)',   border: 'rgba(59,130,246,0.4)',   color: '#93c5fd' },
  FX:        { bg: 'rgba(168,85,247,0.18)',   border: 'rgba(168,85,247,0.4)',   color: '#d8b4fe' },
  Logistics: { bg: 'rgba(249,115,22,0.18)',   border: 'rgba(249,115,22,0.4)',   color: '#fdba74' },
  Industry:  { bg: 'rgba(20,184,166,0.18)',   border: 'rgba(20,184,166,0.4)',   color: '#5eead4' },
  Policy:    { bg: 'rgba(99,102,241,0.18)',   border: 'rgba(99,102,241,0.4)',   color: '#a5b4fc' },
  Macro:     { bg: 'rgba(244,63,94,0.18)',    border: 'rgba(244,63,94,0.4)',    color: '#fda4af' },
};

function CategoryBadge({ category }) {
  const s = CATEGORY_STYLES[category] || CATEGORY_STYLES.Macro;
  return (
    <span
      className="inline-block px-2 py-0.5 rounded-full text-xs font-bold"
      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}
    >
      {category}
    </span>
  );
}

// ─── Per-country hardcoded risk factor pills ──────────────────────────────────
const RISK_FACTORS = {
  ID: [
    { label: 'Currency Pressure', rag: 'red' },
    { label: 'Port Status',        rag: 'red' },
    { label: 'Fuel Rationing Risk',rag: 'red' },
    { label: 'Refinery Exposure',  rag: 'red' },
  ],
  MY: [
    { label: 'Currency Pressure',  rag: 'red' },
    { label: 'Port Status',        rag: 'amber' },
    { label: 'Fuel Subsidy Risk',  rag: 'red' },
    { label: 'Refinery Exposure',  rag: 'red' },
  ],
  TH: [
    { label: 'Currency Pressure',  rag: 'amber' },
    { label: 'Port Status',        rag: 'green' },
    { label: 'Inflation Risk',     rag: 'amber' },
    { label: 'Fuel Costs',         rag: 'amber' },
  ],
  VN: [
    { label: 'Currency Pressure',  rag: 'amber' },
    { label: 'Port Status',        rag: 'green' },
    { label: 'Coal Power Buffer',  rag: 'green' },
    { label: 'Logistics Cost',     rag: 'amber' },
  ],
};

// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  { code: 'ID', flag: '🇮🇩', name: 'Indonesia' },
  { code: 'MY', flag: '🇲🇾', name: 'Malaysia'  },
  { code: 'TH', flag: '🇹🇭', name: 'Thailand'  },
  { code: 'VN', flag: '🇻🇳', name: 'Vietnam'   },
];

// ─── Reserve day colour ───────────────────────────────────────────────────────
function reserveColor(days) {
  if (days < 30)  return { color: '#fca5a5', bg: 'rgba(220,38,38,0.15)',  border: 'rgba(220,38,38,0.35)'  };
  if (days <= 60) return { color: '#fcd34d', bg: 'rgba(217,119,6,0.15)',  border: 'rgba(217,119,6,0.35)'  };
  return              { color: '#86efac', bg: 'rgba(22,163,74,0.15)',   border: 'rgba(22,163,74,0.35)'  };
}

// ─── Dependency bar colour ────────────────────────────────────────────────────
function dependencyBarColor(pct) {
  if (pct >= 70) return '#DC2626';
  if (pct >= 40) return '#D97706';
  return '#16A34A';
}

// ─── Avg RAG across plants for a country ─────────────────────────────────────
function countryAvgRag(plants, countryCode, kpiData) {
  const countryPlants = plants.filter(p => p.country === countryCode);
  if (!countryPlants.length) return 'green';
  const rags = countryPlants.map(p => plantRag(kpiData, p.id));
  if (rags.includes('red'))   return 'red';
  if (rags.includes('amber')) return 'amber';
  return 'green';
}

// ─── News card ────────────────────────────────────────────────────────────────
function NewsCard({ item }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.045)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 16,
        boxShadow: hovered
          ? '0 16px 48px rgba(0,0,0,0.45), 0 0 0 1px rgba(59,130,246,0.15)'
          : '0 6px 24px rgba(0,0,0,0.25)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'all 0.22s ease',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Top stripe accent */}
      <div style={{ height: 3, background: (CATEGORY_STYLES[item.category] || CATEGORY_STYLES.Macro).border }} />

      <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {/* Category + date row */}
        <div className="flex items-center justify-between gap-2">
          <CategoryBadge category={item.category} />
          <span style={{ color: '#64748b', fontSize: 11, fontWeight: 500 }}>{item.date}</span>
        </div>

        {/* Title */}
        <h3
          style={{
            color: 'white',
            fontWeight: 700,
            fontSize: 14,
            lineHeight: 1.45,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {item.title}
        </h3>

        {/* Source */}
        <p style={{ color: '#94a3b8', fontSize: 11, fontStyle: 'italic', marginTop: -4 }}>
          {item.source}
        </p>

        {/* Summary */}
        <p
          style={{
            color: '#cbd5e1',
            fontSize: 12,
            lineHeight: 1.65,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flex: 1,
          }}
        >
          {item.summary}
        </p>

        {/* Read more */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 10, marginTop: 4 }}>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#60a5fa',
              fontSize: 12,
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#93c5fd'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#60a5fa'; }}
          >
            Read More →
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Global oil market context ────────────────────────────────────────────────
function GlobalOilContext() {
  const cards = [
    {
      icon: '🛢️',
      title: 'Strait of Hormuz',
      body: '21% of global oil supply transits this strait. Current status: CLOSED since 28 Feb 2026.',
      accentColor: '#DC2626',
      accentBg: 'rgba(220,38,38,0.1)',
      accentBorder: 'rgba(220,38,38,0.25)',
    },
    {
      icon: '🗺️',
      title: 'Alternative Routes',
      body: 'Cape of Good Hope adds ~14 days to voyages. Suez Canal alternative being assessed. Air freight 8–12× more expensive.',
      accentColor: '#D97706',
      accentBg: 'rgba(217,119,6,0.1)',
      accentBorder: 'rgba(217,119,6,0.25)',
    },
    {
      icon: '📈',
      title: 'Price Impact',
      body: 'Brent crude: +38% since crisis onset. ASEAN import costs +42% on average. Refinery margins under severe pressure.',
      accentColor: '#fca5a5',
      accentBg: 'rgba(220,38,38,0.08)',
      accentBorder: 'rgba(220,38,38,0.2)',
    },
  ];

  return (
    <div>
      {/* Section header */}
      <div
        className="flex items-center gap-3 mb-4"
        style={{ borderLeft: '3px solid rgba(59,130,246,0.6)', paddingLeft: 12 }}
      >
        <h2 style={{ color: '#cbd5e1', fontWeight: 700, fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Global Oil Market Context
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((c, i) => (
          <div
            key={i}
            style={{
              background: c.accentBg,
              border: `1px solid ${c.accentBorder}`,
              borderLeft: `3px solid ${c.accentColor}`,
              borderRadius: 14,
              padding: '16px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 20 }}>{c.icon}</span>
              <h3 style={{ color: 'white', fontWeight: 700, fontSize: 13 }}>{c.title}</h3>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: 12, lineHeight: 1.65 }}>{c.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function NewsPage({
  plants = [],
  kpis = [],
  kpiHistory = [],
  selectedWeekIdx = 0,
  countryInfo = {},
  newsByCountry = {},
}) {
  const [activeTab, setActiveTab] = useState('ID');

  // Derive data for current week
  const currentWeek = kpiHistory[selectedWeekIdx] || {};
  const kpiData = currentWeek.kpiData || {};

  // Crisis day calculation
  const crisisDay = selectedWeekIdx * 7 + 1;

  // Active country data
  const info = countryInfo[activeTab] || {};
  const countryNews = newsByCountry[activeTab] || [];
  const countryPlants = plants.filter(p => p.country === activeTab);

  // Hormuz dependency as number
  const hormuzPct = typeof info.hormuzDependency === 'number'
    ? info.hormuzDependency
    : parseInt(String(info.hormuzDependency || '0'), 10);

  // Strategic reserve days as number
  const reserveDays = typeof info.strategicReserveDays === 'number'
    ? info.strategicReserveDays
    : parseInt(String(info.strategicReserveDays || '0'), 10);

  const reserveStyle = reserveColor(reserveDays);
  const avgRag = countryAvgRag(plants, activeTab, kpiData);
  const barColor = dependencyBarColor(hormuzPct);

  // Exposure badge colour map
  const exposureBadgeStyle = {
    red:    { bg: 'rgba(220,38,38,0.2)',  border: 'rgba(220,38,38,0.4)',  color: '#fca5a5' },
    amber:  { bg: 'rgba(217,119,6,0.2)', border: 'rgba(217,119,6,0.4)', color: '#fcd34d' },
    orange: { bg: 'rgba(217,119,6,0.2)', border: 'rgba(217,119,6,0.4)', color: '#fcd34d' },
    green:  { bg: 'rgba(22,163,74,0.2)', border: 'rgba(22,163,74,0.4)', color: '#86efac' },
  };
  const expStyle = exposureBadgeStyle[info.exposureColor] || exposureBadgeStyle.amber;

  const riskFactors = RISK_FACTORS[activeTab] || [];

  return (
    <div className="space-y-6">

      {/* ── PAGE HEADER ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Country Intelligence &amp; News Feed
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time monitoring of oil supply disruption impacts across ASEAN
          </p>
        </div>

        {/* Crisis day pill */}
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold shrink-0"
          style={{
            background: 'rgba(220,38,38,0.15)',
            border: '1px solid rgba(220,38,38,0.4)',
            color: '#fca5a5',
            boxShadow: '0 0 18px rgba(220,38,38,0.2)',
          }}
        >
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: '#DC2626',
            boxShadow: '0 0 8px #DC2626',
            display: 'inline-block',
            animation: 'pulse 1.5s infinite',
          }} />
          Hormuz Crisis — Day {crisisDay}
        </div>
      </div>

      {/* ── COUNTRY TABS ── */}
      <div
        className="flex gap-2 flex-wrap"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 14,
          padding: '8px 10px',
        }}
      >
        {TABS.map(tab => {
          const isActive = activeTab === tab.code;
          const tabRag = countryAvgRag(plants, tab.code, kpiData);
          return (
            <button
              key={tab.code}
              onClick={() => setActiveTab(tab.code)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                borderRadius: 10,
                border: isActive
                  ? '1px solid rgba(59,130,246,0.55)'
                  : '1px solid rgba(255,255,255,0.06)',
                background: isActive
                  ? 'rgba(59,130,246,0.18)'
                  : 'rgba(255,255,255,0.04)',
                boxShadow: isActive
                  ? '0 0 16px rgba(59,130,246,0.25), inset 0 0 12px rgba(59,130,246,0.08)'
                  : 'none',
                color: isActive ? '#e2e8f0' : '#94a3b8',
                fontWeight: isActive ? 700 : 500,
                fontSize: 13,
                cursor: 'pointer',
                transition: 'all 0.18s ease',
              }}
            >
              <span style={{ fontSize: 18 }}>{tab.flag}</span>
              <span>{tab.name}</span>
              <RagDot status={tabRag} size={8} />
            </button>
          );
        })}
      </div>

      {/* ── COUNTRY HERO CARD ── */}
      <div
        style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 20,
          boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
          overflow: 'hidden',
        }}
      >
        {/* Coloured top strip */}
        <div style={{ height: 4, background: `linear-gradient(90deg, ${expStyle.border}, transparent)` }} />

        <div style={{ padding: '24px 28px' }}>
          {/* Hero top row */}
          <div className="flex items-center gap-4 flex-wrap mb-5">
            <span style={{ fontSize: 52, lineHeight: 1 }}>
              {TABS.find(t => t.code === activeTab)?.flag}
            </span>
            <div className="flex flex-col gap-1.5">
              <h2 style={{ color: 'white', fontWeight: 800, fontSize: 28, lineHeight: 1 }}>
                {info.name || TABS.find(t => t.code === activeTab)?.name}
              </h2>
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: expStyle.bg, border: `1px solid ${expStyle.border}`, color: expStyle.color, alignSelf: 'flex-start' }}
              >
                {info.exposureLevel || 'Exposure Unknown'}
              </span>
            </div>
          </div>

          {/* Three stat columns */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-5">

            {/* Hormuz Dependency */}
            <div
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14,
                padding: '16px 18px',
              }}
            >
              <p style={{ color: '#64748b', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
                Hormuz Dependency
              </p>
              <p style={{ color: barColor, fontSize: 32, fontWeight: 800, lineHeight: 1, marginBottom: 10 }}>
                {hormuzPct}%
              </p>
              {/* Bar */}
              <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                  width: `${Math.min(hormuzPct, 100)}%`,
                  height: '100%',
                  background: barColor,
                  boxShadow: `0 0 10px ${barColor}80`,
                  borderRadius: 4,
                  transition: 'width 0.5s ease',
                }} />
              </div>
            </div>

            {/* Strategic Reserve */}
            <div
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14,
                padding: '16px 18px',
              }}
            >
              <p style={{ color: '#64748b', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
                Strategic Reserve
              </p>
              <p style={{ color: reserveStyle.color, fontSize: 32, fontWeight: 800, lineHeight: 1, marginBottom: 10 }}>
                {reserveDays} <span style={{ fontSize: 16, fontWeight: 600 }}>days</span>
              </p>
              <span
                style={{
                  display: 'inline-block',
                  background: reserveStyle.bg,
                  border: `1px solid ${reserveStyle.border}`,
                  color: reserveStyle.color,
                  padding: '2px 10px',
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                {reserveDays < 30 ? 'Critical' : reserveDays <= 60 ? 'Caution' : 'Adequate'}
              </span>
            </div>

            {/* Plants */}
            <div
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14,
                padding: '16px 18px',
              }}
            >
              <p style={{ color: '#64748b', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
                Plants
              </p>
              <p style={{ color: 'white', fontSize: 32, fontWeight: 800, lineHeight: 1, marginBottom: 10 }}>
                {countryPlants.length} <span style={{ fontSize: 15, color: '#64748b', fontWeight: 500 }}>facilities</span>
              </p>
              <div className="flex items-center gap-2">
                <span style={{ color: '#94a3b8', fontSize: 11 }}>Avg status:</span>
                <RagBadge status={avgRag} />
              </div>
            </div>
          </div>

          {/* Economic notes */}
          {info.economicNotes && (
            <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.7, borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 14 }}>
              {info.economicNotes}
            </p>
          )}
        </div>
      </div>

      {/* ── RISK FACTOR PILLS ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <span style={{ color: '#64748b', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', flexShrink: 0 }}>
          Risk Factors
        </span>
        {riskFactors.map((rf, i) => {
          const c = RAG[rf.rag] || RAG.green;
          return (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                background: c.light,
                border: `1px solid ${c.border}`,
                color: c.text,
              }}
            >
              <RagDot status={rf.rag} size={7} />
              {rf.label}
            </span>
          );
        })}
      </div>

      {/* ── PLANT STATUS MINI TABLE ── */}
      {countryPlants.length > 0 && (
        <Card>
          <div
            className="flex items-center justify-between px-5 py-3"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
          >
            <h2 style={{ color: '#cbd5e1', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.09em' }}>
              Plant Status — {info.name || activeTab}
            </h2>
            <span style={{ color: '#475569', fontSize: 11 }}>{countryPlants.length} facilities</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs" style={{ borderCollapse: 'collapse', minWidth: 500 }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                  {['Plant', 'Country', 'Status', 'Red KPIs', 'Top Risk'].map(col => (
                    <th
                      key={col}
                      className="text-left px-5 py-2.5 font-semibold"
                      style={{
                        color: '#64748b',
                        textTransform: 'uppercase',
                        letterSpacing: '0.07em',
                        borderBottom: '1px solid rgba(255,255,255,0.07)',
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {countryPlants.map((plant, idx) => {
                  const rag = plantRag(kpiData, plant.id);
                  const redCount = Object.values(kpiData[plant.id] || {}).filter(v => v === 'red').length;
                  // top risk: first red KPI label, then amber
                  let topRiskLabel = 'None';
                  if (kpis.length > 0) {
                    const plantKpis = kpiData[plant.id] || {};
                    const redKpi = kpis.find(k => plantKpis[k.id] === 'red');
                    const amberKpi = kpis.find(k => plantKpis[k.id] === 'amber');
                    topRiskLabel = redKpi?.short || amberKpi?.short || 'None';
                  }
                  return (
                    <tr
                      key={plant.id}
                      style={{
                        background: idx % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                      }}
                    >
                      <td className="px-5 py-3 font-semibold" style={{ color: '#e2e8f0' }}>{plant.name}</td>
                      <td className="px-5 py-3">
                        <span style={{ fontSize: 18 }}>{plant.flag}</span>
                      </td>
                      <td className="px-5 py-3">
                        <RagBadge status={rag} />
                      </td>
                      <td className="px-5 py-3">
                        {redCount > 0 ? (
                          <span style={{ color: '#fca5a5', fontWeight: 700 }}>{redCount}</span>
                        ) : (
                          <span style={{ color: '#475569' }}>0</span>
                        )}
                      </td>
                      <td className="px-5 py-3" style={{ color: '#94a3b8' }}>{topRiskLabel}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ── NEWS FEED ── */}
      <div>
        {/* Section header */}
        <div
          className="flex items-center justify-between mb-4 flex-wrap gap-2"
        >
          <div
            style={{ borderLeft: '3px solid rgba(59,130,246,0.6)', paddingLeft: 12 }}
          >
            <h2 style={{ color: '#cbd5e1', fontWeight: 700, fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Latest Intelligence — {info.name || activeTab}
            </h2>
          </div>
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)', color: '#93c5fd' }}
          >
            {countryNews.length} article{countryNews.length !== 1 ? 's' : ''}
          </span>
        </div>

        {countryNews.length === 0 ? (
          <div
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14,
              padding: '32px 24px',
              textAlign: 'center',
              color: '#475569',
            }}
          >
            <p style={{ fontSize: 32, marginBottom: 8 }}>📰</p>
            <p style={{ fontSize: 14, fontWeight: 500 }}>No intelligence items for {info.name || activeTab} this week.</p>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 gap-4"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}
          >
            {countryNews.map((item, i) => (
              <NewsCard key={i} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* ── GLOBAL OIL MARKET CONTEXT ── */}
      <div
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 18,
          padding: '22px 24px',
        }}
      >
        <GlobalOilContext />
      </div>

    </div>
  );
}
