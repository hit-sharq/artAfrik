// Shipping Calculator Utility for ArtAfrik
import { 
  ShippingZone, 
  SHIPPING_ZONES, 
  getShippingZone, 
  getZoneInfo,
  FREE_SHIPPING_THRESHOLDS 
} from './shipping-config';

const USD_TO_KES = 150;

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
  
  let baseRate = zoneInfo.baseRate;
  let weightCharge = additionalWeight * zoneInfo.ratePerKg;
  
  let totalUSD = baseRate + weightCharge;
  let totalKES = zone === 'local' ? totalUSD : totalUSD * USD_TO_KES;
  
  const fuelSurchargeRate = 0.20;
  const fuelSurcharge = zone === 'local' 
    ? totalUSD * fuelSurchargeRate 
    : totalUSD * USD_TO_KES * fuelSurchargeRate;
  
  const insuranceRate = 0.01;
  const insuranceMin = zone === 'local' ? 50 : 5 * USD_TO_KES;
  const insurance = Math.max(insuranceMin, subtotal * insuranceRate);
  
  const subtotalWithExtras = zone === 'local' 
    ? totalUSD + fuelSurcharge + insurance
    : (totalUSD * USD_TO_KES) + fuelSurcharge + insurance;
  
  totalKES = isFreeShipping ? 0 : subtotalWithExtras;
  totalUSD = isFreeShipping ? 0 : totalKES / USD_TO_KES;
  
  const savings = isFreeShipping ? subtotalWithExtras : 0;
  
  return {
    zone,
    baseRate: zone === 'local' ? baseRate : baseRate * USD_TO_KES,
    weightCharge: zone === 'local' ? weightCharge : weightCharge * USD_TO_KES,
    fuelSurcharge,
    insurance,
    totalUSD: Math.round(totalUSD * 100) / 100,
    totalKES: Math.round(totalKES),
    currency: zone === 'local' ? 'KES' : 'USD',
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
      totalKES: Math.round(economyResult.totalKES * 0.8),
    });
  }
  
  options.push(calculateShipping({
    weight: 1,
    countryCode,
    subtotal,
  }));
  
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
      totalKES: Math.round(expressResult.totalKES * 1.5),
    });
  }
  
  return options;
}

export function formatShippingCost(result: ShippingCalculationResult): string {
  if (result.isFreeShipping) {
    return 'FREE';
  }
  
  const currency = result.currency === 'USD' ? '$' : 'KES ';
  const amount = result.currency === 'USD' 
    ? result.totalUSD.toFixed(2) 
    : result.totalKES.toLocaleString();
    
  return `${currency}${amount}`;
}

export function getShippingInfo(countryCode: string) {
  const zone = getShippingZone(countryCode);
  const zoneInfo = getZoneInfo(zone);
  
  return {
    zone,
    courier: zoneInfo.courier,
    estimatedDelivery: `${zoneInfo.estimatedDaysMin}-${zoneInfo.estimatedDaysMax} business days`,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLDS[zone],
  };
}

export function isValidShippingDestination(countryCode: string): boolean {
  const zone = getShippingZone(countryCode);
  return zone !== undefined;
}

