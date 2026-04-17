// Realistic telecom mock data for inwi·IA v2

export type Severity = "critical" | "high" | "medium" | "low";
export type IncidentSource = "dynatrace" | "salesforce" | "mixed";
export type IncidentStatus = "open" | "investigating" | "mitigating" | "resolved";

export interface Incident {
  id: string;
  service: string;
  severity: Severity;
  customers: number;
  source: IncidentSource;
  status: IncidentStatus;
  startedAt: string;
  mttr: number; // minutes
  region: string;
}

export const SERVICES = ["4G Core", "VoLTE", "FTTH", "Roaming", "SMS Gateway", "Internet Mobile", "IPTV", "5G NSA"];
export const REGIONS = ["Casablanca", "Rabat", "Marrakech", "Tangier", "Fez", "Agadir"];

const rand = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

export const KPIS = [
  { label: "Correlations Today", value: 247, delta: 18, trend: "up" as const, sparkline: [120, 140, 130, 180, 200, 210, 247] },
  { label: "Customers Impacted", value: 12430, delta: 3, trend: "up" as const, sparkline: [11000, 11200, 11800, 12000, 12100, 12300, 12430] },
  { label: "Avg Resolution Time", value: 14, suffix: "min", delta: -62, trend: "down" as const, good: true, sparkline: [40, 35, 28, 22, 18, 16, 14] },
  { label: "Open Critical Incidents", value: 8, delta: -40, trend: "down" as const, good: true, sparkline: [18, 16, 14, 12, 10, 9, 8] },
];

export const INCIDENT_VOLUME = Array.from({ length: 30 }, (_, i) => {
  const day = new Date();
  day.setDate(day.getDate() - (29 - i));
  const base = 80 + Math.round(rand(i + 1) * 60);
  const spike = i === 12 || i === 21 ? 90 : 0;
  const incidents = base + spike;
  return {
    date: day.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    incidents,
    resolutionRate: Math.round(82 + rand(i + 7) * 14),
    anomaly: spike > 0,
  };
});

export const SOURCE_DISTRIBUTION = [
  { name: "Dynatrace Only", value: 45, color: "hsl(277 100% 50%)" },
  { name: "Salesforce Only", value: 25, color: "hsl(16 67% 52%)" },
  { name: "Mixed Correlation", value: 30, color: "hsl(173 80% 50%)" },
];

export const TOP_SERVICES = [
  { service: "4G Core", value: 184 },
  { service: "VoLTE", value: 152 },
  { service: "FTTH", value: 128 },
  { service: "Internet Mobile", value: 96 },
  { service: "SMS Gateway", value: 64 },
  { service: "Roaming", value: 41 },
];

export const HEATMAP = Array.from({ length: 52 }, (_, w) =>
  Array.from({ length: 7 }, (_, d) => ({
    week: w,
    day: d,
    count: Math.floor(rand(w * 7 + d + 1) * 12),
  }))
).flat();

export const RESOLUTION_DIST = [
  { bucket: "0-5m", count: 42 },
  { bucket: "5-15m", count: 128 },
  { bucket: "15-30m", count: 96 },
  { bucket: "30-60m", count: 54 },
  { bucket: "1-2h", count: 28 },
  { bucket: "2-4h", count: 12 },
  { bucket: "4h+", count: 5 },
];

export const TOPOLOGY_NODES = [
  { id: "4g-core", label: "4G Core", health: "critical", x: 50, y: 30, size: 28 },
  { id: "volte", label: "VoLTE", health: "warning", x: 25, y: 50, size: 22 },
  { id: "ftth", label: "FTTH", health: "healthy", x: 75, y: 55, size: 24 },
  { id: "sms", label: "SMS GW", health: "healthy", x: 30, y: 78, size: 16 },
  { id: "roaming", label: "Roaming", health: "warning", x: 70, y: 78, size: 18 },
  { id: "ims", label: "IMS", health: "healthy", x: 50, y: 60, size: 20 },
  { id: "5g", label: "5G NSA", health: "healthy", x: 50, y: 12, size: 22 },
  { id: "iptv", label: "IPTV", health: "healthy", x: 88, y: 30, size: 18 },
  { id: "billing", label: "Billing", health: "healthy", x: 12, y: 28, size: 16 },
];

export const TOPOLOGY_EDGES: Array<{ from: string; to: string; active?: boolean }> = [
  { from: "4g-core", to: "volte", active: true },
  { from: "4g-core", to: "ims", active: true },
  { from: "4g-core", to: "5g", active: true },
  { from: "ims", to: "volte" },
  { from: "ims", to: "sms" },
  { from: "ftth", to: "iptv" },
  { from: "4g-core", to: "roaming" },
  { from: "ftth", to: "ims" },
  { from: "billing", to: "4g-core" },
];

const sevs: Severity[] = ["critical", "high", "medium", "low"];
const statuses: IncidentStatus[] = ["open", "investigating", "mitigating", "resolved"];
const sources: IncidentSource[] = ["dynatrace", "salesforce", "mixed"];

export const INCIDENTS: Incident[] = Array.from({ length: 24 }, (_, i) => {
  const started = new Date();
  started.setMinutes(started.getMinutes() - Math.floor(rand(i + 100) * 60 * 24 * 3));
  return {
    id: `INC-${String(48201 + i).padStart(5, "0")}`,
    service: SERVICES[Math.floor(rand(i + 11) * SERVICES.length)],
    severity: sevs[Math.floor(rand(i + 22) * 4)],
    customers: Math.floor(rand(i + 33) * 8000) + 50,
    source: sources[Math.floor(rand(i + 44) * 3)],
    status: statuses[Math.floor(rand(i + 55) * 4)],
    startedAt: started.toISOString(),
    mttr: Math.floor(rand(i + 66) * 180) + 4,
    region: REGIONS[Math.floor(rand(i + 77) * REGIONS.length)],
  };
});

export const SUGGESTED_PROMPTS = [
  "What caused the 4G outage in Casablanca yesterday?",
  "Which services had the most complaints this week?",
  "Show me correlation between network events and tickets",
  "Predict customer impact of the current VoLTE degradation",
];

export const MOCK_CONVERSATIONS = [
  { id: "c1", title: "4G outage Casablanca — root cause", preview: "The correlation engine identified...", time: "2m ago", source: "mixed" as const, pinned: true, group: "Today" },
  { id: "c2", title: "VoLTE degradation analysis", preview: "Latency spike on IMS core...", time: "1h ago", source: "dynatrace" as const, pinned: true, group: "Today" },
  { id: "c3", title: "FTTH complaints surge — Rabat", preview: "47 tickets opened in 30 minutes...", time: "3h ago", source: "salesforce" as const, group: "Today" },
  { id: "c4", title: "SMS gateway throughput drop", preview: "Throughput dropped 34%...", time: "Yesterday", source: "dynatrace" as const, group: "Yesterday" },
  { id: "c5", title: "Roaming partner outage report", preview: "Partner network in Spain...", time: "Yesterday", source: "mixed" as const, group: "Yesterday" },
  { id: "c6", title: "Weekly NPS impact summary", preview: "NPS dropped 4 points due to...", time: "3d ago", source: "salesforce" as const, group: "Last 7 days" },
  { id: "c7", title: "5G NSA performance review", preview: "Average throughput increased...", time: "5d ago", source: "dynatrace" as const, group: "Last 7 days" },
  { id: "c8", title: "Billing service correlation deep-dive", preview: "Cross-service correlation found...", time: "12d ago", source: "mixed" as const, group: "Last 30 days" },
];
