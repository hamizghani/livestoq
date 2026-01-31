import { ScanAssessment, Angle, Confidence } from "./types";

/**
 * Generates a mock AI assessment based on 4 angle images.
 * Predictions are randomized but constrained to plausible ranges.
 */
export function generateMockAssessment(
  images: Record<Angle, string>
): ScanAssessment {
  const id = `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const createdAt = new Date().toISOString();

  // Randomize species (weighted toward cow for marketplace, but scan can be any)
  const speciesOptions: Array<"cow" | "goat" | "sheep" | "lamb"> = [
    "cow",
    "goat",
    "sheep",
    "lamb",
  ];
  const species =
    speciesOptions[Math.floor(Math.random() * speciesOptions.length)];

  // Generate weight based on species
  let weightKg: number;
  if (species === "cow") {
    weightKg = Math.floor(Math.random() * (500 - 200 + 1)) + 200; // 200-500 kg
  } else {
    weightKg = Math.floor(Math.random() * (70 - 25 + 1)) + 25; // 25-70 kg
  }

  // Age eligibility (qurban-aware but general)
  const ageEligibilityOptions: Array<
    "9" | "11" | "13"
  > = ["9", "11", "13"];
  const ageEligibility =
    ageEligibilityOptions[
      Math.floor(Math.random() * ageEligibilityOptions.length)
    ];

  // Health risk
  const healthRiskOptions: Array<"Low" | "Medium" | "High"> = [
    "Low",
    "Medium",
    "High",
  ];
  const healthRisk =
    healthRiskOptions[Math.floor(Math.random() * healthRiskOptions.length)];

  // Fair price range (IDR) based on species
  let fairPriceIdrRange: { min: number; max: number };
  if (species === "cow") {
    const min = Math.floor(Math.random() * (20000000 - 8000000 + 1)) + 8000000; // 8M-20M
    const max = min + Math.floor(Math.random() * (10000000 - 2000000 + 1)) + 2000000; // min + 2M-10M
    fairPriceIdrRange = { min, max };
  } else {
    const min = Math.floor(Math.random() * (5000000 - 1200000 + 1)) + 1200000; // 1.2M-5M
    const max = min + Math.floor(Math.random() * (1000000 - 300000 + 1)) + 300000; // min + 300K-1M
    fairPriceIdrRange = { min, max };
  }

  // Generate confidence scores (0.70–0.99)
  const generateConfidence = (): number => {
    return Math.round((Math.random() * 0.29 + 0.70) * 100) / 100;
  };

  const confidence: Confidence = {
    species: generateConfidence(),
    ageEligibility: generateConfidence(),
    weight: generateConfidence(),
    healthRisk: generateConfidence(),
    fairPrice: generateConfidence(),
  };

  return {
    id,
    createdAt,
    images,
    prediction: {
      species,
      ageEligibility,
      weightKg,
      healthRisk,
      fairPriceIdrRange,
    },
    confidence,
  };
}
