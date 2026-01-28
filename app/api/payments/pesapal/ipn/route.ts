// PesaPal Instant Payment Notification (IPN) Handler
// This endpoint receives payment status updates from PesaPal

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

// PesaPal IPN signature verification
function verifyIpnSignature(
  pesapalTrackingId: string,
  pesapalMerchantReference: string,
  signature: string,
  consumerKey: string,
  consumerSecret: string
): boolean {
  // Generate the string to sign
  const stringToSign = `${pesapalTrackingId}${pesapalMerchantReference}`;
  
  // Generate expected signature
  const hmac = crypto.createHmac('sha256', consumerSecret);
  hmac.update(stringToSign);
  const expectedSignature = hmac.digest('base64');
  
  return signature === expectedSignature;
}

// POST /api/payments/pesapal/ipn - Handle PesaPal IPN
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const { 
      pesapal_transaction_tracking_id,
      pesapal_merchant_reference,
      pesapal_notification_type,
      status,
      payment_method,
      transaction_amount,
      currency,
    } = body;

    console.log('PesaPal IPN received:', {
      trackingId: pesapal_transaction_tracking_id,
      merchantRef: pesapal_merchant_reference,
      status,
    });

    // Validate required fields
    if (!pesapal_transaction_tracking_id || !pesapal_merchant_reference) {
      console.error('Missing required PesaPal IPN fields');
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find order by order number (PesaPal merchant reference format: PESA-ORD-...)
    const order = await prisma.order.findFirst({
      where: {
        orderNumber: {
          contains: pesapal_merchant_reference.split('-')[1] || '',
        },
      },
    });

    if (!order) {
      console.error('Order not found for PesaPal IPN:', pesapal_merchant_reference);
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Map PesaPal status to our status
    let paymentStatus: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' = 'PENDING';
    let orderStatus: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED' = 'PENDING';

    if (status) {
      const statusLower = status.toUpperCase();
      
      if (statusLower === 'COMPLETED' || statusLower === 'PAID') {
        paymentStatus = 'COMPLETED';
        orderStatus = 'CONFIRMED';
      } else if (statusLower === 'PENDING') {
        paymentStatus = 'PENDING';
        orderStatus = 'PENDING';
      } else if (statusLower === 'FAILED' || statusLower === 'INVALID') {
        paymentStatus = 'FAILED';
        orderStatus = 'CANCELLED';
      } else if (statusLower === 'CANCELLED') {
        paymentStatus = 'FAILED';
        orderStatus = 'CANCELLED';
      }
    }

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus,
        status: orderStatus,
        pesapalTransactionId: pesapal_transaction_tracking_id,
        paymentMethod: payment_method || 'pesapal',
        notes: order.notes 
          ? `${order.notes}\nPesaPal IPN: ${JSON.stringify(body)}`
          : `PesaPal IPN: ${JSON.stringify(body)}`,
      },
    });

    console.log(`Order ${order.orderNumber} updated with status: ${paymentStatus}`);

    return NextResponse.json({
      success: true,
      data: {
        orderId: updatedOrder.id,
        paymentStatus: updatedOrder.paymentStatus,
      },
    });
  } catch (error) {
    console.error('Error processing PesaPal IPN:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process IPN' },
      { status: 500 }
    );
  }
}

// GET /api/payments/pesapal/ipn - Health check
export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'PesaPal IPN endpoint is active',
    timestamp: new Date().toISOString(),
  });
}

