import { useState } from 'react';
import {
  RagDot, RagBadge, RagSelect, SectionCard, GlassCard, Card,
  plantOverallRag, countRedKpis, countAmberKpis,
} from '../components/shared';

// ─── Constants ────────────────────────────────────────────────────────────────

const COUNTRIES = [
  { code: 'ALL', label: 'All',       flag: null },
  { code: 'TH',  label: 'Thailand',  flag: '🇹🇭' },
  { code: 'MY',  label: 'Malaysia',  flag: '🇲🇾' },
  { code: 'VN',  label: 'Vietnam',   flag: '🇻🇳' },
  { code: 'ID',  label: 'Indonesia', flag: '🇮🇩' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function worstStatus(statuses) {
  if (statuses.includes('red'))   return 'red';
  if (statuses.includes('amber')) return 'amber';
  return 'green';
}

function kpiSummaries(kpis, plants, kpiData) {
  return kpis.map(kpi => {
    const statuses = plants.map(p => (kpiData[p.id] || {})[kpi.id] || 'green');
    return {
      kpiId: kpi.id,
      worst: worstStatus(statuses),
      red:   statuses.filter(s => s === 'red').length,
      amber: statuses.filter(s => s === 'amber').length,
      green: statuses.filter(s => s === 'green').length,
    };
  });
}

function computeHeatmapStats(kpis, plants, kpiData) {
  let totalRed = 0, totalAmber = 0, totalGreen = 0;
  const kpiRedCounts   = {};
  const plantRedCounts = {};

  for (const plant of plants) {
    plantRedCounts[plant.id] = 0;
    for (const kpi of kpis) {
      kpiRedCounts[kpi.id] = kpiRedCounts[kpi.id] || 0;
      const s = (kpiData[plant.id] || {})[kpi.id] || 'green';
      if (s === 'red')   { totalRed++;   kpiRedCounts[kpi.id]++;   plantRedCounts[plant.id]++; }
      if (s === 'amber') totalAmber++;
      if (s === 'green') totalGreen++;
    }
  }

  const criticalKpiId   = Object.entries(kpiRedCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const criticalPlantId = Object.entries(plantRedCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const criticalKpi     = kpis.find(k => k.id === criticalKpiId);
  const criticalPlant   = plants.find(p => p.id === criticalPlantId);

  return {
    totalRed, totalAmber, totalGreen,
    criticalKpiLabel:   criticalKpi   ? `${criticalKpi.short} (${kpiRedCounts[criticalKpiId]} red)` : '—',
    criticalPlantLabel: criticalPlant ? `${criticalPlant.flag || ''} ${criticalPlant.name} (${plantRedCounts[criticalPlantId]} red)` : '—',
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FilterBar({ active, onChange }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {COUNTRIES.map(c => {
        const isActive = active === c.code;
        return (
          <button
            key={c.code}
            onClick={() => onChange(c.code)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '6px 16px',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: isActive ? 700 : 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              border: isActive ? '1px solid rgba(99,179,237,0.6)' : '1px solid rgba(255,255,255,0.12)',
              background: isActive ? 'rgba(99,179,237,0.18)' : 'rgba(255,255,255,0.05)',
              color: isActive ? '#93c5fd' : '#94a3b8',
              boxShadow: isActive ? '0 0 10px rgba(99,179,237,0.25)' : 'none',
            }}
          >
            {c.flag && <span style={{ fontSize: 14 }}>{c.flag}</span>}
            {c.label}
          </button>
        );
      })}
    </div>
  );
}

function SummaryHeaderRow({ kpis, summaries }) {
  return (
    <SectionCard title="KPI Summary — All Plants">
      <div style={{ overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: 8, minWidth: 'max-content', paddingBottom: 4 }}>
          {kpis.map((kpi, i) => {
            const s = summaries[i];
            const worstColor = s.worst === 'red' ? '#dc2626' : s.worst === 'amber' ? '#d97706' : '#16a34a';
            const worstTint  = s.worst === 'red' ? 'rgba(220,38,38,0.1)' : s.worst === 'amber' ? 'rgba(217,119,6,0.1)' : 'rgba(22,163,74,0.1)';
            return (
              <div
                key={kpi.id}
                style={{
                  minWidth: 90,
                  padding: '10px 10px 8px',
                  borderRadius: 10,
                  background: worstTint,
                  border: `1px solid ${worstColor}44`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textAlign: 'center', lineHeight: 1.2 }}>
                  {kpi.short}
                </span>
                <RagDot status={s.worst} size="md" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%', alignItems: 'center' }}>
                  {s.red > 0 && (
                    <span style={{ fontSize: 9, color: '#fca5a5', fontWeight: 700 }}>{s.red}R</span>
                  )}
                  {s.amber > 0 && (
                    <span style={{ fontSize: 9, color: '#fcd34d', fontWeight: 700 }}>{s.amber}A</span>
                  )}
                  {s.green > 0 && (
                    <span style={{ fontSize: 9, color: '#86efac', fontWeight: 700 }}>{s.green}G</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SectionCard>
  );
}

function KPIMatrix({ plants, kpis, kpiData, setKpiData, summaries }) {
  // Compact RagSelect for matrix cells — just shows a colored square that opens a select
  function CellSelect({ plantId, kpiId }) {
    const status = (kpiData[plantId] || {})[kpiId] || 'green';
    const bgColor = status === 'red' ? 'rgba(220,38,38,0.25)' : status === 'amber' ? 'rgba(217,119,6,0.25)' : 'rgba(22,163,74,0.25)';
    const borderColor = status === 'red' ? 'rgba(220,38,38,0.6)' : status === 'amber' ? 'rgba(217,119,6,0.6)' : 'rgba(22,163,74,0.6)';
    const dotColor = status === 'red' ? '#dc2626' : status === 'amber' ? '#d97706' : '#16a34a';

    return (
      <select
        value={status}
        onChange={e =>
          setKpiData(prev => ({
            ...prev,
            [plantId]: {
              ...prev[plantId],
              [kpiId]: e.target.value,
            },
          }))
        }
        title={`${plantId} · ${kpiId}: ${status}`}
        style={{
          appearance: 'none',
          WebkitAppearance: 'none',
          width: 26,
          height: 26,
          borderRadius: 6,
          border: `1px solid ${borderColor}`,
          background: bgColor,
          cursor: 'pointer',
          outline: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 0,
          color: 'transparent',
          backgroundImage: `radial-gradient(circle at 50% 50%, ${dotColor} 38%, transparent 38%)`,
          boxShadow: `0 0 6px ${dotColor}55`,
        }}
      >
        <option value="green">Green</option>
        <option value="amber">Amber</option>
        <option value="red">Red</option>
      </select>
    );
  }

  const headerBg = 'rgba(15,23,42,0.85)';

  return (
    <SectionCard title="KPI Matrix — Inline Editing">
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', minWidth: '100%', tableLayout: 'auto' }}>
          <colgroup>
            <col style={{ minWidth: 170 }} />
            {kpis.map(k => <col key={k.id} style={{ minWidth: 44 }} />)}
          </colgroup>

          <thead>
            <tr>
              {/* Plant column header */}
              <th
                style={{
                  position: 'sticky',
                  left: 0,
                  zIndex: 10,
                  background: headerBg,
                  backdropFilter: 'blur(20px)',
                  padding: '10px 14px',
                  textAlign: 'left',
                  fontSize: 10,
                  fontWeight: 700,
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                  borderRight: '1px solid rgba(255,255,255,0.08)',
                  whiteSpace: 'nowrap',
                }}
              >
                Plant
              </th>

              {/* KPI column headers — rotated short names */}
              {kpis.map((kpi, i) => {
                const s = summaries[i];
                return (
                  <th
                    key={kpi.id}
                    style={{
                      background: headerBg,
                      backdropFilter: 'blur(20px)',
                      padding: '8px 4px',
                      textAlign: 'center',
                      verticalAlign: 'bottom',
                      borderBottom: '1px solid rgba(255,255,255,0.08)',
                    }}
                    title={kpi.label}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <span
                        style={{
                          writingMode: 'vertical-rl',
                          transform: 'rotate(180deg)',
                          fontSize: 9,
                          fontWeight: 700,
                          color: '#64748b',
                          whiteSpace: 'nowrap',
                          maxHeight: 72,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {kpi.short}
                      </span>
                      <RagDot status={s.worst} size="sm" />
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {plants.length === 0 ? (
              <tr>
                <td
                  colSpan={kpis.length + 1}
                  style={{
                    textAlign: 'center',
                    padding: '32px 0',
                    fontSize: 13,
                    color: '#475569',
                    fontStyle: 'italic',
                  }}
                >
                  No plants match the selected filter.
                </td>
              </tr>
            ) : (
              plants.map((plant, rowIdx) => {
                const overall = plantOverallRag(kpiData, plant.id);
                const rowBg = rowIdx % 2 === 0
                  ? 'rgba(255,255,255,0.02)'
                  : 'rgba(255,255,255,0.04)';
                const stickyBg = rowIdx % 2 === 0
                  ? 'rgba(15,23,42,0.9)'
                  : 'rgba(20,28,50,0.92)';

                return (
                  <tr key={plant.id} style={{ background: rowBg }}>
                    {/* Plant name — sticky */}
                    <td
                      style={{
                        position: 'sticky',
                        left: 0,
                        zIndex: 5,
                        background: stickyBg,
                        backdropFilter: 'blur(20px)',
                        padding: '8px 14px',
                        borderRight: '1px solid rgba(255,255,255,0.06)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 16, lineHeight: 1 }}>{plant.flag}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0' }}>{plant.name}</span>
                        <RagBadge status={overall} />
                      </div>
                    </td>

                    {/* KPI cells — each is a CellSelect */}
                    {kpis.map(kpi => (
                      <td
                        key={kpi.id}
                        style={{
                          padding: '6px 8px',
                          textAlign: 'center',
                          verticalAlign: 'middle',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <CellSelect plantId={plant.id} kpiId={kpi.id} />
                        </div>
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
        {[
          { color: '#dc2626', label: 'Red — Critical risk' },
          { color: '#d97706', label: 'Amber — Elevated risk' },
          { color: '#16a34a', label: 'Green — Normal' },
        ].map(({ color, label }) => (
          <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#64748b' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
            {label}
          </span>
        ))}
        <span style={{ fontSize: 11, color: '#475569', marginLeft: 'auto' }}>
          Click each cell to update RAG status
        </span>
      </div>
    </SectionCard>
  );
}

function KPIDefinitionsPanel({ kpis }) {
  const [open, setOpen] = useState(false);

  return (
    <Card>
      {/* Accordion header */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 20px',
          background: 'transparent',
          border: 'none',
          borderBottom: open ? '1px solid rgba(255,255,255,0.08)' : 'none',
          cursor: 'pointer',
          color: '#cbd5e1',
        }}
      >
        <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#64748b' }}>
          KPI Definitions
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b', fontWeight: 500 }}>
          {open ? 'Collapse' : 'Expand'}
          <svg
            width={14} height={14}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {open && (
        <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
          {kpis.map(kpi => (
            <div
              key={kpi.id}
              style={{
                borderRadius: 10,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#e2e8f0' }}>{kpi.label}</p>
              <p style={{ margin: 0, fontSize: 11, color: '#64748b', lineHeight: 1.5 }}>{kpi.description}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 2 }}>
                <div style={{ display: 'flex', gap: 6, fontSize: 11, alignItems: 'flex-start' }}>
                  <span>🔴</span>
                  <span><span style={{ fontWeight: 600, color: '#fca5a5' }}>Red:</span> <span style={{ color: '#64748b' }}>{kpi.red}</span></span>
                </div>
                <div style={{ display: 'flex', gap: 6, fontSize: 11, alignItems: 'flex-start' }}>
                  <span>🟡</span>
                  <span><span style={{ fontWeight: 600, color: '#fcd34d' }}>Amber:</span> <span style={{ color: '#64748b' }}>{kpi.amber}</span></span>
                </div>
                <div style={{ display: 'flex', gap: 6, fontSize: 11, alignItems: 'flex-start' }}>
                  <span>🟢</span>
                  <span><span style={{ fontWeight: 600, color: '#86efac' }}>Green:</span> <span style={{ color: '#64748b' }}>{kpi.green}</span></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function HeatmapStatsCard({ stats, allPlants, allKpis, kpiData }) {
  const { totalRed, totalAmber, totalGreen, criticalKpiLabel, criticalPlantLabel } = stats;
  const total = totalRed + totalAmber + totalGreen || 1;

  return (
    <SectionCard title="Heatmap Statistics">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>

        {/* Count bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Cell Counts (All Plants)
          </p>
          {[
            { label: 'Red',   count: totalRed,   color: '#dc2626', textColor: '#fca5a5' },
            { label: 'Amber', count: totalAmber, color: '#d97706', textColor: '#fcd34d' },
            { label: 'Green', count: totalGreen, color: '#16a34a', textColor: '#86efac' },
          ].map(({ label, count, color, textColor }) => {
            const pct = Math.round((count / total) * 100);
            return (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: textColor }}>{label}</span>
                    <span style={{ fontSize: 11, color: '#475569' }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ width: '100%', height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 2, transition: 'width 0.3s ease' }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Most critical KPI */}
        <div style={{
          padding: '14px 16px',
          borderRadius: 12,
          background: 'rgba(220,38,38,0.1)',
          border: '1px solid rgba(220,38,38,0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}>
          <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: '#fca5a5', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Most Critical KPI
          </p>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#fca5a5' }}>{criticalKpiLabel}</p>
          <p style={{ margin: 0, fontSize: 11, color: '#ef4444', lineHeight: 1.5 }}>
            Highest number of red-status plants across the portfolio.
          </p>
        </div>

        {/* Most critical plant */}
        <div style={{
          padding: '14px 16px',
          borderRadius: 12,
          background: 'rgba(217,119,6,0.1)',
          border: '1px solid rgba(217,119,6,0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}>
          <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: '#fcd34d', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Most Critical Plant
          </p>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#fcd34d' }}>{criticalPlantLabel}</p>
          <p style={{ margin: 0, fontSize: 11, color: '#d97706', lineHeight: 1.5 }}>
            Highest number of red KPIs — broadest risk exposure.
          </p>
        </div>

      </div>
    </SectionCard>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function KPITrackerPage({ plants, kpis, kpiData, setKpiData }) {
  const [countryFilter, setCountryFilter] = useState('ALL');

  const filteredPlants = countryFilter === 'ALL'
    ? plants
    : plants.filter(p => p.country === countryFilter);

  // Summary always across ALL plants
  const summaries = kpiSummaries(kpis, plants, kpiData);

  // Stats across ALL plants
  const stats = computeHeatmapStats(kpis, plants, kpiData);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingBottom: 32 }}>

      {/* Page header */}
      <div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em' }}>
          KPI Tracker
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
          12-KPI status matrix across all ASEAN ME plants — updated weekly
        </p>
      </div>

      {/* Filter bar */}
      <SectionCard title="Filter by Country">
        <FilterBar active={countryFilter} onChange={setCountryFilter} />
      </SectionCard>

      {/* KPI Summary row — always all plants */}
      <SummaryHeaderRow kpis={kpis} summaries={summaries} />

      {/* KPI Matrix — inline editing */}
      <KPIMatrix
        plants={filteredPlants}
        kpis={kpis}
        kpiData={kpiData}
        setKpiData={setKpiData}
        summaries={summaries}
      />

      {/* Heatmap stats */}
      <HeatmapStatsCard
        stats={stats}
        allPlants={plants}
        allKpis={kpis}
        kpiData={kpiData}
      />

      {/* KPI Definitions — accordion */}
      <KPIDefinitionsPanel kpis={kpis} />

    </div>
  );
}
