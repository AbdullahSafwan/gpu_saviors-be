# Refund Functionality Guide

## Table of Contents
1. [Overview](#overview)
2. [Schema Design and Relationships](#schema-design-and-relationships)
3. [Business Rules](#business-rules)
4. [API Endpoint Documentation](#api-endpoint-documentation)
5. [Validation Rules and Error Handling](#validation-rules-and-error-handling)
6. [Analytics Integration](#analytics-integration)
7. [Warranty Claim Refund Workflow](#warranty-claim-refund-workflow)
8. [Common Use Cases and Examples](#common-use-cases-and-examples)
9. [Troubleshooting Guide](#troubleshooting-guide)

---

## Overview

The refund functionality provides item-level tracking for refunds issued against booking items in the GPU repair ERP system. This feature enables:

- **Item-Level Tracking**: Track exactly which booking items are being refunded and for how much
- **Warranty Support**: Link refunds to warranty claims when repairs cannot be resolved
- **Direct Refunds**: Issue refunds directly against bookings without warranty claims
- **Accurate Analytics**: Revenue reporting that properly accounts for refunds
- **Validation**: Prevent over-refunds with multi-layered validation

### Key Features

- ✅ Refund specific items within a booking
- ✅ Track partial refunds across multiple transactions
- ✅ Link refunds to warranty claims for audit trail
- ✅ Automatic payment status updates
- ✅ Client financial updates for corporate bookings
- ✅ Comprehensive analytics with refund metrics

### Two Refund Scenarios

**Scenario 1: Warranty Claim Refund**
- Customer claims warranty on repaired item
- Issue cannot be debugged/resolved
- Refund issued for services charged on original booking
- Refund linked to warranty claim for tracking

**Scenario 2: Direct Refund**
- Refund issued directly without warranty claim
- Can be for service quality, customer satisfaction, or other reasons
- No warranty claim linkage required

---

## Schema Design and Relationships

### Database Tables

#### `refund_item` (Junction Table)

Tracks the many-to-many relationship between refunds and booking items.

```prisma
model refund_item {
  id            Int          @unique @default(autoincrement())
  refundId      Int
  bookingItemId Int          @unique  // CONSTRAINT: Only 1 refund per booking_item
  amount        Int          // Amount refunded for this specific item
  remarks       String?      // Item-specific notes
  createdAt     DateTime     @default(now())
  modifiedAt    DateTime     @default(now()) @updatedAt

  refund        refund       @relation(fields: [refundId], references: [id])
  bookingItem   booking_item @relation(fields: [bookingItemId], references: [id])

  @@index([refundId])
}
```

**Why a Junction Table?**
- One refund can cover multiple items
- Maintains exact audit trail of refund amounts per item
- **Important:** Each booking_item can only have ONE refund entry - for additional refunds on the same item, users must UPDATE the existing refund

#### Updated `refund` Table

```prisma
model refund {
  id              Int             @unique @default(autoincrement())
  paymentId       Int
  warrantyClaimId Int?            // NEW: Optional link to warranty claim
  amount          Int
  refundDate      DateTime
  remarks         String?
  isActive        Boolean         @default(true)
  createdAt       DateTime        @default(now())
  modifiedAt      DateTime        @default(now()) @updatedAt
  createdBy       Int
  modifiedBy      Int

  booking_payment booking_payment @relation(fields: [paymentId], references: [id])
  warrantyClaim   warranty_claim? @relation(fields: [warrantyClaimId], references: [id])
  refundItems     refund_item[]   // NEW: Array of refund items
  createdByUser   user            @relation("RefundCreatedBy", fields: [createdBy], references: [id])
  modifiedByUser  user            @relation("RefundModifiedBy", fields: [modifiedBy], references: [id])
}
```

**New Fields:**
- `warrantyClaimId`: Links refund to warranty claim (optional)
- `refundItems`: Relation to refund_item records

#### Updated `booking_item` Table

```prisma
model booking_item {
  // ... existing fields
  refundedAmount Int?            @default(0)  // NEW: Cumulative refunds
  refundItems    refund_item[]   // NEW: Array of refund item records
}
```

**New Fields:**
- `refundedAmount`: Running total of all refunds for this item
- `refundItems`: Relation to refund_item records

### Entity Relationship Diagram

```
booking
  ├─> booking_payment (1:many)
  │     ├─> refund (1:many)
  │     │     ├─> refund_item (1:many)
  │     │     │     └─> booking_item (many:1)
  │     │     └─> warranty_claim (many:1, optional)
  │     └─> booking_item (1:many, optional)
  └─> booking_item (1:many)
        ├─> warranty (1:1)
        │     └─> warranty_claim_item (1:many)
        │           └─> warranty_claim (many:1)
        └─> refund_item (1:many)
```

### Data Flow Example

```
Booking #123
  ├─ Item #1: GPU Repair - $500 (paid)
  ├─ Item #2: MOBO Repair - $300 (paid)
  └─ Payment #456: $800 (PAID)

Refund Created:
  ├─ Refund #789
  │   ├─ Amount: $500
  │   ├─ Payment ID: 456
  │   └─ Refund Items:
  │       └─ Item #1: $500 (full refund)
  │
  └─ Updates:
      ├─ booking_item #1.refundedAmount = $500
      └─ booking.paymentStatus = PARTIAL_REFUND
```

---

## Business Rules

### Maximum Refundable Amount

**Per Item Calculation:**
```
maxRefundable = paidAmount
```

**Where:**
- `paidAmount`: Amount actually paid for the item

**Important:** Since only ONE refund is allowed per booking_item, there are no "previousRefunds" to subtract.

### Validation Rules

1. **Total Refund Limit**: Total refund amount cannot exceed `payment.paidAmount`
2. **Per-Item Limit**: Each item refund cannot exceed the item's `paidAmount`
3. **Booking Consistency**: All refund items must belong to the same booking as the payment
4. **Warranty Claim Validation**: If `warrantyClaimId` provided, verify it belongs to the booking
5. **Positive Amounts**: All refund amounts must be positive integers
6. **Active Items Only**: Cannot refund inactive/deleted booking items
7. **Payment Method Consistency**: Refunds should match original payment method where possible
8. **ONE Refund Per Item**: Each booking_item can only have ONE refund. To increase refund amount, UPDATE the existing refund instead of creating a new one.

### Payment Status Update Logic

When a refund is created or updated:

```
totalRefunded = sum of all active refunds for the booking
netPaid = totalPaidAmount - totalRefunded

If totalRefunded > 0:
  If netPaid <= 0:
    paymentStatus = REFUNDED (fully refunded)
  Else if netPaid < finalAmount:
    paymentStatus = PARTIAL_REFUND (partially refunded)
  Else:
    paymentStatus = PAID (refunded but still fully paid)
Else:
  Standard logic applies (PENDING/PARTIAL_PAID/PAID)
```

### Automatic Updates

When a refund is created or updated:

1. **Refund Items Created/Updated**: `refund_item` records created (on create) or updated (on update) for each item
2. **Item Refunded Amount Updated**: `booking_item.refundedAmount` set to `refund_item.amount` (direct assignment, no aggregation needed)
3. **Booking Payment Status Updated**: `booking.paymentStatus` recalculated
4. **Client Financials Updated**: If booking has `clientId`, client financial totals updated

**Note:** Since only one refund is allowed per item, `refundedAmount` is simply the value from the single `refund_item` record, not a sum.

---

## API Endpoint Documentation

### Base URL
```
/api/refund
```

### Authentication
All endpoints require JWT authentication via `verifyToken` middleware.

---

### 1. Create Refund with Items

**Endpoint:** `POST /refund`

**Description:** Creates a new refund with item-level breakdown.

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "paymentId": 456,
  "refundDate": "2024-01-15T10:30:00Z",
  "remarks": "Customer dissatisfied with repair quality",
  "warrantyClaimId": 789,  // Optional: only for warranty refunds
  "items": [
    {
      "bookingItemId": 123,
      "amount": 50000,  // Amount in cents/smallest currency unit
      "remarks": "GPU repair did not resolve issue"
    },
    {
      "bookingItemId": 124,
      "amount": 25000,
      "remarks": "Partial refund for MOBO service"
    }
  ]
}
```

**Request Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| paymentId | integer | Yes | ID of the payment to refund |
| refundDate | ISO8601 DateTime | Yes | Date the refund was issued |
| remarks | string | No | General notes about the refund |
| warrantyClaimId | integer | No | Link to warranty claim (warranty refunds only) |
| items | array | Yes | Array of items being refunded (min 1 item) |
| items[].bookingItemId | integer | Yes | ID of the booking item |
| items[].amount | integer | Yes | Refund amount for this item (positive integer) |
| items[].remarks | string | No | Item-specific refund notes |

**Response (200 OK):**
```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Successfully created refund",
  "data": {
    "id": 1001,
    "paymentId": 456,
    "warrantyClaimId": 789,
    "amount": 75000,
    "refundDate": "2024-01-15T10:30:00Z",
    "remarks": "Customer dissatisfied with repair quality",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "modifiedAt": "2024-01-15T10:30:00Z",
    "createdBy": 5,
    "modifiedBy": 5
  }
}
```

**Error Responses:**

**400 Bad Request - Validation Error:**
```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Refund amount 60000 exceeds max refundable 50000 for item 123"
}
```

**400 Bad Request - Exceeds Payment:**
```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Total refund amount (100000) exceeds payment amount (80000)"
}
```

**404 Not Found:**
```json
{
  "status": "error",
  "statusCode": 404,
  "message": "Payment 456 not found"
}
```

---

### 2. Get Refund Details

**Endpoint:** `GET /refund/:id`

**Description:** Retrieves detailed refund information including items, booking, and warranty claim.

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Refund ID |

**Response (200 OK):**
```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Successfully fetched refund",
  "data": {
    "id": 1001,
    "amount": 75000,
    "refundDate": "2024-01-15T10:30:00Z",
    "remarks": "Customer dissatisfied with repair quality",
    "paymentId": 456,
    "warrantyClaimId": 789,
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "booking": {
      "id": 100,
      "code": "BK-2024-001",
      "clientName": "John Doe",
      "phoneNumber": "+1234567890"
    },
    "items": [
      {
        "id": 501,
        "bookingItemId": 123,
        "amount": 50000,
        "remarks": "GPU repair did not resolve issue",
        "bookingItem": {
          "id": 123,
          "code": "ITM-2024-001",
          "name": "NVIDIA RTX 3080",
          "type": "GPU",
          "serialNumber": "SN123456",
          "payableAmount": 50000,
          "paidAmount": 50000
        }
      },
      {
        "id": 502,
        "bookingItemId": 124,
        "amount": 25000,
        "remarks": "Partial refund for MOBO service",
        "bookingItem": {
          "id": 124,
          "code": "ITM-2024-002",
          "name": "ASUS ROG Strix Z690",
          "type": "MOBO",
          "serialNumber": "SN789012",
          "payableAmount": 30000,
          "paidAmount": 30000
        }
      }
    ],
    "warrantyClaim": {
      "id": 789,
      "claimNumber": "WC-20240115-ABC123",
      "claimDate": "2024-01-10T08:00:00Z"
    },
    "createdBy": {
      "id": 5,
      "firstName": "Jane",
      "lastName": "Smith"
    }
  }
}
```

**Error Responses:**

**404 Not Found:**
```json
{
  "status": "error",
  "statusCode": 404,
  "message": "Refund not found with id: 1001"
}
```

---

### 3. Get Refundable Items for Booking

**Endpoint:** `GET /booking/:bookingId/refundable-items`

**Description:** Retrieves all items in a booking with their maximum refundable amounts. Used by frontend to show refund options.

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| bookingId | integer | Booking ID |

**Response (200 OK):**
```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Successfully fetched refundable items",
  "data": [
    {
      "bookingItemId": 123,
      "itemCode": "ITM-2024-001",
      "itemName": "NVIDIA RTX 3080",
      "type": "GPU",
      "payableAmount": 50000,
      "paidAmount": 50000,
      "discountAmount": 0,
      "hasExistingRefund": false,
      "existingRefundAmount": 0,
      "maxRefundable": 50000
    },
    {
      "bookingItemId": 124,
      "itemCode": "ITM-2024-002",
      "itemName": "ASUS ROG Strix Z690",
      "type": "MOBO",
      "payableAmount": 30000,
      "paidAmount": 30000,
      "discountAmount": 5000,
      "hasExistingRefund": true,
      "existingRefundAmount": 10000,
      "existingRefundId": 999,
      "maxRefundable": 30000
    }
  ]
}
```

**Response Fields:**

| Field | Description |
|-------|-------------|
| bookingItemId | ID of the booking item |
| itemCode | Item code (e.g., ITM-2024-001) |
| itemName | Item description |
| type | Item type (GPU, MOBO, LAPTOP) |
| payableAmount | Original charge before discounts |
| paidAmount | Amount actually paid |
| discountAmount | Discount applied |
| hasExistingRefund | Boolean indicating if item already has a refund |
| existingRefundAmount | Current refund amount (if exists) |
| existingRefundId | ID of existing refund (if exists) |
| maxRefundable | Maximum amount that can be refunded (= paidAmount) |

**Important:** If `hasExistingRefund` is `true`, you must UPDATE the existing refund using `existingRefundId` rather than creating a new one.

**Error Responses:**

**404 Not Found:**
```json
{
  "status": "error",
  "statusCode": 404,
  "message": "Booking not found with id: 100"
}
```

---

### 4. Update Refund

**Endpoint:** `PATCH /refund/:id`

**Description:** Updates refund details. Can update refund date, remarks, active status, and item breakdown.

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Refund ID |

**Request Body:**
```json
{
  "refundDate": "2024-01-16T10:30:00Z",
  "remarks": "Updated refund reason",
  "isActive": true,
  "items": [
    {
      "bookingItemId": 123,
      "amount": 45000,
      "remarks": "Adjusted refund amount"
    }
  ]
}
```

**Request Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| refundDate | ISO8601 DateTime | No | Updated refund date |
| remarks | string | No | Updated remarks |
| isActive | boolean | No | Soft delete flag |
| items | array | No | Updated item breakdown |

**Response (200 OK):**
```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Successfully updated refund",
  "data": {
    "id": 1001,
    "amount": 45000,
    "refundDate": "2024-01-16T10:30:00Z",
    "remarks": "Updated refund reason",
    "isActive": true,
    "modifiedAt": "2024-01-16T11:00:00Z"
  }
}
```

---

### 5. List Refunds

**Endpoint:** `GET /refund`

**Description:** Lists all refunds with optional filtering.

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| isActive | boolean | Filter by active status |
| startDate | ISO8601 Date | Filter refunds from this date |
| endDate | ISO8601 Date | Filter refunds until this date |
| bookingId | integer | Filter by booking ID |
| warrantyClaimId | integer | Filter by warranty claim ID |
| limit | integer | Number of records per page (default: 50) |
| offset | integer | Pagination offset (default: 0) |

**Example Request:**
```
GET /refund?isActive=true&startDate=2024-01-01&limit=20
```

**Response (200 OK):**
```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Successfully fetched refunds",
  "data": {
    "refunds": [
      {
        "id": 1001,
        "amount": 75000,
        "refundDate": "2024-01-15T10:30:00Z",
        "booking": {
          "code": "BK-2024-001",
          "clientName": "John Doe"
        },
        "itemCount": 2,
        "isWarrantyRelated": true
      }
    ],
    "total": 156,
    "limit": 20,
    "offset": 0
  }
}
```

---

## Validation Rules and Error Handling

### Validation Layers

**1. Input Validation (Middleware)**
- Type checking (integers, dates, strings)
- Required field validation
- Format validation (ISO8601 dates)
- Array length validation (items min: 1)

**2. Business Logic Validation (Service Layer)**
- Payment existence
- Item ownership (items belong to booking)
- Refund amount limits
- Warranty claim validation
- Active status checks

**3. Database Constraints**
- Foreign key constraints
- Unique constraints
- NOT NULL constraints

### Common Validation Errors

#### 1. Refund Exceeds Payment Amount

**Error:**
```
Total refund amount (100000) exceeds payment amount (80000)
```

**Cause:** Sum of all refund items exceeds the payment's `paidAmount`

**Solution:** Reduce refund amounts or split across multiple payments

---

#### 2. Refund Exceeds Item Maximum

**Error:**
```
Refund amount 60000 exceeds max refundable 50000 for item 123
```

**Cause:** Refund amount for item exceeds `paidAmount - previousRefunds`

**Solution:** Check item's refund history and adjust amount

---

#### 3. Item Not in Booking

**Error:**
```
Booking item 999 not found in booking 100
```

**Cause:** Trying to refund an item that doesn't belong to the payment's booking

**Solution:** Verify item IDs match the booking

---

#### 4. Invalid Warranty Claim

**Error:**
```
Warranty claim 789 does not belong to booking 100
```

**Cause:** `warrantyClaimId` provided but claim is for a different booking

**Solution:** Verify warranty claim is for the correct original booking

---

#### 5. Payment Not Found

**Error:**
```
Payment 456 not found
```

**Cause:** Invalid `paymentId` provided

**Solution:** Verify payment exists and is active

---

#### 6. Negative or Zero Amount

**Error:**
```
Refund amount must be positive for item 123
```

**Cause:** Item refund amount is ≤ 0

**Solution:** Provide positive refund amount

---

#### 7. Items Array Empty

**Error:**
```
At least one refund item is required
```

**Cause:** `items` array is empty or missing

**Solution:** Include at least one item in the refund

---

#### 8. Invalid Date Format

**Error:**
```
refundDate must be valid date
```

**Cause:** Date not in ISO8601 format

**Solution:** Use format: `YYYY-MM-DDTHH:mm:ss.sssZ`

---

#### 9. Item Already Has Refund

**Error:**
```
Booking item 123 already has a refund. Please update the existing refund instead of creating a new one.
```

**Cause:** Attempting to create a new refund for an item that already has a refund

**Solution:** Use `PATCH /refund/:id` to update the existing refund amount instead of creating a new one. Use `GET /booking/:bookingId/refundable-items` to check which items already have refunds.

---

### Error Response Format

All errors follow consistent format:

```json
{
  "status": "error",
  "statusCode": 400,  // 400, 404, 500, etc.
  "message": "Descriptive error message",
  "errors": [  // Optional: validation errors array
    {
      "field": "items[0].amount",
      "message": "amount must be a positive integer"
    }
  ]
}
```

---

## Analytics Integration

### Updated Revenue Metrics

Analytics now include refund data for accurate revenue reporting.

### New Metrics

**Revenue Metrics Response:**
```json
{
  "totalBookings": 1500,
  "totalRevenue": 5000000,
  "totalCollected": 4500000,
  "totalRefunded": 150000,      // NEW
  "netCollected": 4350000,      // NEW (totalCollected - totalRefunded)
  "totalOutstanding": 500000,
  "refundCount": 45,            // NEW
  "averageBookingValue": 3333,
  "collectionRate": 87.0,       // Updated to use netCollected
  "byPaymentStatus": {
    "PAID": { ... },
    "PARTIAL_REFUND": { ... },  // Includes refund data
    "REFUNDED": { ... }
  }
}
```

**Refund Analytics:**
```json
{
  "totalRefunds": 45,
  "totalRefundAmount": 150000,
  "bookingsWithRefunds": 38,
  "warrantyRelatedRefunds": 22,
  "avgRefundAmount": 3333,
  "itemsRefunded": 52,
  "refundRate": 2.5  // Percentage of bookings with refunds
}
```

### SQL View Updates

All analytics views now include refund calculations:

**`revenue_by_payment_status` View:**
```sql
SELECT
  b.paymentStatus,
  COUNT(*) as bookingCount,
  SUM(b.payableAmount) as totalRevenue,
  SUM(b.paidAmount) as totalCollected,
  SUM(COALESCE(r.totalRefunded, 0)) as totalRefunded,
  SUM(b.paidAmount - COALESCE(r.totalRefunded, 0)) as netCollected
FROM booking b
LEFT JOIN (
  SELECT bp.bookingId, SUM(ref.amount) as totalRefunded
  FROM booking_payment bp
  INNER JOIN refund ref ON ref.paymentId = bp.id
  WHERE ref.isActive = 1
  GROUP BY bp.bookingId
) r ON r.bookingId = b.id
WHERE b.status = 'COMPLETED'
GROUP BY b.paymentStatus;
```

**`customer_first_booking` View:**
- Added `totalRefunded` column
- Added `netPaid` column (totalPaid - totalRefunded)

**`daily_revenue_summary` View:**
- Added `refunded` column
- Added `netCollected` column

### Financial Metrics

Refunds are treated as revenue reductions:

```
netRevenue = totalCollected - totalRefunded
netProfit = netRevenue - totalExpenses
profitMargin = (netProfit / netRevenue) * 100
```

### Client Financials

For corporate clients, refunds automatically update client financial records:

```
clientTotalRevenue = SUM(booking.payableAmount) - SUM(refunds.amount)
clientTotalPaid = SUM(booking.paidAmount) - SUM(refunds.amount)
```

---

## Warranty Claim Refund Workflow

### When to Issue Warranty Claim Refunds

1. **Issue Cannot Be Debugged**: After warranty claim, problem persists and root cause cannot be identified
2. **Repair Not Possible**: Item cannot be repaired even after warranty service
3. **Customer Satisfaction**: Business decision to refund rather than continue troubleshooting

### Warranty Claim Refund Process

**Step 1: Warranty Claim Filed**
```
Customer reports issue within warranty period (15 days default)
  ↓
Warranty claim created with claimNumber (e.g., WC-20240115-ABC123)
  ↓
New claim booking created with $0 payment
```

**Step 2: Issue Cannot Be Resolved**
```
Technician attempts repair but issue persists
  ↓
Management decides to issue refund
  ↓
Staff retrieves original booking and item charges
```

**Step 3: Create Warranty Claim Refund**
```http
POST /refund
{
  "paymentId": <originalPaymentId>,
  "refundDate": "2024-01-15T10:30:00Z",
  "warrantyClaimId": 789,
  "remarks": "Warranty claim WC-20240115-ABC123: Issue could not be resolved",
  "items": [
    {
      "bookingItemId": 123,
      "amount": 50000,
      "remarks": "Full refund - GPU issue persists after warranty repair"
    }
  ]
}
```

**Step 4: Automatic Updates**
```
Refund created and linked to warranty claim
  ↓
booking_item.refundedAmount updated to 50000
  ↓
booking.paymentStatus updated to PARTIAL_REFUND or REFUNDED
  ↓
Client financials updated (if corporate booking)
```

### Identifying Warranty Refunds

Warranty-related refunds can be identified by:

1. **`warrantyClaimId` field**: Non-null for warranty refunds
2. **Refund remarks**: Contains warranty claim number
3. **Analytics**: `warrantyRelatedRefunds` metric

### Reporting

**Warranty Refund Report Query:**
```sql
SELECT
  r.id,
  r.amount,
  r.refundDate,
  wc.claimNumber,
  b.code as bookingCode,
  b.clientName
FROM refund r
INNER JOIN warranty_claim wc ON r.warrantyClaimId = wc.id
INNER JOIN booking_payment bp ON r.paymentId = bp.id
INNER JOIN booking b ON bp.bookingId = b.id
WHERE r.isActive = 1
ORDER BY r.refundDate DESC;
```

---

## Common Use Cases and Examples

### Use Case 1: Full Refund for Single Item

**Scenario:** Customer's GPU repair failed, issue refund for entire service cost.

**Data:**
- Booking: #100
- Item: GPU (ID: 123), Paid: $500
- Payment: #456, Amount: $800

**Request:**
```json
POST /refund
{
  "paymentId": 456,
  "refundDate": "2024-01-15T10:00:00Z",
  "remarks": "GPU repair unsuccessful, customer dissatisfied",
  "items": [
    {
      "bookingItemId": 123,
      "amount": 50000,
      "remarks": "Full refund for GPU repair"
    }
  ]
}
```

**Result:**
- Refund #1001 created for $500
- Item #123 `refundedAmount` = $500
- Booking payment status = `PARTIAL_REFUND` (other items not refunded)

---

### Use Case 2: Partial Refund for Multiple Items

**Scenario:** Customer partially dissatisfied with multiple repairs, issue partial refunds.

**Data:**
- Booking: #100
- Items:
  - GPU (ID: 123), Paid: $500
  - MOBO (ID: 124), Paid: $300
- Payment: #456, Amount: $800

**Request:**
```json
POST /refund
{
  "paymentId": 456,
  "refundDate": "2024-01-15T10:00:00Z",
  "remarks": "Partial refund for service quality issues",
  "items": [
    {
      "bookingItemId": 123,
      "amount": 25000,
      "remarks": "50% refund for GPU service"
    },
    {
      "bookingItemId": 124,
      "amount": 15000,
      "remarks": "50% refund for MOBO service"
    }
  ]
}
```

**Result:**
- Refund #1001 created for $400 total
- Item #123 `refundedAmount` = $250
- Item #124 `refundedAmount` = $150
- Booking payment status = `PARTIAL_REFUND`

---

### Use Case 3: Warranty Claim Refund

**Scenario:** Customer claimed warranty, issue persists, refund original service.

**Data:**
- Original Booking: #100
- Item: GPU (ID: 123), Paid: $500
- Warranty Claim: #789, Claim Number: WC-20240110-XYZ
- Payment: #456

**Step 1: Get Refundable Items**
```http
GET /booking/100/refundable-items
```

**Response:**
```json
[
  {
    "bookingItemId": 123,
    "itemName": "NVIDIA RTX 3080",
    "paidAmount": 50000,
    "previousRefunds": 0,
    "maxRefundable": 50000
  }
]
```

**Step 2: Create Warranty Refund**
```json
POST /refund
{
  "paymentId": 456,
  "refundDate": "2024-01-15T10:00:00Z",
  "warrantyClaimId": 789,
  "remarks": "Warranty claim WC-20240110-XYZ: Issue could not be resolved",
  "items": [
    {
      "bookingItemId": 123,
      "amount": 50000,
      "remarks": "Full refund - GPU still malfunctioning after warranty repair"
    }
  ]
}
```

**Result:**
- Refund #1001 created, linked to warranty claim #789
- Item #123 `refundedAmount` = $500
- Booking payment status = `REFUNDED` (full refund)
- Warranty claim #789 now has associated refund

---

### Use Case 4: Updating Existing Refund to Increase Amount

**Scenario:** Initial refund was issued, but customer requires additional refund. Since only one refund per item is allowed, update the existing refund.

**Data:**
- Item: GPU (ID: 123), Paid: $500
- Payment: #456
- Existing Refund: #1001, Amount: $100

**Step 1: Check Refundable Items**
```http
GET /booking/100/refundable-items
```

**Response:**
```json
[
  {
    "bookingItemId": 123,
    "itemName": "NVIDIA RTX 3080",
    "paidAmount": 50000,
    "hasExistingRefund": true,
    "existingRefundAmount": 10000,
    "existingRefundId": 1001,
    "maxRefundable": 50000
  }
]
```

**Step 2: Update Existing Refund**

Since item already has a refund (ID: 1001), we update it instead of creating a new one:

```json
PATCH /refund/1001
{
  "refundDate": "2024-01-15T10:00:00Z",
  "remarks": "Increased refund due to recurring issue",
  "items": [
    {
      "bookingItemId": 123,
      "amount": 30000,
      "remarks": "Increased to 60% refund"
    }
  ]
}
```

**Result:**
- Refund #1001 amount updated to $300
- `booking_item.refundedAmount` updated to $300
- Booking payment status recalculated

**Step 3: Verify Update**
```http
GET /refund/1001
```

**Response:**
```json
{
  "id": 1001,
  "amount": 30000,
  "refundDate": "2024-01-15T10:00:00Z",
  "remarks": "Increased refund due to recurring issue",
  "items": [
    {
      "bookingItemId": 123,
      "amount": 30000,
      "remarks": "Increased to 60% refund"
    }
  ]
}
```

**Important:** Attempting to create a NEW refund for item 123 will fail with error: "Booking item 123 already has a refund. Please update the existing refund instead."

---

### Use Case 5: Refund with Item-Specific Payments

**Scenario:** Booking has multiple payments, each linked to specific items.

**Data:**
- Booking: #100
- Items:
  - GPU (ID: 123), Payment #456 (CASH)
  - MOBO (ID: 124), Payment #457 (BANK_TRANSFER)

**Request:**
```json
POST /refund
{
  "paymentId": 456,
  "refundDate": "2024-01-15T10:00:00Z",
  "remarks": "Refund GPU only",
  "items": [
    {
      "bookingItemId": 123,
      "amount": 50000,
      "remarks": "GPU refund via original payment method"
    }
  ]
}
```

**Important:** Cannot refund MOBO (ID: 124) from Payment #456 because it was paid via Payment #457.

---

## Troubleshooting Guide

### Problem 1: Cannot Create Refund - "Exceeds Payment Amount"

**Symptoms:**
```
Error: Total refund amount (100000) exceeds payment amount (80000)
```

**Diagnosis Steps:**
1. Get payment details: `GET /booking-payment/:paymentId`
2. Check `paidAmount` field
3. Sum up existing refunds for this payment
4. Verify: `newRefund + existingRefunds <= paidAmount`

**Common Causes:**
- Trying to refund more than was paid
- Not accounting for existing refunds
- Wrong payment ID

**Solution:**
- Reduce refund amount
- Check if item was paid via different payment
- Split refund across multiple payments

---

### Problem 2: Cannot Create Refund - "Item Already Has Refund"

**Symptoms:**
```
Error: Booking item 123 already has a refund. Please update the existing refund instead of creating a new one.
```

**Diagnosis Steps:**
1. Get refundable items: `GET /booking/:bookingId/refundable-items`
2. Check `hasExistingRefund` field
3. Note `existingRefundId` if present

**Common Causes:**
- Item already has a refund record
- Attempting to create second refund for same item
- Not aware of one-refund-per-item constraint

**Solution:**
- Use `PATCH /refund/:existingRefundId` to update the existing refund amount
- Increase or decrease amount as needed via update endpoint
- Cannot create multiple refunds per item by design

---

### Problem 3: Cannot Create Refund - "Exceeds Item Paid Amount"

**Symptoms:**
```
Error: Refund amount 60000 exceeds item paid amount 50000 for item 123
```

**Diagnosis Steps:**
1. Get refundable items: `GET /booking/:bookingId/refundable-items`
2. Check `paidAmount` for the item
3. Verify refund amount doesn't exceed `paidAmount`

**Common Causes:**
- Requesting refund more than item's paid amount
- Confusing `payableAmount` (before discount) with `paidAmount` (after discount)
- Attempting to refund original price when discount was applied

**Solution:**
- Reduce refund to match `paidAmount` (not `payableAmount`)
- Check actual amount customer paid for the item
- Account for any discounts that were applied

---

### Problem 4: Payment Status Not Updating

**Symptoms:**
- Refund created successfully
- Booking `paymentStatus` still shows `PAID`

**Diagnosis Steps:**
1. Check refund `isActive` status
2. Verify booking payment amounts
3. Check if refund transaction completed

**Common Causes:**
- Refund marked as `isActive: false`
- Transaction failed midway
- Cache not refreshed

**Solution:**
- Verify refund record exists in database
- Check transaction logs
- Refresh booking data: `GET /booking/:id`

---

### Problem 5: Client Financials Not Updated

**Symptoms:**
- Refund created for corporate booking
- Client totals not reflecting refund

**Diagnosis Steps:**
1. Verify booking has `clientId`
2. Check if refund is active
3. Review client financial calculation

**Common Causes:**
- Booking not linked to client
- Client financials update failed
- Refund deactivated

**Solution:**
- Run `updateClientFinancials()` manually if needed
- Verify client relationship
- Check logs for update errors

---

### Problem 6: Warranty Claim Validation Fails

**Symptoms:**
```
Error: Warranty claim 789 does not belong to booking 100
```

**Diagnosis Steps:**
1. Get warranty claim: `GET /warranty-claim/:id`
2. Check `originalBookingId` field
3. Verify matches payment's booking

**Common Causes:**
- Wrong warranty claim ID
- Trying to refund claim booking instead of original
- Warranty claim for different customer

**Solution:**
- Use claim's `originalBookingId` to get correct booking
- Verify warranty claim belongs to this customer
- Remove `warrantyClaimId` if not warranty-related refund

---

### Problem 7: Analytics Not Showing Refunds

**Symptoms:**
- Refunds created but analytics show $0 refunded

**Diagnosis Steps:**
1. Check date range filters
2. Verify refunds are `isActive: true`
3. Check if SQL views updated

**Common Causes:**
- Date filters excluding refunds
- SQL views not migrated
- Refunds marked inactive

**Solution:**
- Adjust date range
- Run migration: `npx prisma migrate deploy`
- Verify refund `isActive` status

---

### Problem 8: Cannot Refund Deleted Item

**Symptoms:**
```
Error: Booking item 123 is inactive
```

**Diagnosis Steps:**
1. Check item `isActive` field
2. Verify item wasn't soft-deleted

**Common Causes:**
- Item marked as deleted
- Booking canceled

**Solution:**
- Cannot refund deleted items (by design)
- Reactivate item if mistakenly deleted
- Contact administrator for special cases

---

### Problem 9: Concurrent Refund Attempts

**Symptoms:**
- Multiple staff create refunds simultaneously
- Database constraint violations
- Unexpected refund totals

**Diagnosis Steps:**
1. Check refund creation timestamps
2. Review database transaction logs
3. Verify refund item records

**Common Causes:**
- Multiple users processing same refund
- Race condition in refund creation
- Network latency causing retries

**Solution:**
- Database transactions prevent over-refunding
- Retry failed requests
- Implement UI locking when refund in progress

---

## Best Practices

### For Developers

1. **Always Use Transactions**: Refund creation involves multiple table updates
2. **Validate Before Creating**: Use `GET /booking/:id/refundable-items` first
3. **Handle Errors Gracefully**: Provide clear error messages to users
4. **Log Refund Actions**: Audit trail is critical for financial operations
5. **Test Edge Cases**: Multiple refunds, partial amounts, concurrent requests

### For API Consumers

1. **Check Refundable Amounts**: Query before attempting refund using `GET /booking/:id/refundable-items`
2. **Check for Existing Refunds**: If `hasExistingRefund` is true, use UPDATE (PATCH) instead of CREATE (POST)
3. **Handle Validation Errors**: Display clear messages to staff, especially "item already has refund" errors
4. **Confirm Actions**: Refunds are financial transactions - add confirmation dialogs
5. **Track Warranty Claims**: Link warranty refunds for better reporting
6. **Use Descriptive Remarks**: Help future staff understand refund reason

### For System Administrators

1. **Regular Analytics Review**: Monitor refund rates and patterns
2. **Backup Before Migrations**: Always backup before schema changes
3. **Monitor Refund Patterns**: High refund rates may indicate quality issues
4. **Audit Refund Records**: Regular audits of refund justifications
5. **Train Staff**: Ensure staff understand validation rules

---

## Migration and Backward Compatibility

### Migrating Existing Refunds

Existing refunds (created before item-level tracking) can be migrated using the migration script:

```bash
npm run migrate:existing-refunds
```

**What it does:**
1. Finds refunds without `refund_items`
2. Distributes refund amount across booking items
3. Creates `refund_item` records
4. Updates `booking_item.refundedAmount`

**Distribution Logic:**
- If payment has linked items: proportional distribution
- Otherwise: even distribution across all booking items
- Adds remark: "Migrated from legacy refund"

### Backward Compatibility

- Existing refunds continue to work
- New refunds require `items` array
- Analytics work with both old and new refunds
- Migration is optional but recommended

---

## Appendix

### Payment Status Enum Values

```typescript
enum booking_payment_status {
  PENDING         // No payment made
  PARTIAL_PAID    // Some payment made, not fully paid
  PAID            // Fully paid, no refunds
  PARTIAL_REFUND  // Partially refunded
  REFUNDED        // Fully refunded
  NOT_APPLICABLE  // Payment not required (e.g., warranty claims)
}
```

### Item Type Enum Values

```typescript
enum booking_item_type {
  GPU      // Graphics card
  MOBO     // Motherboard
  LAPTOP   // Laptop
}
```

### Payment Method Enum Values

```typescript
enum payment_method {
  CASH           // Cash payment
  WALLET         // Digital wallet
  BANK_TRANSFER  // Bank transfer
}
```

### Useful SQL Queries

**Total Refunds by Date Range:**
```sql
SELECT DATE(refundDate) as date, SUM(amount) as total
FROM refund
WHERE isActive = 1
  AND refundDate BETWEEN '2024-01-01' AND '2024-01-31'
GROUP BY DATE(refundDate)
ORDER BY date;
```

**Top Refunded Items:**
```sql
SELECT
  bi.name,
  bi.type,
  COUNT(ri.id) as refundCount,
  SUM(ri.amount) as totalRefunded
FROM booking_item bi
INNER JOIN refund_item ri ON ri.bookingItemId = bi.id
INNER JOIN refund r ON ri.refundId = r.id
WHERE r.isActive = 1
GROUP BY bi.id
ORDER BY totalRefunded DESC
LIMIT 10;
```

**Warranty Refund Summary:**
```sql
SELECT
  COUNT(*) as warrantyRefunds,
  SUM(r.amount) as totalAmount,
  AVG(r.amount) as avgAmount
FROM refund r
WHERE r.warrantyClaimId IS NOT NULL
  AND r.isActive = 1;
```

---

## Support and Contact

For questions or issues with the refund functionality:

1. **Technical Issues**: Check troubleshooting guide above
2. **Bug Reports**: Create issue in project repository
3. **Feature Requests**: Submit via project management system
4. **Emergency**: Contact system administrator

---

**Document Version:** 1.0
**Last Updated:** 2024-01-29
**Related Documentation:**
- [API Documentation](./api-docs)
- [Database Schema Guide](./schema-guide.md)
- [Analytics Guide](./analytics-guide.md)
