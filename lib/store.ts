import { ScanAssessment, MarketplaceListing } from "./types";
import { getMockMarketplaceListings } from "./mockMarketplace";

/**
 * In-memory store for the session.
 * In production, this would be replaced with a database.
 */

// Store for scan assessments
let scanAssessments: ScanAssessment[] = [];

// Store for marketplace listings (initialized with seed data)
let marketplaceListings: MarketplaceListing[] = getMockMarketplaceListings();

export const store = {
  // Scan assessments
  addScanAssessment(assessment: ScanAssessment): void {
    scanAssessments.push(assessment);
  },
  
  getScanAssessment(id: string): ScanAssessment | undefined {
    return scanAssessments.find((a) => a.id === id);
  },
  
  getLatestScanAssessment(): ScanAssessment | undefined {
    return scanAssessments[scanAssessments.length - 1];
  },

  // Marketplace listings
  getMarketplaceListings(): MarketplaceListing[] {
    return marketplaceListings;
  },
  
  getMarketplaceListing(id: string): MarketplaceListing | undefined {
    return marketplaceListings.find((l) => l.id === id);
  },
  
  addMarketplaceListing(listing: MarketplaceListing): void {
    marketplaceListings.push(listing);
  },
};
