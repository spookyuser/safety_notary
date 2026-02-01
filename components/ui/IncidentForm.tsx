"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  IncidentType,
  SeverityLevel,
  SafetyIncident,
} from "@/lib/types";
import { useCreateAttestation } from "@/lib/eas/hooks";

export function IncidentForm() {
  const router = useRouter();
  const { mutate: createAttestation, isPending, isSuccess, txHash } = useCreateAttestation();

  const [step, setStep] = useState<1 | 2>(1);
  const [incidentType, setIncidentType] = useState<IncidentType>("safety-violation");
  const [modelIdentifier, setModelIdentifier] = useState("");
  const [severityLevel, setSeverityLevel] = useState<SeverityLevel>(3);

  // New fields
  const [organisationName, setOrganisationName] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [intendedActions, setIntendedActions] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (step < 2) {
      setStep(2);
      return;
    }

    try {
      // Store structured data as JSON in the description field
      const structuredData = {
        organisationName,
        country,
        region,
        city,
        description,
        intendedActions,
      };

      const incidentData: SafetyIncident = {
        incidentType,
        modelIdentifier,
        severityLevel,
        description: JSON.stringify(structuredData),
        evidenceHash: "",
        timestamp: BigInt(Math.floor(Date.now() / 1000)),
        reporterRole: "user",
        verified: false,
        mitigationStatus: "pending",
      };

      createAttestation(incidentData, {
        onSuccess: (uid) => {
          router.push(`/submit/success?uid=${uid}`);
        },
      });
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit incident. Please try again.");
    }
  }

  // Loading popup modal during transaction
  if (isPending) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-8 text-center">
          <div className="mx-auto w-16 h-16 mb-6 relative">
            <div className="absolute inset-0 rounded-full border-4 border-juniper-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-juniper border-t-transparent animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-russett mb-2">
            Recording on Blockchain
          </h2>
          <p className="text-russett-400 mb-4">
            Please confirm the transaction in your wallet and wait for it to be processed.
          </p>
          <div className="text-sm text-russett-400 bg-cameo-50 p-4 rounded-md border border-napa">
            <p className="mb-2">This may take a moment. Please do not close this page.</p>
            <p>Your incident is being permanently recorded on the Ethereum Sepolia network.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-4">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                s === step
                  ? "bg-juniper text-white"
                  : s < step
                  ? "bg-geraldine text-white"
                  : "bg-cameo text-russett-400"
              }`}
            >
              {s}
            </div>
          ))}
        </div>
        <div className="text-sm text-russett-400">
          Step {step} of 2
        </div>
      </div>

      {step === 1 && (
        <>
          <div>
            <label className="block text-sm font-medium text-russett mb-2">
              Organisation Name *
            </label>
            <input
              required
              type="text"
              value={organisationName}
              onChange={(e) => setOrganisationName(e.target.value)}
              placeholder="e.g., Acme Corporation"
              className="w-full px-3 py-2 border border-napa rounded-md focus:outline-none focus:ring-2 focus:ring-juniper text-russett-800"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-russett mb-2">
                Country *
              </label>
              <input
                required
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g., United States"
                className="w-full px-3 py-2 border border-napa rounded-md focus:outline-none focus:ring-2 focus:ring-juniper text-russett-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-russett mb-2">
                Region
              </label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="e.g., California"
                className="w-full px-3 py-2 border border-napa rounded-md focus:outline-none focus:ring-2 focus:ring-juniper text-russett-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-russett mb-2">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g., San Francisco"
                className="w-full px-3 py-2 border border-napa rounded-md focus:outline-none focus:ring-2 focus:ring-juniper text-russett-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-russett mb-2">
              Incident Type *
            </label>
            <select
              required
              value={incidentType}
              onChange={(e) => setIncidentType(e.target.value as IncidentType)}
              className="w-full px-3 py-2 border border-napa rounded-md focus:outline-none focus:ring-2 focus:ring-juniper text-russett-800"
            >
              <option value="safety-violation">Safety Violation</option>
              <option value="data-leak">Data Leak</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-russett mb-2">
              Model Identifier *
            </label>
            <input
              required
              type="text"
              value={modelIdentifier}
              onChange={(e) => setModelIdentifier(e.target.value)}
              placeholder="e.g., gpt-4-turbo, claude-3-opus"
              className="w-full px-3 py-2 border border-napa rounded-md focus:outline-none focus:ring-2 focus:ring-juniper text-russett-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-russett mb-2">
              Severity Level: {severityLevel}
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={severityLevel}
              onChange={(e) => setSeverityLevel(Number(e.target.value) as SeverityLevel)}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-russett-400 mt-1">
              <span>1 - Minor</span>
              <span>3 - Medium</span>
              <span>5 - Critical</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-russett mb-2">
              Description *
            </label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe the AI safety incident in detail..."
              className="w-full px-3 py-2 border border-napa rounded-md focus:outline-none focus:ring-2 focus:ring-juniper text-russett-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-russett mb-2">
              Intended Actions *
            </label>
            <textarea
              required
              value={intendedActions}
              onChange={(e) => setIntendedActions(e.target.value)}
              rows={3}
              placeholder="What actions do you intend to take or recommend?"
              className="w-full px-3 py-2 border border-napa rounded-md focus:outline-none focus:ring-2 focus:ring-juniper text-russett-800"
            />
          </div>
        </>
      )}

      {step === 2 && (
        <div className="bg-cameo-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-russett mb-4">Review Your Submission</h3>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-russett-400">Organisation</dt>
              <dd className="text-sm text-russett">{organisationName}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-russett-400">Location</dt>
              <dd className="text-sm text-russett">
                {[city, region, country].filter(Boolean).join(", ")}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-russett-400">Incident Type</dt>
              <dd className="text-sm text-russett">{incidentType}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-russett-400">Model</dt>
              <dd className="text-sm text-russett">{modelIdentifier}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-russett-400">Severity</dt>
              <dd className="text-sm text-russett">{severityLevel}/5</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-russett-400">Description</dt>
              <dd className="text-sm text-russett whitespace-pre-wrap">{description}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-russett-400">Intended Actions</dt>
              <dd className="text-sm text-russett whitespace-pre-wrap">{intendedActions}</dd>
            </div>
          </dl>
        </div>
      )}

      <div className="flex justify-between">
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep(1)}
            disabled={isPending}
            className="px-6 py-2 border border-napa rounded-md text-russett hover:bg-cameo-50 disabled:opacity-50"
          >
            Back
          </button>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="ml-auto px-6 py-2 bg-juniper text-white rounded-md hover:bg-juniper-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending
            ? "Processing..."
            : step === 2
            ? "Submit Incident"
            : "Next"}
        </button>
      </div>
    </form>
  );
}
