// Shared UI components used across all pages

export const RAG_COLORS = {
  red:   { bg: '#DC2626', text: '#DC2626', label: 'Red',   ring: 'ring-red-500' },
  amber: { bg: '#D97706', text: '#D97706', label: 'Amber', ring: 'ring-amber-500' },
  green: { bg: '#16A34A', text: '#16A34A', label: 'Green', ring: 'ring-green-500' },
};

export function RagDot({ status, size = 'md' }) {
  const c = RAG_COLORS[status] || RAG_COLORS.green;
  const sz = size === 'sm' ? 10 : size === 'lg' ? 18 : 14;
  return (
    <span
      style={{ background: c.bg, width: sz, height: sz, borderRadius: '50%', display: 'inline-block' }}
      title={c.label}
    />
  );
}

export function RagBadge({ status }) {
  const c = RAG_COLORS[status] || RAG_COLORS.green;
  const labels = { red: 'RED', amber: 'AMBER', green: 'GREEN' };
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold text-white"
      style={{ background: c.bg }}
    >
      {labels[status] || 'N/A'}
    </span>
  );
}

// Compute plant overall RAG: worst of all KPIs
export function plantOverallRag(kpiData, plantId) {
  const vals = Object.values(kpiData[plantId] || {});
  if (vals.includes('red')) return 'red';
  if (vals.includes('amber')) return 'amber';
  return 'green';
}

// Compute number of red KPIs for a plant
export function countRedKpis(kpiData, plantId) {
  return Object.values(kpiData[plantId] || {}).filter(v => v === 'red').length;
}

// Compute top risk label for a plant
export function topRisk(kpiData, kpis, plantId) {
  const plant = kpiData[plantId] || {};
  for (const kpi of kpis) {
    if (plant[kpi.id] === 'red') return kpi.short;
  }
  for (const kpi of kpis) {
    if (plant[kpi.id] === 'amber') return kpi.short;
  }
  return 'None';
}

// Compute Crisis Severity Index (0–100), weighted: red=3, amber=1, green=0
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

// Aggregate overall operation RAG
export function overallOperationRag(kpiData, plants) {
  for (const plant of plants) {
    if (plantOverallRag(kpiData, plant.id) === 'red') return 'red';
  }
  for (const plant of plants) {
    if (plantOverallRag(kpiData, plant.id) === 'amber') return 'amber';
  }
  return 'green';
}

export function SectionCard({ title, children, className = '' }) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-slate-200 ${className}`}>
      {title && (
        <div className="px-5 py-3 border-b border-slate-200">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">{title}</h2>
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

export function TrendIcon({ trend }) {
  if (trend === 'improving') return <span className="text-green-600 font-bold text-lg">↑</span>;
  if (trend === 'worsening') return <span className="text-red-600 font-bold text-lg">↓</span>;
  return <span className="text-amber-500 font-bold text-lg">→</span>;
}

export function MeasureStatusBadge({ status }) {
  const cfg = {
    active:   { bg: 'bg-green-100 text-green-800 border-green-300', label: 'Active' },
    planned:  { bg: 'bg-amber-100 text-amber-800 border-amber-300', label: 'Planned' },
    inactive: { bg: 'bg-slate-100 text-slate-500 border-slate-200', label: 'Inactive' },
  };
  const { bg, label } = cfg[status] || cfg.inactive;
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs border font-medium ${bg}`}>{label}</span>
  );
}
