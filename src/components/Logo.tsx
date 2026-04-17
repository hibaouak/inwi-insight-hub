import { cn } from "@/lib/utils";

export const Logo = ({ className, showText = true }: { className?: string; showText?: boolean }) => (
  <div className={cn("flex items-center gap-2.5", className)}>
    <div className="relative">
      <div className="h-9 w-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-soft">
        <span className="text-white font-black text-lg leading-none">i</span>
      </div>
      <div className="absolute -inset-1 rounded-xl bg-primary/20 blur-md -z-10" />
    </div>
    {showText && (
      <div className="flex flex-col leading-none">
        <span className="font-bold text-base tracking-tight">
          inwi<span className="text-primary">·</span>IA
        </span>
        <span className="text-[10px] text-muted-foreground tracking-wider">v2</span>
      </div>
    )}
  </div>
);
