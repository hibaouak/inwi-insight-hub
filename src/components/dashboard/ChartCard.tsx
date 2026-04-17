import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Props {
  title: string;
  subtitle?: string;
  className?: string;
  children: ReactNode;
  action?: ReactNode;
  delay?: number;
}

export function ChartCard({ title, subtitle, className, children, action, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn("glass rounded-2xl p-5 flex flex-col", className)}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-base">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="flex-1 min-h-0">{children}</div>
    </motion.div>
  );
}
