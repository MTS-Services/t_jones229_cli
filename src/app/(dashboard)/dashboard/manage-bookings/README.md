# Manage Bookings Module

This module handles all booking management functionality in the fishing trip application. The code is organized following a modular, scalable architecture similar to the Captain Management module.

## 📁 Folder Structure

```
manage-bookings/
├── page.tsx                 # Main entry point - fetches data and renders ManageBookings component
├── components/              # Reusable UI components
│   ├── index.ts            # Barrel export file
│   ├── ManageBookings.tsx  # Main orchestrator component
│   ├── BookingCard.tsx     # Individual booking card with details
│   ├── BookingStats.tsx    # Statistics cards (Today, Upcoming, Completed, Total)
│   ├── BookingTabs.tsx     # Tab navigation (Today, Upcoming, Past)
│   ├── BookingCardSkeleton.tsx  # Loading skeleton
│   └── EmptyState.tsx      # Empty state UI
├── types/                   # TypeScript type definitions
│   └── types.ts            # Booking, Trip, Boat, Captain interfaces
└── utils/                   # Utility functions
    └── utils.ts            # formatDate, formatCurrency, getStatusConfig, etc.
```

## 🏗️ Architecture

### Entry Point: `page.tsx`

- Fetches booking data using `useGetAllUserBookingQuery` hook
- Passes data to `ManageBookings` component
- Keeps the page component lightweight and focused on data fetching

### Main Component: `ManageBookings.tsx`

- Orchestrates the entire booking management UI
- Manages tab state (today, upcoming, past)
- Distributes data to child components
- Calculates counts and organizes bookings by category

### Component Responsibilities

#### `BookingStats.tsx`

- Displays 4 stat cards: Today, Upcoming, Completed, Total Bookings
- Color-coded with icons for visual hierarchy
- Responsive grid layout

#### `BookingTabs.tsx`

- Tab navigation with active state styling
- Shows count badges for each tab
- Handles tab switching
- Delegates rendering to BookingCard or EmptyState

#### `BookingCard.tsx`

- Displays comprehensive booking details
- Shows boat image, trip info, status badge
- Captain/Customer information (role-based)
- Payment summary (paid/due amounts)
- Action buttons (Email, Cancel)
- Responsive layout for mobile and desktop

#### `BookingCardSkeleton.tsx`

- Loading state animation
- Matches the structure of BookingCard

#### `EmptyState.tsx`

- User-friendly message when no bookings exist
- Context-aware messages based on active tab

### Types: `types/types.ts`

Defines TypeScript interfaces:

- `Booking` - Main booking data structure
- `Trip` - Trip details
- `Boat` - Boat and captain information
- `StatusConfig` - Status badge configuration
- `TabKey` - Tab type definitions

### Utils: `utils/utils.ts`

Helper functions:

- `formatDate()` - Formats dates to readable string
- `formatDepartureTime()` - Converts 24hr to 12hr format
- `formatCurrency()` - Formats numbers as USD currency
- `getStatusConfig()` - Returns styling config for booking status
- `calculateBookingCounts()` - Calculates totals by category

## 🎨 Design Features

- **Role-Based UI**: Shows customer info for captains, captain info for users
- **Status Badges**: Color-coded status indicators (Confirmed, Pending, Cancelled, Completed)
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Loading States**: Skeleton screens for better UX
- **Empty States**: Contextual messages when no data exists
- **Hover Effects**: Smooth transitions and shadow effects

## 🔄 Data Flow

```
page.tsx
  └─> useGetAllUserBookingQuery (API call)
      └─> ManageBookings component
          ├─> BookingStats (displays counts)
          └─> BookingTabs (tab navigation)
              └─> BookingCard[] or EmptyState
```

## 🚀 Benefits of This Structure

1. **Separation of Concerns**: Each component has a single responsibility
2. **Reusability**: Components can be easily reused or tested independently
3. **Maintainability**: Clear file organization makes it easy to locate code
4. **Type Safety**: Comprehensive TypeScript types prevent runtime errors
5. **Scalability**: Easy to add new features or modify existing ones
6. **Testability**: Small, focused components are easier to unit test

## 📝 Usage Example

```tsx
import ManageBookings from "./components/ManageBookings";

export default function Page() {
  const { data, isLoading } = useGetAllUserBookingQuery({});
  return <ManageBookings data={data?.data} isLoading={isLoading} />;
}
```

## 🔧 Future Enhancements

- Add pagination for large booking lists
- Implement booking filtering (by status, date range)
- Add booking search functionality
- Export bookings to PDF/CSV
- Bulk actions (cancel multiple bookings)
- Real-time updates using WebSockets

---

**Pattern**: This module follows the same architectural pattern as the Captain Management module for consistency across the application.
