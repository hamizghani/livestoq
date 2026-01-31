"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { TopNav, BottomNav } from "@/components/Navigation";
import { VerifiedBadge, NotVerifiedBadge, ConfidenceBadge } from "@/components/Badges";
import { MarketplaceListing } from "@/lib/types";
import { store } from "@/lib/store";
import { formatIdr, formatIdrRange, formatConfidence, formatDate } from "@/lib/utils";

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<MarketplaceListing | null>(null);

  useEffect(() => {
    const id = params.id as string;
    const found = store.getMarketplaceListing(id);
    if (found) {
      setListing(found);
    }
  }, [params]);

  if (!listing) {
    return (
      <div className="min-h-screen bg-white">
        <TopNav />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-600 mb-4">Listing not found.</p>
          <Link
            href="/marketplace"
            className="text-primary-600 hover:text-primary-700"
          >
            Back to Marketplace
          </Link>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <TopNav />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/marketplace"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          ← Back to Marketplace
        </Link>

        {/* Image */}
        <div className="mb-6">
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={listing.imageUrl}
              alt={listing.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%23e5e7eb' width='800' height='600'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='24' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3ELivestock Image%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
        </div>

        {/* Title and Badge */}
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900 flex-1">
            {listing.title}
          </h1>
          <div className="ml-4">
            {listing.aiVerified ? <VerifiedBadge /> : <NotVerifiedBadge />}
          </div>
        </div>

        {/* Location */}
        <p className="text-gray-600 mb-6">📍 {listing.location}</p>

        {/* Price */}
        <div className="mb-6">
          <p className="text-3xl font-bold text-primary-600">
            {formatIdr(listing.priceIdr)}
          </p>
        </div>

        {/* Seller Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">Seller Information</h3>
          <p className="text-gray-600">Name: {listing.sellerName}</p>
        </div>

        {/* AI Assessment Section */}
        {listing.aiVerified && listing.assessment ? (
          <div className="bg-white border-2 border-primary-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">AI Assessment</h2>
              <VerifiedBadge />
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Verified on {formatDate(listing.assessment.createdAt)}
            </p>

            <div className="space-y-6">
              {/* Species */}
              <div className="border-b border-gray-200 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">Species</span>
                  <ConfidenceBadge
                    confidence={listing.assessment.confidence.species}
                  />
                </div>
                <p className="text-xl font-semibold text-gray-900 capitalize">
                  {listing.assessment.prediction.species}
                </p>
              </div>

              {/* Age Eligibility */}
              <div className="border-b border-gray-200 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">
                    Age
                  </span>
                  <ConfidenceBadge
                    confidence={listing.assessment.confidence.ageEligibility}
                  />
                </div>
                <p className="text-xl font-semibold text-gray-900">
                  {listing.assessment.prediction.ageEligibility} months
                </p>
              </div>

              {/* Gender */}
              <div className="border-b border-gray-200 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">
                    Gender
                  </span>
                  <ConfidenceBadge
                    confidence={listing.assessment.confidence.gender}
                  />
                </div>
                <p className="text-xl font-semibold text-gray-900 capitalize">
                  {listing.assessment.prediction.gender}
                </p>
              </div>

              {/* Weight */}
              <div className="border-b border-gray-200 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">
                    Estimated Weight
                  </span>
                  <ConfidenceBadge
                    confidence={listing.assessment.confidence.weight}
                  />
                </div>
                <p className="text-xl font-semibold text-gray-900">
                  {listing.assessment.prediction.weightKg} kg
                </p>
              </div>

              {/* Health Risk */}
              <div className="border-b border-gray-200 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">
                    Health Risk
                  </span>
                  <ConfidenceBadge
                    confidence={listing.assessment.confidence.healthRisk}
                  />
                </div>
                <p
                  className={`text-xl font-semibold mb-2 ${
                    listing.assessment.prediction.healthRisk === "Low"
                      ? "text-green-600"
                      : listing.assessment.prediction.healthRisk === "Medium"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {listing.assessment.prediction.healthRisk}
                </p>
                {listing.assessment.prediction.healthRiskExplanation && (
                  <p className="text-sm text-gray-600 italic">
                    {listing.assessment.prediction.healthRiskExplanation}
                  </p>
                )}
              </div>

              {/* Fair Price Range */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">
                    Fair Price Estimate
                  </span>
                  <ConfidenceBadge
                    confidence={listing.assessment.confidence.fairPrice}
                  />
                </div>
                <p className="text-xl font-semibold text-gray-900">
                  {formatIdrRange(
                    listing.assessment.prediction.fairPriceIdrRange.min,
                    listing.assessment.prediction.fairPriceIdrRange.max
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
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No AI Verification
            </h2>
            <p className="text-gray-600 mb-4">
              This listing has no AI verification yet.
            </p>
            <Link
              href="/scan"
              className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700"
            >
              Scan this animal
            </Link>
          </div>
        )}

        {/* Contact Seller CTA */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Interested?</h3>
          <p className="text-gray-600 mb-4">
            Contact the seller to arrange a viewing or purchase.
          </p>
          <button className="w-full sm:w-auto px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700">
            Contact Seller
          </button>
        </div>
      </div>

      <BottomNav />
      <div className="h-20 md:hidden" /> {/* Spacer for bottom nav */}
    </div>
  );
}
