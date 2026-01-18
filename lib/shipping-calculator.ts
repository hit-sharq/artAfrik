// Shipping Calculator Utility for ArtAfrik
// All prices in USD
import { 
  ShippingZone, 
  SHIPPING_ZONES, 
  getShippingZone, 
  getZoneInfo,
  FREE_SHIPPING_THRESHOLDS 
} from './shipping-config';

export interface ShippingCalculationParams {
  weight: number;
  countryCode: string;
  subtotal: number;
}

export interface ShippingCalculationResult {
  zone: ShippingZone;
  baseRate: number;
  weightCharge: number;
  fuelSurcharge: number;
  insurance: number;
  totalUSD: number;
  totalKES: number;
  currency: string;
  estimatedDays: string;
  courier: string;
  isFreeShipping: boolean;
  savings?: number;
}

export interface CartItemWithWeight {
  id: string;
  weight?: number;
  quantity: number;
  price: number;
}

export function calculateTotalWeight(
  items: CartItemWithWeight[], 
  defaultWeight: number = 0.5
): number {
  return items.reduce((total, item) => {
    return total + ((item.weight || defaultWeight) * item.quantity);
  }, 0);
}

export function calculateShipping(
  params: ShippingCalculationParams
): ShippingCalculationResult {
  const { weight, countryCode, subtotal } = params;
  const zone = getShippingZone(countryCode);
  const zoneInfo = getZoneInfo(zone);
  
  const freeShippingThreshold = FREE_SHIPPING_THRESHOLDS[zone];
  const isFreeShipping = subtotal >= freeShippingThreshold;
  
  const baseWeight = 0.5;
  const additionalWeight = Math.max(0, weight - baseWeight);
  
  const baseRate = zoneInfo.baseRate;
  const weightCharge = additionalWeight * zoneInfo.ratePerKg;
  
  // All calculations in USD
  let totalUSD = baseRate + weightCharge;
  
  // Fuel surcharge (20% for all zones)
  const fuelSurcharge = totalUSD * 0.20;
  
  // Insurance (1% with minimum based on zone)
  const insuranceMin = zone === 'local' ? 5 : 10;
  const insurance = Math.max(insuranceMin, subtotal * 0.01);
  
  const subtotalWithExtras = totalUSD + fuelSurcharge + insurance;
  
  totalUSD = isFreeShipping ? 0 : subtotalWithExtras;
  
  const savings = isFreeShipping ? subtotalWithExtras : 0;
  
  return {
    zone,
    baseRate,
    weightCharge,
    fuelSurcharge,
    insurance,
    totalUSD: Math.round(totalUSD * 100) / 100,
    totalKES: 0, // Not used anymore
    currency: 'USD',
    estimatedDays: `${zoneInfo.estimatedDaysMin}-${zoneInfo.estimatedDaysMax} days`,
    courier: zoneInfo.courier,
    isFreeShipping,
    savings: savings > 0 ? Math.round(savings) : undefined,
  };
}

export function getShippingOptions(
  countryCode: string,
  subtotal: number
): ShippingCalculationResult[] {
  const zone = getShippingZone(countryCode);
  const zoneInfo = getZoneInfo(zone);
  
  const options: ShippingCalculationResult[] = [];
  
  // Economy option (for international)
  if (zone !== 'local') {
    const economyResult = calculateShipping({
      weight: 1,
      countryCode,
      subtotal,
    });
    
    options.push({
      ...economyResult,
      courier: 'EMS (Economy)',
      estimatedDays: `${zoneInfo.estimatedDaysMax + 3}-${zoneInfo.estimatedDaysMax + 7} days`,
      totalUSD: Math.round((economyResult.totalUSD * 0.8) * 100) / 100,
    });
  }
  
  // Standard option
  options.push(calculateShipping({
    weight: 1,
    countryCode,
    subtotal,
  }));
  
  // Express option (for international)
  if (zone !== 'local') {
    const expressResult = calculateShipping({
      weight: 1,
      countryCode,
      subtotal,
    });
    
    options.push({
      ...expressResult,
      courier: 'DHL Express (Priority)',
      estimatedDays: `${Math.max(1, zoneInfo.estimatedDaysMin - 1)}-${Math.max(2, zoneInfo.estimatedDaysMax - 2)} days`,
      totalUSD: Math.round((expressResult.totalUSD * 1.5) * 100) / 100,
    });
  }
  
  return options;
}

export function formatShippingCost(result: ShippingCalculationResult): string {
  if (result.isFreeShipping) {
    return 'FREE';
  }
  
  return `$${result.totalUSD.toFixed(2)}`;
}

export function getShippingInfo(countryCode: string) {
  const zone = getShippingZone(countryCode);
  const zoneInfo = getZoneInfo(zone);
  
  return {
    zone,
    courier: zoneInfo.courier,
    estimatedDelivery: `${zoneInfo.estimatedDaysMin}-${zoneInfo.estimatedDaysMax} business days`,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLDS[zone],
    currency: 'USD',
  };
}

export function isValidShippingDestination(countryCode: string): boolean {
  const zone = getShippingZone(countryCode);
  return zone !== undefined;
}


