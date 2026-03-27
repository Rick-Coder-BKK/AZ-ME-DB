import { useState } from 'react';
import {
  RagDot, RagBadge, SectionCard, TrendIcon, MeasureStatusBadge, plantOverallRag,
} from '../components/shared';

// Plant metadata lookup for flag + country name
const PLANT_META = {
  AmaP: { flag: '🇹🇭', countryName: 'Thailand' },
  HmjP: { flag: '🇹🇭', countryName: 'Thailand' },
  PgP1: { flag: '🇲🇾', countryName: 'Malaysia' },
  PgP2: { flag: '🇲🇾', countryName: 'Malaysia' },
  PgP5: { flag: '🇲🇾', countryName: 'Malaysia' },
  HcP:  { flag: '🇻🇳', countryName: 'Vietnam' },
  RBID: { flag: '🇮🇩', countryName: 'Indonesia' },
};

const TREND_OPTIONS = [
  { value: 'improving', label: '↑ Improving', activeClass: 'bg-green-600 text-white border-green-600', inactiveClass: 'bg-white text-green-700 border-green-300 hover:bg-green-50' },
  { value: 'stable',    label: '→ Stable',    activeClass: 'bg-amber-500 text-white border-amber-500', inactiveClass: 'bg-white text-amber-700 border-amber-300 hover:bg-amber-50' },
  { value: 'worsening', label: '↓ Worsening', activeClass: 'bg-red-600 text-white border-red-600',   inactiveClass: 'bg-white text-red-700 border-red-300 hover:bg-red-50' },
];

const STATUS_OPTIONS = [
  { value: 'active',   label: 'Active',   activeClass: 'bg-green-600 text-white border-green-600',  inactiveClass: 'bg-white text-green-700 border-green-300 hover:bg-green-50' },
  { value: 'planned',  label: 'Planned',  activeClass: 'bg-amber-500 text-white border-amber-500',  inactiveClass: 'bg-white text-amber-700 border-amber-300 hover:bg-amber-50' },
  { value: 'inactive', label: 'Inactive', activeClass: 'bg-slate-500 text-white border-slate-500',  inactiveClass: 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50' },
];

const MEASURE_ORDER = ['active', 'planned', 'inactive'];

function ragStatusText(kpi, status) {
  if (status === 'red')   return kpi.red;
  if (status === 'amber') return kpi.amber;
  return kpi.green;
}

function ragTextColor(status) {
  if (status === 'red')   return 'text-red-600';
  if (status === 'amber') return 'text-amber-600';
  return 'text-green-700';
}

function ragBgLight(status) {
  if (status === 'red')   return 'bg-red-50 border-red-200';
  if (status === 'amber') return 'bg-amber-50 border-amber-200';
  return 'bg-green-50 border-green-200';
}

export default function PlantDetailPage({
  plants, kpis, measures,
  kpiData, measuresData, setMeasuresData,
  plantNotes, setPlantNotes,
  plantTrends, setPlantTrends,
}) {
  const [selectedPlant, setSelectedPlant] = useState('RBID');

  const meta    = PLANT_META[selectedPlant] || {};
  const overallRag = plantOverallRag(kpiData, selectedPlant);
  const trend   = plantTrends[selectedPlant] || 'stable';

  const plantKpiData      = kpiData[selectedPlant]      || {};
  const plantMeasuresData = measuresData[selectedPlant] || {};
  const plantNote         = plantNotes[selectedPlant]   || '';

  // KPI counts
  const redCount   = Object.values(plantKpiData).filter(v => v === 'red').length;
  const amberCount = Object.values(plantKpiData).filter(v => v === 'amber').length;
  const greenCount = Object.values(plantKpiData).filter(v => v === 'green').length;

  // Sorted measures: active first, then planned, then inactive
  const sortedMeasures = [...measures].sort((a, b) => {
    const ai = MEASURE_ORDER.indexOf(plantMeasuresData[a.id] || 'inactive');
    const bi = MEASURE_ORDER.indexOf(plantMeasuresData[b.id] || 'inactive');
    return ai - bi;
  });

  // Trend change handler
  function handleTrendChange(newTrend) {
    setPlantTrends(prev => ({ ...prev, [selectedPlant]: newTrend }));
  }

  // Measure status change handler
  function handleMeasureChange(measureId, newStatus) {
    setMeasuresData(prev => ({
      ...prev,
      [selectedPlant]: {
        ...prev[selectedPlant],
        [measureId]: newStatus,
      },
    }));
  }

  // Notes change handler
  function handleNotesChange(e) {
    const val = e.target.value;
    setPlantNotes(prev => ({ ...prev, [selectedPlant]: val }));
  }

  return (
    <div className="space-y-5">

      {/* ── PLANT SELECTOR ─────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm px-5 py-4">
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm font-semibold text-slate-600 whitespace-nowrap">
            Select Plant:
          </label>

          {/* Dropdown */}
          <select
            value={selectedPlant}
            onChange={e => setSelectedPlant(e.target.value)}
            className="border border-slate-300 rounded-md px-3 py-1.5 text-sm text-slate-800 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {plants.map(p => (
              <option key={p.id} value={p.id}>{p.id}</option>
            ))}
          </select>

          {/* Flag + country */}
          <div className="flex items-center gap-2">
            <span className="text-2xl leading-none">{meta.flag}</span>
            <span className="text-sm font-medium text-slate-700">{meta.countryName}</span>
          </div>

          {/* Tab-style quick-select buttons */}
          <div className="flex flex-wrap gap-1 ml-auto">
            {plants.map(p => {
              const pRag = plantOverallRag(kpiData, p.id);
              const isActive = p.id === selectedPlant;
              const ragBorder = pRag === 'red' ? 'border-red-500' : pRag === 'amber' ? 'border-amber-500' : 'border-green-500';
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlant(p.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-white border-slate-800'
                      : `bg-white text-slate-700 ${ragBorder} hover:bg-slate-50`
                  }`}
                >
                  <RagDot status={pRag} size="sm" />
                  {p.id}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── PLANT HEADER CARD ──────────────────────────────────── */}
      <div className={`bg-white border rounded-lg shadow-sm overflow-hidden ${ragBgLight(overallRag)}`}>
        <div className="px-6 py-5">
          {/* Top row: name + badges */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl leading-none">{meta.flag}</span>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{selectedPlant}</h1>
                <p className="text-sm text-slate-500 mt-0.5">{meta.countryName}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <RagBadge status={overallRag} />
              <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                <TrendIcon trend={trend} />
                <span className="capitalize">{trend}</span>
              </div>
            </div>
          </div>

          {/* KPI pill counts */}
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
              <span className="w-2 h-2 rounded-full bg-red-600 inline-block"></span>
              {redCount} Red
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
              {amberCount} Amber
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
              <span className="w-2 h-2 rounded-full bg-green-600 inline-block"></span>
              {greenCount} Green
            </span>
          </div>

          {/* Trend selector */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide mr-1">
              Trend:
            </span>
            {TREND_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleTrendChange(opt.value)}
                className={`px-3 py-1 rounded border text-xs font-medium transition-colors ${
                  trend === opt.value ? opt.activeClass : opt.inactiveClass
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── KPI SECTION ────────────────────────────────────────── */}
      <SectionCard title="KPI Status">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {kpis.map(kpi => {
            const status = plantKpiData[kpi.id] || 'green';
            const statusText = ragStatusText(kpi, status);
            return (
              <div
                key={kpi.id}
                className={`border rounded-lg p-3 ${ragBgLight(status)}`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <RagDot status={status} size="md" />
                    <span className="text-sm font-semibold text-slate-800 leading-tight truncate">
                      {kpi.short}
                    </span>
                  </div>
                  <span className={`text-xs font-bold uppercase shrink-0 ${ragTextColor(status)}`}>
                    {status}
                  </span>
                </div>
                <p className={`text-xs font-medium mt-1 ${ragTextColor(status)}`}>
                  {statusText}
                </p>
                <p className="text-xs text-slate-500 mt-1 leading-snug">
                  {kpi.description}
                </p>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* ── MEASURES SECTION ───────────────────────────────────── */}
      <SectionCard title="Mitigation Measures">
        <div className="space-y-2">
          {sortedMeasures.map(measure => {
            const currentStatus = plantMeasuresData[measure.id] || 'inactive';
            return (
              <div
                key={measure.id}
                className="border border-slate-200 rounded-lg p-3 bg-slate-50 hover:bg-white transition-colors"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  {/* Left: label + description */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-slate-800">
                        {measure.label}
                      </span>
                      <MeasureStatusBadge status={currentStatus} />
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-snug">
                      {measure.description}
                    </p>
                  </div>

                  {/* Right: toggle buttons */}
                  <div className="flex gap-1 shrink-0">
                    {STATUS_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => handleMeasureChange(measure.id, opt.value)}
                        className={`px-2.5 py-1 rounded border text-xs font-medium transition-colors ${
                          currentStatus === opt.value ? opt.activeClass : opt.inactiveClass
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* ── PLANT NOTES SECTION ────────────────────────────────── */}
      <SectionCard title="Plant Notes">
        <div>
          <textarea
            value={plantNote}
            onChange={handleNotesChange}
            placeholder="Enter weekly update notes for this plant..."
            rows={5}
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y leading-relaxed"
          />
          <div className="flex justify-between items-center mt-1.5">
            <p className="text-xs text-slate-400">
              Record the latest status, actions taken, and any escalation needed for {selectedPlant}.
            </p>
            <span className="text-xs text-slate-400 tabular-nums shrink-0">
              {plantNote.length} characters
            </span>
          </div>
        </div>
      </SectionCard>

    </div>
  );
}
