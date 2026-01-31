export type Angle = "front" | "left" | "back" | "right";

export type Confidence = {
  species: number;        // 0.70–0.99
  ageEligibility: number; // 0.70–0.99
  weight: number;         // 0.70–0.99
  healthRisk: number;     // 0.70–0.99
  fairPrice: number;      // 0.70–0.99
};

export type ScanAssessment = {
  id: string;
  createdAt: string; // ISO
  images: Record<Angle, string>; // object URLs or base64
  prediction: {
    species: "cow" | "goat" | "sheep" | "lamb";
    ageEligibility: "9" | "11" | "13";
    weightKg: number;
    healthRisk: "Low" | "Medium" | "High";
    fairPriceIdrRange: { min: number; max: number }; // e.g., 800000–900000
  };
  confidence: Confidence;
};

export type MarketplaceListing = {
  id: string;
  title: string;
  location: string;
  sellerName: string;
  priceIdr: number;
  imageUrl: string;
  aiVerified: boolean;
  assessment?: Pick<ScanAssessment, "createdAt" | "prediction" | "confidence">;
};
