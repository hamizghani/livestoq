"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { TopNav, BottomNav } from "@/components/Navigation";
import { useAuth } from "@/components/AuthContext";
import { MarketplaceListing, ScanAssessment } from "@/lib/types";
import { store } from "@/lib/store";
import { formatIdr } from "@/lib/utils";

function CreateListingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const scanId = searchParams.get("scanId");

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    sellerName: "",
    priceIdr: "",
    imageUrl: "",
  });
  const [useScanVerification, setUseScanVerification] = useState(!!scanId);
  const [scanAssessment, setScanAssessment] = useState<ScanAssessment | null>(
    null
  );
  const [imagePreview, setImagePreview] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/marketplace/create");
      return;
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (scanId) {
      const assessment = store.getScanAssessment(scanId);
      if (assessment) {
        setScanAssessment(assessment);
        setFormData((prev) => ({
          ...prev,
          imageUrl: assessment.images.front, // Use front image as default
        }));
        setImagePreview(assessment.images.front);
      }
    }
  }, [scanId]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData((prev) => ({ ...prev, imageUrl: base64String }));
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }
    if (!formData.sellerName.trim()) {
      newErrors.sellerName = "Seller name is required";
    }
    if (!formData.priceIdr || parseFloat(formData.priceIdr) <= 0) {
      newErrors.priceIdr = "Valid price is required";
    }
    if (!formData.imageUrl) {
      newErrors.imageUrl = "Image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newListing: MarketplaceListing = {
      id: `listing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: formData.title,
      location: formData.location,
      sellerName: formData.sellerName,
      priceIdr: parseInt(formData.priceIdr),
      imageUrl: formData.imageUrl,
      aiVerified: useScanVerification && scanAssessment !== null,
      assessment:
        useScanVerification && scanAssessment
          ? {
              createdAt: scanAssessment.createdAt,
              prediction: scanAssessment.prediction,
              confidence: scanAssessment.confidence,
            }
          : undefined,
    };

    store.addMarketplaceListing(newListing);
    router.push(`/marketplace/${newListing.id}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <TopNav />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link
          href="/marketplace"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          ← Back to Marketplace
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Create New Listing
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Listing Image *
            </label>
            {imagePreview ? (
              <div className="mb-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview("");
                    setFormData((prev) => ({ ...prev, imageUrl: "" }));
                  }}
                  className="mt-2 text-sm text-red-600 hover:text-red-700"
                >
                  Remove image
                </button>
              </div>
            ) : (
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="w-full px-6 py-12 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-primary-500 hover:bg-primary-50">
                  <p className="text-gray-600">Click to upload image</p>
                  <p className="text-sm text-gray-500 mt-1">
                    or drag and drop
                  </p>
                </div>
              </label>
            )}
            {errors.imageUrl && (
              <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="e.g., Bali Cow • Healthy • Ready"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
              placeholder="e.g., Jakarta Selatan, DKI Jakarta"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location}</p>
            )}
          </div>

          {/* Seller Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seller Name *
            </label>
            <input
              type="text"
              value={formData.sellerName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  sellerName: e.target.value,
                }))
              }
              placeholder="Your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            {errors.sellerName && (
              <p className="mt-1 text-sm text-red-600">{errors.sellerName}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (IDR) *
            </label>
            <input
              type="number"
              value={formData.priceIdr}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, priceIdr: e.target.value }))
              }
              placeholder="15000000"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            {formData.priceIdr && !errors.priceIdr && (
              <p className="mt-1 text-sm text-gray-600">
                {formatIdr(parseInt(formData.priceIdr))}
              </p>
            )}
            {errors.priceIdr && (
              <p className="mt-1 text-sm text-red-600">{errors.priceIdr}</p>
            )}
          </div>

          {/* AI Verification Toggle */}
          {scanAssessment && (
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Add AI Verification (from scan)
                </label>
                <input
                  type="checkbox"
                  checked={useScanVerification}
                  onChange={(e) => setUseScanVerification(e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
              </div>
              {useScanVerification && (
                <div className="mt-3 text-sm text-gray-600">
                  <p>
                    Species: {scanAssessment.prediction.species} (
                    {Math.round(scanAssessment.confidence.species * 100)}%
                    confidence)
                  </p>
                  <p>
                    Weight: {scanAssessment.prediction.weightKg} kg (
                    {Math.round(scanAssessment.confidence.weight * 100)}%
                    confidence)
                  </p>
                  <p>
                    Health: {scanAssessment.prediction.healthRisk} (
                    {Math.round(scanAssessment.confidence.healthRisk * 100)}%
                    confidence)
                  </p>
                </div>
              )}
            </div>
          )}

          {!scanAssessment && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-3">
                Want to add AI verification to your listing?
              </p>
              <Link
                href="/scan"
                className="inline-block px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 text-sm"
              >
                Scan this animal
              </Link>
            </div>
          )}

          {/* Submit Button */}
          <div className="sticky bottom-20 md:relative md:bottom-0 bg-white pt-4 pb-4 md:pb-0 border-t md:border-t-0">
            <button
              type="submit"
              className="w-full px-6 py-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 text-lg"
            >
              Publish Listing
            </button>
          </div>
        </form>
      </div>

      <BottomNav />
      <div className="h-20 md:hidden" /> {/* Spacer for bottom nav */}
    </div>
  );
}

export default function CreateListingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white">
          <TopNav />
          <div className="max-w-2xl mx-auto px-4 py-12 text-center">
            <p className="text-gray-600">Loading...</p>
          </div>
          <BottomNav />
        </div>
      }
    >
      <CreateListingContent />
    </Suspense>
  );
}
