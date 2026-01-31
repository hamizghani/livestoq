"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TopNav, BottomNav } from "@/components/Navigation";
import { Angle } from "@/lib/types";
import { generateMockAssessment } from "@/lib/mockAssessment";
import { store } from "@/lib/store";

const ANGLES: Array<{ key: Angle; label: string; icon: string }> = [
  { key: "front", label: "Front", icon: "⬆️" },
  { key: "left", label: "Left Side", icon: "⬅️" },
  { key: "back", label: "Back", icon: "⬇️" },
  { key: "right", label: "Right Side", icon: "➡️" },
  { key: "teeth", label: "Teeth", icon: "🦷" },
];

export default function ScanPage() {
  const router = useRouter();
  const [images, setImages] = useState<Partial<Record<Angle, string>>>({});
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImageCapture = (angle: Angle, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImages((prev) => ({ ...prev, [angle]: base64String }));
      // Auto-advance to next step if not the last one
      if (currentStep < ANGLES.length - 1) {
        setTimeout(() => setCurrentStep(currentStep + 1), 300);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (angle: Angle, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageCapture(angle, file);
    }
  };

  const handleAnalyze = async () => {
    const allImages = images as Record<Angle, string>;
    if (Object.keys(allImages).length !== 5) {
      alert("Please capture all 5 angles (including teeth) before analyzing.");
      return;
    }

    setIsAnalyzing(true);

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Generate mock assessment
    const assessment = generateMockAssessment(allImages);
    
    // Store assessment
    store.addScanAssessment(assessment);

    // Navigate to results
    router.push(`/scan/results?id=${assessment.id}`);
  };

  const allImagesCaptured = Object.keys(images).length === 5;
  const currentAngle = ANGLES[currentStep];

  return (
    <div className="min-h-screen bg-white">
      <TopNav />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Scan Livestock
        </h1>

        {/* Stepper */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {ANGLES.map((angle, index) => (
              <div
                key={angle.key}
                className={`flex-1 flex flex-col items-center ${
                  index < ANGLES.length - 1 ? "mr-2" : ""
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    images[angle.key]
                      ? "bg-primary-600 text-white"
                      : index === currentStep
                      ? "bg-primary-100 text-primary-700 border-2 border-primary-600"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {images[angle.key] ? "✓" : index + 1}
                </div>
                <span className="text-xs mt-2 text-center text-gray-600">
                  {angle.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Current Step Content */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{currentAngle.icon}</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Capture {currentAngle.label}
            </h2>
            <p className="text-gray-600">
              {images[currentAngle.key]
                ? "Image captured successfully"
                : "Take a photo or upload from gallery"}
            </p>
          </div>

          {images[currentAngle.key] ? (
            <div className="mb-4">
              <img
                src={images[currentAngle.key]}
                alt={currentAngle.label}
                className="w-full h-64 object-cover rounded-lg"
              />
              <button
                onClick={() => {
                  const newImages = { ...images };
                  delete newImages[currentAngle.key];
                  setImages(newImages);
                }}
                className="mt-2 w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Retake
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => handleFileInput(currentAngle.key, e)}
                  className="hidden"
                />
                <div className="w-full px-6 py-4 bg-primary-600 text-white rounded-lg text-center font-semibold cursor-pointer hover:bg-primary-700">
                  📷 Take Photo
                </div>
              </label>
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileInput(currentAngle.key, e)}
                  className="hidden"
                />
                <div className="w-full px-6 py-4 bg-white text-primary-600 rounded-lg text-center font-semibold border-2 border-primary-600 cursor-pointer hover:bg-primary-50">
                  📁 Upload from Gallery
                </div>
              </label>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-4">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Previous
              </button>
            )}
            {currentStep < ANGLES.length - 1 && (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Next
              </button>
            )}
          </div>
        </div>

        {/* Image Thumbnails */}
        {Object.keys(images).length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Captured Images
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {ANGLES.map((angle) => (
                <div
                  key={angle.key}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    images[angle.key]
                      ? "border-primary-600"
                      : "border-gray-200 bg-gray-100"
                  }`}
                >
                  {images[angle.key] ? (
                    <img
                      src={images[angle.key]}
                      alt={angle.label}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      {angle.icon}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analyze Button - Sticky Bottom on Mobile */}
        <div className="sticky bottom-20 md:relative md:bottom-0 bg-white pt-4 pb-4 md:pb-0 border-t md:border-t-0">
          <button
            onClick={handleAnalyze}
            disabled={!allImagesCaptured || isAnalyzing}
            className={`w-full px-6 py-4 rounded-lg font-semibold text-lg ${
              allImagesCaptured && !isAnalyzing
                ? "bg-primary-600 text-white hover:bg-primary-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isAnalyzing ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Analyzing...
              </span>
            ) : (
              "Analyze"
            )}
          </button>
        </div>
      </div>

      <BottomNav />
      <div className="h-20 md:hidden" /> {/* Spacer for bottom nav */}
    </div>
  );
}
