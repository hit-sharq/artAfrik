<!-- # Complete Shipping System Plan for ArtAfrik

## Overview
Build a comprehensive shipping management system for the ArtAfrik artisan marketplace, supporting international shipping to 35+ countries with multiple courier options, real-time tracking, and automated notifications.

## Current State Analysis

### ✅ Already Implemented
1. **Prisma Schema** - Order, OrderItem, Shipment models with tracking fields
2. **Shipping Config** - Zone definitions, country mappings, rate tables
3. **Shipping Calculator** - Calculation functions with weight, fuel surcharge, insurance
4. **React Hooks** - useShipping, useCartShipping for frontend
5. **ShippingCalculator Component** - UI for shipping options
6. **Shipping API Route** - Basic calculation endpoint
7. **Research Data** - Courier rates and contact information

### 🔲 Missing Components
1. Tracking API & Webhooks
2. Courier Integrations (DHL, FedEx, UPS)
3. Shipment Management APIs
4. Admin Dashboard Components
5. Customer Order Tracking Page
6. Email Notification System
7. Address Validation
8. Packaging Calculator
9. Shipping Label Generation
10. Returns Management

---

## Implementation Plan

### Phase 1: Core Infrastructure (Files to Create)

#### 1.1 Enhanced Shipping Types & Interfaces
- `types/shipping.ts` - Complete shipping type definitions
- `lib/shipping-types.ts` - Type guards and validation

#### 1.2 Enhanced Shipping Calculator
- `lib/shipping-calculator.ts` (UPDATE) - Add weight tiers, bulk discounts
- `lib/shipping-zones.ts` - Zone-specific configurations
- `lib/courier-services.ts` - Courier-specific rate cards

#### 1.3 Address Management
- `lib/address-validator.ts` - Address validation service
- `components/ShippingAddressForm.tsx` - Address input component
- `components/AddressAutocomplete.tsx` - Autocomplete component

#### 1.4 Packaging Calculator
- `lib/packaging-calculator.ts` - Box size calculation
- `types/packaging.ts` - Box dimensions and constraints

### Phase 2: Courier Integrations

#### 2.1 DHL Integration
- `lib/couriers/dhl.ts` - DHL Express API client
- `app/api/shipping/dhl/route.ts` - DHL endpoints
- `lib/couriers/dhl-types.ts` - DHL type definitions

#### 2.2 FedEx Integration
- `lib/couriers/fedex.ts` - FedEx API client
- `app/api/shipping/fedex/route.ts` - FedEx endpoints
- `lib/couriers/fedex-types.ts` - FedEx type definitions

#### 2.3 UPS Integration
- `lib/couriers/ups.ts` - UPS API client
- `app/api/shipping/ups/route.ts` - UPS endpoints
- `lib/couriers/ups-types.ts` - UPS type definitions

#### 2.4 EMS/Kenya Post Integration
- `lib/couriers/ems.ts` - EMS API client
- `app/api/shipping/ems/route.ts` - EMS endpoints

### Phase 3: Shipment Management APIs

#### 3.1 Shipment CRUD API
- `app/api/shipments/route.ts` - List, create shipments
- `app/api/shipments/[id]/route.ts` - Get, update, delete shipment
- `app/api/shipments/[id]/track/route.ts` - Track shipment
- `lib/shipment-service.ts` - Shipment business logic

#### 3.2 Tracking API
- `app/api/tracking/route.ts` - Public tracking endpoint
- `app/api/tracking/[trackingNumber]/route.ts` - Track by number
- `lib/tracking-service.ts` - Unified tracking service

#### 3.3 Shipping Rates API
- `app/api/shipping/rates/route.ts` - Get all rates for destination
- `app/api/shipping/validate/route.ts` - Validate shipping eligibility

### Phase 4: Courier Webhooks

#### 4.1 Webhook Handlers
- `app/api/webhooks/dhl/route.ts` - DHL status updates
- `app/api/webhooks/fedex/route.ts` - FedEx status updates
- `app/api/webhooks/ups/route.ts` - UPS status updates
- `lib/webhook-handler.ts` - Unified webhook processing

#### 4.2 Signature Verification
- `lib/webhook-signature.ts` - Verify webhook authenticity

### Phase 5: Admin Dashboard Components

#### 5.1 Shipment Management
- `app/dashboard/shipments/page.tsx` - Shipments list
- `app/dashboard/shipments/[id]/page.tsx` - Shipment details
- `components/dashboard/ShipmentList.tsx` - Shipments table
- `components/dashboard/ShipmentForm.tsx` - Create/edit shipment
- `components/dashboard/ShipmentTracker.tsx` - Live tracking display

#### 5.2 Bulk Operations
- `components/dashboard/BulkShipmentCreate.tsx` - Bulk shipping
- `components/dashboard/BulkLabelPrint.tsx` - Print multiple labels

#### 5.3 Analytics
- `components/dashboard/ShippingAnalytics.tsx` - Shipping stats
- `components/dashboard/CourierPerformance.tsx` - Courier metrics

### Phase 6: Customer-Facing Features

#### 6.1 Order Tracking Page
- `app/tracking/page.tsx` - Public tracking page
- `app/tracking/[trackingNumber]/page.tsx` - Track by number
- `components/tracking/TrackingTimeline.tsx` - Visual timeline
- `components/tracking/TrackingCard.tsx` - Tracking result card

#### 6.2 Order Details Page Enhancement
- `app/order/[id]/page.tsx` (UPDATE) - Add shipment details
- `components/OrderShipmentStatus.tsx` - Shipment status component

#### 6.3 Email Notifications
- `lib/email-templates/shipping.ts` - Email templates
- `lib/notifications/shipping.ts` - Notification triggers
- `app/api/notifications/shipping/route.ts` - Send shipping emails

### Phase 7: Shipping Settings & Configuration

#### 7.1 Admin Settings
- `app/dashboard/settings/shipping/page.tsx` - Shipping settings
- `components/dashboard/ShippingZonesConfig.tsx` - Zone configuration
- `components/dashboard/CourierSettings.tsx` - Courier credentials
- `components/dashboard/FreeShippingSettings.tsx` - Thresholds

#### 7.2 Shipping Rules Engine
- `lib/shipping-rules.ts` - Business rules for shipping
- `components/dashboard/ShippingRulesEditor.tsx` - Rules UI

---

## File Structure (New Files)

```
/home/joshua/joshua/artAfrik/
├── app/
│   ├── api/
│   │   ├── shipping/
│   │   │   ├── rates/route.ts
│   │   │   ├── validate/route.ts
│   │   │   ├── dhl/route.ts
│   │   │   ├── fedex/route.ts
│   │   │   ├── ups/route.ts
│   │   │   └── ems/route.ts
│   │   ├── shipments/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── route.ts
│   │   │       ├── track/route.ts
│   │   │       └── label/route.ts
│   │   ├── tracking/
│   │   │   ├── route.ts
│   │   │   └── [trackingNumber]/route.ts
│   │   ├── webhooks/
│   │   │   ├── dhl/route.ts
│   │   │   ├── fedex/route.ts
│   │   │   └── ups/route.ts
│   │   └── notifications/
│   │       └── shipping/route.ts
│   ├── dashboard/
│   │   └── shipments/
│   │       ├── page.tsx
│   │       └── [id]/page.tsx
│   ├── tracking/
│   │   ├── page.tsx
│   │   └── [trackingNumber]/page.tsx
│   └── dashboard/
│       └── settings/
│           └── shipping/page.tsx
├── components/
│   ├── dashboard/
│   │   ├── ShipmentList.tsx
│   │   ├── ShipmentForm.tsx
│   │   ├── ShipmentTracker.tsx
│   │   ├── BulkShipmentCreate.tsx
│   │   ├── BulkLabelPrint.tsx
│   │   ├── ShippingAnalytics.tsx
│   │   ├── CourierPerformance.tsx
│   │   ├── ShippingZonesConfig.tsx
│   │   ├── CourierSettings.tsx
│   │   ├── FreeShippingSettings.tsx
│   │   └── ShippingRulesEditor.tsx
│   ├── tracking/
│   │   ├── TrackingTimeline.tsx
│   │   └── TrackingCard.tsx
│   ├── ShippingAddressForm.tsx
│   ├── AddressAutocomplete.tsx
│   └── OrderShipmentStatus.tsx
├── lib/
│   ├── couriers/
│   │   ├── index.ts
│   │   ├── dhl.ts
│   │   ├── dhl-types.ts
│   │   ├── fedex.ts
│   │   ├── fedex-types.ts
│   │   ├── ups.ts
│   │   ├── ups-types.ts
│   │   └── ems.ts
│   ├── shipment-service.ts
│   ├── tracking-service.ts
│   ├── shipping-zones.ts
│   ├── courier-services.ts
│   ├── address-validator.ts
│   ├── packaging-calculator.ts
│   ├── webhook-handler.ts
│   ├── webhook-signature.ts
│   ├── shipping-rules.ts
│   └── email-templates/
│       └── shipping.ts
├── types/
│   ├── shipping.ts
│   ├── packaging.ts
│   └── courier/
│       ├── dhl.ts
│       ├── fedex.ts
│       └── ups.ts
└── research/
    └── shipping-rates.md (new comprehensive rates)
```

---

## Database Schema Updates

```prisma
// Additional models for enhanced shipping

// Shipping Account for Couriers
model ShippingAccount {
  id        String   @id @default(cuid())
  courier   String   // DHL, FedEx, UPS, EMS
  accountNumber String
  apiKey    String?
  apiSecret String?
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@unique([courier])
}

// Shipping Rate Cache
model ShippingRateCache {
  id           String   @id @default(cuid())
  courier      String
  zone         String
  weight       Float
  rate         Float
  currency     String   @default("USD")
  validFrom    DateTime
  validTo      DateTime
  createdAt    DateTime @default(now())
  
  @@index([courier, zone, weight])
}

// Shipment Event (Tracking History)
model ShipmentEvent {
  id          String   @id @default(cuid())
  shipmentId  String
  status      String
  location    String?
  description String?
  timestamp   DateTime
  rawData     Json?
  createdAt   DateTime @default(now())
  
  shipment    Shipment @relation(fields: [shipmentId], references: [id], onDelete: Cascade)
  
  @@index([shipmentId])
}

// Shipping Box Configuration
model ShippingBox {
  id          String   @id @default(cuid())
  name        String
  length      Float    // cm
  width       Float    // cm
  height      Float    // cm
  maxWeight   Float    // kg
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// Shipping Rule
model ShippingRule {
  id          String   @id @default(cuid())
  name        String
  description String?
  conditions  Json     // JSON conditions
  action      Json     // JSON action (discount, free shipping, etc)
  priority    Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## API Endpoints Summary

### Public Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/shipping` | POST | Calculate shipping rates |
| `/api/shipping/validate` | POST | Validate shipping eligibility |
| `/api/tracking` | GET | Track shipment by order number |
| `/api/tracking/[number]` | GET | Track by tracking number |

### Authenticated Endpoints (User)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/shipments` | GET | Get user's shipments |
| `/api/shipments/[id]` | GET | Get shipment details |

### Admin Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/shipments` | POST | Create shipment |
| `/api/shipments` | GET | List all shipments |
| `/api/shipments/[id]` | PUT | Update shipment |
| `/api/shipments/[id]` | DELETE | Delete shipment |
| `/api/shipments/[id]/track` | GET | Force refresh tracking |
| `/api/shipments/[id]/label` | GET | Generate shipping label |
| `/api/shipping/rates` | GET | Get all configured rates |
| `/api/shipping/zones` | GET/POST | Manage shipping zones |

### Webhook Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/webhooks/dhl` | POST | DHL status updates |
| `/api/webhooks/fedex` | POST | FedEx status updates |
| `/api/webhooks/ups` | POST | UPS status updates |

---

## Shipping Calculation Formula

```
Total Cost = Base Rate + (Weight × Rate per kg) + Fuel Surcharge + Insurance + Handling Fee + Remote Area Fee

Free Shipping = subtotal >= FREE_SHIPPING_THRESHOLD[zone]
Discounted Shipping = subtotal >= DISCOUNT_THRESHOLD[zone] ? 10% off : 0
```

---

## Priority Order

### High Priority (Must Have)
1. Enhanced Shipping Calculator with tiered pricing
2. Shipment CRUD API with tracking
3. Customer Tracking Page
4. Admin Shipment Management
5. Email Notifications for shipment updates

### Medium Priority (Should Have)
6. Courier API Integrations (DHL, FedEx, UPS)
7. Webhook Handlers for real-time updates
8. Address Validation
9. Packaging Calculator
10. Bulk Operations

### Low Priority (Nice to Have)
11. Shipping Label Generation
12. Returns Management
13. Advanced Shipping Rules Engine
14. Analytics Dashboard

---

## Next Steps

1. **Review and approve this plan**
2. **Start with Phase 1** - Core Infrastructure
3. **Create types and interfaces**
4. **Enhance shipping calculator**
5. **Build shipment management APIs**
6. **Create tracking system**
7. **Build admin dashboard**
8. **Create customer tracking page**
9. **Integrate courier APIs**
10. **Set up webhooks and notifications**

---

## Dependencies

### NPM Packages to Add
```
- axios (HTTP client for API calls)
- zod (validation)
- pdfkit (PDF label generation)
- qrcode (QR code generation)
- @types/pdfkit
- @types/qrcode
```

### Environment Variables Needed
```
# DHL
DHL_API_KEY=
DHL_API_SECRET=
DHL_ACCOUNT_NUMBER=

# FedEx
FEDEX_API_KEY=
FEDEX_SECRET_KEY=
FEDEX_ACCOUNT_NUMBER=

# UPS
UPS_CLIENT_ID=
UPS_CLIENT_SECRET=
UPS_ACCOUNT_NUMBER=

# Webhook Secrets
DHL_WEBHOOK_SECRET=
FEDEX_WEBHOOK_SECRET=
UPS_WEBHOOK_SECRET=
```

---

*Plan created for ArtAfrik Shipping System implementation*
 -->
