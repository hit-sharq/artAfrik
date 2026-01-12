// Email Service for notifications
import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `"ArtAfrik" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

// Email Templates
export const emailTemplates = {
  orderConfirmation: (order: {
    orderNumber: string;
    total: number;
    items: { title: string; price: number; quantity: number }[];
    customerName: string;
  }) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #c9a227;">ArtAfrik</h1>
        <p style="color: #666;">African Art & Handcrafts</p>
      </div>
      
      <div style="background: #fafafa; border-radius: 12px; padding: 30px; margin-bottom: 30px;">
        <h2 style="color: #1a1a1a; margin-top: 0;">Order Confirmed! 🎉</h2>
        <p>Hi ${order.customerName},</p>
        <p>Thank you for your order! We've received your order and are processing it now.</p>
        
        <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <p style="margin: 0 0 10px;"><strong>Order Number:</strong> #${order.orderNumber}</p>
          <p style="margin: 0;"><strong>Total:</strong> $${order.total.toLocaleString()}</p>
        </div>
        
        <h3 style="color: #1a1a1a;">Order Details</h3>
        ${order.items.map(item => `
          <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
            <span>${item.title} × ${item.quantity}</span>
            <span>$${(item.price * item.quantity).toLocaleString()}</span>
          </div>
        `).join('')}
      </div>
      
      <div style="text-align: center; padding: 20px; color: #666; font-size: 14px;">
        <p>Questions? Reply to this email or contact us at support@artafrik.com</p>
        <p>© ${new Date().getFullYear()} ArtAfrik. All rights reserved.</p>
      </div>
    </body>
    </html>
  `,

  orderShipped: (order: {
    orderNumber: string;
    trackingNumber?: string;
    carrier?: string;
    estimatedDelivery?: Date;
    customerName: string;
  }) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #c9a227;">ArtAfrik</h1>
      </div>
      
      <div style="background: #fafafa; border-radius: 12px; padding: 30px;">
        <h2 style="color: #1a1a1a; margin-top: 0;">Your Order is on its Way! 📦</h2>
        <p>Hi ${order.customerName},</p>
        <p>Great news! Your order has been shipped and is on its way to you.</p>
        
        <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <p style="margin: 0 0 10px;"><strong>Order Number:</strong> #${order.orderNumber}</p>
          ${order.trackingNumber ? `<p style="margin: 0 0 10px;"><strong>Tracking Number:</strong> ${order.trackingNumber}</p>` : ''}
          ${order.carrier ? `<p style="margin: 0 0 10px;"><strong>Carrier:</strong> ${order.carrier}</p>` : ''}
          ${order.estimatedDelivery ? `<p style="margin: 0;"><strong>Estimated Delivery:</strong> ${new Date(order.estimatedDelivery).toLocaleDateString()}</p>` : ''}
        </div>
        
        <p>Track your package using the tracking number above.</p>
      </div>
      
      <div style="text-align: center; padding: 20px; color: #666; font-size: 14px;">
        <p>© ${new Date().getFullYear()} ArtAfrik. All rights reserved.</p>
      </div>
    </body>
    </html>
  `,

  paymentReceipt: (payment: {
    orderNumber: string;
    amount: number;
    customerName: string;
    transactionId: string;
  }) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #c9a227;">ArtAfrik</h1>
      </div>
      
      <div style="background: #fafafa; border-radius: 12px; padding: 30px;">
        <h2 style="color: #1a1a1a; margin-top: 0;">Payment Received ✅</h2>
        <p>Hi ${payment.customerName},</p>
        <p>We've received your payment. Thank you for your purchase!</p>
        
        <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
          <p style="font-size: 14px; color: #666; margin: 0 0 5px;">Amount Paid</p>
          <p style="font-size: 32px; font-weight: bold; color: #16a34a; margin: 0;">$${payment.amount.toLocaleString()}</p>
          <p style="font-size: 12px; color: #666; margin: 10px 0 0;">Transaction ID: ${payment.transactionId}</p>
        </div>
        
        <p>Order Number: #${payment.orderNumber}</p>
      </div>
      
      <div style="text-align: center; padding: 20px; color: #666; font-size: 14px;">
        <p>© ${new Date().getFullYear()} ArtAfrik. All rights reserved.</p>
      </div>
    </body>
    </html>
  `,

  reviewRequest: (artwork: {
    title: string;
    imageUrl: string;
    customerName: string;
  }) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #c9a227;">ArtAfrik</h1>
      </div>
      
      <div style="background: #fafafa; border-radius: 12px; padding: 30px;">
        <h2 style="color: #1a1a1a; margin-top: 0;">How was your purchase? ⭐</h2>
        <p>Hi ${artwork.customerName},</p>
        <p>We'd love to hear about your experience with "${artwork.title}".</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <img src="${artwork.imageUrl}" alt="${artwork.title}" style="max-width: 200px; border-radius: 8px;">
        </div>
        
        <p>Your feedback helps other customers and helps us improve our service.</p>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/gallery" style="display: inline-block; padding: 12px 30px; background: #c9a227; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Leave a Review</a>
        </div>
      </div>
      
      <div style="text-align: center; padding: 20px; color: #666; font-size: 14px;">
        <p>© ${new Date().getFullYear()} ArtAfrik. All rights reserved.</p>
      </div>
    </body>
    </html>
  `,
};

// Helper functions
export async function sendOrderConfirmationEmail(
  email: string,
  orderData: Parameters<typeof emailTemplates.orderConfirmation>[0]
) {
  const html = emailTemplates.orderConfirmation(orderData);
  return sendEmail({
    to: email,
    subject: `Order Confirmed - #${orderData.orderNumber} | ArtAfrik`,
    html,
  });
}

export async function sendOrderShippedEmail(
  email: string,
  orderData: Parameters<typeof emailTemplates.orderShipped>[0]
) {
  const html = emailTemplates.orderShipped(orderData);
  return sendEmail({
    to: email,
    subject: `Your Order is Shipped! #${orderData.orderNumber} | ArtAfrik`,
    html,
  });
}

export async function sendPaymentReceiptEmail(
  email: string,
  paymentData: Parameters<typeof emailTemplates.paymentReceipt>[0]
) {
  const html = emailTemplates.paymentReceipt(paymentData);
  return sendEmail({
    to: email,
    subject: `Payment Receipt - #${paymentData.orderNumber} | ArtAfrik`,
    html,
  });
}

export async function sendReviewRequestEmail(
  email: string,
  artworkData: Parameters<typeof emailTemplates.reviewRequest>[0]
) {
  const html = emailTemplates.reviewRequest(artworkData);
  return sendEmail({
    to: email,
    subject: `How was your purchase? | ArtAfrik`,
    html,
  });
}

