import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowUpRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface Props {
  label: string;
  value: number;
  suffix?: string;
  delta: number;
  trend: "up" | "down";
  good?: boolean;
  sparkline: number[];
  delay?: number;
}

export function KpiCard({ label, value, suffix, delta, trend, good, sparkline, delay = 0 }: Props) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const dur = 1400;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setV(Math.floor(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    const timeout = setTimeout(() => { raf = requestAnimationFrame(tick); }, delay);
    return () => { clearTimeout(timeout); cancelAnimationFrame(raf); };
  }, [value, delay]);

  const positive = good ?? trend === "up";
  const Icon = trend === "up" ? ArrowUpRight : ArrowDownRight;
  const data = sparkline.map((v, i) => ({ i, v }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      className="relative glass rounded-2xl p-5 glow-hover group overflow-hidden"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</div>
        <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:shadow-glow-soft transition-shadow">
          <TrendingUp className="h-3.5 w-3.5 text-primary" />
        </div>
      </div>
      <div className="flex items-baseline gap-1 mb-3">
        <span className="text-3xl font-bold tracking-tight tabular-nums">{v.toLocaleString()}</span>
        {suffix && <span className="text-lg font-semibold text-muted-foreground">{suffix}</span>}
      </div>
      <div className="flex items-end justify-between gap-3">
        <div className={cn(
          "inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-md",
          positive ? "text-success bg-success/10" : "text-danger bg-danger/10"
        )}>
          <Icon className="h-3 w-3" />
          {Math.abs(delta)}%
        </div>
        <div className="h-9 w-24 -mr-1 -mb-1">
          <ResponsiveContainer>
            <LineChart data={data}>
              <Line type="monotone" dataKey="v" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
