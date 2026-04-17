import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, MessageSquare, BarChart3, AlertTriangle, Settings, Shield } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, SidebarHeader, useSidebar,
} from "@/components/ui/sidebar";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

const mainItems = [
  { title: "Dashboard", url: "/app", icon: LayoutDashboard },
  { title: "Chat IA", url: "/app/chat", icon: MessageSquare, badge: "AI" },
  { title: "Analytics", url: "/app/analytics", icon: BarChart3 },
  { title: "Incidents", url: "/app/incidents", icon: AlertTriangle },
];
const bottomItems = [
  { title: "Settings", url: "/app/settings", icon: Settings },
  { title: "Admin", url: "/app/admin", icon: Shield },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();

  const renderItem = (item: typeof mainItems[number]) => {
    const active = pathname === item.url || (item.url !== "/app" && pathname.startsWith(item.url));
    return (
      <SidebarMenuItem key={item.url}>
        <SidebarMenuButton asChild tooltip={item.title}>
          <NavLink
            to={item.url}
            end={item.url === "/app"}
            className={cn(
              "relative group flex items-center gap-3 rounded-lg transition-all",
              active
                ? "bg-primary/10 text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
            )}
          >
            {active && (
              <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-primary shadow-glow" />
            )}
            <item.icon className={cn("h-[18px] w-[18px] shrink-0", active && "text-primary")} />
            {!collapsed && (
              <>
                <span className="text-sm font-medium">{item.title}</span>
                {item.badge && (
                  <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-primary/20 text-primary tracking-wider">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="px-3 py-4 border-b border-sidebar-border">
        <Logo showText={!collapsed} />
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/60 px-2">Workspace</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">{mainItems.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-2 py-3 border-t border-sidebar-border">
        <SidebarMenu className="gap-1">{bottomItems.map(renderItem)}</SidebarMenu>
        {!collapsed && (
          <div className="mt-3 px-2 flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-bold">
              YE
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate">Youssef El Amrani</div>
              <div className="text-[10px] text-muted-foreground truncate">NOC Analyst</div>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
