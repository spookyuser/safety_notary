"use client";

import { useParams } from "next/navigation";
import { useAccount } from "wagmi";
import { useIncident, useVerifyIncident } from "@/lib/eas/hooks";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { EASSCAN_ATTESTATION_URL } from "@/lib/config/eas";

export const dynamic = "force-dynamic";

export default function IncidentDetailPage() {
  const params = useParams();
  const uid = params.uid as string;
  const { isConnected } = useAccount();
  const { data: incident, isLoading } = useIncident(uid);
  const { mutate: verify, isPending: isVerifying } = useVerifyIncident();

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

  function handleVerify() {
    if (!isConnected) {
      alert("Please connect your wallet to verify this incident.");
      return;
    }
    if (confirm("Are you sure you want to verify this incident?")) {
      verify(uid);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-6">
        <a
          href="/incidents"
          className="text-juniper hover:text-juniper-700 text-sm"
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
              {incident.verified && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-juniper-200 text-juniper-700">
                  ✓ Verified
                </span>
              )}
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-napa-100 text-russett">
                {incident.mitigationStatus}
              </span>
            </div>
          </div>
          {!incident.verified && (
            <button
              onClick={handleVerify}
              disabled={isVerifying || !isConnected}
              className="px-4 py-2 bg-geraldine text-white rounded-md hover:bg-geraldine-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifying ? "Verifying..." : "Verify Incident"}
            </button>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-russett mb-2">
              Description
            </h2>
            <p className="text-russett-400">{incident.description}</p>
          </div>

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
                  href={`${EASSCAN_ATTESTATION_URL}/${incident.uid}`}
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
