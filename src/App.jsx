import { useState } from 'react';
import {
  PLANTS, KPIS, MEASURES,
  INITIAL_KPI_DATA, INITIAL_MEASURES_DATA,
  INITIAL_PLANT_NOTES, INITIAL_PLANT_TRENDS,
  COUNTRY_INFO, INITIAL_UPDATE_HISTORY,
  INITIAL_KPI_HISTORY,
} from './data/initialData';

import SummaryPage from './pages/SummaryPage';
import PlantDetailPage from './pages/PlantDetailPage';
import CountryNewsPage from './pages/CountryNewsPage';
import KPITrackerPage from './pages/KPITrackerPage';
import MeasuresTrackerPage from './pages/MeasuresTrackerPage';
import WeeklyUpdatePage from './pages/WeeklyUpdatePage';
import HistoryPage from './pages/HistoryPage';
import './index.css';

const PAGES = [
  { id: 'summary',   label: 'Overview',        icon: '🌏' },
  { id: 'plants',    label: 'Plant Detail',     icon: '🏭' },
  { id: 'countries', label: 'Country News',     icon: '📰' },
  { id: 'kpi',       label: 'KPI Tracker',      icon: '📊' },
  { id: 'measures',  label: 'Measures',         icon: '🛡️' },
  { id: 'history',   label: 'History',          icon: '📈' },
  { id: 'update',    label: 'Weekly Update',    icon: '✏️' },
];

const LAST_UPDATED = '27 March 2026, 08:00 SGT';
const NEXT_UPDATE  = '3 April 2026';

export default function App() {
  const [activePage,    setActivePage]    = useState('summary');
  const [kpiData,       setKpiData]       = useState(INITIAL_KPI_DATA);
  const [measuresData,  setMeasuresData]  = useState(INITIAL_MEASURES_DATA);
  const [plantNotes,    setPlantNotes]    = useState(INITIAL_PLANT_NOTES);
  const [plantTrends,   setPlantTrends]   = useState(INITIAL_PLANT_TRENDS);
  const [updateHistory, setUpdateHistory] = useState(INITIAL_UPDATE_HISTORY);
  const [kpiHistory,    setKpiHistory]    = useState(INITIAL_KPI_HISTORY);
  const [countrynews,   setCountrynews]   = useState(
    Object.fromEntries(Object.entries(COUNTRY_INFO).map(([k, v]) => [k, v.news]))
  );

  const sharedProps = {
    plants: PLANTS, kpis: KPIS, measures: MEASURES,
    kpiData, setKpiData,
    measuresData, setMeasuresData,
    plantNotes, setPlantNotes,
    plantTrends, setPlantTrends,
    updateHistory, setUpdateHistory,
    kpiHistory, setKpiHistory,
    countryInfo: COUNTRY_INFO,
    countrynews, setCountrynews,
    lastUpdated: LAST_UPDATED,
    nextUpdate: NEXT_UPDATE,
    navigate: setActivePage,
  };

  const renderPage = () => {
    switch (activePage) {
      case 'summary':   return <SummaryPage         {...sharedProps} />;
      case 'plants':    return <PlantDetailPage      {...sharedProps} />;
      case 'countries': return <CountryNewsPage      {...sharedProps} />;
      case 'kpi':       return <KPITrackerPage       {...sharedProps} />;
      case 'measures':  return <MeasuresTrackerPage  {...sharedProps} />;
      case 'history':   return <HistoryPage          {...sharedProps} />;
      case 'update':    return <WeeklyUpdatePage     {...sharedProps} />;
      default:          return <SummaryPage          {...sharedProps} />;
    }
  };

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #0f172a 100%)',
    }}>
      {/* STICKY TOP NAV — glass style */}
      <nav style={{
        background: 'rgba(15,23,42,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }} className="sticky top-0 z-50">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex items-center justify-between h-14 gap-2">
            {/* Brand */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                   style={{ background: 'linear-gradient(135deg,#DC2626,#991b1b)', boxShadow:'0 0 12px rgba(220,38,38,0.5)' }}>
                ⚠
              </div>
              <div className="hidden sm:block">
                <div className="text-white font-bold text-sm leading-tight">ASEAN ME Crisis</div>
                <div className="text-slate-400 text-xs leading-tight">Strait of Hormuz Disruption</div>
              </div>
            </div>
            {/* Nav Links */}
            <div className="flex items-center gap-0.5 flex-wrap justify-end">
              {PAGES.map(p => (
                <button
                  key={p.id}
                  onClick={() => setActivePage(p.id)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap"
                  style={activePage === p.id ? {
                    background: 'rgba(59,130,246,0.3)',
                    border: '1px solid rgba(59,130,246,0.5)',
                    color: '#93c5fd',
                  } : {
                    background: 'transparent',
                    border: '1px solid transparent',
                    color: '#94a3b8',
                  }}
                >
                  <span className="mr-1">{p.icon}</span>{p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* LAST UPDATED BANNER */}
      <div style={{
        background: 'rgba(220,38,38,0.15)',
        borderBottom: '1px solid rgba(220,38,38,0.2)',
      }} className="text-xs py-1.5 px-4 text-center text-red-300">
        🔴 <strong>CRISIS ACTIVE</strong> &nbsp;|&nbsp; Last updated: <strong>{LAST_UPDATED}</strong>
        &nbsp;|&nbsp; Next update: <strong>{NEXT_UPDATE}</strong>
      </div>

      {/* PAGE CONTENT */}
      <main className="max-w-screen-xl mx-auto px-4 py-6">
        {renderPage()}
      </main>

      <footer className="text-center text-xs text-slate-500 py-4 mt-4"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        ASEAN ME Crisis Dashboard — Strait of Hormuz Disruption Response &nbsp;|&nbsp; Confidential — Internal Use Only
      </footer>
    </div>
  );
}
