"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { TopNav, BottomNav } from "@/components/Navigation";
import { useAuth } from "@/components/AuthContext";
import { VerifiedBadge, NotVerifiedBadge } from "@/components/Badges";
import { MarketplaceListing } from "@/lib/types";
import { store } from "@/lib/store";
import { formatIdr } from "@/lib/utils";

type FilterType = "all" | "verified" | "not-verified";
type SpeciesFilter = "all" | "cow" | "goat" | "sheep" | "lamb";

export default function MarketplacePage() {
  const { isAuthenticated } = useAuth();
  const [listings] = useState<MarketplaceListing[]>(
    store.getMarketplaceListings()
  );
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [speciesFilter, setSpeciesFilter] = useState<SpeciesFilter>("all");
  const [priceMin, setPriceMin] = useState<string>("");
  const [priceMax, setPriceMax] = useState<string>("");

  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      // Verification filter
      if (filterType === "verified" && !listing.aiVerified) return false;
      if (filterType === "not-verified" && listing.aiVerified) return false;

      // Species filter
      if (speciesFilter !== "all") {
        const species = listing.assessment?.prediction.species;
        if (!species || species !== speciesFilter) return false;
      }

      // Price range filter
      if (priceMin && listing.priceIdr < parseInt(priceMin)) return false;
      if (priceMax && listing.priceIdr > parseInt(priceMax)) return false;

      return true;
    });
  }, [listings, filterType, speciesFilter, priceMin, priceMax]);

  return (
    <div className="min-h-screen bg-white">
      <TopNav />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
          {isAuthenticated ? (
            <Link
              href="/marketplace/create"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700"
            >
              + Create Listing
            </Link>
          ) : (
            <Link
              href="/login?redirect=/marketplace/create"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700"
            >
              + Create Listing
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Verification Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as FilterType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All</option>
                <option value="verified">AI Verified</option>
                <option value="not-verified">Not Verified</option>
              </select>
            </div>

            {/* Species Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Species
              </label>
              <select
                value={speciesFilter}
                onChange={(e) => setSpeciesFilter(e.target.value as SpeciesFilter)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All</option>
                <option value="cow">Cow</option>
                <option value="goat">Goat</option>
                <option value="sheep">Sheep</option>
                <option value="lamb">Lamb</option>
              </select>
            </div>

            {/* Price Min */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Price (IDR)
              </label>
              <input
                type="number"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Price Max */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Price (IDR)
              </label>
              <input
                type="number"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                placeholder="No limit"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {/* Clear Filters */}
          {(filterType !== "all" ||
            speciesFilter !== "all" ||
            priceMin ||
            priceMax) && (
            <button
              onClick={() => {
                setFilterType("all");
                setSpeciesFilter("all");
                setPriceMin("");
                setPriceMax("");
              }}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Results Count */}
        <p className="text-sm text-gray-600 mb-4">
          Showing {filteredListings.length} of {listings.length} listings
        </p>

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No listings found.</p>
            <Link
              href="/marketplace/create"
              className="text-primary-600 hover:text-primary-700"
            >
              Create the first listing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <Link
                key={listing.id}
                href={`/marketplace/${listing.id}`}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-gray-100 relative">
                  <img
                    src={listing.imageUrl}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback for placeholder images
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='20' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3ELivestock Image%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    {listing.aiVerified ? (
                      <VerifiedBadge />
                    ) : (
                      <NotVerifiedBadge />
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {listing.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    📍 {listing.location}
                  </p>
                  <p className="text-lg font-bold text-primary-600 mb-3">
                    {formatIdr(listing.priceIdr)}
                  </p>
                  {listing.aiVerified && listing.assessment && (
                    <div className="space-y-1 text-xs text-gray-600 border-t border-gray-200 pt-3">
                      <p>
                        Weight: {listing.assessment.prediction.weightKg} kg
                      </p>
                      <p>Age: {listing.assessment.prediction.ageEligibility}</p>
                      <p>Health: {listing.assessment.prediction.healthRisk}</p>
                    </div>
                  )}
                  <div className="mt-3">
                    <span className="text-sm text-primary-600 font-medium">
                      View details →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
      <div className="h-20 md:hidden" /> {/* Spacer for bottom nav */}
    </div>
  );
}
