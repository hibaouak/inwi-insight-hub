import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.email.trim() || !form.password) return setError(t("auth.fillAllFields"));
    setLoading(true);
    const ok = await login(form.email.trim(), form.password);
    setLoading(false);
    if (!ok) return setError(t("auth.invalidCredentials"));
    // Role-based redirect after login
    const stored = localStorage.getItem("inwi_user");
    const loggedUser = stored ? JSON.parse(stored) : null;
    if (loggedUser?.role === "technician") {
      navigate("/app/chat");
    } else {
      navigate("/app");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0 bg-gradient-hero opacity-60" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="glass-strong rounded-2xl p-8 border border-border/60 shadow-glow-soft">
          <div className="flex flex-col items-center mb-8">
            <Logo />
            <p className="text-sm text-muted-foreground mt-3">{t("common.tagline")}</p>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <h1 className="text-lg font-semibold">{t("auth.signInTo")}</h1>
          </div>

          <form onSubmit={submit} className="space-y-4">
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

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs text-muted-foreground">{t("auth.password")}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  placeholder="Votre mot de passe"
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

            {error && (
              <div className="text-xs text-danger bg-danger/10 border border-danger/20 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-primary hover:opacity-90 shadow-glow-soft"
              disabled={loading}
            >
              {loading ? t("auth.signingIn") : <>{t("auth.signIn")} <ArrowRight className="ml-2 h-4 w-4" /></>}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            {t("auth.noAccount")}{" "}
            <Link to="/" className="text-primary hover:text-primary/80 font-medium transition-colors">
              {t("auth.createAccount")}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
