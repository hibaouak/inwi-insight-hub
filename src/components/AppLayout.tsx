import { Outlet, useLocation, Link } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Bell, Search, Sparkles, Sun, Moon, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LANGUAGES = [
  { code: "fr", label: "Français", dir: "ltr" },
  { code: "en", label: "English", dir: "ltr" },
  { code: "ar", label: "العربية", dir: "rtl" },
] as const;

export function AppLayout() {
  const { pathname } = useLocation();
  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const { isAdmin } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const titles: Record<string, string> = {
    "/app": t("nav.dashboard"),
    "/app/chat": t("nav.chatIA"),
    "/app/historique": t("nav.history"),
    "/app/settings": t("nav.settings"),
    "/app/admin": t("nav.admin"),
  };

  const title = titles[pathname] || "inwi·IA";

  const changeLanguage = (code: string) => {
    const lang = LANGUAGES.find(l => l.code === code);
    i18n.changeLanguage(code);
    localStorage.setItem("inwi_lang", code);
    document.documentElement.dir = lang?.dir ?? "ltr";
    document.documentElement.lang = code;
  };

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) ?? LANGUAGES[0];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 shrink-0 border-b border-border/60 glass-strong flex items-center px-4 gap-3 sticky top-0 z-30">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div className="flex items-center gap-2 text-sm">
              <Link to="/app" className="text-muted-foreground hover:text-foreground transition-colors">
                {t("common.appName")}
              </Link>
              <span className="text-muted-foreground/40">/</span>
              <span className="font-medium">{title}</span>
            </div>

            <div className="flex-1 max-w-md mx-auto hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("nav.searchPlaceholder")}
                  className="pl-9 h-9 bg-surface/60 border-border/60 focus-visible:ring-primary/50"
                />
                <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground border border-border/60 px-1.5 py-0.5 rounded">⌘K</kbd>
              </div>
            </div>

            <Button asChild variant="ghost" size="sm" className="gap-1.5 text-primary hover:text-primary hover:bg-primary/10">
              <Link to="/app/chat"><Sparkles className="h-4 w-4" />{t("nav.askAI")}</Link>
            </Button>

            {/* Language switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-9 w-9 rounded-lg flex items-center justify-center hover:bg-surface transition-colors" title={t("language.label")}>
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                {LANGUAGES.map(lang => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={i18n.language === lang.code ? "text-primary font-medium" : ""}
                  >
                    {lang.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-9 w-9 rounded-lg flex items-center justify-center hover:bg-surface transition-colors"
                title={t("theme.toggle")}
              >
                {theme === "dark"
                  ? <Sun className="h-4 w-4 text-muted-foreground" />
                  : <Moon className="h-4 w-4 text-muted-foreground" />
                }
              </button>
            )}

            <button className="relative h-9 w-9 rounded-lg flex items-center justify-center hover:bg-surface transition-colors">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-danger animate-pulse-glow" />
            </button>
          </header>

          <main className="flex-1 min-w-0 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
