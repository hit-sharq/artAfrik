'use client';

import { useState, useMemo } from 'react';
import { 
  calculateShipping, 
  calculateTotalWeight,
  getShippingOptions,
  formatShippingCost,
  getShippingInfo,
  type ShippingCalculationResult,
  type CartItemWithWeight
} from '@/lib/shipping-calculator';

interface UseShippingOptions {
  defaultCountry?: string;
  defaultWeight?: number;
}

export function useShipping(options: UseShippingOptions = {}) {
  const { defaultCountry = 'KE', defaultWeight = 0.5 } = options;
  
  const [countryCode, setCountryCode] = useState(defaultCountry);
  const [weight, setWeight] = useState(defaultWeight);
  const [selectedService, setSelectedService] = useState<string>('standard');
  
  const calculation = useMemo(() => {
    return calculateShipping({
      weight,
      countryCode,
      subtotal: 0,
    });
  }, [weight, countryCode]);
  
  const shippingOptions = useMemo(() => {
    return getShippingOptions(countryCode, 0);
  }, [countryCode]);
  
  const calculateForSubtotal = (subtotal: number, items?: CartItemWithWeight[]) => {
    const totalWeight = items ? calculateTotalWeight(items, defaultWeight) : weight;
    
    return calculateShipping({
      weight: totalWeight,
      countryCode,
      subtotal,
    });
  };
  
  const getOptionsForSubtotal = (subtotal: number, items?: CartItemWithWeight[]) => {
    const totalWeight = items ? calculateTotalWeight(items, defaultWeight) : weight;
    
    return getShippingOptions(countryCode, subtotal).map(option => ({
      ...option,
      weight: totalWeight,
    }));
  };
  
  const shippingInfo = useMemo(() => {
    return getShippingInfo(countryCode);
  }, [countryCode]);
  
  return {
    countryCode,
    setCountryCode,
    weight,
    setWeight,
    selectedService,
    setSelectedService,
    calculation,
    shippingOptions,
    calculateForSubtotal,
    getOptionsForSubtotal,
    formatShippingCost,
    shippingInfo,
    isFreeShipping: calculation.isFreeShipping,
    estimatedDelivery: calculation.estimatedDays,
    courier: calculation.courier,
  };
}

export function useCartShipping(countryCode: string, items: CartItemWithWeight[]) {
  const [selectedService, setSelectedService] = useState('standard');
  
  const totalWeight = useMemo(() => {
    return calculateTotalWeight(items, 0.5);
  }, [items]);
  
  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [items]);
  
  const shippingOptions = useMemo(() => {
    return getShippingOptions(countryCode, subtotal).map(option => ({
      ...option,
      weight: totalWeight,
    }));
  }, [countryCode, subtotal, totalWeight]);
  
  const selectedOption = useMemo(() => {
    return shippingOptions.find(opt => opt.courier.includes(selectedService)) || shippingOptions[0];
  }, [shippingOptions, selectedService]);
  
  const total = useMemo(() => {
    return {
      subtotal,
      shipping: selectedOption.totalKES,
      total: subtotal + selectedOption.totalKES,
      isFreeShipping: selectedOption.isFreeShipping,
    };
  }, [subtotal, selectedOption]);
  
  return {
    totalWeight,
    subtotal,
    shippingOptions,
    selectedService,
    setSelectedService,
    selectedOption,
    total,
  };
}

