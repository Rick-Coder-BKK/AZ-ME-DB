// ============================================================
// ASEAN ME Crisis Dashboard — Data Layer
// Crisis start: 28 February 2026 — Strait of Hormuz closure
// ============================================================

export const CRISIS_START = '2026-02-28';
export const CRISIS_TITLE = 'Strait of Hormuz Closure — US Strike on Iran';

export const PLANTS = [
  { id: 'AmaP', name: 'AmaP', country: 'TH', flag: '🇹🇭', countryName: 'Thailand' },
  { id: 'HmjP', name: 'HmjP', country: 'TH', flag: '🇹🇭', countryName: 'Thailand' },
  { id: 'PgP1', name: 'PgP1', country: 'MY', flag: '🇲🇾', countryName: 'Malaysia' },
  { id: 'PgP2', name: 'PgP2', country: 'MY', flag: '🇲🇾', countryName: 'Malaysia' },
  { id: 'PgP5', name: 'PgP5', country: 'MY', flag: '🇲🇾', countryName: 'Malaysia' },
  { id: 'HcP',  name: 'HcP',  country: 'VN', flag: '🇻🇳', countryName: 'Vietnam'   },
  { id: 'RBID', name: 'RBID', country: 'ID', flag: '🇮🇩', countryName: 'Indonesia' },
];

// ── TOP 10 KPIs ──────────────────────────────────────────────
export const KPIS = [
  { id: 'rawMaterial',          label: 'Raw Material Availability', short: 'Raw Materials',
    description: '% of required raw materials in stock or confirmed inbound',
    red: '< 2 weeks supply', amber: '2–4 weeks supply', green: '> 4 weeks supply' },
  { id: 'logisticsCosts',       label: 'Logistics Costs',           short: 'Logistics Cost',
    description: 'Freight cost index vs pre-crisis baseline',
    red: '> 50% increase', amber: '20–50% increase', green: '< 20% increase' },
  { id: 'logisticsLeadTime',    label: 'Logistics Lead Times',      short: 'Lead Times',
    description: 'Inbound shipment delays vs normal schedule',
    red: '> 3 weeks delay', amber: '1–3 weeks delay', green: '< 1 week delay' },
  { id: 'customerImpact',       label: 'Customer Impact',           short: 'Customer Impact',
    description: 'Are customers experiencing delays or supply shortages?',
    red: 'Confirmed delays', amber: 'Risk of impact', green: 'No impact' },
  { id: 'energySupply',         label: 'Energy Supply Reliability', short: 'Energy Supply',
    description: 'Stability of grid power and fuel for on-site generation',
    red: 'Outages occurring', amber: 'Risk of outage', green: 'Stable' },
  { id: 'fuelDiesel',           label: 'Fuel / Diesel Availability', short: 'Fuel/Diesel',
    description: 'For generators, logistics vehicles, and company transport',
    red: 'Critically low', amber: 'Limited', green: 'Adequate' },
  { id: 'portCustoms',          label: 'Port & Customs Operations', short: 'Port & Customs',
    description: 'Are nearby ports operating normally?',
    red: 'Significant disruption', amber: 'Delays reported', green: 'Normal' },
  { id: 'fxRisk',               label: 'FX / Currency Risk',        short: 'FX Risk',
    description: 'Local currency depreciation impacting USD import costs',
    red: '> 10% depreciation', amber: '5–10%', green: '< 5%' },
  { id: 'supplierReliability',  label: 'Supplier Reliability',      short: 'Suppliers',
    description: 'Are key suppliers confirming delivery commitments?',
    red: 'Unable to commit', amber: 'Uncertain', green: 'Confirmed' },
  { id: 'productionContinuity', label: 'Production Continuity Risk', short: 'Production',
    description: 'Overall risk of having to reduce or halt production',
    red: 'Production at risk', amber: 'Contingency needed', green: 'Stable' },
];

// ── TOP 10 MEASURES ──────────────────────────────────────────
export const MEASURES = [
  { id: 'crisisTeam',           label: 'Crisis Response Team',
    description: 'Formal crisis management team meeting regularly; escalation paths defined' },
  { id: 'bufferStock',          label: 'Buffer Stock Build-up',
    description: 'Increasing raw material inventory to cover 4–8 weeks of production' },
  { id: 'customerComms',        label: 'Customer Communication Plan',
    description: 'Proactive communication to customers about delays and revised lead times' },
  { id: 'fuelHoarding',         label: 'Fuel/Diesel Stockpiling',
    description: 'Stockpiling diesel for backup generators; tracking autonomous operation days' },
  { id: 'altSupplier',          label: 'Alternative Supplier Activation',
    description: 'Qualifying suppliers outside the Hormuz-dependent supply chain' },
  { id: 'routeDiversification', label: 'Logistics Route Diversification',
    description: 'Switching to air freight or Cape of Good Hope sea route alternatives' },
  { id: 'fxHedging',            label: 'FX Hedging',
    description: 'Forward contracts protecting against local currency depreciation on USD imports' },
  { id: 'energyHedging',        label: 'Energy Hedging / Reduction',
    description: 'Reducing non-critical energy use; fixed-price contracts; solar backup' },
  { id: 'productionPriority',   label: 'Production Prioritization',
    description: 'Prioritising highest-margin or most critical orders if capacity must reduce' },
  { id: 'shuttleBus',           label: 'Shuttle Bus / Staff Transport',
    description: 'Company shuttle services to maintain workforce access despite fuel costs' },
];

// ── DATA GENERATION ───────────────────────────────────────────
// Severity levels: 0=stable 1=emerging 2=elevated 3=serious 4=critical
//                  W1  W2  W3  W4  W5  W6  W7  W8  W9  W10 W11 W12 W13 W14 W15 W16 W17
const SEV = {
  RBID: [0,  1,  3,  4,  4,  4,  4,  3,  3,  2,  2,  1,  1,  1,  0,  0,  0],
  PgP1: [0,  1,  2,  3,  4,  4,  3,  3,  2,  1,  1,  1,  0,  0,  0,  0,  0],
  PgP2: [0,  0,  2,  3,  3,  4,  3,  2,  2,  1,  1,  0,  0,  0,  0,  0,  0],
  PgP5: [0,  0,  1,  2,  3,  3,  3,  2,  1,  1,  0,  0,  0,  0,  0,  0,  0],
  AmaP: [0,  0,  1,  2,  2,  2,  2,  1,  1,  0,  0,  0,  0,  0,  0,  0,  0],
  HmjP: [0,  0,  0,  1,  2,  2,  1,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0],
  HcP:  [0,  0,  0,  1,  1,  1,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
};

const KPI_LEVELS = [
  // 0 — Stable
  { rawMaterial:'green', logisticsCosts:'green', logisticsLeadTime:'green', customerImpact:'green',
    energySupply:'green', fuelDiesel:'green', portCustoms:'green', fxRisk:'green',
    supplierReliability:'green', productionContinuity:'green' },
  // 1 — Emerging
  { rawMaterial:'amber', logisticsCosts:'amber', logisticsLeadTime:'green', customerImpact:'green',
    energySupply:'green', fuelDiesel:'amber', portCustoms:'green', fxRisk:'amber',
    supplierReliability:'amber', productionContinuity:'green' },
  // 2 — Elevated
  { rawMaterial:'amber', logisticsCosts:'amber', logisticsLeadTime:'amber', customerImpact:'amber',
    energySupply:'amber', fuelDiesel:'amber', portCustoms:'amber', fxRisk:'amber',
    supplierReliability:'amber', productionContinuity:'amber' },
  // 3 — Serious
  { rawMaterial:'red',   logisticsCosts:'red',   logisticsLeadTime:'amber', customerImpact:'amber',
    energySupply:'amber', fuelDiesel:'red',   portCustoms:'amber', fxRisk:'amber',
    supplierReliability:'amber', productionContinuity:'amber' },
  // 4 — Critical
  { rawMaterial:'red',   logisticsCosts:'red',   logisticsLeadTime:'red',   customerImpact:'amber',
    energySupply:'red',   fuelDiesel:'red',   portCustoms:'red',   fxRisk:'red',
    supplierReliability:'red',   productionContinuity:'red' },
];

function kpisForPlant(plantId, level) {
  const k = { ...KPI_LEVELS[level] };
  // Plant-specific overrides
  if (plantId === 'RBID') {
    if (level >= 2) { k.energySupply = 'red'; k.portCustoms = 'red'; }
    if (level >= 3) { k.customerImpact = 'red'; }
  }
  if (plantId === 'PgP1') {
    if (level >= 3) { k.supplierReliability = 'red'; k.productionContinuity = 'red'; }
  }
  if (plantId === 'PgP2') {
    if (level >= 3) { k.portCustoms = 'red'; }
  }
  if (plantId === 'HcP') {
    if (level <= 2) k.energySupply = 'green';
    if (level <= 1) k.portCustoms = 'green';
  }
  return k;
}

const MEASURE_LEVELS = [
  // 0
  { crisisTeam:'inactive', bufferStock:'inactive', customerComms:'inactive', fuelHoarding:'inactive',
    altSupplier:'inactive', routeDiversification:'inactive', fxHedging:'inactive',
    energyHedging:'inactive', productionPriority:'inactive', shuttleBus:'inactive' },
  // 1
  { crisisTeam:'active',   bufferStock:'planned',  customerComms:'active',   fuelHoarding:'inactive',
    altSupplier:'inactive', routeDiversification:'inactive', fxHedging:'planned',
    energyHedging:'inactive', productionPriority:'inactive', shuttleBus:'inactive' },
  // 2
  { crisisTeam:'active',   bufferStock:'active',   customerComms:'active',   fuelHoarding:'planned',
    altSupplier:'planned',  routeDiversification:'planned',  fxHedging:'active',
    energyHedging:'planned', productionPriority:'inactive', shuttleBus:'inactive' },
  // 3
  { crisisTeam:'active',   bufferStock:'active',   customerComms:'active',   fuelHoarding:'active',
    altSupplier:'active',   routeDiversification:'planned',  fxHedging:'active',
    energyHedging:'active',  productionPriority:'planned',  shuttleBus:'active' },
  // 4
  { crisisTeam:'active',   bufferStock:'active',   customerComms:'active',   fuelHoarding:'active',
    altSupplier:'active',   routeDiversification:'active',   fxHedging:'active',
    energyHedging:'active',  productionPriority:'active',   shuttleBus:'active' },
];

function measuresForPlant(plantId, level, prevLevel) {
  const m = { ...MEASURE_LEVELS[level] };
  // During recovery keep buffer and alt-supplier active longer
  if (prevLevel !== undefined && prevLevel > level && level >= 1) {
    m.bufferStock = 'active';
    if (level >= 1) m.altSupplier = m.altSupplier === 'inactive' ? 'planned' : m.altSupplier;
  }
  return m;
}

const PLANT_NOTE_LEVELS = {
  0: 'Situation stable. No immediate production risk. Continuing to monitor developments.',
  1: 'Early disruption signals detected. Monitoring logistics costs and supplier commitments closely.',
  2: 'Elevated risk across multiple KPIs. Pre-emptive measures being activated. Crisis team briefed.',
  3: 'Serious disruption impacting operations. Multiple measures active. Daily crisis team calls.',
  4: 'CRITICAL: Multiple KPIs at red. Crisis team activated daily. Contingency plans being executed.',
};

const PLANT_NOTES_BY_PLANT = {
  AmaP:  ['', '', 'Local supplier contracts under review.', 'Freight costs up 42%. Monitoring daily.', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  HmjP:  ['', '', '', 'Buffer stock review initiated.', 'Shuttle bus for night shifts activated.', '', '', '', '', '', '', '', '', '', '', '', ''],
  PgP1:  ['', 'Alternative supplier short-list being prepared.', '', 'CRITICAL: Stock at 1.5 weeks. Alt-supplier activated.', 'Emergency procurement underway. CEO informed.', '', 'Alt supplier delivering. Situation stabilising.', '', '', '', '', '', '', '', '', '', ''],
  PgP2:  ['', '', '', 'Port Klang delays: 11-day dwell time.', 'Rerouting via Penang port approved.', '', '', '', '', '', '', '', '', '', '', '', ''],
  PgP5:  ['', '', 'Supplier confirmation outstanding.', '', 'Alt supplier contract signed.', '', '', '', '', '', '', '', '', '', '', '', ''],
  HcP:   ['', '', '', 'Minor logistics cost increase. No production risk.', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  RBID:  ['', 'Pertamina supply shortfall flagged.', 'Energy grid unstable. Generator fuel pre-ordered.', 'CRITICAL: 8 KPIs at red. Partial shutdown contingency drafted.', 'Shutdown avoided. Fuel emergency supply secured.', 'Situation at maximum pressure. Board informed.', '', 'First improvement signs. Alt routes delivering.', '', '', '', '', '', '', '', '', ''],
};

// ── WEEK DEFINITIONS ──────────────────────────────────────────
const WEEKS_META = [
  { week:'W1',  date:'2026-02-28', label:'Crisis Onset',                      status:'actual'   },
  { week:'W2',  date:'2026-03-07', label:'Early Escalation',                  status:'actual'   },
  { week:'W3',  date:'2026-03-14', label:'Rapid Deterioration',                status:'actual'   },
  { week:'W4',  date:'2026-03-21', label:'Peak Concern',                       status:'actual'   },
  { week:'W5',  date:'2026-03-28', label:'Maximum Pressure',                   status:'forecast' },
  { week:'W6',  date:'2026-04-04', label:'Critical Phase',                     status:'forecast' },
  { week:'W7',  date:'2026-04-11', label:'Plateau',                            status:'forecast' },
  { week:'W8',  date:'2026-04-18', label:'First Stabilisation Signs',          status:'forecast' },
  { week:'W9',  date:'2026-04-25', label:'Alt Routes Established',             status:'forecast' },
  { week:'W10', date:'2026-05-02', label:'Gradual Recovery',                   status:'forecast' },
  { week:'W11', date:'2026-05-09', label:'Improving Conditions',               status:'forecast' },
  { week:'W12', date:'2026-05-16', label:'Continued Recovery',                 status:'forecast' },
  { week:'W13', date:'2026-05-23', label:'Near-Normal for Some Plants',        status:'forecast' },
  { week:'W14', date:'2026-05-30', label:'Sustained Improvement',              status:'forecast' },
  { week:'W15', date:'2026-06-06', label:'Crisis Winding Down',                status:'forecast' },
  { week:'W16', date:'2026-06-13', label:'Return to Amber',                    status:'forecast' },
  { week:'W17', date:'2026-06-20', label:'Near-Baseline Operations',           status:'forecast' },
];

function buildKpiHistory() {
  return WEEKS_META.map((meta, wi) => {
    const kpiData = {};
    const measuresData = {};
    const plantNotes = {};

    for (const plant of PLANTS) {
      const level = SEV[plant.id][wi] ?? 0;
      const prevLevel = wi > 0 ? (SEV[plant.id][wi - 1] ?? 0) : undefined;
      kpiData[plant.id] = kpisForPlant(plant.id, level);
      measuresData[plant.id] = measuresForPlant(plant.id, level, prevLevel);
      const noteOverride = (PLANT_NOTES_BY_PLANT[plant.id] || [])[wi];
      plantNotes[plant.id] = noteOverride || PLANT_NOTE_LEVELS[level] || '';
    }

    const overallNotes = {
      W1: 'Crisis declared 28 Feb 2026 following US military strike on Iran. Strait of Hormuz closed. All plants placed on monitoring. Crisis response teams briefed.',
      W2: 'Situation escalating. Freight rates rising sharply. RBID and PgP1 flagging early supply concerns. Emergency procurement discussions initiated.',
      W3: 'Significant deterioration across Indonesia and Malaysia plants. Alternative supplier qualification accelerated. Board informed.',
      W4: 'Most severe week to date. RBID at critical status. PgP1 emergency procurement underway. Alternative logistics routes being contracted.',
      W5: '(Forecast) Continued maximum pressure expected. Buffer stocks critical factor. Cape of Good Hope route deliveries begin.',
      W6: '(Forecast) Peak crisis week projected. All contingency plans active.',
      W7: '(Forecast) Situation beginning to plateau. Alternative supply chains delivering first volumes.',
      W8: '(Forecast) First stabilisation signals across Malaysia plants. Indonesia still under pressure.',
      W9: '(Forecast) Alternative routes fully established. Freight costs still elevated but stabilising.',
      W10: '(Forecast) Gradual KPI improvement across all plants. Buffer stocks rebuilt.',
      W11: '(Forecast) Thailand plants returning to near-normal operations.',
      W12: '(Forecast) Malaysia plants showing significant improvement.',
      W13: '(Forecast) Vietnam plant fully normalised. Indonesia continuing recovery.',
      W14: '(Forecast) Most plants at amber or better.',
      W15: '(Forecast) Crisis winding down. Final contingency measures being stood down.',
      W16: '(Forecast) Most plants returning to green. Crisis response team meeting weekly only.',
      W17: '(Forecast) Near-baseline operations across all plants. Crisis review initiated.',
    }[meta.week] || '';

    return { ...meta, kpiData, measuresData, plantNotes, overallNotes };
  });
}

export const INITIAL_KPI_HISTORY = buildKpiHistory();
export const CURRENT_WEEK_IDX = 3; // W4 = current actual week

// ── COUNTRY INFO ──────────────────────────────────────────────
export const COUNTRY_INFO = {
  TH: {
    name: 'Thailand', flag: '🇹🇭', hormuzDependency: '38%',
    strategicReserveDays: 90, exposureLevel: 'Moderate', exposureColor: 'amber',
    economicNotes: 'Thai Baht under moderate pressure (–4.2% vs USD). Port of Laem Chabang operating with minor delays. Inflation risk from fuel prices ~3–4%. Central bank monitoring closely.',
  },
  MY: {
    name: 'Malaysia', flag: '🇲🇾', hormuzDependency: '62%',
    strategicReserveDays: 45, exposureLevel: 'High', exposureColor: 'red',
    economicNotes: 'Ringgit under significant pressure (–7.1% vs USD). Petronas activating emergency procurement. Port Klang experiencing growing backlogs. Government reviewing fuel subsidy sustainability.',
  },
  VN: {
    name: 'Vietnam', flag: '🇻🇳', hormuzDependency: '22%',
    strategicReserveDays: 60, exposureLevel: 'Lower', exposureColor: 'green',
    economicNotes: 'Vietnam Dong relatively stable (–2.1% vs USD). Domestic coal and hydro reduce oil dependency. Ho Chi Minh City port operating normally. Best positioned of the four countries.',
  },
  ID: {
    name: 'Indonesia', flag: '🇮🇩', hormuzDependency: '71%',
    strategicReserveDays: 30, exposureLevel: 'Very High', exposureColor: 'red',
    economicNotes: 'Rupiah depreciating rapidly (–9.8% vs USD). Pertamina under critical supply pressure. Tanjung Priok severely congested. Emergency fuel rationing under active consideration.',
  },
};

// ── NEWS FEED ─────────────────────────────────────────────────
export const NEWS_BY_COUNTRY = {
  TH: [
    { title: 'Thailand Activates Strategic Petroleum Reserve Protocol', source: 'Bangkok Post', date: '2026-03-25', summary: 'The Thai Ministry of Energy activates the first phase of its strategic petroleum reserve protocol as Strait of Hormuz disruption enters its fourth week.', url: 'https://www.bangkokpost.com/business/general', category: 'Energy' },
    { title: 'Thai Baht Falls 4.2% Amid Oil Supply Concerns', source: 'Reuters', date: '2026-03-24', summary: "Thailand's currency weakened against the USD as investors reassess the country's exposure to Middle East oil disruptions. The BOT signals readiness to intervene.", url: 'https://www.reuters.com/markets/currencies/', category: 'FX' },
    { title: 'Thai Manufacturers Request Emergency Fuel Allocation', source: 'The Nation', date: '2026-03-23', summary: 'Federation of Thai Industries requests emergency fuel allocation and logistics subsidies as freight costs surge 35% above baseline across major supply chains.', url: 'https://www.nationthailand.com/business', category: 'Industry' },
    { title: 'Laem Chabang Port Reports Rising Transit Times', source: "Lloyd's List", date: '2026-03-22', summary: "Container transit times at Thailand's largest port increasing by 5–8 days as vessels reroute via Cape of Good Hope.", url: 'https://www.lloydslist.com/ll/sector/containers', category: 'Logistics' },
  ],
  MY: [
    { title: 'Petronas Activates Emergency Oil Supply Contingency', source: 'The Star', date: '2026-03-25', summary: "Malaysia's national oil company activates emergency procurement as Hormuz closure threatens domestic refinery inputs. Alternative supply routes via Cape of Good Hope being contracted.", url: 'https://www.thestar.com.my/business/business-news', category: 'Energy' },
    { title: 'Port Klang Backlogs Reach 11-Day Average Dwell Time', source: 'The Edge Malaysia', date: '2026-03-24', summary: 'Container dwell times at Port Klang increasing sharply as vessel rerouting creates growing backlogs. Shippers warned of 2–3 week delays.', url: 'https://theedgemalaysia.com/', category: 'Logistics' },
    { title: 'Ringgit at 6-Month Low — BNM Monitors Closely', source: 'Malay Mail', date: '2026-03-22', summary: "Bank Negara Malaysia signals readiness to deploy reserves as the ringgit falls to MYR 4.62/USD.", url: 'https://www.malaymail.com/money', category: 'FX' },
    { title: 'Malaysia Considers Emergency Import Duty Waivers', source: 'Bernama', date: '2026-03-21', summary: 'MITI in discussions to waive import duties on raw materials affected by the Hormuz supply disruption to cushion impact on the manufacturing sector.', url: 'https://www.bernama.com/en/business/', category: 'Policy' },
  ],
  VN: [
    { title: 'Vietnam Increases Coal Power Output to Offset Oil Risk', source: 'VnExpress International', date: '2026-03-24', summary: "Vietnam's EVN ramps up coal and hydro generation by 18% to reduce dependency on oil-fired plants, giving factories greater energy security.", url: 'https://e.vnexpress.net/news/business', category: 'Energy' },
    { title: 'Vietnam Manufacturers Report Limited Supply Chain Impact', source: 'Vietnam Investment Review', date: '2026-03-23', summary: 'Survey of 200+ manufacturers shows Vietnam less exposed than regional peers. Logistics cost increases averaging 18% — below the regional average of 38%.', url: 'https://vir.com.vn/news/industries.html', category: 'Industry' },
    { title: 'Ho Chi Minh City Port Maintains Normal Operations', source: 'Tuoi Tre News', date: '2026-03-21', summary: 'Port authorities confirm near-normal operations with freight cost increases of 12–15% so far. Advance vessel bookings up 40%.', url: 'https://tuoitrenews.vn/economy', category: 'Logistics' },
  ],
  ID: [
    { title: 'Indonesia Moves Toward Emergency Fuel Rationing', source: 'Jakarta Post', date: '2026-03-25', summary: 'Government in active discussions on emergency fuel rationing as Pertamina reports 34% shortfall in crude oil procurement.', url: 'https://www.thejakartapost.com/business', category: 'Energy' },
    { title: 'Rupiah at 9.8% Decline — Bank Indonesia Signals Intervention', source: 'Bloomberg', date: '2026-03-24', summary: "Indonesia's central bank signals readiness to intervene after the rupiah's rapid depreciation threatens an import cost spiral.", url: 'https://www.bloomberg.com/asia', category: 'FX' },
    { title: 'Tanjung Priok Port: 2–3 Week Container Backlogs', source: 'Bisnis Indonesia', date: '2026-03-23', summary: "Indonesia's largest port reports unprecedented backlogs as vessel diversions, fuel shortages, and reduced handling capacity combine.", url: 'https://ekonomi.bisnis.com/logistik', category: 'Logistics' },
    { title: 'IMF Warns of Emerging Economy Vulnerability', source: 'Reuters', date: '2026-03-22', summary: 'IMF issues warning that Indonesia faces compounding risks: currency depreciation, fuel shortages, and supply chain disruption simultaneously.', url: 'https://www.reuters.com/world/asia-pacific/', category: 'Macro' },
  ],
};
