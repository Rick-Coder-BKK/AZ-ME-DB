import { useState } from 'react';
import {
  PLANTS, KPIS, MEASURES,
  INITIAL_KPI_DATA, INITIAL_MEASURES_DATA,
  INITIAL_PLANT_NOTES, INITIAL_PLANT_TRENDS,
  COUNTRY_INFO, INITIAL_UPDATE_HISTORY,
} from './data/initialData';

import SummaryPage from './pages/SummaryPage';
import PlantDetailPage from './pages/PlantDetailPage';
import CountryNewsPage from './pages/CountryNewsPage';
import KPITrackerPage from './pages/KPITrackerPage';
import MeasuresTrackerPage from './pages/MeasuresTrackerPage';
import WeeklyUpdatePage from './pages/WeeklyUpdatePage';
import './index.css';

const PAGES = [
  { id: 'summary',   label: 'Overall Summary' },
  { id: 'plants',    label: 'Plant Detail' },
  { id: 'countries', label: 'Country News' },
  { id: 'kpi',       label: 'KPI Tracker' },
  { id: 'measures',  label: 'Measures Tracker' },
  { id: 'update',    label: 'Weekly Update' },
];

const LAST_UPDATED = '27 March 2026, 08:00 SGT';
const NEXT_UPDATE  = '3 April 2026';

export default function App() {
  const [activePage,   setActivePage]   = useState('summary');
  const [kpiData,      setKpiData]      = useState(INITIAL_KPI_DATA);
  const [measuresData, setMeasuresData] = useState(INITIAL_MEASURES_DATA);
  const [plantNotes,   setPlantNotes]   = useState(INITIAL_PLANT_NOTES);
  const [plantTrends,  setPlantTrends]  = useState(INITIAL_PLANT_TRENDS);
  const [updateHistory, setUpdateHistory] = useState(INITIAL_UPDATE_HISTORY);
  const [countrynews, setCountrynews]   = useState(
    Object.fromEntries(Object.entries(COUNTRY_INFO).map(([k, v]) => [k, v.news]))
  );

  const sharedProps = {
    plants: PLANTS, kpis: KPIS, measures: MEASURES,
    kpiData, setKpiData,
    measuresData, setMeasuresData,
    plantNotes, setPlantNotes,
    plantTrends, setPlantTrends,
    updateHistory, setUpdateHistory,
    countryInfo: COUNTRY_INFO,
    countrynews, setCountrynews,
    lastUpdated: LAST_UPDATED,
    nextUpdate: NEXT_UPDATE,
    navigate: setActivePage,
  };

  const renderPage = () => {
    switch (activePage) {
      case 'summary':   return <SummaryPage        {...sharedProps} />;
      case 'plants':    return <PlantDetailPage    {...sharedProps} />;
      case 'countries': return <CountryNewsPage    {...sharedProps} />;
      case 'kpi':       return <KPITrackerPage     {...sharedProps} />;
      case 'measures':  return <MeasuresTrackerPage {...sharedProps} />;
      case 'update':    return <WeeklyUpdatePage   {...sharedProps} />;
      default:          return <SummaryPage        {...sharedProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* STICKY TOP NAV */}
      <nav style={{ background: '#0f172a' }} className="sticky top-0 z-50 shadow-lg">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex items-center justify-between h-14 gap-2">
            {/* Brand */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-7 h-7 rounded flex items-center justify-center text-white font-bold text-xs"
                   style={{ background: '#DC2626' }}>
                ⚠
              </div>
              <span className="text-white font-semibold text-sm tracking-wide whitespace-nowrap">
                ASEAN ME Crisis Dashboard
              </span>
            </div>
            {/* Nav Links */}
            <div className="flex items-center gap-0.5 flex-wrap justify-end">
              {PAGES.map(p => (
                <button
                  key={p.id}
                  onClick={() => setActivePage(p.id)}
                  className={`px-2.5 py-1.5 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                    activePage === p.id
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* LAST UPDATED BANNER */}
      <div className="bg-slate-700 text-slate-200 text-xs py-1 px-4 text-center">
        Last updated: <strong>{LAST_UPDATED}</strong> &nbsp;|&nbsp; Next expected update: <strong>{NEXT_UPDATE}</strong>
      </div>

      {/* PAGE CONTENT */}
      <main className="max-w-screen-xl mx-auto px-4 py-6">
        {renderPage()}
      </main>

      {/* FOOTER */}
      <footer className="text-center text-xs text-slate-400 py-4 border-t border-slate-200 bg-white mt-4">
        ASEAN ME Crisis Dashboard — Strait of Hormuz Disruption Response &nbsp;|&nbsp; Confidential — Internal Use Only
      </footer>
    </div>
  );
}
