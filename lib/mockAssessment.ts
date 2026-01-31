import { ScanAssessment, Angle, Confidence } from "./types";

/**
 * Generates a mock AI assessment based on 5 angle images (including teeth).
 * Always returns fixed values: cow, 380kg, age 11, Medium health risk.
 */
export function generateMockAssessment(
  images: Record<Angle, string>
): ScanAssessment {
  const id = `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const createdAt = new Date().toISOString();

  // Fixed values as per requirements
  const species: "cow" = "cow";
  const weightKg = 380;
  const ageEligibility: "11" = "11";
  const gender: "male" = "male";
  const healthRisk: "Medium" = "Medium";
  const healthRiskExplanation = "Disease has been detected from the cow's teeth, indicating a possible dental or gum infection that may affect its overall health.";

  // Fair price range for cow (380kg is a good size)
  const min = 12000000; // 12M IDR
  const max = 18000000; // 18M IDR
  const fairPriceIdrRange = { min, max };

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
    gender: generateConfidence(),
  };

  return {
    id,
    createdAt,
    images,
    prediction: {
      species,
      ageEligibility,
      weightKg,
      gender,
      healthRisk,
      healthRiskExplanation,
      fairPriceIdrRange,
    },
    confidence,
  };
}
