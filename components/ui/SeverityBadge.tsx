import { SeverityLevel } from "@/lib/types";

interface SeverityBadgeProps {
  level: SeverityLevel;
  className?: string;
}

const severityConfig = {
  1: { color: "bg-juniper-100 text-juniper-700", label: "Minor" },
  2: { color: "bg-juniper-200 text-russett", label: "Low" },
  3: { color: "bg-napa-200 text-russett", label: "Medium" },
  4: { color: "bg-geraldine-100 text-russett", label: "High" },
  5: { color: "bg-russett text-white", label: "Critical" },
};

export function SeverityBadge({ level, className = "" }: SeverityBadgeProps) {
  const config = severityConfig[level];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color} ${className}`}
      title={`Severity Level ${level}: ${config.label}`}
    >
      {config.label} ({level})
    </span>
  );
}
