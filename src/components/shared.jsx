// Shared UI components — glass/iOS design system

export const RAG = {
  red:   { bg: '#DC2626', light: 'rgba(220,38,38,0.15)',  border: 'rgba(220,38,38,0.35)',  text: '#fca5a5', glow: 'rgba(220,38,38,0.4)',  label: 'Red'   },
  amber: { bg: '#D97706', light: 'rgba(217,119,6,0.15)',  border: 'rgba(217,119,6,0.35)',  text: '#fcd34d', glow: 'rgba(217,119,6,0.4)',  label: 'Amber' },
  green: { bg: '#16A34A', light: 'rgba(22,163,74,0.15)',  border: 'rgba(22,163,74,0.35)',  text: '#86efac', glow: 'rgba(22,163,74,0.4)',  label: 'Green' },
};

export function RagDot({ status, size = 12 }) {
  const c = RAG[status] || RAG.green;
  return <span style={{ background: c.bg, width: size, height: size, borderRadius: '50%', display: 'inline-block', boxShadow: `0 0 6px ${c.glow}`, flexShrink: 0 }} />;
}

export function RagBadge({ status }) {
  const c = RAG[status] || RAG.green;
  return (
    <span style={{ background: c.light, border: `1px solid ${c.border}`, color: c.text, boxShadow: `0 0 8px ${c.glow}33` }}
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold">
      <RagDot status={status} size={8} />{c.label}
    </span>
  );
}

export function RagSelect({ value, onChange }) {
  const c = RAG[value] || RAG.green;
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="text-xs font-bold rounded-lg px-2 py-1 cursor-pointer outline-none"
      style={{ background: c.light, border: `1px solid ${c.border}`, color: c.text, minWidth: 90 }}>
      <option value="green">🟢 Green</option>
      <option value="amber">🟡 Amber</option>
      <option value="red">🔴 Red</option>
    </select>
  );
}

export function MeasureSelect({ value, onChange }) {
  const cfgs = {
    active:   { bg: 'rgba(22,163,74,0.2)',   border: 'rgba(22,163,74,0.4)',   color: '#86efac' },
    planned:  { bg: 'rgba(217,119,6,0.2)',   border: 'rgba(217,119,6,0.4)',   color: '#fcd34d' },
    inactive: { bg: 'rgba(100,116,139,0.15)',border: 'rgba(100,116,139,0.3)', color: '#64748b' },
  };
  const c = cfgs[value] || cfgs.inactive;
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="text-xs font-medium rounded-lg px-2 py-1 cursor-pointer outline-none"
      style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.color, minWidth: 100 }}>
      <option value="active">✅ Active</option>
      <option value="planned">📋 Planned</option>
      <option value="inactive">⬜ Inactive</option>
    </select>
  );
}

export function WeekSelector({ kpiHistory, selectedWeekIdx, setSelectedWeekIdx }) {
  const w = kpiHistory[selectedWeekIdx];
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-slate-400 font-medium">Week:</span>
      <select
        value={selectedWeekIdx}
        onChange={e => setSelectedWeekIdx(Number(e.target.value))}
        className="text-xs font-semibold rounded-lg px-3 py-1.5 cursor-pointer outline-none"
        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', minWidth: 200 }}>
        {kpiHistory.map((wk, i) => (
          <option key={wk.week} value={i}>
            {wk.week} · {wk.date} · {wk.label} {wk.status === 'forecast' ? '(Forecast)' : '(Actual)'}
          </option>
        ))}
      </select>
      {w && (
        <span style={w.status === 'forecast'
          ? { background: 'rgba(217,119,6,0.15)', border: '1px solid rgba(217,119,6,0.3)', color: '#fcd34d' }
          : { background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(22,163,74,0.3)', color: '#86efac' }}
          className="px-2.5 py-1 rounded-full text-xs font-semibold">
          {w.status === 'forecast' ? '📋 Forecast' : '✅ Actual'}
        </span>
      )}
      <div className="flex items-center gap-1">
        <button onClick={() => setSelectedWeekIdx(i => Math.max(0, i - 1))}
          disabled={selectedWeekIdx === 0}
          className="w-7 h-7 rounded-lg text-xs text-slate-300 disabled:opacity-30 hover:text-white"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>‹</button>
        <button onClick={() => setSelectedWeekIdx(i => Math.min(kpiHistory.length - 1, i + 1))}
          disabled={selectedWeekIdx === kpiHistory.length - 1}
          className="w-7 h-7 rounded-lg text-xs text-slate-300 disabled:opacity-30 hover:text-white"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>›</button>
      </div>
    </div>
  );
}

// Glass card components
export function GlassCard({ children, className = '', style = {} }) {
  return (
    <div className={`rounded-2xl ${className}`} style={{
      background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.09)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', ...style,
    }}>{children}</div>
  );
}

export function Card({ children, className = '', style = {} }) {
  return (
    <div className={`rounded-xl ${className}`} style={{
      background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', ...style,
    }}>{children}</div>
  );
}

export function SectionCard({ title, children, className = '', headerRight = null }) {
  return (
    <Card className={className}>
      {title && (
        <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-widest">{title}</h2>
          {headerRight}
        </div>
      )}
      <div className="p-5">{children}</div>
    </Card>
  );
}

export function MeasureBadge({ status }) {
  const cfg = {
    active:   { bg: 'rgba(22,163,74,0.2)',   border: 'rgba(22,163,74,0.4)',   color: '#86efac', label: '✅ Active'   },
    planned:  { bg: 'rgba(217,119,6,0.2)',   border: 'rgba(217,119,6,0.4)',   color: '#fcd34d', label: '📋 Planned'  },
    inactive: { bg: 'rgba(100,116,139,0.12)',border: 'rgba(100,116,139,0.25)', color: '#475569', label: '⬜ Inactive' },
  };
  const c = cfg[status] || cfg.inactive;
  return <span className="inline-block px-2 py-0.5 rounded-md text-xs font-medium" style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.color }}>{c.label}</span>;
}

export function TrendIcon({ trend }) {
  if (trend === 'improving') return <span style={{ color: '#86efac', fontWeight: 700 }}>↑</span>;
  if (trend === 'worsening') return <span style={{ color: '#fca5a5', fontWeight: 700 }}>↓</span>;
  return <span style={{ color: '#fcd34d', fontWeight: 700 }}>→</span>;
}

// ── Helper functions ──────────────────────────────────────────

export function plantRag(kpiData, plantId) {
  const v = Object.values(kpiData?.[plantId] || {});
  if (v.includes('red')) return 'red';
  if (v.includes('amber')) return 'amber';
  return 'green';
}

export function countRag(kpiData, plantId, color) {
  return Object.values(kpiData?.[plantId] || {}).filter(v => v === color).length;
}

export function severityScore(kpiData, plants, kpis) {
  const max = plants.length * kpis.length * 3;
  let score = 0;
  for (const p of plants) for (const k of kpis) {
    const v = (kpiData?.[p.id] || {})[k.id];
    if (v === 'red') score += 3; else if (v === 'amber') score += 1;
  }
  return Math.round((score / max) * 100);
}

export function operationRag(kpiData, plants) {
  for (const p of plants) { if (plantRag(kpiData, p.id) === 'red') return 'red'; }
  for (const p of plants) { if (plantRag(kpiData, p.id) === 'amber') return 'amber'; }
  return 'green';
}

export function topRisk(kpiData, kpis, plantId) {
  const d = kpiData?.[plantId] || {};
  for (const k of kpis) { if (d[k.id] === 'red') return k.short; }
  for (const k of kpis) { if (d[k.id] === 'amber') return k.short; }
  return 'None';
}

export function weekTrend(curKpi, prevKpi, plants, kpis) {
  if (!prevKpi) return 'stable';
  const cur  = severityScore(curKpi,  plants, kpis);
  const prev = severityScore(prevKpi, plants, kpis);
  if (cur > prev + 2) return 'worsening';
  if (cur < prev - 2) return 'improving';
  return 'stable';
}
