import { useState } from "react";
import { motion } from "framer-motion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Download, MoreHorizontal, Search, ChevronRight } from "lucide-react";
import { INCIDENTS, Incident } from "@/lib/mockData";
import { SeverityBadge, StatusBadge, SourceBadge } from "./Badges";
import { cn } from "@/lib/utils";

const fmtTime = (iso: string) => {
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 60000;
  if (diff < 60) return `${Math.floor(diff)}m ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)}d ago`;
};

export function IncidentsTable({ limit }: { limit?: number }) {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Incident | null>(null);

  const filtered = INCIDENTS.filter(i =>
    !q || i.id.toLowerCase().includes(q.toLowerCase()) || i.service.toLowerCase().includes(q.toLowerCase())
  );
  const display = limit ? filtered.slice(0, limit) : filtered;

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="p-4 flex items-center gap-3 border-b border-border/50">
        <h3 className="font-semibold">Recent Incidents</h3>
        <span className="text-xs text-muted-foreground">{filtered.length} total</span>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="h-8 pl-8 w-48 bg-surface/60 text-xs" />
          </div>
          <Button size="sm" variant="ghost" className="h-8 gap-1.5 text-xs"><Filter className="h-3.5 w-3.5" />Filter</Button>
          <Button size="sm" variant="ghost" className="h-8 gap-1.5 text-xs"><Download className="h-3.5 w-3.5" />Export</Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-[10px] uppercase tracking-wider">ID</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider">Service</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider">Severity</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider text-right">Customers</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider">Source</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider">Status</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider">Started</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider text-right">MTTR</TableHead>
              <TableHead className="w-8" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {display.map((inc) => (
              <TableRow
                key={inc.id}
                onClick={() => setSelected(inc)}
                className="border-border/40 cursor-pointer hover:bg-primary/5 group"
              >
                <TableCell className="font-mono text-xs text-muted-foreground py-3">{inc.id}</TableCell>
                <TableCell className="font-medium text-sm">{inc.service}</TableCell>
                <TableCell><SeverityBadge severity={inc.severity} /></TableCell>
                <TableCell className="text-right tabular-nums text-sm">{inc.customers.toLocaleString()}</TableCell>
                <TableCell><SourceBadge source={inc.source} /></TableCell>
                <TableCell><StatusBadge status={inc.status} /></TableCell>
                <TableCell className="text-xs text-muted-foreground">{fmtTime(inc.startedAt)}</TableCell>
                <TableCell className="text-right text-xs tabular-nums">{inc.mttr}m</TableCell>
                <TableCell>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Slide-over */}
      <div
        className={cn(
          "fixed inset-0 z-50 transition-opacity",
          selected ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={() => setSelected(null)} />
        <motion.aside
          initial={false}
          animate={{ x: selected ? 0 : "100%" }}
          transition={{ type: "spring", stiffness: 240, damping: 28 }}
          className="absolute right-0 top-0 bottom-0 w-full max-w-md glass-strong border-l border-border overflow-y-auto"
        >
          {selected && (
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-xs font-mono text-muted-foreground">{selected.id}</div>
                  <h2 className="text-xl font-bold mt-1">{selected.service}</h2>
                  <div className="text-sm text-muted-foreground">{selected.region}</div>
                </div>
                <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">✕</button>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="glass rounded-lg p-3">
                  <div className="text-[10px] uppercase text-muted-foreground tracking-wider">Severity</div>
                  <div className="mt-2"><SeverityBadge severity={selected.severity} /></div>
                </div>
                <div className="glass rounded-lg p-3">
                  <div className="text-[10px] uppercase text-muted-foreground tracking-wider">Status</div>
                  <div className="mt-2"><StatusBadge status={selected.status} /></div>
                </div>
                <div className="glass rounded-lg p-3">
                  <div className="text-[10px] uppercase text-muted-foreground tracking-wider">Customers</div>
                  <div className="mt-1 text-lg font-bold tabular-nums">{selected.customers.toLocaleString()}</div>
                </div>
                <div className="glass rounded-lg p-3">
                  <div className="text-[10px] uppercase text-muted-foreground tracking-wider">MTTR</div>
                  <div className="mt-1 text-lg font-bold tabular-nums">{selected.mttr}m</div>
                </div>
              </div>
              <div className="glass rounded-lg p-4 mb-4">
                <div className="text-xs font-semibold mb-2 text-primary">AI Root Cause</div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Anomaly correlation detected a degradation in upstream <strong className="text-foreground">{selected.service}</strong> impacting {selected.customers.toLocaleString()} subscribers in {selected.region}. Salesforce ticket volume increased 3.4× in the same window, suggesting a confirmed customer-facing event.
                </p>
              </div>
              <Button className="w-full bg-gradient-primary">Open full incident</Button>
            </div>
          )}
        </motion.aside>
      </div>
    </div>
  );
}
