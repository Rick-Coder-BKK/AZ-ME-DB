import { useState } from 'react';
import {
  RagDot, RagBadge, RagSelect, MeasureSelect, SectionCard, GlassCard, Card,
  MeasureStatusBadge, plantOverallRag, countRedKpis,
} from '../components/shared';

// ─── KPI → recommended measures mapping ──────────────────────────────────────
const KPI_RECOMMENDATIONS = [
  {
    kpiIds:     ['rawMaterial', 'supplierReliability'],
    measureIds: ['bufferStock', 'altSupplier'],
    title:      'Raw Material & Supplier Risk',
    why:        'Multiple plants show Red on Raw Material Availability or Supplier Reliability.',
    priority:   'High',
  },
  {
    kpiIds:     ['fuelDiesel'],
    measureIds: ['fuelHoarding'],
    title:      'Fuel / Diesel Shortage',
    why:        'Fuel/Diesel is flagged Red across several plants — generator autonomy is at risk.',
    priority:   'High',
  },
  {
    kpiIds:     ['logisticsLeadTime', 'logisticsCosts', 'portCustoms'],
    measureIds: ['routeDiversification'],
    title:      'Logistics Disruption',
    why:        'Logistics Lead Times, Costs, or Port operations are Red — route diversification needed.',
    priority:   'High',
  },
  {
    kpiIds:     ['customerImpact'],
    measureIds: ['customerComms'],
    title:      'Customer Impact Risk',
    why:        'Customer Impact is Red — proactive communication is essential to manage expectations.',
    priority:   'Medium',
  },
  {
    kpiIds:     ['energySupply'],
    measureIds: ['energyHedging'],
    title:      'Energy Supply Instability',
    why:        'Energy Supply Reliability is Red — hedging and consumption reduction should be activated.',
    priority:   'Medium',
  },
  {
    kpiIds:     ['fxRisk'],
    measureIds: ['fxHedging'],
    title:      'FX / Currency Risk',
    why:        'FX Risk is Red — forward contracts can protect against further currency depreciation.',
    priority:   'Medium',
  },
];

function computeRedKpiCounts(plants, kpiData) {
  const counts = {};
  for (const plant of plants) {
    const plantKpis = kpiData[plant.id] || {};
    for (const [kpiId, status] of Object.entries(plantKpis)) {
      if (status === 'red') counts[kpiId] = (counts[kpiId] || 0) + 1;
    }
  }
  return counts;
}

function getTopRecommendations(plants, kpiData, limit = 3) {
  const redCounts = computeRedKpiCounts(plants, kpiData);
  return KPI_RECOMMENDATIONS
    .map(rec => ({
      ...rec,
      score: rec.kpiIds.reduce((sum, id) => sum + (redCounts[id] || 0), 0),
    }))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// ─── Glass priority badge ─────────────────────────────────────────────────────
function PriorityBadge({ priority }) {
  const isHigh = priority === 'High';
  return (
    <span
      className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold"
      style={isHigh ? {
        background: 'rgba(220,38,38,0.2)',
        border: '1px solid rgba(220,38,38,0.4)',
        color: '#fca5a5',
      } : {
        background: 'rgba(217,119,6,0.2)',
        border: '1px solid rgba(217,119,6,0.4)',
        color: '#fcd34d',
      }}
    >
      {priority} Priority
    </span>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function MeasuresTrackerPage({ plants = [], kpis = [], measures = [], kpiData = {}, measuresData = {}, setMeasuresData }) {
  const [expandedMeasure, setExpandedMeasure] = useState(null);

  // ── Handle MeasureSelect onChange ──────────────────────────────────────────
  function handleMeasureChange(plantId, measureId, newVal) {
    setMeasuresData(prev => ({
      ...prev,
      [plantId]: {
        ...(prev[plantId] || {}),
        [measureId]: newVal,
      },
    }));
  }

  // ── Adoption summary per measure ───────────────────────────────────────────
  function adoptionFor(measureId) {
    let active = 0, planned = 0, inactive = 0;
    for (const plant of plants) {
      const s = (measuresData[plant.id] || {})[measureId] || 'inactive';
      if (s === 'active') active++;
      else if (s === 'planned') planned++;
      else inactive++;
    }
    return { active, planned, inactive };
  }

  const measuresWithAdoption = measures.map(m => ({ ...m, ...adoptionFor(m.id) }));
  const sortedByAdoption = [...measuresWithAdoption].sort((a, b) => {
    if (b.active !== a.active) return b.active - a.active;
    return b.planned - a.planned;
  });

  const topRecs = getTopRecommendations(plants, kpiData, 3);

  function activeCount(measureId) {
    return plants.filter(p => (measuresData[p.id] || {})[measureId] === 'active').length;
  }

  function toggleExpand(measureId) {
    setExpandedMeasure(prev => (prev === measureId ? null : measureId));
  }

  // ── glass table cell style ──────────────────────────────────────────────────
  const cellStyle = {
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    padding: '6px 8px',
  };

  return (
    <div className="space-y-6">

      {/* ── PAGE HEADER ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Measures Tracker</h1>
          <p className="text-slate-400 text-sm mt-1">
            Crisis mitigation measures across all {plants.length} ASEAN plants
          </p>
        </div>

        {/* Legend */}
        <div
          className="flex items-center gap-4 px-4 py-2.5 rounded-xl text-xs shrink-0"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <span className="flex items-center gap-2 text-slate-300">
            <span style={{
              width: 10, height: 10, borderRadius: '50%',
              background: '#16A34A',
              boxShadow: '0 0 8px rgba(22,163,74,0.7)',
              display: 'inline-block',
            }} />
            Active
          </span>
          <span className="flex items-center gap-2 text-slate-300">
            <span style={{
              width: 10, height: 10, borderRadius: '50%',
              background: '#D97706',
              boxShadow: '0 0 8px rgba(217,119,6,0.6)',
              display: 'inline-block',
            }} />
            Planned
          </span>
          <span className="flex items-center gap-2 text-slate-300">
            <span style={{
              width: 10, height: 10, borderRadius: '50%',
              background: 'transparent',
              border: '2px solid #475569',
              display: 'inline-block',
            }} />
            Inactive
          </span>
        </div>
      </div>

      {/* ── RECOMMENDED PRIORITY ACTIONS ── */}
      <SectionCard title="Recommended Priority Actions">
        {topRecs.length === 0 ? (
          <p className="text-sm text-slate-400">No critical red KPI patterns detected. Continue monitoring.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topRecs.map((rec, i) => {
              const measureLabels = rec.measureIds.map(mid => {
                const m = measures.find(x => x.id === mid);
                return m ? m.label : mid;
              });
              const isHigh = rec.priority === 'High';
              return (
                <div
                  key={i}
                  className="rounded-xl p-4 flex flex-col gap-3"
                  style={isHigh ? {
                    background: 'rgba(220,38,38,0.08)',
                    border: '1px solid rgba(220,38,38,0.25)',
                    borderLeft: '3px solid #DC2626',
                  } : {
                    background: 'rgba(217,119,6,0.08)',
                    border: '1px solid rgba(217,119,6,0.25)',
                    borderLeft: '3px solid #D97706',
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-white leading-tight">{rec.title}</h3>
                    <PriorityBadge priority={rec.priority} />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{rec.why}</p>
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Activate:</p>
                    {measureLabels.map((ml, j) => (
                      <div key={j} className="flex items-center gap-2 text-xs">
                        <span style={{ color: isHigh ? '#fca5a5' : '#fcd34d' }}>→</span>
                        <span className="font-medium text-slate-200">{ml}</span>
                      </div>
                    ))}
                  </div>
                  <div
                    className="pt-2 mt-auto"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    <span className="text-xs text-slate-500">
                      {rec.score} plant{rec.score !== 1 ? 's' : ''} affected
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      {/* ── MEASURES ADOPTION OVERVIEW ── */}
      <SectionCard title={`Measures Adoption Overview — All ${plants.length} Plants`}>
        <div className="space-y-2.5">
          {sortedByAdoption.map(m => {
            const total      = plants.length || 1;
            const activePct  = (m.active  / total) * 100;
            const plannedPct = (m.planned / total) * 100;
            const inactivePct= (m.inactive/ total) * 100;
            return (
              <div key={m.id} className="flex items-center gap-3 text-xs">
                {/* Label */}
                <button
                  type="button"
                  onClick={() => toggleExpand(m.id)}
                  className="w-52 shrink-0 text-left font-medium truncate transition-colors"
                  style={{ color: expandedMeasure === m.id ? '#93c5fd' : '#cbd5e1' }}
                  title={m.label}
                >
                  {m.label}
                </button>

                {/* Stacked bar */}
                <div
                  className="flex flex-1 h-5 rounded-lg overflow-hidden min-w-0"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  {m.active > 0 && (
                    <div
                      className="h-full flex items-center justify-center text-white font-bold"
                      style={{
                        width: `${activePct}%`,
                        background: '#16A34A',
                        boxShadow: '0 0 10px rgba(22,163,74,0.5)',
                        fontSize: 10,
                      }}
                      title={`Active: ${m.active}`}
                    >
                      {activePct >= 12 ? m.active : ''}
                    </div>
                  )}
                  {m.planned > 0 && (
                    <div
                      className="h-full flex items-center justify-center text-white font-bold"
                      style={{
                        width: `${plannedPct}%`,
                        background: '#D97706',
                        boxShadow: '0 0 10px rgba(217,119,6,0.5)',
                        fontSize: 10,
                      }}
                      title={`Planned: ${m.planned}`}
                    >
                      {plannedPct >= 12 ? m.planned : ''}
                    </div>
                  )}
                  {m.inactive > 0 && (
                    <div
                      className="h-full"
                      style={{ width: `${inactivePct}%`, background: 'rgba(100,116,139,0.2)' }}
                      title={`Inactive: ${m.inactive}`}
                    />
                  )}
                </div>

                {/* Counts */}
                <span className="shrink-0 whitespace-nowrap w-44 text-right" style={{ color: '#64748b' }}>
                  <span style={{ color: '#86efac', fontWeight: 600 }}>{m.active} Active</span>
                  {' | '}
                  <span style={{ color: '#fcd34d', fontWeight: 600 }}>{m.planned} Planned</span>
                  {' | '}
                  <span>{m.inactive} Off</span>
                </span>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* ── MEASURES MATRIX TABLE ── */}
      <Card>
        {/* Table header */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-widest">
            Measures Status Matrix
          </h2>
          <span className="text-xs text-slate-500">Select per plant to update</span>
        </div>

        <div className="overflow-x-auto p-2" style={{ WebkitOverflowScrolling: 'touch' }}>
          <table
            className="w-full text-xs border-collapse"
            style={{ minWidth: 900 }}
          >
            <thead>
              <tr>
                {/* Measure column */}
                <th
                  className="text-left py-3 px-3 font-semibold text-slate-400 sticky left-0 z-10 w-44"
                  style={{
                    background: 'rgba(15,23,42,0.95)',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    borderRight: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  Measure
                </th>

                {/* Plant columns */}
                {plants.map(plant => {
                  const rag = plantOverallRag(kpiData, plant.id);
                  return (
                    <th
                      key={plant.id}
                      className="text-center py-3 px-2 font-semibold"
                      style={{
                        minWidth: 90,
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-base">{plant.flag}</span>
                        <span className="text-slate-300 font-semibold text-xs leading-tight">
                          {plant.name}
                        </span>
                        <RagDot status={rag} size="sm" />
                      </div>
                    </th>
                  );
                })}

                {/* Summary column */}
                <th
                  className="text-center py-3 px-3 font-semibold text-slate-400"
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    borderLeft: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  Active
                </th>
              </tr>
            </thead>

            <tbody>
              {measures.map((measure, rowIdx) => {
                const isExpanded = expandedMeasure === measure.id;
                const ac = activeCount(measure.id);
                const rowBg = rowIdx % 2 === 0
                  ? 'rgba(255,255,255,0.02)'
                  : 'transparent';

                return (
                  <>
                    <tr
                      key={measure.id}
                      style={{ background: rowBg }}
                      className="transition-colors hover:bg-white/5"
                    >
                      {/* Measure name — clickable */}
                      <td
                        className="py-2 px-3 sticky left-0 z-10 cursor-pointer"
                        style={{
                          background: rowIdx % 2 === 0 ? 'rgba(15,23,42,0.97)' : 'rgba(15,23,42,0.94)',
                          borderBottom: '1px solid rgba(255,255,255,0.05)',
                          borderRight: '1px solid rgba(255,255,255,0.07)',
                        }}
                        onClick={() => toggleExpand(measure.id)}
                      >
                        <div className="flex items-center gap-1.5">
                          <span
                            className="text-slate-500 text-xs transition-transform inline-block"
                            style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
                          >
                            ▶
                          </span>
                          <span
                            className="truncate max-w-[9rem] font-medium transition-colors"
                            style={{ color: isExpanded ? '#93c5fd' : '#cbd5e1' }}
                            title={measure.label}
                          >
                            {measure.label}
                          </span>
                        </div>
                      </td>

                      {/* Plant MeasureSelect dropdowns */}
                      {plants.map(plant => {
                        const current = (measuresData[plant.id] || {})[measure.id] || 'inactive';
                        return (
                          <td
                            key={plant.id}
                            className="text-center py-2 px-2"
                            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                          >
                            <div className="flex justify-center">
                              <MeasureSelect
                                value={current}
                                onChange={newVal => handleMeasureChange(plant.id, measure.id, newVal)}
                              />
                            </div>
                          </td>
                        );
                      })}

                      {/* Active count summary */}
                      <td
                        className="text-center py-2 px-3 font-bold"
                        style={{
                          borderBottom: '1px solid rgba(255,255,255,0.05)',
                          borderLeft: '1px solid rgba(255,255,255,0.07)',
                          color: ac === plants.length
                            ? '#86efac'
                            : ac === 0
                            ? '#475569'
                            : '#86efac',
                        }}
                      >
                        {ac}/{plants.length}
                      </td>
                    </tr>

                    {/* Expanded description row */}
                    {isExpanded && (
                      <tr key={`${measure.id}-detail`}>
                        <td
                          colSpan={plants.length + 2}
                          style={{
                            background: 'rgba(59,130,246,0.06)',
                            borderBottom: '1px solid rgba(59,130,246,0.15)',
                            borderLeft: '2px solid rgba(59,130,246,0.4)',
                            padding: '12px 16px',
                          }}
                        >
                          <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                                Description
                              </p>
                              <p className="text-sm text-slate-300 leading-relaxed">
                                {measure.description}
                              </p>
                            </div>
                            <div className="shrink-0">
                              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                Plant Status
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {plants.map(p => {
                                  const status = (measuresData[p.id] || {})[measure.id] || 'inactive';
                                  return (
                                    <div key={p.id} className="flex items-center gap-1.5">
                                      <span className="text-sm">{p.flag}</span>
                                      <span className="text-xs text-slate-400">{p.name}</span>
                                      <MeasureStatusBadge status={status} />
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
}
