import { useState } from 'react';
import {
  RagDot, RagBadge, MeasureSelect, GlassCard, Card, SectionCard,
  WeekSelector, MeasureBadge, RAG, plantRag, countRag,
} from '../components/shared';

// ── KPI → measure recommendation map ─────────────────────────
const KPI_MEASURE_RECOMMENDATIONS = {
  rawMaterial:          ['bufferStock', 'altSupplier'],
  supplierReliability:  ['bufferStock', 'altSupplier'],
  logisticsCosts:       ['routeDiversification'],
  logisticsLeadTime:    ['routeDiversification'],
  fuelDiesel:           ['fuelHoarding', 'energyHedging'],
  energySupply:         ['fuelHoarding', 'energyHedging'],
  fxRisk:               ['fxHedging'],
  customerImpact:       ['productionPriority', 'customerComms'],
  productionContinuity: ['productionPriority', 'customerComms'],
};

const MEASURE_LABELS = {
  crisisTeam:           'Crisis Response Team',
  bufferStock:          'Buffer Stock Build-up',
  customerComms:        'Customer Communication Plan',
  fuelHoarding:         'Fuel/Diesel Stockpiling',
  altSupplier:          'Alternative Supplier Activation',
  routeDiversification: 'Logistics Route Diversification',
  fxHedging:            'FX Hedging',
  energyHedging:        'Energy Hedging / Reduction',
  productionPriority:   'Production Prioritization',
  shuttleBus:           'Shuttle Bus / Staff Transport',
};

// ── Status colour helpers ─────────────────────────────────────
const STATUS_CFG = {
  active:   { bg: 'rgba(22,163,74,0.18)',    border: 'rgba(22,163,74,0.4)',    color: '#86efac', barBg: '#16A34A', glow: 'rgba(22,163,74,0.5)'    },
  planned:  { bg: 'rgba(217,119,6,0.18)',    border: 'rgba(217,119,6,0.4)',    color: '#fcd34d', barBg: '#D97706', glow: 'rgba(217,119,6,0.5)'    },
  inactive: { bg: 'rgba(100,116,139,0.10)',  border: 'rgba(100,116,139,0.22)', color: '#475569', barBg: '#334155', glow: 'rgba(100,116,139,0.3)' },
};

function statusBorderColor(activeCount, total) {
  if (activeCount === 0) return 'rgba(220,38,38,0.7)';
  if (activeCount === total) return 'rgba(22,163,74,0.7)';
  return 'rgba(217,119,6,0.7)';
}

function dominantBg(active, planned, inactive) {
  const total = active + planned + inactive;
  if (!total) return 'transparent';
  if (active / total >= 0.6) return 'rgba(22,163,74,0.05)';
  if (planned / total >= 0.4) return 'rgba(217,119,6,0.04)';
  if (inactive / total >= 0.8) return 'rgba(100,116,139,0.04)';
  return 'transparent';
}

// ── Subcomponent: week status block for timeline ──────────────
function WeekBlock({ status, isCurrent, isForecast }) {
  const c = STATUS_CFG[status] || STATUS_CFG.inactive;
  return (
    <div
      style={{
        width: 22,
        height: 22,
        borderRadius: 4,
        background: c.barBg,
        opacity: isForecast ? 0.55 : 1,
        border: isCurrent ? '2px solid rgba(255,255,255,0.7)' : `1px solid ${c.border}`,
        boxShadow: isCurrent ? `0 0 8px ${c.glow}` : 'none',
        flexShrink: 0,
        cursor: 'default',
      }}
      title={status}
    />
  );
}

// ── Subcomponent: summary pill (X/7) ─────────────────────────
function ActivePill({ count, total }) {
  const ratio = count / total;
  const color = ratio === 1 ? '#86efac' : ratio >= 0.5 ? '#fcd34d' : ratio > 0 ? '#fca5a5' : '#475569';
  const bg    = ratio === 1 ? 'rgba(22,163,74,0.2)' : ratio >= 0.5 ? 'rgba(217,119,6,0.2)' : ratio > 0 ? 'rgba(220,38,38,0.15)' : 'rgba(100,116,139,0.12)';
  return (
    <span style={{ background: bg, color, border: `1px solid ${color}44`, borderRadius: 8, padding: '2px 10px', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>
      {count}/{total}
    </span>
  );
}

// ═════════════════════════════════════════════════════════════
export default function MeasuresPage({
  plants, kpis, measures, kpiHistory,
  selectedWeek, prevWeek,
  selectedWeekIdx, setSelectedWeekIdx,
  updateMeasure,
}) {
  const [expandedMeasure,  setExpandedMeasure]  = useState(null);   // adoption overview row
  const [expandedDesc,     setExpandedDesc]      = useState(null);   // matrix measure description
  const [timelineOpen,     setTimelineOpen]      = useState(false);
  const [timelineMeasure,  setTimelineMeasure]   = useState(measures[0]?.id || '');

  const measuresData = selectedWeek?.measuresData || {};
  const kpiData      = selectedWeek?.kpiData      || {};

  // ── Recommended Actions ─────────────────────────────────────
  const measureVotes = {};  // measureId → Set of plantIds
  for (const plant of plants) {
    const pkd = kpiData[plant.id] || {};
    for (const [kpiId, status] of Object.entries(pkd)) {
      if (status === 'red') {
        const recs = KPI_MEASURE_RECOMMENDATIONS[kpiId] || [];
        for (const mid of recs) {
          if (!measureVotes[mid]) measureVotes[mid] = new Set();
          measureVotes[mid].add(plant.id);
        }
      }
    }
  }

  // Sort by vote count, take top 3
  const topRecommended = Object.entries(measureVotes)
    .sort(([, a], [, b]) => b.size - a.size)
    .slice(0, 3)
    .map(([mid, plantSet]) => {
      const activeCount = plants.filter(p => (measuresData[p.id] || {})[mid] === 'active').length;
      return { mid, plantCount: plantSet.size, activeCount };
    });

  // ── Adoption Overview ───────────────────────────────────────
  const adoptionRows = measures.map(m => {
    let active = 0, planned = 0, inactive = 0;
    for (const p of plants) {
      const s = (measuresData[p.id] || {})[m.id] || 'inactive';
      if (s === 'active') active++;
      else if (s === 'planned') planned++;
      else inactive++;
    }
    return { ...m, active, planned, inactive };
  }).sort((a, b) => b.active - a.active || b.planned - a.planned);

  // ── Helpers ─────────────────────────────────────────────────
  const isForecast = selectedWeek?.status === 'forecast';

  return (
    <div className="flex flex-col gap-5">

      {/* ── TOP BAR ─────────────────────────────────────────── */}
      <GlassCard style={{ padding: '14px 20px' }}>
        <div className="flex items-center flex-wrap gap-4">
          <WeekSelector
            kpiHistory={kpiHistory}
            selectedWeekIdx={selectedWeekIdx}
            setSelectedWeekIdx={setSelectedWeekIdx}
          />
          <div className="flex items-center gap-2 ml-1">
            <span className="text-white font-semibold text-sm">
              {selectedWeek?.week}
            </span>
            <span className="text-slate-400 text-xs">·</span>
            <span className="text-slate-300 text-xs">{selectedWeek?.label}</span>
            <span
              style={isForecast
                ? { background: 'rgba(217,119,6,0.18)', border: '1px solid rgba(217,119,6,0.35)', color: '#fcd34d' }
                : { background: 'rgba(22,163,74,0.18)', border: '1px solid rgba(22,163,74,0.35)', color: '#86efac' }}
              className="px-2.5 py-0.5 rounded-full text-xs font-semibold ml-1">
              {isForecast ? '📋 Forecast' : '✅ Actual'}
            </span>
          </div>
        </div>
      </GlassCard>

      {/* ── PRIORITY RECOMMENDATIONS ─────────────────────────── */}
      <Card>
        <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-widest">
            Priority Recommendations — Based on Current KPI Reds
          </h2>
        </div>
        <div className="p-5">
          {topRecommended.length === 0 ? (
            <p className="text-slate-500 text-sm">No red KPIs detected — no urgent measure recommendations.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {topRecommended.map(({ mid, plantCount, activeCount }) => {
                const borderClr = statusBorderColor(activeCount, plants.length);
                const adoptionRatio = activeCount / plants.length;
                const pillBg = activeCount === plants.length
                  ? 'rgba(22,163,74,0.2)' : activeCount > 0
                  ? 'rgba(217,119,6,0.2)' : 'rgba(220,38,38,0.15)';
                const pillColor = activeCount === plants.length
                  ? '#86efac' : activeCount > 0
                  ? '#fcd34d' : '#fca5a5';
                return (
                  <div
                    key={mid}
                    style={{
                      borderLeft: `4px solid ${borderClr}`,
                      background: 'rgba(255,255,255,0.04)',
                      border: `1px solid rgba(255,255,255,0.07)`,
                      borderLeftWidth: 4,
                      borderLeftColor: borderClr,
                      borderRadius: 12,
                      padding: '14px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      flexWrap: 'wrap',
                    }}>
                    <div style={{ flex: 1, minWidth: 160 }}>
                      <div className="text-white font-semibold text-sm">{MEASURE_LABELS[mid]}</div>
                      <div className="text-slate-400 text-xs mt-0.5">
                        Recommended for <span style={{ color: '#fca5a5', fontWeight: 700 }}>{plantCount}</span> plant{plantCount !== 1 ? 's' : ''} with red KPIs
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span
                        style={{
                          background: pillBg,
                          color: pillColor,
                          border: `1px solid ${pillColor}44`,
                          borderRadius: 8,
                          padding: '3px 12px',
                          fontSize: 12,
                          fontWeight: 700,
                        }}>
                        {activeCount}/{plants.length} Active
                      </span>
                      {activeCount === 0 && (
                        <span style={{ color: '#fca5a5', fontSize: 11, fontWeight: 600 }}>⚠ Not yet deployed</span>
                      )}
                      {activeCount > 0 && activeCount < plants.length && (
                        <span style={{ color: '#fcd34d', fontSize: 11, fontWeight: 600 }}>Partial adoption</span>
                      )}
                      {activeCount === plants.length && (
                        <span style={{ color: '#86efac', fontSize: 11, fontWeight: 600 }}>Full adoption</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      {/* ── ADOPTION OVERVIEW ────────────────────────────────── */}
      <Card>
        <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-widest">
            Measures Adoption — {selectedWeek?.week}
          </h2>
        </div>
        <div className="p-5 flex flex-col gap-2">
          {adoptionRows.map(row => {
            const total = row.active + row.planned + row.inactive;
            const activePct  = total ? (row.active  / total) * 100 : 0;
            const plannedPct = total ? (row.planned / total) * 100 : 0;
            const isExpanded = expandedMeasure === row.id;
            return (
              <div key={row.id}>
                <div
                  onClick={() => setExpandedMeasure(isExpanded ? null : row.id)}
                  style={{
                    background: dominantBg(row.active, row.planned, row.inactive),
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: isExpanded ? '10px 10px 0 0' : 10,
                    padding: '10px 14px',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}>
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Label */}
                    <span className="text-slate-200 text-xs font-semibold" style={{ minWidth: 200, flex: '0 0 auto' }}>
                      {row.label}
                    </span>
                    {/* Progress bar */}
                    <div style={{ flex: 1, minWidth: 120, height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden', display: 'flex' }}>
                      {row.active > 0 && (
                        <div style={{
                          width: `${activePct}%`,
                          background: STATUS_CFG.active.barBg,
                          boxShadow: `0 0 6px ${STATUS_CFG.active.glow}`,
                          transition: 'width 0.4s',
                        }} />
                      )}
                      {row.planned > 0 && (
                        <div style={{
                          width: `${plannedPct}%`,
                          background: STATUS_CFG.planned.barBg,
                          boxShadow: `0 0 6px ${STATUS_CFG.planned.glow}`,
                          transition: 'width 0.4s',
                        }} />
                      )}
                    </div>
                    {/* Counts */}
                    <div className="flex items-center gap-2 text-xs flex-shrink-0">
                      <span style={{ color: '#86efac', fontWeight: 700 }}>{row.active} Active</span>
                      <span style={{ color: '#94a3b8' }}>·</span>
                      <span style={{ color: '#fcd34d', fontWeight: 600 }}>{row.planned} Planned</span>
                      <span style={{ color: '#94a3b8' }}>·</span>
                      <span style={{ color: '#475569' }}>{row.inactive} Inactive</span>
                      <span style={{ color: '#94a3b8', marginLeft: 4 }}>{isExpanded ? '▲' : '▼'}</span>
                    </div>
                  </div>
                </div>
                {/* Expanded: per-plant breakdown */}
                {isExpanded && (
                  <div style={{
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderTop: 'none',
                    borderRadius: '0 0 10px 10px',
                    padding: '10px 14px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 8,
                  }}>
                    {plants.map(plant => {
                      const status = (measuresData[plant.id] || {})[row.id] || 'inactive';
                      return (
                        <div key={plant.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span className="text-xs text-slate-400">{plant.flag} {plant.name}</span>
                          <MeasureBadge status={status} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* ── MEASURES MATRIX ──────────────────────────────────── */}
      <Card>
        <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-widest">
            Measures Matrix — {selectedWeek?.week}
          </h2>
          <span
            style={isForecast
              ? { background: 'rgba(217,119,6,0.18)', border: '1px solid rgba(217,119,6,0.35)', color: '#fcd34d' }
              : { background: 'rgba(22,163,74,0.18)', border: '1px solid rgba(22,163,74,0.35)', color: '#86efac' }}
            className="px-2.5 py-0.5 rounded-full text-xs font-semibold">
            {isForecast ? '📋 Forecast' : '✅ Actual'}
          </span>
        </div>
        <div className="p-3 overflow-x-auto">
          <table style={{ borderCollapse: 'separate', borderSpacing: '0 2px', width: '100%', minWidth: 860 }}>
            <thead>
              <tr>
                {/* Measure name header */}
                <th style={{
                  position: 'sticky', left: 0, zIndex: 2,
                  background: 'rgba(10,15,30,0.95)',
                  backdropFilter: 'blur(16px)',
                  padding: '8px 14px',
                  textAlign: 'left',
                  fontSize: 10,
                  fontWeight: 700,
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  whiteSpace: 'nowrap',
                  minWidth: 200,
                  borderRadius: '6px 0 0 6px',
                }}>
                  Measure
                </th>
                {/* Plant headers */}
                {plants.map(plant => {
                  const rag = plantRag(kpiData, plant.id);
                  return (
                    <th key={plant.id} style={{
                      padding: '8px 6px',
                      textAlign: 'center',
                      fontSize: 11,
                      color: '#cbd5e1',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      minWidth: 110,
                    }}>
                      <div className="flex flex-col items-center gap-1">
                        <span>{plant.flag} {plant.name}</span>
                        <RagDot status={rag} size={8} />
                      </div>
                    </th>
                  );
                })}
                {/* Active summary header */}
                <th style={{
                  padding: '8px 10px',
                  textAlign: 'center',
                  fontSize: 10,
                  color: '#64748b',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  whiteSpace: 'nowrap',
                }}>
                  Active
                </th>
              </tr>
            </thead>
            <tbody>
              {measures.map(measure => {
                let activeCount = 0, plannedCount = 0, inactiveCount = 0;
                for (const p of plants) {
                  const s = (measuresData[p.id] || {})[measure.id] || 'inactive';
                  if (s === 'active') activeCount++;
                  else if (s === 'planned') plannedCount++;
                  else inactiveCount++;
                }
                const rowBg = dominantBg(activeCount, plannedCount, inactiveCount);
                const isDescOpen = expandedDesc === measure.id;

                return [
                  <tr key={measure.id} style={{ background: rowBg }}>
                    {/* Measure name (sticky) */}
                    <td
                      onClick={() => setExpandedDesc(isDescOpen ? null : measure.id)}
                      style={{
                        position: 'sticky', left: 0, zIndex: 1,
                        background: rowBg || 'rgba(10,15,30,0.9)',
                        backdropFilter: 'blur(16px)',
                        padding: '7px 14px',
                        cursor: 'pointer',
                        borderRadius: '6px 0 0 6px',
                        minWidth: 200,
                      }}>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-200 text-xs font-semibold whitespace-nowrap">{measure.label}</span>
                        <span style={{ color: '#475569', fontSize: 10 }}>{isDescOpen ? '▲' : 'ⓘ'}</span>
                      </div>
                    </td>
                    {/* Plant cells */}
                    {plants.map(plant => {
                      const status = (measuresData[plant.id] || {})[measure.id] || 'inactive';
                      return (
                        <td key={plant.id} style={{ padding: '5px 6px', textAlign: 'center' }}>
                          <MeasureSelect
                            value={status}
                            onChange={val => updateMeasure(plant.id, measure.id, val)}
                          />
                        </td>
                      );
                    })}
                    {/* Summary */}
                    <td style={{ padding: '5px 10px', textAlign: 'center' }}>
                      <ActivePill count={activeCount} total={plants.length} />
                    </td>
                  </tr>,
                  // Description expansion row
                  isDescOpen && (
                    <tr key={`${measure.id}-desc`}>
                      <td
                        colSpan={plants.length + 2}
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          borderTop: 'none',
                          padding: '8px 14px 10px',
                          borderRadius: '0 0 8px 8px',
                        }}>
                        <p className="text-slate-400 text-xs leading-relaxed">{measure.description}</p>
                      </td>
                    </tr>
                  ),
                ];
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── MEASURES TIMELINE (collapsible) ──────────────────── */}
      <Card>
        <div
          className="px-5 py-3 flex items-center justify-between cursor-pointer select-none"
          style={{ borderBottom: timelineOpen ? '1px solid rgba(255,255,255,0.07)' : 'none' }}
          onClick={() => setTimelineOpen(o => !o)}>
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-widest">
            Measures Timeline
          </h2>
          <div className="flex items-center gap-3" onClick={e => e.stopPropagation()}>
            {timelineOpen && (
              <select
                value={timelineMeasure}
                onChange={e => setTimelineMeasure(e.target.value)}
                className="text-xs font-medium rounded-lg px-2 py-1 cursor-pointer outline-none"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'white',
                  minWidth: 220,
                }}>
                {measures.map(m => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
            )}
            <button
              onClick={e => { e.stopPropagation(); setTimelineOpen(o => !o); }}
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#94a3b8',
                borderRadius: 8,
                padding: '3px 12px',
                fontSize: 12,
                cursor: 'pointer',
              }}>
              {timelineOpen ? 'Collapse ▲' : 'Expand ▼'}
            </button>
          </div>
        </div>

        {timelineOpen && (
          <div className="p-5">
            {/* Week header row */}
            <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 10 }}>
              {/* Plant label spacer */}
              <div style={{ minWidth: 72, flexShrink: 0 }} />
              {kpiHistory.map((wk, wi) => (
                <div
                  key={wk.week}
                  style={{
                    width: 22,
                    flexShrink: 0,
                    textAlign: 'center',
                    fontSize: 9,
                    color: wi === selectedWeekIdx ? '#93c5fd' : '#475569',
                    fontWeight: wi === selectedWeekIdx ? 800 : 500,
                    lineHeight: 1.2,
                  }}>
                  {wk.week}
                </div>
              ))}
            </div>

            {/* Status legend */}
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              {[['active', 'Active'], ['planned', 'Planned'], ['inactive', 'Inactive']].map(([s, lbl]) => (
                <div key={s} className="flex items-center gap-1.5">
                  <div style={{
                    width: 14, height: 14, borderRadius: 3,
                    background: STATUS_CFG[s].barBg,
                    border: `1px solid ${STATUS_CFG[s].border}`,
                  }} />
                  <span className="text-xs text-slate-400">{lbl}</span>
                </div>
              ))}
              <div className="flex items-center gap-1.5">
                <div style={{
                  width: 14, height: 14, borderRadius: 3,
                  background: STATUS_CFG.active.barBg,
                  opacity: 0.5,
                  border: '1px solid rgba(22,163,74,0.3)',
                }} />
                <span className="text-xs text-slate-400">Forecast (semi-transparent)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div style={{
                  width: 14, height: 14, borderRadius: 3,
                  background: 'transparent',
                  border: '2px solid rgba(255,255,255,0.7)',
                }} />
                <span className="text-xs text-slate-400">Current week</span>
              </div>
            </div>

            {/* Plant rows */}
            <div className="flex flex-col gap-2">
              {plants.map(plant => (
                <div key={plant.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{
                    minWidth: 72,
                    flexShrink: 0,
                    fontSize: 11,
                    color: '#cbd5e1',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}>
                    {plant.flag} {plant.name}
                  </div>
                  {kpiHistory.map((wk, wi) => {
                    const status = (wk.measuresData?.[plant.id] || {})[timelineMeasure] || 'inactive';
                    return (
                      <WeekBlock
                        key={wk.week}
                        status={status}
                        isCurrent={wi === selectedWeekIdx}
                        isForecast={wk.status === 'forecast'}
                      />
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Selected measure description */}
            {timelineMeasure && (
              <div style={{
                marginTop: 16,
                padding: '10px 14px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 8,
              }}>
                <span className="text-slate-400 text-xs">
                  <span className="text-slate-300 font-semibold">
                    {measures.find(m => m.id === timelineMeasure)?.label}:
                  </span>{' '}
                  {measures.find(m => m.id === timelineMeasure)?.description}
                </span>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
