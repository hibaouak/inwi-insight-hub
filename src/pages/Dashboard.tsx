"use client";

import { useMemo } from "react";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { NetworkTopology } from "@/components/dashboard/NetworkTopology";
import { ImpactHeatmap } from "@/components/dashboard/ImpactHeatmap";
import { IncidentsTable } from "@/components/dashboard/IncidentsTable";
import { KPIS, INCIDENT_VOLUME, SOURCE_DISTRIBUTION, TOP_SERVICES, RESOLUTION_DIST } from "@/lib/mockData";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";

const tooltipStyle = {
  contentStyle: {
    background: "hsl(var(--surface-elevated))",
    border: "1px solid hsl(var(--border))",
    borderRadius: 12,
    fontSize: 12,
    boxShadow: "0 8px 24px hsl(240 50% 2% / 0.4)",
  },
  labelStyle: { color: "hsl(var(--muted-foreground))", fontSize: 10, marginBottom: 4 },
};

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vue d'ensemble des opérations</h1>
          <p className="text-sm text-muted-foreground mt-1">Corrélation en temps réel entre Dynatrace et Salesforce — dernières 24 heures</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse-glow" />
          En direct · synchronisé il y a 4s
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {KPIS.map((k, i) => <KpiCard key={k.label} {...k} delay={i * 120} />)}
      </div>

      {/* Big chart */}
      <ChartCard
        title="Volume d'incidents et taux de résolution"
        subtitle="30 derniers jours · pics signalés comme anomalies"
        delay={0.1}
        action={
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-primary" />Incidents</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-accent" />Résolution %</span>
          </div>
        }
      >
        <div className="h-72">
          <ResponsiveContainer>
            <ComposedChart data={INCIDENT_VOLUME} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="incArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="incidents" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#incArea)" />
              <Line type="monotone" dataKey="resolutionRate" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Row of 3 charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="Distribution des sources" subtitle="Origine des corrélations" delay={0.15}>
          <div className="h-60 relative">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={SOURCE_DISTRIBUTION} dataKey="value" innerRadius={56} outerRadius={86} paddingAngle={3} stroke="none">
                  {SOURCE_DISTRIBUTION.map((s, i) => <Cell key={i} fill={s.color} />)}
                </Pie>
                <Tooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-2xl font-bold">747</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Total aujourd'hui</div>
            </div>
          </div>
          <div className="space-y-1.5 mt-3">
            {SOURCE_DISTRIBUTION.map(s => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-sm" style={{ background: s.color }} />
                  <span>{s.name}</span>
                </div>
                <span className="tabular-nums font-medium">{s.value}%</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Services les plus impactés" subtitle="Cliquer pour explorer" delay={0.2}>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={TOP_SERVICES} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGrad" x1="0" x2="1">
                    <stop offset="0%" stopColor="hsl(277 100% 50%)" />
                    <stop offset="100%" stopColor="hsl(220 100% 60%)" />
                  </linearGradient>
                </defs>
                <XAxis type="number" hide />
                <YAxis dataKey="service" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} width={100} />
                <Tooltip {...tooltipStyle} cursor={{ fill: "hsl(var(--primary) / 0.05)" }} />
                <Bar dataKey="value" fill="url(#barGrad)" radius={[0, 8, 8, 0]} barSize={16}>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Distribution du temps de résolution" subtitle="Par tranche · 7 derniers jours" delay={0.25}>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={RESOLUTION_DIST} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(277 100% 65%)" />
                    <stop offset="100%" stopColor="hsl(277 100% 35%)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} vertical={false} />
                <XAxis dataKey="bucket" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip {...tooltipStyle} cursor={{ fill: "hsl(var(--primary) / 0.05)" }} />
                <Bar dataKey="count" fill="url(#histGrad)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Topology + heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="Carte de topologie réseau" subtitle="Santé des services & corrélations actives" className="lg:col-span-2 min-h-[380px]" delay={0.3}>
          <NetworkTopology />
        </ChartCard>

    </div>
  );
}