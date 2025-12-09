'use client';
import placeholderImage from '@/assets/payment/payment.png';
import Image from 'next/image';
import { FaMapMarkerAlt } from 'react-icons/fa';

export default function PaymentCard({
  filterTrip,
  image,
  location,
  handleSubmit,
  isLoading,
  setSelectedPayment,
  selectedPayment,
}: any) {
  const tripDate = localStorage.getItem('date');
  const numberOfGuests = localStorage.getItem('Guests');
  const bookingType = localStorage.getItem('bookingType');

  return (
    <div className='bg-[#F7F7F7] shadow-md w-full lg:w-[345px]'>
      {/* Image */}
      <Image
        src={image || placeholderImage}
        alt='Boat trip'
        height={200}
        width={200}
        className='w-full h-48 object-cover'
      />

      {/* Content */}
      <div className='p-4'>
        {/* Title & Location */}
        <h2 className='text-xl font-normal text-[#242424]'>
          {filterTrip?.tripName}
        </h2>
        <div className='flex items-center mt-4 mb-6 text-[#242424]'>
          <FaMapMarkerAlt className='text-yellow-500 mr-2' />
          <span>{location?.city}</span>
        </div>

        <hr className='my-4 border-gray-300' />

        {/* Plan Details */}
        <h3 className='text-base font-bold text-[#171717] my-5'>
          Plan details:
        </h3>
        <div className='space-y-2 text-[#242424]'>
          <p>
            <span className='font-bold'>Trip date:</span> {tripDate}
          </p>
          <p>
            <span className='font-bold'>Group size:</span> {numberOfGuests}{' '}
            people
          </p>
          <p>
            <span className='font-bold'>Booking type:</span> {bookingType}{' '}
            booking
          </p>
        </div>

        <hr className='my-6 border-gray-300' />

        {/* Payment Options */}
        <div className='bg-white p-6 rounded-lg shadow-sm border'>
          <h2 className='text-lg font-semibold text-gray-900 mb-6'>
            How do you want to pay
          </h2>

          <div className='space-y-6'>
            {/* Full payment option */}
            <label className='flex items-start space-x-3 cursor-pointer'>
              <input
                type='radio'
                name='payment'
                value='full'
                checked={selectedPayment === 'full'}
                onChange={() => setSelectedPayment('full')}
                className='mt-1'
              />
              <div>
                <div className='flex flex-col'>
                  <span className='font-bold text-gray-900 '>
                    Pay online in full
                  </span>
                  <span className='bg-green-100 text-green-800 text-base px-2 py-2 rounded my-2 w-48'>
                    Recommended
                  </span>
                </div>
                <p className='text-sm text-gray-600 mt-1'>
                  Pay online in full through FishingBooker and avoid unnecessary
                  hassle with carrying extra cash.
                </p>
              </div>
            </label>

            {/* Deposit option */}
            <label className='flex items-start space-x-3 cursor-pointer'>
              <input
                type='radio'
                name='payment'
                value='partial'
                checked={selectedPayment === 'partial'}
                onChange={() => setSelectedPayment('partial')}
                className='mt-1'
              />
              <div>
                <span className='font-bold text-gray-900'>
                  Pay deposit upfront
                </span>
                <div className='text-sm text-gray-600 mt-1 space-y-1'>
                  <p>
                    Pay 30% now and the rest directly to the Captain on or prior
                    to your trip date.
                  </p>
                  <p>
                    If you choose to pay the remaining balance by credit card,
                    an additional 3% charge will apply.
                  </p>
                </div>
              </div>
            </label>
          </div>

          {/* Price section */}
          <div className='mt-8 pt-6 border-t border-gray-200'>
            <div className='flex justify-between items-center mb-2'>
              <span className='font-semibold text-gray-900'>Trip price</span>
              <span className='text-2xl font-bold text-gray-900'>
                ${filterTrip?.price}
              </span>
            </div>
            <div className='flex justify-between text-sm text-gray-600 mb-4'>
              <span>payment due today</span>
              {selectedPayment === 'full' ? (
                <span>US ${filterTrip?.price}</span>
              ) : selectedPayment === 'partial' ? (
                <span>US ${(filterTrip?.price * 0.3).toFixed(2)}</span>
              ) : null}
            </div>
            <p className='text-xs text-gray-500 mb-6'>
              All local taxes & fees are included in this price
            </p>

            <button
              className={`w-full  text-black font-medium py-3 rounded"bg-yellow-400 bg-yellow-500
              `}
              onClick={handleSubmit}
            >
              {isLoading ? 'Sending...' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
