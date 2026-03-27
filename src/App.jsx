import { useState } from 'react';
import {
  PLANTS, KPIS, MEASURES,
  INITIAL_KPI_HISTORY, CURRENT_WEEK_IDX,
  COUNTRY_INFO, NEWS_BY_COUNTRY,
  CRISIS_START, CRISIS_TITLE,
} from './data/initialData';

import OverviewPage      from './pages/OverviewPage';
import PlantDetailPage   from './pages/PlantDetailPage';
import KPITrackerPage    from './pages/KPITrackerPage';
import MeasuresPage      from './pages/MeasuresPage';
import NewsPage          from './pages/NewsPage';
import './index.css';

const PAGES = [
  { id: 'overview',  label: 'Overview',         icon: '📊' },
  { id: 'plants',    label: 'Plant Details',     icon: '🏭' },
  { id: 'kpi',       label: 'KPI Tracker',       icon: '📈' },
  { id: 'measures',  label: 'Measures',          icon: '🛡️'  },
  { id: 'news',      label: 'News',              icon: '📰' },
];

export default function App() {
  const [activePage,      setActivePage]      = useState('overview');
  const [kpiHistory,      setKpiHistory]      = useState(INITIAL_KPI_HISTORY);
  const [selectedWeekIdx, setSelectedWeekIdx] = useState(CURRENT_WEEK_IDX);

  // ── Update helpers (edit selected week in history) ────────────
  const updateKpi = (plantId, kpiId, value) =>
    setKpiHistory(h => h.map((w, i) =>
      i !== selectedWeekIdx ? w : {
        ...w,
        kpiData: { ...w.kpiData, [plantId]: { ...w.kpiData[plantId], [kpiId]: value } },
      }
    ));

  const updateMeasure = (plantId, measureId, value) =>
    setKpiHistory(h => h.map((w, i) =>
      i !== selectedWeekIdx ? w : {
        ...w,
        measuresData: { ...w.measuresData, [plantId]: { ...w.measuresData[plantId], [measureId]: value } },
      }
    ));

  const updateNote = (plantId, note) =>
    setKpiHistory(h => h.map((w, i) =>
      i !== selectedWeekIdx ? w : {
        ...w,
        plantNotes: { ...w.plantNotes, [plantId]: note },
      }
    ));

  const updateOverallNotes = (note) =>
    setKpiHistory(h => h.map((w, i) =>
      i !== selectedWeekIdx ? w : { ...w, overallNotes: note }
    ));

  const selectedWeek = kpiHistory[selectedWeekIdx];
  const prevWeek     = selectedWeekIdx > 0 ? kpiHistory[selectedWeekIdx - 1] : null;

  const sharedProps = {
    plants: PLANTS, kpis: KPIS, measures: MEASURES,
    kpiHistory, selectedWeek, prevWeek,
    selectedWeekIdx, setSelectedWeekIdx,
    updateKpi, updateMeasure, updateNote, updateOverallNotes,
    countryInfo: COUNTRY_INFO,
    newsByCountry: NEWS_BY_COUNTRY,
    crisisStart: CRISIS_START,
    crisisTitle: CRISIS_TITLE,
    navigate: setActivePage,
  };

  const renderPage = () => {
    switch (activePage) {
      case 'overview': return <OverviewPage    {...sharedProps} />;
      case 'plants':   return <PlantDetailPage {...sharedProps} />;
      case 'kpi':      return <KPITrackerPage  {...sharedProps} />;
      case 'measures': return <MeasuresPage    {...sharedProps} />;
      case 'news':     return <NewsPage        {...sharedProps} />;
      default:         return <OverviewPage    {...sharedProps} />;
    }
  };

  const crisisDays = Math.floor(
    (new Date(selectedWeek?.date || CRISIS_START) - new Date(CRISIS_START)) / 86400000
  ) + 1;

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(160deg, #0a0f1e 0%, #0d1f3c 45%, #0a0f1e 100%)',
    }}>
      {/* NAV */}
      <nav style={{
        background: 'rgba(10,15,30,0.9)',
        backdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }} className="sticky top-0 z-50">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex items-center justify-between h-14 gap-3">
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black"
                   style={{ background: 'linear-gradient(135deg,#DC2626,#7f1d1d)', boxShadow: '0 0 14px rgba(220,38,38,0.5)' }}>
                ⚠
              </div>
              <div className="hidden sm:block">
                <div className="text-white font-bold text-sm leading-tight tracking-wide">ASEAN ME Crisis</div>
                <div className="text-slate-500 text-xs">Hormuz Closure · Day {crisisDays}</div>
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              {PAGES.map(p => (
                <button key={p.id} onClick={() => setActivePage(p.id)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap"
                  style={activePage === p.id
                    ? { background: 'rgba(59,130,246,0.25)', border: '1px solid rgba(59,130,246,0.45)', color: '#93c5fd' }
                    : { background: 'transparent', border: '1px solid transparent', color: '#64748b' }}>
                  <span className="mr-1">{p.icon}</span>{p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* CRISIS ALERT BANNER */}
      <div style={{ background: 'rgba(220,38,38,0.12)', borderBottom: '1px solid rgba(220,38,38,0.18)' }}
           className="py-1.5 px-4 text-center text-xs text-red-300">
        🔴 <strong>CRISIS ACTIVE</strong> — {CRISIS_TITLE} — Crisis started: <strong>28 February 2026</strong>
        &nbsp;|&nbsp; Viewing: <strong>{selectedWeek?.week} · {selectedWeek?.label} · {selectedWeek?.date}</strong>
        &nbsp;|&nbsp;
        <span style={{ color: selectedWeek?.status === 'forecast' ? '#fcd34d' : '#86efac', fontWeight: 600 }}>
          {selectedWeek?.status === 'forecast' ? '📋 Forecast' : '✅ Actual'}
        </span>
      </div>

      <main className="max-w-screen-xl mx-auto px-4 py-6">
        {renderPage()}
      </main>

      <footer className="text-center text-xs text-slate-600 py-4 mt-2"
              style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        ASEAN ME Crisis Dashboard — Confidential Internal Use Only
      </footer>
    </div>
  );
}
