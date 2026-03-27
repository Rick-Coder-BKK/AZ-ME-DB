import { useState } from 'react';
import { RagDot, RagBadge, SectionCard, plantOverallRag } from '../components/shared';

// ─── Constants ────────────────────────────────────────────────────────────────

const RAG_ORDER = { red: 0, amber: 1, green: 2 };

const COUNTRIES = [
  { code: 'ALL', label: 'All' },
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

function kpiSummary(kpis, plants, kpiData) {
  return kpis.map((kpi) => {
    const statuses = plants.map((p) => (kpiData[p.id] || {})[kpi.id] || 'green');
    const red   = statuses.filter((s) => s === 'red').length;
    const amber = statuses.filter((s) => s === 'amber').length;
    const green = statuses.filter((s) => s === 'green').length;
    return { kpiId: kpi.id, worst: worstStatus(statuses), red, amber, green };
  });
}

function heatmapStats(kpis, plants, kpiData) {
  let totalRed = 0, totalAmber = 0, totalGreen = 0;
  const kpiRedCounts  = {};
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
  const criticalKpi     = kpis.find((k) => k.id === criticalKpiId);
  const criticalPlant   = plants.find((p) => p.id === criticalPlantId);

  return {
    totalRed,
    totalAmber,
    totalGreen,
    criticalKpi:   criticalKpi   ? `${criticalKpi.short} (${kpiRedCounts[criticalKpiId]} red)` : '—',
    criticalPlant: criticalPlant ? `${criticalPlant.flag} ${criticalPlant.name} (${plantRedCounts[criticalPlantId]} red)` : '—',
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FilterBar({ active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {COUNTRIES.map((c) => {
        const isActive = active === c.code;
        return (
          <button
            key={c.code}
            onClick={() => onChange(c.code)}
            className={[
              'px-4 py-1.5 rounded-full text-sm font-medium border transition-colors',
              isActive
                ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                : 'bg-white text-slate-600 border-slate-300 hover:border-slate-500 hover:text-slate-800',
            ].join(' ')}
          >
            {c.flag ? `${c.flag} ${c.label}` : c.label}
          </button>
        );
      })}
    </div>
  );
}

function SummaryRow({ kpis, summaries }) {
  return (
    <SectionCard title="KPI Summary (All Plants)">
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs">
          <thead>
            <tr>
              <th className="text-left pr-4 py-2 text-slate-500 font-medium w-28">KPI</th>
              <th className="text-center px-2 py-2 text-slate-500 font-medium">Worst</th>
              <th className="text-center px-2 py-2 text-slate-500 font-medium">Breakdown</th>
            </tr>
          </thead>
          <tbody>
            {kpis.map((kpi, i) => {
              const s = summaries[i];
              return (
                <tr key={kpi.id} className={i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                  <td className="pr-4 py-1.5 font-medium text-slate-700 whitespace-nowrap">{kpi.short}</td>
                  <td className="text-center px-2 py-1.5">
                    <span className="inline-flex items-center justify-center">
                      <RagDot status={s.worst} size="sm" />
                    </span>
                  </td>
                  <td className="px-2 py-1.5">
                    <span className="flex items-center gap-3 justify-center whitespace-nowrap">
                      {s.red > 0 && (
                        <span className="flex items-center gap-1 text-red-600 font-semibold">
                          <span
                            className="inline-block rounded-full"
                            style={{ width: 8, height: 8, background: '#DC2626' }}
                          />
                          {s.red} Red
                        </span>
                      )}
                      {s.amber > 0 && (
                        <span className="flex items-center gap-1 text-amber-600 font-semibold">
                          <span
                            className="inline-block rounded-full"
                            style={{ width: 8, height: 8, background: '#D97706' }}
                          />
                          {s.amber} Amber
                        </span>
                      )}
                      {s.green > 0 && (
                        <span className="flex items-center gap-1 text-green-700 font-semibold">
                          <span
                            className="inline-block rounded-full"
                            style={{ width: 8, height: 8, background: '#16A34A' }}
                          />
                          {s.green} Green
                        </span>
                      )}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}

function KPIMatrix({ plants, kpis, kpiData, summaries }) {
  return (
    <SectionCard title="KPI Matrix — Plant × KPI">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-xs">
          {/* ── COLGROUP for sticky column ─────────────── */}
          <colgroup>
            <col style={{ minWidth: 160 }} />
            {kpis.map((k) => <col key={k.id} style={{ minWidth: 60 }} />)}
          </colgroup>

          {/* ── THEAD ─────────────────────────────────── */}
          <thead>
            {/* Summary dot row */}
            <tr className="bg-slate-700">
              <th
                className="sticky left-0 z-10 bg-slate-700 text-left px-3 py-2 text-slate-300 font-semibold text-xs uppercase tracking-wider whitespace-nowrap"
              >
                Plant
              </th>
              {summaries.map((s, i) => (
                <th key={kpis[i].id} className="px-2 py-2 text-center">
                  <div className="flex flex-col items-center gap-1">
                    {/* Rotated short name */}
                    <span
                      className="text-slate-200 font-medium leading-none"
                      style={{
                        writingMode: 'vertical-rl',
                        transform: 'rotate(180deg)',
                        maxHeight: 80,
                        fontSize: 10,
                        whiteSpace: 'nowrap',
                      }}
                      title={kpis[i].label}
                    >
                      {kpis[i].short}
                    </span>
                    {/* Summary RAG dot */}
                    <RagDot status={s.worst} size="sm" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* ── TBODY ─────────────────────────────────── */}
          <tbody>
            {plants.length === 0 ? (
              <tr>
                <td
                  colSpan={kpis.length + 1}
                  className="text-center py-8 text-slate-400 italic"
                >
                  No plants match the selected filter.
                </td>
              </tr>
            ) : (
              plants.map((plant, rowIdx) => {
                const overall = plantOverallRag(kpiData, plant.id);
                const isEven  = rowIdx % 2 === 0;
                return (
                  <tr
                    key={plant.id}
                    className={[
                      'group transition-colors',
                      isEven ? 'bg-white' : 'bg-slate-50',
                      'hover:bg-blue-50',
                    ].join(' ')}
                  >
                    {/* Plant name cell — sticky */}
                    <td
                      className={[
                        'sticky left-0 z-10 px-3 py-2 whitespace-nowrap border-r border-slate-200',
                        isEven
                          ? 'bg-white group-hover:bg-blue-50'
                          : 'bg-slate-50 group-hover:bg-blue-50',
                      ].join(' ')}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base leading-none">{plant.flag}</span>
                        <span className="font-semibold text-slate-800">{plant.name}</span>
                        <RagBadge status={overall} />
                      </div>
                    </td>

                    {/* KPI cells */}
                    {kpis.map((kpi) => {
                      const status = (kpiData[plant.id] || {})[kpi.id] || 'green';
                      return (
                        <td key={kpi.id} className="px-2 py-2 text-center align-middle">
                          <span className="inline-flex items-center justify-center">
                            <RagDot status={status} size="md" />
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}

function LegendRow() {
  return (
    <div className="flex flex-wrap items-center gap-5 text-xs text-slate-600">
      {[
        { color: '#DC2626', label: 'Red = Critical risk' },
        { color: '#D97706', label: 'Amber = Elevated risk' },
        { color: '#16A34A', label: 'Green = Normal' },
      ].map(({ color, label }) => (
        <span key={label} className="flex items-center gap-1.5">
          <span
            className="inline-block rounded-full flex-shrink-0"
            style={{ width: 12, height: 12, background: color }}
          />
          <span>{label}</span>
        </span>
      ))}
    </div>
  );
}

function KPIDefinitionsPanel({ kpis }) {
  const [open, setOpen] = useState(false);

  return (
    <SectionCard
      title={null}
      className="overflow-hidden"
    >
      {/* Header with toggle */}
      <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
          KPI Definitions
        </h2>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors px-2 py-1 rounded hover:bg-slate-100"
          aria-expanded={open}
        >
          {open ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
              Collapse
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
              Expand
            </>
          )}
        </button>
      </div>

      {open && (
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {kpis.map((kpi) => (
            <div
              key={kpi.id}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4 flex flex-col gap-2"
            >
              <p className="font-semibold text-slate-800 text-sm">{kpi.label}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{kpi.description}</p>
              <div className="flex flex-col gap-1 mt-1">
                <div className="flex items-start gap-1.5 text-xs">
                  <span>🔴</span>
                  <span>
                    <span className="font-medium text-red-700">Red:</span>{' '}
                    <span className="text-slate-600">{kpi.red}</span>
                  </span>
                </div>
                <div className="flex items-start gap-1.5 text-xs">
                  <span>🟡</span>
                  <span>
                    <span className="font-medium text-amber-700">Amber:</span>{' '}
                    <span className="text-slate-600">{kpi.amber}</span>
                  </span>
                </div>
                <div className="flex items-start gap-1.5 text-xs">
                  <span>🟢</span>
                  <span>
                    <span className="font-medium text-green-700">Green:</span>{' '}
                    <span className="text-slate-600">{kpi.green}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

function HeatmapInterpretationCard({ stats }) {
  const { totalRed, totalAmber, totalGreen, criticalKpi, criticalPlant } = stats;
  const total = totalRed + totalAmber + totalGreen || 1;

  return (
    <SectionCard title="Heatmap Interpretation">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Totals */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Cell Counts (All Plants)
          </p>
          {[
            { label: 'Red',   count: totalRed,   color: '#DC2626', pct: Math.round((totalRed   / total) * 100) },
            { label: 'Amber', count: totalAmber, color: '#D97706', pct: Math.round((totalAmber / total) * 100) },
            { label: 'Green', count: totalGreen, color: '#16A34A', pct: Math.round((totalGreen / total) * 100) },
          ].map(({ label, count, color, pct }) => (
            <div key={label} className="flex items-center gap-3">
              <span
                className="inline-block rounded-full flex-shrink-0"
                style={{ width: 12, height: 12, background: color }}
              />
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-0.5">
                  <span className="font-medium text-slate-700">{label}</span>
                  <span className="text-slate-500">{count} cells ({pct}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full transition-all"
                    style={{ width: `${pct}%`, background: color }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Most critical KPI */}
        <div className="flex flex-col gap-2 p-4 rounded-lg bg-red-50 border border-red-100">
          <p className="text-xs font-semibold text-red-600 uppercase tracking-wide">
            Most Critical KPI
          </p>
          <p className="text-sm font-bold text-red-800">{criticalKpi}</p>
          <p className="text-xs text-red-500 leading-relaxed">
            This KPI has the highest number of red-status plants across the portfolio.
          </p>
        </div>

        {/* Most critical plant */}
        <div className="flex flex-col gap-2 p-4 rounded-lg bg-amber-50 border border-amber-100">
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
            Most Critical Plant
          </p>
          <p className="text-sm font-bold text-amber-900">{criticalPlant}</p>
          <p className="text-xs text-amber-600 leading-relaxed">
            This plant has the highest number of red KPIs, indicating the broadest exposure.
          </p>
        </div>
      </div>
    </SectionCard>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function KPITrackerPage({ plants, kpis, kpiData }) {
  const [countryFilter, setCountryFilter] = useState('ALL');

  // Filtered plants for the matrix
  const filteredPlants =
    countryFilter === 'ALL'
      ? plants
      : plants.filter((p) => p.country === countryFilter);

  // Summary always across ALL plants (per spec: "KPI Summary (All Plants)")
  const summaries = kpiSummary(kpis, plants, kpiData);

  // Heatmap stats across ALL plants
  const stats = heatmapStats(kpis, plants, kpiData);

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* ── Page header ───────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">KPI Tracker</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          12-KPI status matrix across all ASEAN ME plants — updated weekly
        </p>
      </div>

      {/* ── Filter bar ────────────────────────────────────────────────────── */}
      <SectionCard title="Filter by Country">
        <FilterBar active={countryFilter} onChange={setCountryFilter} />
      </SectionCard>

      {/* ── KPI Summary row (all plants, always) ──────────────────────────── */}
      <SummaryRow kpis={kpis} summaries={summaries} />

      {/* ── KPI Matrix ────────────────────────────────────────────────────── */}
      <KPIMatrix
        plants={filteredPlants}
        kpis={kpis}
        kpiData={kpiData}
        summaries={summaries}
      />

      {/* ── Legend ────────────────────────────────────────────────────────── */}
      <div className="px-1">
        <LegendRow />
      </div>

      {/* ── Heatmap interpretation ────────────────────────────────────────── */}
      <HeatmapInterpretationCard stats={stats} />

      {/* ── KPI Definitions panel ─────────────────────────────────────────── */}
      <KPIDefinitionsPanel kpis={kpis} />
    </div>
  );
}
