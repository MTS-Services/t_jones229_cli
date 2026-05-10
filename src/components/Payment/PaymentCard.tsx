"use client";
import placeholderImage from "@/assets/payment/payment.png";
import Image from "next/image";
import { FaMapMarkerAlt } from "react-icons/fa";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

// Dynamically import map component
const PaymentMap = dynamic(() => import("./PaymentMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
      <span className="text-gray-400 text-sm">Loading map...</span>
    </div>
  ),
});

// Map day names to JS getDay() indices (0=Sunday … 6=Saturday)
const DAY_NAME_TO_INDEX: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

export default function PaymentCard({
  filterTrip,
  image,
  location,
  isLoading,
  setSelectedPayment,
  selectedPayment,
  isCardComplete = false,
  tripDate: tripDateProp,
  setTripDate: setTripDateProp,
  numberOfGuests: numberOfGuestsProp,
  setNumberOfGuests: setNumberOfGuestsProp,
  bookingType: bookingTypeProp,
  setBookingType: setBookingTypeProp,
  boatGuests,
}: any) {
  // Use state to avoid hydration mismatch
  const [tripDate, setTripDateLocal] = useState<string | null>(null);
  const [numberOfGuests, setNumberOfGuestsLocal] = useState<string | null>(null);
  const [bookingType, setBookingType] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const [guestError, setGuestError] = useState<string | null>(null);

  // ── Derived values from the trip ─────────────────────────────────
  // Days of week when this trip operates (e.g. ["Monday", "Saturday"])
  const tripDays: string[] = filterTrip?.tripDays ?? [];
  const availableDayIndices: number[] = tripDays
    .map((d: string) => DAY_NAME_TO_INDEX[d] ?? -1)
    .filter((i: number) => i !== -1);

  // Maximum guest count: trip's maxParticipants → boat's guests field
  const maxGuests: number | undefined =
    filterTrip?.maxParticipants ?? boatGuests ?? undefined;

  // Available booking-type options derived from the trip's tripType
  const getBookingTypeOptions = () => {
    const tt = filterTrip?.tripType;
    if (tt === "PRIVATE") return [{ value: "false", label: "Private booking" }];
    if (tt === "GROUP") return [{ value: "true", label: "Shared booking" }];
    // BOTH or unset → show both
    return [
      { value: "false", label: "Private booking" },
      { value: "true", label: "Shared booking" },
    ];
  };
  const bookingTypeOptions = getBookingTypeOptions();

  // ── Sync with parent props ────────────────────────────────────────
  useEffect(() => {
    if (tripDateProp !== undefined) setTripDateLocal(tripDateProp);
  }, [tripDateProp]);

  useEffect(() => {
    if (numberOfGuestsProp !== undefined) setNumberOfGuestsLocal(numberOfGuestsProp);
  }, [numberOfGuestsProp]);

  useEffect(() => {
    if (bookingTypeProp !== undefined && bookingTypeProp !== null)
      setBookingType(bookingTypeProp);
  }, [bookingTypeProp]);

  // Auto-select booking type when trip type forces a single option
  useEffect(() => {
    if (bookingTypeOptions.length === 1 && !bookingTypeProp) {
      const forced = bookingTypeOptions[0].value;
      setBookingType(forced);
      if (setBookingTypeProp) setBookingTypeProp(forced);
    }
  }, [filterTrip?.tripType]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Handlers ────────────────────────────────────────────────────
  const isDateAvailable = (dateStr: string): boolean => {
    if (!dateStr || availableDayIndices.length === 0) return true;
    // Use local date to avoid timezone shifting
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return availableDayIndices.includes(date.getDay());
  };

  const handleDateChange = (val: string) => {
    if (!isDateAvailable(val)) {
      setDateError(
        `Not available on that day. Available days: ${tripDays.join(", ")}.`
      );
      setTripDateLocal(null);
      if (setTripDateProp) setTripDateProp(null);
      return;
    }
    setDateError(null);
    setTripDateLocal(val);
    if (setTripDateProp) setTripDateProp(val);
    if (typeof window !== "undefined") localStorage.setItem("date", val);
  };

  const handleGuestsChange = (val: string) => {
    const num = parseInt(val, 10);
    if (maxGuests !== undefined && num > maxGuests) {
      setGuestError(`Maximum ${maxGuests} guest${maxGuests === 1 ? "" : "s"} allowed for this trip.`);
      const clamped = String(maxGuests);
      setNumberOfGuestsLocal(clamped);
      if (setNumberOfGuestsProp) setNumberOfGuestsProp(clamped);
      if (typeof window !== "undefined") {
        localStorage.setItem("Guests", clamped);
        try {
          const raw = localStorage.getItem("searchData");
          const parsed = raw ? JSON.parse(raw) : {};
          parsed.guests = Number(clamped);
          localStorage.setItem("searchData", JSON.stringify(parsed));
        } catch {}
      }
      return;
    }
    setGuestError(null);
    setNumberOfGuestsLocal(val);
    if (setNumberOfGuestsProp) setNumberOfGuestsProp(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("Guests", val);
      try {
        const raw = localStorage.getItem("searchData");
        const parsed = raw ? JSON.parse(raw) : {};
        parsed.guests = Number(val);
        localStorage.setItem("searchData", JSON.stringify(parsed));
      } catch {}
    }
  };

  const handleBookingTypeChange = (val: string) => {
    setBookingType(val);
    if (setBookingTypeProp) setBookingTypeProp(val);
    if (typeof window !== "undefined") localStorage.setItem("bookingType", val);
  };

  // ── Load from localStorage on first render (client only) ────────
  // Priority: parent props → searchData JSON → legacy keys
  useEffect(() => {
    if (typeof window === "undefined") return;

    let dateFromStorage: string | null = null;
    let guestsFromStorage: string | null = null;
    let bookingTypeFromStorage: string | null = null;

    try {
      const raw = localStorage.getItem("searchData");
      if (raw) {
        const parsed = JSON.parse(raw);
        dateFromStorage = parsed?.date ?? null;
        guestsFromStorage =
          parsed?.guests != null ? String(parsed.guests) : null;
        bookingTypeFromStorage =
          parsed?.bookingType != null ? String(parsed.bookingType) : null;
      }
    } catch (err) {
      console.error("PaymentCard: failed to parse searchData", err);
    }

    // Date
    if (tripDateProp === undefined || tripDateProp === null) {
      const resolved = dateFromStorage || localStorage.getItem("date");
      if (resolved) setTripDateLocal(resolved);
    }

    // Guests – also enforce max constraint when loading from storage
    if (numberOfGuestsProp === undefined || numberOfGuestsProp === null) {
      const raw = guestsFromStorage || localStorage.getItem("Guests");
      if (raw) {
        const num = parseInt(raw, 10);
        const clamped =
          maxGuests !== undefined && num > maxGuests ? String(maxGuests) : raw;
        setNumberOfGuestsLocal(clamped);
        if (setNumberOfGuestsProp) setNumberOfGuestsProp(clamped);
      }
    }

    // Booking type
    if (bookingTypeProp === undefined || bookingTypeProp === null) {
      const resolved =
        bookingTypeFromStorage || localStorage.getItem("bookingType");
      if (resolved) {
        // Validate against allowed options
        const allowed = bookingTypeOptions.map((o) => o.value);
        const effective = allowed.includes(resolved) ? resolved : allowed[0];
        setBookingType(effective);
        if (setBookingTypeProp) setBookingTypeProp(effective);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="bg-[#F7F7F7] shadow-md w-full lg:w-[345px]">
      {/* Image */}
      <Image
        src={image || placeholderImage}
        alt="Boat trip"
        height={200}
        width={200}
        className="w-full h-48 object-cover"
      />

      {/* Content */}
      <div className="p-4">
        {/* Title & Location */}
        <h2 className="text-xl font-normal text-[#242424]">
          {filterTrip?.tripName}
        </h2>
        <div className="flex items-center mt-4 mb-4 text-[#242424]">
          <FaMapMarkerAlt className="text-yellow-500 mr-2" />
          <span>{location?.city}</span>
        </div>

        {/* Map */}
        <div className="mb-4 rounded-lg overflow-hidden border border-gray-200">
          <PaymentMap location={location} />
        </div>

        <hr className="my-4 border-gray-300" />

        {/* Plan Details */}
        <h3 className="text-base font-bold text-[#171717] my-5">
          Plan details:
        </h3>
        <div className="space-y-3 text-[#242424]">
          {/* Trip date */}
          <div>
            <label className="font-bold block mb-1">Trip date:</label>
            <input
              type="date"
              value={tripDate || ""}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => handleDateChange(e.target.value)}
              className={`w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500 ${
                !tripDate || dateError ? "border-red-400" : "border-gray-300"
              }`}
            />
            {tripDays.length > 0 && (
              <p className="text-gray-500 text-xs mt-1">
                Available days: {tripDays.join(", ")}
              </p>
            )}
            {dateError && (
              <p className="text-red-500 text-xs mt-1">{dateError}</p>
            )}
            {!tripDate && !dateError && (
              <p className="text-red-500 text-xs mt-1">
                Please select a trip date to continue.
              </p>
            )}
          </div>

          {/* Group size */}
          <div>
            <label className="font-bold block mb-1">Group size:</label>
            <input
              type="number"
              value={numberOfGuests || ""}
              min={1}
              max={maxGuests}
              onChange={(e) => handleGuestsChange(e.target.value)}
              className={`w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500 ${
                !numberOfGuests || numberOfGuests === "0" || guestError
                  ? "border-red-400"
                  : "border-gray-300"
              }`}
              placeholder="Number of guests"
            />
            {maxGuests !== undefined && (
              <p className="text-gray-500 text-xs mt-1">
                Max {maxGuests} guest{maxGuests === 1 ? "" : "s"}
              </p>
            )}
            {guestError && (
              <p className="text-red-500 text-xs mt-1">{guestError}</p>
            )}
            {(!numberOfGuests || numberOfGuests === "0") && !guestError && (
              <p className="text-red-500 text-xs mt-1">
                Please enter number of guests.
              </p>
            )}
          </div>

          {/* Booking type dropdown */}
          <div>
            <label className="font-bold block mb-1">Booking type:</label>
            <select
              value={bookingType ?? ""}
              onChange={(e) => handleBookingTypeChange(e.target.value)}
              className={`w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500 bg-white ${
                !bookingType ? "border-red-400" : "border-gray-300"
              }`}
            >
              <option value="" disabled>
                Select booking type
              </option>
              {bookingTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {!bookingType && (
              <p className="text-red-500 text-xs mt-1">
                Please select a booking type.
              </p>
            )}
          </div>
        </div>

        <hr className="my-6 border-gray-300" />

        {/* Payment Options */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            How do you want to pay
          </h2>

          <div className="space-y-6">
            {/* Full payment option */}
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="full"
                checked={selectedPayment === "full"}
                onChange={() => setSelectedPayment("full")}
                className="mt-1"
              />
              <div>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-900 ">
                    Pay online in full
                  </span>
                  <span className="bg-green-100 text-green-800 text-base px-2 py-2 rounded my-2 w-48">
                    Recommended
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Pay online in full through FishingTripper and avoid
                  unnecessary hassle with carrying extra cash.
                </p>
              </div>
            </label>

            {/* Deposit option */}
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="partial"
                checked={selectedPayment === "partial"}
                onChange={() => setSelectedPayment("partial")}
                className="mt-1"
              />
              <div>
                <span className="font-bold text-gray-900">
                  Pay deposit upfront
                </span>
                <div className="text-sm text-gray-600 mt-1 space-y-1">
                  <p>
                    Pay 20% now and the rest (80%) directly to the Captain on
                    the trip day.
                  </p>
                  <p>
                    Free cancellation up to 7 days before your trip — partial
                    refund applies if you cancel within 7 days.
                  </p>
                </div>
              </div>
            </label>
          </div>

          {/* Price section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-900">Trip price</span>
              <span className="text-2xl font-bold text-gray-900">
                ${filterTrip?.price}
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-4">
              <span>payment due today</span>
              {selectedPayment === "full" ? (
                <span>US ${filterTrip?.price}</span>
              ) : selectedPayment === "partial" ? (
                <span>US ${(filterTrip?.price * 0.2).toFixed(2)}</span>
              ) : null}
            </div>
            <p className="text-xs text-gray-500 mb-6">
              All local taxes & fees are included in this price
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-black font-medium py-3 rounded bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
            >
              {isLoading ? "Processing..." : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
