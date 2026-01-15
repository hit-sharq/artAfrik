'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  useShipping, 
  useCartShipping
} from '@/hooks/use-shipping';
import { COUNTRY_ZONE_MAPPING } from '@/lib/shipping-config';
import type { CartItemWithWeight } from '@/lib/shipping-calculator';

interface ShippingCalculatorProps {
  cartItems?: CartItemWithWeight[];
  onShippingChange?: (shippingCost: number, isFree: boolean) => void;
  showOptions?: boolean;
}

export default function ShippingCalculator({ 
  cartItems, 
  onShippingChange,
  showOptions = true 
}: ShippingCalculatorProps) {
  const {
    countryCode,
    setCountryCode,
    calculateForSubtotal,
    getOptionsForSubtotal,
    formatShippingCost,
    shippingInfo,
    isFreeShipping,
    estimatedDelivery,
  } = useShipping({ defaultCountry: 'KE' });

  const subtotal = useMemo(() => {
    if (cartItems) {
      return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
    return 0;
  }, [cartItems]);

  const shippingCalculation = useMemo(() => {
    return calculateForSubtotal(subtotal, cartItems);
  }, [subtotal, cartItems, calculateForSubtotal]);

  const shippingOptions = useMemo(() => {
    return getOptionsForSubtotal(subtotal, cartItems);
  }, [subtotal, cartItems, getOptionsForSubtotal]);

  useEffect(() => {
    if (onShippingChange) {
      onShippingChange(shippingCalculation.totalKES, shippingCalculation.isFreeShipping);
    }
  }, [shippingCalculation, onShippingChange]);

  const selectedCountry = useMemo(() => {
    return COUNTRY_ZONE_MAPPING.find(c => c.code === countryCode);
  }, [countryCode]);

  return (
    <div className="shipping-calculator">
      <h3 className="text-lg font-semibold mb-4">Shipping Method</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Destination Country
        </label>
        <select
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
          className="w-full p-2 border rounded-lg"
        >
          <option value="">Select Country</option>
          {COUNTRY_ZONE_MAPPING.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      {countryCode && (
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Estimated Delivery:</span>
            <span className="text-sm font-medium">{estimatedDelivery}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Carrier:</span>
            <span className="text-sm font-medium">{shippingInfo.courier}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Free Shipping:</span>
            <span className="text-sm font-medium">
              KES {shippingInfo.freeShippingThreshold.toLocaleString()}+
            </span>
          </div>
        </div>
      )}

      {showOptions && shippingOptions.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Select Shipping Option
          </label>
          <div className="space-y-2">
            {shippingOptions.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                  option.isFreeShipping 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-primary'
                }`}
              >
                <input
                  type="radio"
                  name="shippingOption"
                  value={index}
                  defaultChecked={index === 1}
                  className="mr-3"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{option.courier}</span>
                    <span className={`font-bold ${
                      option.isFreeShipping ? 'text-green-600' : ''
                    }`}>
                      {formatShippingCost(option)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Delivery: {option.estimatedDays}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {!isFreeShipping && subtotal > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-blue-700">
            Add KES {(
              shippingInfo.freeShippingThreshold - subtotal
            ).toLocaleString()} more for free shipping!
          </p>
          <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-600 h-2 rounded-full"
              style={{
                width: `${Math.min(100, (subtotal / shippingInfo.freeShippingThreshold) * 100)}%`
              }}
            />
          </div>
        </div>
      )}

      <div className="border-t pt-4">
        <div className="flex justify-between items-center">
          <span className="font-medium">Shipping Cost:</span>
          <span className={`text-xl font-bold ${
            isFreeShipping ? 'text-green-600' : ''
          }`}>
            {formatShippingCost(shippingCalculation)}
          </span>
        </div>
      </div>
    </div>
  );
}

export function CartShippingSummary({ 
  items, 
  countryCode 
}: {
  items: CartItemWithWeight[];
  countryCode: string;
}) {
  const { totalWeight, subtotal, shippingOptions, selectedOption, total, setSelectedService } = 
    useCartShipping(countryCode, items);

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="font-semibold mb-3">Shipping</h4>
      
      <div className="mb-3 text-sm">
        <span className="text-gray-600">Weight: </span>
        <span className="font-medium">{totalWeight.toFixed(2)} kg</span>
      </div>

      <div className="space-y-2 mb-4">
        {shippingOptions.map((option, index) => (
          <label
            key={index}
            className="flex items-center justify-between p-2 border rounded cursor-pointer hover:bg-white"
          >
            <div className="flex items-center">
              <input
                type="radio"
                name="cartShipping"
                value={option.courier}
                checked={selectedOption.courier === option.courier}
                onChange={() => setSelectedService(
                  option.courier.includes('Economy') ? 'economy' : 
                  option.courier.includes('Priority') ? 'priority' : 'standard'
                )}
                className="mr-2"
              />
              <div>
                <div className="text-sm font-medium">{option.courier}</div>
                <div className="text-xs text-gray-500">{option.estimatedDays}</div>
              </div>
            </div>
            <div className="text-sm font-bold">
              {option.isFreeShipping ? 'FREE' : 
                option.currency === 'USD' ? `$${option.totalUSD.toFixed(2)}` : 
                `KES ${option.totalKES.toLocaleString()}`}
            </div>
          </label>
        ))}
      </div>

      <div className="border-t pt-3">
        <div className="flex justify-between items-center">
          <span className="text-sm">Shipping:</span>
          <span className={`font-bold ${total.isFreeShipping ? 'text-green-600' : ''}`}>
            {total.isFreeShipping ? 'FREE' : 
              `KES ${total.shipping.toLocaleString()}`}
          </span>
        </div>
      </div>
    </div>
  );
}

