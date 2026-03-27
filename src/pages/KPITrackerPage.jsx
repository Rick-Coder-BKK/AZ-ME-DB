import { useState } from 'react';
import {
  RagDot, RagBadge, RagSelect, GlassCard, Card, SectionCard,
  WeekSelector, RAG, plantRag, countRag, severityScore, weekTrend,
} from '../components/shared';

// ── Constants ──────────────────────────────────────────────────
const COUNTRIES = [
  { code: 'ALL', label: 'All',  flag: null },
  { code: 'TH',  label: 'TH',  flag: '🇹🇭' },
  { code: 'MY',  label: 'MY',  flag: '🇲🇾' },
  { code: 'VN',  label: 'VN',  flag: '🇻🇳' },
  { code: 'ID',  label: 'ID',  flag: '🇮🇩' },
];

const DELTA_MAP = {
  'red-red':     { arrow: '→', color: '#fca5a5' },
  'red-amber':   { arrow: '↑', color: '#86efac' },
  'red-green':   { arrow: '↑', color: '#86efac' },
  'amber-red':   { arrow: '↓', color: '#fca5a5' },
  'amber-amber': { arrow: '→', color: '#fcd34d' },
  'amber-green': { arrow: '↑', color: '#86efac' },
  'green-red':   { arrow: '↓', color: '#fca5a5' },
  'green-amber': { arrow: '↓', color: '#fca5a5' },
  'green-green': { arrow: '→', color: '#86efac' },
};

function getDelta(prev, cur) {
  const key = `${prev}-${cur}`;
  return DELTA_MAP[key] || { arrow: '→', color: '#64748b' };
}

// ── Compact RAG block for history chart ───────────────────────
function RagBlock({ status, isSelected, isForecast, width = 28 }) {
  const c = RAG[status] || RAG.green;
  return (
    <span
      title={status}
      style={{
        display: 'inline-block',
        width,
        height: 20,
        borderRadius: 3,
        background: c.bg,
        opacity: isForecast ? 0.45 : 1,
        outline: isSelected ? `2px solid white` : 'none',
        outlineOffset: 1,
        flexShrink: 0,
        cursor: 'default',
        boxShadow: isSelected ? `0 0 8px ${c.glow}` : undefined,
      }}
    />
  );
}

// ── Per-KPI summary card ───────────────────────────────────────
function KpiSummaryCard({ kpi, kpiData, plants, prevKpiData, isSelected, onClick }) {
  const counts = { red: 0, amber: 0, green: 0 };
  for (const p of plants) {
    const v = (kpiData?.[p.id] || {})[kpi.id] || 'green';
    counts[v]++;
  }
  const worst = counts.red > 0 ? 'red' : counts.amber > 0 ? 'amber' : 'green';

  // trend for this KPI across all plants
  let trendArrow = '→';
  let trendColor = '#fcd34d';
  if (prevKpiData) {
    let curScore = 0, prevScore = 0;
    for (const p of plants) {
      const cur  = (kpiData?.[p.id]     || {})[kpi.id] || 'green';
      const prev = (prevKpiData?.[p.id] || {})[kpi.id] || 'green';
      const val  = v => v === 'red' ? 3 : v === 'amber' ? 1 : 0;
      curScore  += val(cur);
      prevScore += val(prev);
    }
    if (curScore > prevScore) { trendArrow = '↓'; trendColor = '#fca5a5'; }
    else if (curScore < prevScore) { trendArrow = '↑'; trendColor = '#86efac'; }
    else { trendArrow = '→'; trendColor = '#fcd34d'; }
  }

  return (
    <button
      onClick={onClick}
      style={{
        background: isSelected ? 'rgba(59,130,246,0.18)' : 'rgba(255,255,255,0.05)',
        border: isSelected
          ? '1px solid rgba(59,130,246,0.5)'
          : '1px solid rgba(255,255,255,0.08)',
        borderRadius: 10,
        padding: '8px 12px',
        cursor: 'pointer',
        minWidth: 130,
        flexShrink: 0,
        textAlign: 'left',
        backdropFilter: 'blur(12px)',
        transition: 'all 0.15s',
      }}
    >
      <div className="flex items-center gap-1.5 mb-1.5">
        <RagDot status={worst} size={9} />
        <span style={{ color: '#e2e8f0', fontSize: 11, fontWeight: 600, lineHeight: 1.2 }}>
          {kpi.short}
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <span style={{ fontSize: 10, color: '#fca5a5', fontWeight: 700 }}>{counts.red}🔴</span>
        <span style={{ fontSize: 10, color: '#fcd34d', fontWeight: 700 }}>{counts.amber}🟡</span>
        <span style={{ fontSize: 10, color: '#86efac', fontWeight: 700 }}>{counts.green}🟢</span>
        <span style={{ fontSize: 12, color: trendColor, fontWeight: 800, marginLeft: 2 }}>{trendArrow}</span>
      </div>
    </button>
  );
}

// ── Main page ─────────────────────────────────────────────────
export default function KPITrackerPage({
  plants,
  kpis,
  kpiHistory,
  selectedWeek,
  prevWeek,
  selectedWeekIdx,
  setSelectedWeekIdx,
  updateKpi,
}) {
  const [countryFilter,   setCountryFilter]   = useState('ALL');
  const [highlightedKpi,  setHighlightedKpi]  = useState(null);
  const [trendOpen,       setTrendOpen]       = useState(false);
  const [historyOpen,     setHistoryOpen]     = useState(false);
  const [defsOpen,        setDefsOpen]        = useState(false);
  const [historyKpi,      setHistoryKpi]      = useState(kpis?.[0]?.id || 'rawMaterial');

  const kpiData  = selectedWeek?.kpiData  || {};
  const prevData = prevWeek?.kpiData      || null;

  const filteredPlants = countryFilter === 'ALL'
    ? plants
    : plants.filter(p => p.country === countryFilter);

  // ── Collapsible section header ────────────────────────────────
  function CollapseHeader({ open, setOpen, title, subtitle }) {
    return (
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-3"
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          borderBottom: open ? '1px solid rgba(255,255,255,0.07)' : 'none',
        }}
      >
        <div className="flex items-center gap-2">
          <span style={{ color: '#cbd5e1', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {title}
          </span>
          {subtitle && (
            <span style={{ color: '#475569', fontSize: 11 }}>{subtitle}</span>
          )}
        </div>
        <span style={{ color: '#475569', fontSize: 16, fontWeight: 700 }}>{open ? '▲' : '▼'}</span>
      </button>
    );
  }

  // ── TOP BAR ───────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-5">

      {/* TOP BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <WeekSelector
          kpiHistory={kpiHistory}
          selectedWeekIdx={selectedWeekIdx}
          setSelectedWeekIdx={setSelectedWeekIdx}
        />
        <div className="flex items-center gap-1.5 flex-wrap">
          <span style={{ color: '#64748b', fontSize: 11, fontWeight: 500 }}>Country:</span>
          {COUNTRIES.map(c => (
            <button
              key={c.code}
              onClick={() => setCountryFilter(c.code)}
              style={{
                padding: '3px 11px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                background: countryFilter === c.code
                  ? 'rgba(59,130,246,0.25)'
                  : 'rgba(255,255,255,0.06)',
                border: countryFilter === c.code
                  ? '1px solid rgba(59,130,246,0.5)'
                  : '1px solid rgba(255,255,255,0.08)',
                color: countryFilter === c.code ? '#93c5fd' : '#94a3b8',
                transition: 'all 0.15s',
              }}
            >
              {c.flag ? `${c.flag} ${c.label}` : c.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI SUMMARY ROW */}
      <div>
        <div style={{ color: '#64748b', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
          KPI Overview — All Plants
        </div>
        <div
          className="flex gap-2 pb-2"
          style={{ overflowX: 'auto', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}
        >
          {kpis.map(kpi => (
            <KpiSummaryCard
              key={kpi.id}
              kpi={kpi}
              kpiData={kpiData}
              plants={plants}
              prevKpiData={prevData}
              isSelected={highlightedKpi === kpi.id}
              onClick={() => setHighlightedKpi(h => h === kpi.id ? null : kpi.id)}
            />
          ))}
        </div>
      </div>

      {/* KPI MATRIX */}
      <Card>
        {/* Matrix header */}
        <div className="flex items-center justify-between px-5 py-3"
             style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-2 flex-wrap">
            <span style={{ color: '#cbd5e1', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              KPI Matrix
            </span>
            <span style={{ color: '#475569', fontSize: 11 }}>
              {selectedWeek?.week} · {selectedWeek?.label}
            </span>
            {selectedWeek && (
              <span
                style={selectedWeek.status === 'forecast'
                  ? { background: 'rgba(217,119,6,0.15)', border: '1px solid rgba(217,119,6,0.3)', color: '#fcd34d', padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600 }
                  : { background: 'rgba(22,163,74,0.15)',  border: '1px solid rgba(22,163,74,0.3)',  color: '#86efac', padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}
              >
                {selectedWeek.status === 'forecast' ? '📋 Forecast' : '✅ Actual'}
              </span>
            )}
          </div>
          {selectedWeek?.status === 'actual' && (
            <span style={{ background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.25)', color: '#fca5a5', padding: '3px 10px', borderRadius: 8, fontSize: 10, fontWeight: 600 }}>
              ⚠ Editing {selectedWeek.week} — Actual data
            </span>
          )}
        </div>

        <div className="p-4" style={{ overflowX: 'auto' }}>
          <table style={{ minWidth: 900, borderCollapse: 'separate', borderSpacing: 0, width: '100%' }}>
            <thead>
              <tr>
                {/* Sticky plant column header */}
                <th
                  style={{
                    position: 'sticky',
                    left: 0,
                    zIndex: 10,
                    background: '#0d1f3c',
                    padding: '6px 12px',
                    textAlign: 'left',
                    fontSize: 10,
                    fontWeight: 700,
                    color: '#475569',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    borderBottom: '1px solid rgba(255,255,255,0.07)',
                    borderRight: '1px solid rgba(255,255,255,0.07)',
                    whiteSpace: 'nowrap',
                    minWidth: 140,
                  }}
                >
                  Plant
                </th>

                {/* KPI column headers */}
                {kpis.map(kpi => {
                  const counts = { red: 0, amber: 0, green: 0 };
                  for (const p of plants) {
                    const v = (kpiData?.[p.id] || {})[kpi.id] || 'green';
                    counts[v]++;
                  }
                  const worst = counts.red > 0 ? 'red' : counts.amber > 0 ? 'amber' : 'green';
                  const isHL = highlightedKpi === kpi.id;
                  return (
                    <th
                      key={kpi.id}
                      onClick={() => setHighlightedKpi(h => h === kpi.id ? null : kpi.id)}
                      style={{
                        padding: '6px 8px',
                        textAlign: 'center',
                        fontSize: 10,
                        fontWeight: 600,
                        color: isHL ? '#93c5fd' : '#64748b',
                        borderBottom: '1px solid rgba(255,255,255,0.07)',
                        cursor: 'pointer',
                        background: isHL ? 'rgba(59,130,246,0.1)' : 'transparent',
                        whiteSpace: 'nowrap',
                        maxWidth: 88,
                        minWidth: 80,
                        transition: 'background 0.15s',
                      }}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <RagDot status={worst} size={7} />
                        <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 80 }}>
                          {kpi.short}
                        </span>
                      </div>
                    </th>
                  );
                })}

                {/* Red count header */}
                <th style={{
                  padding: '6px 10px',
                  textAlign: 'center',
                  fontSize: 10,
                  fontWeight: 700,
                  color: '#475569',
                  borderBottom: '1px solid rgba(255,255,255,0.07)',
                  whiteSpace: 'nowrap',
                }}>
                  🔴
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredPlants.map((plant, rowIdx) => {
                const overallStatus = plantRag(kpiData, plant.id);
                const redCount      = countRag(kpiData, plant.id, 'red');
                const rowBg         = rowIdx % 2 === 0
                  ? 'rgba(255,255,255,0.00)'
                  : 'rgba(255,255,255,0.025)';

                return (
                  <tr key={plant.id} style={{ background: rowBg }}>
                    {/* Sticky plant name */}
                    <td
                      style={{
                        position: 'sticky',
                        left: 0,
                        zIndex: 5,
                        background: rowIdx % 2 === 0 ? '#0d1f3c' : '#0e2040',
                        padding: '7px 12px',
                        borderRight: '1px solid rgba(255,255,255,0.07)',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: 15 }}>{plant.flag}</span>
                        <span style={{ color: '#e2e8f0', fontSize: 12, fontWeight: 600 }}>{plant.name}</span>
                        <RagBadge status={overallStatus} />
                      </div>
                    </td>

                    {/* KPI cells */}
                    {kpis.map(kpi => {
                      const val   = (kpiData?.[plant.id] || {})[kpi.id] || 'green';
                      const isHL  = highlightedKpi === kpi.id;
                      return (
                        <td
                          key={kpi.id}
                          style={{
                            padding: '5px 6px',
                            textAlign: 'center',
                            borderBottom: '1px solid rgba(255,255,255,0.04)',
                            background: isHL ? 'rgba(59,130,246,0.07)' : 'transparent',
                            transition: 'background 0.15s',
                          }}
                        >
                          <RagSelect
                            value={val}
                            onChange={newVal => updateKpi(plant.id, kpi.id, newVal)}
                          />
                        </td>
                      );
                    })}

                    {/* Red count */}
                    <td style={{
                      padding: '5px 10px',
                      textAlign: 'center',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                    }}>
                      <span style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: redCount > 0 ? '#fca5a5' : '#475569',
                        textShadow: redCount > 0 ? '0 0 8px rgba(220,38,38,0.5)' : 'none',
                      }}>
                        {redCount}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* TREND COMPARISON TABLE */}
      <Card>
        <CollapseHeader
          open={trendOpen}
          setOpen={setTrendOpen}
          title="Week-on-Week Comparison"
          subtitle={prevWeek ? `${prevWeek.week} → ${selectedWeek?.week}` : 'No previous week'}
        />
        {trendOpen && (
          <div className="p-4" style={{ overflowX: 'auto' }}>
            {!prevWeek ? (
              <div style={{ color: '#475569', fontSize: 12, textAlign: 'center', padding: '20px 0' }}>
                No previous week data available.
              </div>
            ) : (
              <table style={{ minWidth: 840, borderCollapse: 'separate', borderSpacing: 0, width: '100%' }}>
                <thead>
                  <tr>
                    <th style={{
                      position: 'sticky', left: 0, zIndex: 10,
                      background: '#0d1f3c',
                      padding: '5px 12px', textAlign: 'left',
                      fontSize: 10, fontWeight: 700, color: '#475569',
                      textTransform: 'uppercase', letterSpacing: '0.06em',
                      borderBottom: '1px solid rgba(255,255,255,0.07)',
                      borderRight: '1px solid rgba(255,255,255,0.07)',
                      minWidth: 140,
                    }}>Plant / Row</th>
                    {kpis.map(kpi => (
                      <th key={kpi.id} style={{
                        padding: '5px 6px', textAlign: 'center',
                        fontSize: 10, fontWeight: 600, color: '#64748b',
                        borderBottom: '1px solid rgba(255,255,255,0.07)',
                        whiteSpace: 'nowrap', maxWidth: 88, minWidth: 80,
                      }}>{kpi.short}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredPlants.map((plant, pIdx) => {
                    const curRow  = kpiData?.[plant.id]         || {};
                    const prevRow = prevWeek.kpiData?.[plant.id] || {};
                    const isLast  = pIdx === filteredPlants.length - 1;

                    const rowBorderBottom = isLast
                      ? 'none'
                      : '2px solid rgba(255,255,255,0.08)';

                    return [
                      /* Row A — current week */
                      <tr key={`${plant.id}-cur`}>
                        <td style={{
                          position: 'sticky', left: 0, zIndex: 5,
                          background: '#0d1f3c',
                          padding: '5px 12px',
                          borderRight: '1px solid rgba(255,255,255,0.07)',
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                          whiteSpace: 'nowrap',
                        }}>
                          <div className="flex items-center gap-1.5">
                            <span style={{ fontSize: 14 }}>{plant.flag}</span>
                            <span style={{ color: '#cbd5e1', fontSize: 12, fontWeight: 600 }}>{plant.name}</span>
                            <span style={{ color: '#93c5fd', fontSize: 10, fontWeight: 600 }}>
                              {selectedWeek?.week}
                            </span>
                          </div>
                        </td>
                        {kpis.map(kpi => (
                          <td key={kpi.id} style={{ padding: '5px 6px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <RagDot status={curRow[kpi.id] || 'green'} size={11} />
                          </td>
                        ))}
                      </tr>,

                      /* Row B — previous week */
                      <tr key={`${plant.id}-prev`}>
                        <td style={{
                          position: 'sticky', left: 0, zIndex: 5,
                          background: '#0d1f3c',
                          padding: '5px 12px',
                          borderRight: '1px solid rgba(255,255,255,0.07)',
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                          whiteSpace: 'nowrap',
                        }}>
                          <span style={{ color: '#475569', fontSize: 10, marginLeft: 22 }}>
                            {prevWeek.week} (prev)
                          </span>
                        </td>
                        {kpis.map(kpi => (
                          <td key={kpi.id} style={{ padding: '5px 6px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.04)', opacity: 0.5 }}>
                            <RagDot status={prevRow[kpi.id] || 'green'} size={9} />
                          </td>
                        ))}
                      </tr>,

                      /* Row C — delta arrows */
                      <tr key={`${plant.id}-delta`} style={{ borderBottom: rowBorderBottom }}>
                        <td style={{
                          position: 'sticky', left: 0, zIndex: 5,
                          background: '#0d1f3c',
                          padding: '4px 12px',
                          borderRight: '1px solid rgba(255,255,255,0.07)',
                          borderBottom: rowBorderBottom,
                          whiteSpace: 'nowrap',
                        }}>
                          <span style={{ color: '#334155', fontSize: 10, marginLeft: 22 }}>Δ</span>
                        </td>
                        {kpis.map(kpi => {
                          const d = getDelta(prevRow[kpi.id] || 'green', curRow[kpi.id] || 'green');
                          return (
                            <td key={kpi.id} style={{ padding: '4px 6px', textAlign: 'center', borderBottom: rowBorderBottom }}>
                              <span style={{ fontSize: 13, fontWeight: 800, color: d.color }}>{d.arrow}</span>
                            </td>
                          );
                        })}
                      </tr>,
                    ];
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </Card>

      {/* KPI HISTORY CHART */}
      <Card>
        <div style={{ borderBottom: historyOpen ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
          <div className="flex items-center justify-between px-5 py-3">
            <button
              onClick={() => setHistoryOpen(v => !v)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <span style={{ color: '#cbd5e1', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                KPI Trend History
              </span>
              <span style={{ color: '#475569', fontSize: 16, fontWeight: 700 }}>{historyOpen ? '▲' : '▼'}</span>
            </button>
            {historyOpen && (
              <select
                value={historyKpi}
                onChange={e => setHistoryKpi(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'white',
                  fontSize: 11,
                  fontWeight: 600,
                  borderRadius: 8,
                  padding: '4px 10px',
                  cursor: 'pointer',
                  outline: 'none',
                  minWidth: 160,
                }}
              >
                {kpis.map(k => (
                  <option key={k.id} value={k.id}>{k.short}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {historyOpen && (
          <div className="p-4" style={{ overflowX: 'auto' }}>
            {/* Week labels row */}
            <div className="flex items-center gap-1 mb-2" style={{ paddingLeft: 140 }}>
              {kpiHistory.map((wk, wi) => (
                <div
                  key={wk.week}
                  style={{
                    width: 28,
                    flexShrink: 0,
                    textAlign: 'center',
                    fontSize: 9,
                    fontWeight: wi === selectedWeekIdx ? 800 : 500,
                    color: wi === selectedWeekIdx ? '#93c5fd' : '#475569',
                  }}
                >
                  {wk.week}
                </div>
              ))}
            </div>

            {/* One row per plant */}
            {plants.map(plant => (
              <div key={plant.id} className="flex items-center gap-1 mb-1.5">
                {/* Plant label */}
                <div style={{ width: 132, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 13 }}>{plant.flag}</span>
                  <span style={{ color: '#94a3b8', fontSize: 11, fontWeight: 600 }}>{plant.name}</span>
                </div>

                {/* Blocks */}
                {kpiHistory.map((wk, wi) => {
                  const status = (wk.kpiData?.[plant.id] || {})[historyKpi] || 'green';
                  return (
                    <RagBlock
                      key={wk.week}
                      status={status}
                      isSelected={wi === selectedWeekIdx}
                      isForecast={wk.status === 'forecast'}
                      width={28}
                    />
                  );
                })}
              </div>
            ))}

            {/* Legend */}
            <div className="flex items-center gap-4 mt-3" style={{ paddingLeft: 140 }}>
              <div className="flex items-center gap-1.5">
                <span style={{ display: 'inline-block', width: 14, height: 10, borderRadius: 2, background: RAG.red.bg }} />
                <span style={{ color: '#94a3b8', fontSize: 10 }}>Red</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span style={{ display: 'inline-block', width: 14, height: 10, borderRadius: 2, background: RAG.amber.bg }} />
                <span style={{ color: '#94a3b8', fontSize: 10 }}>Amber</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span style={{ display: 'inline-block', width: 14, height: 10, borderRadius: 2, background: RAG.green.bg }} />
                <span style={{ color: '#94a3b8', fontSize: 10 }}>Green</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span style={{ display: 'inline-block', width: 14, height: 10, borderRadius: 2, background: RAG.green.bg, opacity: 0.45 }} />
                <span style={{ color: '#94a3b8', fontSize: 10 }}>Forecast</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span style={{ display: 'inline-block', width: 14, height: 10, borderRadius: 2, border: '2px solid white', background: 'transparent' }} />
                <span style={{ color: '#94a3b8', fontSize: 10 }}>Selected week</span>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* KPI DEFINITIONS */}
      <Card>
        <CollapseHeader
          open={defsOpen}
          setOpen={setDefsOpen}
          title="KPI Definitions"
          subtitle={`${kpis.length} KPIs`}
        />
        {defsOpen && (
          <div className="p-4">
            <div className="flex flex-col gap-2">
              {kpis.map((kpi, i) => (
                <div
                  key={kpi.id}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 10,
                    padding: '12px 16px',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span style={{
                      background: 'rgba(255,255,255,0.08)',
                      color: '#94a3b8',
                      fontSize: 10,
                      fontWeight: 700,
                      borderRadius: 6,
                      padding: '2px 7px',
                      flexShrink: 0,
                      marginTop: 1,
                    }}>
                      KPI {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 700 }}>{kpi.label}</span>
                        <span style={{ color: '#475569', fontSize: 11 }}>· {kpi.short}</span>
                      </div>
                      <p style={{ color: '#94a3b8', fontSize: 11, marginBottom: 8, lineHeight: 1.5 }}>
                        {kpi.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.25)', color: '#fca5a5', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 6 }}>
                          🔴 {kpi.red}
                        </span>
                        <span style={{ background: 'rgba(217,119,6,0.1)', border: '1px solid rgba(217,119,6,0.25)', color: '#fcd34d', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 6 }}>
                          🟡 {kpi.amber}
                        </span>
                        <span style={{ background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.25)', color: '#86efac', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 6 }}>
                          🟢 {kpi.green}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

    </div>
  );
}
