// TEHAŞ Fiyat Kataloğu v1
// Formül: pazar ortalaması × 1.35
// İşçilik, kablo ve keşif ayrı kalemdir
// Bu dosya şimdilik veri deposu — UI entegrasyonu ayrı görevde yapılacak

export const PRICING_MULTIPLIER = 1.35;

export const electricCatalog = {
  smartHome: [
    { id: 'shelly_1_gen4',      name: 'Shelly 1 Gen4 Akıllı Röle',      marketAvg: 1631,  tehasEstimate: 2202 },
    { id: 'shelly_plug_s_gen3', name: 'Shelly Plug S Gen3 Akıllı Priz', marketAvg: 1800,  tehasEstimate: 2430 },
  ],
  solarReference: [
    { id: 'solar_3kw',  name: '3 kW Solar Çatı',  marketAvg: 120000, tehasEstimate: 162000, mode: 'reference_only' },
    { id: 'solar_5kw',  name: '5 kW Solar Çatı',  marketAvg: 161000, tehasEstimate: 217350, mode: 'reference_only' },
    { id: 'solar_10kw', name: '10 kW Solar Çatı', marketAvg: 360000, tehasEstimate: 486000, mode: 'reference_only' },
  ],
};

export const cameraCatalog = {
  ahd: [
    { id: 'ahd_4ch_2mp_500gb', name: '4 Kamera 2MP AHD Set 500GB', marketAvgLow: 6300,  marketAvgHigh: 8300,  tehasLow: 8505,  tehasHigh: 11205 },
    { id: 'ahd_4ch_2mp_1tb',   name: '4 Kamera 2MP AHD Set 1TB',   marketAvgLow: 11000, marketAvgHigh: 13800, tehasLow: 14850, tehasHigh: 18630 },
    { id: 'ahd_8ch',           name: '8 Kamera AHD Set',           marketAvgLow: 18000, marketAvgHigh: 30000, tehasLow: 24300, tehasHigh: 40500 },
  ],
  ip: [
    { id: 'ip_4ch_5mp_500gb', name: '4 Kamera 5MP IP PoE Set 500GB', marketAvg: 14490, tehasEstimate: 19562 },
    { id: 'ip_4ch_5mp_1tb',   name: '4 Kamera 5MP IP PoE Set 1TB',   marketAvg: 16560, tehasEstimate: 22356 },
    { id: 'ip_8ch',           name: '8 Kamera IP PoE Set',           marketAvgLow: 30000, marketAvgHigh: 45000, tehasLow: 40500, tehasHigh: 60750 },
  ],
  solar: [
    { id: 'solar_wifi', name: 'Wi-Fi Solar Kamera',           marketAvgLow: 3000, marketAvgHigh: 7000,  tehasLow: 4050, tehasHigh: 9450  },
    { id: 'solar_4g',   name: '4G SIM Destekli Solar Kamera', marketAvgLow: 6000, marketAvgHigh: 15000, tehasLow: 8100, tehasHigh: 20250 },
  ],
  integration: [
    { id: 'hikvision_axpro_96', name: 'Hikvision AX Pro DS-PWA96-Kit-WE', marketAvg: 12500, tehasEstimate: 16875 },
  ],
};

export const hddGuide = [
  { cameras: '1-4',  minHdd: '1TB',  recommendedHdd: '2TB'            },
  { cameras: '5-8',  minHdd: '2TB',  recommendedHdd: '4TB'            },
  { cameras: '9-16', minHdd: '4TB',  recommendedHdd: '6-8TB'          },
  { cameras: '17+',  minHdd: 'Özel', recommendedHdd: 'NVR planlaması' },
];
