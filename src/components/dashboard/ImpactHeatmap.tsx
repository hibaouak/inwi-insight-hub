import { HEATMAP } from "@/lib/mockData";

export function ImpactHeatmap() {
  const max = Math.max(...HEATMAP.map(c => c.count));

  const colorFor = (count: number) => {
    if (count === 0) return "hsl(var(--surface-elevated))";
    const t = count / max;
    if (t < 0.25) return "hsl(158 60% 30% / 0.5)";
    if (t < 0.5) return "hsl(277 80% 40% / 0.7)";
    if (t < 0.75) return "hsl(43 100% 50% / 0.8)";
    return "hsl(0 100% 62% / 0.95)";
  };

  return (
    <div className="w-full h-full overflow-x-auto">
      <div className="grid grid-flow-col grid-rows-7 gap-[3px] min-w-[640px]">
        {HEATMAP.map((cell, i) => (
          <div
            key={i}
            className="aspect-square w-2.5 rounded-[2px] hover:ring-1 hover:ring-primary transition-all cursor-pointer"
            style={{ backgroundColor: colorFor(cell.count) }}
            title={`Week ${cell.week + 1}, day ${cell.day + 1}: ${cell.count} incidents`}
          />
        ))}
      </div>
      <div className="flex items-center justify-end gap-1.5 mt-3 text-[10px] text-muted-foreground">
        Less
        {[0, 2, 5, 8, 11].map((c, i) => (
          <span key={i} className="h-2.5 w-2.5 rounded-[2px]" style={{ backgroundColor: colorFor(c) }} />
        ))}
        More
      </div>
    </div>
  );
}
