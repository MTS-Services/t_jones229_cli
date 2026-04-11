# Settings Module

This module contains the settings page and related components for user account management.

## Structure

```
settings/
├── components/          # Reusable UI components
│   ├── SettingsHeader.tsx        # Page header with title
│   ├── AccountSettings.tsx       # Email, phone, password settings
│   ├── SecuritySettings.tsx      # 2FA, active sessions
│   ├── NotificationSettings.tsx  # Notification preferences
│   ├── PrivacySettings.tsx       # Privacy controls
│   ├── DangerZone.tsx           # Account deactivation/deletion
│   └── index.ts                 # Component exports
├── types/              # TypeScript type definitions
│   ├── settings.types.ts        # Settings-related types
│   └── index.ts                # Type exports
├── utils/              # Utility functions
│   ├── helpers.ts              # Date formatting, validation
│   └── index.ts               # Utility exports
├── page.tsx            # Main settings page
└── README.md           # This file
```

## Components

### SettingsHeader

Displays the settings page title and description.

### AccountSettings

- Email address management
- Phone number settings
- Password change option
- Direct links to edit pages

### SecuritySettings

- Two-factor authentication toggle
- Active device sessions list
- Session termination controls

### NotificationSettings

- Email notifications toggle
- Booking updates preferences
- Trip reminders configuration
- Promotional emails opt-in/out

### PrivacySettings

- Profile visibility controls (public/private/friends)
- Email visibility toggle
- Phone visibility toggle
- Data sharing preferences

### DangerZone

- Account deactivation option
- Account deletion with confirmation modal

## Types

- `User` - User account information
- `NotificationSettings` - Notification preference flags
- `PrivacySettings` - Privacy control settings
- `DisplaySettings` - Language, timezone, currency preferences
- `SecuritySession` - Active session information

## Utils

- `formatLastActive()` - Format session last active timestamp
- `getDeviceIcon()` - Get emoji icon for device type
- `validatePassword()` - Validate password strength
- `getPasswordStrength()` - Calculate password strength level

## Features

### Account Management

✅ View and edit email address  
✅ Manage phone number  
✅ Change password  
✅ Email verification status

### Security

✅ Two-factor authentication  
✅ Active session monitoring  
✅ Remote session termination  
✅ Security activity log

### Notifications

✅ Email notification controls  
✅ Booking update preferences  
✅ Trip reminder settings  
✅ Marketing email opt-in/out

### Privacy

✅ Profile visibility controls  
✅ Contact information privacy  
✅ Data sharing preferences  
✅ Granular privacy settings

### Account Actions

✅ Temporary account deactivation  
✅ Permanent account deletion  
✅ Confirmation modals for destructive actions

## Integration

- Uses `useGetMeQuery` from auth API
- Next.js router for navigation
- Local state for toggle preferences
- Matches dashboard design patterns

## Usage

Navigate to `/dashboard/settings` to access the settings page.
