// M-Pesa Payment API Route
// Implements M-Pesa STK Push for mobile payments

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/prisma';

// M-Pesa Configuration
const MPESA_ENV = process.env.MPESA_ENVIRONMENT || 'sandbox'; // 'sandbox' or 'live'
const MPESA_BASE_URL = MPESA_ENV === 'live'
  ? 'https://api.safaricom.co.ke'
  : 'https://sandbox.safaricom.co.ke';

const SHORTCODE = process.env.MPESA_SHORTCODE;
const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const PASSKEY = process.env.MPESA_PASSKEY;

// Generate M-Pesa access token
async function getAccessToken(): Promise<string | null> {
  try {
    if (!CONSUMER_KEY || !CONSUMER_SECRET) {
      return null;
    }

    const credentials = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

    const response = await fetch(`${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: {
        'Authorization': `Basic ${credentials}`,
      },
    });

    if (!response.ok) {
      console.error('Failed to get M-Pesa access token');
      return null;
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting M-Pesa access token:', error);
    return null;
  }
}

// Generate STK push password
function generatePassword(): string {
  const timestamp = new Date().toISOString().replace(/[-:TZ]/g, '').substring(0, 14);
  const shortcode = SHORTCODE || '';
  const passkey = PASSKEY || '';
  return Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
}

// POST /api/payments/mpesa - Send STK Push
export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { cartId, shippingInfo, phoneNumber } = body;

    if (!cartId || !phoneNumber) {
      return NextResponse.json(
        { success: false, error: 'Cart ID and phone number are required' },
        { status: 400 }
      );
    }

    // Format phone number (remove + and ensure starts with 254)
    let formattedPhone = phoneNumber.replace(/\D/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.substring(1);
    } else if (formattedPhone.startsWith('7')) {
      formattedPhone = '254' + formattedPhone;
    } else if (!formattedPhone.startsWith('254')) {
      formattedPhone = '254' + formattedPhone;
    }

    // Get user's cart
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            artListing: true,
          },
        },
      },
    });

    if (!cart || cart.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Cart not found' },
        { status: 404 }
      );
    }

    if (cart.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => {
      return sum + (item.artListing.price || 0) * item.quantity;
    }, 0);

    const shippingCost = subtotal > 500 ? 0 : 25;
    const tax = subtotal * 0.08;
    const total = Math.ceil(subtotal + shippingCost + tax); // M-Pesa needs integer amount

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { clerkId: userId },
      });
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order in database
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        orderNumber,
        subtotal,
        shippingCost,
        tax,
        total,
        shippingName: shippingInfo?.name,
        shippingEmail: shippingInfo?.email,
        shippingPhone: phoneNumber,
        shippingAddress: shippingInfo?.address,
        shippingCity: shippingInfo?.city,
        shippingCountry: shippingInfo?.country,
        paymentMethod: 'mpesa',
        notes: body.notes,
        items: {
          create: cart.items.map((item) => ({
            artListingId: item.artListingId,
            title: item.artListing.title,
            price: item.artListing.price,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Check if M-Pesa is configured
    const accessToken = await getAccessToken();

    if (!accessToken) {
      // Development mode - simulate STK push
      console.log('⚠️ M-Pesa not configured. Running in simulation mode.');

      // Clear cart
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return NextResponse.json({
        success: true,
        data: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          paymentMethod: 'mpesa',
          isDevelopment: true,
          message: 'M-Pesa STK push simulated. In production, you would receive an SMS.',
          simulation: {
            phoneNumber: formattedPhone,
            amount: total,
            message: `STK push sent to ${formattedPhone} for KES ${total}`,
          },
        },
      });
    }

    // Send STK Push
    const timestamp = new Date().toISOString().replace(/[-:TZ]/g, '').substring(0, 14);
    const password = generatePassword();

    const stkPushRequest = {
      BusinessShortCode: SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: total,
      PartyA: formattedPhone,
      PartyB: SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/payments/mpesa/callback`,
      AccountReference: orderNumber,
      TransactionDesc: `ArtAfrik Order ${orderNumber}`,
    };

    const response = await fetch(`${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stkPushRequest),
    });

    const responseData = await response.json();

    if (response.ok && responseData.ResponseCode === '0') {
      // Clear cart
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return NextResponse.json({
        success: true,
        data: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          paymentMethod: 'mpesa',
          checkoutRequestId: responseData.CheckoutRequestID,
          merchantRequestId: responseData.MerchantRequestID,
          message: 'STK push sent successfully. Please check your phone.',
        },
      });
    } else {
      // Handle error
      console.error('M-Pesa STK push error:', responseData);

      return NextResponse.json(
        { success: false, error: responseData.ResponseDescription || 'Failed to send STK push' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error sending M-Pesa STK push:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to initiate payment' },
      { status: 500 }
    );
  }
}

// GET /api/payments/mpesa - Check payment status
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');
    const checkoutRequestId = searchParams.get('checkoutRequestId');

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Get order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        shipment: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // If no checkout request ID, return current status
    if (!checkoutRequestId) {
      return NextResponse.json({
        success: true,
        data: {
          order,
          paymentStatus: order.paymentStatus,
          isDevelopment: !CONSUMER_KEY,
        },
      });
    }

    // Check status with M-Pesa
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json({
        success: true,
        data: {
          order,
          paymentStatus: order.paymentStatus,
          isDevelopment: true,
        },
      });
    }

    // Query transaction status
    const timestamp = new Date().toISOString().replace(/[-:TZ]/g, '').substring(0, 14);
    const password = generatePassword();

    const queryRequest = {
      BusinessShortCode: SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId,
    };

    const response = await fetch(`${MPESA_BASE_URL}/mpesa/stkquery/v1/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(queryRequest),
    });

    const responseData = await response.json();

    if (response.ok && responseData.ResponseCode === '0') {
      // Update order status
      const resultCode = parseInt(responseData.ResultCode);
      
      if (resultCode === 0) {
        // Payment successful
        await prisma.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: 'COMPLETED',
            status: 'CONFIRMED',
            mpesaTransactionId: responseData.MpesaReceiptNumber,
          },
        });

        return NextResponse.json({
          success: true,
          data: {
            order: { ...order, paymentStatus: 'COMPLETED', mpesaTransactionId: responseData.MpesaReceiptNumber },
            paymentStatus: 'COMPLETED',
            mpesaReceiptNumber: responseData.MpesaReceiptNumber,
          },
        });
      } else {
        // Payment failed
        await prisma.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: 'FAILED',
            status: 'CANCELLED',
          },
        });

        return NextResponse.json({
          success: true,
          data: {
            order: { ...order, paymentStatus: 'FAILED' },
            paymentStatus: 'FAILED',
            resultCode,
            resultDesc: responseData.ResultDesc,
          },
        });
      }
    } else {
      return NextResponse.json(
        { success: false, error: responseData.ResponseDescription || 'Failed to check payment status' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error checking M-Pesa payment status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check payment status' },
      { status: 500 }
    );
  }
}

