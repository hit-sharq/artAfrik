// PesaPal Payment API Route
// Supports M-Pesa, Card Payments, and Bank Transfers via PesaPal

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

// PesaPal Configuration
const PESAPAL_BASE_URL = process.env.PESAPAL_ENVIRONMENT === 'live' 
  ? 'https://www.pesapal.com/API/PostPesapalDirectOrderV4' 
  : 'https://pesapal.com/API/PostPesapalDirectOrderV4';

const PESAPAL_QUERY_URL = process.env.PESAPAL_ENVIRONMENT === 'live'
  ? 'https://www.pesapal.com/API/QueryPaymentDetails'
  : 'https://pesapal.com/API/QueryPaymentDetails';

// Generate PesaPal signature
function generateSignature(consumerKey: string, consumerSecret: string): string {
  const token = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  return `Basic ${token}`;
}

// Generate unique order ID for PesaPal
function generatePesaPalOrderId(orderNumber: string): string {
  return `PESA-${orderNumber}-${Date.now()}`;
}

// Interface for PesaPal request
interface PesaPalPaymentRequest {
  currency: string;
  amount: number;
  description: string;
  callbackUrl: string;
  notificationUrl: string;
  reference: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  lineItems: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
}

// POST /api/payments/pesapal - Create PesaPal payment
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
    const { cartId, shippingInfo, paymentMethod, phoneNumber } = body;

    // Validate required fields
    if (!cartId) {
      return NextResponse.json(
        { success: false, error: 'Cart ID is required' },
        { status: 400 }
      );
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
    const total = subtotal + shippingCost + tax;

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

    // Generate PesaPal order ID
    const pesapalOrderId = generatePesaPalOrderId(orderNumber);

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
        shippingPhone: shippingInfo?.phone || phoneNumber,
        shippingAddress: shippingInfo?.address,
        shippingCity: shippingInfo?.city,
        shippingCountry: shippingInfo?.country,
        paymentMethod: 'pesapal',
        pesapalOrderId,
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

    // Check if PesaPal is configured
    const pesapalKey = process.env.PESAPAL_CONSUMER_KEY;
    const pesapalSecret = process.env.PESAPAL_CONSUMER_SECRET;

    if (!pesapalKey || !pesapalSecret) {
      // Development mode - return mock response
      console.log('⚠️ PesaPal not configured. Running in development mode.');

      // Clear cart
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return NextResponse.json({
        success: true,
        data: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          paymentMethod: paymentMethod || 'mpesa',
          isDevelopment: true,
          message: 'Development mode: PesaPal payment simulated',
          // For M-Pesa, simulate STK push
          mpesaSimulation: paymentMethod === 'mpesa' ? {
            phoneNumber: phoneNumber,
            message: 'M-Pesa STK push simulated. Enter PIN to complete payment.',
          } : null,
        },
      });
    }

    // Prepare line items for PesaPal
    const lineItems = cart.items.map((item) => ({
      name: item.artListing.title.substring(0, 100),
      price: item.artListing.price,
      quantity: item.quantity,
    }));

    // Add shipping as line item if applicable
    if (shippingCost > 0) {
      lineItems.push({
        name: 'Shipping',
        price: shippingCost,
        quantity: 1,
      });
    }

    // Prepare PesaPal request
    const pesapalRequest: PesaPalPaymentRequest = {
      currency: 'USD',
      amount: total,
      description: `ArtAfrik Order ${orderNumber}`,
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/success?orderId=${order.id}&method=pesapal`,
      notificationUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/payments/pesapal/ipn`,
      reference: generatePesaPalOrderId(orderNumber),
      firstName: shippingInfo?.name?.split(' ')[0] || '',
      lastName: shippingInfo?.name?.split(' ').slice(1).join(' ') || '',
      email: shippingInfo?.email || '',
      phoneNumber: phoneNumber || shippingInfo?.phone || '',
      countryCode: shippingInfo?.country?.substring(0, 2).toUpperCase() || 'US',
      lineItems,
    };

    // Prepare XML request for PesaPal
    const xmlRequest = `<?xml version="1.0" encoding="utf-8"?>
<PesapalDirectOrderInfo xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"
  Currency="${pesapalRequest.currency}"
  Amount="${pesapalRequest.amount}"
  Description="${pesapalRequest.description}"
  Type="MERCHANT"
  Reference="${pesapalRequest.reference}"
  FirstName="${pesapalRequest.firstName}"
  LastName="${pesapalRequest.lastName}"
  Email="${pesapalRequest.email}"
  PhoneNumber="${pesapalRequest.phoneNumber}"
  CountryCode="${pesapalRequest.countryCode}"
  CallbackUrl="${pesapalRequest.callbackUrl}"
  NotificationUrl="${pesapalRequest.notificationUrl}"
  PostPhoneNumber="${pesapalRequest.phoneNumber}"
  PostAddressCountryCode="${pesapalRequest.countryCode}">
</PesapalDirectOrderInfo>`;

    // Generate signature
    const signature = generateSignature(pesapalKey, pesapalSecret);

    // Make request to PesaPal
    const response = await fetch(PESAPAL_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml',
        'Authorization': signature,
        'Accept': 'application/xml',
      },
      body: xmlRequest,
    });

    const responseText = await response.text();

    // Parse PesaPal response
    const pesapalResponse = parsePesaPalResponse(responseText);

    if (pesapalResponse.merchant_reference === pesapalRequest.reference) {
      // Clear the cart
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return NextResponse.json({
        success: true,
        data: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          paymentMethod: 'pesapal',
          pesapalOrderId: pesapalRequest.reference,
          redirectUrl: pesapalResponse.redirect_url,
          trackingId: pesapalResponse.tracking_id,
        },
      });
    } else {
      // Handle error
      return NextResponse.json(
        { success: false, error: pesapalResponse.error || 'Failed to create PesaPal payment' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating PesaPal payment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}

// GET /api/payments/pesapal - Check payment status
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');
    const trackingId = searchParams.get('trackingId');

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

    // Check if PesaPal is configured
    const pesapalKey = process.env.PESAPAL_CONSUMER_KEY;
    const pesapalSecret = process.env.PESAPAL_CONSUMER_SECRET;

    if (!pesapalKey || !pesapalSecret || !trackingId) {
      // Development mode - return order as is
      return NextResponse.json({
        success: true,
        data: {
          order,
          paymentStatus: order.paymentStatus,
          isDevelopment: true,
        },
      });
    }

    // Query PesaPal for payment status
    const signature = generateSignature(pesapalKey, pesapalSecret);

    const queryUrl = `${PESAPAL_QUERY_URL}?pesapal_merchant_reference=${order.orderNumber}&pesapal_transaction_tracking_id=${trackingId}`;

    const response = await fetch(queryUrl, {
      headers: {
        'Authorization': signature,
        'Accept': 'application/xml',
      },
    });

    const responseText = await response.text();
    const paymentStatus = parsePesaPalStatus(responseText);

    // Update order if status changed
    if (paymentStatus && paymentStatus !== order.paymentStatus) {
      const updateData: any = { paymentStatus };

      if (paymentStatus === 'COMPLETED') {
        updateData.status = 'CONFIRMED';
      } else if (paymentStatus === 'FAILED') {
        updateData.status = 'CANCELLED';
      }

      await prisma.order.update({
        where: { id: order.id },
        data: updateData,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        order,
        paymentStatus: paymentStatus || order.paymentStatus,
        pesapalStatus: paymentStatus,
      },
    });
  } catch (error) {
    console.error('Error checking PesaPal payment status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check payment status' },
      { status: 500 }
    );
  }
}

// Helper function to parse PesaPal response
function parsePesaPalResponse(xmlResponse: string): any {
  try {
    // Check for error response
    if (xmlResponse.includes('<Response>')) {
      const errorMatch = xmlResponse.match(/<Error>(.*?)<\/Error>/);
      const refMatch = xmlResponse.match(/<Reference>(.*?)<\/Reference>/);
      const trackingMatch = xmlResponse.match(/<TrackingId>(.*?)<\/TrackingId>/);
      const urlMatch = xmlResponse.match(/<Url>(.*?)<\/Url>/);

      return {
        error: errorMatch ? errorMatch[1] : 'Unknown error',
        merchant_reference: refMatch ? refMatch[1] : '',
        tracking_id: trackingMatch ? trackingMatch[1] : '',
        redirect_url: urlMatch ? urlMatch[1] : '',
      };
    }

    // Parse successful response
    const redirectMatch = xmlResponse.match(/<RedirectUrl>(.*?)<\/RedirectUrl>/);
    const refMatch = xmlResponse.match(/<OrderMerchantReference>(.*?)<\/OrderMerchantReference>/);
    const trackingMatch = xmlResponse.match(/<PesapalTrackingId>(.*?)<\/PesapalTrackingId>/);

    return {
      redirect_url: redirectMatch ? redirectMatch[1] : '',
      merchant_reference: refMatch ? refMatch[1] : '',
      tracking_id: trackingMatch ? trackingMatch[1] : '',
    };
  } catch (error) {
    console.error('Error parsing PesaPal response:', error);
    return { error: 'Failed to parse response' };
  }
}

// Helper function to parse PesaPal payment status
function parsePesaPalStatus(xmlResponse: string): string | null {
  try {
    const statusMatch = xmlResponse.match(/<Status>(.*?)<\/Status>/);
    const paymentMethodMatch = xmlResponse.match(/<PaymentMethod>(.*?)<\/PaymentMethod>/);
    const transIdMatch = xmlResponse.match(/<TransactionId>(.*?)<\/TransactionId>/);

    if (statusMatch) {
      const status = statusMatch[1].toUpperCase();
      
      // Map PesaPal status to our status
      if (status === 'COMPLETED' || status === 'PAID') {
        return 'COMPLETED';
      } else if (status === 'PENDING') {
        return 'PENDING';
      } else if (status === 'FAILED' || status === 'INVALID') {
        return 'FAILED';
      }
    }

    return null;
  } catch (error) {
    console.error('Error parsing PesaPal status:', error);
    return null;
  }
}

