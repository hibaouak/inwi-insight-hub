import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Severity, IncidentStatus, IncidentSource } from "@/lib/mockData";
import { Activity, MessageCircle, GitMerge } from "lucide-react";

const sevStyles: Record<Severity, string> = {
  critical: "bg-danger/15 text-danger border-danger/30",
  high: "bg-accent/15 text-accent border-accent/30",
  medium: "bg-warning/15 text-warning border-warning/30",
  low: "bg-primary/15 text-primary border-primary/30",
};

const statusStyles: Record<IncidentStatus, string> = {
  open: "bg-danger/10 text-danger",
  investigating: "bg-warning/10 text-warning",
  mitigating: "bg-primary/10 text-primary",
  resolved: "bg-success/10 text-success",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <Badge variant="outline" className={cn("capitalize text-[10px] font-semibold", sevStyles[severity])}>
      {severity}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: IncidentStatus }) {
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium capitalize", statusStyles[status])}>
      <span className={cn("h-1.5 w-1.5 rounded-full", status === "resolved" ? "bg-success" : "animate-pulse-glow",
        status === "open" && "bg-danger",
        status === "investigating" && "bg-warning",
        status === "mitigating" && "bg-primary",
      )} />
      {status}
    </span>
  );
}

export function SourceBadge({ source }: { source: IncidentSource }) {
  const map = {
    dynatrace: { label: "Dynatrace", icon: Activity, color: "text-primary bg-primary/10" },
    salesforce: { label: "Salesforce", icon: MessageCircle, color: "text-accent bg-accent/10" },
    mixed: { label: "Mixed", icon: GitMerge, color: "text-cyan-400 bg-cyan-400/10" },
  } as const;
  const s = map[source];
  return (
    <span className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium", s.color)}>
      <s.icon className="h-2.5 w-2.5" />
      {s.label}
    </span>
  );
}
