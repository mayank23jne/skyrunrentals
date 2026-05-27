import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Landmark, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import api from '../services/api';

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_live_51N1i2GKwVrl09vlmitR6lEeheMg01n89PvPtTbSQZJQ33qvIPrlrE9YAMeAg36NukohsMv7G9W1nja2ujVPlfBvC00VjALjaqL'
);

interface StripePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPay: () => void;
  price: string;
  isProcessing: boolean;
}

const CheckoutForm: React.FC<{
  onSuccess: (paymentIntent: any) => void;
  price: string;
  onClose: () => void;
}> = ({ onSuccess, price, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || 'An error occurred.');
      setIsProcessing(false);
      return;
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: 'if_required',
    });

    if (confirmError) {
      setError(confirmError.message || 'Payment failed.');
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess(paymentIntent);
    } else {
      setError('Unexpected payment status.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="spm-form">
      <PaymentElement />
      {error && <div className="spm-error">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="spm-pay-btn"
        style={{ marginTop: '24px' }}
      >
        {isProcessing ? (
          <><Loader2 size={20} className="spinner" /> Processing...</>
        ) : (
          `${price} Pay Now`
        )}
      </button>
    </form>
  );
};

const StripePaymentModal: React.FC<StripePaymentModalProps> = ({
  isOpen,
  onClose,
  onPay,
  price,
  isProcessing: parentProcessing,
}) => {
  const { user } = useAuth();
  const [clientSecret, setClientSecret] = useState<string>('');
  const [loadingIntent, setLoadingIntent] = useState(false);
  const lastRequestedPriceRef = useRef<string | null>(null);

  useEffect(() => {
    if (isOpen && price) {
      if (lastRequestedPriceRef.current === price) {
        return; // Already initialized or initializing for this exact price
      }
      lastRequestedPriceRef.current = price;

      // Create PaymentIntent as soon as the modal opens
      const createIntent = async () => {
        setLoadingIntent(true);
        try {
          const numericPrice = parseFloat(price.replace(/[^0-9.]/g, '')) || 0;

          const res = await api.post('/payment/payment-init', {
            request_type: 'create_payment_intent',
            itemName: 'Holiday Haven Homes Subscription',
            itemPrice: numericPrice,
            plantype: '1', // Default or grab from props if needed
          });

          if (res.data && res.data.clientSecret) {
            setClientSecret(res.data.clientSecret);
          } else {
            console.error('Failed to get clientSecret', res.data);
          }
        } catch (err) {
          console.error('Error creating payment intent:', err);
        } finally {
          setLoadingIntent(false);
        }
      };

      createIntent();
    } else {
      setClientSecret('');
      lastRequestedPriceRef.current = null; // reset if closed
    }
  }, [isOpen, price]);

  const handlePaymentSuccess = async (paymentIntent: any) => {
    try {
      // Inform backend that payment succeeded
      await api.post('/payment/payment-init', {
        request_type: 'payment_insert',
        payment_intent: paymentIntent,
        customer_id: null,
        choose_property: 1,
      });
      // Call parent onPay which updates UI state and redirects
      onPay();
    } catch (err) {
      console.error('Error saving payment record:', err);
      // Still call onPay so user isn't stuck, since Stripe already charged them
      onPay();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="spm-overlay">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="spm-modal"
          >
            {/* Header */}
            <div className="spm-header">
              <h2>SkyRunRentals LLC</h2>
              <button onClick={onClose} className="spm-close-btn">
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="spm-body">
              <div className="spm-secure-link" style={{ marginBottom: '16px' }}>
                <Lock size={14} className="lock-icon" />
                Secure, fast checkout with Stripe <span className="arrow-down">∨</span>
              </div>

              {loadingIntent ? (
                <div className="spm-loading">
                  <Loader2 size={32} className="spinner" />
                  <p>Initializing secure payment...</p>
                </div>
              ) : clientSecret ? (
                <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'flat' } }}>
                  <CheckoutForm onSuccess={handlePaymentSuccess} price={price} onClose={onClose} />
                </Elements>
              ) : (
                <div className="spm-error" style={{ textAlign: 'center', padding: '20px' }}>
                  Failed to initialize payment gateway. Please try again later.
                </div>
              )}
            </div>

          </motion.div>
        </div>
      )}

      <style>{`
        .spm-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
          backdrop-filter: blur(2px);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        .spm-modal {
          background: #ffffff;
          width: 100%;
          max-width: 500px;
          border-radius: 8px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
          display: flex;
          flex-direction: column;
          max-height: 90vh;
          overflow: hidden;
        }

        .spm-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #eaeaea;
        }

        .spm-header h2 {
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .spm-close-btn {
          background: transparent;
          border: none;
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: 4px;
        }
        .spm-close-btn:hover { background: #f1f5f9; color: #334155; }

        .spm-body {
          padding: 24px;
          overflow-y: auto;
        }

        .spm-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 0;
          color: #64748b;
        }

        .spm-loading .spinner {
          animation: spin 1s linear infinite;
          margin-bottom: 12px;
          color: #3b82f6;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .spm-secure-link {
          display: flex; align-items: center; gap: 6px;
          color: #0ea5e9; font-size: 13px; font-weight: 600;
          cursor: pointer;
          justify-content: center;
        }
        .spm-secure-link .lock-icon { color: #22c55e; }

        .spm-pay-btn {
          width: 100%;
          background: #5cb85c;
          color: white;
          border: none;
          padding: 14px;
          font-size: 16px;
          font-weight: 700;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .spm-pay-btn:hover:not(:disabled) { background: #4cae4c; }
        .spm-pay-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .spm-error {
          color: #ef4444;
          font-size: 13px;
          font-weight: 600;
          margin-top: 12px;
          text-align: center;
        }
      `}</style>
    </AnimatePresence>
  );
};

export default StripePaymentModal;
