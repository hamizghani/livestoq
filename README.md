# Livestoq

**Redefining the way livestock is traded.**

An AI-assisted livestock marketplace designed to reduce livestock transaction fraud by providing animal-level verification through a multi-angle scan workflow.

## Features

- **Multi-Angle Livestock Scanning**: Capture 4 angles (Front, Left, Back, Right) for comprehensive AI analysis
- **AI Assessment**: Mock AI predictions for species, age eligibility, weight, health risk, and fair price range
- **Marketplace**: Browse and filter verified and unverified livestock listings
- **Mobile-First Design**: Optimized for mobile devices with camera-friendly scanning flow
- **Trust Indicators**: Clear verification badges and confidence scores for all assessments

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **In-Memory Data Store** (ready for database integration)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
livestoq/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   ├── scan/              # Scan flow
│   │   ├── page.tsx       # Scan livestock page
│   │   └── results/       # Scan results page
│   └── marketplace/       # Marketplace pages
│       ├── page.tsx       # Marketplace listing
│       ├── create/       # Create listing page
│       └── [id]/         # Listing detail page
├── components/            # Reusable components
│   ├── Navigation.tsx    # Top and bottom navigation
│   └── Badges.tsx        # Verification badges
├── lib/                   # Core logic
│   ├── types.ts          # TypeScript type definitions
│   ├── mockAssessment.ts # Mock AI assessment generator
│   ├── mockMarketplace.ts # Marketplace seed data
│   ├── store.ts          # In-memory data store
│   └── utils.ts          # Utility functions
└── public/               # Static assets
```

## Key Pages

1. **Landing Page** (`/`): Hero section, how it works, trust messaging
2. **Scan Livestock** (`/scan`): 4-angle photo capture with stepper UI
3. **Scan Results** (`/scan/results`): AI assessment display with confidence scores
4. **Marketplace** (`/marketplace`): Browse listings with filters
5. **Listing Detail** (`/marketplace/[id]`): Full listing details with assessment
6. **Create Listing** (`/marketplace/create`): Create new listing with optional scan integration

## Mock AI Assessment

The MVP uses a mock AI assessment system that:
- Generates randomized but plausible predictions
- Returns confidence scores (70-99%)
- Provides species-specific weight and price ranges
- Maintains consistency within a scan session

## Data Models

### ScanAssessment
- 4 angle images (front, left, back, right)
- Predictions: species, age eligibility, weight, health risk, fair price range
- Confidence scores for each prediction
- Created timestamp

### MarketplaceListing
- Basic listing info (title, location, seller, price, image)
- Optional AI verification with assessment summary
- Verification badge display

## Future Integration Points

The codebase is structured to easily integrate:
- Real AI/ML models (replace `mockAssessment.ts`)
- Database (replace `store.ts` with database queries)
- Authentication (add auth middleware)
- Payment processing
- Image storage (S3, Cloudinary, etc.)

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Notes

- All images are stored as base64 strings in memory (session-only)
- Marketplace listings persist in memory during the session
- Placeholder image URLs are used for seed data
- Mobile-first responsive design throughout

## License

Private - All rights reserved
