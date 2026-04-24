import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User, Lock, Bell, Palette, Link2, Save, Check, Eye, EyeOff,
  Shield, Database, Zap, CheckCircle2, XCircle, UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

type Tab = "compte" | "profil" | "securite" | "notifications" | "apparence" | "integrations";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "compte", label: "Compte", icon: UserCheck },
  { id: "profil", label: "Profil", icon: User },
  { id: "securite", label: "Sécurité", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "apparence", label: "Apparence", icon: Palette },
  { id: "integrations", label: "Intégrations", icon: Link2 },
];

function SaveBanner({ saved }: { saved: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: saved ? 1 : 0, y: saved ? 0 : -8 }}
      className="flex items-center gap-2 text-xs text-success"
    >
      <Check className="h-3.5 w-3.5" />
      Modifications enregistrées
    </motion.div>
  );
}

function SectionCard({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-6 border border-border/40">
      <div className="mb-5">
        <h3 className="text-sm font-semibold">{title}</h3>
        {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

/* ─── COMPTE ─── */
interface StoredUser { name: string; email: string; password: string; role: "admin" | "technician" }

function TabCompte() {
  const { user, isAdmin } = useAuth();
  const [allUsers, setAllUsers] = useState<StoredUser[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("inwi_users");
    if (stored) setAllUsers(JSON.parse(stored));
  }, []);

  const adminCount = allUsers.filter(u => u.role === "admin").length;
  const techCount = allUsers.filter(u => u.role === "technician").length;

  return (
    <div className="space-y-4">
      <SectionCard title="Informations d'inscription" desc="Données associées à votre compte.">
        <div className="space-y-3">
          {[
            { label: "Nom complet", value: user?.name },
            { label: "Adresse e-mail", value: user?.email },
            { label: "Rôle", value: user?.role === "admin" ? "Administrateur" : "Technicien" },
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between py-2.5 border-b border-border/30 last:border-0">
              <span className="text-xs text-muted-foreground">{row.label}</span>
              <span className={cn(
                "text-xs font-medium px-2.5 py-1 rounded-md",
                row.label === "Rôle"
                  ? user?.role === "admin"
                    ? "bg-warning/15 text-warning"
                    : "bg-success/15 text-success"
                  : "text-foreground"
              )}>
                {row.value ?? "—"}
              </span>
            </div>
          ))}
        </div>
      </SectionCard>

      {isAdmin && (
        <SectionCard title="Utilisateurs enregistrés" desc="Vue d'ensemble de tous les comptes de la plateforme.">
          <div className="flex gap-4 mb-5">
            <div className="flex-1 glass rounded-xl p-4 border border-border/40 text-center">
              <div className="text-2xl font-bold text-primary">{allUsers.length}</div>
              <div className="text-xs text-muted-foreground mt-1">Total</div>
            </div>
            <div className="flex-1 glass rounded-xl p-4 border border-border/40 text-center">
              <div className="text-2xl font-bold text-warning">{adminCount}</div>
              <div className="text-xs text-muted-foreground mt-1">Admins</div>
            </div>
            <div className="flex-1 glass rounded-xl p-4 border border-border/40 text-center">
              <div className="text-2xl font-bold text-success">{techCount}</div>
              <div className="text-xs text-muted-foreground mt-1">Techniciens</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="text-left pb-2 text-xs text-muted-foreground font-medium">Nom</th>
                  <th className="text-left pb-2 text-xs text-muted-foreground font-medium">Email</th>
                  <th className="text-left pb-2 text-xs text-muted-foreground font-medium">Rôle</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-xs text-muted-foreground">
                      Aucun utilisateur enregistré.
                    </td>
                  </tr>
                )}
                {allUsers.map(u => (
                  <tr key={u.email} className="border-b border-border/20 last:border-0 hover:bg-surface/30 transition-colors">
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-gradient-primary flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                          {u.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                        </div>
                        <span className="text-xs font-medium">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 text-xs text-muted-foreground">{u.email}</td>
                    <td className="py-2.5">
                      <span className={cn(
                        "text-[10px] font-semibold px-2 py-0.5 rounded-md",
                        u.role === "admin" ? "bg-warning/15 text-warning" : "bg-success/15 text-success"
                      )}>
                        {u.role === "admin" ? "Admin" : "Technicien"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}
    </div>
  );
}

/* ─── PROFIL ─── */
function TabProfil() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    role: user?.role ?? "",
  });
  const [saved, setSaved] = useState(false);

  type UserRole = typeof user extends { role?: infer R } ? R : never;

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name: form.name,
      email: form.email,
      role: form.role === "" ? undefined : (form.role as UserRole),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={save} className="space-y-4">
      <SectionCard title="Informations personnelles" desc="Modifiez votre nom, e-mail et rôle.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Nom complet</Label>
            <Input value={form.name} onChange={set("name")} className="bg-surface/60 border-border/60 focus-visible:ring-primary/50" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Adresse e-mail</Label>
            <Input type="email" value={form.email} onChange={set("email")} className="bg-surface/60 border-border/60 focus-visible:ring-primary/50" />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs text-muted-foreground">Rôle / Poste</Label>
            <Input value={form.role} onChange={set("role")} placeholder="ex. NOC Analyst" className="bg-surface/60 border-border/60 focus-visible:ring-primary/50" />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Avatar" desc="Votre avatar est généré automatiquement à partir de vos initiales.">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center text-xl font-bold shadow-glow-soft">
            {form.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
          </div>
          <div>
            <p className="text-sm font-medium">{form.name || "—"}</p>
            <p className="text-xs text-muted-foreground">{form.role || "—"}</p>
          </div>
        </div>
      </SectionCard>

      <div className="flex items-center justify-between pt-1">
        <SaveBanner saved={saved} />
        <Button type="submit" className="bg-gradient-primary hover:opacity-90 shadow-glow-soft gap-2">
          <Save className="h-4 w-4" /> Enregistrer
        </Button>
      </div>
    </form>
  );
}

/* ─── SÉCURITÉ ─── */
function TabSecurite() {
  const { changePassword } = useAuth();
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.next.length < 6) return setError("Le nouveau mot de passe doit contenir au moins 6 caractères.");
    if (form.next !== form.confirm) return setError("Les mots de passe ne correspondent pas.");
    const ok = changePassword(form.current, form.next);
    if (!ok) return setError("Mot de passe actuel incorrect.");
    setForm({ current: "", next: "", confirm: "" });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={save} className="space-y-4">
      <SectionCard title="Changer le mot de passe" desc="Utilisez un mot de passe fort d'au moins 6 caractères.">
        <div className="space-y-4 max-w-sm">
          {(["current", "next", "confirm"] as const).map((k, i) => (
            <div key={k} className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                {k === "current" ? "Mot de passe actuel" : k === "next" ? "Nouveau mot de passe" : "Confirmer le nouveau mot de passe"}
              </Label>
              <div className="relative">
                <Input
                  type={show ? "text" : "password"}
                  value={form[k]}
                  onChange={set(k)}
                  className="bg-surface/60 border-border/60 focus-visible:ring-primary/50 pr-10"
                  required
                  autoComplete={i === 0 ? "current-password" : "new-password"}
                />
                {i === 0 && (
                  <button type="button" onClick={() => setShow(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                )}
              </div>
            </div>
          ))}
          {error && <p className="text-xs text-danger bg-danger/10 border border-danger/20 rounded-lg px-3 py-2">{error}</p>}
        </div>
      </SectionCard>

      <SectionCard title="Sessions actives" desc="Appareils actuellement connectés à votre compte.">
        <div className="space-y-2">
          {[
            { device: "Chrome · Windows 11", location: "Casablanca, MA", current: true },
            { device: "Firefox · macOS", location: "Rabat, MA", current: false },
          ].map(s => (
            <div key={s.device} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
              <div>
                <p className="text-xs font-medium flex items-center gap-2">
                  {s.device}
                  {s.current && <span className="text-[9px] bg-success/20 text-success px-1.5 py-0.5 rounded font-semibold">Session actuelle</span>}
                </p>
                <p className="text-[10px] text-muted-foreground">{s.location}</p>
              </div>
              {!s.current && (
                <Button size="sm" variant="ghost" className="h-7 text-[11px] text-danger hover:bg-danger/10 hover:text-danger">
                  Révoquer
                </Button>
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="flex items-center justify-between pt-1">
        <SaveBanner saved={saved} />
        <Button type="submit" className="bg-gradient-primary hover:opacity-90 shadow-glow-soft gap-2">
          <Shield className="h-4 w-4" /> Mettre à jour
        </Button>
      </div>
    </form>
  );
}

/* ─── NOTIFICATIONS ─── */
type NotifKey = "incidents_critiques" | "incidents_hauts" | "resolution" | "correlation" | "email_digest" | "push";

function TabNotifications() {
  const [prefs, setPrefs] = useState<Record<NotifKey, boolean>>({
    incidents_critiques: true,
    incidents_hauts: true,
    resolution: false,
    correlation: true,
    email_digest: false,
    push: true,
  });
  const [saved, setSaved] = useState(false);

  const toggle = (k: NotifKey) => setPrefs(p => ({ ...p, [k]: !p[k] }));

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const items: { key: NotifKey; label: string; desc: string }[] = [
    { key: "incidents_critiques", label: "Incidents critiques", desc: "Alerté immédiatement pour tout incident de sévérité critique." },
    { key: "incidents_hauts", label: "Incidents élevés", desc: "Notifications pour les incidents de sévérité haute." },
    { key: "resolution", label: "Résolution d'incident", desc: "Notifié quand un incident que vous suivez est résolu." },
    { key: "correlation", label: "Nouvelles corrélations IA", desc: "Alerté quand l'IA détecte une nouvelle corrélation importante." },
    { key: "email_digest", label: "Résumé quotidien par e-mail", desc: "Récapitulatif des incidents et métriques chaque matin." },
    { key: "push", label: "Notifications push", desc: "Notifications en temps réel dans le navigateur." },
  ];

  return (
    <div className="space-y-4">
      <SectionCard title="Préférences de notification" desc="Choisissez quand et comment être alerté.">
        <div className="space-y-4">
          {items.map(item => (
            <div key={item.key} className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <Switch checked={prefs[item.key]} onCheckedChange={() => toggle(item.key)} />
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="flex items-center justify-between pt-1">
        <SaveBanner saved={saved} />
        <Button onClick={save} className="bg-gradient-primary hover:opacity-90 shadow-glow-soft gap-2">
          <Save className="h-4 w-4" /> Enregistrer
        </Button>
      </div>
    </div>
  );
}

/* ─── APPARENCE ─── */
function TabApparence() {
  const [density, setDensity] = useState<"comfortable" | "compact">("comfortable");
  const [lang, setLang] = useState<"fr" | "ar" | "en">("fr");
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-4">
      <SectionCard title="Thème" desc="L'interface utilise toujours le mode sombre optimisé pour les opérations NOC.">
        <div className="flex items-center gap-3">
          <div className="h-16 w-28 rounded-xl bg-background border border-primary shadow-glow-soft flex items-center justify-center">
            <span className="text-[10px] text-primary font-semibold">Sombre · actif</span>
          </div>
          <div className="h-16 w-28 rounded-xl bg-zinc-100 border border-border/40 flex items-center justify-center opacity-40 cursor-not-allowed">
            <span className="text-[10px] text-zinc-500 font-semibold">Clair · bientôt</span>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Densité d'affichage" desc="Ajustez l'espacement entre les éléments.">
        <div className="flex gap-3">
          {(["comfortable", "compact"] as const).map(d => (
            <button
              key={d}
              onClick={() => setDensity(d)}
              className={cn(
                "flex-1 py-3 rounded-xl text-xs font-medium border transition-all",
                density === d
                  ? "border-primary bg-primary/10 text-primary shadow-glow-soft"
                  : "border-border/40 text-muted-foreground hover:border-border"
              )}
            >
              {d === "comfortable" ? "Confortable" : "Compact"}
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Langue de l'interface" desc="Choisissez la langue d'affichage.">
        <div className="flex gap-3">
          {([
            { id: "fr", label: "Français" },
            { id: "ar", label: "العربية" },
            { id: "en", label: "English" },
          ] as const).map(l => (
            <button
              key={l.id}
              onClick={() => setLang(l.id)}
              className={cn(
                "flex-1 py-3 rounded-xl text-xs font-medium border transition-all",
                lang === l.id
                  ? "border-primary bg-primary/10 text-primary shadow-glow-soft"
                  : "border-border/40 text-muted-foreground hover:border-border"
              )}
            >
              {l.label}
            </button>
          ))}
        </div>
      </SectionCard>

      <div className="flex items-center justify-between pt-1">
        <SaveBanner saved={saved} />
        <Button onClick={save} className="bg-gradient-primary hover:opacity-90 shadow-glow-soft gap-2">
          <Save className="h-4 w-4" /> Enregistrer
        </Button>
      </div>
    </div>
  );
}

/* ─── INTÉGRATIONS ─── */
function TabIntegrations() {
  const integrations = [
    {
      name: "Dynatrace",
      desc: "Surveillance des performances et alertes réseau en temps réel.",
      icon: Zap,
      color: "text-primary",
      bg: "bg-primary/10",
      status: "connected" as const,
      endpoint: "https://abc123.live.dynatrace.com",
    },
    {
      name: "Salesforce",
      desc: "Tickets clients, cas ouverts et historique des plaintes.",
      icon: Database,
      color: "text-accent",
      bg: "bg-accent/10",
      status: "connected" as const,
      endpoint: "https://inwi.my.salesforce.com",
    },
    {
      name: "PagerDuty",
      desc: "Gestion des escalades et astreintes on-call.",
      icon: Bell,
      color: "text-warning",
      bg: "bg-warning/10",
      status: "disconnected" as const,
      endpoint: "",
    },
  ];

  const [endpoints, setEndpoints] = useState(
    Object.fromEntries(integrations.map(i => [i.name, i.endpoint]))
  );

  return (
    <div className="space-y-4">
      {integrations.map(integ => (
        <SectionCard key={integ.name} title={integ.name} desc={integ.desc}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", integ.bg)}>
              <integ.icon className={cn("h-5 w-5", integ.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <Input
                value={endpoints[integ.name]}
                onChange={e => setEndpoints(p => ({ ...p, [integ.name]: e.target.value }))}
                placeholder="URL de l'endpoint API"
                className="bg-surface/60 border-border/60 focus-visible:ring-primary/50 text-xs"
              />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={cn(
                "flex items-center gap-1.5 text-xs font-medium",
                integ.status === "connected" ? "text-success" : "text-muted-foreground"
              )}>
                {integ.status === "connected"
                  ? <><CheckCircle2 className="h-3.5 w-3.5" /> Connecté</>
                  : <><XCircle className="h-3.5 w-3.5" /> Déconnecté</>
                }
              </span>
              <Button
                size="sm"
                variant={integ.status === "connected" ? "outline" : "default"}
                className={cn("h-8 text-xs", integ.status !== "connected" && "bg-gradient-primary hover:opacity-90")}
              >
                {integ.status === "connected" ? "Tester" : "Connecter"}
              </Button>
            </div>
          </div>
        </SectionCard>
      ))}
    </div>
  );
}

/* ─── MAIN ─── */
export default function Settings() {
  const [activeTab, setActiveTab] = useState<Tab>("compte");

  const panels: Record<Tab, React.ReactNode> = {
    compte: <TabCompte />,
    profil: <TabProfil />,
    securite: <TabSecurite />,
    notifications: <TabNotifications />,
    apparence: <TabApparence />,
    integrations: <TabIntegrations />,
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Paramètres</h1>
        <p className="text-sm text-muted-foreground mt-1">Gérez votre compte, sécurité et préférences.</p>
      </div>

      <div className="flex gap-6 flex-col md:flex-row">
        {/* Nav */}
        <nav className="md:w-48 shrink-0">
          <ul className="space-y-1">
            {TABS.map(tab => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                    activeTab === tab.id
                      ? "bg-primary/10 text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-surface/60"
                  )}
                >
                  {activeTab === tab.id && (
                    <span className="absolute left-0 h-5 w-[3px] rounded-r-full bg-primary" />
                  )}
                  <tab.icon className={cn("h-4 w-4 shrink-0", activeTab === tab.id && "text-primary")} />
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {panels[activeTab]}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
