// Shared UI components — glass/iOS design system

export const RAG_COLORS = {
  red:   { bg: '#DC2626', light: 'rgba(220,38,38,0.15)',  border: 'rgba(220,38,38,0.3)',  text: '#fca5a5', label: 'Red'   },
  amber: { bg: '#D97706', light: 'rgba(217,119,6,0.15)',  border: 'rgba(217,119,6,0.3)',  text: '#fcd34d', label: 'Amber' },
  green: { bg: '#16A34A', light: 'rgba(22,163,74,0.15)',  border: 'rgba(22,163,74,0.3)',  text: '#86efac', label: 'Green' },
};

export function RagDot({ status, size = 'md' }) {
  const c = RAG_COLORS[status] || RAG_COLORS.green;
  const sz = size === 'sm' ? 8 : size === 'lg' ? 18 : 12;
  return (
    <span style={{
      background: c.bg,
      width: sz, height: sz,
      borderRadius: '50%',
      display: 'inline-block',
      boxShadow: `0 0 6px ${c.bg}88`,
      flexShrink: 0,
    }} title={c.label} />
  );
}

export function RagBadge({ status }) {
  const c = RAG_COLORS[status] || RAG_COLORS.green;
  const labels = { red: 'RED', amber: 'AMBER', green: 'GREEN' };
  return (
    <span style={{
      background: c.light,
      border: `1px solid ${c.border}`,
      color: c.text,
      boxShadow: `0 0 8px ${c.bg}22`,
    }} className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold">
      <RagDot status={status} size="sm" />
      {labels[status] || 'N/A'}
    </span>
  );
}

export function RagSelect({ value, onChange, className = '' }) {
  const c = RAG_COLORS[value] || RAG_COLORS.green;
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`text-xs font-semibold rounded-lg px-2 py-1 border cursor-pointer outline-none ${className}`}
      style={{
        background: c.light,
        border: `1px solid ${c.border}`,
        color: c.text,
      }}
    >
      <option value="green">🟢 Green</option>
      <option value="amber">🟡 Amber</option>
      <option value="red">🔴 Red</option>
    </select>
  );
}

export function MeasureSelect({ value, onChange, className = '' }) {
  const cfgs = {
    active:   { bg: 'rgba(22,163,74,0.15)',  border: 'rgba(22,163,74,0.3)',  color: '#86efac' },
    planned:  { bg: 'rgba(217,119,6,0.15)',  border: 'rgba(217,119,6,0.3)',  color: '#fcd34d' },
    inactive: { bg: 'rgba(100,116,139,0.15)',border: 'rgba(100,116,139,0.3)',color: '#94a3b8' },
  };
  const c = cfgs[value] || cfgs.inactive;
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`text-xs font-medium rounded-lg px-2 py-1 border cursor-pointer outline-none ${className}`}
      style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.color }}
    >
      <option value="active">✅ Active</option>
      <option value="planned">📋 Planned</option>
      <option value="inactive">⬜ Inactive</option>
    </select>
  );
}

// Glass card component
export function GlassCard({ children, className = '', style = {} }) {
  return (
    <div className={`rounded-2xl ${className}`} style={{
      background: 'rgba(255,255,255,0.05)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      ...style,
    }}>
      {children}
    </div>
  );
}

// Light glass card for content areas
export function Card({ children, className = '', style = {} }) {
  return (
    <div className={`rounded-xl ${className}`} style={{
      background: 'rgba(255,255,255,0.07)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
      ...style,
    }}>
      {children}
    </div>
  );
}

export function SectionCard({ title, children, className = '', headerRight = null }) {
  return (
    <Card className={className}>
      {title && (
        <div className="flex items-center justify-between px-5 py-3"
             style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-widest">{title}</h2>
          {headerRight}
        </div>
      )}
      <div className="p-5">{children}</div>
    </Card>
  );
}

export function TrendIcon({ trend }) {
  if (trend === 'improving') return <span style={{ color: '#86efac' }} className="font-bold text-lg">↑</span>;
  if (trend === 'worsening') return <span style={{ color: '#fca5a5' }} className="font-bold text-lg">↓</span>;
  return <span style={{ color: '#fcd34d' }} className="font-bold text-lg">→</span>;
}

export function MeasureStatusBadge({ status }) {
  const cfg = {
    active:   { bg: 'rgba(22,163,74,0.2)',   border: 'rgba(22,163,74,0.4)',   color: '#86efac', label: 'Active'   },
    planned:  { bg: 'rgba(217,119,6,0.2)',   border: 'rgba(217,119,6,0.4)',   color: '#fcd34d', label: 'Planned'  },
    inactive: { bg: 'rgba(100,116,139,0.15)',border: 'rgba(100,116,139,0.3)', color: '#64748b', label: 'Inactive' },
  };
  const c = cfg[status] || cfg.inactive;
  return (
    <span className="inline-block px-2 py-0.5 rounded-md text-xs font-medium"
          style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.color }}>
      {c.label}
    </span>
  );
}

// ── Helper functions ──────────────────────────────────────────

export function plantOverallRag(kpiData, plantId) {
  const vals = Object.values(kpiData[plantId] || {});
  if (vals.includes('red')) return 'red';
  if (vals.includes('amber')) return 'amber';
  return 'green';
}

export function countRedKpis(kpiData, plantId) {
  return Object.values(kpiData[plantId] || {}).filter(v => v === 'red').length;
}

export function countAmberKpis(kpiData, plantId) {
  return Object.values(kpiData[plantId] || {}).filter(v => v === 'amber').length;
}

export function topRisk(kpiData, kpis, plantId) {
  const plant = kpiData[plantId] || {};
  for (const kpi of kpis) { if (plant[kpi.id] === 'red')   return kpi.short; }
  for (const kpi of kpis) { if (plant[kpi.id] === 'amber') return kpi.short; }
  return 'None';
}

export function computeSeverityIndex(kpiData, plants, kpis) {
  const maxScore = plants.length * kpis.length * 3;
  let score = 0;
  for (const plant of plants) {
    for (const kpi of kpis) {
      const v = (kpiData[plant.id] || {})[kpi.id];
      if (v === 'red') score += 3;
      else if (v === 'amber') score += 1;
    }
  }
  return Math.round((score / maxScore) * 100);
}

export function overallOperationRag(kpiData, plants) {
  for (const p of plants) { if (plantOverallRag(kpiData, p.id) === 'red')   return 'red'; }
  for (const p of plants) { if (plantOverallRag(kpiData, p.id) === 'amber') return 'amber'; }
  return 'green';
}
