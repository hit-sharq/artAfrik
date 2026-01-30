<!-- # Payment Integration Documentation

ArtAfrik supports **three payment methods** for purchasing authentic African art and handcrafted goods:

1. **Stripe** - International credit/debit card payments
2. **M-Pesa** - Mobile money payments (Kenya)
3. **PesaPal** - Multi-payment gateway (Kenya) supporting M-Pesa, cards, and bank transfers

---

## 🌍 Payment Methods Overview

| Payment Method | Currency | Region | Type | Status |
|----------------|----------|--------|------|--------|
| **Stripe** | USD | Worldwide | Credit/Debit Cards | ✅ Active |
| **M-Pesa** | KES | Kenya | Mobile Money | ✅ Integrated |
| **PesaPal** | USD/KES | Kenya/Africa | M-Pesa, Cards, Bank | ✅ Integrated |

---

## 💳 Stripe Integration

### Overview
Stripe is used for international payments supporting all major credit and debit cards (Visa, Mastercard, American Express, etc.).

### API Endpoints
- **Create Payment Intent**: `POST /api/payments`
- **Check Payment Status**: `GET /api/payments?orderId=xxx`

### Payment Flow
```
1. User selects Stripe as payment method
2. Backend creates a PaymentIntent with the order total
3. Frontend displays Stripe Elements for card input
4. User enters card details and completes payment
5. Stripe confirms payment and sends webhook
6. Order status updated to CONFIRMED
7. Cart cleared, confirmation email sent
```

### Environment Variables Required
```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Key Features
- **Automatic cart clearing** after successful payment
- **Email receipt** sent to customer
- **Order tracking** with real-time status updates
- **Refund support** via Stripe Dashboard

### Development Mode
If `STRIPE_SECRET_KEY` is not set, the system runs in development mode:
- Simulates payment flow
- Creates orders with mock payment intents
- Allows testing without actual charges

---

## 📱 M-Pesa Integration

### Overview
M-Pesa is Kenya's leading mobile money service, allowing users to pay via STK Push (popup on phone) or by paying to a Paybill number.

### API Endpoints
- **Initiate STK Push**: `POST /api/payments/mpesa`
- **Check Payment Status**: `GET /api/payments/mpesa?orderId=xxx&checkoutRequestId=xxx`
- **Handle Callback**: `POST /api/payments/mpesa/callback`

### Payment Flow (STK Push)
```
1. User selects M-Pesa as payment method
2. User enters phone number (254XXXXXXXXX format)
3. Backend creates order and initiates STK Push
4. User receives pop-up on their phone
5. User enters PIN to authorize payment
6. M-Pesa processes payment and sends callback
7. Backend receives callback and updates order status
8. Order status updated to CONFIRMED
9. Confirmation SMS/email sent
```

### Payment Flow (Paybill)
```
1. User selects M-Pesa as payment method
2. User chooses "Paybill" option
3. System displays Paybill: 522533, Account: 7771828 (KCB Bank)
4. User goes to M-Pesa, selects "Paybill"
5. Enters paybill number and account number
6. Enters amount and PIN
7. Backend monitors payment and updates order
```

### Environment Variables Required
```env
MPESA_ENVIRONMENT=sandbox  # or 'live'
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_PASSKEY=your_passkey
MPESA_SHORTCODE=522533  # Paybill number
MPESA_ACCOUNT_NUMBER=7771828  # Account number
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### M-Pesa Configuration
- **Paybill Number**: 522533
- **Account Number**: 7771828
- **Bank**: KCB (Kenya Commercial Bank)
- **API Environment**: Sandbox (testing) or Live (production)

### Phone Number Format
Phone numbers must be in one of these formats:
- `254XXXXXXXXX` (international format)
- `07XXXXXXXX` (Kenyan mobile format starting with 7)
- `+254XXXXXXXXX` (with country code)

### Callback Processing
The callback endpoint (`/api/payments/mpesa/callback`) receives payment results:
- **ResultCode 0**: Payment successful - updates order to COMPLETED
- **Other codes**: Payment failed - updates order to FAILED

### Development Mode
If M-Pesa credentials are not configured:
- Simulates STK push flow
- Returns paybill information for manual payment testing
- Creates orders in mock mode

---

## 🏦 PesaPal Integration

### Overview
PesaPal is a comprehensive East African payment gateway supporting:
- M-Pesa (mobile money)
- Credit/Debit Cards (Visa, Mastercard)
- Bank Transfers (Equity Bank, KCB, etc.)
- Airtel Money

### API Endpoints
- **Create Payment**: `POST /api/payments/pesapal`
- **Check Payment Status**: `GET /api/payments/pesapal?orderId=xxx&trackingId=xxx`
- **IPN Handler**: `POST /api/payments/pesapal/ipn`

### Payment Flow
```
1. User selects PesaPal as payment method
2. User chooses specific payment method (M-Pesa, Card, Bank)
3. Backend creates order and PesaPal payment request
4. User redirected to PesaPal checkout page
5. User completes payment on PesaPal
6. PesaPal sends IPN (Instant Payment Notification)
7. Backend receives IPN and updates order status
8. User redirected to success page
```

### Environment Variables Required
```env
PESAPAL_ENVIRONMENT=sandbox  # or 'live'
PESAPAL_CONSUMER_KEY=your_consumer_key
PESAPAL_CONSUMER_SECRET=your_consumer_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### IPN (Instant Payment Notification)
PesaPal sends real-time payment status updates via IPN:
- Payment initiated
- Payment pending
- Payment completed
- Payment failed

### Supported Payment Methods
| Method | Type | Notes |
|--------|------|-------|
| M-Pesa | Mobile Money | STK Push or Paybill |
| Visa/Mastercard | Credit/Debit Card | 3D Secure enabled |
| Equity 360 | Bank Transfer | Instant confirmation |
| Airtel Money | Mobile Money | Kenya only |

### Development Mode
If PesaPal credentials are not configured:
- Simulates payment flow
- Returns mock payment response
- Allows full checkout testing

---

## 💰 Order Total Calculation

All payment methods use the same pricing formula:

```
Subtotal = Sum of all item prices × quantities
Shipping = KES 0 if subtotal > 500, otherwise KES 25
Tax = Subtotal × 8%
Total = Subtotal + Shipping + Tax
```

### Example Calculation
```
Item 1: KES 200 × 1 = KES 200
Item 2: KES 150 × 2 = KES 300
Subtotal: KES 500
Shipping: KES 0 (subtotal > 500)
Tax: KES 500 × 0.08 = KES 40
Total: KES 540
```

---

## 📊 Order Status Flow

### Successful Payment
```
PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED
```

### Payment Status States
| Status | Description |
|--------|-------------|
| `PENDING` | Order created, awaiting payment |
| `PROCESSING` | Payment received, preparing order |
| `COMPLETED` | Payment confirmed successfully |
| `FAILED` | Payment was declined or failed |
| `REFUNDED` | Payment was refunded |

### Order Status States
| Status | Description |
|--------|-------------|
| `PENDING` | Order created |
| `CONFIRMED` | Payment received |
| `PROCESSING` | Artisan preparing item |
| `SHIPPED` | Item dispatched |
| `DELIVERED` | Item received by customer |
| `CANCELLED` | Order cancelled |
| `REFUNDED` | Refund processed |

---

## 🔧 Database Schema

### Order Model
```prisma
model Order {
  id                    String        @id @default(cuid())
  orderNumber           String        @unique
  userId                String
  status                OrderStatus   @default(PENDING)
  paymentStatus         PaymentStatus @default(PENDING)
  
  // Payment Method Specific
  stripePaymentIntentId String?
  mpesaTransactionId    String?
  pesapalTransactionId  String?
  pesapalOrderId        String?
  
  // Amounts
  subtotal              Float
  shippingCost          Float         @default(0)
  tax                   Float         @default(0)
  total                 Float
  
  // Shipping
  shippingName    String?
  shippingEmail   String?
  shippingPhone   String?
  shippingAddress String?
  shippingCity    String?
  shippingCountry String?
  
  items    OrderItem[]
  shipment Shipment?
}
```

---

## 🔐 Security Considerations

### Clerk Authentication
- All payment endpoints require valid Clerk authentication
- Users must be signed in to create orders
- Orders are linked to user accounts

### Data Validation
- Phone numbers validated before M-Pesa STK push
- Email addresses validated for Stripe receipts
- Cart items validated to prevent price manipulation

### Payment Verification
- Stripe: Server-side payment intent verification
- M-Pesa: Callback signature validation
- PesaPal: IPN signature verification

### Environment Variables
Never commit `.env` files with real credentials:
```env
# ✅ Correct - use env vars
STRIPE_SECRET_KEY=sk_live_...

# ❌ Wrong - never commit this
STRIPE_SECRET_KEY=sk_live_abc123xyz789
```

---

## 🧪 Testing Payments

### Stripe Test Cards
| Card Number | Result |
|-------------|--------|
| 4242 4242 4242 4242 | Success |
| 4000 0000 0000 9995 | Decline |
| 4000 0000 0000 3220 | 3D Secure |

### M-Pesa Sandbox
1. Use test phone number: `254700000000`
2. Check M-Pesa simulator for payment prompts
3. Use PIN: `1234`

### PesaPal Sandbox
1. Use test credentials from PesaPal dashboard
2. Select "Test Card" for card payments
3. Use provided test phone numbers

---

## 📝 API Reference

### Create Payment Intent (Stripe)
```typescript
POST /api/payments
Content-Type: application/json

{
  "cartId": "cart_xxx",
  "cartItems": [...],  // or use cartId
  "shippingInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "254700000000",
    "address": "123 Main St",
    "city": "Nairobi",
    "country": "Kenya"
  }
}
```

### Initiate M-Pesa Payment
```typescript
POST /api/payments/mpesa
Content-Type: application/json

{
  "cartId": "cart_xxx",
  "phoneNumber": "254700000000",
  "shippingInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "address": "123 Main St",
    "city": "Nairobi",
    "country": "Kenya"
  }
}
```

### Check Payment Status
```typescript
GET /api/payments?orderId=order_xxx
GET /api/payments/mpesa?orderId=order_xxx&checkoutRequestId=xxx
GET /api/payments/pesapal?orderId=order_xxx&trackingId=xxx
```

---

## 🛠️ Troubleshooting

### Common Issues

#### Payment Not Processing
1. Check environment variables are set
2. Verify API keys are valid
3. Check order total doesn't exceed limits
4. Ensure user has valid shipping address

#### M-Pesa STK Push Not Received
1. Phone number format incorrect
2. Phone not registered for M-Pesa
3. Insufficient balance
4. Callback URL not accessible

#### Stripe Card Declined
1. Card expired
2. Insufficient funds
3. Bank restrictions
4. Try different card

### Debug Mode
Enable debug logging by checking server logs:
```
✅ Stripe: Payment intent created
✅ M-Pesa: STK push sent
✅ PesaPal: Payment initiated
```

---

## 📚 Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [M-Pesa API Documentation](https://developer.safaricom.co.ke)
- [PesaPal Developer Portal](https://developer.pesapal.com)
- [Clerk Authentication](https://clerk.com/docs)

---

## 🔗 Related Files

- `/app/api/payments/route.ts` - Stripe payment endpoints
- `/app/api/payments/mpesa/route.ts` - M-Pesa endpoints
- `/app/api/payments/mpesa/callback/route.ts` - M-Pesa callback
- `/app/api/payments/pesapal/route.ts` - PesaPal endpoints
- `/app/api/payments/pesapal/ipn/route.ts` - PesaPal IPN handler
- `/prisma/schema.prisma` - Database models
- `/app/checkout/page.tsx` - Checkout UI
 -->
