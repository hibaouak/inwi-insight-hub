import { Construction } from "lucide-react";

export default function Placeholder({ title }: { title: string }) {
  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground mt-1">Module preview</p>
      </div>
      <div className="glass rounded-2xl p-16 mt-8 text-center">
        <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
          <Construction className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-lg font-semibold mb-1">Coming in v2.1</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">This module is part of the next release. The dashboard, incidents, and chat IA are fully wired in this build.</p>
      </div>
    </div>
  );
}
