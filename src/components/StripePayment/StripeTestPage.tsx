'use client';

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const stripePromise = loadStripe(
  'pk_test_51R61J0CZ2kLTrYVYE9WQTKQfW3pfUXk24wvYy2ZnBiylVvfjMdCXhTPuDnFIzJhbAOG45ZC0EN45mqH5Kqsr4HPw005XK2Dm4F'
);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [isCardComplete, setIsCardComplete] = useState(false);
  const [paymentMethodId, setPaymentMethodId] = useState<string | null>(null);

  const handleChange = (event: any) => {
    setIsCardComplete(event.complete);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      toast.error('Stripe has not loaded yet');
      setLoading(false);
      return;
    }

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        toast.error('Card element not found');
        setLoading(false);
        return;
      }

      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        toast.error(error.message || 'Failed to create payment method');
        setLoading(false);
        return;
      }

      if (paymentMethod) {
        setPaymentMethodId(paymentMethod.id);
        toast.success(`Payment method created: ${paymentMethod.id}`);
        console.log('Payment Method:', paymentMethod);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-white p-8 rounded-lg shadow-md'>
      <ToastContainer position='top-right' autoClose={3000} />
      
      <h2 className='text-2xl font-semibold mb-6'>Test Payment Form</h2>
      
      {paymentMethodId && (
        <div className='mb-4 p-4 bg-green-50 border border-green-200 rounded'>
          <p className='text-green-800 font-medium'>Payment Method Created!</p>
          <p className='text-sm text-green-600 mt-1 break-all'>
            ID: {paymentMethodId}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-6'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Card Details
          </label>
          <div className='p-4 border border-gray-300 rounded-lg focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500'>
            <CardElement
              options={{
                hidePostalCode: false,
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
              onChange={handleChange}
            />
          </div>
        </div>

        <button
          type='submit'
          disabled={!stripe || loading || !isCardComplete}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
            !stripe || loading || !isCardComplete
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
          }`}
        >
          {loading ? (
            <span className='flex items-center justify-center'>
              <svg
                className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Create Payment Method'
          )}
        </button>
      </form>

      <div className='mt-6 p-4 bg-gray-50 rounded-lg'>
        <h3 className='font-medium text-gray-900 mb-2'>Status:</h3>
        <ul className='text-sm text-gray-600 space-y-1'>
          <li>✓ Stripe Loaded: {stripe ? 'Yes' : 'No'}</li>
          <li>✓ Card Complete: {isCardComplete ? 'Yes' : 'No'}</li>
          <li>✓ Ready to Submit: {stripe && isCardComplete ? 'Yes' : 'No'}</li>
        </ul>
      </div>
    </div>
  );
};

const StripeTestPage: React.FC = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default StripeTestPage;
