"use client";

import { useParams } from "next/navigation";
import { useIncident } from "@/lib/eas/hooks";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { EASSCAN_ATTESTATION_URL } from "@/lib/config/eas";

export const dynamic = "force-dynamic";

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

export default function IncidentDetailPage() {
  const params = useParams();
  const uid = params.uid as string;
  const { data: incident, isLoading } = useIncident(uid);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-russett-400">Loading incident...</p>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-russett-400">Incident not found.</p>
      </div>
    );
  }

  function formatDate(timestamp: bigint): string {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-6">
        <a
          href="/incidents"
          className="text-juniper-800 hover:text-juniper-900 text-sm font-medium"
        >
          ← Back to All Incidents
        </a>
      </div>

      <div className="bg-white rounded-lg shadow p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-russett mb-3">
              {incident.modelIdentifier}
            </h1>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-juniper-100 text-juniper-700">
                {incident.incidentType}
              </span>
              <SeverityBadge level={incident.severityLevel} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {(() => {
            const parsed = parseDescription(incident.description);
            if (parsed) {
              const location = [parsed.city, parsed.region, parsed.country].filter(Boolean).join(", ");
              return (
                <>
                  {parsed.organisationName && (
                    <div>
                      <h2 className="text-lg font-semibold text-russett mb-2">Organisation</h2>
                      <p className="text-russett-400">{parsed.organisationName}</p>
                    </div>
                  )}
                  {location && (
                    <div>
                      <h2 className="text-lg font-semibold text-russett mb-2">Location</h2>
                      <p className="text-russett-400">{location}</p>
                    </div>
                  )}
                  {parsed.description && (
                    <div>
                      <h2 className="text-lg font-semibold text-russett mb-2">Description</h2>
                      <p className="text-russett-400 whitespace-pre-wrap">{parsed.description}</p>
                    </div>
                  )}
                  {parsed.intendedActions && (
                    <div>
                      <h2 className="text-lg font-semibold text-russett mb-2">Intended Actions</h2>
                      <p className="text-russett-400 whitespace-pre-wrap">{parsed.intendedActions}</p>
                    </div>
                  )}
                </>
              );
            }
            return (
              <div>
                <h2 className="text-lg font-semibold text-russett mb-2">Description</h2>
                <p className="text-russett-400">{incident.description}</p>
              </div>
            );
          })()}

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-russett-400 mb-1">
                Reporter Role
              </h3>
              <p className="text-russett">{incident.reporterRole}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-russett-400 mb-1">
                Reported Date
              </h3>
              <p className="text-russett">{formatDate(incident.timestamp)}</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-russett mb-4">
              On-Chain Information
            </h2>
            <dl className="grid grid-cols-1 gap-4">
              <div>
                <dt className="text-sm font-medium text-russett-400">
                  Attestation UID
                </dt>
                <dd className="mt-1 text-sm text-russett font-mono break-all">
                  {incident.uid}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-russett-400">Attester</dt>
                <dd className="mt-1 text-sm text-russett font-mono">
                  {incident.attester}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-russett-400">
                  Transaction Hash
                </dt>
                <dd className="mt-1 text-sm text-russett font-mono">
                  {incident.txHash}
                </dd>
              </div>
              <div>
                <a
                  href={`${EASSCAN_ATTESTATION_URL}/view/${incident.uid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-napa rounded-md text-sm font-medium text-russett bg-white hover:bg-cameo-50"
                >
                  View on EASScan →
                </a>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
