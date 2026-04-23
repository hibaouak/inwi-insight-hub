import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, ScatterChart,
  Scatter, ZAxis,
} from "recharts";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { IncidentsTable } from "@/components/dashboard/IncidentsTable";

// ─── DATA ───────────────────────────────────────────────────────────────────

const INCIDENT_VOLUME = [
  { date: "01/04", dynatrace: 12, salesforce: 8, correlations: 5 },
  { date: "02/04", dynatrace: 19, salesforce: 14, correlations: 11 },
  { date: "03/04", dynatrace: 8, salesforce: 6, correlations: 4 },
  { date: "04/04", dynatrace: 25, salesforce: 21, correlations: 18 },
  { date: "05/04", dynatrace: 31, salesforce: 28, correlations: 24 },
  { date: "06/04", dynatrace: 14, salesforce: 10, correlations: 8 },
  { date: "07/04", dynatrace: 22, salesforce: 17, correlations: 14 },
  { date: "08/04", dynatrace: 18, salesforce: 13, correlations: 10 },
  { date: "09/04", dynatrace: 27, salesforce: 22, correlations: 19 },
  { date: "10/04", dynatrace: 35, salesforce: 31, correlations: 27 },
  { date: "11/04", dynatrace: 16, salesforce: 11, correlations: 9 },
  { date: "12/04", dynatrace: 24, salesforce: 20, correlations: 17 },
  { date: "13/04", dynatrace: 41, salesforce: 38, correlations: 33 },
  { date: "14/04", dynatrace: 29, salesforce: 24, correlations: 21 },
  { date: "15/04", dynatrace: 20, salesforce: 15, correlations: 12 },
];

const SERVICES_DATA = [
  { service: "Paiement mobile", dt: 47, sf: 52, severity: "HIGH" },
  { service: "SMS / OTP",       dt: 31, sf: 28, severity: "HIGH" },
  { service: "Réseau 4G",       dt: 24, sf: 19, severity: "MED"  },
  { service: "Recharge",        dt: 18, sf: 22, severity: "MED"  },
  { service: "Mon compte",      dt: 12, sf: 14, severity: "LOW"  },
  { service: "VoLTE",           dt: 9,  sf: 7,  severity: "LOW"  },
];

const SOURCE_DATA = [
  { name: "Dynatrace seul",     value: 38, color: "#7F77DD" },
  { name: "Salesforce seul",    value: 22, color: "#1D9E75" },
  { name: "Corrélation mixte",  value: 40, color: "#D85A30" },
];

const CHAT_QUESTIONS = [
  { question: "Incidents service SMS",       count: 124, trend: +18, source: "DT"  },
  { question: "Tickets paiement mobile",     count: 98,  trend: +31, source: "SF"  },
  { question: "Cause racine VoLTE",          count: 76,  trend: -5,  source: "MIX" },
  { question: "Abonnés impactés 4G",         count: 64,  trend: +12, source: "SF"  },
  { question: "Corrélations aujourd'hui",    count: 51,  trend: +8,  source: "MIX" },
  { question: "Résolution incident #4821",   count: 43,  trend: -2,  source: "DT"  },
  { question: "Historique service Recharge", count: 37,  trend: +4,  source: "SF"  },
  { question: "Alertes HIGH en cours",       count: 29,  trend: +22, source: "DT"  },
];

const CORRELATION_FEED = [
  { id: "C-0412", service: "Paiement mobile", dt: "Timeout API gateway",      sf: "47 tickets ouverts",     conf: 94, level: "HIGH", ago: "2 min" },
  { id: "C-0411", service: "SMS / OTP",       dt: "Latence SMSC > 2s",        sf: "28 tickets 'SMS non reçu'", conf: 89, level: "HIGH", ago: "17 min" },
  { id: "C-0410", service: "Réseau 4G",       dt: "Perte paquets +12%",       sf: "19 tickets connexion",   conf: 76, level: "MED",  ago: "41 min" },
  { id: "C-0409", service: "Recharge",        dt: "Erreur balance crédit",     sf: "22 tickets recharge",    conf: 82, level: "MED",  ago: "1h 03" },
  { id: "C-0408", service: "VoLTE",           dt: "IMS-CSCF saturation",      sf: "7 tickets appels",       conf: 91, level: "HIGH", ago: "2h 15" },
];

// ─── SUB-COMPONENTS ─────────────────────────────────────────────────────────

const tt = {
  contentStyle: {
    background: "hsl(var(--surface-elevated))",
    border: "1px solid hsl(var(--border))",
    borderRadius: 10,
    fontSize: 11,
  },
  labelStyle: { color: "hsl(var(--muted-foreground))", fontSize: 10 },
};

function KpiBlock({
  label, value, sub, color, delay = 0,
}: { label: string; value: string | number; sub: string; color: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000, duration: 0.45 }}
      className="glass rounded-2xl p-5 flex flex-col gap-2"
    >
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">{label}</span>
      <span className="text-3xl font-bold tabular-nums" style={{ color }}>{value}</span>
      <span className="text-xs text-muted-foreground">{sub}</span>
    </motion.div>
  );
}

function SeverityPill({ level }: { level: string }) {
  const map: Record<string, string> = {
    HIGH: "bg-danger/15 text-danger",
    MED:  "bg-warning/15 text-warning",
    LOW:  "bg-success/15 text-success",
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${map[level] ?? ""}`}>
      {level}
    </span>
  );
}

function SourcePill({ source }: { source: string }) {
  const map: Record<string, string> = {
    DT:  "bg-primary/10 text-primary",
    SF:  "bg-accent/10 text-accent",
    MIX: "bg-orange-500/10 text-orange-400",
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${map[source] ?? ""}`}>
      {source}
    </span>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function Dashboard() {
  const [period, setPeriod] = useState<"today" | "week" | "month">("today");
  const [liveAgo, setLiveAgo] = useState(4);

  useEffect(() => {
    const t = setInterval(() => setLiveAgo(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const kpis = [
    { label: "Incidents Dynatrace",    value: 247,   sub: "+31 vs hier · 8 actifs",           color: "hsl(var(--primary))" },
    { label: "Tickets Salesforce",     value: 1_342, sub: "47 ouverts · 12 en escalade",       color: "hsl(var(--accent))"  },
    { label: "Services impactés",      value: 6,     sub: "sur 18 services surveillés",        color: "#D85A30"              },
    { label: "Questions chatbot",      value: 522,   sub: "aujourd'hui · +18% vs hier",        color: "#7F77DD"              },
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">

      {/* ── HEADER ── */}
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vue d'ensemble des opérations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Corrélation en temps réel Dynatrace × Salesforce
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 glass rounded-xl p-1">
            {(["today", "week", "month"] as const).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  period === p
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {p === "today" ? "Aujourd'hui" : p === "week" ? "Semaine" : "Mois"}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground glass px-3 py-2 rounded-xl">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            En direct · {liveAgo}s
          </div>
        </div>
      </div>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => <KpiBlock key={k.label} {...k} delay={i * 80} />)}
      </div>

      {/* ── VOLUME CHART ── */}
      <ChartCard
        title="Volume incidents DT vs tickets SF vs corrélations"
        subtitle={`${period === "today" ? "15 derniers jours" : period === "week" ? "8 dernières semaines" : "12 derniers mois"} · données croisées`}
        delay={0.1}
        action={
          <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-primary opacity-70" />DT incidents</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-accent opacity-70" />SF tickets</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-orange-400 opacity-70" />Corrélations</span>
          </div>
        }
      >
        <div className="h-72">
          <ResponsiveContainer>
            <ComposedChart data={INCIDENT_VOLUME} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="gDT" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gSF" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip {...tt} />
              <Area type="monotone" dataKey="dynatrace" name="Incidents DT" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#gDT)" />
              <Area type="monotone" dataKey="salesforce" name="Tickets SF"  stroke="hsl(var(--accent))"  strokeWidth={2} fill="url(#gSF)" />
              <Line type="monotone" dataKey="correlations" name="Corrélations" stroke="#D85A30" strokeWidth={2} dot={{ r: 3, fill: "#D85A30" }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* ── ROW : PieChart + Services ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Distribution sources */}
        <ChartCard title="Origine des corrélations" subtitle="Dynatrace · Salesforce · Mixte" delay={0.15}>
          <div className="h-56 relative">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={SOURCE_DATA} dataKey="value" innerRadius={52} outerRadius={84} paddingAngle={3} stroke="none">
                  {SOURCE_DATA.map((s, i) => <Cell key={i} fill={s.color} />)}
                </Pie>
                <Tooltip {...tt} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold">247</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">corrélations</span>
            </div>
          </div>
          <div className="space-y-2 mt-2">
            {SOURCE_DATA.map(s => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-sm" style={{ background: s.color }} />
                  <span className="text-muted-foreground">{s.name}</span>
                </div>
                <span className="tabular-nums font-semibold">{s.value}%</span>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Services DT vs SF */}
        <ChartCard title="Services impactés" subtitle="Incidents DT vs tickets SF" delay={0.2} className="lg:col-span-2">
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={SERVICES_DATA} layout="vertical" margin={{ top: 0, right: 40, left: 10, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis
                  dataKey="service"
                  type="category"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  width={110}
                />
                <Tooltip {...tt} />
                <Bar dataKey="dt" name="Incidents DT" fill="hsl(var(--primary))" opacity={0.85} radius={[0, 4, 4, 0]} barSize={10} />
                <Bar dataKey="sf" name="Tickets SF"   fill="hsl(var(--accent))"  opacity={0.85} radius={[0, 4, 4, 0]} barSize={10} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-1 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-primary opacity-80" />Incidents Dynatrace</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-accent opacity-80" />Tickets Salesforce</span>
          </div>
        </ChartCard>
      </div>

      {/* ── ROW : Corrélation feed + Questions chatbot ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Dernières corrélations */}
        <ChartCard title="Flux de corrélations" subtitle="Incidents DT × tickets SF · temps réel" delay={0.25}>
          <div className="space-y-2 mt-1">
            {CORRELATION_FEED.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.07 }}
                className="flex items-start gap-3 p-3 rounded-xl glass hover:bg-surface/60 transition-all group"
              >
                <div className="flex flex-col items-center gap-1 pt-0.5">
                  <SeverityPill level={c.level} />
                  <span className="text-[9px] text-muted-foreground tabular-nums">{c.conf}%</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-mono text-muted-foreground">{c.id}</span>
                    <span className="text-xs font-medium truncate">{c.service}</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">
                    <span className="text-primary/80">DT</span> {c.dt}
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">
                    <span className="text-accent/80">SF</span> {c.sf}
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0 pt-0.5">{c.ago}</span>
              </motion.div>
            ))}
          </div>
        </ChartCard>

        {/* Questions populaires chatbot */}
        <ChartCard title="Questions populaires — chatbot IA" subtitle="Requêtes les plus fréquentes aujourd'hui" delay={0.3}>
          <div className="space-y-1.5 mt-1">
            {CHAT_QUESTIONS.map((q, i) => {
              const max = CHAT_QUESTIONS[0].count;
              const pct = Math.round((q.count / max) * 100);
              return (
                <motion.div
                  key={q.question}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.06 }}
                  className="flex items-center gap-3 py-1.5"
                >
                  <span className="text-[10px] font-mono text-muted-foreground/50 w-4 shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs truncate">{q.question}</span>
                      <SourcePill source={q.source} />
                    </div>
                    <div className="h-1.5 rounded-full bg-surface overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.5 + i * 0.06, duration: 0.6, ease: "easeOut" }}
                        className="h-full rounded-full bg-primary/60"
                      />
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-xs font-semibold tabular-nums">{q.count}</div>
                    <div className={`text-[9px] tabular-nums ${q.trend > 0 ? "text-success" : "text-danger"}`}>
                      {q.trend > 0 ? "+" : ""}{q.trend}%
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </ChartCard>
      </div>

      {/* ── INCIDENTS TABLE ── */}
      <IncidentsTable limit={8} />
    </div>
  );
}