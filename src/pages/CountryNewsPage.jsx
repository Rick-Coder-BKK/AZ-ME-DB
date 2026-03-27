import { useState } from 'react';
import { RagDot, RagBadge, SectionCard, plantOverallRag } from '../components/shared';

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
    { label: 'Currency pressure',  rag: 'amber' },
    { label: 'Port status',        rag: 'green' },
    { label: 'Inflation risk',     rag: 'amber' },
    { label: 'Fuel costs',         rag: 'amber' },
  ],
  MY: [
    { label: 'Currency pressure',  rag: 'red'   },
    { label: 'Port status',        rag: 'amber' },
    { label: 'Fuel subsidy risk',  rag: 'red'   },
    { label: 'Refinery exposure',  rag: 'red'   },
  ],
  VN: [
    { label: 'Currency pressure',  rag: 'amber' },
    { label: 'Port status',        rag: 'green' },
    { label: 'Coal power buffer',  rag: 'green' },
    { label: 'Logistics cost',     rag: 'amber' },
  ],
  ID: [
    { label: 'Currency pressure',  rag: 'red'   },
    { label: 'Port status',        rag: 'red'   },
    { label: 'Fuel rationing risk',rag: 'red'   },
    { label: 'Refinery exposure',  rag: 'red'   },
  ],
};

// ─── RAG colour map ───────────────────────────────────────────────────────────
const RAG_BG = { red: '#DC2626', amber: '#D97706', green: '#16A34A' };
const RAG_LIGHT = {
  red:   'bg-red-50 text-red-700 border border-red-300',
  amber: 'bg-amber-50 text-amber-700 border border-amber-300',
  green: 'bg-green-50 text-green-700 border border-green-300',
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

// ─── Small inline RAG count badge ────────────────────────────────────────────
function CountBadge({ count, rag }) {
  if (count === 0) return null;
  return (
    <span
      className="inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-xs font-bold"
      style={{ background: RAG_BG[rag] }}
      title={`${count} ${rag}`}
    >
      {count}
    </span>
  );
}

// ─── Risk factor pill ─────────────────────────────────────────────────────────
function RiskPill({ label, rag }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${RAG_LIGHT[rag]}`}>
      <span
        className="inline-block w-2 h-2 rounded-full flex-shrink-0"
        style={{ background: RAG_BG[rag] }}
      />
      {label}
    </span>
  );
}

// ─── News card ────────────────────────────────────────────────────────────────
function NewsCard({ item }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm flex flex-col gap-2">
      <p className="font-semibold text-slate-800 leading-snug">{item.title}</p>
      <p className="text-xs text-slate-400">
        {item.source} &middot; {item.date}
      </p>
      <p className="text-sm text-slate-600 leading-relaxed">{item.summary}</p>
      <div className="mt-1">
        <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-xs border border-slate-200">
          Source: {item.source}
        </span>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function CountryNewsPage({ plants = [], kpis = [], kpiData = {}, countryInfo = {}, countrynews = {} }) {
  const [activeCode, setActiveCode] = useState('ID');

  const info       = countryInfo[activeCode] || {};
  const newsItems  = (countrynews[activeCode] || []).slice(0, 3);
  const riskPills  = RISK_FACTORS[activeCode] || [];
  const country    = COUNTRIES.find(c => c.code === activeCode);

  // Plants belonging to the active country
  const countryPlants = plants.filter(p => p.country === activeCode || p.countryCode === activeCode);

  // Aggregate KPI counts across all plants in this country
  const allVals = countryPlants.flatMap(p => Object.values(kpiData[p.id] || {}));
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

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Page header ── */}
      <div className="bg-[#0f172a] border-b border-slate-700 px-6 py-4">
        <h1 className="text-white text-xl font-bold tracking-tight">
          Country Intelligence &amp; News
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">
          ASEAN ME Crisis Dashboard — Per-country exposure, plant status &amp; live developments
        </p>
      </div>

      {/* ── Country tabs ── */}
      <div className="bg-[#0f172a] border-b border-slate-700 px-6">
        <nav className="flex gap-1" role="tablist">
          {COUNTRIES.map(c => {
            const isActive = c.code === activeCode;
            const cInfo    = countryInfo[c.code] || {};
            const tabRag   = exposureRag(cInfo.exposureColor || cInfo.exposureLevel);
            return (
              <button
                key={c.code}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCode(c.code)}
                className={[
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                  isActive
                    ? 'border-white text-white bg-[#1e293b]'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500',
                ].join(' ')}
              >
                <span className="text-base leading-none">{c.flag}</span>
                {c.label}
                <span
                  className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: RAG_BG[tabRag] }}
                  title={`Exposure: ${tabRag}`}
                />
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── Tab content ── */}
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">

        {/* ── 1. Country Overview Card ── */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          {/* Header strip */}
          <div className="bg-[#0f172a] px-6 py-4 flex flex-wrap items-center gap-3">
            <span className="text-4xl leading-none">{country?.flag}</span>
            <div className="flex-1 min-w-0">
              <h2 className="text-white text-2xl font-bold">{info.name || country?.label}</h2>
              <p className="text-slate-400 text-sm mt-0.5">Country Overview</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-300 text-xs font-medium uppercase tracking-wide">Exposure Level</span>
              <span
                className="px-3 py-1 rounded-full text-white text-sm font-bold"
                style={{ background: RAG_BG[rag] }}
              >
                {(info.exposureLevel || rag).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 divide-x divide-slate-200">
            <div className="px-6 py-5 text-center">
              <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">Hormuz Dependency</p>
              <p className="text-2xl font-bold text-slate-800">{info.hormuzDependency ?? '—'}</p>
            </div>
            <div className="px-6 py-5 text-center">
              <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">Strategic Reserve</p>
              <p className="text-2xl font-bold text-slate-800">
                {info.strategicReserveDays != null ? `${info.strategicReserveDays} days` : '—'}
              </p>
            </div>
            <div className="px-6 py-5 text-center">
              <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">Plants in Country</p>
              <p className="text-2xl font-bold text-slate-800">{countryPlants.length}</p>
            </div>
          </div>
        </div>

        {/* ── 2-column layout for middle cards ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── 2. Plant Status Summary ── */}
          <SectionCard title="Plant Status Summary">
            {countryPlants.length === 0 ? (
              <p className="text-sm text-slate-400 italic">No plants recorded for this country.</p>
            ) : (
              <div className="space-y-3">
                {countryPlants.map(plant => {
                  const overallRag = plantOverallRag(kpiData, plant.id);
                  const counts     = kpiCounts(kpiData, plant.id);
                  return (
                    <div
                      key={plant.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100"
                    >
                      {plant.flag && (
                        <span className="text-base leading-none flex-shrink-0">{plant.flag}</span>
                      )}
                      <span className="flex-1 text-sm font-medium text-slate-700 truncate" title={plant.name}>
                        {plant.name}
                      </span>
                      <RagBadge status={overallRag} />
                      <div className="flex items-center gap-1 ml-1">
                        <CountBadge count={counts.red}   rag="red"   />
                        <CountBadge count={counts.amber} rag="amber" />
                        <CountBadge count={counts.green} rag="green" />
                      </div>
                    </div>
                  );
                })}

                {/* Summary bar */}
                <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold text-red-600">{plantsWithRed}</span>
                    {' '}of{' '}
                    <span className="font-semibold">{countryPlants.length}</span>
                    {' '}plant{countryPlants.length !== 1 ? 's' : ''} have at least one{' '}
                    <span className="font-semibold text-red-600">Red</span> KPI
                  </p>

                  {totalKpis > 0 && (
                    <div>
                      <p className="text-xs text-slate-400 mb-1.5 font-medium uppercase tracking-wide">
                        Country KPI Distribution
                      </p>
                      {/* Stacked bar */}
                      <div className="h-3 rounded-full overflow-hidden flex bg-slate-200">
                        {pctRed > 0 && (
                          <div
                            className="h-full transition-all"
                            style={{ width: `${pctRed}%`, background: RAG_BG.red }}
                            title={`Red: ${pctRed}%`}
                          />
                        )}
                        {pctAmber > 0 && (
                          <div
                            className="h-full transition-all"
                            style={{ width: `${pctAmber}%`, background: RAG_BG.amber }}
                            title={`Amber: ${pctAmber}%`}
                          />
                        )}
                        {pctGreen > 0 && (
                          <div
                            className="h-full transition-all"
                            style={{ width: `${pctGreen}%`, background: RAG_BG.green }}
                            title={`Green: ${pctGreen}%`}
                          />
                        )}
                      </div>
                      <div className="flex gap-4 mt-1.5">
                        {[
                          { rag: 'red',   pct: pctRed,   count: totalRed },
                          { rag: 'amber', pct: pctAmber, count: totalAmber },
                          { rag: 'green', pct: pctGreen, count: totalGreen },
                        ].map(({ rag: r, pct, count }) => (
                          <div key={r} className="flex items-center gap-1">
                            <span
                              className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                              style={{ background: RAG_BG[r] }}
                            />
                            <span className="text-xs text-slate-500 capitalize">
                              {r} {count} ({pct}%)
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

          {/* ── 3. Economic Risk Assessment ── */}
          <SectionCard title="Economic Risk Assessment">
            <div className="space-y-4">
              {/* Economic notes */}
              {info.economicNotes ? (
                <p className="text-sm text-slate-600 leading-relaxed">{info.economicNotes}</p>
              ) : (
                <p className="text-sm text-slate-400 italic">No economic notes available.</p>
              )}

              {/* Risk factor pills */}
              {riskPills.length > 0 && (
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-2">
                    Risk Factors
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {riskPills.map((rf, i) => (
                      <RiskPill key={i} label={rf.label} rag={rf.rag} />
                    ))}
                  </div>
                </div>
              )}

              {/* Overall exposure summary */}
              <div className="rounded-lg p-3 border" style={{
                borderColor: RAG_BG[rag] + '55',
                background:  RAG_BG[rag] + '11',
              }}>
                <div className="flex items-center gap-2">
                  <RagDot status={rag} size="md" />
                  <span className="text-sm font-semibold text-slate-700">
                    Overall Exposure:{' '}
                    <span style={{ color: RAG_BG[rag] }}>
                      {(info.exposureLevel || rag).toUpperCase()}
                    </span>
                  </span>
                </div>
                {riskPills.filter(r => r.rag === 'red').length > 0 && (
                  <p className="text-xs text-slate-500 mt-1.5 ml-5">
                    {riskPills.filter(r => r.rag === 'red').length} critical risk factor
                    {riskPills.filter(r => r.rag === 'red').length !== 1 ? 's' : ''} identified
                  </p>
                )}
              </div>
            </div>
          </SectionCard>
        </div>

        {/* ── 4. Latest Developments (News Feed) ── */}
        <SectionCard title="Latest Developments">
          {newsItems.length === 0 ? (
            <p className="text-sm text-slate-400 italic">No recent developments on record.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {newsItems.map((item, i) => (
                <NewsCard key={i} item={item} />
              ))}
            </div>
          )}
        </SectionCard>

      </div>
    </div>
  );
}
