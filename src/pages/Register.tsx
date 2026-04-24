import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Shield, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

const ROLES: { id: UserRole; label: string; desc: string; icon: React.ElementType; color: string; ring: string; bg: string }[] = [
  {
    id: "admin",
    label: "Administrateur",
    desc: "Accès complet : dashboard, gestion des utilisateurs, configuration.",
    icon: Shield,
    color: "text-warning",
    ring: "ring-warning/60 border-warning/40",
    bg: "bg-warning/10",
  },
  {
    id: "technician",
    label: "Technicien",
    desc: "Accès au dashboard, chat IA et historique des conversations.",
    icon: Wrench,
    color: "text-success",
    ring: "ring-success/60 border-success/40",
    bg: "bg-success/10",
  },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<UserRole | "">("");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const goToStep2 = () => {
    if (!role) return setError("Veuillez sélectionner un rôle.");
    setError("");
    setStep(2);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) return setError(t("auth.nameRequired"));
    if (!form.email.includes("@")) return setError(t("auth.invalidEmail"));
    if (form.password.length < 6) return setError(t("auth.passwordTooShort"));
    if (form.password !== form.confirm) return setError(t("auth.passwordMismatch"));
    setLoading(true);
    const ok = await register(form.name.trim(), form.email.trim(), form.password, role as UserRole);
    setLoading(false);
    if (!ok) return setError(t("auth.emailExists"));
    navigate("/app");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0 bg-gradient-hero opacity-60" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-lg"
      >
        <div className="glass-strong rounded-2xl p-8 border border-border/60 shadow-glow-soft">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <Logo />
            <p className="text-sm text-muted-foreground mt-3">{t("common.tagline")}</p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-6">
            {[1, 2].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={cn(
                  "h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                  step >= s ? "bg-primary text-white" : "bg-surface border border-border/60 text-muted-foreground"
                )}>
                  {s}
                </div>
                <span className={cn("text-xs font-medium", step >= s ? "text-foreground" : "text-muted-foreground")}>
                  {s === 1 ? "Choisir le rôle" : "Informations"}
                </span>
                {s < 2 && <span className="text-muted-foreground/30 text-xs">—</span>}
              </div>
            ))}
          </div>

          {/* STEP 1: Role selection */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <h1 className="text-lg font-semibold">Quel est votre rôle ?</h1>
              <p className="text-xs text-muted-foreground">Sélectionnez votre profil d'accès à la plateforme.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {ROLES.map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => { setRole(r.id); setError(""); }}
                    className={cn(
                      "relative flex flex-col items-start gap-3 p-5 rounded-xl border-2 transition-all text-left",
                      role === r.id
                        ? `${r.ring} ${r.bg} ring-2`
                        : "border-border/40 hover:border-border bg-surface/30 hover:bg-surface/60"
                    )}
                  >
                    {role === r.id && (
                      <span className="absolute top-3 right-3 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                        <span className="h-2 w-2 rounded-full bg-white" />
                      </span>
                    )}
                    <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", r.bg)}>
                      <r.icon className={cn("h-5 w-5", r.color)} />
                    </div>
                    <div>
                      <div className={cn("text-sm font-semibold", role === r.id ? r.color : "text-foreground")}>
                        {r.label}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{r.desc}</div>
                    </div>
                  </button>
                ))}
              </div>

              {error && (
                <div className="text-xs text-danger bg-danger/10 border border-danger/20 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}

              <Button
                type="button"
                onClick={goToStep2}
                className="w-full bg-gradient-primary hover:opacity-90 shadow-glow-soft mt-2"
              >
                Continuer <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {/* STEP 2: Account details */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Role badge */}
              {(() => {
                const r = ROLES.find(x => x.id === role)!;
                return (
                  <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium mb-5", r.bg, r.color)}>
                    <r.icon className="h-3.5 w-3.5" />
                    {r.label}
                  </div>
                );
              })()}

              <h1 className="text-lg font-semibold mb-4">Créer votre compte</h1>

              <form onSubmit={submit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs text-muted-foreground">{t("auth.fullName")}</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Youssef El Amrani"
                    value={form.name}
                    onChange={set("name")}
                    className="bg-surface/60 border-border/60 focus-visible:ring-primary/50"
                    autoFocus
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs text-muted-foreground">{t("auth.email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="vous@inwi.ma"
                    value={form.email}
                    onChange={set("email")}
                    className="bg-surface/60 border-border/60 focus-visible:ring-primary/50"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-xs text-muted-foreground">{t("auth.password")}</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPwd ? "text" : "password"}
                        placeholder="6+ caractères"
                        value={form.password}
                        onChange={set("password")}
                        className="bg-surface/60 border-border/60 focus-visible:ring-primary/50 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPwd(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="confirm" className="text-xs text-muted-foreground">{t("auth.confirmPassword")}</Label>
                    <Input
                      id="confirm"
                      type={showPwd ? "text" : "password"}
                      placeholder="Confirmer"
                      value={form.confirm}
                      onChange={set("confirm")}
                      className="bg-surface/60 border-border/60 focus-visible:ring-primary/50"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-xs text-danger bg-danger/10 border border-danger/20 rounded-lg px-3 py-2">
                    {error}
                  </div>
                )}

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => { setStep(1); setError(""); }}
                    className="px-4 py-2 rounded-lg border border-border/60 text-sm text-muted-foreground hover:text-foreground hover:bg-surface/60 transition-colors"
                  >
                    Retour
                  </button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-primary hover:opacity-90 shadow-glow-soft"
                    disabled={loading}
                  >
                    {loading ? t("auth.creatingAccount") : <>{t("auth.createAccount")} <ArrowRight className="ml-2 h-4 w-4" /></>}
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          <p className="text-center text-xs text-muted-foreground mt-6">
            {t("auth.alreadyAccount")}{" "}
            <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
              {t("auth.signIn")}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
