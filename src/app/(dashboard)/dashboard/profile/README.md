# Profile Module

This module contains the user profile page and related components.

## Structure

```
profile/
├── components/          # Reusable UI components
│   ├── ProfileHeader.tsx       # Header with avatar and cover
│   ├── QuickStats.tsx         # Statistics cards
│   ├── PersonalInformation.tsx # Personal info card
│   ├── AccountDetails.tsx     # Account details card
│   ├── QuickActions.tsx       # Quick action buttons
│   └── index.ts              # Component exports
├── types/              # TypeScript type definitions
│   ├── profile.types.ts      # User and profile types
│   └── index.ts             # Type exports
├── utils/              # Utility functions
│   ├── formatters.ts        # Date formatting and badge helpers
│   ├── helpers.ts           # Profile stats and user helpers
│   └── index.ts            # Utility exports
└── page.tsx            # Main profile page

```

## Components

### ProfileHeader

Displays user avatar, name, email, role, and status badges with action buttons.

### QuickStats

Shows key metrics: total trips, active bookings, and member since date.

### PersonalInformation

Card showing personal details: name, email, phone, and registration type.

### AccountDetails

Card showing account information: status, role, creation date, and Stripe info for captains.

### QuickActions

Grid of action buttons for quick navigation to trips, settings, and logout.

## Types

- `User` - Complete user object from API
- `ProfileStats` - Calculated statistics for the profile
- `StatusConfig` - Configuration for status badges
- `UserResponse` - API response wrapper

## Utils

- `formatDate()` - Format dates in readable format
- `getRoleBadgeColor()` - Get Tailwind classes for role badges
- `getStatusBadge()` - Get status badge configuration
- `getProfileStats()` - Calculate profile statistics
- `getUserInitials()` - Get user initials for avatar
- `getUserFullName()` - Get formatted full name
