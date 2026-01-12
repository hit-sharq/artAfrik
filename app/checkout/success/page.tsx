// Checkout Success Page
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import './success.css';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/payments?orderId=${orderId}`);
        const data = await response.json();

        if (data.success) {
          setOrder(data.data);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="success-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="success-page">
      <motion.div
        className="success-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Success Icon */}
        <motion.div
          className="success-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <CheckCircle size={64} />
        </motion.div>

        {/* Success Message */}
        <h1>Thank You for Your Order!</h1>
        <p className="order-number">
          Order #{order?.orderNumber || 'Processing'}
        </p>
        <p className="success-message">
          Your payment has been successfully processed. We&apos;ll send you an email
          confirmation shortly.
        </p>

        {/* Order Details */}
        {order && (
          <div className="order-details">
            <div className="detail-section">
              <h3>
                <Mail size={18} />
                Confirmation sent to
              </h3>
              <p>{order.shippingEmail || 'your email'}</p>
            </div>

            <div className="detail-section">
              <h3>
                <Package size={18} />
                Estimated Delivery
              </h3>
              <p>5-7 business days</p>
            </div>
          </div>
        )}

        {/* What's Next */}
        <div className="next-steps">
          <h2>What&apos;s Next?</h2>
          <ul>
            <li>
              <CheckCircle size={18} />
              Check your email for order confirmation
            </li>
            <li>
              <CheckCircle size={18} />
              We&apos;ll notify you when your order ships
            </li>
            <li>
              <CheckCircle size={18} />
              Track your order using the link in your email
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="success-actions">
          <Link href="/gallery" className="primary-btn">
            Continue Shopping
            <ArrowRight size={20} />
          </Link>
          <Link href="/" className="secondary-btn">
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

