import { useState, useCallback } from 'react';
import {
  RagDot, RagBadge, RagSelect, MeasureSelect, SectionCard, GlassCard, Card,
  plantOverallRag,
} from '../components/shared';

// ── helpers ───────────────────────────────────────────────────────────────────

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

// ── Glass input/textarea base styles ─────────────────────────────────────────

const glassInput = {
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.15)',
  color: 'white',
  borderRadius: 8,
  padding: '6px 10px',
  fontSize: 13,
  outline: 'none',
  width: '100%',
};

// ── Collapsible plant header ──────────────────────────────────────────────────

function PlantHeader({ plant, isOpen, onToggle, ragStatus, touched }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between px-4 py-3 text-left transition-all"
      style={isOpen ? {
        background: 'rgba(255,255,255,0.1)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      } : {
        background: 'rgba(255,255,255,0.03)',
      }}
    >
      <span className="flex items-center gap-2.5 font-semibold text-sm text-white">
        <span className="text-base">{plant.flag}</span>
        <span>{plant.name}</span>
        {plant.countryName && (
          <span className="text-xs font-normal text-slate-400">{plant.countryName}</span>
        )}
        {touched && (
          <span
            className="text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{
              background: 'rgba(59,130,246,0.25)',
              border: '1px solid rgba(59,130,246,0.4)',
              color: '#93c5fd',
            }}
          >
            edited
          </span>
        )}
      </span>
      <span className="flex items-center gap-2.5">
        <RagBadge status={ragStatus} />
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </button>
  );
}

// ── Section wrapper with expand/collapse controls ─────────────────────────────

function UpdateSection({ title, plants, openState, setOpenState, children }) {
  function expandAll()  { setOpenState(Object.fromEntries(plants.map(p => [p.id, true]))); }
  function collapseAll(){ setOpenState(Object.fromEntries(plants.map(p => [p.id, false]))); }

  return (
    <Card>
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-widest">{title}</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={expandAll}
            className="text-xs font-medium px-2 py-1 rounded-lg transition-all"
            style={{
              background: 'rgba(59,130,246,0.15)',
              border: '1px solid rgba(59,130,246,0.3)',
              color: '#93c5fd',
            }}
          >
            Expand All
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="text-xs font-medium px-2 py-1 rounded-lg transition-all"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#94a3b8',
            }}
          >
            Collapse All
          </button>
        </div>
      </div>
      <div className="p-4 space-y-2">
        {children}
      </div>
    </Card>
  );
}

// ── Plant accordion card ──────────────────────────────────────────────────────

function PlantAccordion({ plant, isOpen, onToggle, ragStatus, touched, children }) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: isOpen ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <PlantHeader
        plant={plant}
        isOpen={isOpen}
        onToggle={onToggle}
        ragStatus={ragStatus}
        touched={touched}
      />
      {isOpen && (
        <div
          className="p-4"
          style={{ background: 'rgba(0,0,0,0.1)' }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// ── History entry ─────────────────────────────────────────────────────────────

function HistoryEntry({ entry }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left transition-all hover:bg-white/5"
      >
        <span className="flex items-center gap-3">
          <span
            className="text-xs font-mono px-2 py-0.5 rounded-lg"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#94a3b8',
            }}
          >
            {entry.date}
          </span>
          <span className="text-sm font-semibold text-white">{entry.updatedBy}</span>
          <span className="text-xs text-slate-400 max-w-xs truncate hidden sm:block">
            {entry.summary?.slice(0, 60)}{entry.summary?.length > 60 ? '…' : ''}
          </span>
        </span>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div
          className="px-4 py-3 text-sm text-slate-300 leading-relaxed"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,0,0,0.1)' }}
        >
          {entry.summary}
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function WeeklyUpdatePage({
  plants = [],
  kpis = [],
  measures = [],
  kpiData = {},
  setKpiData,
  measuresData = {},
  setMeasuresData,
  plantNotes = {},
  setPlantNotes,
  updateHistory = [],
  setUpdateHistory,
  kpiHistory = [],
  setKpiHistory,
}) {
  // ── metadata state ────────────────────────────────────────────────────────
  const [updateDate, setUpdateDate] = useState(todayISO());
  const [updatedBy,  setUpdatedBy]  = useState('');
  const [summary,    setSummary]    = useState('');

  // ── per-plant form state ──────────────────────────────────────────────────
  const [formKpi,       setFormKpi]      = useState(() => deepClone(kpiData));
  const [formMeasures,  setFormMeasures] = useState(() => deepClone(measuresData));
  const [formNotes,     setFormNotes]    = useState(() => deepClone(plantNotes));

  // ── touched tracking ──────────────────────────────────────────────────────
  const [touchedPlants, setTouchedPlants] = useState(new Set());

  // ── collapse state ────────────────────────────────────────────────────────
  const initOpen = () => Object.fromEntries(plants.map((p, i) => [p.id, i === 0]));
  const [openKpi,      setOpenKpi]      = useState(initOpen);
  const [openMeasures, setOpenMeasures] = useState(initOpen);
  const [openNotes,    setOpenNotes]    = useState(initOpen);

  // ── submit state ──────────────────────────────────────────────────────────
  const [submitted, setSubmitted] = useState(false);
  const [dateError, setDateError] = useState(false);

  const markTouched = useCallback((plantId) => {
    setTouchedPlants(prev => new Set([...prev, plantId]));
  }, []);

  function handleKpiChange(plantId, kpiId, value) {
    setFormKpi(prev => ({ ...prev, [plantId]: { ...prev[plantId], [kpiId]: value } }));
    markTouched(plantId);
  }

  function handleMeasureChange(plantId, measureId, value) {
    setFormMeasures(prev => ({ ...prev, [plantId]: { ...prev[plantId], [measureId]: value } }));
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

    // 1. Update KPI data
    setKpiData(deepClone(formKpi));

    // 2. Update measures data
    setMeasuresData(deepClone(formMeasures));

    // 3. Update plant notes
    setPlantNotes(deepClone(formNotes));

    // 4. Add update history entry
    const newEntry = {
      id: Date.now(),
      date: updateDate,
      updatedBy: updatedBy.trim() || 'Anonymous',
      summary: summary.trim() || '(No summary provided)',
    };
    setUpdateHistory(prev => [newEntry, ...prev]);

    // 5. Add KPI history snapshot
    if (setKpiHistory) {
      const weekNum = (kpiHistory?.length ?? 0) + 1;
      const label = `Week ${weekNum} — ${summary.trim().slice(0, 30) || 'Update'}`;
      setKpiHistory(prev => [
        ...(prev || []),
        {
          week: `W${weekNum}`,
          date: updateDate,
          label,
          kpiData: deepClone(formKpi),
        },
      ]);
    }

    setSubmitted(true);
    setTouchedPlants(new Set());
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setSubmitted(false), 4000);
  }

  const touchedCount = touchedPlants.size;

  // ── glass label style ─────────────────────────────────────────────────────
  const glassLabel = {
    display: 'block',
    fontSize: 11,
    fontWeight: 600,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    marginBottom: 6,
  };

  return (
    <div className="space-y-6">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Weekly Crisis Update</h1>
          <p className="text-slate-400 text-sm mt-1">
            Submit the weekly status update — changes are reflected across all dashboard pages
          </p>
        </div>

        {/* Progress indicator */}
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl shrink-0"
          style={touchedCount > 0 ? {
            background: 'rgba(59,130,246,0.15)',
            border: '1px solid rgba(59,130,246,0.35)',
          } : {
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
               style={{ color: touchedCount > 0 ? '#93c5fd' : '#475569' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span
            className="text-sm font-semibold"
            style={{ color: touchedCount > 0 ? '#93c5fd' : '#64748b' }}
          >
            {touchedCount}/{plants.length} plants updated
          </span>
        </div>
      </div>

      {/* ── Success toast ── */}
      {submitted && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{
            background: 'rgba(22,163,74,0.15)',
            border: '1px solid rgba(22,163,74,0.35)',
            boxShadow: '0 0 20px rgba(22,163,74,0.15)',
          }}
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
               style={{ color: '#86efac' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-semibold text-sm" style={{ color: '#86efac' }}>
            Update submitted successfully! Dashboard data has been refreshed.
          </span>
        </div>
      )}

      {/* ── Date error ── */}
      {dateError && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{
            background: 'rgba(220,38,38,0.15)',
            border: '1px solid rgba(220,38,38,0.35)',
          }}
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
               style={{ color: '#fca5a5' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <span className="font-medium text-sm" style={{ color: '#fca5a5' }}>
            Please enter a valid update date before submitting.
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── SECTION A: Update Metadata ── */}
        <SectionCard title="Section A — Update Metadata">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label style={glassLabel}>
                Date of Update <span style={{ color: '#fca5a5' }}>*</span>
              </label>
              <input
                type="date"
                value={updateDate}
                onChange={e => { setUpdateDate(e.target.value); setDateError(false); }}
                style={{
                  ...glassInput,
                  borderColor: dateError ? 'rgba(220,38,38,0.5)' : 'rgba(255,255,255,0.15)',
                  background: dateError ? 'rgba(220,38,38,0.1)' : 'rgba(255,255,255,0.08)',
                  colorScheme: 'dark',
                }}
              />
            </div>
            <div>
              <label style={glassLabel}>Updated By (Name / Role)</label>
              <input
                type="text"
                value={updatedBy}
                onChange={e => setUpdatedBy(e.target.value)}
                placeholder="e.g. Regional Crisis Coordinator"
                style={glassInput}
              />
            </div>
          </div>
          <div className="mt-4">
            <label style={glassLabel}>Overall Situation Summary</label>
            <textarea
              value={summary}
              onChange={e => setSummary(e.target.value)}
              rows={4}
              placeholder="Provide a narrative summary of the overall situation this week — key developments, emerging risks, actions taken..."
              style={{ ...glassInput, resize: 'vertical', lineHeight: 1.6 }}
            />
          </div>
        </SectionCard>

        {/* ── SECTION B: Per-Plant KPI Status ── */}
        <UpdateSection
          title="Section B — Per-Plant KPI Status"
          plants={plants}
          openState={openKpi}
          setOpenState={setOpenKpi}
        >
          {plants.map(plant => {
            const ragStatus = plantOverallRag(formKpi, plant.id);
            const isOpen    = !!openKpi[plant.id];
            return (
              <PlantAccordion
                key={plant.id}
                plant={plant}
                isOpen={isOpen}
                onToggle={() => setOpenKpi(prev => ({ ...prev, [plant.id]: !prev[plant.id] }))}
                ragStatus={ragStatus}
                touched={touchedPlants.has(plant.id)}
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {kpis.map(kpi => (
                    <div key={kpi.id}>
                      <label
                        style={{
                          ...glassLabel,
                          textTransform: 'none',
                          letterSpacing: 0,
                          fontSize: 11,
                          fontWeight: 500,
                        }}
                        title={kpi.description}
                      >
                        {kpi.short}
                      </label>
                      <RagSelect
                        value={formKpi[plant.id]?.[kpi.id] ?? 'green'}
                        onChange={val => handleKpiChange(plant.id, kpi.id, val)}
                      />
                    </div>
                  ))}
                </div>
              </PlantAccordion>
            );
          })}
        </UpdateSection>

        {/* ── SECTION C: Active Measures Per Plant ── */}
        <UpdateSection
          title="Section C — Active Measures Per Plant"
          plants={plants}
          openState={openMeasures}
          setOpenState={setOpenMeasures}
        >
          {plants.map(plant => {
            const ragStatus = plantOverallRag(formKpi, plant.id);
            const isOpen    = !!openMeasures[plant.id];
            return (
              <PlantAccordion
                key={plant.id}
                plant={plant}
                isOpen={isOpen}
                onToggle={() => setOpenMeasures(prev => ({ ...prev, [plant.id]: !prev[plant.id] }))}
                ragStatus={ragStatus}
                touched={touchedPlants.has(plant.id)}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {measures.map(measure => (
                    <div key={measure.id}>
                      <label
                        style={{
                          ...glassLabel,
                          textTransform: 'none',
                          letterSpacing: 0,
                          fontSize: 11,
                          fontWeight: 500,
                        }}
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
              </PlantAccordion>
            );
          })}
        </UpdateSection>

        {/* ── SECTION D: Plant Notes ── */}
        <UpdateSection
          title="Section D — Plant Notes"
          plants={plants}
          openState={openNotes}
          setOpenState={setOpenNotes}
        >
          {plants.map(plant => {
            const ragStatus = plantOverallRag(formKpi, plant.id);
            const isOpen    = !!openNotes[plant.id];
            return (
              <PlantAccordion
                key={plant.id}
                plant={plant}
                isOpen={isOpen}
                onToggle={() => setOpenNotes(prev => ({ ...prev, [plant.id]: !prev[plant.id] }))}
                ragStatus={ragStatus}
                touched={touchedPlants.has(plant.id)}
              >
                <label style={glassLabel}>Plant Notes — {plant.name}</label>
                <textarea
                  value={formNotes[plant.id] ?? ''}
                  onChange={e => handleNoteChange(plant.id, e.target.value)}
                  rows={4}
                  placeholder={`Enter plant-specific notes for ${plant.name}...`}
                  style={{ ...glassInput, resize: 'vertical', lineHeight: 1.6 }}
                />
              </PlantAccordion>
            );
          })}
        </UpdateSection>

        {/* ── Submit ── */}
        <Card>
          <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              {touchedCount > 0 ? (
                <p className="text-sm text-slate-300">
                  You have made changes to{' '}
                  <strong style={{ color: '#93c5fd' }}>{touchedCount}</strong>
                  {' '}of{' '}
                  <strong className="text-white">{plants.length}</strong>
                  {' '}plants. Submitting will update all dashboard pages immediately.
                </p>
              ) : (
                <p className="text-sm text-slate-500">
                  No plants edited yet. Make changes to KPIs, measures, or notes above, then submit.
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-sm transition-all focus:outline-none"
              style={{
                background: touchedCount > 0
                  ? 'linear-gradient(135deg, rgba(59,130,246,0.8), rgba(99,102,241,0.8))'
                  : 'rgba(255,255,255,0.08)',
                border: touchedCount > 0
                  ? '1px solid rgba(99,102,241,0.5)'
                  : '1px solid rgba(255,255,255,0.12)',
                color: touchedCount > 0 ? '#ffffff' : '#64748b',
                boxShadow: touchedCount > 0 ? '0 0 20px rgba(59,130,246,0.3)' : 'none',
                backdropFilter: 'blur(10px)',
              }}
            >
              Submit Weekly Update
            </button>
          </div>
        </Card>

      </form>

      {/* ── Update History ── */}
      <Card>
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-widest">
            Update History
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {updateHistory.length} {updateHistory.length === 1 ? 'update' : 'updates'} recorded
          </span>
        </div>
        <div className="p-4">
          {updateHistory.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">
              No updates recorded yet.
            </p>
          ) : (
            <div className="space-y-2">
              {updateHistory.map(entry => (
                <HistoryEntry key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </div>
      </Card>

    </div>
  );
}
