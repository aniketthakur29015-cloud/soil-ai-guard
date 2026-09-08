export type RiskLevel = "Low" | "Medium" | "High" | "Good" | "Moderate";

export const brand = {
  name: "SoilGuard",
  tagline: "Healthy Soil • Higher Yields",
  quote: "Better soil. Higher yields. A greener India.",
};

export const user = {
  name: "Ramesh Kumar",
  role: "Large Farmer",
  initials: "RK",
  location: { state: "Maharashtra", district: "Pune" },
};

export const summary = {
  totalFields: 5,
  healthyFields: 3,
  atRisk: 1,
  highRisk: 1,
};

export const weatherNow = {
  place: "Pune, Maharashtra",
  date: "Sat, 6 Sep 2025",
  temp: "28°C",
  condition: "Partly Cloudy",
  humidity: "72%",
  rainfall24h: "20 mm",
  wind: "12 km/h",
};

export const weatherSeason = [
  { label: "Temperature", value: "27.8°C", key: "temp" },
  { label: "Rainfall (30 days)", value: "126 mm", key: "rain" },
  { label: "Humidity", value: "72%", key: "humidity" },
  { label: "Wind Speed", value: "12 km/h", key: "wind" },
] as const;

export const selectedField = {
  areaHa: 2.84,
  areaM2: "28,400 m²",
  center: { lat: "18.5204° N", lon: "73.8567° E" },
  corners: [
    "18.5211° N, 73.8559° E",
    "18.5213° N, 73.8574° E",
    "18.5198° N, 73.8576° E",
    "18.5196° N, 73.8560° E",
  ],
};

export const fieldHealth = {
  score: 68,
  status: "Moderate Risk",
  description: "Risk of soil-borne diseases is moderate. Take preventive measures.",
};

export const satelliteIndicators: { label: string; value: string; level: RiskLevel }[] = [
  { label: "NDVI", value: "0.62", level: "Good" },
  { label: "NDMI", value: "0.41", level: "Moderate" },
  { label: "NDRE", value: "0.58", level: "Good" },
  { label: "Vegetation Health", value: "—", level: "Good" },
  { label: "Moisture Indicator", value: "—", level: "Moderate" },
];

export const lastSatelliteImage = "4 Sep 2025";

export const diseases: { name: string; probability: number; level: "High" | "Medium" | "Low" }[] = [
  { name: "Fusarium Wilt", probability: 72, level: "High" },
  { name: "Rhizoctonia (Root Rot)", probability: 54, level: "Medium" },
  { name: "Pythium (Damping Off)", probability: 28, level: "Low" },
  { name: "Nematodes", probability: 18, level: "Low" },
];

export const soilProperties = [
  { label: "pH", value: "6.8" },
  { label: "Organic Carbon", value: "0.5%" },
  { label: "Clay", value: "22%" },
  { label: "Sand", value: "48%" },
  { label: "Silt", value: "30%" },
];

export const aiInsight = {
  summary:
    "Your field has moderate soil-health risk. Moisture levels are slightly elevated and Fusarium Wilt probability is high.",
  recommendations: [
    "Improve field drainage.",
    "Avoid excessive irrigation.",
    "Monitor affected plants for early symptoms.",
    "Consider preventive soil treatment.",
    "Recheck field conditions within 7 days.",
  ],
};

export const riskTrends = {
  "7 Days": [
    { label: "Mon", risk: 61, moisture: 44, disease: 58 },
    { label: "Tue", risk: 63, moisture: 46, disease: 60 },
    { label: "Wed", risk: 66, moisture: 51, disease: 63 },
    { label: "Thu", risk: 64, moisture: 49, disease: 66 },
    { label: "Fri", risk: 69, moisture: 55, disease: 70 },
    { label: "Sat", risk: 68, moisture: 53, disease: 72 },
    { label: "Sun", risk: 67, moisture: 52, disease: 71 },
  ],
  "30 Days": [
    { label: "W1", risk: 52, moisture: 38, disease: 45 },
    { label: "W2", risk: 58, moisture: 42, disease: 52 },
    { label: "W3", risk: 63, moisture: 48, disease: 61 },
    { label: "W4", risk: 68, moisture: 53, disease: 72 },
  ],
  "3 Months": [
    { label: "Jul", risk: 44, moisture: 31, disease: 38 },
    { label: "Aug", risk: 57, moisture: 45, disease: 55 },
    { label: "Sep", risk: 68, moisture: 53, disease: 72 },
  ],
  "1 Year": [
    { label: "Oct", risk: 38, moisture: 28, disease: 30 },
    { label: "Dec", risk: 32, moisture: 24, disease: 26 },
    { label: "Feb", risk: 41, moisture: 30, disease: 35 },
    { label: "Apr", risk: 49, moisture: 35, disease: 44 },
    { label: "Jun", risk: 55, moisture: 41, disease: 51 },
    { label: "Aug", risk: 62, moisture: 48, disease: 63 },
    { label: "Sep", risk: 68, moisture: 53, disease: 72 },
  ],
} as const;

export type TrendRange = keyof typeof riskTrends;
export const trendRanges: TrendRange[] = ["7 Days", "30 Days", "3 Months", "1 Year"];

export const riskBreakdown = [
  { label: "Soil Moisture Risk", value: 62, tone: "warn" as const, note: "Slightly elevated after 20 mm rain" },
  { label: "Nutrient Risk", value: 38, tone: "good" as const, note: "Nitrogen adequate, potassium low-normal" },
  { label: "Weather Risk", value: 55, tone: "warn" as const, note: "Humid spell forecast for 4 days" },
  { label: "Disease Pressure", value: 72, tone: "bad" as const, note: "Fusarium Wilt probability high" },
];

export const fields = [
  { id: "A", name: "Field A — Wagholi", crop: "Sugarcane", area: 3.2, score: 82, status: "Healthy" },
  { id: "B", name: "Field B — Kharadi", crop: "Wheat", area: 2.84, score: 68, status: "At Risk" },
  { id: "C", name: "Field C — Loni", crop: "Soybean", area: 1.9, score: 74, status: "Healthy" },
];

export const actionPlan = [
  {
    window: "TODAY",
    items: [
      { text: "Check soil moisture at 15 cm depth", tone: "done" as const },
      { text: "Inspect crop roots in the north-east corner", tone: "done" as const },
    ],
  },
  {
    window: "NEXT 3 DAYS",
    items: [
      { text: "Improve field drainage along the low edge", tone: "urgent" as const },
      { text: "Monitor disease symptoms on affected plants", tone: "warn" as const },
    ],
  },
  {
    window: "NEXT 7 DAYS",
    items: [
      { text: "Recheck soil conditions after drainage", tone: "done" as const },
      { text: "Update field analysis with new satellite pass", tone: "done" as const },
    ],
  },
  {
    window: "NEXT 30 DAYS",
    items: [
      { text: "Compare soil health across all 5 fields", tone: "done" as const },
      { text: "Review crop performance and yield estimate", tone: "done" as const },
    ],
  },
];

export const reports = [
  { name: "Soil Health Report", date: "6 Sep 2025", size: "1.2 MB", type: "Soil" },
  { name: "Field Analysis Report", date: "4 Sep 2025", size: "2.4 MB", type: "Field" },
  { name: "Disease Risk Report", date: "1 Sep 2025", size: "980 KB", type: "Risk" },
  { name: "Monthly Field Report", date: "31 Aug 2025", size: "3.1 MB", type: "Monthly" },
];

export const reportHistory = [
  { name: "Monthly Field Report — August", date: "31 Aug 2025", status: "Shared" },
  { name: "Disease Risk Report", date: "18 Aug 2025", status: "Downloaded" },
  { name: "Soil Health Report", date: "2 Aug 2025", status: "Viewed" },
  { name: "Monthly Field Report — July", date: "31 Jul 2025", status: "Downloaded" },
];

export const notifications = [
  { title: "Fusarium Wilt risk rose to 72%", time: "12 min ago", tone: "bad" as const },
  { title: "New satellite image available (4 Sep)", time: "2 hours ago", tone: "info" as const },
  { title: "20 mm rainfall recorded in Pune", time: "Yesterday", tone: "info" as const },
];
