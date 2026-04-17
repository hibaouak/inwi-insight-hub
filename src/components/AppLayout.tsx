import { Outlet, useLocation, Link } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Bell, Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const titles: Record<string, string> = {
  "/app": "Dashboard",
  "/app/chat": "Chat IA",
  "/app/analytics": "Analytics",
  "/app/incidents": "Incidents",
  "/app/settings": "Settings",
  "/app/admin": "Admin",
};

export function AppLayout() {
  const { pathname } = useLocation();
  const title = titles[pathname] || "inwi·IA";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 shrink-0 border-b border-border/60 glass-strong flex items-center px-4 gap-3 sticky top-0 z-30">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div className="flex items-center gap-2 text-sm">
              <Link to="/app" className="text-muted-foreground hover:text-foreground transition-colors">inwi·IA</Link>
              <span className="text-muted-foreground/40">/</span>
              <span className="font-medium">{title}</span>
            </div>

            <div className="flex-1 max-w-md mx-auto hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search incidents, services, conversations…"
                  className="pl-9 h-9 bg-surface/60 border-border/60 focus-visible:ring-primary/50"
                />
                <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground border border-border/60 px-1.5 py-0.5 rounded">⌘K</kbd>
              </div>
            </div>

            <Button asChild variant="ghost" size="sm" className="gap-1.5 text-primary hover:text-primary hover:bg-primary/10">
              <Link to="/app/chat"><Sparkles className="h-4 w-4" />Ask AI</Link>
            </Button>
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
