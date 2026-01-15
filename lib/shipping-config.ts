// Shipping Configuration for ArtAfrik
// Based on research from shipping-fees-kenya.md

export type ShippingZone = 
  | 'zone_a' // East Africa
  | 'zone_b' // Rest of Africa
  | 'zone_c' // Asia & Middle East
  | 'zone_d' // Europe
  | 'zone_e' // Americas
  | 'zone_f' // Oceania
  | 'local'; // Kenya (domestic)

export interface ShippingRate {
  baseRate: number;
  ratePerKg: number;
  currency: string;
  estimatedDaysMin: number;
  estimatedDaysMax: number;
  courier: string;
}

export interface CountryMapping {
  code: string;
  name: string;
  zone: ShippingZone;
}

// Shipping Zones Configuration
export const SHIPPING_ZONES: Record<ShippingZone, ShippingRate> = {
  local: {
    baseRate: 5,
    ratePerKg: 2,
    currency: 'KES',
    estimatedDaysMin: 1,
    estimatedDaysMax: 3,
    courier: 'Local Courier',
  },
  zone_a: {
    baseRate: 25,
    ratePerKg: 12,
    currency: 'USD',
    estimatedDaysMin: 3,
    estimatedDaysMax: 5,
    courier: 'EMS/DHL',
  },
  zone_b: {
    baseRate: 40,
    ratePerKg: 18,
    currency: 'USD',
    estimatedDaysMin: 5,
    estimatedDaysMax: 10,
    courier: 'DHL/FedEx',
  },
  zone_c: {
    baseRate: 38,
    ratePerKg: 15,
    currency: 'USD',
    estimatedDaysMin: 5,
    estimatedDaysMax: 8,
    courier: 'DHL/FedEx',
  },
  zone_d: {
    baseRate: 45,
    ratePerKg: 18,
    currency: 'USD',
    estimatedDaysMin: 5,
    estimatedDaysMax: 8,
    courier: 'DHL/FedEx/UPS',
  },
  zone_e: {
    baseRate: 50,
    ratePerKg: 22,
    currency: 'USD',
    estimatedDaysMin: 6,
    estimatedDaysMax: 10,
    courier: 'FedEx/UPS',
  },
  zone_f: {
    baseRate: 50,
    ratePerKg: 22,
    currency: 'USD',
    estimatedDaysMin: 7,
    estimatedDaysMax: 12,
    courier: 'DHL/FedEx',
  },
};

export const COUNTRY_ZONE_MAPPING: CountryMapping[] = [
  { code: 'KE', name: 'Kenya', zone: 'local' },
  { code: 'TZ', name: 'Tanzania', zone: 'zone_a' },
  { code: 'UG', name: 'Uganda', zone: 'zone_a' },
  { code: 'RW', name: 'Rwanda', zone: 'zone_a' },
  { code: 'BI', name: 'Burundi', zone: 'zone_a' },
  { code: 'SS', name: 'South Sudan', zone: 'zone_a' },
  { code: 'ET', name: 'Ethiopia', zone: 'zone_a' },
  { code: 'ZA', name: 'South Africa', zone: 'zone_b' },
  { code: 'NG', name: 'Nigeria', zone: 'zone_b' },
  { code: 'GH', name: 'Ghana', zone: 'zone_b' },
  { code: 'EG', name: 'Egypt', zone: 'zone_b' },
  { code: 'MA', name: 'Morocco', zone: 'zone_b' },
  { code: 'AE', name: 'United Arab Emirates', zone: 'zone_c' },
  { code: 'SA', name: 'Saudi Arabia', zone: 'zone_c' },
  { code: 'IN', name: 'India', zone: 'zone_c' },
  { code: 'CN', name: 'China', zone: 'zone_c' },
  { code: 'JP', name: 'Japan', zone: 'zone_c' },
  { code: 'SG', name: 'Singapore', zone: 'zone_c' },
  { code: 'MY', name: 'Malaysia', zone: 'zone_c' },
  { code: 'TH', name: 'Thailand', zone: 'zone_c' },
  { code: 'KR', name: 'South Korea', zone: 'zone_c' },
  { code: 'GB', name: 'United Kingdom', zone: 'zone_d' },
  { code: 'DE', name: 'Germany', zone: 'zone_d' },
  { code: 'FR', name: 'France', zone: 'zone_d' },
  { code: 'NL', name: 'Netherlands', zone: 'zone_d' },
  { code: 'BE', name: 'Belgium', zone: 'zone_d' },
  { code: 'IT', name: 'Italy', zone: 'zone_d' },
  { code: 'ES', name: 'Spain', zone: 'zone_d' },
  { code: 'US', name: 'United States', zone: 'zone_e' },
  { code: 'CA', name: 'Canada', zone: 'zone_e' },
  { code: 'BR', name: 'Brazil', zone: 'zone_e' },
  { code: 'MX', name: 'Mexico', zone: 'zone_e' },
  { code: 'AU', name: 'Australia', zone: 'zone_f' },
  { code: 'NZ', name: 'New Zealand', zone: 'zone_f' },
];

export function getShippingZone(countryCode: string): ShippingZone {
  const normalizedCode = countryCode.toUpperCase();
  const country = COUNTRY_ZONE_MAPPING.find(c => c.code === normalizedCode);
  return country?.zone || 'zone_b';
}

export function getZoneInfo(zone: ShippingZone) {
  return SHIPPING_ZONES[zone];
}

export const FREE_SHIPPING_THRESHOLDS: Record<ShippingZone, number> = {
  local: 5000,
  zone_a: 15000,
  zone_b: 20000,
  zone_c: 25000,
  zone_d: 30000,
  zone_e: 35000,
  zone_f: 35000,
};

