import { useState } from 'react';
import {
  RagDot, RagBadge, RagSelect, MeasureSelect, SectionCard, GlassCard, Card,
  TrendIcon, MeasureStatusBadge, plantOverallRag, countRedKpis, countAmberKpis,
} from '../components/shared';

// ─── Constants ────────────────────────────────────────────────────────────────

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
  { value: 'improving', label: '↑ Improving', activeColor: '#16a34a', activeText: '#86efac', inactiveText: '#94a3b8' },
  { value: 'stable',    label: '→ Stable',    activeColor: '#d97706', activeText: '#fcd34d', inactiveText: '#94a3b8' },
  { value: 'worsening', label: '↓ Worsening', activeColor: '#dc2626', activeText: '#fca5a5', inactiveText: '#94a3b8' },
];

const MEASURE_GROUP_ORDER = ['active', 'planned', 'inactive'];

const MEASURE_GROUP_LABELS = {
  active:   'Active',
  planned:  'Planned',
  inactive: 'Inactive',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ragStatusText(kpi, status) {
  if (status === 'red')   return kpi.red;
  if (status === 'amber') return kpi.amber;
  return kpi.green;
}

function ragLeftBorderColor(status) {
  if (status === 'red')   return '#dc2626';
  if (status === 'amber') return '#d97706';
  return '#16a34a';
}

function ragCardTint(status) {
  if (status === 'red')   return 'rgba(220,38,38,0.08)';
  if (status === 'amber') return 'rgba(217,119,6,0.08)';
  return 'rgba(22,163,74,0.08)';
}

function ragHeaderTint(status) {
  if (status === 'red')   return 'linear-gradient(135deg, rgba(220,38,38,0.18) 0%, rgba(255,255,255,0.03) 100%)';
  if (status === 'amber') return 'linear-gradient(135deg, rgba(217,119,6,0.18) 0%, rgba(255,255,255,0.03) 100%)';
  return 'linear-gradient(135deg, rgba(22,163,74,0.18) 0%, rgba(255,255,255,0.03) 100%)';
}

function ragStatusTextColor(status) {
  if (status === 'red')   return '#fca5a5';
  if (status === 'amber') return '#fcd34d';
  return '#86efac';
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PlantSelectorBar({ plants, selectedPlant, onSelect, kpiData }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 16,
      padding: '14px 20px',
    }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginRight: 4, whiteSpace: 'nowrap' }}>
          Select Plant
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {plants.map(p => {
            const rag = plantOverallRag(kpiData, p.id);
            const isActive = p.id === selectedPlant;
            const meta = PLANT_META[p.id] || {};
            const ragCol = rag === 'red' ? '#dc2626' : rag === 'amber' ? '#d97706' : '#16a34a';
            return (
              <button
                key={p.id}
                onClick={() => onSelect(p.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 14px',
                  borderRadius: 999,
                  border: isActive
                    ? '2px solid rgba(99,179,237,0.8)'
                    : '1px solid rgba(255,255,255,0.15)',
                  background: isActive
                    ? 'rgba(99,179,237,0.15)'
                    : 'rgba(255,255,255,0.05)',
                  color: isActive ? '#e2e8f0' : '#94a3b8',
                  fontSize: 12,
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 0 12px rgba(99,179,237,0.35)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ fontSize: 15, lineHeight: 1 }}>{meta.flag}</span>
                <span>{p.id}</span>
                <RagDot status={rag} size="sm" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PlantHeaderCard({ selectedPlant, meta, overallRag, redCount, amberCount, greenCount, trend, onTrendChange, plantNote }) {
  const previewNote = plantNote ? plantNote.slice(0, 100) + (plantNote.length > 100 ? '…' : '') : null;

  return (
    <div style={{
      background: ragHeaderTint(overallRag),
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 16,
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      overflow: 'hidden',
    }}>
      <div style={{ padding: '24px 28px' }}>

        {/* Top: plant name + country + RAG badge */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 48, lineHeight: 1 }}>{meta.flag}</span>
            <div>
              <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em' }}>
                {selectedPlant}
              </h1>
              <p style={{ margin: '2px 0 0', fontSize: 13, color: '#94a3b8' }}>{meta.countryName}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <RagBadge status={overallRag} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <TrendIcon trend={trend} />
              <span style={{ fontSize: 12, color: '#cbd5e1', textTransform: 'capitalize' }}>{trend}</span>
            </div>
          </div>
        </div>

        {/* KPI count pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700,
            background: 'rgba(220,38,38,0.2)', border: '1px solid rgba(220,38,38,0.4)', color: '#fca5a5',
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#dc2626', display: 'inline-block' }} />
            {redCount} Red
          </span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700,
            background: 'rgba(217,119,6,0.2)', border: '1px solid rgba(217,119,6,0.4)', color: '#fcd34d',
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#d97706', display: 'inline-block' }} />
            {amberCount} Amber
          </span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700,
            background: 'rgba(22,163,74,0.2)', border: '1px solid rgba(22,163,74,0.4)', color: '#86efac',
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
            {greenCount} Green
          </span>
        </div>

        {/* Trend selector */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: previewNote ? 16 : 0 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Trend:
          </span>
          {TREND_OPTIONS.map(opt => {
            const isActive = trend === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onTrendChange(opt.value)}
                style={{
                  padding: '5px 14px',
                  borderRadius: 999,
                  border: isActive ? `1px solid ${opt.activeColor}88` : '1px solid rgba(255,255,255,0.12)',
                  background: isActive ? `${opt.activeColor}33` : 'rgba(255,255,255,0.04)',
                  color: isActive ? opt.activeText : opt.inactiveText,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? `0 0 10px ${opt.activeColor}44` : 'none',
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Notes preview */}
        {previewNote && (
          <div style={{
            marginTop: 0,
            padding: '10px 14px',
            borderRadius: 10,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 4 }}>
              Latest Notes
            </span>
            <p style={{ margin: 0, fontSize: 12, color: '#94a3b8', fontStyle: 'italic', lineHeight: 1.5 }}>
              "{previewNote}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function KpiStatusSection({ kpis, plantKpiData, selectedPlant, setKpiData }) {
  return (
    <SectionCard title="KPI Status — Click to Update">
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 12,
      }}>
        {kpis.map(kpi => {
          const status = plantKpiData[kpi.id] || 'green';
          const statusText = ragStatusText(kpi, status);
          return (
            <div
              key={kpi.id}
              style={{
                background: ragCardTint(status),
                border: `1px solid rgba(255,255,255,0.08)`,
                borderLeft: `4px solid ${ragLeftBorderColor(status)}`,
                borderRadius: 12,
                padding: '14px 14px 12px',
                backdropFilter: 'blur(12px)',
                transition: 'all 0.15s ease',
              }}
            >
              {/* Label + RagSelect in a row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', lineHeight: 1.2 }}>
                  {kpi.short}
                </span>
                <RagSelect
                  value={status}
                  onChange={newVal =>
                    setKpiData(prev => ({
                      ...prev,
                      [selectedPlant]: {
                        ...prev[selectedPlant],
                        [kpi.id]: newVal,
                      },
                    }))
                  }
                />
              </div>

              {/* Threshold text */}
              <p style={{ margin: '0 0 5px', fontSize: 11, fontWeight: 600, color: ragStatusTextColor(status), lineHeight: 1.4 }}>
                {statusText}
              </p>

              {/* Description */}
              <p style={{ margin: 0, fontSize: 11, color: '#64748b', lineHeight: 1.5 }}>
                {kpi.description}
              </p>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

function MeasuresSection({ measures, plantMeasuresData, selectedPlant, setMeasuresData }) {
  // Group by status
  const grouped = { active: [], planned: [], inactive: [] };
  for (const m of measures) {
    const s = plantMeasuresData[m.id] || 'inactive';
    if (grouped[s]) grouped[s].push(m);
    else grouped.inactive.push(m);
  }

  return (
    <SectionCard title="Mitigation Measures — Click to Update">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {MEASURE_GROUP_ORDER.map(group => {
          const items = grouped[group];
          if (items.length === 0) return null;

          const groupColor = group === 'active' ? '#86efac' : group === 'planned' ? '#fcd34d' : '#64748b';
          const groupBorderColor = group === 'active' ? 'rgba(22,163,74,0.4)' : group === 'planned' ? 'rgba(217,119,6,0.4)' : 'rgba(100,116,139,0.3)';

          return (
            <div key={group}>
              {/* Group header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 8,
                paddingBottom: 6,
                borderBottom: `1px solid rgba(255,255,255,0.06)`,
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: groupColor, display: 'inline-block' }} />
                <span style={{ fontSize: 10, fontWeight: 800, color: groupColor, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                  {MEASURE_GROUP_LABELS[group]}
                </span>
                <span style={{ fontSize: 10, color: '#475569', marginLeft: 2 }}>({items.length})</span>
              </div>

              {/* Measure rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {items.map(measure => {
                  const currentStatus = plantMeasuresData[measure.id] || 'inactive';
                  return (
                    <div
                      key={measure.id}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: 12,
                        padding: '10px 14px',
                        borderRadius: 10,
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        transition: 'background 0.15s ease',
                      }}
                    >
                      {/* Left: label + description */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0' }}>
                            {measure.label}
                          </span>
                          <MeasureStatusBadge status={currentStatus} />
                        </div>
                        <p style={{ margin: 0, fontSize: 11, color: '#475569', lineHeight: 1.5 }}>
                          {measure.description}
                        </p>
                      </div>

                      {/* Right: MeasureSelect */}
                      <div style={{ flexShrink: 0 }}>
                        <MeasureSelect
                          value={currentStatus}
                          onChange={newVal =>
                            setMeasuresData(prev => ({
                              ...prev,
                              [selectedPlant]: {
                                ...prev[selectedPlant],
                                [measure.id]: newVal,
                              },
                            }))
                          }
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

function PlantNotesSection({ selectedPlant, plantNote, setPlantNotes }) {
  const [modified, setModified] = useState(false);

  function handleChange(e) {
    const val = e.target.value;
    setPlantNotes(prev => ({ ...prev, [selectedPlant]: val }));
    if (!modified) setModified(true);
  }

  const meta = PLANT_META[selectedPlant] || {};

  return (
    <SectionCard title="Plant Notes">
      <div>
        <textarea
          value={plantNote}
          onChange={handleChange}
          placeholder={`Enter notes for ${selectedPlant} (${meta.countryName || ''})…`}
          rows={5}
          style={{
            width: '100%',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 8,
            padding: '12px 14px',
            fontSize: 13,
            color: 'white',
            lineHeight: 1.6,
            resize: 'vertical',
            outline: 'none',
            boxSizing: 'border-box',
            fontFamily: 'inherit',
            transition: 'border-color 0.15s ease',
          }}
          onFocus={e => { e.target.style.borderColor = 'rgba(99,179,237,0.5)'; }}
          onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
          {modified ? (
            <span style={{ fontSize: 11, color: '#16a34a' }}>Last modified this session</span>
          ) : (
            <span style={{ fontSize: 11, color: '#475569' }}>
              Record latest status, actions taken, and any escalations for {selectedPlant}.
            </span>
          )}
          <span style={{ fontSize: 11, color: '#475569', fontVariantNumeric: 'tabular-nums' }}>
            {plantNote.length} chars
          </span>
        </div>
      </div>
    </SectionCard>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PlantDetailPage({
  plants, kpis, measures,
  kpiData, setKpiData,
  measuresData, setMeasuresData,
  plantNotes, setPlantNotes,
  plantTrends, setPlantTrends,
}) {
  const [selectedPlant, setSelectedPlant] = useState('RBID');

  const meta           = PLANT_META[selectedPlant] || {};
  const overallRag     = plantOverallRag(kpiData, selectedPlant);
  const trend          = plantTrends[selectedPlant] || 'stable';
  const plantKpiData   = kpiData[selectedPlant] || {};
  const plantMeasuresData = measuresData[selectedPlant] || {};
  const plantNote      = plantNotes[selectedPlant] || '';

  const redCount   = countRedKpis(kpiData, selectedPlant);
  const amberCount = countAmberKpis(kpiData, selectedPlant);
  const greenCount = Object.values(plantKpiData).filter(v => v === 'green').length;

  function handleTrendChange(newTrend) {
    setPlantTrends(prev => ({ ...prev, [selectedPlant]: newTrend }));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Plant Selector */}
      <PlantSelectorBar
        plants={plants}
        selectedPlant={selectedPlant}
        onSelect={setSelectedPlant}
        kpiData={kpiData}
      />

      {/* Plant Header Card */}
      <PlantHeaderCard
        selectedPlant={selectedPlant}
        meta={meta}
        overallRag={overallRag}
        redCount={redCount}
        amberCount={amberCount}
        greenCount={greenCount}
        trend={trend}
        onTrendChange={handleTrendChange}
        plantNote={plantNote}
      />

      {/* KPI Status — Inline Editing */}
      <KpiStatusSection
        kpis={kpis}
        plantKpiData={plantKpiData}
        selectedPlant={selectedPlant}
        setKpiData={setKpiData}
      />

      {/* Measures — Inline Editing */}
      <MeasuresSection
        measures={measures}
        plantMeasuresData={plantMeasuresData}
        selectedPlant={selectedPlant}
        setMeasuresData={setMeasuresData}
      />

      {/* Plant Notes */}
      <PlantNotesSection
        selectedPlant={selectedPlant}
        plantNote={plantNote}
        setPlantNotes={setPlantNotes}
      />

    </div>
  );
}
