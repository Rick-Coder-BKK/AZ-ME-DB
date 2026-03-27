import { useState } from 'react';
import { RagDot, SectionCard, MeasureStatusBadge, plantOverallRag, countRedKpis } from '../components/shared';

// ─── Status cycle ────────────────────────────────────────────────────────────
const STATUS_CYCLE = ['inactive', 'planned', 'active'];

function nextStatus(current) {
  const idx = STATUS_CYCLE.indexOf(current);
  return STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
}

// ─── Status dot (clickable) ───────────────────────────────────────────────────
function StatusDot({ status, onClick }) {
  const cfg = {
    active:   { color: '#16A34A', filled: true,  label: 'Active'   },
    planned:  { color: '#D97706', filled: true,  label: 'Planned'  },
    inactive: { color: '#94A3B8', filled: false, label: 'Inactive' },
  };
  const { color, filled, label } = cfg[status] || cfg.inactive;
  return (
    <button
      onClick={onClick}
      title={`${label} — click to cycle`}
      className="flex items-center justify-center w-7 h-7 rounded-full hover:ring-2 hover:ring-offset-1 transition-all focus:outline-none focus:ring-2"
      style={{ '--tw-ring-color': color }}
    >
      <span
        style={{
          width: 14,
          height: 14,
          borderRadius: '50%',
          display: 'inline-block',
          background: filled ? color : 'transparent',
          border: `2px solid ${color}`,
        }}
      />
    </button>
  );
}

// ─── KPI → recommended measures mapping ──────────────────────────────────────
const KPI_RECOMMENDATIONS = [
  {
    kpiIds:       ['rawMaterial', 'supplierReliability'],
    measureIds:   ['bufferStock', 'altSupplier'],
    title:        'Raw Material & Supplier Risk',
    why:          'Multiple plants show Red on Raw Material Availability or Supplier Reliability.',
    priority:     'High',
  },
  {
    kpiIds:       ['fuelDiesel'],
    measureIds:   ['fuelHoarding'],
    title:        'Fuel / Diesel Shortage',
    why:          'Fuel/Diesel is flagged Red across several plants — generator autonomy is at risk.',
    priority:     'High',
  },
  {
    kpiIds:       ['logisticsLeadTime', 'logisticsCosts', 'portCustoms'],
    measureIds:   ['routeDiversification'],
    title:        'Logistics Disruption',
    why:          'Logistics Lead Times, Costs, or Port operations are Red — route diversification needed.',
    priority:     'High',
  },
  {
    kpiIds:       ['customerImpact'],
    measureIds:   ['customerComms'],
    title:        'Customer Impact Risk',
    why:          'Customer Impact is Red — proactive communication is essential to manage expectations.',
    priority:     'Medium',
  },
  {
    kpiIds:       ['energySupply'],
    measureIds:   ['energyHedging'],
    title:        'Energy Supply Instability',
    why:          'Energy Supply Reliability is Red — hedging and consumption reduction should be activated.',
    priority:     'Medium',
  },
  {
    kpiIds:       ['fxRisk'],
    measureIds:   ['fxHedging'],
    title:        'FX / Currency Risk',
    why:          'FX Risk is Red — forward contracts can protect against further currency depreciation.',
    priority:     'Medium',
  },
];

function computeRedKpiCounts(plants, kpiData) {
  // Returns { kpiId: count } of how many plants are Red for each KPI
  const counts = {};
  for (const plant of plants) {
    const plantKpis = kpiData[plant.id] || {};
    for (const [kpiId, status] of Object.entries(plantKpis)) {
      if (status === 'red') {
        counts[kpiId] = (counts[kpiId] || 0) + 1;
      }
    }
  }
  return counts;
}

function getTopRecommendations(plants, kpiData, limit = 3) {
  const redCounts = computeRedKpiCounts(plants, kpiData);

  // Score each recommendation group by total red plants across its KPI triggers
  const scored = KPI_RECOMMENDATIONS.map(rec => {
    const score = rec.kpiIds.reduce((sum, id) => sum + (redCounts[id] || 0), 0);
    return { ...rec, score };
  });

  // Filter out groups with score 0, sort by score desc, return top N
  return scored
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// ─── Priority badge ───────────────────────────────────────────────────────────
function PriorityBadge({ priority }) {
  const cfg = priority === 'High'
    ? 'bg-red-100 text-red-700 border border-red-300'
    : 'bg-amber-100 text-amber-700 border border-amber-300';
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${cfg}`}>
      {priority} Priority
    </span>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function MeasuresTrackerPage({ plants, kpis, measures, kpiData, measuresData, setMeasuresData }) {
  const [expandedMeasure, setExpandedMeasure] = useState(null);

  // ── Toggle a measure status for a plant ────────────────────────────────────
  function handleToggle(plantId, measureId) {
    const current = (measuresData[plantId] || {})[measureId] || 'inactive';
    const next = nextStatus(current);
    setMeasuresData(prev => ({
      ...prev,
      [plantId]: {
        ...(prev[plantId] || {}),
        [measureId]: next,
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

  const measuresWithAdoption = measures.map(m => ({
    ...m,
    ...adoptionFor(m.id),
  }));

  const sortedByAdoption = [...measuresWithAdoption].sort((a, b) => {
    if (b.active !== a.active) return b.active - a.active;
    return b.planned - a.planned;
  });

  // ── Recommendations ────────────────────────────────────────────────────────
  const topRecs = getTopRecommendations(plants, kpiData, 3);

  // ── Active count per measure (for summary column) ──────────────────────────
  function activeCount(measureId) {
    return plants.filter(p => (measuresData[p.id] || {})[measureId] === 'active').length;
  }

  // ── Toggle expand ──────────────────────────────────────────────────────────
  function toggleExpand(measureId) {
    setExpandedMeasure(prev => (prev === measureId ? null : measureId));
  }

  // ── Plant status breakdown for expanded measure ────────────────────────────
  function plantStatusBreakdown(measureId) {
    return plants.map(p => ({
      plant: p,
      status: (measuresData[p.id] || {})[measureId] || 'inactive',
    }));
  }

  return (
    <div className="space-y-6">

      {/* ── PAGE HEADER ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Measures Tracker</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Crisis mitigation measures status across all 7 ASEAN plants
          </p>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-slate-600 bg-white border border-slate-200 rounded-lg px-4 py-2 shadow-sm">
          <span className="flex items-center gap-1.5">
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#16A34A', display: 'inline-block' }} />
            Active
          </span>
          <span className="flex items-center gap-1.5">
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#D97706', display: 'inline-block' }} />
            Planned
          </span>
          <span className="flex items-center gap-1.5">
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'transparent', border: '2px solid #94A3B8', display: 'inline-block' }} />
            Inactive
          </span>
        </div>
      </div>

      {/* ── RECOMMENDED PRIORITY ACTIONS ──────────────────────────────────── */}
      <SectionCard title="Recommended Priority Actions">
        {topRecs.length === 0 ? (
          <p className="text-sm text-slate-500">No critical red KPI patterns detected. Continue monitoring.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topRecs.map((rec, i) => {
              const measureLabels = rec.measureIds.map(mid => {
                const m = measures.find(x => x.id === mid);
                return m ? m.label : mid;
              });
              return (
                <div
                  key={i}
                  className={`rounded-lg border-l-4 p-4 ${
                    rec.priority === 'High'
                      ? 'border-l-red-500 bg-red-50'
                      : 'border-l-amber-400 bg-amber-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm font-semibold text-slate-800 leading-tight">{rec.title}</h3>
                    <PriorityBadge priority={rec.priority} />
                  </div>
                  <p className="text-xs text-slate-600 mb-3">{rec.why}</p>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-700 uppercase tracking-wide">Activate:</p>
                    {measureLabels.map((ml, j) => (
                      <div key={j} className="flex items-center gap-1.5 text-xs text-slate-700">
                        <span className="text-slate-400">→</span>
                        <span className="font-medium">{ml}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200">
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

      {/* ── MEASURES ADOPTION OVERVIEW ─────────────────────────────────────── */}
      <SectionCard title={`Measures Adoption Overview (All ${plants.length} Plants)`}>
        <div className="space-y-2">
          {sortedByAdoption.map(m => {
            const total = plants.length;
            const activePct  = (m.active  / total) * 100;
            const plannedPct = (m.planned / total) * 100;
            const inactivePct = (m.inactive / total) * 100;
            return (
              <div key={m.id} className="flex items-center gap-3 text-xs">
                {/* Measure name */}
                <span
                  className="w-52 shrink-0 truncate text-slate-700 font-medium cursor-pointer hover:text-blue-600 hover:underline"
                  title={m.label}
                  onClick={() => toggleExpand(m.id)}
                >
                  {m.label}
                </span>
                {/* Mini bar chart */}
                <div className="flex flex-1 h-5 rounded overflow-hidden min-w-0 border border-slate-200">
                  {m.active > 0 && (
                    <div
                      className="h-full flex items-center justify-center text-white text-[10px] font-semibold"
                      style={{ width: `${activePct}%`, background: '#16A34A' }}
                      title={`Active: ${m.active}`}
                    >
                      {m.active > 0 && activePct >= 12 ? m.active : ''}
                    </div>
                  )}
                  {m.planned > 0 && (
                    <div
                      className="h-full flex items-center justify-center text-white text-[10px] font-semibold"
                      style={{ width: `${plannedPct}%`, background: '#D97706' }}
                      title={`Planned: ${m.planned}`}
                    >
                      {m.planned > 0 && plannedPct >= 12 ? m.planned : ''}
                    </div>
                  )}
                  {m.inactive > 0 && (
                    <div
                      className="h-full flex items-center justify-center text-slate-400 text-[10px]"
                      style={{ width: `${inactivePct}%`, background: '#F1F5F9' }}
                      title={`Inactive: ${m.inactive}`}
                    >
                      {m.inactive > 0 && inactivePct >= 12 ? m.inactive : ''}
                    </div>
                  )}
                </div>
                {/* Counts text */}
                <span className="shrink-0 text-slate-500 whitespace-nowrap w-44 text-right">
                  <span className="text-green-700 font-semibold">{m.active} Active</span>
                  {' | '}
                  <span className="text-amber-600 font-semibold">{m.planned} Planned</span>
                  {' | '}
                  <span className="text-slate-400">{m.inactive} Inactive</span>
                </span>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* ── MEASURES MATRIX TABLE ─────────────────────────────────────────── */}
      <SectionCard title="Measures Status Matrix — Click Dots to Toggle">
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-xs border-collapse" style={{ minWidth: 860 }}>
            <thead>
              <tr className="bg-slate-50 border-b-2 border-slate-200">
                {/* Measure column header */}
                <th className="text-left py-2.5 px-3 font-semibold text-slate-600 w-48 sticky left-0 bg-slate-50 z-10 border-r border-slate-200">
                  Measure
                </th>
                {/* Plant column headers */}
                {plants.map(plant => {
                  const rag = plantOverallRag(kpiData, plant.id);
                  const ragColor = { red: '#DC2626', amber: '#D97706', green: '#16A34A' }[rag];
                  return (
                    <th
                      key={plant.id}
                      className="text-center py-2.5 px-1.5 font-semibold text-slate-700"
                      style={{ minWidth: 76 }}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span>{plant.flag}</span>
                        <span className="text-slate-800">{plant.name}</span>
                        <span
                          className="inline-block px-1.5 py-0.5 rounded-full text-white font-bold"
                          style={{ background: ragColor, fontSize: '9px', letterSpacing: '0.05em' }}
                        >
                          {rag.toUpperCase()}
                        </span>
                      </div>
                    </th>
                  );
                })}
                {/* Summary column header */}
                <th className="text-center py-2.5 px-3 font-semibold text-slate-600 border-l border-slate-200">
                  Active
                </th>
              </tr>
            </thead>
            <tbody>
              {measures.map((measure, rowIdx) => {
                const isEven = rowIdx % 2 === 0;
                const isExpanded = expandedMeasure === measure.id;
                const ac = activeCount(measure.id);
                const breakdown = isExpanded ? plantStatusBreakdown(measure.id) : [];

                return (
                  <>
                    <tr
                      key={measure.id}
                      className={`border-b border-slate-100 transition-colors ${isEven ? 'bg-white' : 'bg-slate-50/60'} hover:bg-blue-50/30`}
                    >
                      {/* Measure name — clickable to expand */}
                      <td
                        className="py-2 px-3 font-medium text-slate-700 sticky left-0 z-10 border-r border-slate-200 cursor-pointer hover:text-blue-600 select-none"
                        style={{ background: isEven ? '#ffffff' : '#f9fafb' }}
                        onClick={() => toggleExpand(measure.id)}
                      >
                        <div className="flex items-center gap-1.5">
                          <span
                            className="text-slate-400 text-xs transition-transform inline-block"
                            style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
                          >
                            ▶
                          </span>
                          <span className="truncate max-w-[11rem]" title={measure.label}>
                            {measure.label}
                          </span>
                        </div>
                      </td>
                      {/* Plant status dots */}
                      {plants.map(plant => {
                        const status = (measuresData[plant.id] || {})[measure.id] || 'inactive';
                        return (
                          <td key={plant.id} className="text-center py-2 px-1.5">
                            <div className="flex justify-center">
                              <StatusDot
                                status={status}
                                onClick={() => handleToggle(plant.id, measure.id)}
                              />
                            </div>
                          </td>
                        );
                      })}
                      {/* Active count */}
                      <td className="text-center py-2 px-3 border-l border-slate-200">
                        <span
                          className={`inline-block font-semibold ${
                            ac === plants.length
                              ? 'text-green-700'
                              : ac === 0
                              ? 'text-slate-400'
                              : 'text-green-600'
                          }`}
                        >
                          {ac}/{plants.length}
                        </span>
                      </td>
                    </tr>

                    {/* Expanded detail row */}
                    {isExpanded && (
                      <tr
                        key={`${measure.id}-detail`}
                        className="border-b border-blue-100"
                      >
                        <td
                          colSpan={plants.length + 2}
                          className="px-4 py-3 bg-blue-50/60"
                        >
                          <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
                            {/* Description */}
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                                Description
                              </p>
                              <p className="text-sm text-slate-700">{measure.description}</p>
                            </div>
                            {/* Plant breakdown */}
                            <div className="shrink-0">
                              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                                Plant Status
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {breakdown.map(({ plant, status }) => (
                                  <div key={plant.id} className="flex items-center gap-1.5">
                                    <span className="text-sm">{plant.flag}</span>
                                    <span className="text-xs text-slate-600 font-medium">{plant.name}</span>
                                    <MeasureStatusBadge status={status} />
                                  </div>
                                ))}
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
      </SectionCard>

    </div>
  );
}
