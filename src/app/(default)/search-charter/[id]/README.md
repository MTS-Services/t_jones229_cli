# Search Charter Details Module

This module contains the boat details page and related components for viewing individual charter listings.

## Structure

```
[id]/
├── components/          # Reusable UI components
│   ├── BoatOverview.tsx          # Boat title and description
│   ├── CaptainSection.tsx        # Captain info with location
│   ├── TripSelectionSection.tsx  # Trip listing with summary
│   └── index.ts                  # Component exports
├── types/              # TypeScript type definitions
│   ├── boat.types.ts             # Boat, trip, and photo types
│   └── index.ts                 # Type exports
├── utils/              # Utility functions
│   ├── helpers.ts               # Date formatting, data loading
│   └── index.ts                # Utility exports
├── page.tsx            # Main boat details page
└── README.md           # This file
```

## Components

### BoatOverview

Displays the boat's title and description from the listing data.

**Props:**

- `title?: string` - Listing title
- `description?: string` - Listing description

### CaptainSection

Shows captain information with avatar, name, and location.

**Props:**

- `captainName: string` - Captain's first name
- `location: string` - Meeting point location

**Features:**

- User avatar placeholder
- Location icon indicator
- Action button for captain profile

### TripSelectionSection

Displays available trips with search criteria summary.

**Props:**

- `trips?: BoatTrip[]` - Available trips
- `boatId: string` - Current boat ID
- `boatImage?: BoatPhoto[]` - Boat photos
- `tripDetails: TripDetails` - Search criteria

**Features:**

- Search summary (location, date, guests)
- Trip cards with different images
- Pricing information
- Booking buttons

## Types

### BoatInfo

Complete boat object with all details:

- Photos array
- Descriptions
- Captain information
- Meeting points
- Available trips

### TripDetails

User's search criteria:

- Location
- Date
- Number of guests

### BoatTrip

Individual trip information:

- ID, name, price
- Description, duration
- Additional trip details

### BoatPhoto

Photo object with URL and metadata

## Utils

### formatDisplayDate(dateString)

Formats date string to readable format (e.g., "Jan 15, 2026")

### loadSearchDataFromStorage()

Loads trip search criteria from localStorage with fallback support

### buildTripSummary(tripDetails, formatDate)

Builds formatted trip summary string

## Page Flow

1. **Load boat data** via `useGetSingleBoatQuery(boatId)`
2. **Load search criteria** from localStorage on mount
3. **Display boat details** in two-column grid:
   - Left: Image carousel
   - Right: Overview, captain, map, features, FAQ
4. **Show trip selection** with search summary and trip cards
5. **Each trip card** displays different boat photo using imageIndex

## Integration

- Uses Redux API for boat data fetching
- Next.js router for dynamic routing
- LocalStorage for search persistence
- Integrates with existing DetailsPage components
- Links to payment flow on trip selection

## Usage

Navigate to `/search-charter/[boatId]` to view boat details and select trips.
