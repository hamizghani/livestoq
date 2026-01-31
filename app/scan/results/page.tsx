"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { TopNav, BottomNav } from "@/components/Navigation";
import { VerifiedBadge, ConfidenceBadge } from "@/components/Badges";
import { ScanAssessment } from "@/lib/types";
import { store } from "@/lib/store";
import { formatIdrRange, formatConfidence, formatDate } from "@/lib/utils";

const ANGLES: Array<{ key: keyof ScanAssessment["images"]; label: string }> = [
  { key: "front", label: "Front" },
  { key: "left", label: "Left Side" },
  { key: "back", label: "Back" },
  { key: "right", label: "Right Side" },
  { key: "teeth", label: "Teeth" },
];

function ScanResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [assessment, setAssessment] = useState<ScanAssessment | null>(null);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      const found = store.getScanAssessment(id);
      if (found) {
        setAssessment(found);
      } else {
        // Fallback to latest if ID not found
        const latest = store.getLatestScanAssessment();
        if (latest) {
          setAssessment(latest);
        }
      }
    } else {
      // No ID, try latest
      const latest = store.getLatestScanAssessment();
      if (latest) {
        setAssessment(latest);
      }
    }
  }, [searchParams]);

  if (!assessment) {
    return (
      <div className="min-h-screen bg-white">
        <TopNav />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-600">No assessment found.</p>
          <Link
            href="/scan"
            className="mt-4 inline-block text-primary-600 hover:text-primary-700"
          >
            Start a new scan
          </Link>
        </div>
        <BottomNav />
      </div>
    );
  }

  const { prediction, confidence, createdAt, images } = assessment;

  return (
    <div className="min-h-screen bg-white">
      <TopNav />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Scan Summary
          </h1>
          <p className="text-gray-600">
            Scanned on {formatDate(createdAt)}
          </p>
        </div>

        {/* Images Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Captured Images
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {ANGLES.map((angle) => (
              <div key={angle.key} className="bg-gray-50 rounded-lg overflow-hidden">
                <img
                  src={images[angle.key]}
                  alt={angle.label}
                  className="w-full h-48 object-cover"
                />
                <div className="p-3 text-center text-sm font-medium text-gray-700">
                  {angle.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Assessment Card */}
        <div className="bg-white border-2 border-primary-200 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">AI Assessment</h2>
            <VerifiedBadge />
          </div>

          <div className="space-y-6">
            {/* Species */}
            <div className="border-b border-gray-200 pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Species</span>
                <ConfidenceBadge confidence={confidence.species} />
              </div>
              <p className="text-xl font-semibold text-gray-900 capitalize">
                {prediction.species}
              </p>
            </div>

            {/* Age Eligibility */}
            <div className="border-b border-gray-200 pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">
                  Age
                </span>
                <ConfidenceBadge confidence={confidence.ageEligibility} />
              </div>
              <p className="text-xl font-semibold text-gray-900">
                {prediction.ageEligibility} months
              </p>
            </div>

            {/* Gender */}
            <div className="border-b border-gray-200 pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">
                  Gender
                </span>
                <ConfidenceBadge confidence={confidence.gender} />
              </div>
              <p className="text-xl font-semibold text-gray-900 capitalize">
                {prediction.gender}
              </p>
            </div>

            {/* Weight */}
            <div className="border-b border-gray-200 pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">
                  Estimated Weight
                </span>
                <ConfidenceBadge confidence={confidence.weight} />
              </div>
              <p className="text-xl font-semibold text-gray-900">
                {prediction.weightKg} kg
              </p>
            </div>

            {/* Health Risk */}
            <div className="border-b border-gray-200 pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">
                  Health Risk
                </span>
                <ConfidenceBadge confidence={confidence.healthRisk} />
              </div>
              <p
                className={`text-xl font-semibold mb-2 ${
                  prediction.healthRisk === "Low"
                    ? "text-green-600"
                    : prediction.healthRisk === "Medium"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {prediction.healthRisk}
              </p>
              {prediction.healthRiskExplanation && (
                <p className="text-sm text-gray-600 italic">
                  {prediction.healthRiskExplanation}
                </p>
              )}
            </div>

            {/* Fair Price Range */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">
                  Fair Price Estimate
                </span>
                <ConfidenceBadge confidence={confidence.fairPrice} />
              </div>
              <p className="text-xl font-semibold text-gray-900">
                {formatIdrRange(
                  prediction.fairPriceIdrRange.min,
                  prediction.fairPriceIdrRange.max
                )}
              </p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Disclaimer:</strong> AI-based estimate (MVP mock). Always verify
              directly. Verify before you buy. Fraud happens fastest when decisions are
              rushed.
            </p>
          </div>
        </div>

        {/* CTAs */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/scan"
            className="block px-6 py-4 bg-white text-primary-600 rounded-lg text-center font-semibold border-2 border-primary-600 hover:bg-primary-50"
          >
            Scan another animal
          </Link>
          <Link
            href="/marketplace"
            className="block px-6 py-4 bg-primary-600 text-white rounded-lg text-center font-semibold hover:bg-primary-700"
          >
            Browse Marketplace
          </Link>
        </div>
      </div>

      <BottomNav />
      <div className="h-20 md:hidden" /> {/* Spacer for bottom nav */}
    </div>
  );
}

export default function ScanResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white">
          <TopNav />
          <div className="max-w-4xl mx-auto px-4 py-12 text-center">
            <p className="text-gray-600">Loading...</p>
          </div>
          <BottomNav />
        </div>
      }
    >
      <ScanResultsContent />
    </Suspense>
  );
}
