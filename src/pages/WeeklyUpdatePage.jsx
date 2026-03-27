import { useState, useCallback } from 'react';
import { RagDot, RagBadge, SectionCard, plantOverallRag } from '../components/shared';

// ── helpers ──────────────────────────────────────────────────────────────────

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function todayISO() {
  return '2026-03-27';
}

// ── sub-components ───────────────────────────────────────────────────────────

function CollapsiblePlantHeader({ plant, isOpen, onToggle, ragStatus, touched }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors rounded-t-lg ${
        isOpen ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
      }`}
    >
      <span className="flex items-center gap-2 font-semibold text-sm">
        <span className="text-base">{plant.flag}</span>
        <span>{plant.name}</span>
        <span className="text-xs font-normal opacity-75">{plant.countryName}</span>
        {touched && (
          <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${
            isOpen ? 'bg-blue-400 text-white' : 'bg-blue-100 text-blue-700'
          }`}>
            edited
          </span>
        )}
      </span>
      <span className="flex items-center gap-2">
        <RagBadge status={ragStatus} />
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </button>
  );
}

function RagSelect({ value, onChange }) {
  const colorClass =
    value === 'red'   ? 'border-red-400 bg-red-50 text-red-700' :
    value === 'amber' ? 'border-amber-400 bg-amber-50 text-amber-700' :
                        'border-green-400 bg-green-50 text-green-700';
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`w-full text-xs border rounded px-2 py-1.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 ${colorClass}`}
    >
      <option value="red">Red</option>
      <option value="amber">Amber</option>
      <option value="green">Green</option>
    </select>
  );
}

function MeasureSelect({ value, onChange }) {
  const colorClass =
    value === 'active'   ? 'border-green-400 bg-green-50 text-green-700' :
    value === 'planned'  ? 'border-amber-400 bg-amber-50 text-amber-700' :
                           'border-slate-300 bg-slate-50 text-slate-500';
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`w-full text-xs border rounded px-2 py-1.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 ${colorClass}`}
    >
      <option value="active">Active</option>
      <option value="planned">Planned</option>
      <option value="inactive">Inactive</option>
    </select>
  );
}

// ── history entry ─────────────────────────────────────────────────────────────

function HistoryEntry({ entry }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-slate-50 transition-colors text-left"
      >
        <span className="flex items-center gap-3">
          <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
            {entry.date}
          </span>
          <span className="text-sm font-medium text-slate-800">{entry.updatedBy}</span>
        </span>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-sm text-slate-700 leading-relaxed">
          {entry.summary}
        </div>
      )}
    </div>
  );
}

// ── main page ─────────────────────────────────────────────────────────────────

export default function WeeklyUpdatePage({
  plants,
  kpis,
  measures,
  kpiData,
  setKpiData,
  measuresData,
  setMeasuresData,
  plantNotes,
  setPlantNotes,
  updateHistory,
  setUpdateHistory,
}) {
  // ── metadata state ─────────────────────────────────────────────────────────
  const [updateDate, setUpdateDate]     = useState(todayISO());
  const [updatedBy, setUpdatedBy]       = useState('');
  const [summary, setSummary]           = useState('');

  // ── per-plant form state (local copies) ────────────────────────────────────
  const [formKpi,      setFormKpi]      = useState(() => deepClone(kpiData));
  const [formMeasures, setFormMeasures] = useState(() => deepClone(measuresData));
  const [formNotes,    setFormNotes]    = useState(() => deepClone(plantNotes));

  // ── tracking which plants have been touched ────────────────────────────────
  const [touchedPlants, setTouchedPlants] = useState(new Set());

  // ── collapse state for each section × plant ───────────────────────────────
  const initOpenState = () => Object.fromEntries(plants.map((p, i) => [p.id, i === 0]));
  const [openKpi,      setOpenKpi]      = useState(initOpenState);
  const [openMeasures, setOpenMeasures] = useState(initOpenState);
  const [openNotes,    setOpenNotes]    = useState(initOpenState);

  // ── submit / success state ─────────────────────────────────────────────────
  const [submitted,  setSubmitted]  = useState(false);
  const [dateError,  setDateError]  = useState(false);

  // ── helpers ────────────────────────────────────────────────────────────────

  const markTouched = useCallback((plantId) => {
    setTouchedPlants(prev => new Set([...prev, plantId]));
  }, []);

  function expandAll(setter) {
    setter(Object.fromEntries(plants.map(p => [p.id, true])));
  }
  function collapseAll(setter) {
    setter(Object.fromEntries(plants.map(p => [p.id, false])));
  }

  function handleKpiChange(plantId, kpiId, value) {
    setFormKpi(prev => ({
      ...prev,
      [plantId]: { ...prev[plantId], [kpiId]: value },
    }));
    markTouched(plantId);
  }

  function handleMeasureChange(plantId, measureId, value) {
    setFormMeasures(prev => ({
      ...prev,
      [plantId]: { ...prev[plantId], [measureId]: value },
    }));
    markTouched(plantId);
  }

  function handleNoteChange(plantId, value) {
    setFormNotes(prev => ({ ...prev, [plantId]: value }));
    markTouched(plantId);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!updateDate) {
      setDateError(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setDateError(false);

    // Push to global state
    setKpiData(deepClone(formKpi));
    setMeasuresData(deepClone(formMeasures));
    setPlantNotes(deepClone(formNotes));

    const newEntry = {
      id: Date.now(),
      date: updateDate,
      updatedBy: updatedBy.trim() || 'Anonymous',
      summary: summary.trim() || '(No summary provided)',
    };
    setUpdateHistory(prev => [newEntry, ...prev]);

    setSubmitted(true);
    setTouchedPlants(new Set());
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => setSubmitted(false), 3000);
  }

  const touchedCount = touchedPlants.size;

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">

      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Weekly Crisis Update Form</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Submit the weekly status update — changes are reflected immediately across all dashboard pages
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
            touchedCount > 0
              ? 'bg-blue-100 text-blue-700 border border-blue-200'
              : 'bg-slate-100 text-slate-500 border border-slate-200'
          }`}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {touchedCount} of {plants.length} plants updated
          </span>
        </div>
      </div>

      {/* SUCCESS TOAST */}
      {submitted && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-300 text-green-800 rounded-lg px-4 py-3 shadow-sm">
          <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium text-sm">
            Update submitted successfully! Dashboard data has been refreshed.
          </span>
        </div>
      )}

      {/* DATE VALIDATION WARNING */}
      {dateError && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-300 text-red-800 rounded-lg px-4 py-3">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <span className="font-medium text-sm">Please enter a valid update date before submitting.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── SECTION A: Update Metadata ────────────────────────────────── */}
        <SectionCard title="Section A — Update Metadata">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Date of Update <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={updateDate}
                onChange={e => { setUpdateDate(e.target.value); setDateError(false); }}
                className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                  dateError ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'
                }`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Updated By (Name / Role)
              </label>
              <input
                type="text"
                value={updatedBy}
                onChange={e => setUpdatedBy(e.target.value)}
                placeholder="e.g. Regional Crisis Coordinator"
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-slate-400"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Overall Situation Summary
            </label>
            <textarea
              value={summary}
              onChange={e => setSummary(e.target.value)}
              rows={4}
              placeholder="Provide a narrative summary of the overall situation this week — key developments, emerging risks, actions taken..."
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-slate-400 resize-vertical"
            />
          </div>
        </SectionCard>

        {/* ── SECTION B: Per-Plant KPI Status ───────────────────────────── */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Section B — Per-Plant KPI Status
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => expandAll(setOpenKpi)}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
              >
                Expand All
              </button>
              <button
                type="button"
                onClick={() => collapseAll(setOpenKpi)}
                className="text-xs text-slate-500 hover:text-slate-700 font-medium px-2 py-1 rounded hover:bg-slate-100 transition-colors"
              >
                Collapse All
              </button>
            </div>
          </div>
          <div className="p-5 space-y-3">
            {plants.map(plant => {
              const ragStatus = plantOverallRag(formKpi, plant.id);
              const isOpen = !!openKpi[plant.id];
              return (
                <div key={plant.id} className="border border-slate-200 rounded-lg overflow-hidden">
                  <CollapsiblePlantHeader
                    plant={plant}
                    isOpen={isOpen}
                    onToggle={() => setOpenKpi(prev => ({ ...prev, [plant.id]: !prev[plant.id] }))}
                    ragStatus={ragStatus}
                    touched={touchedPlants.has(plant.id)}
                  />
                  {isOpen && (
                    <div className="p-4 bg-white border-t border-slate-200">
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {kpis.map(kpi => (
                          <div key={kpi.id}>
                            <label className="block text-xs font-medium text-slate-600 mb-1 leading-tight" title={kpi.description}>
                              {kpi.short}
                            </label>
                            <RagSelect
                              value={formKpi[plant.id]?.[kpi.id] ?? 'green'}
                              onChange={val => handleKpiChange(plant.id, kpi.id, val)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── SECTION C: Active Measures Per Plant ──────────────────────── */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Section C — Active Measures Per Plant
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => expandAll(setOpenMeasures)}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
              >
                Expand All
              </button>
              <button
                type="button"
                onClick={() => collapseAll(setOpenMeasures)}
                className="text-xs text-slate-500 hover:text-slate-700 font-medium px-2 py-1 rounded hover:bg-slate-100 transition-colors"
              >
                Collapse All
              </button>
            </div>
          </div>
          <div className="p-5 space-y-3">
            {plants.map(plant => {
              const ragStatus = plantOverallRag(formKpi, plant.id);
              const isOpen = !!openMeasures[plant.id];
              return (
                <div key={plant.id} className="border border-slate-200 rounded-lg overflow-hidden">
                  <CollapsiblePlantHeader
                    plant={plant}
                    isOpen={isOpen}
                    onToggle={() => setOpenMeasures(prev => ({ ...prev, [plant.id]: !prev[plant.id] }))}
                    ragStatus={ragStatus}
                    touched={touchedPlants.has(plant.id)}
                  />
                  {isOpen && (
                    <div className="p-4 bg-white border-t border-slate-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {measures.map(measure => (
                          <div key={measure.id}>
                            <label
                              className="block text-xs font-medium text-slate-600 mb-1 leading-tight"
                              title={measure.description}
                            >
                              {measure.label}
                            </label>
                            <MeasureSelect
                              value={formMeasures[plant.id]?.[measure.id] ?? 'inactive'}
                              onChange={val => handleMeasureChange(plant.id, measure.id, val)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── SECTION D: Plant Notes ────────────────────────────────────── */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Section D — Plant Notes
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => expandAll(setOpenNotes)}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
              >
                Expand All
              </button>
              <button
                type="button"
                onClick={() => collapseAll(setOpenNotes)}
                className="text-xs text-slate-500 hover:text-slate-700 font-medium px-2 py-1 rounded hover:bg-slate-100 transition-colors"
              >
                Collapse All
              </button>
            </div>
          </div>
          <div className="p-5 space-y-3">
            {plants.map(plant => {
              const ragStatus = plantOverallRag(formKpi, plant.id);
              const isOpen = !!openNotes[plant.id];
              return (
                <div key={plant.id} className="border border-slate-200 rounded-lg overflow-hidden">
                  <CollapsiblePlantHeader
                    plant={plant}
                    isOpen={isOpen}
                    onToggle={() => setOpenNotes(prev => ({ ...prev, [plant.id]: !prev[plant.id] }))}
                    ragStatus={ragStatus}
                    touched={touchedPlants.has(plant.id)}
                  />
                  {isOpen && (
                    <div className="p-4 bg-white border-t border-slate-200">
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Plant Notes — {plant.name}
                      </label>
                      <textarea
                        value={formNotes[plant.id] ?? ''}
                        onChange={e => handleNoteChange(plant.id, e.target.value)}
                        rows={4}
                        placeholder={`Enter plant-specific notes for ${plant.name}...`}
                        className="w-full border border-slate-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-slate-400 resize-vertical"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── SUBMIT BUTTON ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              {touchedCount > 0 ? (
                <p className="text-sm text-slate-600">
                  You have made changes to <strong className="text-blue-700">{touchedCount}</strong> of{' '}
                  <strong>{plants.length}</strong> plants. Submitting will update all dashboard pages immediately.
                </p>
              ) : (
                <p className="text-sm text-slate-500">
                  No plants edited yet. Make changes to KPIs, measures, or notes above, then submit.
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50"
            >
              Submit Weekly Update
            </button>
          </div>
        </div>

      </form>

      {/* ── UPDATE HISTORY / CHANGELOG ───────────────────────────────────── */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
            Update History
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {updateHistory.length} {updateHistory.length === 1 ? 'update' : 'updates'} recorded
          </span>
        </div>
        <div className="p-5">
          {updateHistory.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">No updates recorded yet.</p>
          ) : (
            <div className="space-y-2">
              {updateHistory.map(entry => (
                <HistoryEntry key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
