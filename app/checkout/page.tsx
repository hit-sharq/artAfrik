// Checkout Page with Stripe + M-Pesa Support
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, CreditCard, Lock, Check, Loader2, Smartphone, Building, Truck, Clock } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import MainLayout from '../../components/MainLayout';
import './checkout.css';

// Only load Stripe if publishable key is available
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

// Payment method types
type PaymentMethod = 'stripe' | 'mpesa' | 'pesapal';

// Shipping option type
interface ShippingOption {
  id: string;
  courier: string;
  service: string;
  estimatedDays: { min: number; max: number };
  price: number;
  currency: string;
  isAvailable: boolean;
  features: string[];
}

interface ShippingInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  countryCode: string;
}

// Stripe Checkout Form
function StripeCheckoutForm({ clientSecret, orderId }: { clientSecret: string; orderId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setPaymentError(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success?orderId=${orderId}`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setPaymentError(error.message || 'Payment failed');
        toast.error(error.message || 'Payment failed');
      } else if (paymentIntent?.status === 'succeeded') {
        toast.success('Payment successful! Redirecting...');
        window.location.href = `/checkout/success?orderId=${orderId}`;
      }
    } catch (err) {
      setPaymentError('An unexpected error occurred');
      toast.error('An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <PaymentElement />
      {paymentError && <div className="payment-error">{paymentError}</div>}
      <button type="submit" className="pay-btn stripe-pay-btn" disabled={!stripe || isProcessing}>
        {isProcessing ? <><Loader2 size={20} className="spin" />Processing...</> : <><Lock size={20} />Pay with Card</>}
      </button>
    </form>
  );
}

// M-Pesa Checkout Form
function MpesaCheckoutForm({ orderId, onSuccess }: { orderId: string; onSuccess: () => void }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'pending' | 'success' | 'error'>('idle');

  const handleMpesaPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) {
      toast.error('Please enter your phone number');
      return;
    }

    setIsProcessing(true);
    setStatus('sending');

    try {
      const response = await fetch('/api/payments/mpesa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartId: 'local',
          shippingInfo: { phone: phoneNumber },
          phoneNumber,
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.data.isDevelopment) {
          // Development mode - simulate
          setStatus('success');
          toast.success('M-Pesa payment simulated!');
          setTimeout(onSuccess, 1500);
        } else {
          setStatus('pending');
          toast.success('STK push sent! Check your phone.');
          // Poll for status
          pollPaymentStatus(data.data.orderId);
        }
      } else {
        setStatus('error');
        toast.error(data.error || 'Payment failed');
      }
    } catch (error) {
      setStatus('error');
      toast.error('Failed to initiate payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const pollPaymentStatus = async (orderId: string) => {
    const maxAttempts = 30;
    let attempts = 0;

    const poll = async () => {
      attempts++;
      try {
        const response = await fetch(`/api/payments/mpesa?orderId=${orderId}`);
        const data = await response.json();

        if (data.data.paymentStatus === 'COMPLETED') {
          setStatus('success');
          toast.success('Payment received!');
          onSuccess();
        } else if (attempts < maxAttempts) {
          setTimeout(poll, 2000);
        } else {
          setStatus('error');
          toast.error('Payment verification timed out');
        }
      } catch (error) {
        if (attempts < maxAttempts) {
          setTimeout(poll, 2000);
        }
      }
    };

    setTimeout(poll, 2000);
  };

  return (
    <div className="mpesa-checkout-form">
      <div className="mpesa-info">
        <Smartphone size={24} />
        <div>
          <h4>M-Pesa Payment</h4>
          <p>You will receive an STK push on your phone to complete the payment.</p>
        </div>
      </div>

      <form onSubmit={handleMpesaPayment}>
        <div className="form-group">
          <label htmlFor="mpesaPhone">Phone Number (M-Pesa)</label>
          <input
            type="tel"
            id="mpesaPhone"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="254712345678"
            required
          />
          <span className="input-hint">Enter your M-Pesa registered number (e.g., 254712345678)</span>
        </div>

        {status === 'sending' && (
          <div className="payment-status sending">
            <Loader2 size={20} className="spin" />
            <span>Sending STK push...</span>
          </div>
        )}

        {status === 'pending' && (
          <div className="payment-status pending">
            <Smartphone size={20} className="spin" />
            <span>Waiting for payment... Check your phone and enter your M-Pesa PIN.</span>
          </div>
        )}

        {status === 'success' && (
          <div className="payment-status success">
            <Check size={20} />
            <span>Payment received! Redirecting...</span>
          </div>
        )}

        {status === 'error' && (
          <div className="payment-status error">
            <span>Payment failed. Please try again.</span>
          </div>
        )}

        <button
          type="submit"
          className="pay-btn mpesa-pay-btn"
          disabled={isProcessing || status === 'pending'}
        >
          {isProcessing ? (
            <><Loader2 size={20} className="spin" />Processing...</>
          ) : status === 'pending' ? (
            <><Loader2 size={20} className="spin" />Waiting...</>
          ) : (
            <><Smartphone size={20} />Send STK Push</>
          )}
        </button>
      </form>
    </div>
  );
}

// PesaPal Checkout Form
function PesaPalCheckoutForm({ orderId, onSuccess }: { orderId: string; onSuccess: () => void }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'mpesa' | 'card' | 'bank'>('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handlePesaPalPayment = async () => {
    setIsProcessing(true);

    try {
      const response = await fetch('/api/payments/pesapal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartId: 'local',
          shippingInfo: { phone: phoneNumber },
          paymentMethod: selectedMethod,
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.data.isDevelopment) {
          toast.success('PesaPal payment simulated!');
          setTimeout(onSuccess, 1500);
        } else if (data.data.redirectUrl) {
          // Redirect to PesaPal
          window.location.href = data.data.redirectUrl;
        } else {
          toast.success('Payment initiated!');
          setTimeout(onSuccess, 1500);
        }
      } else {
        toast.error(data.error || 'Payment failed');
      }
    } catch (error) {
      toast.error('Failed to initiate payment');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="pesapal-checkout-form">
      <div className="pesapal-info">
        <Building size={24} />
        <div>
          <h4>PesaPal Payment</h4>
          <p>Pay securely via PesaPal with M-Pesa, credit card, or bank transfer.</p>
        </div>
      </div>

      {selectedMethod === 'mpesa' && (
        <div className="form-group">
          <label htmlFor="pesapalPhone">Phone Number (M-Pesa)</label>
          <input
            type="tel"
            id="pesapalPhone"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="254712345678"
          />
        </div>
      )}

      <div className="pesapal-methods">
        <button
          type="button"
          className={`method-btn ${selectedMethod === 'mpesa' ? 'active' : ''}`}
          onClick={() => setSelectedMethod('mpesa')}
        >
          <Smartphone size={18} />
          <span>M-Pesa</span>
        </button>
        <button
          type="button"
          className={`method-btn ${selectedMethod === 'card' ? 'active' : ''}`}
          onClick={() => setSelectedMethod('card')}
        >
          <CreditCard size={18} />
          <span>Card</span>
        </button>
        <button
          type="button"
          className={`method-btn ${selectedMethod === 'bank' ? 'active' : ''}`}
          onClick={() => setSelectedMethod('bank')}
        >
          <Building size={18} />
          <span>Bank</span>
        </button>
      </div>

      <button
        type="button"
        className="pay-btn pesapal-pay-btn"
        onClick={handlePesaPalPayment}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <><Loader2 size={20} className="spin" />Processing...</>
        ) : (
          <><Lock size={20} />Continue to PesaPal</>
        )}
      </button>
    </div>
  );
}

// Payment Method Selector Component
function PaymentMethodSelector({ 
  selected, 
  onSelect 
}: { 
  selected: PaymentMethod; 
  onSelect: (method: PaymentMethod) => void;
}) {
  return (
    <div className="payment-method-selector">
      <h3>Select Payment Method</h3>
      <div className="method-options">
        <button
          type="button"
          className={`method-option ${selected === 'stripe' ? 'selected' : ''}`}
          onClick={() => onSelect('stripe')}
        >
          <CreditCard size={24} />
          <div className="method-details">
            <span className="method-name">Credit / Debit Card</span>
            <span className="method-provider">Via Stripe</span>
          </div>
          {selected === 'stripe' && <Check size={20} className="check-icon" />}
        </button>

        <button
          type="button"
          className={`method-option ${selected === 'mpesa' ? 'selected' : ''}`}
          onClick={() => onSelect('mpesa')}
        >
          <Smartphone size={24} />
          <div className="method-details">
            <span className="method-name">M-Pesa</span>
            <span className="method-provider">Direct Payment</span>
          </div>
          {selected === 'mpesa' && <Check size={20} className="check-icon" />}
        </button>

        <button
          type="button"
          className={`method-option ${selected === 'pesapal' ? 'selected' : ''}`}
          onClick={() => onSelect('pesapal')}
        >
          <Building size={24} />
          <div className="method-details">
            <span className="method-name">PesaPal</span>
            <span className="method-provider">M-Pesa, Card, Bank</span>
          </div>
          {selected === 'pesapal' && <Check size={20} className="check-icon" />}
        </button>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('stripe');
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    countryCode: 'US', // Default to US
  });

  // Fetch shipping options when country changes
  const fetchShippingOptions = async (countryCode: string) => {
    if (!countryCode) return;

    setIsCalculatingShipping(true);
    try {
      // Transform cart items to the expected format
      const cartItems = items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: item.artListing?.price || 0,
      }));

      const response = await fetch('/api/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          countryCode,
          items: cartItems,
          subtotal,
        }),
      });
      const data = await response.json();

      if (data.success && data.data?.options) {
        // Transform options to our format (all USD)
        const options: ShippingOption[] = data.data.options.map((opt: any, index: number) => ({
          id: opt.courier?.toLowerCase().replace(/\s+/g, '-') || `option-${index}`,
          courier: opt.courier || 'ArtAfrik Shipping',
          service: opt.service || 'standard',
          estimatedDays: {
            min: parseInt(opt.estimatedDays?.split('-')[0]) || 5,
            max: parseInt(opt.estimatedDays?.split('-')[1]) || 10,
          },
          price: opt.totalUSD || 0,
          currency: 'USD',
          isAvailable: true,
          features: ['Tracking included', 'Insurance included'],
        }));

        setShippingOptions(options);
        // Select the first available option by default
        if (options.length > 0 && !selectedShipping) {
          setSelectedShipping(options[1] || options[0]); // Prefer standard (index 1)
        }
      }
    } catch (error) {
      console.error('Error fetching shipping options:', error);
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  // Calculate shipping when country changes
  useEffect(() => {
    if (shippingInfo.countryCode) {
      fetchShippingOptions(shippingInfo.countryCode);
    }
  }, [shippingInfo.countryCode, subtotal]);

  // Get current shipping cost (USD only)
  const shippingCost = selectedShipping 
    ? selectedShipping.price
    : (subtotal > 100 ? 0 : 15);
  
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  const handleSuccess = () => {
    clearCart();
    window.location.href = `/checkout/success?orderId=${orderId}`;
  };

  const initializePayment = async () => {
    try {
      const endpoint = paymentMethod === 'mpesa' ? '/api/payments/mpesa'
        : paymentMethod === 'pesapal' ? '/api/payments/pesapal'
        : '/api/payments';

      // Transform cart items for API
      const cartItems = items.map(item => ({
        artListingId: item.artListing?.id,
        title: item.artListing?.title,
        price: item.artListing?.price,
        quantity: item.quantity,
      }));

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartId: 'local',
          cartItems,
          shippingInfo: {
            ...shippingInfo,
            shippingOption: selectedShipping,
            shippingCost,
          },
          phoneNumber: shippingInfo.phone,
          paymentMethod,
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (paymentMethod === 'stripe' && data.data.clientSecret) {
          setClientSecret(data.data.clientSecret);
        }
        setOrderId(data.data.orderId);
      } else {
        toast.error(data.error || 'Failed to initialize checkout');
      }
    } catch (error) {
      console.error('Error initializing payment:', error);
      toast.error('Failed to initialize checkout');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
      return;
    }
    initializePayment();
  }, [items, router, paymentMethod, selectedShipping]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'country') {
      // Map country name to country code (simplified)
      const countryCodes: Record<string, string> = {
        'kenya': 'KE', 'nairobi': 'KE',
        'united states': 'US', 'usa': 'US', 'america': 'US',
        'united kingdom': 'GB', 'uk': 'GB', 'britain': 'GB',
        'canada': 'CA', 'australia': 'AU', 'germany': 'DE',
        'france': 'FR', 'south africa': 'ZA', 'nigeria': 'NG',
        'uganda': 'UG', 'tanzania': 'TZ', 'rwanda': 'RW',
      };
      const code = countryCodes[value.toLowerCase()] || value.toUpperCase().slice(0, 2);
      setShippingInfo((prev) => ({ ...prev, [name]: value, countryCode: code }));
    } else {
      setShippingInfo((prev) => ({ ...prev, [name]: value }));
    }
  };

  if (items.length === 0) {
    return (
      <MainLayout>
        <div className="checkout-page">
          <div className="loading-container">
            <Loader2 size={40} className="spin" />
            <p>Redirecting to cart...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="checkout-page">
          <div className="loading-container">
            <Loader2 size={40} className="spin" />
            <p>Preparing checkout...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="checkout-page">
        <div className="checkout-header">
          <Link href="/cart" className="back-link">
            <ArrowLeft size={20} />
            Back to Cart
          </Link>
          <h1>Checkout</h1>
        </div>

        <div className="checkout-layout">
          <div className="checkout-form-section">
            {/* Shipping Information */}
            <div className="form-section">
              <h2><Truck size={22} />Shipping Information</h2>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="name">Full Name</label>
                  <input type="text" id="name" name="name" value={shippingInfo.name} onChange={handleInputChange} placeholder="John Doe" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" value={shippingInfo.email} onChange={handleInputChange} placeholder="john@example.com" required />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input type="tel" id="phone" name="phone" value={shippingInfo.phone} onChange={handleInputChange} placeholder="+1 234 567 8900" required />
                </div>
                <div className="form-group full-width">
                  <label htmlFor="address">Address</label>
                  <input type="text" id="address" name="address" value={shippingInfo.address} onChange={handleInputChange} placeholder="123 Main St" required />
                </div>
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input type="text" id="city" name="city" value={shippingInfo.city} onChange={handleInputChange} placeholder="New York" required />
                </div>
                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <input type="text" id="country" name="country" value={shippingInfo.country} onChange={handleInputChange} placeholder="United States" required />
                </div>
              </div>
            </div>

            {/* Shipping Options */}
            <div className="form-section">
              <h2><Truck size={22} />Shipping Method</h2>
              {isCalculatingShipping ? (
                <div className="loading-shipping">
                  <Loader2 size={24} className="spin" />
                  <span>Calculating shipping options...</span>
                </div>
              ) : shippingOptions.length > 0 ? (
                <div className="shipping-options">
                  {shippingOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className={`shipping-option ${selectedShipping?.id === option.id ? 'selected' : ''}`}
                      onClick={() => setSelectedShipping(option)}
                    >
                      <div className="option-radio">
                        <div className="radio-circle">
                          {selectedShipping?.id === option.id && <div className="radio-dot" />}
                        </div>
                      </div>
                      <div className="option-details">
                        <div className="option-header">
                          <span className="option-courier">{option.courier}</span>
                          <span className="option-price">
                            {option.price === 0 ? 'FREE' : `$${option.price.toFixed(2)}`}
                          </span>
                        </div>
                        <div className="option-meta">
                          <span className="option-delivery">
                            <Clock size={14} />
                            {option.estimatedDays.min}-{option.estimatedDays.max} business days
                          </span>
                        </div>
                        <div className="option-features">
                          {option.features.map((feature, idx) => (
                            <span key={idx} className="feature-tag">{feature}</span>
                          ))}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="no-shipping">
                  <p>Enter your country above to see available shipping options</p>
                </div>
              )}
            </div>

            {/* Payment Method Selection */}
            <div className="form-section">
              <h2><CreditCard size={22} />Payment Method</h2>
              <PaymentMethodSelector selected={paymentMethod} onSelect={setPaymentMethod} />
            </div>

            {/* Payment Form based on selection */}
            <div className="form-section payment-form-section">
              {paymentMethod === 'stripe' && clientSecret && stripePromise ? (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <StripeCheckoutForm clientSecret={clientSecret} orderId={orderId || ''} />
                </Elements>
              ) : paymentMethod === 'stripe' ? (
                <div className="dev-checkout-form">
                  <div className="dev-mode-notice">
                    <div className="dev-badge">🔧 Development Mode</div>
                    <p>Stripe not configured. Switch to M-Pesa or PesaPal for testing.</p>
                  </div>
                  <button className="pay-btn dev-pay-btn" onClick={handleSuccess}>Simulate Card Payment</button>
                </div>
              ) : paymentMethod === 'mpesa' ? (
                <MpesaCheckoutForm orderId={orderId || ''} onSuccess={handleSuccess} />
              ) : (
                <PesaPalCheckoutForm orderId={orderId || ''} onSuccess={handleSuccess} />
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-summary-section">
            <div className="summary-card">
              <h2>Order Summary</h2>
              <div className="summary-items">
                {items.map((item) => {
                  const artwork = item.artListing;
                  if (!artwork) return null;
                  const imageUrl = artwork.images?.[0] || '/placeholder.jpg';
                  return (
                    <div key={item.id} className="summary-item">
                      <div className="item-image">
                        <Image src={imageUrl} alt={artwork.title} width={60} height={60} />
                        <span className="item-quantity">{item.quantity}</span>
                      </div>
                      <div className="item-info">
                        <p className="item-title">{artwork.title}</p>
                        <p className="item-price">${(artwork.price || 0).toFixed(2)}</p>
                      </div>
                      <p className="item-subtotal">${((artwork.price || 0) * item.quantity).toFixed(2)}</p>
                    </div>
                  );
                })}
              </div>
              <div className="summary-totals">
                <div className="summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? <span className="free">FREE</span> : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="summary-row"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
                <div className="summary-divider"></div>
                <div className="summary-row total"><span>Total</span><span>${total.toFixed(2)}</span></div>
              </div>
              <div className="secure-badge">
                <Lock size={16} />Secure Checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

