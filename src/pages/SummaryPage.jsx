import React from 'react';
import {
  RagDot,
  RagBadge,
  SectionCard,
  TrendIcon,
  plantOverallRag,
  topRisk,
  countRedKpis,
  computeSeverityIndex,
  overallOperationRag,
} from '../components/shared';

// ---------------------------------------------------------------------------
// Section 1: Hero Banner
// ---------------------------------------------------------------------------
function HeroBanner() {
  return (
    <div className="bg-slate-800 text-white rounded-lg shadow-lg px-6 py-6 mb-6">
      <div className="flex items-start gap-3 mb-3">
        {/* Pulsing red alert dot */}
        <span className="relative flex-shrink-0 mt-1">
          <span
            className="animate-ping absolute inline-flex h-3 w-3 rounded-full opacity-75"
            style={{ background: '#DC2626' }}
          />
          <span
            className="relative inline-flex rounded-full h-3 w-3"
            style={{ background: '#DC2626' }}
          />
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight leading-tight">
            ASEAN ME CRISIS — STRAIT OF HORMUZ CLOSURE
          </h1>
          <p className="mt-2 text-slate-300 text-sm leading-relaxed max-w-3xl">
            US military strike on Iran has triggered closure of the Strait of Hormuz, disrupting
            approximately 21% of global oil supply. ASEAN manufacturing operations are under
            elevated risk.
          </p>
          <p className="mt-2 text-slate-400 text-xs">
            Crisis declared: 13 March 2026&nbsp;&nbsp;|&nbsp;&nbsp;Status as of: 27 March 2026
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 mt-4">
        <span
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold"
          style={{ background: '#DC2626' }}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14A1 1 0 003 18h14a1 1 0 00.894-1.447l-7-14z" />
          </svg>
          7 Plants Affected
        </span>
        <span
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold"
          style={{ background: '#D97706' }}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          4 Countries
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section 2: Crisis Severity Index
// ---------------------------------------------------------------------------
function CrisisSeverityIndex({ kpiData, plants, kpis }) {
  const score = computeSeverityIndex(kpiData, plants, kpis);
  const color =
    score > 65 ? '#DC2626' : score >= 40 ? '#D97706' : '#16A34A';
  const bgLight =
    score > 65 ? 'bg-red-50' : score >= 40 ? 'bg-amber-50' : 'bg-green-50';
  const label =
    score > 65 ? 'CRITICAL' : score >= 40 ? 'ELEVATED' : 'STABLE';

  return (
    <SectionCard>
      <div className={`rounded-lg p-5 ${bgLight}`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">
              Crisis Severity Index
            </p>
            <div className="flex items-baseline gap-3">
              <span
                className="text-6xl font-black leading-none"
                style={{ color }}
              >
                {score}
              </span>
              <span className="text-slate-400 text-lg font-light">/ 100</span>
              <span
                className="ml-2 px-2 py-0.5 rounded text-xs font-bold text-white"
                style={{ background: color }}
              >
                {label}
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Composite weighted score across all KPIs and plants
            </p>
          </div>
          {/* Gauge-style ring placeholder */}
          <div className="flex-shrink-0">
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="#e2e8f0" strokeWidth="8" />
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke={color}
                strokeWidth="8"
                strokeDasharray={`${(score / 100) * 213.6} 213.6`}
                strokeLinecap="round"
                transform="rotate(-90 40 40)"
              />
              <text x="40" y="44" textAnchor="middle" fontSize="16" fontWeight="bold" fill={color}>
                {score}
              </text>
            </svg>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-4">
          <div className="h-3 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-3 rounded-full transition-all duration-500"
              style={{ width: `${score}%`, background: color }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>0</span>
            <span>40</span>
            <span>65</span>
            <span>100</span>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

// ---------------------------------------------------------------------------
// Section 3: Overall Operation Status
// ---------------------------------------------------------------------------
function OverallOperationStatus({ kpiData, plants }) {
  const rag = overallOperationRag(kpiData, plants);
  const cfg = {
    red: {
      bg: 'bg-red-50 border-red-300',
      color: '#DC2626',
      text: 'CRITICAL — Immediate action required across multiple plants',
    },
    amber: {
      bg: 'bg-amber-50 border-amber-300',
      color: '#D97706',
      text: 'ELEVATED RISK — Active mitigation required',
    },
    green: {
      bg: 'bg-green-50 border-green-300',
      color: '#16A34A',
      text: 'STABLE — Monitoring in progress',
    },
  };
  const { bg, color, text } = cfg[rag] || cfg.green;

  return (
    <SectionCard>
      <div className={`rounded-lg border-2 p-5 flex items-center gap-5 ${bg}`}>
        <div
          className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: color }}
        >
          <span className="text-white font-black text-xs text-center leading-tight px-1">
            {rag.toUpperCase()}
          </span>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">
            Overall Operation Status
          </p>
          <p className="text-lg font-bold" style={{ color }}>
            {text}
          </p>
        </div>
        <div className="ml-auto flex-shrink-0">
          <RagBadge status={rag} />
        </div>
      </div>
    </SectionCard>
  );
}

// ---------------------------------------------------------------------------
// Section 4: ASEAN Oil Import Vulnerability Map
// ---------------------------------------------------------------------------
const COUNTRY_MAP_DATA = [
  {
    code: 'ID',
    name: 'Indonesia',
    flag: '🇮🇩',
    dependency: 71,
    reserve: 30,
    exposure: 'VERY HIGH',
    color: '#DC2626',
    lightColor: '#fef2f2',
    borderColor: '#fca5a5',
    textColor: '#991b1b',
  },
  {
    code: 'MY',
    name: 'Malaysia',
    flag: '🇲🇾',
    dependency: 62,
    reserve: 45,
    exposure: 'HIGH',
    color: '#DC2626',
    lightColor: '#fef2f2',
    borderColor: '#fca5a5',
    textColor: '#991b1b',
  },
  {
    code: 'TH',
    name: 'Thailand',
    flag: '🇹🇭',
    dependency: 38,
    reserve: 90,
    exposure: 'MODERATE',
    color: '#D97706',
    lightColor: '#fffbeb',
    borderColor: '#fcd34d',
    textColor: '#92400e',
  },
  {
    code: 'VN',
    name: 'Vietnam',
    flag: '🇻🇳',
    dependency: 22,
    reserve: 60,
    exposure: 'LOWER',
    color: '#16A34A',
    lightColor: '#f0fdf4',
    borderColor: '#86efac',
    textColor: '#14532d',
  },
];

function VulnerabilityMap() {
  return (
    <SectionCard title="ASEAN Oil Import Vulnerability">
      {/* Schematic map layout */}
      <div className="relative">
        {/* Decorative ocean background */}
        <div className="rounded-lg bg-slate-100 p-4 mb-4 relative overflow-hidden">
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              background:
                'linear-gradient(135deg, #bfdbfe 0%, #93c5fd 40%, #60a5fa 100%)',
              opacity: 0.25,
            }}
          />
          <p className="relative text-xs text-slate-500 font-medium text-center mb-3 uppercase tracking-widest">
            Southeast Asia — Hormuz Dependency Overview
          </p>

          {/* Country grid arranged roughly geographically */}
          <div className="relative grid grid-cols-2 gap-3 max-w-lg mx-auto">
            {/* Row 1: TH (left) MY (right) */}
            {[
              COUNTRY_MAP_DATA.find((c) => c.code === 'TH'),
              COUNTRY_MAP_DATA.find((c) => c.code === 'MY'),
            ].map((c) => (
              <CountryMapCard key={c.code} country={c} />
            ))}
            {/* Row 2: VN (left) ID (right) */}
            {[
              COUNTRY_MAP_DATA.find((c) => c.code === 'VN'),
              COUNTRY_MAP_DATA.find((c) => c.code === 'ID'),
            ].map((c) => (
              <CountryMapCard key={c.code} country={c} />
            ))}
          </div>

          {/* Strait of Hormuz annotation */}
          <div
            className="mt-3 text-center text-xs font-semibold px-3 py-1.5 rounded-full inline-block mx-auto"
            style={{
              display: 'block',
              width: 'fit-content',
              marginLeft: 'auto',
              marginRight: 'auto',
              background: '#1e293b',
              color: '#f8fafc',
            }}
          >
            ⚠ Strait of Hormuz — CLOSED (21% global oil supply disrupted)
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 justify-center text-xs">
          {[
            { color: '#DC2626', label: 'Very High / High Exposure (≥60%)' },
            { color: '#D97706', label: 'Moderate Exposure (30–60%)' },
            { color: '#16A34A', label: 'Lower Exposure (<30%)' },
          ].map(({ color, label }) => (
            <span key={label} className="flex items-center gap-1.5 text-slate-600">
              <span
                className="inline-block w-3 h-3 rounded-sm flex-shrink-0"
                style={{ background: color }}
              />
              {label}
            </span>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

function CountryMapCard({ country: c }) {
  return (
    <div
      className="rounded-lg border-2 p-3 flex flex-col gap-1"
      style={{
        background: c.lightColor,
        borderColor: c.borderColor,
      }}
    >
      <div className="flex items-center gap-1.5">
        <span className="text-lg">{c.flag}</span>
        <span className="font-bold text-sm text-slate-800">{c.name}</span>
      </div>
      <div className="text-xs" style={{ color: c.textColor }}>
        <div className="flex justify-between">
          <span>Hormuz dep.</span>
          <span className="font-bold">{c.dependency}%</span>
        </div>
        <div className="flex justify-between">
          <span>Reserve days</span>
          <span className="font-bold">{c.reserve}d</span>
        </div>
      </div>
      <span
        className="mt-1 text-center text-xs font-bold px-2 py-0.5 rounded text-white"
        style={{ background: c.color }}
      >
        {c.exposure}
      </span>
      {/* Dependency bar */}
      <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden mt-1">
        <div
          className="h-1.5 rounded-full"
          style={{ width: `${c.dependency}%`, background: c.color }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section 5: Plant Summary Table
// ---------------------------------------------------------------------------
function PlantSummaryTable({ plants, kpis, kpiData, measuresData, plantTrends, navigate }) {
  const handleRowClick = () => {
    if (navigate) navigate('plants');
  };

  return (
    <SectionCard title="Plant Summary">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left">
              {['Plant', 'Country', 'Overall Status', 'Red KPIs', 'Top Risk', 'Trend', 'Top Active Measure'].map(
                (h) => (
                  <th
                    key={h}
                    className="px-3 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200 whitespace-nowrap"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {plants.map((plant, idx) => {
              const rag = plantOverallRag(kpiData, plant.id);
              const redCount = countRedKpis(kpiData, plant.id);
              const risk = topRisk(kpiData, kpis, plant.id);
              const trend = plantTrends?.[plant.id] || 'stable';
              const plantMeasuresObj = measuresData?.[plant.id] || {};
              const activeMeasureId = Object.entries(plantMeasuresObj).find(([, v]) => v === 'active')?.[0];
              const activeMeasure = activeMeasureId
                ? (measures.find((m) => m.id === activeMeasureId)?.label || activeMeasureId)
                : '—';

              return (
                <tr
                  key={plant.id}
                  onClick={handleRowClick}
                  className={`border-b border-slate-100 cursor-pointer transition-colors ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                  } hover:bg-blue-50`}
                >
                  <td className="px-3 py-2.5 font-semibold text-slate-800 whitespace-nowrap">
                    {plant.name}
                  </td>
                  <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">
                    {plant.country}
                  </td>
                  <td className="px-3 py-2.5">
                    <RagBadge status={rag} />
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <span
                      className={`inline-block w-6 h-6 rounded-full text-xs font-bold text-white flex items-center justify-center ${
                        redCount > 0 ? '' : 'bg-slate-300'
                      }`}
                      style={redCount > 0 ? { background: '#DC2626' } : {}}
                    >
                      {redCount}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-slate-700 text-xs max-w-32 truncate">
                    {risk}
                  </td>
                  <td className="px-3 py-2.5">
                    <TrendIcon trend={trend} />
                  </td>
                  <td className="px-3 py-2.5 text-slate-600 text-xs max-w-48">
                    <span className="truncate block max-w-xs" title={activeMeasure}>
                      {activeMeasure}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {navigate && (
        <div className="mt-3 text-right">
          <button
            onClick={handleRowClick}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            View all plant details →
          </button>
        </div>
      )}
    </SectionCard>
  );
}

// ---------------------------------------------------------------------------
// Section 6: Most Adopted Measures
// ---------------------------------------------------------------------------
function MostAdoptedMeasures({ measures, measuresData, plants }) {
  // Count active adoptions per measure
  const adoptionCounts = {};
  for (const measure of measures) {
    let count = 0;
    for (const plant of plants) {
      const plantMeasures = measuresData?.[plant.id] || {};
      if (plantMeasures[measure.id] === 'active') count++;
    }
    adoptionCounts[measure.id] = count;
  }

  // Sort by adoption count, take top 5
  const top5 = [...measures]
    .sort((a, b) => adoptionCounts[b.id] - adoptionCounts[a.id])
    .slice(0, 5);

  const totalPlants = plants.length;

  return (
    <SectionCard title="Most Adopted Mitigation Measures">
      <div className="space-y-3">
        {top5.map((measure, idx) => {
          const count = adoptionCounts[measure.id];
          const pct = totalPlants > 0 ? Math.round((count / totalPlants) * 100) : 0;
          const barColor =
            pct >= 80 ? '#16A34A' : pct >= 50 ? '#D97706' : '#3b82f6';

          return (
            <div
              key={measure.id}
              className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white bg-slate-400"
                  >
                    {idx + 1}
                  </span>
                  <span className="text-sm font-semibold text-slate-800">
                    {measure.label || measure.name || measure.id}
                  </span>
                </div>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                  style={{ background: barColor }}
                >
                  {count}/{totalPlants} plants
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, background: barColor }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1 text-right">{pct}% adoption</p>
            </div>
          );
        })}
        {top5.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-4">No active measures data available.</p>
        )}
      </div>
    </SectionCard>
  );
}

// ---------------------------------------------------------------------------
// Section 7: Country Exposure Summary
// ---------------------------------------------------------------------------
const EXPOSURE_COLORS = {
  'very high': { bg: '#fef2f2', border: '#fca5a5', badge: '#DC2626' },
  high:        { bg: '#fef2f2', border: '#fca5a5', badge: '#DC2626' },
  moderate:    { bg: '#fffbeb', border: '#fcd34d', badge: '#D97706' },
  lower:       { bg: '#f0fdf4', border: '#86efac', badge: '#16A34A' },
};

function CountryExposureGrid({ countryInfo, plants }) {
  const COUNTRY_ORDER = ['TH', 'MY', 'VN', 'ID'];

  return (
    <SectionCard title="Country Exposure Summary">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {COUNTRY_ORDER.map((code) => {
          const info = countryInfo?.[code];
          if (!info) return null;
          const plantCount = plants.filter((p) => p.countryCode === code || p.country === info.name).length;
          const expKey = (info.exposureLevel || '').toLowerCase();
          const colors = EXPOSURE_COLORS[expKey] || EXPOSURE_COLORS.lower;

          return (
            <div
              key={code}
              className="rounded-lg border-2 p-4 flex flex-col gap-2"
              style={{ background: colors.bg, borderColor: colors.border }}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{info.flag}</span>
                <div>
                  <p className="font-bold text-slate-800 text-sm leading-tight">{info.name}</p>
                  <p className="text-xs text-slate-400">{code}</p>
                </div>
              </div>
              <div className="space-y-1 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Hormuz dep.</span>
                  <span className="font-bold text-slate-800">{info.hormuzDependency}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Reserve days</span>
                  <span className="font-bold text-slate-800">{info.strategicReserveDays}d</span>
                </div>
                <div className="flex justify-between">
                  <span>Plants</span>
                  <span className="font-bold text-slate-800">{plantCount}</span>
                </div>
              </div>
              {/* Dependency bar */}
              <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-1.5 rounded-full"
                  style={{ width: `${info.hormuzDependency}%`, background: colors.badge }}
                />
              </div>
              <span
                className="text-center text-xs font-bold px-2 py-0.5 rounded text-white mt-1"
                style={{ background: colors.badge }}
              >
                {(info.exposureLevel || '').toUpperCase()}
              </span>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

// ---------------------------------------------------------------------------
// Main SummaryPage
// ---------------------------------------------------------------------------
export default function SummaryPage({
  plants = [],
  kpis = [],
  measures = [],
  kpiData = {},
  measuresData = {},
  plantNotes = {},
  plantTrends = {},
  countryInfo = {},
  lastUpdated,
  nextUpdate,
  navigate,
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* 1. Hero Banner */}
      <HeroBanner />

      {/* 2 & 3: Severity Index + Overall Status — side by side on wide screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CrisisSeverityIndex kpiData={kpiData} plants={plants} kpis={kpis} />
        <OverallOperationStatus kpiData={kpiData} plants={plants} />
      </div>

      {/* 4. Vulnerability Map */}
      <VulnerabilityMap />

      {/* 5. Plant Summary Table */}
      <PlantSummaryTable
        plants={plants}
        kpis={kpis}
        kpiData={kpiData}
        measuresData={measuresData}
        plantTrends={plantTrends}
        navigate={navigate}
      />

      {/* 6 & 7: Measures + Country grid — side by side on wide screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MostAdoptedMeasures measures={measures} measuresData={measuresData} plants={plants} />
        <CountryExposureGrid countryInfo={countryInfo} plants={plants} />
      </div>

      {/* Footer timestamp */}
      {(lastUpdated || nextUpdate) && (
        <div className="text-xs text-slate-400 text-right pb-2">
          {lastUpdated && <span>Last updated: {lastUpdated}</span>}
          {lastUpdated && nextUpdate && <span className="mx-2">·</span>}
          {nextUpdate && <span>Next update: {nextUpdate}</span>}
        </div>
      )}
    </div>
  );
}
