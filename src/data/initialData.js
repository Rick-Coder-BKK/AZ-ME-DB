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
  { id: 'rawMaterial',       label: 'Raw Material Availability',    short: 'Raw Materials',
    description: '% of required raw materials in stock or confirmed inbound',
    red: 'Less than 2 weeks supply', amber: '2–4 weeks supply', green: 'More than 4 weeks supply' },
  { id: 'logisticsCosts',    label: 'Logistics Costs',               short: 'Logistics Cost',
    description: 'Freight cost index vs pre-crisis baseline',
    red: '>50% increase', amber: '20–50% increase', green: '<20% increase' },
  { id: 'logisticsLeadTime', label: 'Logistics Lead Times',          short: 'Lead Times',
    description: 'Inbound shipment delays vs normal',
    red: '>3 weeks delay', amber: '1–3 weeks delay', green: '<1 week delay' },
  { id: 'customerImpact',    label: 'Customer Impact',               short: 'Customer Impact',
    description: 'Are customers experiencing delays or supply shortages?',
    red: 'Confirmed delays/shortages', amber: 'Risk of impact', green: 'No impact' },
  { id: 'energySupply',      label: 'Energy Supply Reliability',     short: 'Energy Supply',
    description: 'Stability of grid power and fuel for on-site generation',
    red: 'Outages occurring', amber: 'Risk of outage', green: 'Stable' },
  { id: 'staffTransport',    label: 'Staff Transport Access',        short: 'Staff Transport',
    description: 'Can employees reach the plant?',
    red: 'Significant absenteeism', amber: 'Some difficulty', green: 'Normal' },
  { id: 'fuelDiesel',        label: 'Fuel / Diesel Availability',    short: 'Fuel/Diesel',
    description: 'For on-site generators, logistics, company vehicles',
    red: 'Critically low', amber: 'Limited', green: 'Adequate' },
  { id: 'portCustoms',       label: 'Port & Customs Operations',     short: 'Port & Customs',
    description: 'Are nearby ports operating normally?',
    red: 'Significant disruption', amber: 'Delays reported', green: 'Normal' },
  { id: 'fxRisk',            label: 'FX / Currency Risk',            short: 'FX Risk',
    description: 'Local currency depreciation impacting import costs',
    red: '>10% depreciation', amber: '5–10% depreciation', green: '<5% depreciation' },
  { id: 'supplierReliability', label: 'Supplier Reliability',        short: 'Suppliers',
    description: 'Are key raw material suppliers confirming delivery?',
    red: 'Unable to commit', amber: 'Uncertain', green: 'Confirmed' },
  { id: 'productionContinuity', label: 'Production Continuity Risk', short: 'Production',
    description: 'Overall risk of having to reduce or halt production',
    red: 'Production at risk', amber: 'Contingency needed', green: 'Stable' },
  { id: 'safetySecurity',    label: 'Safety & Security',             short: 'Safety',
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
// INITIAL KPI DATA
// ============================================================
// Status: 'red' | 'amber' | 'green'

export const INITIAL_KPI_DATA = {
  AmaP: {
    rawMaterial:          'amber',
    logisticsCosts:       'amber',
    logisticsLeadTime:    'amber',
    customerImpact:       'green',
    energySupply:         'green',
    staffTransport:       'amber',
    fuelDiesel:           'amber',
    portCustoms:          'amber',
    fxRisk:               'amber',
    supplierReliability:  'amber',
    productionContinuity: 'amber',
    safetySecurity:       'green',
  },
  HmjP: {
    rawMaterial:          'amber',
    logisticsCosts:       'amber',
    logisticsLeadTime:    'amber',
    customerImpact:       'amber',
    energySupply:         'green',
    staffTransport:       'green',
    fuelDiesel:           'amber',
    portCustoms:          'amber',
    fxRisk:               'amber',
    supplierReliability:  'amber',
    productionContinuity: 'amber',
    safetySecurity:       'green',
  },
  PgP1: {
    rawMaterial:          'red',
    logisticsCosts:       'red',
    logisticsLeadTime:    'amber',
    customerImpact:       'amber',
    energySupply:         'amber',
    staffTransport:       'amber',
    fuelDiesel:           'red',
    portCustoms:          'amber',
    fxRisk:               'amber',
    supplierReliability:  'red',
    productionContinuity: 'red',
    safetySecurity:       'green',
  },
  PgP2: {
    rawMaterial:          'amber',
    logisticsCosts:       'red',
    logisticsLeadTime:    'red',
    customerImpact:       'amber',
    energySupply:         'amber',
    staffTransport:       'amber',
    fuelDiesel:           'amber',
    portCustoms:          'red',
    fxRisk:               'amber',
    supplierReliability:  'amber',
    productionContinuity: 'amber',
    safetySecurity:       'green',
  },
  PgP5: {
    rawMaterial:          'red',
    logisticsCosts:       'amber',
    logisticsLeadTime:    'amber',
    customerImpact:       'amber',
    energySupply:         'amber',
    staffTransport:       'green',
    fuelDiesel:           'amber',
    portCustoms:          'amber',
    fxRisk:               'amber',
    supplierReliability:  'amber',
    productionContinuity: 'amber',
    safetySecurity:       'green',
  },
  HcP: {
    rawMaterial:          'amber',
    logisticsCosts:       'amber',
    logisticsLeadTime:    'amber',
    customerImpact:       'green',
    energySupply:         'green',
    staffTransport:       'green',
    fuelDiesel:           'green',
    portCustoms:          'green',
    fxRisk:               'amber',
    supplierReliability:  'amber',
    productionContinuity: 'green',
    safetySecurity:       'green',
  },
  RBID: {
    rawMaterial:          'red',
    logisticsCosts:       'red',
    logisticsLeadTime:    'red',
    customerImpact:       'red',
    energySupply:         'red',
    staffTransport:       'amber',
    fuelDiesel:           'red',
    portCustoms:          'red',
    fxRisk:               'red',
    supplierReliability:  'red',
    productionContinuity: 'red',
    safetySecurity:       'amber',
  },
};

// ============================================================
// INITIAL MEASURES DATA
// ============================================================
// Status: 'active' | 'planned' | 'inactive'

const redPlants = ['PgP1', 'RBID'];

function buildMeasures(plantId) {
  const hasRed = redPlants.includes(plantId);
  return {
    bufferStock:          hasRed ? 'active' : 'planned',
    fuelHoarding:         hasRed ? 'active' : 'planned',
    shuttleBus:           hasRed ? 'active' : 'inactive',
    carpooling:           'inactive',
    wfh:                  'inactive',
    altSupplier:          hasRed ? 'planned' : 'inactive',
    routeDiversification: hasRed ? 'planned' : 'inactive',
    customerComms:        'active',
    energyHedging:        hasRed ? 'planned' : 'inactive',
    fxHedging:            'planned',
    stockSharing:         'inactive',
    crisisTeam:           'active',
    productionPriority:   hasRed ? 'active' : 'inactive',
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
  AmaP: 'Monitoring logistics costs closely. Local supplier contracts being reviewed for alternative sourcing.',
  HmjP: 'Buffer stock being assessed. No immediate production risk but close watch on fuel situation.',
  PgP1: 'CRITICAL: Raw material stock at 1.5 weeks. Alternative suppliers being activated urgently. Crisis team meeting daily.',
  PgP2: 'Port congestion causing significant delays. Rerouting through alternative port being explored.',
  PgP5: 'Raw material shortage risk. Buffer stock build-up authorized. Supplier reliability discussions ongoing.',
  HcP:  'Situation stable. Monitoring regional developments. Pre-emptive measures in discussion.',
  RBID: 'CRITICAL: Multiple KPIs at red. Crisis team activated. Partial production shutdown contingency drafted. Management informed.',
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

export const COUNTRY_INFO = {
  TH: {
    name: 'Thailand',
    flag: '🇹🇭',
    hormuzDependency: '38%',
    strategicReserveDays: 90,
    exposureLevel: 'Moderate',
    exposureColor: 'amber',
    economicNotes: 'Thai Baht showing moderate pressure. Port of Laem Chabang operating normally. Inflation risk from fuel prices ~3-4%. Central bank monitoring FX closely.',
    news: [
      { title: 'Thailand Energy Ministry Activates Strategic Reserve Protocol', source: 'Bangkok Post', date: '2026-03-25', summary: 'The Thai Ministry of Energy has activated the first phase of its strategic petroleum reserve protocol as Strait of Hormuz disruption enters third week.' },
      { title: 'Thai Baht Falls 4.2% Amid Oil Supply Fears', source: 'Reuters', date: '2026-03-24', summary: 'Thailand\'s currency weakened against the US dollar as investors reassess the country\'s exposure to Middle East oil disruptions.' },
      { title: 'Manufacturing Sector Calls for Government Support', source: 'The Nation', date: '2026-03-23', summary: 'Federation of Thai Industries requests emergency fuel allocation and logistics subsidies as freight costs surge across supply chains.' },
    ],
  },
  MY: {
    name: 'Malaysia',
    flag: '🇲🇾',
    hormuzDependency: '62%',
    strategicReserveDays: 45,
    exposureLevel: 'High',
    exposureColor: 'red',
    economicNotes: 'Malaysian Ringgit under pressure. Petronas activating contingency plans. Port Klang operating with minor delays. Fuel subsidy system under review as import costs rise significantly.',
    news: [
      { title: 'Petronas Activates Emergency Oil Supply Contingency', source: 'The Star', date: '2026-03-25', summary: 'Malaysia\'s national oil company activates emergency procurement from alternative suppliers as Hormuz closure threatens domestic refinery inputs.' },
      { title: 'Port Klang Reports Rising Container Backlogs', source: 'Malay Mail', date: '2026-03-24', summary: 'Container dwell times at Port Klang increasing as vessel rerouting via Cape of Good Hope adds 14 days to average transit times.' },
      { title: 'Ringgit Hits 6-Month Low Against USD', source: 'The Edge', date: '2026-03-22', summary: 'Malaysia\'s ringgit fell to its weakest level since September as commodity markets price in extended Hormuz closure impact.' },
    ],
  },
  VN: {
    name: 'Vietnam',
    flag: '🇻🇳',
    hormuzDependency: '22%',
    strategicReserveDays: 60,
    exposureLevel: 'Lower',
    exposureColor: 'green',
    economicNotes: 'Vietnam Dong relatively stable. Domestic coal and hydropower reduce oil dependency. Logistics costs rising but manageable. Port of Ho Chi Minh City operating normally.',
    news: [
      { title: 'Vietnam Increases Coal Power Output to Offset Oil Risks', source: 'VnExpress', date: '2026-03-24', summary: 'Vietnam\'s EVN ramps up coal and hydro power generation to reduce dependency on oil-fired plants amid global supply uncertainty.' },
      { title: 'Vietnam Manufacturers Report Limited Supply Chain Impact', source: 'Vietnam Investment Review', date: '2026-03-23', summary: 'Survey of 200 manufacturers shows Vietnam less exposed than regional peers due to diverse energy mix and lower Hormuz dependency.' },
      { title: 'Ho Chi Minh Port Maintains Normal Operations', source: 'Tuoi Tre', date: '2026-03-21', summary: 'Port authorities confirm normal operations with only minor freight cost increases so far, as rerouted vessels begin arriving.' },
    ],
  },
  ID: {
    name: 'Indonesia',
    flag: '🇮🇩',
    hormuzDependency: '71%',
    strategicReserveDays: 30,
    exposureLevel: 'Very High',
    exposureColor: 'red',
    economicNotes: 'Indonesian Rupiah depreciating significantly. Pertamina under severe supply pressure. Port of Tanjung Priok experiencing significant disruption. Government emergency fuel rationing under consideration.',
    news: [
      { title: 'Indonesia Considers Emergency Fuel Rationing Amid Hormuz Crisis', source: 'Kompas', date: '2026-03-25', summary: 'Indonesian government in discussions on emergency fuel rationing measures as Pertamina reports critical supply shortfall entering third week.' },
      { title: 'Rupiah Falls 9.8% — Approaching Central Bank Intervention Threshold', source: 'Jakarta Post', date: '2026-03-24', summary: 'Bank Indonesia signals readiness to intervene as rupiah depreciation accelerates, threatening import cost spiral for manufacturers.' },
      { title: 'Tanjung Priok Port Congestion Causing Weeks-Long Delays', source: 'Bisnis Indonesia', date: '2026-03-23', summary: 'Indonesia\'s largest port reports container backlogs of 2–3 weeks as vessel diversions and reduced fuel availability slow operations.' },
    ],
  },
};

export const INITIAL_UPDATE_HISTORY = [
  {
    id: 1,
    date: '2026-03-20',
    summary: 'Initial crisis assessment following Strait of Hormuz closure. RBID and Malaysian plants elevated to high-alert status. Crisis response teams activated across all plants.',
    updatedBy: 'Regional Crisis Coordinator',
  },
  {
    id: 2,
    date: '2026-03-27',
    summary: 'Week 2 update: RBID situation deteriorating with multiple red KPIs. PgP1 raw material stock critically low at 1.5 weeks. Vietnam plant remains stable. Buffer stock build-up ordered for all MY and ID plants.',
    updatedBy: 'Regional Crisis Coordinator',
  },
];
