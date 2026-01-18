<!-- # Shipping System Integration - TODO

## Phase 1: Shipping Quote API ✅
- [x] Create `app/api/shipping/route.ts` - GET endpoint for shipping quotes
- [x] Add query params: countryCode, subtotal
- [x] Return shipping options with calculated rates

## Phase 2: Checkout Integration ✅ (IN PROGRESS)
- [x] Update `app/checkout/page.tsx` to fetch shipping options
- [x] Display shipping options (Economy/Standard/Express) with prices
- [x] Allow customer to select shipping option
- [x] Update order total with selected shipping cost

## Phase 3: Order to Shipment Flow
- [ ] Check `app/api/orders/route.ts` for order creation
- [ ] Add shipment creation after payment confirmation
- [ ] Link shipment to order in database

## Phase 4: Tracking Page
- [ ] Update `app/tracking/page.tsx` to use shipment service
- [ ] Display tracking timeline with events
- [ ] Handle tracking number lookup

## Phase 5: Admin Dashboard
- [ ] Create/update `app/dashboard/shipments/page.tsx`
- [ ] List all shipments with filtering
- [ ] Add status update functionality
- [ ] Add shipment event creation

## Phase 6: Customer Order View
- [ ] Update `app/orders/page.tsx` to show shipment info
- [ ] Display tracking number and status
- [ ] Link to tracking page

## Progress Summary
✅ Artisan clerkId fix - artisans now get their Clerk ID stored during registration
✅ Shipping API - endpoints exist for calculating shipping quotes
✅ Checkout page - now fetches and displays shipping options from the shipping service
✅ Shipping options UI - styled radio button selection for shipping methods
 -->
