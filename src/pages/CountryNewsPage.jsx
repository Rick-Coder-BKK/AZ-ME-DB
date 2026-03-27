import { useState } from 'react';
import { RagDot, RagBadge, SectionCard, GlassCard, Card, plantOverallRag } from '../components/shared';

// ─── Country tab config ───────────────────────────────────────────────────────
const COUNTRIES = [
  { code: 'TH', label: 'Thailand',  flag: '🇹🇭' },
  { code: 'MY', label: 'Malaysia',  flag: '🇲🇾' },
  { code: 'VN', label: 'Vietnam',   flag: '🇻🇳' },
  { code: 'ID', label: 'Indonesia', flag: '🇮🇩' },
];

// ─── Static risk factor definitions per country ───────────────────────────────
const RISK_FACTORS = {
  TH: [
    { label: 'Currency',    rag: 'amber' },
    { label: 'Port',        rag: 'green' },
    { label: 'Inflation',   rag: 'amber' },
    { label: 'Fuel',        rag: 'amber' },
  ],
  MY: [
    { label: 'Currency',      rag: 'red'   },
    { label: 'Port',          rag: 'amber' },
    { label: 'Fuel Subsidy',  rag: 'red'   },
    { label: 'Refinery',      rag: 'red'   },
  ],
  VN: [
    { label: 'Currency',    rag: 'amber' },
    { label: 'Port',        rag: 'green' },
    { label: 'Coal Power',  rag: 'green' },
    { label: 'Logistics',   rag: 'amber' },
  ],
  ID: [
    { label: 'Currency',      rag: 'red' },
    { label: 'Port',          rag: 'red' },
    { label: 'Fuel Rationing',rag: 'red' },
    { label: 'Refinery',      rag: 'red' },
  ],
};

// ─── News category → colour ───────────────────────────────────────────────────
const CATEGORY_COLORS = {
  Energy:    { bg: 'rgba(59,130,246,0.2)',  border: 'rgba(59,130,246,0.4)',  text: '#93c5fd' },
  FX:        { bg: 'rgba(168,85,247,0.2)', border: 'rgba(168,85,247,0.4)', text: '#d8b4fe' },
  Logistics: { bg: 'rgba(249,115,22,0.2)', border: 'rgba(249,115,22,0.4)', text: '#fdba74' },
  Politics:  { bg: 'rgba(239,68,68,0.2)',  border: 'rgba(239,68,68,0.4)',  text: '#fca5a5' },
  Trade:     { bg: 'rgba(20,184,166,0.2)', border: 'rgba(20,184,166,0.4)', text: '#5eead4' },
  Economy:   { bg: 'rgba(234,179,8,0.2)',  border: 'rgba(234,179,8,0.4)',  text: '#fde047' },
};

const RAG_BG = { red: '#DC2626', amber: '#D97706', green: '#16A34A' };
const RAG_GLOW = {
  red:   { bg: 'rgba(220,38,38,0.15)',  border: 'rgba(220,38,38,0.35)',  text: '#fca5a5',  glow: '#DC262640' },
  amber: { bg: 'rgba(217,119,6,0.15)', border: 'rgba(217,119,6,0.35)', text: '#fcd34d', glow: '#D9770640' },
  green: { bg: 'rgba(22,163,74,0.15)', border: 'rgba(22,163,74,0.35)', text: '#86efac', glow: '#16A34A40' },
};

// ─── Exposure level → RAG ─────────────────────────────────────────────────────
function exposureRag(exposureColor) {
  if (!exposureColor) return 'green';
  const c = exposureColor.toLowerCase();
  if (c === 'red')   return 'red';
  if (c === 'amber') return 'amber';
  return 'green';
}

// ─── KPI counts for one plant ─────────────────────────────────────────────────
function kpiCounts(kpiData, plantId) {
  const vals = Object.values(kpiData[plantId] || {});
  return {
    red:   vals.filter(v => v === 'red').length,
    amber: vals.filter(v => v === 'amber').length,
    green: vals.filter(v => v === 'green').length,
  };
}

// ─── Glass Risk Pill ──────────────────────────────────────────────────────────
function RiskPill({ label, rag }) {
  const c = RAG_GLOW[rag] || RAG_GLOW.green;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
      style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
    >
      <span
        style={{
          width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
          background: RAG_BG[rag],
          boxShadow: `0 0 6px ${RAG_BG[rag]}`,
        }}
      />
      {label}
    </span>
  );
}

// ─── KPI count bubble ────────────────────────────────────────────────────────
function CountBubble({ count, rag }) {
  if (count === 0) return null;
  const c = RAG_GLOW[rag];
  return (
    <span
      className="inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-xs font-bold"
      style={{ background: RAG_BG[rag], boxShadow: `0 0 8px ${c.glow}` }}
      title={`${count} ${rag}`}
    >
      {count}
    </span>
  );
}

// ─── News card ────────────────────────────────────────────────────────────────
function NewsCard({ item }) {
  const cat = CATEGORY_COLORS[item.category] || {
    bg: 'rgba(100,116,139,0.2)', border: 'rgba(100,116,139,0.4)', text: '#94a3b8',
  };
  return (
    <div
      className="flex flex-col gap-3 p-4 rounded-2xl transition-all hover:scale-[1.01]"
      style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
      }}
    >
      {/* Category + date row */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        {item.category && (
          <span
            className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold"
            style={{ background: cat.bg, border: `1px solid ${cat.border}`, color: cat.text }}
          >
            {item.category}
          </span>
        )}
        <span className="text-xs text-slate-500 ml-auto">{item.date}</span>
      </div>

      {/* Title */}
      <p className="font-bold text-white text-sm leading-snug">{item.title}</p>

      {/* Source */}
      <p className="text-xs text-slate-400">{item.source}</p>

      {/* Summary */}
      <p className="text-xs text-slate-300 leading-relaxed flex-1">{item.summary}</p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 mt-auto">
        <span
          className="inline-block px-2 py-0.5 rounded text-xs"
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#94a3b8',
          }}
        >
          {item.source}
        </span>
        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold transition-colors"
            style={{ color: '#93c5fd' }}
            onMouseOver={e => e.currentTarget.style.color = '#dbeafe'}
            onMouseOut={e => e.currentTarget.style.color = '#93c5fd'}
          >
            Read More →
          </a>
        )}
      </div>
    </div>
  );
}

// ─── Stat box ────────────────────────────────────────────────────────────────
function StatBox({ label, value }) {
  return (
    <div
      className="flex flex-col items-center justify-center px-4 py-4 rounded-xl text-center"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value ?? '—'}</p>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function CountryNewsPage({ plants = [], kpis = [], kpiData = {}, countryInfo = {}, countrynews = {} }) {
  const [activeCode, setActiveCode] = useState('ID');

  const info      = countryInfo[activeCode] || {};
  const newsItems = (countrynews[activeCode] || []);
  const riskPills = RISK_FACTORS[activeCode] || [];
  const country   = COUNTRIES.find(c => c.code === activeCode);

  const countryPlants = plants.filter(p => p.country === activeCode || p.countryCode === activeCode);

  const allVals    = countryPlants.flatMap(p => Object.values(kpiData[p.id] || {}));
  const totalKpis  = allVals.length;
  const totalRed   = allVals.filter(v => v === 'red').length;
  const totalAmber = allVals.filter(v => v === 'amber').length;
  const totalGreen = allVals.filter(v => v === 'green').length;
  const pctRed     = totalKpis > 0 ? Math.round((totalRed   / totalKpis) * 100) : 0;
  const pctAmber   = totalKpis > 0 ? Math.round((totalAmber / totalKpis) * 100) : 0;
  const pctGreen   = totalKpis > 0 ? Math.round((totalGreen / totalKpis) * 100) : 0;

  const plantsWithRed = countryPlants.filter(p =>
    Object.values(kpiData[p.id] || {}).includes('red')
  ).length;

  const rag = exposureRag(info.exposureColor || info.exposureLevel);
  const ragC = RAG_GLOW[rag];

  // Avg RAG colour for plants
  const avgRag = (() => {
    if (countryPlants.some(p => plantOverallRag(kpiData, p.id) === 'red'))   return 'red';
    if (countryPlants.some(p => plantOverallRag(kpiData, p.id) === 'amber')) return 'amber';
    return 'green';
  })();

  // Dependency bar width (strip % sign if present)
  const depRaw = info.hormuzDependency ?? '';
  const depNum = parseFloat(String(depRaw).replace('%', '')) || 0;

  return (
    <div className="space-y-6">

      {/* ── Page header ── */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Country Intelligence</h1>
        <p className="text-slate-400 text-sm mt-1">
          ASEAN ME Crisis Dashboard — Per-country exposure, plant status &amp; live developments
        </p>
      </div>

      {/* ── Country tabs ── */}
      <div
        className="rounded-2xl p-1 flex gap-1"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {COUNTRIES.map(c => {
          const isActive = c.code === activeCode;
          const cInfo    = countryInfo[c.code] || {};
          const tabRag   = exposureRag(cInfo.exposureColor || cInfo.exposureLevel);
          return (
            <button
              key={c.code}
              onClick={() => setActiveCode(c.code)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={isActive ? {
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#ffffff',
                boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
              } : {
                background: 'transparent',
                border: '1px solid transparent',
                color: '#94a3b8',
              }}
            >
              <span className="text-base">{c.flag}</span>
              <span className="hidden sm:inline">{c.label}</span>
              <RagDot status={tabRag} size="sm" />
            </button>
          );
        })}
      </div>

      {/* ── 1. Country Hero Card ── */}
      <GlassCard>
        {/* Hero header */}
        <div
          className="px-6 py-5 flex flex-wrap items-center gap-4 rounded-t-2xl"
          style={{
            background: 'rgba(255,255,255,0.04)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <span className="text-6xl leading-none">{country?.flag}</span>
          <div className="flex-1 min-w-0">
            <h2 className="text-3xl font-bold text-white">{info.name || country?.label}</h2>
            <p className="text-slate-400 text-sm mt-1">Country Overview</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-xs text-slate-400 uppercase tracking-widest font-medium">Exposure Level</span>
            <span
              className="px-4 py-1.5 rounded-full text-sm font-bold"
              style={{
                background: ragC.bg,
                border: `1px solid ${ragC.border}`,
                color: ragC.text,
                boxShadow: `0 0 16px ${ragC.glow}`,
              }}
            >
              {(info.exposureLevel || rag).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5">
          <StatBox
            label="Hormuz Dependency"
            value={info.hormuzDependency ?? '—'}
          />
          <StatBox
            label="Strategic Reserve"
            value={info.strategicReserveDays != null ? `${info.strategicReserveDays}d` : '—'}
          />
          <StatBox
            label="Plants in Country"
            value={countryPlants.length}
          />
          <div
            className="flex flex-col items-center justify-center px-4 py-4 rounded-xl text-center"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-2">Avg Plant RAG</p>
            <RagBadge status={avgRag} />
          </div>
        </div>

        {/* Dependency exposure bar */}
        {depNum > 0 && (
          <div className="px-5 pb-5">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-2">
              Hormuz Dependency Risk Exposure
            </p>
            <div
              className="h-3 rounded-full overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(depNum, 100)}%`,
                  background: depNum > 70 ? RAG_BG.red : depNum > 40 ? RAG_BG.amber : RAG_BG.green,
                  boxShadow: depNum > 70
                    ? '0 0 12px rgba(220,38,38,0.6)'
                    : depNum > 40
                    ? '0 0 12px rgba(217,119,6,0.6)'
                    : '0 0 12px rgba(22,163,74,0.6)',
                }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-slate-500">0%</span>
              <span className="text-xs text-slate-300 font-semibold">{depNum}% dependent</span>
              <span className="text-xs text-slate-500">100%</span>
            </div>
          </div>
        )}
      </GlassCard>

      {/* ── 2-column layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── 2. Plant Status Card ── */}
        <SectionCard title="Plant Status">
          {countryPlants.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No plants recorded for this country.</p>
          ) : (
            <div className="space-y-3">
              {countryPlants.map(plant => {
                const overallRag = plantOverallRag(kpiData, plant.id);
                const counts     = kpiCounts(kpiData, plant.id);
                return (
                  <div
                    key={plant.id}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.07)',
                    }}
                  >
                    {plant.flag && (
                      <span className="text-base leading-none flex-shrink-0">{plant.flag}</span>
                    )}
                    <span className="flex-1 text-sm font-medium text-slate-200 truncate" title={plant.name}>
                      {plant.name}
                    </span>
                    <RagBadge status={overallRag} />
                    <div className="flex items-center gap-1 ml-1">
                      <CountBubble count={counts.red}   rag="red"   />
                      <CountBubble count={counts.amber} rag="amber" />
                      <CountBubble count={counts.green} rag="green" />
                    </div>
                  </div>
                );
              })}

              {/* Summary stacked bar */}
              <div
                className="mt-2 pt-4 space-y-3"
                style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
              >
                <p className="text-xs text-slate-400">
                  <span className="font-bold text-red-400">{plantsWithRed}</span>
                  {' '}of{' '}
                  <span className="font-bold text-white">{countryPlants.length}</span>
                  {' '}plant{countryPlants.length !== 1 ? 's' : ''} have at least one{' '}
                  <span className="font-bold text-red-400">Red</span> KPI
                </p>

                {totalKpis > 0 && (
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-2">
                      Country KPI Distribution
                    </p>
                    <div
                      className="h-3 rounded-full overflow-hidden flex"
                      style={{ background: 'rgba(255,255,255,0.06)' }}
                    >
                      {pctRed > 0 && (
                        <div
                          className="h-full"
                          style={{
                            width: `${pctRed}%`,
                            background: RAG_BG.red,
                            boxShadow: '0 0 8px rgba(220,38,38,0.5)',
                          }}
                          title={`Red: ${pctRed}%`}
                        />
                      )}
                      {pctAmber > 0 && (
                        <div
                          className="h-full"
                          style={{
                            width: `${pctAmber}%`,
                            background: RAG_BG.amber,
                            boxShadow: '0 0 8px rgba(217,119,6,0.5)',
                          }}
                          title={`Amber: ${pctAmber}%`}
                        />
                      )}
                      {pctGreen > 0 && (
                        <div
                          className="h-full"
                          style={{
                            width: `${pctGreen}%`,
                            background: RAG_BG.green,
                            boxShadow: '0 0 8px rgba(22,163,74,0.5)',
                          }}
                          title={`Green: ${pctGreen}%`}
                        />
                      )}
                    </div>
                    <div className="flex gap-4 mt-2">
                      {[
                        { rag: 'red',   pct: pctRed,   count: totalRed,   textCol: '#fca5a5' },
                        { rag: 'amber', pct: pctAmber, count: totalAmber, textCol: '#fcd34d' },
                        { rag: 'green', pct: pctGreen, count: totalGreen, textCol: '#86efac' },
                      ].map(({ rag: r, pct, count, textCol }) => (
                        <div key={r} className="flex items-center gap-1.5">
                          <span
                            style={{
                              width: 8, height: 8, borderRadius: '50%',
                              background: RAG_BG[r], display: 'inline-block', flexShrink: 0,
                            }}
                          />
                          <span className="text-xs capitalize" style={{ color: textCol }}>
                            {count} ({pct}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </SectionCard>

        {/* ── 3. Economic Risk Card ── */}
        <SectionCard title="Economic Risk Assessment">
          <div className="space-y-5">
            {/* Economic notes */}
            {info.economicNotes ? (
              <p className="text-sm text-slate-300 leading-relaxed">{info.economicNotes}</p>
            ) : (
              <p className="text-sm text-slate-500 italic">No economic notes available.</p>
            )}

            {/* Risk factor chips */}
            {riskPills.length > 0 && (
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-3">
                  Risk Factors
                </p>
                <div className="flex flex-wrap gap-2">
                  {riskPills.map((rf, i) => (
                    <RiskPill key={i} label={rf.label} rag={rf.rag} />
                  ))}
                </div>
              </div>
            )}

            {/* Overall exposure summary box */}
            <div
              className="rounded-xl p-3 flex items-center gap-3"
              style={{
                background: ragC.bg,
                border: `1px solid ${ragC.border}`,
              }}
            >
              <RagDot status={rag} size="md" />
              <div>
                <span className="text-sm font-bold" style={{ color: ragC.text }}>
                  Overall Exposure: {(info.exposureLevel || rag).toUpperCase()}
                </span>
                {riskPills.filter(r => r.rag === 'red').length > 0 && (
                  <p className="text-xs text-slate-400 mt-0.5">
                    {riskPills.filter(r => r.rag === 'red').length} critical risk factor
                    {riskPills.filter(r => r.rag === 'red').length !== 1 ? 's' : ''} identified
                  </p>
                )}
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* ── 4. News Feed ── */}
      <SectionCard
        title="Latest Developments"
        headerRight={
          <span className="text-xs text-slate-500 font-medium">
            {newsItems.length} item{newsItems.length !== 1 ? 's' : ''}
          </span>
        }
      >
        {newsItems.length === 0 ? (
          <p className="text-sm text-slate-500 italic text-center py-6">
            No recent developments on record for this country.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {newsItems.map((item, i) => (
              <NewsCard key={i} item={item} />
            ))}
          </div>
        )}
      </SectionCard>

    </div>
  );
}
