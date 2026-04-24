import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Users, Shield, Activity, Settings2, Trash2, CheckCircle2, XCircle, RefreshCw, UserPlus, Clock, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type UserRole = "admin" | "technician";

interface StoredUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

interface AuditEntry {
  id: string;
  event: string;
  user: string;
  date: string;
  type: "login" | "create" | "update" | "delete";
}

const INTEGRATIONS = [
  { name: "Dynatrace", status: true, endpoint: "https://dt.inwi.ma/api/v2", lastSync: "Il y a 2 min" },
  { name: "Salesforce", status: true, endpoint: "https://inwi.my.salesforce.com", lastSync: "Il y a 5 min" },
  { name: "PagerDuty", status: false, endpoint: "https://api.pagerduty.com/v2", lastSync: "Jamais" },
  { name: "Prometheus", status: true, endpoint: "https://metrics.inwi.ma:9090", lastSync: "Il y a 1 min" },
];

const TABS = ["users", "systemStatus", "auditLogs", "platformConfig"] as const;
type Tab = typeof TABS[number];

const EMPTY_FORM = { name: "", email: "", password: "", role: "" as UserRole | "" };

export default function Admin() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>("users");
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState(EMPTY_FORM);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState(false);
  const [auditLogs] = useState<AuditEntry[]>([
    { id: "1", event: t("admin.userLogin"), user: "admin@inwi.ma", date: "2026-04-23 09:12", type: "login" },
    { id: "2", event: t("admin.userCreated"), user: "admin@inwi.ma", date: "2026-04-22 15:30", type: "create" },
    { id: "3", event: t("admin.roleChanged"), user: "admin@inwi.ma", date: "2026-04-22 15:31", type: "update" },
    { id: "4", event: t("admin.settingUpdated"), user: "admin@inwi.ma", date: "2026-04-21 10:05", type: "update" },
    { id: "5", event: t("admin.passwordChanged"), user: "tech@inwi.ma", date: "2026-04-20 08:22", type: "update" },
    { id: "6", event: t("admin.userLogin"), user: "tech@inwi.ma", date: "2026-04-23 08:55", type: "login" },
  ]);

  useEffect(() => {
    const stored = localStorage.getItem("inwi_users");
    if (stored) setUsers(JSON.parse(stored));
  }, []);

  const deleteUser = (email: string) => {
    const updated = users.filter(u => u.email !== email);
    setUsers(updated);
    localStorage.setItem("inwi_users", JSON.stringify(updated));
    setConfirmDelete(null);
  };

  const changeRole = (email: string, role: UserRole) => {
    const updated = users.map(u => u.email === email ? { ...u, role } : u);
    setUsers(updated);
    localStorage.setItem("inwi_users", JSON.stringify(updated));
  };

  const setField = (k: keyof typeof EMPTY_FORM) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setCreateForm(f => ({ ...f, [k]: e.target.value }));

  const submitCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    if (!createForm.name.trim()) return setCreateError("Le nom est requis.");
    if (!createForm.email.includes("@")) return setCreateError("Email invalide.");
    if (createForm.password.length < 6) return setCreateError("Mot de passe trop court (6 caractères min).");
    if (!createForm.role) return setCreateError("Veuillez sélectionner un rôle.");
    if (users.find(u => u.email === createForm.email.trim())) return setCreateError("Cet email est déjà utilisé.");
    const newUser: StoredUser = {
      name: createForm.name.trim(),
      email: createForm.email.trim(),
      password: createForm.password,
      role: createForm.role as UserRole,
    };
    const updated = [...users, newUser];
    setUsers(updated);
    localStorage.setItem("inwi_users", JSON.stringify(updated));
    setCreateForm(EMPTY_FORM);
    setCreateSuccess(true);
    setTimeout(() => setCreateSuccess(false), 3000);
    setShowCreateForm(false);
  };

  const adminCount = users.filter(u => u.role === "admin").length;
  const techCount = users.filter(u => u.role === "technician").length;
  const connectedIntegrations = INTEGRATIONS.filter(i => i.status).length;

  const tabConfig: Array<{ id: Tab; icon: React.ElementType; label: string; desc: string }> = [
    { id: "users", icon: Users, label: t("admin.users"), desc: t("admin.usersDesc") },
    { id: "systemStatus", icon: Activity, label: t("admin.systemStatus"), desc: t("admin.systemStatusDesc") },
    { id: "auditLogs", icon: Clock, label: t("admin.auditLogs"), desc: t("admin.auditLogsDesc") },
    { id: "platformConfig", icon: Settings2, label: t("admin.platformConfig"), desc: t("admin.platformConfigDesc") },
  ];

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">{t("admin.title")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("admin.subtitle")}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t("admin.totalUsers"), value: users.length, icon: Users, color: "text-primary" },
          { label: t("admin.admins"), value: adminCount, icon: Shield, color: "text-warning" },
          { label: t("admin.technicians"), value: techCount, icon: Users, color: "text-success" },
          { label: t("admin.activeIntegrations"), value: `${connectedIntegrations}/${INTEGRATIONS.length}`, icon: Activity, color: "text-accent" },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="glass rounded-xl p-4 border border-border/60"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground">{kpi.label}</span>
              <kpi.icon className={cn("h-4 w-4", kpi.color)} />
            </div>
            <div className="text-2xl font-bold">{kpi.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-surface rounded-xl p-1 border border-border/60 overflow-x-auto">
        {tabConfig.map(tc => (
          <button
            key={tc.id}
            onClick={() => setTab(tc.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
              tab === tc.id
                ? "bg-primary text-white shadow"
                : "text-muted-foreground hover:text-foreground hover:bg-surface-elevated"
            )}
          >
            <tc.icon className="h-4 w-4 shrink-0" />
            {tc.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="glass rounded-xl border border-border/60 overflow-hidden"
      >
        {/* Users Tab */}
        {tab === "users" && (
          <div>
            <div className="p-5 border-b border-border/60 flex items-center justify-between">
              <div>
                <h2 className="font-semibold">{t("admin.users")}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">{t("admin.usersDesc")}</p>
              </div>
              <button
                onClick={() => { setShowCreateForm(v => !v); setCreateError(""); }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:opacity-90 transition-opacity"
              >
                <UserPlus className="h-3.5 w-3.5" />
                Créer un utilisateur
              </button>
            </div>

            <AnimatePresence>
              {showCreateForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden border-b border-border/60"
                >
                  <form onSubmit={submitCreate} className="p-5 bg-surface/30 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Nom complet</label>
                      <input
                        type="text"
                        placeholder="Youssef El Amrani"
                        value={createForm.name}
                        onChange={setField("name")}
                        className="w-full h-9 rounded-md border border-border/60 bg-surface/60 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Email</label>
                      <input
                        type="email"
                        placeholder="utilisateur@inwi.ma"
                        value={createForm.email}
                        onChange={setField("email")}
                        className="w-full h-9 rounded-md border border-border/60 bg-surface/60 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Mot de passe</label>
                      <input
                        type="password"
                        placeholder="6+ caractères"
                        value={createForm.password}
                        onChange={setField("password")}
                        className="w-full h-9 rounded-md border border-border/60 bg-surface/60 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Rôle</label>
                      <select
                        value={createForm.role}
                        onChange={setField("role")}
                        className="w-full h-9 rounded-md border border-border/60 bg-surface/60 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <option value="" disabled>Sélectionner un rôle</option>
                        <option value="admin">{t("auth.roleAdmin")}</option>
                        <option value="technician">{t("auth.roleTechnician")}</option>
                      </select>
                    </div>
                    {createError && (
                      <div className="sm:col-span-2 text-xs text-danger bg-danger/10 border border-danger/20 rounded-lg px-3 py-2">
                        {createError}
                      </div>
                    )}
                    <div className="sm:col-span-2 flex items-center gap-3">
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:opacity-90 transition-opacity"
                      >
                        Créer le compte
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShowCreateForm(false); setCreateError(""); setCreateForm(EMPTY_FORM); }}
                        className="px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition-colors flex items-center gap-1"
                      >
                        <X className="h-3 w-3" /> Annuler
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {createSuccess && (
              <div className="mx-5 mt-4 text-xs text-success bg-success/10 border border-success/20 rounded-lg px-3 py-2 flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5" /> Utilisateur créé avec succès.
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 bg-surface/50">
                    <th className="text-left px-5 py-3 text-xs text-muted-foreground font-medium">{t("admin.userName")}</th>
                    <th className="text-left px-5 py-3 text-xs text-muted-foreground font-medium">{t("admin.userEmail")}</th>
                    <th className="text-left px-5 py-3 text-xs text-muted-foreground font-medium">{t("admin.userRole")}</th>
                    <th className="text-right px-5 py-3 text-xs text-muted-foreground font-medium">{t("common.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-muted-foreground text-sm">
                        Aucun utilisateur enregistré.
                      </td>
                    </tr>
                  )}
                  {users.map((u, i) => (
                    <tr key={u.email} className={cn("border-b border-border/40 hover:bg-surface/40 transition-colors", i % 2 === 0 ? "" : "bg-surface/20")}>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-bold text-white shrink-0">
                            {u.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                          </div>
                          <span className="font-medium">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">{u.email}</td>
                      <td className="px-5 py-3">
                        <select
                          value={u.role}
                          onChange={e => changeRole(u.email, e.target.value as UserRole)}
                          className={cn(
                            "text-xs px-2 py-1 rounded-md border font-medium bg-transparent",
                            u.role === "admin"
                              ? "border-warning/40 text-warning"
                              : "border-success/40 text-success"
                          )}
                        >
                          <option value="admin">{t("auth.roleAdmin")}</option>
                          <option value="technician">{t("auth.roleTechnician")}</option>
                        </select>
                      </td>
                      <td className="px-5 py-3 text-right">
                        {confirmDelete === u.email ? (
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-xs text-muted-foreground">Confirmer ?</span>
                            <button
                              onClick={() => deleteUser(u.email)}
                              className="text-xs px-2 py-1 rounded bg-danger/10 text-danger hover:bg-danger/20 transition-colors"
                            >
                              {t("common.yes")}
                            </button>
                            <button
                              onClick={() => setConfirmDelete(null)}
                              className="text-xs px-2 py-1 rounded bg-surface hover:bg-surface-elevated transition-colors"
                            >
                              {t("common.no")}
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDelete(u.email)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-danger hover:bg-danger/10 transition-colors"
                            title={t("admin.deleteUser")}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* System Status Tab */}
        {tab === "systemStatus" && (
          <div>
            <div className="p-5 border-b border-border/60">
              <h2 className="font-semibold">{t("admin.systemStatus")}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{t("admin.systemStatusDesc")}</p>
            </div>
            <div className="divide-y divide-border/60">
              {INTEGRATIONS.map(integration => (
                <div key={integration.name} className="flex items-center justify-between px-5 py-4 hover:bg-surface/40 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center text-xs font-bold",
                      integration.status ? "bg-success/15 text-success" : "bg-danger/15 text-danger"
                    )}>
                      {integration.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{integration.name}</div>
                      <div className="text-xs text-muted-foreground font-mono mt-0.5">{integration.endpoint}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">{t("admin.lastSync")}</div>
                      <div className="text-xs font-medium mt-0.5">{integration.lastSync}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {integration.status
                        ? <CheckCircle2 className="h-5 w-5 text-success" />
                        : <XCircle className="h-5 w-5 text-danger" />
                      }
                      <span className={cn("text-xs font-medium", integration.status ? "text-success" : "text-danger")}>
                        {integration.status ? t("admin.connected") : t("admin.disconnected")}
                      </span>
                    </div>
                    <button className="p-1.5 rounded-lg hover:bg-surface-elevated transition-colors text-muted-foreground hover:text-foreground">
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Audit Logs Tab */}
        {tab === "auditLogs" && (
          <div>
            <div className="p-5 border-b border-border/60">
              <h2 className="font-semibold">{t("admin.auditLogs")}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{t("admin.auditLogsDesc")}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 bg-surface/50">
                    <th className="text-left px-5 py-3 text-xs text-muted-foreground font-medium">{t("admin.event")}</th>
                    <th className="text-left px-5 py-3 text-xs text-muted-foreground font-medium">{t("admin.user")}</th>
                    <th className="text-left px-5 py-3 text-xs text-muted-foreground font-medium">{t("admin.date")}</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map(log => (
                    <tr key={log.id} className="border-b border-border/40 hover:bg-surface/40 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "h-2 w-2 rounded-full",
                            log.type === "login" ? "bg-primary" :
                            log.type === "create" ? "bg-success" :
                            log.type === "delete" ? "bg-danger" : "bg-warning"
                          )} />
                          {log.event}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground font-mono text-xs">{log.user}</td>
                      <td className="px-5 py-3 text-muted-foreground text-xs">{log.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Platform Config Tab */}
        {tab === "platformConfig" && (
          <div>
            <div className="p-5 border-b border-border/60">
              <h2 className="font-semibold">{t("admin.platformConfig")}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{t("admin.platformConfigDesc")}</p>
            </div>
            <div className="divide-y divide-border/60">
              {[
                { label: "Version de l'application", value: "v2.1.0", type: "badge" },
                { label: "Environnement", value: "Production", type: "badge-success" },
                { label: "Rétention des logs", value: "90 jours", type: "text" },
                { label: "Corrélation auto", value: "Activée", type: "badge-success" },
                { label: "Seuil de confiance IA", value: "75%", type: "text" },
                { label: "Délai de rafraîchissement", value: "30 secondes", type: "text" },
                { label: "Authentification MFA", value: "Désactivée", type: "badge-danger" },
                { label: "Sauvegarde automatique", value: "Toutes les 24h", type: "text" },
              ].map(cfg => (
                <div key={cfg.label} className="flex items-center justify-between px-5 py-3.5 hover:bg-surface/40 transition-colors">
                  <span className="text-sm text-muted-foreground">{cfg.label}</span>
                  {cfg.type === "text" && <span className="text-sm font-medium">{cfg.value}</span>}
                  {cfg.type === "badge" && (
                    <span className="text-xs px-2.5 py-1 rounded-md bg-primary/15 text-primary font-medium">{cfg.value}</span>
                  )}
                  {cfg.type === "badge-success" && (
                    <span className="text-xs px-2.5 py-1 rounded-md bg-success/15 text-success font-medium">{cfg.value}</span>
                  )}
                  {cfg.type === "badge-danger" && (
                    <span className="text-xs px-2.5 py-1 rounded-md bg-danger/15 text-danger font-medium">{cfg.value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
