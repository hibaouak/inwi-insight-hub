import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Activity, Brain, Gauge, Database, Search, GitMerge, Wrench, Zap, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/Logo";
import { useEffect, useState } from "react";

const useCounter = (target: number, duration = 1600) => {
  const [v, setV] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setV(Math.floor(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return v;
};

const Stat = ({ value, suffix, label }: { value: number; suffix?: string; label: string }) => {
  const v = useCounter(value);
  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-gradient">{v.toLocaleString()}{suffix}</div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  );
};

const features = [
  { icon: GitMerge, title: "Unified Correlation Engine", desc: "Real-time fusion of Dynatrace traces and Salesforce tickets through a single semantic graph." },
  { icon: Brain, title: "AI Root Cause Analysis", desc: "LangChain agent orchestrating GPT-4 / Claude to surface root causes in plain language." },
  { icon: Gauge, title: "Predictive Impact Scoring", desc: "ML model forecasting customer-facing impact before complaints reach your call center." },
];

const steps = [
  { icon: Database, title: "Ingest", desc: "Pull from Dynatrace API + Salesforce API in real time." },
  { icon: Search, title: "Detect", desc: "AI pattern matching and anomaly detection across signals." },
  { icon: GitMerge, title: "Correlate", desc: "LLM links technical events to customer impact." },
  { icon: Wrench, title: "Resolve", desc: "Actionable recommendations with 1-click ticket creation." },
  { icon: Zap, title: "Learn", desc: "Feedback loop continuously improves model accuracy." },
];

export default function Landing() {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Nav */}
      <nav className="sticky top-0 z-40 glass-strong border-b border-border/40">
        <div className="container flex items-center justify-between h-16">
          <Logo />
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#dashboard" className="hover:text-foreground transition-colors">Platform</a>
            <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/app">Sign in</Link>
            </Button>
            <Button asChild size="sm" className="bg-gradient-primary hover:opacity-90 shadow-glow-soft">
              <Link to="/app">Launch app <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-20 pb-32">
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="absolute inset-0 bg-gradient-hero opacity-80" />
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium mb-8">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Powered by LangChain + GPT-4</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
              <span className="text-muted-foreground">v2.0 now live</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
              The intelligence layer
              <br />
              <span className="text-gradient">for telecom operations</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
              Correlate Dynatrace incidents with Salesforce complaints in real time.
              Resolve in minutes, not hours.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-20">
              <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 shadow-glow h-12 px-7 text-base">
                <Link to="/app">Start free trial <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="glass border-border/60 h-12 px-7 text-base">
                <Link to="/app/chat"><Play className="mr-1.5 h-4 w-4" /> Watch demo</Link>
              </Button>
            </div>
          </motion.div>

          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="relative max-w-5xl mx-auto"
          >
            <div className="absolute -inset-x-20 -inset-y-10 bg-primary/20 blur-3xl -z-10 rounded-full" />
            <div className="glass-strong rounded-2xl p-2 shadow-card">
              <div className="rounded-xl overflow-hidden bg-background/80 border border-border/40">
                <DashboardMock />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TRUST */}
      <section className="py-16 border-y border-border/40 bg-surface/30">
        <div className="container">
          <p className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-10">Trusted by 200+ telecom engineers across MENA</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <Stat value={94} suffix="%" label="Reduction in MTTR" />
            <Stat value={12000} suffix="+" label="Incidents correlated" />
            <Stat value={3} suffix=".2x" label="Faster resolution" />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-32">
        <div className="container">
          <div className="max-w-2xl mb-16">
            <div className="text-xs uppercase tracking-widest text-primary mb-3">Platform</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Built for the network operations center of the future.</h2>
            <p className="text-muted-foreground text-lg">Three engines, one unified view of your network and your customers.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass rounded-2xl p-7 glow-hover group"
              >
                <div className="h-11 w-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:shadow-glow transition-shadow">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section id="dashboard" className="py-24">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">See your entire network health <span className="text-gradient">at a glance.</span></h2>
            <p className="text-muted-foreground text-lg">Executive-grade dashboards with live correlation streams.</p>
          </div>
          <div className="glass-strong rounded-2xl p-2 max-w-6xl mx-auto shadow-card relative">
            <div className="absolute -inset-10 bg-primary/15 blur-3xl -z-10" />
            <div className="rounded-xl overflow-hidden border border-border/40">
              <DashboardMock tall />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-32 relative">
        <div className="container">
          <div className="text-center mb-16">
            <div className="text-xs uppercase tracking-widest text-primary mb-3">Pipeline</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">How it works.</h2>
          </div>
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent hidden md:block" />
            <div className="space-y-12">
              {steps.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className={`flex flex-col md:flex-row items-center gap-6 ${i % 2 === 0 ? "" : "md:flex-row-reverse"}`}
                >
                  <div className="flex-1 md:px-12">
                    <div className={`glass rounded-2xl p-6 ${i % 2 === 0 ? "md:text-right" : ""}`}>
                      <div className="text-xs text-primary font-mono mb-1">0{i + 1}</div>
                      <h3 className="text-2xl font-semibold mb-1">{s.title}</h3>
                      <p className="text-muted-foreground">{s.desc}</p>
                    </div>
                  </div>
                  <div className="relative h-14 w-14 shrink-0 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow z-10">
                    <s.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-90" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="container relative text-center">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-white">Ready to transform your NOC?</h2>
          <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">Join engineers cutting MTTR by 94%. Set up in under 10 minutes.</p>
          <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <Input
              type="email"
              required
              placeholder="you@operator.com"
              className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/60 backdrop-blur-md"
            />
            <Button size="lg" className="h-12 bg-background hover:bg-background/90 text-foreground">Request access</Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-border/40">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <Logo />
          <div>© {new Date().getFullYear()} inwi·IA — Internal telecom intelligence platform.</div>
        </div>
      </footer>
    </div>
  );
}

function DashboardMock({ tall = false }: { tall?: boolean }) {
  return (
    <div className={`bg-background ${tall ? "h-[520px]" : "h-[420px]"} relative`}>
      <div className="absolute inset-0 flex">
        <div className="w-12 border-r border-border/40 bg-sidebar/50 py-3 flex flex-col items-center gap-3">
          {[0, 1, 2, 3].map(i => <div key={i} className={`h-7 w-7 rounded-md ${i === 0 ? "bg-primary/20" : "bg-surface"}`} />)}
        </div>
        <div className="flex-1 p-4 space-y-3 overflow-hidden">
          <div className="grid grid-cols-4 gap-3">
            {[247, 12430, 14, 8].map((n, i) => (
              <div key={i} className="glass rounded-lg p-3">
                <div className="text-[9px] text-muted-foreground uppercase tracking-wider">KPI {i + 1}</div>
                <div className="text-lg font-bold mt-0.5">{n.toLocaleString()}</div>
                <div className="mt-1 h-5 flex items-end gap-px">
                  {Array.from({ length: 12 }).map((_, j) => (
                    <div key={j} className="flex-1 bg-primary/40 rounded-sm" style={{ height: `${30 + Math.sin(i + j) * 30 + 30}%` }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="glass rounded-lg p-3 h-40 relative overflow-hidden">
            <div className="text-xs text-muted-foreground mb-2">Incident Volume — Last 30d</div>
            <svg viewBox="0 0 400 100" className="w-full h-24" preserveAspectRatio="none">
              <defs>
                <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="hsl(277 100% 50%)" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="hsl(277 100% 50%)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,80 C40,60 80,70 120,40 S200,20 240,50 320,30 400,45 L400,100 L0,100 Z" fill="url(#g1)" />
              <path d="M0,80 C40,60 80,70 120,40 S200,20 240,50 320,30 400,45" stroke="hsl(277 100% 65%)" strokeWidth="1.5" fill="none" />
            </svg>
          </div>
          {tall && (
            <div className="grid grid-cols-3 gap-3">
              <div className="glass rounded-lg p-3 h-32" />
              <div className="glass rounded-lg p-3 h-32" />
              <div className="glass rounded-lg p-3 h-32" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
