import { useState } from 'react';
import {
  RagDot, RagBadge, RagSelect, MeasureSelect, GlassCard, Card, SectionCard,
  WeekSelector, TrendIcon, MeasureBadge,
  RAG, plantRag, countRag, topRisk,
} from '../components/shared';

// ── Helpers ──────────────────────────────────────────────────────────────────

function plantTrend(curWeek, prevWeek, plantId) {
  if (!prevWeek) return 'stable';
  const order = { green: 0, amber: 1, red: 2 };
  const cur  = order[plantRag(curWeek?.kpiData,  plantId)] ?? 0;
  const prev = order[plantRag(prevWeek?.kpiData, plantId)] ?? 0;
  if (cur > prev) return 'worsening';
  if (cur < prev) return 'improving';
  return 'stable';
}

function kpiTrend(curWeek, prevWeek, plantId, kpiId) {
  if (!prevWeek) return 'stable';
  const order = { green: 0, amber: 1, red: 2 };
  const cur  = order[(curWeek?.kpiData?.[plantId]  || {})[kpiId]] ?? 0;
  const prev = order[(prevWeek?.kpiData?.[plantId] || {})[kpiId]] ?? 0;
  if (cur > prev) return 'worsening';
  if (cur < prev) return 'improving';
  return 'stable';
}

const TREND_LABEL = {
  improving: { text: '↑ Improving', color: '#86efac' },
  worsening: { text: '↓ Worsening', color: '#fca5a5' },
  stable:    { text: '→ Stable',    color: '#fcd34d' },
};

// ── Sub-components ────────────────────────────────────────────────────────────

function TopBar({ kpiHistory, selectedWeekIdx, setSelectedWeekIdx, selectedWeek }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
      <WeekSelector
        kpiHistory={kpiHistory}
        selectedWeekIdx={selectedWeekIdx}
        setSelectedWeekIdx={setSelectedWeekIdx}
      />
      <span
        className="px-3 py-1.5 rounded-full text-xs font-semibold"
        style={{
          background: 'rgba(59,130,246,0.15)',
          border: '1px solid rgba(59,130,246,0.35)',
          color: '#93c5fd',
        }}
      >
        ✏️ Editing: {selectedWeek?.week} · {selectedWeek?.label}
      </span>
    </div>
  );
}

function PlantSelector({ plants, selectedPlant, setSelectedPlant, selectedWeek }) {
  return (
    <div className="flex flex-wrap gap-2 mb-5">
      {plants.map(plant => {
        const rag = plantRag(selectedWeek?.kpiData, plant.id);
        const active = selectedPlant === plant.id;
        return (
          <button
            key={plant.id}
            onClick={() => setSelectedPlant(plant.id)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all"
            style={active ? {
              background: 'rgba(59,130,246,0.2)',
              border: '1px solid rgba(59,130,246,0.6)',
              color: 'white',
              boxShadow: '0 0 14px rgba(59,130,246,0.35)',
            } : {
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#94a3b8',
            }}
          >
            <span>{plant.flag}</span>
            <span>{plant.name}</span>
            <RagDot status={rag} size={10} />
          </button>
        );
      })}
    </div>
  );
}

function PlantHeaderCard({ plant, selectedWeek, prevWeek }) {
  const rag   = plantRag(selectedWeek?.kpiData, plant.id);
  const trend = plantTrend(selectedWeek, prevWeek, plant.id);
  const trendInfo = TREND_LABEL[trend];

  const red   = countRag(selectedWeek?.kpiData, plant.id, 'red');
  const amber = countRag(selectedWeek?.kpiData, plant.id, 'amber');
  const green = countRag(selectedWeek?.kpiData, plant.id, 'green');

  return (
    <GlassCard className="p-6 mb-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        {/* Left: flag + name */}
        <div className="flex items-center gap-4">
          <span style={{ fontSize: 48, lineHeight: 1 }}>{plant.flag}</span>
          <div>
            <div className="text-2xl font-black text-white tracking-wide">{plant.name}</div>
            <div className="text-slate-400 text-sm">{plant.countryName}</div>
          </div>
        </div>

        {/* Right: RAG + week */}
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">{selectedWeek?.week} · {selectedWeek?.label}</span>
            <span
              className="px-3 py-1 rounded-full text-sm font-black"
              style={{
                background: RAG[rag]?.light,
                border: `2px solid ${RAG[rag]?.border}`,
                color: RAG[rag]?.text,
                boxShadow: `0 0 16px ${RAG[rag]?.glow}`,
              }}
            >
              <RagDot status={rag} size={10} /> {RAG[rag]?.label}
            </span>
          </div>

          {/* Status badge */}
          {selectedWeek?.status === 'forecast' ? (
            <span
              className="px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ background: 'rgba(217,119,6,0.15)', border: '1px solid rgba(217,119,6,0.35)', color: '#fcd34d' }}
            >
              📋 Forecast Data
            </span>
          ) : (
            <span
              className="px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(22,163,74,0.35)', color: '#86efac' }}
            >
              ✅ Actual Data
            </span>
          )}
        </div>
      </div>

      {/* KPI count pills + trend */}
      <div className="flex flex-wrap items-center gap-3 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <span
          className="px-2.5 py-1 rounded-full text-xs font-bold"
          style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', color: '#fca5a5' }}
        >
          🔴 {red} Red
        </span>
        <span
          className="px-2.5 py-1 rounded-full text-xs font-bold"
          style={{ background: 'rgba(217,119,6,0.15)', border: '1px solid rgba(217,119,6,0.3)', color: '#fcd34d' }}
        >
          🟡 {amber} Amber
        </span>
        <span
          className="px-2.5 py-1 rounded-full text-xs font-bold"
          style={{ background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(22,163,74,0.3)', color: '#86efac' }}
        >
          🟢 {green} Green
        </span>

        <span className="text-slate-500 text-xs">|</span>

        <span className="text-xs font-bold" style={{ color: trendInfo.color }}>
          {trendInfo.text} vs previous week
        </span>

        <span className="text-xs text-slate-500">
          Top risk: {topRisk(selectedWeek?.kpiData, [], plant.id) !== 'None'
            ? topRisk(selectedWeek?.kpiData, [], plant.id)
            : 'None'}
        </span>
      </div>
    </GlassCard>
  );
}

function KpiCard({ kpi, plantId, selectedWeek, prevWeek, updateKpi }) {
  const status = (selectedWeek?.kpiData?.[plantId] || {})[kpi.id] || 'green';
  const trend  = kpiTrend(selectedWeek, prevWeek, plantId, kpi.id);
  const trendInfo = TREND_LABEL[trend];

  // Threshold text by current status
  const thresholdMap = {
    red:   kpi.red,
    amber: kpi.amber,
    green: kpi.green,
  };
  const thresholdText = thresholdMap[status] || '';

  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-2"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderLeft: `4px solid ${RAG[status]?.bg || RAG.green.bg}`,
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-white font-bold text-xs leading-tight">{kpi.short}</span>
        <RagSelect
          value={status}
          onChange={val => updateKpi(plantId, kpi.id, val)}
        />
      </div>

      {thresholdText && (
        <div className="text-xs font-medium" style={{ color: RAG[status]?.text }}>
          {thresholdText}
        </div>
      )}

      <div className="text-slate-400 text-xs leading-snug">{kpi.description}</div>

      <div className="text-xs font-bold" style={{ color: trendInfo.color }}>
        {trendInfo.text}
      </div>
    </div>
  );
}

function KpiPanel({ kpis, plantId, selectedWeek, prevWeek, updateKpi }) {
  return (
    <SectionCard
      title={`KPI Status — ${selectedWeek?.week || ''}`}
      headerRight={<span className="text-slate-500 text-xs">✏️ Inline editing</span>}
    >
      <div className="grid grid-cols-2 gap-3">
        {kpis.map(kpi => (
          <KpiCard
            key={kpi.id}
            kpi={kpi}
            plantId={plantId}
            selectedWeek={selectedWeek}
            prevWeek={prevWeek}
            updateKpi={updateKpi}
          />
        ))}
      </div>
    </SectionCard>
  );
}

function MeasureRow({ measure, plantId, selectedWeek, updateMeasure }) {
  const status = (selectedWeek?.measuresData?.[plantId] || {})[measure.id] || 'inactive';
  return (
    <div
      className="flex flex-col gap-2 rounded-xl p-3"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-white text-xs font-semibold">{measure.label}</span>
        <MeasureSelect
          value={status}
          onChange={val => updateMeasure(plantId, measure.id, val)}
        />
      </div>
      <div className="text-slate-400 text-xs leading-snug">{measure.description}</div>
    </div>
  );
}

const MEASURE_STATUS_ORDER = ['active', 'planned', 'inactive'];
const MEASURE_GROUP_LABELS = {
  active:   { label: 'Active',   color: '#86efac', bg: 'rgba(22,163,74,0.12)',   border: 'rgba(22,163,74,0.25)'   },
  planned:  { label: 'Planned',  color: '#fcd34d', bg: 'rgba(217,119,6,0.12)',   border: 'rgba(217,119,6,0.25)'   },
  inactive: { label: 'Inactive', color: '#475569', bg: 'rgba(100,116,139,0.08)', border: 'rgba(100,116,139,0.2)'  },
};

function MeasuresPanel({ measures, plantId, selectedWeek, updateMeasure }) {
  const grouped = MEASURE_STATUS_ORDER.reduce((acc, s) => {
    acc[s] = measures.filter(m => ((selectedWeek?.measuresData?.[plantId] || {})[m.id] || 'inactive') === s);
    return acc;
  }, {});

  return (
    <SectionCard
      title={`Measures — ${selectedWeek?.week || ''}`}
      headerRight={<span className="text-slate-500 text-xs">✏️ Inline editing</span>}
    >
      <div className="flex flex-col gap-4">
        {MEASURE_STATUS_ORDER.map(s => {
          const group = grouped[s];
          if (!group.length) return null;
          const cfg = MEASURE_GROUP_LABELS[s];
          return (
            <div key={s}>
              <div
                className="text-xs font-bold px-2 py-1 rounded-lg mb-2 inline-block"
                style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}
              >
                {cfg.label} ({group.length})
              </div>
              <div className="flex flex-col gap-2">
                {group.map(m => (
                  <MeasureRow
                    key={m.id}
                    measure={m}
                    plantId={plantId}
                    selectedWeek={selectedWeek}
                    updateMeasure={updateMeasure}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

function NotesSection({ plant, selectedWeek, selectedPlant, updateNote }) {
  const note = selectedWeek?.plantNotes?.[selectedPlant] || '';
  return (
    <GlassCard className="p-5 mt-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-widest">
          Plant Notes — {plant?.name} — {selectedWeek?.week}
        </h2>
        <span className="text-xs text-slate-500">Auto-saved</span>
      </div>

      <textarea
        value={note}
        onChange={e => updateNote(selectedPlant, e.target.value)}
        rows={4}
        placeholder="Enter plant-specific notes for this week…"
        className="w-full text-sm text-white placeholder-slate-600 rounded-xl px-4 py-3 resize-none outline-none"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(12px)',
          lineHeight: 1.6,
        }}
      />

      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-slate-600">💾 Note is saved automatically</span>
        <span className="text-xs text-slate-600">{note.length} characters</span>
      </div>
    </GlassCard>
  );
}

function HistoryPanel({ plant, plants, kpis, kpiHistory, selectedWeekIdx }) {
  const [open, setOpen] = useState(false);

  return (
    <GlassCard className="mt-5">
      {/* Header / toggle */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4"
        style={{ borderBottom: open ? '1px solid rgba(255,255,255,0.07)' : 'none' }}
      >
        <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
          KPI History — {plant?.name}
        </span>
        <span className="text-slate-400 text-xs font-semibold">
          {open ? '▲ Collapse' : '▼ Expand'}
        </span>
      </button>

      {open && (
        <div className="p-5">
          {/* Overall RAG timeline */}
          <div className="mb-5">
            <div className="text-xs text-slate-400 font-semibold mb-2 uppercase tracking-wider">
              Plant Overall RAG — All Weeks
            </div>
            <div className="flex items-end gap-1 overflow-x-auto pb-1">
              {kpiHistory.map((wk, wi) => {
                const rag = plantRag(wk.kpiData, plant.id);
                const isSelected = wi === selectedWeekIdx;
                return (
                  <div key={wk.week} className="flex flex-col items-center gap-1 shrink-0">
                    <div
                      className="w-8 rounded-t-md"
                      style={{
                        height: 28,
                        background: RAG[rag]?.bg,
                        boxShadow: isSelected ? `0 0 10px ${RAG[rag]?.glow}` : 'none',
                        opacity: wk.status === 'forecast' ? 0.55 : 1,
                        border: isSelected ? `2px solid ${RAG[rag]?.border}` : '2px solid transparent',
                      }}
                    />
                    <span
                      className="text-xs"
                      style={{
                        color: isSelected ? '#93c5fd' : '#475569',
                        fontWeight: isSelected ? 700 : 400,
                        fontSize: 10,
                      }}
                    >
                      {wk.week}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* KPI grid table */}
          <div className="text-xs text-slate-400 font-semibold mb-2 uppercase tracking-wider">
            Individual KPIs — All Weeks
          </div>
          <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
            <table className="w-full text-xs border-collapse" style={{ minWidth: 900 }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <th
                    className="text-left px-3 py-2 text-slate-400 font-semibold sticky left-0"
                    style={{ background: 'rgba(10,15,30,0.85)', minWidth: 130, zIndex: 1 }}
                  >
                    KPI
                  </th>
                  {kpiHistory.map((wk, wi) => {
                    const isSelected = wi === selectedWeekIdx;
                    return (
                      <th
                        key={wk.week}
                        className="px-2 py-2 font-semibold text-center"
                        style={{
                          color: isSelected ? '#93c5fd' : wk.status === 'forecast' ? '#475569' : '#64748b',
                          fontWeight: isSelected ? 700 : wk.status === 'actual' ? 600 : 400,
                          background: isSelected ? 'rgba(59,130,246,0.1)' : 'transparent',
                          minWidth: 40,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {wk.week}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {/* Overall RAG row */}
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  <td
                    className="px-3 py-2 font-bold text-white sticky left-0"
                    style={{ background: 'rgba(10,15,30,0.85)', zIndex: 1 }}
                  >
                    Overall
                  </td>
                  {kpiHistory.map((wk, wi) => {
                    const rag = plantRag(wk.kpiData, plant.id);
                    const isSelected = wi === selectedWeekIdx;
                    return (
                      <td
                        key={wk.week}
                        className="text-center py-2"
                        style={{ background: isSelected ? 'rgba(59,130,246,0.1)' : 'transparent' }}
                      >
                        <div className="flex justify-center">
                          <RagDot
                            status={rag}
                            size={wk.status === 'forecast' ? 8 : 10}
                          />
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* One row per KPI */}
                {kpis.map((kpi, ki) => (
                  <tr
                    key={kpi.id}
                    style={{
                      background: ki % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                    }}
                  >
                    <td
                      className="px-3 py-2 text-slate-300 sticky left-0"
                      style={{ background: ki % 2 === 0 ? 'rgba(10,15,30,0.85)' : 'rgba(13,18,35,0.9)', zIndex: 1 }}
                    >
                      {kpi.short}
                    </td>
                    {kpiHistory.map((wk, wi) => {
                      const cellStatus = (wk.kpiData?.[plant.id] || {})[kpi.id] || 'green';
                      const isSelected = wi === selectedWeekIdx;
                      return (
                        <td
                          key={wk.week}
                          className="text-center py-2"
                          style={{ background: isSelected ? 'rgba(59,130,246,0.1)' : 'transparent' }}
                        >
                          <div className="flex justify-center" style={{ opacity: wk.status === 'forecast' ? 0.6 : 1 }}>
                            <RagDot status={cellStatus} size={8} />
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
            <span className="font-semibold">Legend:</span>
            <span>Bold column header = Actual week</span>
            <span>Dimmed dots = Forecast</span>
            <span style={{ color: '#93c5fd' }}>Blue highlight = Selected week</span>
          </div>
        </div>
      )}
    </GlassCard>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function PlantDetailPage({
  plants,
  kpis,
  measures,
  kpiHistory,
  selectedWeek,
  prevWeek,
  selectedWeekIdx,
  setSelectedWeekIdx,
  updateKpi,
  updateMeasure,
  updateNote,
}) {
  const [selectedPlant, setSelectedPlant] = useState('RBID');

  const plant = plants?.find(p => p.id === selectedPlant) || plants?.[0];

  if (!plant || !selectedWeek) {
    return <div className="text-slate-400 p-8">Loading plant data…</div>;
  }

  return (
    <div>
      {/* Top bar */}
      <TopBar
        kpiHistory={kpiHistory}
        selectedWeekIdx={selectedWeekIdx}
        setSelectedWeekIdx={setSelectedWeekIdx}
        selectedWeek={selectedWeek}
      />

      {/* Plant selector pills */}
      <PlantSelector
        plants={plants}
        selectedPlant={selectedPlant}
        setSelectedPlant={setSelectedPlant}
        selectedWeek={selectedWeek}
      />

      {/* Plant header */}
      <PlantHeaderCard
        plant={plant}
        selectedWeek={selectedWeek}
        prevWeek={prevWeek}
      />

      {/* Two-column: KPIs + Measures */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <KpiPanel
          kpis={kpis}
          plantId={selectedPlant}
          selectedWeek={selectedWeek}
          prevWeek={prevWeek}
          updateKpi={updateKpi}
        />
        <MeasuresPanel
          measures={measures}
          plantId={selectedPlant}
          selectedWeek={selectedWeek}
          updateMeasure={updateMeasure}
        />
      </div>

      {/* Notes */}
      <NotesSection
        plant={plant}
        selectedWeek={selectedWeek}
        selectedPlant={selectedPlant}
        updateNote={updateNote}
      />

      {/* History panel */}
      <HistoryPanel
        plant={plant}
        plants={plants}
        kpis={kpis}
        kpiHistory={kpiHistory}
        selectedWeekIdx={selectedWeekIdx}
      />
    </div>
  );
}
