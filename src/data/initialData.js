// ============================================================
// ASEAN ME Crisis Dashboard — Initial Data
// ============================================================

export const PLANTS = [
  { id: 'AmaP',  name: 'AmaP',  country: 'TH', flag: '🇹🇭', countryName: 'Thailand' },
  { id: 'HmjP',  name: 'HmjP',  country: 'TH', flag: '🇹🇭', countryName: 'Thailand' },
  { id: 'PgP1',  name: 'PgP1',  country: 'MY', flag: '🇲🇾', countryName: 'Malaysia' },
  { id: 'PgP2',  name: 'PgP2',  country: 'MY', flag: '🇲🇾', countryName: 'Malaysia' },
  { id: 'PgP5',  name: 'PgP5',  country: 'MY', flag: '🇲🇾', countryName: 'Malaysia' },
  { id: 'HcP',   name: 'HcP',   country: 'VN', flag: '🇻🇳', countryName: 'Vietnam' },
  { id: 'RBID',  name: 'RBID',  country: 'ID', flag: '🇮🇩', countryName: 'Indonesia' },
];

export const KPIS = [
  { id: 'rawMaterial',          label: 'Raw Material Availability',    short: 'Raw Materials',
    description: '% of required raw materials in stock or confirmed inbound',
    red: '< 2 weeks supply', amber: '2–4 weeks supply', green: '> 4 weeks supply' },
  { id: 'logisticsCosts',       label: 'Logistics Costs',               short: 'Logistics Cost',
    description: 'Freight cost index vs pre-crisis baseline',
    red: '> 50% increase', amber: '20–50% increase', green: '< 20% increase' },
  { id: 'logisticsLeadTime',    label: 'Logistics Lead Times',          short: 'Lead Times',
    description: 'Inbound shipment delays vs normal',
    red: '> 3 weeks delay', amber: '1–3 weeks delay', green: '< 1 week delay' },
  { id: 'customerImpact',       label: 'Customer Impact',               short: 'Customer Impact',
    description: 'Are customers experiencing delays or supply shortages?',
    red: 'Confirmed delays', amber: 'Risk of impact', green: 'No impact' },
  { id: 'energySupply',         label: 'Energy Supply Reliability',     short: 'Energy Supply',
    description: 'Stability of grid power and fuel for on-site generation',
    red: 'Outages occurring', amber: 'Risk of outage', green: 'Stable' },
  { id: 'staffTransport',       label: 'Staff Transport Access',        short: 'Staff Transport',
    description: 'Can employees reach the plant?',
    red: 'Significant absenteeism', amber: 'Some difficulty', green: 'Normal' },
  { id: 'fuelDiesel',           label: 'Fuel / Diesel Availability',    short: 'Fuel/Diesel',
    description: 'For on-site generators, logistics, company vehicles',
    red: 'Critically low', amber: 'Limited', green: 'Adequate' },
  { id: 'portCustoms',          label: 'Port & Customs Operations',     short: 'Port & Customs',
    description: 'Are nearby ports operating normally?',
    red: 'Significant disruption', amber: 'Delays reported', green: 'Normal' },
  { id: 'fxRisk',               label: 'FX / Currency Risk',            short: 'FX Risk',
    description: 'Local currency depreciation impacting import costs',
    red: '> 10% depreciation', amber: '5–10% depreciation', green: '< 5% depreciation' },
  { id: 'supplierReliability',  label: 'Supplier Reliability',          short: 'Suppliers',
    description: 'Are key raw material suppliers confirming delivery?',
    red: 'Unable to commit', amber: 'Uncertain', green: 'Confirmed' },
  { id: 'productionContinuity', label: 'Production Continuity Risk',    short: 'Production',
    description: 'Overall risk of having to reduce or halt production',
    red: 'Production at risk', amber: 'Contingency needed', green: 'Stable' },
  { id: 'safetySecurity',       label: 'Safety & Security',             short: 'Safety',
    description: 'Any civil unrest, protest, or security concern near the plant',
    red: 'Active incident', amber: 'Elevated risk', green: 'Normal' },
];

export const MEASURES = [
  { id: 'bufferStock',          label: 'Buffer Stock Build-up',
    description: 'Increasing raw material inventory beyond normal levels to cover 4–8 weeks of production' },
  { id: 'fuelHoarding',         label: 'Fuel/Diesel Hoarding for Generators',
    description: 'Stockpiling diesel to operate backup generators; tracking days of autonomous operation' },
  { id: 'shuttleBus',           label: 'Shuttle Bus / Company Transport',
    description: 'Operating or expanding company shuttle services so employees can reach the plant' },
  { id: 'carpooling',           label: 'Carpooling Program',
    description: 'Organized ride-sharing among employees; reduce individual fuel dependency' },
  { id: 'wfh',                  label: 'Work From Home (WFH)',
    description: 'Enabling office, support, and non-production staff to work from home' },
  { id: 'altSupplier',          label: 'Alternative Supplier Activation',
    description: 'Qualifying suppliers outside the Hormuz-dependent supply chain (Europe, Americas, East Asia)' },
  { id: 'routeDiversification', label: 'Logistics Route Diversification',
    description: 'Switching from sea freight to air freight or alternative sea routes (Cape of Good Hope)' },
  { id: 'customerComms',        label: 'Customer Communication Plan',
    description: 'Proactive communication to customers about potential delays and revised lead times' },
  { id: 'energyHedging',        label: 'Energy Hedging / Consumption Reduction',
    description: 'Reducing non-critical energy consumption; negotiating fixed-price energy contracts; solar backup' },
  { id: 'fxHedging',            label: 'FX Hedging',
    description: 'Forward currency contracts to protect against further local currency depreciation on USD imports' },
  { id: 'stockSharing',         label: 'Safety Stock Sharing Between Plants',
    description: 'Cross-plant inventory leveling: plants with excess share with plants facing shortage' },
  { id: 'crisisTeam',           label: 'Crisis Response Team Activation',
    description: 'Formal crisis management team meeting regularly (daily/weekly); escalation paths defined' },
  { id: 'productionPriority',   label: 'Production Prioritization',
    description: 'Prioritizing highest-margin or most critical customer orders if capacity must be reduced' },
  { id: 'partialShutdown',      label: 'Partial Production Shutdown Planning',
    description: 'Documented contingency plan for orderly partial or full production pause if situation escalates' },
];

// ============================================================
// WEEKLY KPI SNAPSHOTS — historical tracking
// ============================================================
// Each entry = one week's KPI status for all 7 plants

export const INITIAL_KPI_HISTORY = [
  {
    week: 'W1',
    date: '2026-03-13',
    label: 'Week 1 — Crisis Onset',
    kpiData: {
      AmaP: { rawMaterial:'green', logisticsCosts:'green', logisticsLeadTime:'green', customerImpact:'green', energySupply:'green', staffTransport:'green', fuelDiesel:'green',  portCustoms:'green', fxRisk:'green', supplierReliability:'green', productionContinuity:'green', safetySecurity:'green' },
      HmjP: { rawMaterial:'green', logisticsCosts:'green', logisticsLeadTime:'green', customerImpact:'green', energySupply:'green', staffTransport:'green', fuelDiesel:'green',  portCustoms:'green', fxRisk:'green', supplierReliability:'green', productionContinuity:'green', safetySecurity:'green' },
      PgP1: { rawMaterial:'amber', logisticsCosts:'amber', logisticsLeadTime:'green', customerImpact:'green', energySupply:'green', staffTransport:'green', fuelDiesel:'amber', portCustoms:'green', fxRisk:'green', supplierReliability:'amber', productionContinuity:'green', safetySecurity:'green' },
      PgP2: { rawMaterial:'green', logisticsCosts:'amber', logisticsLeadTime:'amber', customerImpact:'green', energySupply:'green', staffTransport:'green', fuelDiesel:'green',  portCustoms:'amber', fxRisk:'green', supplierReliability:'green', productionContinuity:'green', safetySecurity:'green' },
      PgP5: { rawMaterial:'amber', logisticsCosts:'green', logisticsLeadTime:'green', customerImpact:'green', energySupply:'green', staffTransport:'green', fuelDiesel:'green',  portCustoms:'green', fxRisk:'green', supplierReliability:'amber', productionContinuity:'green', safetySecurity:'green' },
      HcP:  { rawMaterial:'green', logisticsCosts:'green', logisticsLeadTime:'green', customerImpact:'green', energySupply:'green', staffTransport:'green', fuelDiesel:'green',  portCustoms:'green', fxRisk:'green', supplierReliability:'green', productionContinuity:'green', safetySecurity:'green' },
      RBID: { rawMaterial:'amber', logisticsCosts:'amber', logisticsLeadTime:'amber', customerImpact:'amber', energySupply:'amber', staffTransport:'green', fuelDiesel:'amber', portCustoms:'amber', fxRisk:'amber', supplierReliability:'amber', productionContinuity:'amber', safetySecurity:'green' },
    },
  },
  {
    week: 'W2',
    date: '2026-03-20',
    label: 'Week 2 — Escalation',
    kpiData: {
      AmaP: { rawMaterial:'amber', logisticsCosts:'amber', logisticsLeadTime:'amber', customerImpact:'green', energySupply:'green', staffTransport:'green', fuelDiesel:'amber', portCustoms:'amber', fxRisk:'green', supplierReliability:'amber', productionContinuity:'green', safetySecurity:'green' },
      HmjP: { rawMaterial:'amber', logisticsCosts:'amber', logisticsLeadTime:'green', customerImpact:'green', energySupply:'green', staffTransport:'green', fuelDiesel:'amber', portCustoms:'green', fxRisk:'green', supplierReliability:'amber', productionContinuity:'green', safetySecurity:'green' },
      PgP1: { rawMaterial:'red',   logisticsCosts:'red',   logisticsLeadTime:'amber', customerImpact:'amber', energySupply:'amber', staffTransport:'amber', fuelDiesel:'amber', portCustoms:'amber', fxRisk:'amber', supplierReliability:'amber', productionContinuity:'amber', safetySecurity:'green' },
      PgP2: { rawMaterial:'amber', logisticsCosts:'red',   logisticsLeadTime:'amber', customerImpact:'amber', energySupply:'amber', staffTransport:'amber', fuelDiesel:'amber', portCustoms:'red',   fxRisk:'amber', supplierReliability:'amber', productionContinuity:'amber', safetySecurity:'green' },
      PgP5: { rawMaterial:'amber', logisticsCosts:'amber', logisticsLeadTime:'amber', customerImpact:'green', energySupply:'amber', staffTransport:'green', fuelDiesel:'amber', portCustoms:'amber', fxRisk:'amber', supplierReliability:'amber', productionContinuity:'amber', safetySecurity:'green' },
      HcP:  { rawMaterial:'amber', logisticsCosts:'amber', logisticsLeadTime:'amber', customerImpact:'green', energySupply:'green', staffTransport:'green', fuelDiesel:'green',  portCustoms:'green', fxRisk:'amber', supplierReliability:'amber', productionContinuity:'green', safetySecurity:'green' },
      RBID: { rawMaterial:'red',   logisticsCosts:'red',   logisticsLeadTime:'red',   customerImpact:'amber', energySupply:'red',   staffTransport:'amber', fuelDiesel:'red',   portCustoms:'red',   fxRisk:'amber', supplierReliability:'red',   productionContinuity:'red',   safetySecurity:'amber' },
    },
  },
  {
    week: 'W3',
    date: '2026-03-27',
    label: 'Week 3 — Current',
    kpiData: {
      AmaP: { rawMaterial:'amber', logisticsCosts:'amber', logisticsLeadTime:'amber', customerImpact:'green', energySupply:'green', staffTransport:'amber', fuelDiesel:'amber', portCustoms:'amber', fxRisk:'amber', supplierReliability:'amber', productionContinuity:'amber', safetySecurity:'green' },
      HmjP: { rawMaterial:'amber', logisticsCosts:'amber', logisticsLeadTime:'amber', customerImpact:'amber', energySupply:'green', staffTransport:'green', fuelDiesel:'amber', portCustoms:'amber', fxRisk:'amber', supplierReliability:'amber', productionContinuity:'amber', safetySecurity:'green' },
      PgP1: { rawMaterial:'red',   logisticsCosts:'red',   logisticsLeadTime:'amber', customerImpact:'amber', energySupply:'amber', staffTransport:'amber', fuelDiesel:'red',   portCustoms:'amber', fxRisk:'amber', supplierReliability:'red',   productionContinuity:'red',   safetySecurity:'green' },
      PgP2: { rawMaterial:'amber', logisticsCosts:'red',   logisticsLeadTime:'red',   customerImpact:'amber', energySupply:'amber', staffTransport:'amber', fuelDiesel:'amber', portCustoms:'red',   fxRisk:'amber', supplierReliability:'amber', productionContinuity:'amber', safetySecurity:'green' },
      PgP5: { rawMaterial:'red',   logisticsCosts:'amber', logisticsLeadTime:'amber', customerImpact:'amber', energySupply:'amber', staffTransport:'green', fuelDiesel:'amber', portCustoms:'amber', fxRisk:'amber', supplierReliability:'amber', productionContinuity:'amber', safetySecurity:'green' },
      HcP:  { rawMaterial:'amber', logisticsCosts:'amber', logisticsLeadTime:'amber', customerImpact:'green', energySupply:'green', staffTransport:'green', fuelDiesel:'green',  portCustoms:'green', fxRisk:'amber', supplierReliability:'amber', productionContinuity:'green', safetySecurity:'green' },
      RBID: { rawMaterial:'red',   logisticsCosts:'red',   logisticsLeadTime:'red',   customerImpact:'red',   energySupply:'red',   staffTransport:'amber', fuelDiesel:'red',   portCustoms:'red',   fxRisk:'red',   supplierReliability:'red',   productionContinuity:'red',   safetySecurity:'amber' },
    },
  },
];

// Current week = last snapshot
export const INITIAL_KPI_DATA = INITIAL_KPI_HISTORY[INITIAL_KPI_HISTORY.length - 1].kpiData;

// ============================================================
// INITIAL MEASURES DATA
// ============================================================
function buildMeasures(plantId) {
  const redPlants = ['PgP1', 'RBID'];
  const hasRed = redPlants.includes(plantId);
  return {
    bufferStock:          hasRed ? 'active'  : 'planned',
    fuelHoarding:         hasRed ? 'active'  : 'planned',
    shuttleBus:           hasRed ? 'active'  : 'inactive',
    carpooling:           'inactive',
    wfh:                  'inactive',
    altSupplier:          hasRed ? 'planned' : 'inactive',
    routeDiversification: hasRed ? 'planned' : 'inactive',
    customerComms:        'active',
    energyHedging:        hasRed ? 'planned' : 'inactive',
    fxHedging:            'planned',
    stockSharing:         'inactive',
    crisisTeam:           'active',
    productionPriority:   hasRed ? 'active'  : 'inactive',
    partialShutdown:      hasRed ? 'planned' : 'inactive',
  };
}

export const INITIAL_MEASURES_DATA = {
  AmaP: buildMeasures('AmaP'),
  HmjP: buildMeasures('HmjP'),
  PgP1: buildMeasures('PgP1'),
  PgP2: buildMeasures('PgP2'),
  PgP5: buildMeasures('PgP5'),
  HcP:  buildMeasures('HcP'),
  RBID: buildMeasures('RBID'),
};

export const INITIAL_PLANT_NOTES = {
  AmaP: 'Monitoring logistics costs closely. Local supplier contracts under review. No immediate production risk.',
  HmjP: 'Buffer stock being assessed. Close watch on fuel situation. Supplier confirmation expected next week.',
  PgP1: 'CRITICAL: Raw material stock at 1.5 weeks. Alternative suppliers being activated urgently. Crisis team meeting daily.',
  PgP2: 'Port congestion causing significant delays. Rerouting through alternative port being explored.',
  PgP5: 'Raw material shortage risk. Buffer stock build-up authorised. Supplier reliability discussions ongoing.',
  HcP:  'Situation stable. Monitoring regional developments. Pre-emptive measures in discussion.',
  RBID: 'CRITICAL: Multiple KPIs at red. Crisis team activated. Partial production shutdown contingency drafted. Regional management informed.',
};

export const INITIAL_PLANT_TRENDS = {
  AmaP: 'stable',
  HmjP: 'stable',
  PgP1: 'worsening',
  PgP2: 'stable',
  PgP5: 'worsening',
  HcP:  'stable',
  RBID: 'worsening',
};

// ============================================================
// COUNTRY INFO
// ============================================================
export const COUNTRY_INFO = {
  TH: {
    name: 'Thailand', flag: '🇹🇭',
    hormuzDependency: '38%', strategicReserveDays: 90,
    exposureLevel: 'Moderate', exposureColor: 'amber',
    economicNotes: 'Thai Baht under moderate pressure. Port of Laem Chabang operating normally with minor delays. Inflation risk from fuel prices ~3–4%. Central bank monitoring FX closely. Government activated Tier-1 of strategic reserve protocol.',
    news: [
      {
        title: 'Thailand Activates Strategic Petroleum Reserve Protocol',
        source: 'Bangkok Post', date: '2026-03-25',
        summary: 'The Thai Ministry of Energy has activated the first phase of its strategic petroleum reserve protocol as Strait of Hormuz disruption enters its third week. Reserves cover approximately 90 days of consumption.',
        url: 'https://www.bangkokpost.com/business/general',
        category: 'Energy',
      },
      {
        title: 'Thai Baht Falls 4.2% Amid Oil Supply Concerns',
        source: 'Reuters', date: '2026-03-24',
        summary: "Thailand's currency weakened against the US dollar as investors reassess the country's exposure to Middle East oil disruptions. The BOT said it stands ready to intervene if necessary.",
        url: 'https://www.reuters.com/markets/currencies/',
        category: 'FX',
      },
      {
        title: 'Thai Manufacturers Request Emergency Fuel Allocation',
        source: 'The Nation', date: '2026-03-23',
        summary: 'Federation of Thai Industries requests emergency fuel allocation and logistics subsidies as freight costs surge 35% above baseline across major supply chains.',
        url: 'https://www.nationthailand.com/business',
        category: 'Industry',
      },
      {
        title: 'Laem Chabang Port Reports Rising Transit Times',
        source: 'Lloyd\'s List', date: '2026-03-22',
        summary: 'Container transit times at Thailand\'s largest port increasing by 5–8 days as vessels reroute via Cape of Good Hope, adding approximately 14 days to Middle East voyages.',
        url: 'https://www.lloydslist.com/ll/sector/containers',
        category: 'Logistics',
      },
    ],
  },
  MY: {
    name: 'Malaysia', flag: '🇲🇾',
    hormuzDependency: '62%', strategicReserveDays: 45,
    exposureLevel: 'High', exposureColor: 'red',
    economicNotes: 'Malaysian Ringgit under significant pressure (-7.1% vs USD). Petronas activating emergency procurement. Port Klang experiencing growing backlogs. Government reviewing fuel subsidy sustainability under rising import costs.',
    news: [
      {
        title: 'Petronas Activates Emergency Oil Supply Contingency',
        source: 'The Star', date: '2026-03-25',
        summary: "Malaysia's national oil company activates emergency procurement channels as Hormuz closure threatens domestic refinery inputs. Alternative supply routes via Cape of Good Hope being contracted.",
        url: 'https://www.thestar.com.my/business/business-news',
        category: 'Energy',
      },
      {
        title: 'Port Klang Backlogs Reach 11-Day Average Dwell Time',
        source: 'The Edge Malaysia', date: '2026-03-24',
        summary: 'Container dwell times at Port Klang increasing sharply as vessel rerouting and reduced shipping capacity create growing backlogs. Shippers warned of 2–3 week delays on affected routes.',
        url: 'https://theedgemalaysia.com/node/logistics',
        category: 'Logistics',
      },
      {
        title: 'Ringgit at 6-Month Low — BNM Monitors Closely',
        source: 'Malay Mail', date: '2026-03-22',
        summary: "Bank Negara Malaysia signals readiness to deploy reserves as the ringgit falls to MYR 4.62/USD. Import-heavy manufacturers warned of margin pressure from currency depreciation.",
        url: 'https://www.malaymail.com/money',
        category: 'FX',
      },
      {
        title: 'Malaysia Considers Emergency Import Duty Waivers for Manufacturers',
        source: 'Bernama', date: '2026-03-21',
        summary: 'MITI in discussions to waive import duties on raw materials affected by the Hormuz supply disruption to cushion impact on domestic manufacturing sector.',
        url: 'https://www.bernama.com/en/business/',
        category: 'Policy',
      },
    ],
  },
  VN: {
    name: 'Vietnam', flag: '🇻🇳',
    hormuzDependency: '22%', strategicReserveDays: 60,
    exposureLevel: 'Lower', exposureColor: 'green',
    economicNotes: 'Vietnam Dong relatively stable (-2.1% vs USD). Domestic coal and hydropower reduce oil dependency. Logistics costs rising but manageable. Ho Chi Minh City port operating normally. Vietnam well-positioned relative to regional peers.',
    news: [
      {
        title: 'Vietnam Increases Coal Power Output to Offset Oil Risk',
        source: 'VnExpress International', date: '2026-03-24',
        summary: "Vietnam's EVN ramps up coal and hydro generation capacity by 18% to reduce dependency on oil-fired plants amid global supply uncertainty, giving factories greater energy security.",
        url: 'https://e.vnexpress.net/news/business',
        category: 'Energy',
      },
      {
        title: 'Vietnam Manufacturers Report Limited Supply Chain Impact',
        source: 'Vietnam Investment Review', date: '2026-03-23',
        summary: 'Survey of 200+ manufacturers shows Vietnam less exposed than regional peers due to diverse energy mix and lower Hormuz dependency. Logistics cost increases averaging 18% — below the regional average of 38%.',
        url: 'https://vir.com.vn/news/industries.html',
        category: 'Industry',
      },
      {
        title: 'Ho Chi Minh City Port Maintains Normal Operations',
        source: 'Tuoi Tre News', date: '2026-03-21',
        summary: 'Port authorities confirm near-normal operations with freight cost increases of 12–15% so far. Advance vessel bookings up 40% as shippers try to secure capacity ahead of anticipated disruptions.',
        url: 'https://tuoitrenews.vn/economy',
        category: 'Logistics',
      },
    ],
  },
  ID: {
    name: 'Indonesia', flag: '🇮🇩',
    hormuzDependency: '71%', strategicReserveDays: 30,
    exposureLevel: 'Very High', exposureColor: 'red',
    economicNotes: 'Indonesian Rupiah depreciating at alarming rate (-9.8% vs USD, approaching intervention threshold). Pertamina under critical supply pressure. Tanjung Priok port severely congested. Government emergency fuel rationing under active consideration.',
    news: [
      {
        title: 'Indonesia Moves Toward Emergency Fuel Rationing',
        source: 'Jakarta Post', date: '2026-03-25',
        summary: 'Government in active discussions on emergency fuel rationing as Pertamina reports 34% shortfall in crude oil procurement. Industrial zones may face priority-based fuel allocation within days.',
        url: 'https://www.thejakartapost.com/business',
        category: 'Energy',
      },
      {
        title: 'Rupiah at 9.8% Decline — Bank Indonesia Signals Intervention',
        source: 'Bloomberg', date: '2026-03-24',
        summary: "Indonesia's central bank signals readiness to intervene after the rupiah's rapid depreciation threatens to trigger an import cost spiral. Manufacturers with USD-denominated inputs face severe margin pressure.",
        url: 'https://www.bloomberg.com/asia',
        category: 'FX',
      },
      {
        title: 'Tanjung Priok Port: 2–3 Week Container Backlogs',
        source: 'Bisnis Indonesia', date: '2026-03-23',
        summary: "Indonesia's largest port reports unprecedented container backlogs as vessel diversions, fuel shortages, and reduced handling capacity combine to create a logistics crisis within the crisis.",
        url: 'https://ekonomi.bisnis.com/logistik',
        category: 'Logistics',
      },
      {
        title: 'IMF Warns of Emerging Economy Vulnerability as Oil Shock Deepens',
        source: 'Reuters', date: '2026-03-22',
        summary: 'IMF issues warning that Indonesia and other high-Hormuz-dependency emerging economies face compounding risks: currency depreciation, fuel shortages, and supply chain disruption simultaneously.',
        url: 'https://www.reuters.com/world/asia-pacific/',
        category: 'Macro',
      },
    ],
  },
};

// ============================================================
// UPDATE HISTORY
// ============================================================
export const INITIAL_UPDATE_HISTORY = [
  {
    id: 1, date: '2026-03-13', week: 'W1',
    summary: 'Initial crisis assessment. Strait of Hormuz closed following US military action against Iran. RBID and Malaysian plants elevated to high-alert. Crisis response teams activated across all plants. Monitoring protocols established.',
    updatedBy: 'Regional Crisis Coordinator',
  },
  {
    id: 2, date: '2026-03-20', week: 'W2',
    summary: 'Week 2 escalation: RBID situation deteriorating — energy supply, port operations, and raw materials all turning red. PgP1 raw material stock critically low at 1.5 weeks. Buffer stock build-up ordered for MY and ID plants. Alternative suppliers being qualified.',
    updatedBy: 'Regional Crisis Coordinator',
  },
  {
    id: 3, date: '2026-03-27', week: 'W3',
    summary: 'Week 3 current assessment: RBID multiple KPIs at red, partial shutdown plan drafted. PgP1 and PgP5 raw material situation critical. Vietnam plant (HcP) remains stable with green energy and port status. FX pressure increasing across all countries.',
    updatedBy: 'Regional Crisis Coordinator',
  },
];
