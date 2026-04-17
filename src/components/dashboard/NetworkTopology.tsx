import { TOPOLOGY_NODES, TOPOLOGY_EDGES } from "@/lib/mockData";

const healthColors: Record<string, string> = {
  healthy: "hsl(var(--success))",
  warning: "hsl(var(--warning))",
  critical: "hsl(var(--danger))",
};

export function NetworkTopology() {
  return (
    <div className="relative w-full h-full min-h-[280px]">
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <radialGradient id="bgGlow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="hsl(277 100% 50%)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="hsl(277 100% 50%)" stopOpacity="0" />
          </radialGradient>
          <filter id="nodeGlow">
            <feGaussianBlur stdDeviation="0.8" />
          </filter>
        </defs>
        <rect width="100" height="100" fill="url(#bgGlow)" />

        {TOPOLOGY_EDGES.map((edge, i) => {
          const a = TOPOLOGY_NODES.find(n => n.id === edge.from)!;
          const b = TOPOLOGY_NODES.find(n => n.id === edge.to)!;
          return (
            <line
              key={i}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={edge.active ? "hsl(var(--primary))" : "hsl(var(--border))"}
              strokeWidth={edge.active ? 0.4 : 0.2}
              strokeOpacity={edge.active ? 0.8 : 0.5}
              strokeDasharray={edge.active ? "0" : "1 1"}
            >
              {edge.active && (
                <animate attributeName="stroke-opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
              )}
            </line>
          );
        })}

        {TOPOLOGY_NODES.map((node) => {
          const r = node.size / 8;
          const color = healthColors[node.health];
          return (
            <g key={node.id}>
              {node.health !== "healthy" && (
                <circle cx={node.x} cy={node.y} r={r * 1.8} fill={color} opacity="0.15">
                  <animate attributeName="r" values={`${r * 1.4};${r * 2.4};${r * 1.4}`} dur="2.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.3;0;0.3" dur="2.4s" repeatCount="indefinite" />
                </circle>
              )}
              <circle cx={node.x} cy={node.y} r={r} fill={color} opacity="0.25" filter="url(#nodeGlow)" />
              <circle cx={node.x} cy={node.y} r={r * 0.6} fill={color} stroke="hsl(var(--background))" strokeWidth="0.3" />
              <text x={node.x} y={node.y + r + 2.6} fontSize="2.2" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontWeight="500">
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="absolute bottom-2 right-2 glass rounded-lg px-2.5 py-1.5 flex gap-3 text-[10px]">
        <div className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-success" />Healthy</div>
        <div className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-warning" />Warning</div>
        <div className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-danger" />Critical</div>
      </div>
    </div>
  );
}
