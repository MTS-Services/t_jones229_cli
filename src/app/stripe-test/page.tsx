import StripeTestPage from '@/components/StripePayment/StripeTestPage';

export default function StripeTest() {
  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='container mx-auto px-4'>
        <div className='max-w-4xl mx-auto'>
          <div className='mb-8 text-center'>
            <h1 className='text-3xl font-bold text-gray-900 mb-4'>
              Stripe Integration Test
            </h1>
            <p className='text-lg text-gray-600'>
              Test the Stripe payment integration in development mode
            </p>
          </div>

          <div className='mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
            <h2 className='font-semibold text-blue-800 mb-2'>
              Test Card Numbers:
            </h2>
            <ul className='text-sm text-blue-700 space-y-1'>
              <li>
                <strong>Success:</strong> 4242 4242 4242 4242
              </li>
              <li>
                <strong>Decline:</strong> 4000 0000 0000 0002
              </li>
              <li>
                <strong>Insufficient funds:</strong> 4000 0000 0000 9995
              </li>
              <li>Use any future date for expiry and any 3-digit CVC</li>
            </ul>
          </div>

          <StripeTestPage />
        </div>
      </div>
    </div>
  );
}
