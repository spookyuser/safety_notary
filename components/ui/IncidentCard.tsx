import Link from "next/link";
import { AttestationData } from "@/lib/types";
import { SeverityBadge } from "@/components/ui/SeverityBadge";

interface IncidentCardProps {
  incident: AttestationData;
}

interface ParsedDescription {
  organisationName?: string;
  country?: string;
  region?: string;
  city?: string;
  description?: string;
  intendedActions?: string;
}

function parseDescription(raw: string): ParsedDescription | null {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function formatDate(timestamp: bigint): string {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function IncidentCard({ incident }: IncidentCardProps) {
  const parsed = parseDescription(incident.description);
  const displayDescription = parsed?.description || incident.description;
  const location = parsed ? [parsed.city, parsed.region, parsed.country].filter(Boolean).join(", ") : null;

  return (
    <Link href={`/incidents/${incident.uid}`}>
      <div className="bg-white border border-napa rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-juniper-100 text-juniper-700">
                {incident.incidentType}
              </span>
              <SeverityBadge level={incident.severityLevel} />
            </div>
            <h3 className="text-lg font-semibold text-russett mb-1">
              {parsed?.organisationName || incident.modelIdentifier}
            </h3>
            {location && (
              <p className="text-russett-400 text-xs mb-1">{location}</p>
            )}
            <p className="text-russett-400 text-sm line-clamp-2">
              {displayDescription}
            </p>
          </div>
        </div>
        <div className="text-xs text-russett-400">
          <span>Reported {formatDate(incident.timestamp)}</span>
        </div>
      </div>
    </Link>
  );
}
