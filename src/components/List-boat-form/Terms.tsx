"use client";

import PaymentDetails from "../Payment/PaymentDetails";

export default function Terms() {
  return (
    <div className="">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-1 bg-orange-500 rounded-full"></div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Terms & Pricing
          </h1>
        </div>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Personal Details */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <PaymentDetails />
            </div>
          </div>
        </div>

        {/* Right Column - Terms & Conditions */}
        <div className="space-y-6">
          <div className="text-gray-500 leading-relaxed text-sm p-6 bg-yellow-50 rounded-lg border border-gray-200 space-y-4">
            <p className="font-semibold text-gray-800">Terms & Conditions</p>

            <p>
              It&apos;s free to create an account and list your boat on
              FishingTripper. We charge a 5% commission based on the total trip
              price for all completed bookings made through the platform.
            </p>
            <p>
              Customers pay a 20% deposit at the time of booking. This deposit
              is held securely by FishingTripper.
            </p>
            <p>
              Upon successful completion of the trip, the deposit will be
              released to you, minus a 5% commission (calculated on the total
              trip price).
            </p>
            <p>
              The remaining balance is paid directly to you by the customer on
              the day of the trip.
            </p>

            <hr className="border-gray-300" />

            <p className="font-semibold text-gray-800">Cancellations</p>
            <p>
              Customers can cancel for a full refund up to 7 calendar days
              before the trip.
            </p>
            <p>
              If a customer cancels between 7 and 3 calendar days before the
              trip, they will receive a 50% refund of the deposit. The remaining
              50% of the deposit will be paid to the charter operator.
            </p>
            <p>
              If a customer cancels less than 3 calendar days before the trip,
              the full deposit is retained and will be paid to the charter
              operator.
            </p>
            <p>
              If a trip is canceled by the charter operator or due to unsafe
              weather conditions, the customer will receive a full refund of the
              deposit, and FishingTripper will not charge a commission.
            </p>

            <hr className="border-gray-300" />

            <p className="font-semibold text-gray-800">
              Commission on cancellations
            </p>
            <p>
              In the event of a customer cancellation, FishingTripper applies
              its 5% commission only to amounts actually received by the charter
              operator.
            </p>
            <p>
              If no payment is made to the charter operator (for example, in a
              full refund), no commission is charged.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
