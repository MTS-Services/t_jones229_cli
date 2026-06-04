# Fishing Tripper - Enterprise SaaS Platform Documentation

## Executive Summary

**Platform Name:** Fishing Tripper  
**Platform Type:** Boat Charter Booking & Management SaaS  
**Architecture:** Full-stack Next.js 15 application with REST API backend  
**Payment Provider:** Stripe  
**Authentication:** JWT-based with Firebase integration  
**Version:** 1.0  
**Last Updated:** February 5, 2026

---

## 1. System Overview

### 1.1 Platform Purpose and Core Value

Fishing Tripper is a **multi-sided marketplace** that connects:
- **Customers** seeking fishing charter experiences
- **Captains** offering boat charter services  
- **Administrators** managing platform operations

**Core Value Propositions:**
- **For Customers:** Easy booking of private or shared fishing charters with secure payment processing
- **For Captains:** Streamlined booking management, automated payment collection, and trip scheduling
- **For Admins:** Complete oversight of users, captains, bookings, and financial transactions

### 1.2 High-Level System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Layer                        │
│  Next.js 15 (React 19) + TypeScript + Tailwind CSS     │
│  Redux Toolkit for State Management                     │
│  Stripe Elements for Payment UI                         │
└──────────────────┬──────────────────────────────────────┘
                   │ REST API (HTTPS)
                   │ JWT Authentication
┌──────────────────▼──────────────────────────────────────┐
│                    Backend API Layer                     │
│  Express.js / Node.js REST API                          │
│  Base URL: https://api.fishingtripper.com/api/v1       │
└──────────────────┬──────────────────────────────────────┘
                   │
    ┌──────────────┼──────────────┐
    │              │              │
┌───▼────┐   ┌────▼─────┐  ┌────▼──────┐
│Database│   │  Stripe  │  │  Firebase │
│(PostgreSQL│   │ Payment │  │   Auth    │
│/MySQL)  │   │ Gateway  │  │  Service  │
└─────────┘   └──────────┘  └───────────┘
```

**Technology Stack:**
- **Frontend:** Next.js 15, React 19, TypeScript, Redux Toolkit, Tailwind CSS
- **State Management:** Redux Toolkit with RTK Query
- **Payment Processing:** Stripe (React Stripe.js, Stripe Elements)
- **Authentication:** JWT tokens + Firebase Authentication
- **Form Management:** React Hook Form with Zod validation
- **HTTP Client:** RTK Query (built on Fetch API)

### 1.3 User Roles

| Role | Identifier | Description |
|------|-----------|-------------|
| **SUPERADMIN** | `SUPERADMIN` | Platform owner with full system access |
| **ADMIN** | `ADMIN` | Administrative staff managing users, bookings, and captains |
| **CAPTAIN** | `CAPTAIN` | Boat owners/operators offering charter services |
| **USER** | `USER` | Customers booking fishing charters |

---

## 2. Role-Based Authorization

### 2.1 Role Definitions and Permission Matrix

| Feature/Module | SUPERADMIN | ADMIN | CAPTAIN | USER |
|----------------|------------|-------|---------|------|
| **Dashboard Access** | ✅ Full | ✅ Full | ✅ Limited | ✅ Limited |
| **User Management** | ✅ | ✅ | ❌ | ❌ |
| **Captain Management** | ✅ | ✅ | ❌ | ❌ |
| **Approve/Reject Captains** | ✅ | ✅ | ❌ | ❌ |
| **Booking Management (All)** | ✅ | ✅ | ❌ | ❌ |
| **Trips Management (All)** | ✅ | ✅ | ❌ | ❌ |
| **Create Boat Listing** | ❌ | ❌ | ✅ | ❌ |
| **Manage Own Boat/Trips** | ❌ | ❌ | ✅ | ❌ |
| **View Own Bookings** | ❌ | ❌ | ✅ | ✅ |
| **Accept/Reject Bookings** | ❌ | ❌ | ✅ | ❌ |
| **Make Bookings** | ❌ | ❌ | ❌ | ✅ |
| **Cancel Own Bookings** | ✅ | ✅ | ✅ | ✅ |
| **View Trip Calendar** | ✅ | ✅ | ✅ | ❌ |
| **Payment Processing** | ❌ | ❌ | ✅ Receive | ✅ Pay |
| **Refund Requests** | ✅ | ✅ | ❌ | ✅ Request |
| **Delete Users** | ✅ | ✅ | ❌ | ❌ |
| **Email Communications** | ✅ | ✅ | ✅ | ✅ |

### 2.2 Module-Level Access Control

**Admin-Only Modules:**
- `/dashboard` (admin dashboard)
- `/dashboard/user-management`
- `/dashboard/captain-management`
- `/dashboard/booking-managment`
- `/dashboard/trips-managment`

**Captain-Only Modules:**
- `/dashboard/check-your-trip`
- `/dashboard/boat-trip`
- `/dashboard/trips-calender`
- `/dashboard/manage-bookings`
- `/dashboard/membership`
- `/boat-list-form/*` (all boat listing steps)

**User-Only Modules:**
- `/dashboard/edit-user-details`
- `/dashboard/your-trips`

**Shared Modules:**
- `/dashboard/support` (Captain & User)
- `/dashboard/reset-password` (Captain, User, Admin)

### 2.3 Payment-Related Permissions

| Action | SUPERADMIN | ADMIN | CAPTAIN | USER |
|--------|------------|-------|---------|------|
| **Charge Customer** | ❌ | ❌ | ✅ (Auto) | ❌ |
| **Receive Payouts** | ❌ | ❌ | ✅ | ❌ |
| **Process Refunds** | ✅ | ✅ | ❌ | ❌ |
| **View All Transactions** | ✅ | ✅ | ❌ | ❌ |
| **View Own Transactions** | ❌ | ❌ | ✅ | ✅ |
| **Configure Stripe Account** | ❌ | ❌ | ✅ | ❌ |
| **Enable Charge Capability** | ✅ | ✅ | ❌ | ❌ |

### 2.4 Security Boundaries Between Roles

**Authentication Layer:**
- JWT tokens stored in Redux state and browser cookies
- Token format: `Bearer <jwt_token>`
- Token includes: `{ id, name, email, role, iat, exp }`
- Tokens attached to all API requests via Authorization header

**Frontend Authorization:**
- Role-based routing protection
- Component-level role checks using Redux state
- Sidebar items dynamically filtered by user role

**Backend Authorization (Expected):**
- API endpoint validation by role
- Resource ownership verification (e.g., captains can only modify their own boats)
- Payment endpoint authorization (webhooks verified via Stripe signatures)

---

## 3. User Workflow (Customer Side)

### 3.1 Registration & Authentication

**Registration Flow:**

```
User → Signup Page → Enter Details → Submit
    ↓
Backend validates → Create user record → Send verification email (optional)
    ↓
User → Login Page → Enter credentials → JWT issued
    ↓
Token stored → Redirect to homepage
```

**Registration Methods:**

1. **Email/Password Registration**
   - Endpoint: `POST /api/v1/users/register`
   - Required fields: `email`, `password`, `firstName`, `lastName`
   - `registerType`: `EMAILPASS`
   
2. **Google OAuth Registration**
   - Firebase authentication
   - Auto-register via backend
   - `registerType`: `GOOGLE`

**Login Flow:**
- Endpoint: `POST /api/v1/auth/login`
- Request: `{ email, password }`
- Response: `{ success, data: { accessToken, id, email, name, role }, message }`
- Token stored in Redux + Cookie (`token`, `currentUserRole`)

**Token Management:**
- JWT stored in Redux state: `auth.token`
- Cookie storage: `token`, `currentUserRole`
- Token expiry: Configured by backend (typically 24 hours)
- On expiry: User redirected to login, session cleared

### 3.2 Browsing and Booking Flow

**Step 1: Search for Charters**
```
Homepage → Search Form (location, date, guests) → Search Results
    ↓
Filter by: Price (low-to-high, high-to-low), Guests, Date Range, City
    ↓
View Boat Details → See trips, photos, captain info, pricing
```

**Step 2: Select Trip Type**
- **PRIVATE Booking:** Entire boat reserved for user's group
- **GROUP/SHARED Booking:** Individual seats on a shared charter

**Step 3: Booking Initiation**
```
Select Trip → Choose Date → Enter Group Size → Proceed to Payment
    ↓
localStorage stores: { date, Guests, bookingType }
    ↓
Redirect to /payment?boatId=xxx&tripId=xxx
```

### 3.3 Payment Initiation and Confirmation

**Payment Page Flow:**

```
Enter Payment Details (Stripe Elements)
    ↓
Fill User Info: firstName, lastName, email, phone
    ↓
Fill Billing Info: country, zipCode
    ↓
Submit Payment → Stripe creates Payment Method
    ↓
Backend receives: { boatId, tripId, tripDate, amount, bookingType, groupSize, paymentMethodId, memberInfo }
    ↓
Backend charges via Stripe → Creates booking record
    ↓
Email: Booking Confirmation sent
    ↓
Redirect to /private-confirmation or /group-confirmation
```

**Payment Options:**
- **Full Payment:** Pay entire trip cost upfront
- **Partial Payment (if enabled):** Pay deposit, remainder due later

**Booking Creation Request:**
```json
{
  "boatId": "boat123",
  "tripId": "trip456",
  "tripDate": "2026-03-15",
  "amount": "full",
  "bookingType": true,
  "groupSize": 4,
  "paymentMethodId": "pm_1234567890",
  "memberInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phoneNumber": "+1234567890"
  }
}
```

**Booking States:**
- **PENDING:** Booking created, awaiting captain acceptance
- **CONFIRMED:** Captain accepted booking
- **CANCELLED:** Booking cancelled by user or captain
- **COMPLETED:** Trip finished

### 3.4 Booking Completion, Cancellation, or Refund

**View Booking:**
- Navigate to: `/dashboard/your-trips`
- Endpoint: `GET /api/v1/booking/booking/my-booking`
- Shows: Upcoming bookings, past bookings

**Cancel Booking:**
- User clicks "Cancel" → Confirmation modal
- Endpoint: `PUT /api/v1/booking/cancel-booking/{id}`
- Booking status → `CANCELLED`
- Refund processed (depending on cancellation policy)

**Refund Flow:**
```
User cancels → Backend validates cancellation policy
    ↓
If eligible → Refund initiated via Stripe
    ↓
Email: Refund confirmation sent
    ↓
Booking status → CANCELLED, paymentStatus → REFUNDED
```

### 3.5 Email Examples (Customer)

#### Account Verification Email

**Trigger:** User registers with email/password  
**Sender:** noreply@fishingtripper.com  
**Subject:** Verify your Fishing Tripper account

```
Hi {{firstName}},

Welcome to Fishing Tripper! 

Please verify your email address to activate your account:
[Verify Email Button]

If you didn't create this account, you can safely ignore this email.

Happy fishing!
The Fishing Tripper Team
```

#### Booking Confirmation Email

**Trigger:** Booking successfully created  
**Sender:** bookings@fishingtripper.com  
**Subject:** Booking Confirmed - {{tripName}} on {{tripDate}}

```
Hi {{userName}},

Your booking is confirmed! 🎉

Booking Details:
- Trip: {{tripName}}
- Date: {{tripDate}}
- Type: {{bookingType}} ({{groupSize}} guests)
- Captain: {{captainName}}
- Boat: {{boatType}}
- Departure: {{departureTime}}
- Amount Paid: ${{payFirst}}
- Amount Due: ${{payDue}}

Booking ID: {{bookingId}}

[View Booking Details]

See you on the water!
Fishing Tripper Team
```

#### Payment Success Email

**Trigger:** Payment charged successfully  
**Sender:** payments@fishingtripper.com  
**Subject:** Payment Received - ${{amount}}

```
Hi {{userName}},

We've received your payment of ${{amount}} for your upcoming trip.

Payment Details:
- Booking ID: {{bookingId}}
- Transaction ID: {{transactionId}}
- Amount: ${{amount}}
- Payment Method: {{paymentMethod}}

[Download Receipt]

Thanks for choosing Fishing Tripper!
```

#### Payment Failed Email

**Trigger:** Payment authorization failed  
**Sender:** payments@fishingtripper.com  
**Subject:** Payment Failed - Action Required

```
Hi {{userName}},

We were unable to process your payment for booking #{{bookingId}}.

Reason: {{failureReason}}

Please update your payment method to complete your booking:
[Update Payment Method]

Your booking will be held for 24 hours.

Need help? Contact support@fishingtripper.com

Fishing Tripper Team
```

#### Refund Processed Email

**Trigger:** Refund issued to customer  
**Sender:** payments@fishingtripper.com  
**Subject:** Refund Processed - ${{refundAmount}}

```
Hi {{userName}},

Your refund has been processed.

Refund Details:
- Booking ID: {{bookingId}}
- Refund Amount: ${{refundAmount}}
- Original Payment: ${{originalAmount}}
- Refund Reason: {{reason}}
- Processing Time: 5-10 business days

The refund will appear on your {{paymentMethod}} ending in {{last4}}.

Questions? Reply to this email or contact support.

Fishing Tripper Team
```

---

## 4. Captain Workflow (Primary Focus)

### 4.1 Captain Onboarding and Approval

**Onboarding Journey:**

```
User registers → Selects "List Your Boat" → Multi-step form
    ↓
Step 1: Boat Information (type, length, capacity, location)
Step 2: Photos & Video (upload boat images)
Step 3: Fishing Details (target species, techniques)
Step 4: Meeting Point (map location)
Step 5: Description (listing details)
Step 6: Trips (create trip offerings)
Step 7: Terms & Conditions (captain license upload)
    ↓
Submit for Approval → Backend creates boat with status: PENDING
    ↓
Admin Review → Approve or Reject
    ↓
Email: Approval/Rejection notification
    ↓
If approved: Captain role activated → Stripe account setup required
```

**Boat Creation:**
- Endpoint: `POST /api/v1/boat`
- Creates boat record with `approvalStatus: PENDING`
- Captain cannot list trips until approved

**Admin Approval Process:**
1. Admin views: `/dashboard/captain-management`
2. Reviews captain details, boat info, license
3. Endpoint: `PATCH /api/v1/boat/status/{boatId}`
4. Payload: `{ status: "APPROVE" }` or `{ status: "REJECT" }`

**Stripe Account Setup:**
- Captain navigates to: `/dashboard/membership`
- Connects Stripe account for receiving payments
- Endpoint: `PATCH /api/v1/users/stripe/charge-enable?stripeAccount={accountId}`
- `chargeEnabled: true` → Can receive bookings

### 4.2 Availability & Pricing Management

**Create Trip Offerings:**
- Navigate to: `/dashboard/boat-trip` → Add Trip
- Endpoint: `POST /api/v1/boat` (trip nested in boat creation)
- Update Endpoint: `PATCH /api/v1/boat/trip/{tripId}`

**Trip Configuration Fields:**
- `tripName`: e.g., "Half-Day Reef Fishing"
- `tripType`: e.g., "Offshore", "Inshore"
- `duration`: Hours (e.g., 4, 6, 8)
- `departureTime`: e.g., "06:00 AM"
- `tripDays`: Array of available days ["Monday", "Wednesday", "Friday"]
- `price`: Per trip or per person
- `maxGuests`: Capacity
- `description`: Trip details

**Pricing Models:**
- **Private Trip Pricing:** Flat rate for entire boat
- **Shared Trip Pricing:** Per-person rate

**Availability Calendar:**
- View: `/dashboard/trips-calender`
- Endpoint: `GET /api/v1/booking/calendar?month=3&year=2026`
- Shows: Booked dates, available slots, upcoming trips

### 4.3 Booking Lifecycle (Received → Accepted → Completed)

**Complete Flow:**

```
Customer books → Booking created (status: PENDING)
    ↓
Email: New Booking Notification sent to Captain
    ↓
Captain reviews: /dashboard/manage-bookings
    ↓
[Option 1] Accept → status: CONFIRMED → Email to customer
[Option 2] Reject → status: CANCELLED → Refund initiated → Email to customer
    ↓
Trip Day:
    ↓
Captain completes trip → Manually mark as COMPLETED (or auto after tripDate)
    ↓
Email: Trip Completion Summary → Payout initiated
```

**Manage Bookings:**
- View all bookings: `GET /api/v1/booking?limit=10&page=1`
- Filter by status: `?status=CONFIRMED`
- View details: Click booking → `/dashboard/booking-managment/{bookingId}`

**Booking Actions:**
- **Email customer:** Modal to send message
  - Endpoint: `POST /api/v1/booking/send-email-captain/{bookingId}`
- **Cancel booking:** `PUT /api/v1/booking/cancel-booking/{bookingId}`

### 4.4 Earnings Calculation and Payout Flow

**Earnings Model:**
```
Booking Amount (Customer Pays) → Platform Fee (%) → Captain Payout
```

**Example Calculation:**
- Booking Total: $500
- Platform Fee: 15% = $75
- Captain Receives: $425

**Payout Trigger:**
- Trip status → `COMPLETED`
- Payout processed via Stripe Connect
- Timeline: 2-7 business days to captain's bank account

**View Earnings:**
- Dashboard: `/dashboard` (Captain view)
- Shows: Total earnings, pending payouts, completed payouts

**Payout States:**
- **PENDING:** Trip completed, payout queued
- **PROCESSING:** Stripe processing transfer
- **PAID:** Funds transferred to captain's bank

### 4.5 Cancellations, No-Shows, Disputes

**Captain Cancels Booking:**
- Endpoint: `PUT /api/v1/booking/cancel-booking/{bookingId}`
- Full refund issued to customer
- Email notification sent to both parties

**Customer No-Show:**
- Captain marks trip as completed
- Customer not refunded (policy-dependent)
- Captain receives full payout

**Dispute Resolution:**
- Either party contacts support
- Admin reviews via `/dashboard/booking-managment/{bookingId}`
- Manual refund if needed: Admin action via Stripe dashboard
- Booking status updated accordingly

### 4.6 Email Examples (Captain)

#### Captain Approval Email

**Trigger:** Admin approves boat listing  
**Sender:** admin@fishingTripper.com  
**Subject:** Your Boat Listing Has Been Approved!

```
Hi Captain {{captainName}},

Congratulations! Your boat listing has been approved. 🎉

Boat Details:
- Boat Type: {{boatType}}
- Capacity: {{guests}} guests
- Location: {{city}}

Next Steps:
1. Set up your Stripe account to receive payments
2. Create your first trip offering
3. Start receiving bookings!

[Complete Setup]

Welcome aboard!
The Fishing Tripper Team
```

#### Captain Rejection Email

**Trigger:** Admin rejects boat listing  
**Sender:** admin@fishingTripper.com  
**Subject:** Boat Listing Requires Updates

```
Hi Captain {{captainName}},

Thank you for submitting your boat listing. Unfortunately, we need some additional information before we can approve it.

Reason: {{rejectionReason}}

Please update your listing and resubmit:
[Update Listing]

Questions? Contact support@fishingtripper.com

Fishing Tripper Team
```

#### New Booking Notification

**Trigger:** Customer books a trip  
**Sender:** bookings@fishingtripper.com  
**Subject:** New Booking - {{tripName}} on {{tripDate}}

```
Hi Captain {{captainName}},

You have a new booking! 🎣

Booking Details:
- Customer: {{customerName}} ({{customerEmail}}, {{customerPhone}})
- Trip: {{tripName}}
- Date: {{tripDate}}
- Type: {{bookingType}}
- Guests: {{groupSize}}
- Amount: ${{totalAmount}}

Booking ID: {{bookingId}}

[View Booking] [Contact Customer]

See you on the water!
Fishing Tripper Team
```

#### Trip Completed Summary

**Trigger:** Trip marked as completed  
**Sender:** trips@fishingtripper.com  
**Subject:** Trip Completed - Payment Processing

```
Hi Captain {{captainName}},

Your trip has been marked as complete!

Trip Summary:
- Trip: {{tripName}}
- Date: {{tripDate}}
- Customers: {{groupSize}} guests
- Total Revenue: ${{totalAmount}}
- Platform Fee: ${{platformFee}}
- Your Payout: ${{captainPayout}}

Payout Status: Processing
Expected in your account: {{payoutDate}}

[View Trip Details]

Thanks for being an amazing captain!
Fishing Tripper Team
```

#### Payout Initiated Email

**Trigger:** Payout transfer started  
**Sender:** payments@fishingtripper.com  
**Subject:** Payout Initiated - ${{payoutAmount}}

```
Hi Captain {{captainName}},

Good news! Your payout is on its way.

Payout Details:
- Amount: ${{payoutAmount}}
- Booking ID: {{bookingId}}
- Trip: {{tripName}}
- Transfer ID: {{transferId}}
- Expected Arrival: {{arrivalDate}}

Bank Account: ****{{last4}}

[View Transaction History]

Fishing Tripper Team
```

#### Payout Completed Email

**Trigger:** Funds deposited to captain's account  
**Sender:** payments@fishingtripper.com  
**Subject:** Payout Complete - ${{payoutAmount}}

```
Hi Captain {{captainName}},

Your payout has been successfully deposited!

Payout Details:
- Amount: ${{payoutAmount}}
- Transfer Date: {{completedDate}}
- Bank Account: ****{{last4}}

[Download Statement]

Keep up the great work!
Fishing Tripper Team
```

---

## 5. Admin / System Workflow

### 5.1 User and Captain Management

**User Management:**
- View all users: `/dashboard/user-management`
- Endpoint: `GET /api/v1/users?limit=10&page=1&role=USER`
- Filter by: email, role
- Actions:
  - View user details: `GET /api/v1/users/{userId}`
  - Delete user: `DELETE /api/v1/users/{userId}`
  - View user bookings

**Captain Management:**
- View all captains: `/dashboard/captain-management`
- Endpoint: `GET /api/v1/users?role=CAPTAIN`
- View pending approvals
- Actions:
  - Approve boat: `PATCH /api/v1/boat/status/{boatId}` → `{ status: "APPROVE" }`
  - Reject boat: `PATCH /api/v1/boat/status/{boatId}` → `{ status: "REJECT" }`
  - View captain details: `/dashboard/captain-management/{captainId}`
  - Delete captain: `DELETE /api/v1/users/{captainId}`

### 5.2 Booking Oversight

**All Bookings View:**
- Dashboard: `/dashboard/booking-managment`
- Endpoint: `GET /api/v1/booking?limit=10&page=1`
- Filter options: `status`, `date`, `city`, `searchTerm`
- Sort options: `sortBy`, `sortOrder`

**Booking Details:**
- View: `/dashboard/booking-managment/{bookingId}`
- Displays: Customer info, captain info, boat details, payment status, timestamps
- Admin capabilities:
  - Send email to customer/captain
  - View full payment details
  - Monitor booking status

**Trips Management:**
- View: `/dashboard/trips-managment`
- Shows all trips across all boats
- Filter and monitor trip schedules

### 5.3 Payment Monitoring, Refunds, and Disputes

**Payment Monitoring:**
- View payment status on all bookings
- Payment statuses:
  - **PAID:** Customer paid successfully
  - **UNPAID:** Payment pending
  - **PARTIAL:** Partial payment received
  - **REFUNDED:** Full/partial refund issued

**Manual Refund Process:**
- Admin accesses Stripe dashboard (external)
- Issues refund for specific booking
- Updates booking status in system (manual or via webhook)

**Dispute Resolution:**
1. Customer/Captain contacts support
2. Admin reviews booking details
3. Admin decision:
   - Issue full refund
   - Issue partial refund
   - No refund (per policy)
4. Email sent to both parties with resolution

### 5.4 Manual Overrides and Compliance Controls

**Manual Actions Available:**
- Cancel any booking (with/without refund)
- Approve/reject captain applications
- Delete users or captains
- Enable/disable captain charge capability
- Update booking statuses manually

**Compliance Monitoring:**
- Captain license validity verification
- Boat listing policy compliance
- Cancellation policy enforcement
- Payment dispute tracking

### 5.5 Email Examples (Admin)

#### Refund Confirmation (Admin-Initiated)

**Trigger:** Admin processes manual refund  
**Sender:** support@fishingtripper.com  
**Subject:** Refund Issued - Booking #{{bookingId}}

```
Hi {{userName}},

We've processed a refund for your booking as requested.

Refund Details:
- Booking ID: {{bookingId}}
- Refund Amount: ${{refundAmount}}
- Reason: {{adminReason}}
- Processed By: Support Team
- Processing Time: 5-10 business days

The refund will be credited to your original payment method.

If you have any questions, please reply to this email.

Best regards,
Fishing Tripper Support Team
```

#### Dispute Resolution Notice

**Trigger:** Admin resolves a dispute  
**Sender:** support@fishingtripper.com  
**Subject:** Dispute Resolution - Booking #{{bookingId}}

```
Hi {{userName}},

We have reviewed your dispute regarding booking #{{bookingId}}.

Resolution:
{{resolutionDetails}}

Action Taken:
{{actionTaken}}

If a refund was issued, it will appear in 5-10 business days.

We appreciate your patience. If you need further assistance, please contact us.

Best regards,
Fishing Tripper Support Team
```

#### System Alert - Failed Payment

**Trigger:** Payment webhook fails or critical payment error  
**Sender:** alerts@fishingtripper.com (internal)  
**Subject:** [ALERT] Payment Failed - Booking #{{bookingId}}

```
Admin Alert:

A payment has failed and requires attention.

Booking ID: {{bookingId}}
Customer: {{customerEmail}}
Captain: {{captainEmail}}
Amount: ${{amount}}
Error: {{errorMessage}}
Timestamp: {{timestamp}}

Action Required:
- Review booking in admin dashboard
- Contact customer to update payment method
- Monitor for retry attempts

[View Booking in Dashboard]

System Alerts - Fishing Tripper
```

---

## 6. Payment Workflow (Dedicated Section)

### 6.1 Supported Payment Methods

**Primary Payment Method:** Credit/Debit Cards (via Stripe)
- Supported cards: Visa, Mastercard, American Express, Discover
- Processing: Stripe Payment Intents API
- Security: PCI DSS compliant via Stripe Elements

**Payment Collection Method:**
- Stripe Elements: Secure card input component
- Payment Method tokenization (no card details stored on platform)
- Billing address validation required

**Future Payment Options (Configurable):**
- Apple Pay / Google Pay
- Bank transfers (ACH)
- Digital wallets

### 6.2 Payment Provider Interaction (Stripe)

**Stripe Integration Architecture:**

```
Frontend (Stripe Elements)
    ↓ User enters card details
Stripe tokenizes card → Creates Payment Method ID
    ↓
Frontend sends paymentMethodId to Backend
    ↓
Backend → Stripe API: Create Payment Intent
    ↓
Stripe charges customer card
    ↓
Webhook: payment_intent.succeeded
    ↓
Backend updates booking: paymentStatus = PAID
    ↓
Confirmation emails sent
```

**Stripe Connect for Captain Payouts:**
- Captains create Stripe Connect accounts
- Platform charges customer, automatically splits payment
- Platform fee deducted, remainder transferred to captain
- Payout timeline: Stripe default (2-7 business days)

**API Endpoints Used:**
- `POST /api/v1/booking` - Creates booking with `paymentMethodId`
- Backend calls: `stripe.paymentIntents.create()`
- Backend calls: `stripe.transfers.create()` for payouts

### 6.3 Payment States

| State | Description | Trigger | Next State(s) |
|-------|-------------|---------|---------------|
| **INITIATED** | User started checkout | User clicks "Book Now" | AUTHORIZED, FAILED |
| **AUTHORIZED** | Stripe Payment Method created | Card tokenized | CAPTURED, FAILED |
| **CAPTURED** | Payment successfully charged | Stripe confirms charge | PAID |
| **PAID** | Booking confirmed, payment complete | Webhook received | COMPLETED (trip) |
| **FAILED** | Payment declined/error | Card declined, insufficient funds | RETRY, CANCELLED |
| **REFUNDED** | Full/partial refund issued | Cancellation/admin action | CLOSED |
| **PARTIAL** | Partial payment received | Deposit paid, balance due | PAID (on final payment) |

**State Transition Diagram:**

```
INITIATED → AUTHORIZED → CAPTURED → PAID → COMPLETED
    ↓           ↓            ↓
  FAILED    FAILED      FAILED
    ↓           ↓            ↓
CANCELLED   RETRY      REFUNDED
```

### 6.4 Webhook Handling and Reconciliation

**Stripe Webhooks (Expected Implementation):**

| Webhook Event | System Action |
|---------------|---------------|
| `payment_intent.succeeded` | Update booking → `paymentStatus: PAID`, send confirmation |
| `payment_intent.payment_failed` | Update booking → `paymentStatus: FAILED`, notify customer |
| `charge.refunded` | Update booking → `paymentStatus: REFUNDED`, notify customer |
| `payout.paid` | Update captain payout → `status: PAID`, notify captain |
| `payout.failed` | Alert admin, notify captain of payout issue |
| `charge.dispute.created` | Alert admin, initiate dispute workflow |

**Webhook Security:**
- Verify Stripe signature in request header
- Validate `stripe-signature` against webhook secret
- Idempotency checks to prevent duplicate processing
- Event logging for audit trail

**Reconciliation Process:**
1. Daily automated reconciliation job
2. Compare backend booking records vs. Stripe dashboard
3. Identify discrepancies (missing payments, failed webhooks)
4. Generate admin alerts for manual review
5. Automatic retry of failed webhook events

### 6.5 Edge Cases

#### Timeout Scenarios

**Problem:** User completes payment, but confirmation page fails to load

**Solution:**
- Payment already captured by Stripe (transaction complete)
- User can view booking in `/dashboard/your-trips`
- Email confirmation sent as fallback notification
- Admin can verify in booking management system

#### Duplicate Payments

**Problem:** User clicks "Submit Payment" multiple times

**Prevention:**
- Frontend: Button disabled after first click
- Backend: Idempotency check (`userId + tripId + tripDate`)
- Stripe: Payment Intents prevent duplicate charges

**Resolution:**
- If duplicate detected: Automatic refund of second charge
- Email customer explaining accidental duplicate charge

#### Chargebacks

**Process:**
1. Customer disputes charge with their bank
2. Stripe webhook: `charge.dispute.created`
3. Admin reviews booking evidence
4. Admin uploads proof via Stripe dashboard:
   - Booking confirmation email
   - Captain confirmation
   - Trip completion evidence
5. Outcome determined by card issuer:
   - **Won:** Funds retained by platform
   - **Lost:** Funds returned to customer, booking cancelled

**Prevention Strategies:**
- Clear cancellation policy displayed at booking
- Email confirmations with detailed trip information
- Captain confirmation emails as proof of service

---

## 7. Authorization & Security Flow

### 7.1 Authentication Method

**Primary Method:** JWT (JSON Web Tokens)

**Token Generation & Lifecycle:**

1. **User Login:**
   - Endpoint: `POST /api/v1/auth/login`
   - Request: `{ email, password }`
   - Backend validates credentials

2. **JWT Creation:**
   ```json
   {
     "id": "user123",
     "name": "John Doe",
     "email": "john@example.com",
     "role": "USER",
     "iat": 1709640000,
     "exp": 1709726400
   }
   ```

3. **Token Distribution:**
   - Response: `{ accessToken: "eyJhbGc..." }`
   - Frontend stores in:
     - Redux state: `auth.token`
     - Browser cookie: `token`
     - Cookie: `currentUserRole`

4. **Token Usage:**
   - All API requests include: `Authorization: Bearer <token>`
   - Backend middleware validates token on protected routes

**Token Expiry Handling:**
- Expiration time: Set by backend (typically 24 hours)
- On expiry:
  - API returns 401 Unauthorized
  - Frontend redirects to login
  - Session data cleared

**Firebase Authentication (Secondary):**
- Used for Google OAuth flow
- Firebase ID token exchanged for platform JWT
- Backend validates Firebase token before issuing JWT

### 7.2 Authorization Checks

#### Frontend Routing Protection

**Current Implementation:**
- UI-level role restrictions
- Sidebar items filtered dynamically by user role
- Protected routes check user role from Redux state

**Available Middleware (Commented Out):**
```typescript
// Role-based route access configuration
const roleAccess = {
  SUPERADMIN: ["/dashboard", "/user-management", ...],
  ADMIN: ["/dashboard", "/user-management", ...],
  USER: ["/edit-user-details", "/your-trips", ...],
  CAPTAIN: ["/boat-trip", "/trips-calender", ...]
}
```

#### Backend Middleware Authorization

**Expected Implementation:**
- JWT validation middleware on all protected endpoints
- Role extraction from decoded token
- Endpoint-level permission checks
- Resource ownership validation

**Example Authorization Logic:**
```javascript
// Verify user owns the resource
if (booking.userId !== decodedToken.id && role !== 'ADMIN') {
  return res.status(403).json({ error: 'Forbidden' });
}
```

#### Payment Endpoints Security

**Security Measures:**
- Payment creation: Requires authenticated user
- Captain payouts: Requires `chargeEnabled: true` flag
- Refund endpoints: Restricted to ADMIN role only
- Stripe webhooks: Signature verification required

### 7.3 Webhook Verification and Idempotency

**Stripe Webhook Verification:**

```javascript
// Backend webhook handler
const sig = request.headers['stripe-signature'];
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const event = stripe.webhooks.constructEvent(
  request.body,
  sig,
  webhookSecret
);

if (!event) {
  return res.status(400).send('Invalid signature');
}

// Process verified event
handleStripeEvent(event);
```

**Idempotency Implementation:**

```javascript
// Check if event already processed
const existingEvent = await db.query(
  'SELECT * FROM processed_events WHERE event_id = ?',
  [event.id]
);

if (existingEvent) {
  return res.status(200).send('Event already processed');
}

// Process new event
await processEvent(event);

// Store event ID
await db.query(
  'INSERT INTO processed_events (event_id, processed_at) VALUES (?, ?)',
  [event.id, new Date()]
);
```

### 7.4 Error Handling for Unauthorized Actions

**Frontend Error Handling:**
- API error interceptor catches 401/403 responses
- Toast notification displayed: "Access denied" or "Session expired"
- 401 errors trigger redirect to login page
- 403 errors show "Access Denied" message

**Backend Error Responses:**
```json
{
  "success": false,
  "statusCode": 403,
  "message": "You do not have permission to perform this action",
  "errorDetails": {
    "requiredRole": "ADMIN",
    "userRole": "USER"
  }
}
```

**Security Audit Logging:**
- All unauthorized access attempts logged
- Repeated failures trigger admin alerts
- IP tracking for suspicious activity
- Security event dashboard for admins

---

## 8. Workflow Diagrams (Text-Based)

### 8.1 User Booking + Payment Flow

```
[Customer Journey]

User searches for charter → Browse results → Select boat
    ↓
View trip details page
    ↓
Choose trip type: PRIVATE or GROUP
    ↓
Select date and number of guests
    ↓
Click "Book Now" button
    ↓
System stores to localStorage:
  - date
  - Guests (number)
  - bookingType (true=PRIVATE, false=GROUP)
    ↓
Redirect to: /payment?boatId=xxx&tripId=xxx
    ↓
────────────────────────────────────────
[Payment Page]

Load trip and boat details from API
    ↓
User enters personal information:
  - First name, last name
  - Email address
  - Phone number
    ↓
User enters billing information:
  - Country
  - ZIP/Postal code
    ↓
User enters card details (Stripe Elements)
  - Card number
  - Expiry date
  - CVC
    ↓
User clicks "Submit Payment"
    ↓
Frontend: Stripe Elements creates Payment Method
    ↓
Stripe returns: paymentMethodId (e.g., "pm_1234567890")
    ↓
Frontend sends to backend:
  {
    boatId, tripId, tripDate, amount,
    bookingType, groupSize,
    paymentMethodId,
    memberInfo: { firstName, lastName, email, phone }
  }
    ↓
────────────────────────────────────────
[Backend Processing]

Backend receives booking request
    ↓
Validate booking data (trip availability, capacity)
    ↓
Call Stripe API:
  stripe.paymentIntents.create({
    amount: calculatedAmount,
    payment_method: paymentMethodId,
    confirm: true
  })
    ↓
Stripe charges customer card
    ↓
[If Successful]
    ↓
Create booking record in database:
  - status: PENDING
  - paymentStatus: PAID
  - payFirst: amount paid
  - payDue: remaining balance
    ↓
Send response to frontend: { success: true }
    ↓
────────────────────────────────────────
[Post-Payment]

Stripe webhook: payment_intent.succeeded
    ↓
Backend confirms payment status
    ↓
Email sent to customer: Booking confirmation
Email sent to captain: New booking notification
    ↓
Frontend redirects user to:
  - /private-confirmation (PRIVATE booking)
  - /group-confirmation (GROUP booking)
    ↓
User views confirmation page
    ↓
User can access booking at: /dashboard/your-trips
    ↓
────────────────────────────────────────
[Trip Day]

Captain marks trip as COMPLETED
    ↓
Booking status updated: COMPLETED
    ↓
Payout initiated to captain
    ↓
Email sent: Trip completion summary
```

### 8.2 Captain Payout Flow

```
[Trip Completion]

Trip date arrives
    ↓
Captain manually marks trip as COMPLETED
  OR
System auto-completes after trip date + time
    ↓
Booking record updated:
  - status: COMPLETED
  - completedAt: timestamp
    ↓
────────────────────────────────────────
[Payout Calculation]

Backend calculates payout:
  Total booking amount: $500
  Platform fee (15%): $75
  Captain payout: $425
    ↓
Create payout record:
  - bookingId: reference to booking
  - captainId: receiving captain
  - amount: $425
  - status: PENDING
  - platformFee: $75
    ↓
────────────────────────────────────────
[Stripe Connect Transfer]

Backend calls Stripe API:
  stripe.transfers.create({
    amount: 42500, // cents
    currency: "usd",
    destination: captainStripeAccountId,
    description: "Payout for {{tripName}} - {{bookingId}}"
  })
    ↓
Stripe initiates transfer
    ↓
Payout record updated:
  - status: PROCESSING
  - transferId: Stripe transfer ID
    ↓
Email sent to captain: "Payout Initiated - $425"
    ↓
────────────────────────────────────────
[Payout Completion]

[2-7 business days later]

Stripe deposits funds to captain's bank account
    ↓
Stripe webhook: payout.paid
    ↓
Backend receives webhook event
    ↓
Payout record updated:
  - status: PAID
  - paidAt: timestamp
    ↓
Email sent to captain: "Payout Complete - $425"
    ↓
Captain views in dashboard: /dashboard
  - Total earnings updated
  - Transaction history updated
    ↓
────────────────────────────────────────
[Error Handling]

If payout fails:
    ↓
Stripe webhook: payout.failed
    ↓
Payout record updated:
  - status: FAILED
  - errorMessage: failure reason
    ↓
Alert sent to admin team
Email sent to captain: "Payout Failed - Action Required"
    ↓
Admin investigates and resolves issue
```

### 8.3 Refund & Dispute Flow

```
────────────────────────────────────────
[Scenario 1: User-Initiated Cancellation]

User navigates to: /dashboard/your-trips
    ↓
User clicks "Cancel" on booking
    ↓
Confirmation modal appears:
  "Are you sure you want to cancel this trip?"
    ↓
User confirms cancellation
    ↓
Frontend calls:
  PUT /api/v1/booking/cancel-booking/{bookingId}
    ↓
Backend validates cancellation eligibility:
  - Check cancellation policy
  - Check time until trip (e.g., >48 hours)
    ↓
[If Eligible for Refund]
    ↓
Backend calls Stripe API:
  stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount: refundAmount
  })
    ↓
Stripe processes refund
    ↓
Booking updated:
  - status: CANCELLED
  - paymentStatus: REFUNDED
  - cancelledAt: timestamp
  - cancelledBy: userId
    ↓
Email sent to user: "Refund Processed - $500"
Email sent to captain: "Booking Cancelled"
    ↓
[5-10 business days]
Refund appears in customer's account
    ↓
────────────────────────────────────────
[Scenario 2: Captain-Initiated Cancellation]

Captain navigates to: /dashboard/manage-bookings
    ↓
Captain clicks "Cancel" on booking
    ↓
Confirmation modal appears
    ↓
Captain confirms with reason
    ↓
Same flow as Scenario 1:
  - Full refund issued to customer
  - Booking marked as CANCELLED
  - Both parties notified via email
    ↓
────────────────────────────────────────
[Scenario 3: Dispute Resolution]

Customer OR Captain contacts:
  support@fishingtripper.com
    ↓
Support ticket created
    ↓
Admin views booking details:
  /dashboard/booking-managment/{bookingId}
    ↓
Admin reviews:
  - Booking details
  - Payment history
  - Communication history
  - Trip completion status
    ↓
Admin makes decision:
    ↓
[Option A: Full Refund]
    ↓
Admin processes via Stripe dashboard:
  Manual refund of full amount
    ↓
Backend updated (manually or via webhook)
    ↓
Email sent to both parties:
  "Dispute Resolved - Full Refund Issued"
    ↓
[Option B: Partial Refund]
    ↓
Admin processes via Stripe:
  Partial refund (e.g., 50% of booking)
    ↓
Email sent explaining resolution
    ↓
[Option C: No Refund]
    ↓
Admin determines no refund warranted
    ↓
Email sent explaining decision and policy
    ↓
────────────────────────────────────────
[Scenario 4: Bank Chargeback]

Customer disputes charge with bank
    ↓
Bank initiates chargeback process
    ↓
Stripe webhook: charge.dispute.created
    ↓
Backend receives webhook
    ↓
Admin alert email sent:
  "[URGENT] Chargeback - Booking #{{bookingId}}"
    ↓
Admin accesses Stripe dashboard
    ↓
Admin uploads evidence:
  - Booking confirmation email
  - Trip completion confirmation
  - Captain communication logs
  - Terms & conditions acceptance
  - Photos from trip (if available)
    ↓
Evidence submitted to card issuer
    ↓
[Weeks Later]
Card issuer makes decision:
    ↓
[If Dispute WON]
    ↓
Stripe webhook: charge.dispute.closed (won)
    ↓
Funds retained by platform
    ↓
Email to admin: "Dispute Won"
Booking remains as-is
    ↓
[If Dispute LOST]
    ↓
Stripe webhook: charge.dispute.closed (lost)
    ↓
Funds returned to customer
    ↓
Booking updated:
  - status: CANCELLED
  - paymentStatus: REFUNDED (chargeback)
  - notes: "Lost chargeback dispute"
    ↓
Email to admin: "Dispute Lost - Funds Returned"
    ↓
Admin reviews for pattern/fraud prevention
```

---

## 9. Email Communication Standards

### 9.1 Email Trigger → Related Workflow Event

| Workflow Event | Email Trigger Endpoint/Webhook | Recipient(s) | Email Type |
|----------------|-------------------------------|--------------|------------|
| User registration (email/password) | POST `/users/register` | User | Account verification |
| User registration (Google OAuth) | Firebase → POST `/users/register` | User | Welcome email |
| Booking created successfully | POST `/booking` | User + Captain | Booking confirmation + New booking alert |
| Payment authorized | Webhook: `payment_intent.succeeded` | User | Payment confirmation |
| Payment failed | Webhook: `payment_intent.payment_failed` | User | Payment failure alert |
| Booking cancelled by user | PUT `/booking/cancel-booking/{id}` | User + Captain | Cancellation confirmation |
| Booking cancelled by captain | PUT `/booking/cancel-booking/{id}` | User + Captain | Cancellation notification |
| Refund processed | Webhook: `charge.refunded` | User | Refund confirmation |
| Partial refund issued | Webhook: `charge.refunded` (partial) | User | Partial refund notice |
| Captain boat approved | PATCH `/boat/status/{id}` → APPROVE | Captain | Approval notification |
| Captain boat rejected | PATCH `/boat/status/{id}` → REJECT | Captain | Rejection notice |
| Trip marked completed | Booking status → COMPLETED | Captain | Trip completion summary |
| Payout initiated | Stripe transfer created | Captain | Payout processing notice |
| Payout completed | Webhook: `payout.paid` | Captain | Payout success confirmation |
| Payout failed | Webhook: `payout.failed` | Captain + Admin | Payout failure alert |
| Dispute created | Manual support ticket | Admin | Dispute alert |
| Dispute resolved | Admin manual action | User + Captain | Resolution notice |
| Chargeback initiated | Webhook: `charge.dispute.created` | Admin | Chargeback alert |
| Customer message to captain | POST `/booking/send-email-captain/{id}` | Captain | Custom message |
| Captain message to customer | POST `/booking/send-email-captain/{id}` | User | Custom message |
| System payment error | Critical error in payment flow | Admin | System alert |

### 9.2 Subject Lines and Sender Identity

**Sender Email Addresses:**

| Sender Address | Purpose | Example Use Cases |
|----------------|---------|-------------------|
| `noreply@fishingtripper.com` | System notifications | Password resets, system updates |
| `bookings@fishingtripper.com` | Booking-related | Confirmations, cancellations |
| `payments@fishingtripper.com` | Payment notifications | Payment success, refunds, payouts |
| `support@fishingtripper.com` | Customer support | Dispute resolutions, help responses |
| `admin@fishingTripper.com` | Admin actions | Approvals, rejections |
| `alerts@fishingtripper.com` | Internal system alerts | Failed payments, errors |

**Subject Line Best Practices:**

✅ **DO:**
- Keep concise (50-60 characters max)
- Include key identifiers (Booking ID, amount, date)
- Use action-oriented language
- Front-load important information
- Use emojis sparingly for positive events only

❌ **DON'T:**
- Use vague subjects ("Your booking")
- Overuse punctuation or caps
- Include too many emojis
- Use misleading subject lines

**Subject Line Examples:**

| Good ✅ | Bad ❌ |
|---------|-------|
| "Booking Confirmed - Reef Fishing on Mar 15" | "Your booking" |
| "Payment Received - $500" | "PAYMENT!!!" |
| "Action Required: Update Payment Method" | "Problem with your account" |
| "Payout Complete - $425" | "💰💰💰 Money is here!" |

### 9.3 Sample Email Body (Transactional, Professional)

**Email Template Structure:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .email-header {
      background: #0f5d9d;
      color: white;
      padding: 30px 20px;
      text-align: center;
    }
    .email-header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .email-body {
      padding: 30px 20px;
    }
    .greeting {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .main-message {
      font-size: 15px;
      color: #555;
      margin-bottom: 25px;
    }
    .details-box {
      background: #f9f9f9;
      border-left: 4px solid #FF9500;
      padding: 20px;
      margin: 20px 0;
    }
    .details-box h3 {
      margin-top: 0;
      color: #333;
      font-size: 16px;
    }
    .details-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .details-list li {
      padding: 8px 0;
      border-bottom: 1px solid #eee;
      font-size: 14px;
    }
    .details-list li:last-child {
      border-bottom: none;
    }
    .details-list strong {
      display: inline-block;
      width: 140px;
      color: #666;
    }
    .cta-button {
      display: inline-block;
      padding: 14px 28px;
      background: #FF9500;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      font-weight: 600;
      margin: 20px 0;
      transition: background 0.3s;
    }
    .cta-button:hover {
      background: #e68600;
    }
    .email-footer {
      background: #f4f4f4;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
    .email-footer p {
      margin: 5px 0;
    }
    .divider {
      height: 1px;
      background: #eee;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="email-header">
      <h1>Fishing Tripper</h1>
    </div>
    
    <!-- Body -->
    <div class="email-body">
      <p class="greeting">Hi {{firstName}},</p>
      
      <p class="main-message">
        {{mainMessage}}
      </p>
      
      <!-- Details Section -->
      <div class="details-box">
        <h3>{{detailsTitle}}</h3>
        <ul class="details-list">
          {{#each detailItems}}
          <li><strong>{{this.label}}:</strong> {{this.value}}</li>
          {{/each}}
        </ul>
      </div>
      
      <!-- Call to Action -->
      {{#if ctaButton}}
      <center>
        <a href="{{ctaUrl}}" class="cta-button">{{ctaText}}</a>
      </center>
      {{/if}}
      
      <div class="divider"></div>
      
      <p>{{closingMessage}}</p>
      
      <p style="margin-top: 20px;">
        <strong>{{signatureName}}</strong><br>
        The Fishing Tripper Team
      </p>
    </div>
    
    <!-- Footer -->
    <div class="email-footer">
      <p>© 2026 Fishing Tripper. All rights reserved.</p>
      <p>
        Questions? Reply to this email or contact 
        <a href="mailto:support@fishingtripper.com">support@fishingtripper.com</a>
      </p>
      <p style="margin-top: 10px;">
        <a href="{{unsubscribeUrl}}" style="color: #999;">Unsubscribe</a> | 
        <a href="{{privacyUrl}}" style="color: #999;">Privacy Policy</a>
      </p>
    </div>
  </div>
</body>
</html>
```

**Plain Text Alternative (Required for Email Deliverability):**

```
FISHING TRIPPER

Hi {{firstName}},

{{mainMessage}}

{{detailsTitle}}:
{{#each detailItems}}
- {{this.label}}: {{this.value}}
{{/each}}

{{#if ctaButton}}
{{ctaText}}: {{ctaUrl}}
{{/if}}

{{closingMessage}}

{{signatureName}}
The Fishing Tripper Team

---
© 2026 Fishing Tripper. All rights reserved.
Questions? Reply to this email or contact support@fishingtripper.com
```

### 9.4 Personalization Variables ({{placeholders}})

**User/Captain Information:**
```
{{firstName}}         - User's first name
{{lastName}}          - User's last name
{{userName}}          - Full name (firstName + lastName)
{{email}}             - Email address
{{phoneNumber}}       - Phone number
{{captainName}}       - Captain's full name
{{customerName}}      - Customer's full name
{{captainEmail}}      - Captain's email
{{customerEmail}}     - Customer's email
{{customerPhone}}     - Customer's phone
```

**Booking Information:**
```
{{bookingId}}         - Unique booking identifier
{{tripName}}          - Name of the trip/charter
{{tripDate}}          - Formatted trip date (e.g., "March 15, 2026")
{{tripType}}          - PRIVATE or GROUP/SHARED
{{departureTime}}     - Departure time (e.g., "06:00 AM")
{{duration}}          - Trip duration (e.g., "4 hours")
{{groupSize}}         - Number of guests/participants
{{bookingType}}       - Display text (e.g., "Private Charter")
{{status}}            - Booking status (PENDING, CONFIRMED, etc.)
```

**Boat/Trip Details:**
```
{{boatType}}          - Type of boat (e.g., "Sport Fishing Boat")
{{boatName}}          - Name of the boat
{{boatCapacity}}      - Maximum guest capacity
{{city}}              - Trip location city
{{meetingPoint}}      - Meeting point address
{{targetSpecies}}     - Fish species targeted
```

**Payment Information:**
```
{{amount}}            - Total payment amount
{{payFirst}}          - Initial payment/deposit
{{payDue}}            - Remaining balance due
{{totalAmount}}       - Total booking cost
{{refundAmount}}      - Amount being refunded
{{transactionId}}     - Payment transaction ID
{{paymentMethod}}     - Payment method description
{{last4}}             - Last 4 digits of card
{{currency}}          - Currency code (e.g., "USD")
```

**Captain Payout Information:**
```
{{captainPayout}}     - Captain's earnings after fees
{{platformFee}}       - Platform commission amount
{{payoutDate}}        - Expected payout date
{{arrivalDate}}       - Bank deposit arrival date
{{transferId}}        - Stripe transfer ID
{{completedDate}}     - Date payout completed
```

**Administrative:**
```
{{approvalStatus}}    - APPROVE or REJECT
{{rejectionReason}}   - Admin reason for rejection
{{errorMessage}}      - System error description
{{failureReason}}     - Payment failure reason
{{adminReason}}       - Admin action reason
{{resolutionDetails}} - Dispute resolution explanation
{{actionTaken}}       - Admin action description
```

**Dynamic Content Blocks:**

```handlebars
<!-- Booking Details Block -->
{{#bookingDetails}}
<ul class="details-list">
  <li><strong>Trip:</strong> {{tripName}}</li>
  <li><strong>Date:</strong> {{tripDate}}</li>
  <li><strong>Type:</strong> {{bookingType}} ({{groupSize}} guests)</li>
  <li><strong>Captain:</strong> {{captainName}}</li>
  <li><strong>Departure:</strong> {{departureTime}}</li>
  <li><strong>Duration:</strong> {{duration}}</li>
  <li><strong>Location:</strong> {{city}}</li>
</ul>
{{/bookingDetails}}

<!-- Payment Details Block -->
{{#paymentDetails}}
<ul class="details-list">
  <li><strong>Amount Paid:</strong> ${{payFirst}}</li>
  {{#if payDue}}
  <li><strong>Amount Due:</strong> ${{payDue}}</li>
  {{/if}}
  <li><strong>Total:</strong> ${{totalAmount}}</li>
  <li><strong>Payment Method:</strong> {{paymentMethod}}</li>
  {{#if transactionId}}
  <li><strong>Transaction ID:</strong> {{transactionId}}</li>
  {{/if}}
</ul>
{{/paymentDetails}}

<!-- Payout Details Block -->
{{#payoutDetails}}
<ul class="details-list">
  <li><strong>Gross Revenue:</strong> ${{totalAmount}}</li>
  <li><strong>Platform Fee (15%):</strong> -${{platformFee}}</li>
  <li><strong>Your Payout:</strong> ${{captainPayout}}</li>
  <li><strong>Transfer ID:</strong> {{transferId}}</li>
  <li><strong>Expected Arrival:</strong> {{arrivalDate}}</li>
</ul>
{{/payoutDetails}}

<!-- Conditional Content -->
{{#if payDue > 0}}
  <p class="notice">
    Remaining balance of ${{payDue}} is due on {{dueDate}}.
  </p>
{{/if}}

{{#unless approved}}
  <p class="warning">
    Your listing requires approval before it can go live.
  </p>
{{/unless}}
```

---

## 10. API Endpoint Reference

### 10.1 Base URL
```
Production: https://api.fishingtripper.com/api/v1
Development: Configure via NEXT_PUBLIC_API_URL environment variable
```

### 10.2 Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/login` | User login | No |
| POST | `/users/register` | User registration | No |
| GET | `/users/me` | Get current user details | Yes |
| POST | `/users/send-otp` | Send password reset OTP | No |

### 10.3 Booking Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/booking` | Create new booking | Yes | USER |
| GET | `/booking` | Get all bookings (filtered) | Yes | ADMIN |
| GET | `/booking/{id}` | Get single booking | Yes | Owner/Admin |
| GET | `/booking/booking/my-booking` | Get user's bookings | Yes | USER/CAPTAIN |
| PUT | `/booking/cancel-booking/{id}` | Cancel booking | Yes | Owner/Admin |
| GET | `/booking/calendar` | Get calendar data | Yes | CAPTAIN/ADMIN |
| POST | `/booking/send-email-captain/{id}` | Send email to captain/customer | Yes | All |

### 10.4 Boat & Trip Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/boat` | Create boat listing | Yes | CAPTAIN |
| GET | `/boat` | Get all boats (with filters) | No | Public |
| GET | `/boat/{id}` | Get single boat | No | Public |
| GET | `/boat/my-boat` | Get captain's boats | Yes | CAPTAIN |
| PUT | `/boat/{id}` | Update boat | Yes | CAPTAIN (owner) |
| DELETE | `/boat/{id}` | Delete boat | Yes | CAPTAIN (owner) |
| PATCH | `/boat/status/{id}` | Approve/reject boat | Yes | ADMIN |
| GET | `/boat/get-boat-for-every-city` | Get boats grouped by city | No | Public |
| DELETE | `/boat/trip/{id}` | Delete trip | Yes | CAPTAIN (owner) |
| GET | `/boat/trip/{tripId}` | Get single trip | No | Public |
| PATCH | `/boat/trip/{tripId}` | Update trip | Yes | CAPTAIN (owner) |

### 10.5 User Management Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/users` | Get all users (filtered) | Yes | ADMIN |
| GET | `/users/{id}` | Get single user | Yes | ADMIN |
| DELETE | `/users/{id}` | Delete user | Yes | ADMIN |
| PATCH | `/users/update-profile` | Update user profile | Yes | All |
| POST | `/users/support` | Contact support | Yes | All |
| POST | `/users/stripe/charge-enable` | Enable captain charging | Yes | CAPTAIN |
| PATCH | `/users/cancel-subscriptions` | Cancel membership | Yes | CAPTAIN |

### 10.6 Payment Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/users/active-stripe-account` | Check Stripe account status | Yes | CAPTAIN |
| PATCH | `/users/stripe/charge-enable` | Update charge capability | Yes | ADMIN |

---

## 11. System Behavior Summary

### 11.1 Key System Behaviors

**Booking Creation:**
- Validates trip availability and capacity
- Requires valid Stripe payment method
- Creates booking with status: PENDING
- Sends dual notifications (customer + captain)
- Stores payment method reference securely

**Payment Processing:**
- Frontend tokenizes card via Stripe Elements
- Backend charges via Payment Intents API
- Webhook confirms payment success asynchronously
- Updates booking paymentStatus to PAID
- Triggers automated email confirmations

**Cancellation Policy:**
- Users can cancel bookings before trip date
- Refund eligibility based on time until trip (backend logic)
- Captains can cancel with automatic full customer refund
- No-show policy: No refund issued

**Captain Approval Workflow:**
- Manual admin review required before activation
- Verification includes boat details and captain license
- Approval enables trip creation and booking acceptance
- Rejection allows resubmission with updates

**Automated Payout:**
- Triggered automatically on trip completion
- Calculation: Booking Amount - Platform Fee %
- Stripe Connect handles fund transfers
- Webhook confirmation updates payout status

### 11.2 Data Flow Patterns

**State Management:**
- Frontend: Redux Toolkit for global state
- API Cache: RTK Query with cache invalidation
- Local Storage: Temporary booking data during checkout
- Cookies: Authentication tokens and user role

**Error Boundaries:**
- Payment failures: Captured and user-notified with specific errors
- Booking conflicts: Prevention via backend validation
- Authentication errors: Automatic logout and redirect
- API failures: Graceful degradation with cached data

---

## 12. Glossary

| Term | Definition |
|------|------------|
| **PRIVATE Booking** | Entire boat reserved exclusively for one customer group |
| **GROUP/SHARED Booking** | Individual seats sold on a shared charter with other customers |
| **Trip** | A specific fishing charter offering (e.g., "Half-Day Reef Fishing") |
| **Boat** | Physical vessel listed by a captain on the platform |
| **Charter** | Synonym for fishing trip/booking |
| **Captain** | Boat owner/operator offering charter services |
| **Approval Status** | Admin review state for boat listings: PENDING, APPROVE, REJECT |
| **Booking Status** | Lifecycle state: PENDING, CONFIRMED, CANCELLED, COMPLETED |
| **Payment Status** | Payment state: UNPAID, PAID, PARTIAL, REFUNDED |
| **Payout** | Transfer of funds to captain after trip completion |
| **Platform Fee** | Percentage commission retained by Fishing Tripper (typically 15%) |
| **Stripe Connect** | Stripe product enabling marketplace payouts to captains |
| **Payment Intent** | Stripe object representing a customer payment |
| **Payment Method** | Tokenized representation of card or payment source |
| **Webhook** | Server-to-server event notification from Stripe to platform |
| **Idempotency** | Ensuring an operation executes only once, even if called multiple times |
| **JWT** | JSON Web Token - authentication method used by the platform |
| **RTK Query** | Redux Toolkit Query - data fetching and caching library |

---

## 13. Appendices

### Appendix A: Booking Status State Machine

```
┌─────────┐
│ PENDING │ (Initial state after booking creation)
└────┬────┘
     │
     ├──→ CONFIRMED (Captain accepts booking)
     │       │
     │       └──→ COMPLETED (Trip finished)
     │
     ├──→ CANCELLED (User or captain cancels)
     │
     └──→ FAILED (Payment processing error)
```

### Appendix B: Payment Status State Machine

```
┌─────────┐
│ UNPAID  │ (Initial state)
└────┬────┘
     │
     ├──→ PAID (Payment succeeds)
     │      │
     │      └──→ REFUNDED (Cancellation/dispute)
     │
     ├──→ PARTIAL (Deposit paid)
     │      │
     │      └──→ PAID (Balance paid)
     │
     └──→ FAILED (Payment declined)
            │
            └──→ RETRY or CANCELLED
```

### Appendix C: Edge Case Handling Matrix

| Edge Case | Prevention Strategy | Resolution Method |
|-----------|-------------------|-------------------|
| **Double Payment** | Frontend: Disable button after click<br>Backend: Idempotency checks | Automatic refund of duplicate charge |
| **Payment Timeout** | Webhook fallback mechanism | Email confirmation as backup notification |
| **Duplicate Booking** | Backend validates existing booking | Error response: "Already booked for this date" |
| **Expired Card** | Stripe real-time validation | Payment failure email with update prompt |
| **Chargeback** | Evidence collection system | Admin reviews, submits proof to Stripe |
| **Customer No-Show** | Captain confirms trip completion | No refund per cancellation policy |
| **Captain Cancellation** | Allow with automatic refund | Full refund + dual email notifications |
| **Webhook Failure** | Event logging system | Automated retry with exponential backoff |
| **Concurrent Bookings** | Database transaction locks | First request succeeds, subsequent error |
| **Partial Refund** | Admin manual processing | Stripe dashboard refund creation |
| **Network Error** | Request timeout handling | User prompt to retry, cached state preserved |
| **Invalid Trip Date** | Frontend date validation | Error: "Please select a valid future date" |

### Appendix D: Security Best Practices

**Authentication Security:**
- Passwords hashed with bcrypt (backend)
- JWT tokens with expiration (24 hour default)
- Secure cookie flags: HttpOnly, Secure, SameSite
- Token refresh mechanism (recommended implementation)

**Payment Security:**
- PCI DSS compliance via Stripe Elements
- No card data stored on platform servers
- Payment method tokenization only
- Stripe webhook signature verification
- HTTPS enforcement for all payment endpoints

**Data Protection:**
- Encrypted data transmission (TLS 1.3)
- Environment variables for sensitive keys
- Role-based access control (RBAC)
- SQL injection prevention via parameterized queries
- XSS protection via React's built-in escaping

**Audit & Monitoring:**
- All admin actions logged
- Failed authentication attempt tracking
- Payment transaction logging
- Webhook event history
- Suspicious activity alerts

---

## 14. Future Enhancements (Recommended)

1. **Email Service Integration**
   - Implement SendGrid or AWS SES
   - Create HTML email templates
   - Set up email delivery tracking
   - Implement unsubscribe functionality

2. **Webhook Infrastructure**
   - Build dedicated webhook endpoints
   - Implement event replay mechanism
   - Add webhook monitoring dashboard
   - Set up automatic retry logic

3. **Payment Features**
   - Split payment support (multiple cards)
   - Recurring subscriptions for memberships
   - Digital wallet support (Apple Pay, Google Pay)
   - Multi-currency support

4. **Captain Features**
   - Automated payout scheduling
   - Earnings analytics dashboard
   - Customer review system
   - Availability sync with external calendars

5. **Admin Tools**
   - Payment reconciliation dashboard
   - Automated fraud detection
   - Bulk operations for bookings
   - Advanced reporting and analytics

6. **Customer Features**
   - Saved payment methods
   - Booking history export
   - Loyalty/rewards program
   - Trip recommendations engine

7. **Testing & QA**
   - End-to-end payment flow tests
   - Webhook error simulation
   - Load testing for concurrent bookings
   - Security penetration testing

---

## Document Control

**Version:** 1.0  
**Last Updated:** February 5, 2026  
**Prepared By:** Senior Product Designer & Enterprise SaaS Architect  
**Document Owner:** Fishing Tripper Product Team  
**Review Cycle:** Quarterly  
**Next Review Date:** May 5, 2026

**Revision History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Feb 5, 2026 | System Architect | Initial comprehensive documentation |

**Distribution List:**
- Development Team
- Product Management
- QA/Testing Team
- Customer Support
- Executive Stakeholders
- DevOps/Infrastructure Team

---

**End of Document**
