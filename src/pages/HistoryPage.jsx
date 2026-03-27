import { useState } from 'react';
import {
  RagDot,
  RagBadge,
  GlassCard,
  plantOverallRag,
  countRedKpis,
  computeSeverityIndex,
} from '../components/shared';

// ─── Style constants ──────────────────────────────────────────────────────────

const GLASS = {
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.1)',
};

const GLASS_INNER = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
};

const RAG_CFG = {
  red:   { bar: '#DC2626', glow: 'rgba(220,38,38,0.4)',  text: '#fca5a5' },
  amber: { bar: '#D97706', glow: 'rgba(217,119,6,0.4)',  text: '#fcd34d' },
  green: { bar: '#16A34A', glow: 'rgba(22,163,74,0.4)',  text: '#86efac' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function severityColor(score) {
  if (score > 65) return 'red';
  if (score >= 40) return 'amber';
  return 'green';
}

function plantRedCountForWeek(weekKpiData, plantId) {
  return Object.values(weekKpiData[plantId] || {}).filter(v => v === 'red').length;
}

// Trend between first and last week for a plant
function plantTrendDirection(kpiHistory, plantId) {
  if (kpiHistory.length < 2) return 'stable';
  const ORDER = { red: 0, amber: 1, green: 2 };
  const first = plantOverallRag(kpiHistory[0].kpiData, plantId);
  const last  = plantOverallRag(kpiHistory[kpiHistory.length - 1].kpiData, plantId);
  const diff  = ORDER[last] - ORDER[first];
  if (diff < 0) return 'worsening'; // moved toward red
  if (diff > 0) return 'improving'; // moved toward green
  return 'stable';
}

// Trend for a single KPI at a single plant across history
function kpiTrendDirection(kpiHistory, plantId, kpiId) {
  if (kpiHistory.length < 2) return 'stable';
  const ORDER = { red: 0, amber: 1, green: 2 };
  const first = (kpiHistory[0].kpiData[plantId] || {})[kpiId] || 'green';
  const last  = (kpiHistory[kpiHistory.length - 1].kpiData[plantId] || {})[kpiId] || 'green';
  const diff  = ORDER[last] - ORDER[first];
  if (diff < 0) return 'worsening';
  if (diff > 0) return 'improving';
  return 'stable';
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function TrendArrow({ direction, size = 16 }) {
  const style = { fontSize: size, fontWeight: 700, lineHeight: 1 };
  if (direction === 'worsening') return <span style={{ ...style, color: '#fca5a5' }}>↑</span>;
  if (direction === 'improving') return <span style={{ ...style, color: '#86efac' }}>↓</span>;
  return <span style={{ ...style, color: '#fcd34d' }}>→</span>;
}

function SectionHeader({ title, subtitle, right }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
      <div>
        <h2 className="text-base font-bold text-white tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5 leading-relaxed max-w-2xl">{subtitle}</p>}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}

// ─── 1. PAGE HEADER ───────────────────────────────────────────────────────────

function PageHeader({ kpiHistory }) {
  const totalWeeks  = kpiHistory.length;
  const latestEntry = kpiHistory[kpiHistory.length - 1];

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {/* Icon */}
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
           style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)' }}>
        📈
      </div>

      {/* Title block */}
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl font-black text-white tracking-tight leading-tight">
          Crisis Progression Tracker
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Week-by-week KPI monitoring across all ASEAN ME plants — Strait of Hormuz disruption
        </p>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 flex-wrap shrink-0">
        <span className="px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#93c5fd' }}>
          {totalWeeks} week{totalWeeks !== 1 ? 's' : ''} tracked
        </span>
        {latestEntry && (
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', color: '#fca5a5' }}>
            Current: {latestEntry.label}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── 2. CRISIS SEVERITY TREND (horizontal bar chart) ─────────────────────────

function CrisisSeverityTrend({ kpiHistory, plants, kpis }) {
  const scores = kpiHistory.map(w => ({
    week:  w.week,
    label: w.label,
    date:  w.date,
    score: computeSeverityIndex(w.kpiData, plants, kpis),
  }));

  const first = scores[0]?.score ?? 0;
  const last  = scores[scores.length - 1]?.score ?? 0;
  const delta = last - first;
  const deltaColor  = delta > 0 ? '#fca5a5' : delta < 0 ? '#86efac' : '#fcd34d';
  const deltaBg     = delta > 0 ? 'rgba(220,38,38,0.15)' : delta < 0 ? 'rgba(22,163,74,0.15)' : 'rgba(217,119,6,0.15)';
  const deltaBorder = delta > 0 ? 'rgba(220,38,38,0.35)' : delta < 0 ? 'rgba(22,163,74,0.35)' : 'rgba(217,119,6,0.35)';

  return (
    <GlassCard style={{ ...GLASS, padding: '1.5rem' }}>
      <SectionHeader
        title="Crisis Severity Index — Week-by-Week"
        subtitle="Composite score (0–100) across all plants and KPIs. Red >65 · Amber 40–65 · Green <40. Arrows show change vs previous week."
        right={
          <span className="px-3 py-1.5 rounded-full text-xs font-bold"
                style={{ background: deltaBg, border: `1px solid ${deltaBorder}`, color: deltaColor }}>
            {delta > 0 ? '+' : ''}{delta} pts since {scores[0]?.week ?? 'W1'}
          </span>
        }
      />

      <div className="flex flex-col gap-3">
        {scores.map((s, idx) => {
          const rag       = severityColor(s.score);
          const cfg       = RAG_CFG[rag];
          const prevScore = idx > 0 ? scores[idx - 1].score : null;
          const weekDelta = prevScore !== null ? s.score - prevScore : null;

          return (
            <div key={s.week} className="flex items-center gap-3">
              {/* Week + date */}
              <div className="w-28 shrink-0">
                <div className="text-xs font-bold text-white">{s.week}</div>
                <div className="text-xs text-slate-500 leading-tight">{s.date}</div>
              </div>

              {/* Bar track */}
              <div className="flex-1 relative h-8 rounded-lg overflow-hidden"
                   style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                {/* Filled bar */}
                <div
                  className="absolute inset-y-0 left-0 rounded-lg transition-all duration-700"
                  style={{
                    width: `${s.score}%`,
                    minWidth: '2rem',
                    background: `linear-gradient(90deg, ${cfg.bar}99, ${cfg.bar}ee)`,
                    boxShadow: `inset 0 0 10px ${cfg.glow}`,
                  }}
                />
                {/* Label overlay */}
                <span className="absolute inset-0 flex items-center pl-3 text-xs font-medium text-white/90 pointer-events-none truncate pr-2">
                  {s.label}
                </span>
              </div>

              {/* Score */}
              <div className="w-14 text-right shrink-0 leading-none">
                <span className="text-xl font-black" style={{ color: cfg.bar }}>{s.score}</span>
                <span className="text-xs text-slate-500">/100</span>
              </div>

              {/* Week-on-week arrow */}
              <div className="w-7 text-center shrink-0">
                {weekDelta !== null && (
                  weekDelta > 0
                    ? <span style={{ color: '#fca5a5', fontSize: 20, fontWeight: 700 }}>↑</span>
                    : weekDelta < 0
                      ? <span style={{ color: '#86efac', fontSize: 20, fontWeight: 700 }}>↓</span>
                      : <span style={{ color: '#fcd34d', fontSize: 20, fontWeight: 700 }}>→</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Threshold markers */}
      <div className="flex mt-3 pl-[7.5rem] pr-20 text-xs text-slate-600 justify-between select-none">
        <span>0</span>
        <span style={{ color: '#86efac' }}>40 — Stable</span>
        <span style={{ color: '#D97706' }}>65 — Elevated</span>
        <span>100</span>
      </div>
    </GlassCard>
  );
}

// ─── 3. PER-PLANT RAG PROGRESSION TABLE ──────────────────────────────────────

function PlantRagProgression({ kpiHistory, plants }) {
  return (
    <GlassCard style={{ ...GLASS, padding: '1.5rem' }}>
      <SectionHeader
        title="Plant Status Evolution"
        subtitle="Overall RAG per plant for each tracked week. Trend column = change from first to latest week."
      />

      <div className="overflow-x-auto">
        <table className="border-collapse text-xs" style={{ minWidth: 480, width: '100%' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <th className="text-left py-2.5 pr-4 text-slate-400 font-semibold uppercase tracking-wider whitespace-nowrap"
                  style={{ minWidth: 150 }}>
                Plant
              </th>
              {kpiHistory.map(w => (
                <th key={w.week} className="text-center py-2.5 px-3 whitespace-nowrap" style={{ minWidth: 90 }}>
                  <div className="text-white font-bold">{w.week}</div>
                  <div className="text-slate-500 font-normal text-xs">{w.date}</div>
                </th>
              ))}
              <th className="text-center py-2.5 px-3 text-slate-400 font-semibold uppercase tracking-wider whitespace-nowrap">
                Trend
              </th>
            </tr>
          </thead>
          <tbody>
            {plants.map(plant => {
              const trend = plantTrendDirection(kpiHistory, plant.id);
              return (
                <tr key={plant.id}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    className="hover:bg-white/[0.03] transition-colors">
                  {/* Plant name cell */}
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-lg leading-none">{plant.flag}</span>
                      <div>
                        <div className="text-white font-semibold">{plant.name}</div>
                        <div className="text-slate-500 text-xs">{plant.countryName}</div>
                      </div>
                    </div>
                  </td>

                  {/* Weekly RAG cells */}
                  {kpiHistory.map(w => {
                    const rag      = plantOverallRag(w.kpiData, plant.id);
                    const redCount = plantRedCountForWeek(w.kpiData, plant.id);
                    return (
                      <td key={w.week} className="text-center py-3 px-3">
                        <div className="flex flex-col items-center gap-1">
                          <RagBadge status={rag} />
                          {redCount > 0 && (
                            <span className="text-xs leading-none" style={{ color: '#fca5a5' }}>
                              {redCount} red
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}

                  {/* Trend cell */}
                  <td className="text-center py-3 px-3">
                    <div className="flex flex-col items-center gap-0.5">
                      <TrendArrow direction={trend} size={20} />
                      <span className="text-xs leading-none"
                            style={{ color: trend === 'worsening' ? '#fca5a5' : trend === 'improving' ? '#86efac' : '#fcd34d' }}>
                        {trend}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}

// ─── 4. KPI HEATMAP PROGRESSION ──────────────────────────────────────────────

function KpiHeatmapProgression({ kpiHistory, plants, kpis }) {
  const [selectedPlantId, setSelectedPlantId] = useState(plants[0]?.id || '');
  const plant = plants.find(p => p.id === selectedPlantId);

  // Red counts per week for the selected plant
  const weekRedCounts = kpiHistory.map(w => countRedKpis(w.kpiData, selectedPlantId));

  return (
    <GlassCard style={{ ...GLASS, padding: '1.5rem' }}>
      <SectionHeader
        title={`KPI Detail View — ${plant ? `${plant.flag} ${plant.name}` : '—'}`}
        subtitle="Per-KPI RAG across all weeks. Trend arrow: first → last week."
        right={
          <select
            value={selectedPlantId}
            onChange={e => setSelectedPlantId(e.target.value)}
            className="text-xs rounded-lg px-3 py-1.5 font-medium outline-none cursor-pointer"
            style={{ ...GLASS_INNER, color: '#e2e8f0' }}
          >
            {plants.map(p => (
              <option key={p.id} value={p.id} style={{ background: '#1e293b', color: '#e2e8f0' }}>
                {p.flag} {p.name}
              </option>
            ))}
          </select>
        }
      />

      {/* Red count trend banner */}
      <div className="flex items-center gap-2 mb-4 p-3 rounded-lg flex-wrap"
           style={GLASS_INNER}>
        <span className="text-xs text-slate-400 font-semibold shrink-0">Red KPI count:</span>
        {kpiHistory.map((w, idx) => (
          <span key={w.week} className="flex items-center gap-1">
            <span className="text-xs font-bold text-white">{w.week}</span>
            <span className="text-sm font-black" style={{ color: weekRedCounts[idx] > 0 ? '#fca5a5' : '#86efac' }}>
              {weekRedCounts[idx]}
            </span>
            {idx < kpiHistory.length - 1 && (
              <>
                {weekRedCounts[idx + 1] > weekRedCounts[idx]
                  ? <span style={{ color: '#fca5a5', fontSize: 12 }}>→</span>
                  : weekRedCounts[idx + 1] < weekRedCounts[idx]
                    ? <span style={{ color: '#86efac', fontSize: 12 }}>→</span>
                    : <span style={{ color: '#fcd34d', fontSize: 12 }}>→</span>
                }
              </>
            )}
          </span>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="border-collapse text-xs" style={{ minWidth: 360, width: '100%' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <th className="text-left py-2 pr-4 text-slate-400 font-semibold uppercase tracking-wider whitespace-nowrap"
                  style={{ minWidth: 120 }}>
                KPI
              </th>
              {kpiHistory.map(w => (
                <th key={w.week} className="text-center py-2 px-3 text-white font-bold whitespace-nowrap"
                    style={{ minWidth: 55 }}>
                  {w.week}
                </th>
              ))}
              <th className="text-center py-2 px-3 text-slate-400 font-semibold uppercase tracking-wider whitespace-nowrap">
                Trend
              </th>
            </tr>
          </thead>
          <tbody>
            {kpis.map(kpi => {
              const trend = kpiTrendDirection(kpiHistory, selectedPlantId, kpi.id);
              const allReds = kpiHistory.filter(w => (w.kpiData[selectedPlantId] || {})[kpi.id] === 'red').length;

              return (
                <tr key={kpi.id}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    className="hover:bg-white/[0.03] transition-colors">
                  {/* KPI label */}
                  <td className="py-2.5 pr-4 whitespace-nowrap">
                    <span className="text-slate-300 font-medium">{kpi.short}</span>
                    {allReds > 0 && (
                      <span className="ml-1.5 text-xs" style={{ color: '#fca5a5' }}>({allReds}🔴)</span>
                    )}
                  </td>

                  {/* Weekly RagDot per week */}
                  {kpiHistory.map(w => {
                    const rag = (w.kpiData[selectedPlantId] || {})[kpi.id] || 'green';
                    return (
                      <td key={w.week} className="text-center py-2.5 px-3">
                        <div className="flex items-center justify-center">
                          <RagDot status={rag} size="md" />
                        </div>
                      </td>
                    );
                  })}

                  {/* Trend */}
                  <td className="text-center py-2.5 px-3">
                    <TrendArrow direction={trend} size={16} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}

// ─── 5. RED KPI COUNT PROGRESSION ────────────────────────────────────────────

// Distinct hues for each plant bar segment
const PLANT_COLORS = ['#60a5fa', '#34d399', '#f472b6', '#a78bfa', '#fb923c', '#facc15', '#22d3ee'];

function RedKpiCountProgression({ kpiHistory, plants, kpis }) {
  const weekData = kpiHistory.map(w => {
    const perPlant = plants.map(p => ({
      plant: p,
      count: countRedKpis(w.kpiData, p.id),
    }));
    const total = perPlant.reduce((sum, pp) => sum + pp.count, 0);
    return { week: w, perPlant, total };
  });

  const maxPerPlant = Math.max(...weekData.flatMap(d => d.perPlant.map(pp => pp.count)), 1);

  return (
    <GlassCard style={{ ...GLASS, padding: '1.5rem' }}>
      <SectionHeader
        title="Total Red KPIs Across All Plants — Weekly"
        subtitle="Stacked per-plant red KPI counts. Hover a segment for detail."
      />

      {/* Plant colour legend */}
      <div className="flex flex-wrap gap-3 mb-5">
        {plants.map((p, idx) => (
          <span key={p.id} className="flex items-center gap-1.5 text-xs text-slate-300">
            <span className="inline-block w-3 h-3 rounded-sm shrink-0"
                  style={{ background: PLANT_COLORS[idx % PLANT_COLORS.length] }} />
            {p.flag} {p.name}
          </span>
        ))}
      </div>

      {/* Stacked horizontal bars per week */}
      <div className="flex flex-col gap-4">
        {weekData.map(({ week: w, perPlant, total }) => (
          <div key={w.week} className="flex items-center gap-3">
            {/* Week label */}
            <div className="w-28 shrink-0">
              <div className="text-xs font-bold text-white">{w.week}</div>
              <div className="text-xs text-slate-500">{w.date}</div>
            </div>

            {/* Stacked bar */}
            <div className="flex-1 flex h-8 rounded-lg overflow-hidden"
                 style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              {perPlant.map((pp, idx) => {
                if (pp.count === 0) return null;
                // Width proportional to this plant's count vs max observed per-plant count
                const segPct = (pp.count / (maxPerPlant * plants.length)) * 100;
                return (
                  <div
                    key={pp.plant.id}
                    title={`${pp.plant.flag} ${pp.plant.name}: ${pp.count} red KPI${pp.count !== 1 ? 's' : ''}`}
                    className="h-full flex items-center justify-center transition-all duration-700"
                    style={{
                      width: `${segPct}%`,
                      minWidth: pp.count > 0 ? '1.5rem' : 0,
                      background: PLANT_COLORS[idx % PLANT_COLORS.length],
                      opacity: 0.85,
                      borderRight: '1px solid rgba(0,0,0,0.2)',
                    }}
                  >
                    <span className="text-xs font-bold text-white/90">{pp.count}</span>
                  </div>
                );
              })}
            </div>

            {/* Total */}
            <div className="w-16 text-right shrink-0">
              <span className="text-xl font-black" style={{ color: '#fca5a5' }}>{total}</span>
              <span className="text-xs text-slate-500 ml-1">red</span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary badges per week */}
      <div className="mt-5 grid gap-3" style={{ gridTemplateColumns: `repeat(${weekData.length}, minmax(0,1fr))` }}>
        {weekData.map(({ week: w, total }, idx) => {
          const prev  = idx > 0 ? weekData[idx - 1].total : null;
          const delta = prev !== null ? total - prev : null;
          return (
            <div key={w.week} className="rounded-xl px-3 py-3 text-center" style={GLASS_INNER}>
              <div className="text-xs text-slate-400 font-semibold">{w.week}</div>
              <div className="text-2xl font-black mt-1" style={{ color: '#fca5a5' }}>{total}</div>
              <div className="text-xs text-slate-500">red KPIs</div>
              {delta !== null && (
                <div className="text-xs mt-1 font-bold"
                     style={{ color: delta > 0 ? '#fca5a5' : delta < 0 ? '#86efac' : '#fcd34d' }}>
                  {delta > 0 ? `+${delta}` : `${delta}`} vs prev
                </div>
              )}
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}

// ─── 6. UPDATE LOG / CHANGELOG ────────────────────────────────────────────────

const WEEK_BADGE_STYLES = {
  W1: { color: '#86efac', bg: 'rgba(22,163,74,0.15)',   border: 'rgba(22,163,74,0.3)'  },
  W2: { color: '#fcd34d', bg: 'rgba(217,119,6,0.15)',   border: 'rgba(217,119,6,0.3)'  },
  W3: { color: '#fca5a5', bg: 'rgba(220,38,38,0.15)',   border: 'rgba(220,38,38,0.3)'  },
};

function UpdateLogEntry({ entry, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen || false);
  const wc = WEEK_BADGE_STYLES[entry.week] || {
    color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.25)',
  };

  return (
    <div className="rounded-xl overflow-hidden transition-all"
         style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      {/* Clickable header */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-white/[0.03] transition-colors"
      >
        <div className="flex items-center gap-3 flex-wrap min-w-0">
          {/* Week badge */}
          <span className="px-2.5 py-1 rounded-full text-xs font-bold shrink-0"
                style={{ background: wc.bg, border: `1px solid ${wc.border}`, color: wc.color }}>
            {entry.week}
          </span>
          {/* Date */}
          <span className="text-xs font-mono text-slate-400 shrink-0">{entry.date}</span>
          {/* Updated by */}
          <span className="text-xs text-slate-300 font-medium truncate">{entry.updatedBy}</span>
        </div>

        {/* Chevron */}
        <svg className={`w-4 h-4 text-slate-500 transition-transform shrink-0 ml-3 ${open ? 'rotate-180' : ''}`}
             fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Preview line always visible when collapsed */}
      {!open && (
        <div className="px-5 pb-3">
          <p className="text-xs text-slate-500 truncate">{entry.summary}</p>
        </div>
      )}

      {/* Expanded body */}
      {open && (
        <div className="px-5 pb-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-sm text-slate-300 leading-relaxed">{entry.summary}</p>
        </div>
      )}
    </div>
  );
}

function UpdateLog({ updateHistory }) {
  // Most recent first
  const sorted = [...(updateHistory || [])].sort((a, b) => b.id - a.id);

  return (
    <GlassCard style={{ ...GLASS, padding: '1.5rem' }}>
      <SectionHeader
        title="Update History"
        subtitle="Weekly snapshot log. Click an entry to expand the full summary."
        right={
          <span className="text-xs text-slate-500">
            {sorted.length} entr{sorted.length !== 1 ? 'ies' : 'y'}
          </span>
        }
      />

      <div className="flex flex-col gap-2.5">
        {sorted.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-6">No update history available.</p>
        ) : (
          sorted.map((entry, idx) => (
            <UpdateLogEntry key={entry.id} entry={entry} defaultOpen={idx === 0} />
          ))
        )}
      </div>
    </GlassCard>
  );
}

// ─── MAIN PAGE EXPORT ─────────────────────────────────────────────────────────

export default function HistoryPage({
  plants        = [],
  kpis          = [],
  kpiHistory    = [],
  kpiData       = {},
  updateHistory = [],
}) {
  // Guard: no history yet
  if (kpiHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <div className="text-5xl">📈</div>
        <div className="text-lg font-bold text-white">No historical data yet</div>
        <p className="text-sm text-slate-400 max-w-sm">
          Weekly KPI snapshots will appear here as they are recorded via the Weekly Update page.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* 1 — Page header */}
      <PageHeader kpiHistory={kpiHistory} />

      {/* 2 — Crisis severity trend chart */}
      <CrisisSeverityTrend kpiHistory={kpiHistory} plants={plants} kpis={kpis} />

      {/* 3 — Plant RAG progression matrix */}
      <PlantRagProgression kpiHistory={kpiHistory} plants={plants} />

      {/* 4 + 5 — KPI heatmap & red count side-by-side on xl screens */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <KpiHeatmapProgression kpiHistory={kpiHistory} plants={plants} kpis={kpis} />
        <RedKpiCountProgression kpiHistory={kpiHistory} plants={plants} kpis={kpis} />
      </div>

      {/* 6 — Changelog / update log */}
      <UpdateLog updateHistory={updateHistory} />
    </div>
  );
}
