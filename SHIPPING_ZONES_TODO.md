<!-- # Zone-Based Local Shipping Implementation

## Summary
Implement zone-based local shipping rates for Kenya (Nairobi, Major Cities, Rural) with no free shipping threshold.

## Local Zone Rates (KES)
| Zone | Shipping Rate | Free Shipping |
|------|---------------|---------------|
| Nairobi | 250 KES | No |
| Major Cities | 500 KES | No |
| Rural/Other | 800 KES | No |

## Tasks

### 1. Update `lib/shipping-config.ts`
- [ ] Add KES currency type for local shipping
- [ ] Create local zone types (nairobi, major_cities, rural)
- [ ] Add KES shipping rates for each local zone
- [ ] Define major cities list (Mombasa, Kisumu, Nakuru, Eldoret, etc.)
- [ ] Update free shipping thresholds (set to 0 for local)

### 2. Update `lib/shipping-calculator.ts`
- [ ] Modify `calculateShipping()` for local zone handling
- [ ] Remove weight-based calculation for Kenya
- [ ] Return flat rate based on selected zone
- [ ] Update `getShippingOptions()` for local orders

### 3. Update `components/ShippingCalculator.tsx`
- [ ] Add region/city selector for Kenya
- [ ] Show Nairobi, Major Cities, Rural options
- [ ] Display shipping cost in KES
- [ ] Update estimated delivery times per zone

### 4. Update `hooks/use-shipping.ts`
- [ ] Handle new local zone logic
- [ ] Update `calculateForSubtotal()` for zone-based
- [ ] Update `getOptionsForSubtotal()` for local

## Implementation Status
- [ ] Complete all tasks
- [ ] Test shipping calculation for each zone
- [ ] Verify cart displays correct shipping cost
 -->
