<!-- # PesaPal & Stripe Payment Integration Plan

## Goal: Implement dual payment system with PesaPal + Stripe + M-Pesa

---

## ✅ Phase 1: Backend - PesaPal API Integration

### ✅ 1.1 Create PesaPal API Route
- [x] `app/api/payments/pesapal/route.ts` - Main PesaPal integration
- [x] Register order with PesaPal
- [x] Handle payment status queries
- [x] Development mode fallback

### ✅ 1.2 Create M-Pesa API Route
- [x] `app/api/payments/mpesa/route.ts` - M-Pesa STK Push
- [x] Send STK push requests
- [x] Check payment status
- [x] Development mode simulation

### ✅ 1.3 Create M-Pesa Callback Route
- [x] `app/api/payments/mpesa/callback/route.ts` - Handle STK callbacks
- [x] Process payment results
- [x] Update order status

### ✅ 1.4 Update Stripe Payment API
- [x] `app/api/payments/route.ts` - Development mode support
- [x] Graceful fallback when Stripe keys missing

---

## ✅ Phase 2: Frontend - Checkout Page Updates

### ✅ 2.1 Payment Method Selection UI
- [x] Add payment method toggle (Stripe vs M-Pesa vs PesaPal)
- [x] Show different forms based on selection
- [x] Visual design for each option

### ✅ 2.2 M-Pesa Checkout Form
- [x] Phone number input
- [x] STK push status display
- [x] Payment polling for confirmation

### ✅ 2.3 PesaPal Checkout Form
- [x] Payment method selection (M-Pesa/Card/Bank)
- [x] Redirect handling

### ✅ 2.4 Updated CSS Styles
- [x] Payment method selector styles
- [x] M-Pesa form styling
- [x] PesaPal form styling
- [x] Status message styling

---

## ⏳ Phase 3: Environment Configuration

### 3.1 Add Environment Variables
```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# PesaPal
PESAPAL_CONSUMER_KEY=your_key
PESAPAL_CONSUMER_SECRET=your_secret
PESAPAL_ENVIRONMENT=sandbox # or 'live'
PESAPAL_IPN_URL=https://yourdomain.com/api/payments/pesapal/ipn

# M-Pesa (via Safaricom)
MPESA_ENVIRONMENT=sandbox # or 'live'
MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
MPESA_SHORTCODE=your_shortcode
MPESA_PASSKEY=your_passkey
```

---

## Payment Flow

### Stripe Flow:
1. User selects Credit Card → Enter card details → Pay
2. Payment processed → Order created → Success page

### M-Pesa Flow (Direct):
1. User enters phone number → Send STK push
2. User receives SMS → Enters PIN
3. Payment confirmed → Order created → Success page

### PesaPal Flow:
1. User selects PesaPal → Choose payment method (M-Pesa/Card/Bank)
2. Redirect to PesaPal → Complete payment
3. Payment confirmed → Order created → Success page

---

## 🎉 What's Now Available

### Backend APIs:
- `/api/payments` - Stripe payments
- `/api/payments/pesapal` - PesaPal payments
- `/api/payments/mpesa` - M-Pesa STK push
- `/api/payments/mpesa/callback` - M-Pesa callback handler

### Frontend Features:
- Payment method selector at checkout
- M-Pesa form with phone input
- PesaPal form with multiple options
- Development mode for testing without API keys
- Visual status indicators for payment progress

---

## 📅 Progress

**Status:** ✅ Payment Integration Complete
**Backend APIs:** 4 routes implemented
**Frontend Components:** Checkout with payment selector
**CSS:** Full styling for all payment methods

---

*Last Updated: 2024*
 -->
