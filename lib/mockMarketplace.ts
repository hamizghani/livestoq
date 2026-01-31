import { MarketplaceListing, ScanAssessment } from "./types";
import { generateMockAssessment } from "./mockAssessment";

/**
 * Seed data for marketplace listings.
 * Includes 2 AI-verified listings and 1 non-verified listing.
 */
export function getMockMarketplaceListings(): MarketplaceListing[] {
  // Generate mock assessments for verified listings
  const assessment1 = generateMockAssessment({
    front: "https://example.com/images/cow1.jpg",
    left: "https://example.com/images/cow1.jpg",
    back: "https://example.com/images/cow1.jpg",
    right: "https://example.com/images/cow1.jpg",
    teeth: "https://example.com/images/cow1.jpg",
  });
  
  const assessment2 = generateMockAssessment({
    front: "https://example.com/images/cow2.jpg",
    left: "https://example.com/images/cow2.jpg",
    back: "https://example.com/images/cow2.jpg",
    right: "https://example.com/images/cow2.jpg",
    teeth: "https://example.com/images/cow2.jpg",
  });

  const listings: MarketplaceListing[] = [
    {
      id: "listing_1",
      title: "Bali Cow • Healthy • Ready",
      location: "Jakarta Selatan, DKI Jakarta",
      sellerName: "Ahmad Hidayat",
      priceIdr: 15000000,
      imageUrl: "https://dygtyjqp7pi0m.cloudfront.net/i/57299/47137621_1m.jpg?v=8DAD3104DD7C3F0",
      aiVerified: true,
      assessment: {
        createdAt: assessment1.createdAt,
        prediction: assessment1.prediction,
        confidence: assessment1.confidence,
      },
    },
    {
      id: "listing_2",
      title: "Premium Goat • Verified Quality",
      location: "Bandung, Jawa Barat",
      sellerName: "Siti Nurhaliza",
      priceIdr: 3500000,
      imageUrl: "https://www.woldswildlife.co.uk/images/uploads/animal_introduction_images/boer_vpse.jpeg",
      aiVerified: true,
      assessment: {
        createdAt: assessment2.createdAt,
        prediction: assessment2.prediction,
        confidence: assessment2.confidence,
      },
    },
    {
      id: "listing_3",
      title: "Local Sheep • Good Condition",
      location: "Surabaya, Jawa Timur",
      sellerName: "Budi Santoso",
      priceIdr: 2800000,
      imageUrl: "https://example.com/images/cow3.jpg",
      aiVerified: false,
    },
  ];

  return listings;
}
