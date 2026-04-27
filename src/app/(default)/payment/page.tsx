"use client";

import PaymentCard from "@/components/Payment/PaymentCard";
import PaymentDetails from "@/components/Payment/PaymentDetails";
import StripePaymentForm from "@/components/Payment/StripePaymentForm";
import { useGetSingleBoatQuery } from "@/redux/api/boatApi";
import {
  useCreateBookingMutation,
  useCreateBookingDepositMutation,
} from "@/redux/api/bookingApi";
import { useUpdateProfileMutation } from "@/redux/api/userDashboardApi/updateProfile";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";

// Country name to ISO 3166-1 alpha-2 code mapping
const countryToISO: Record<string, string> = {
  Afghanistan: "AF",
  Albania: "AL",
  Algeria: "DZ",
  Argentina: "AR",
  Australia: "AU",
  Austria: "AT",
  Bahrain: "BH",
  Bangladesh: "BD",
  Belgium: "BE",
  Brazil: "BR",
  Bulgaria: "BG",
  Cambodia: "KH",
  Canada: "CA",
  Chile: "CL",
  China: "CN",
  Colombia: "CO",
  Croatia: "HR",
  "Czech Republic": "CZ",
  Denmark: "DK",
  Egypt: "EG",
  Estonia: "EE",
  Finland: "FI",
  France: "FR",
  Germany: "DE",
  Greece: "GR",
  "Hong Kong": "HK",
  Hungary: "HU",
  Iceland: "IS",
  India: "IN",
  Indonesia: "ID",
  Ireland: "IE",
  Israel: "IL",
  Italy: "IT",
  Japan: "JP",
  Jordan: "JO",
  Kenya: "KE",
  Kuwait: "KW",
  Latvia: "LV",
  Lithuania: "LT",
  Luxembourg: "LU",
  Malaysia: "MY",
  Mexico: "MX",
  Morocco: "MA",
  Netherlands: "NL",
  "New Zealand": "NZ",
  Nigeria: "NG",
  Norway: "NO",
  Oman: "OM",
  Pakistan: "PK",
  Peru: "PE",
  Philippines: "PH",
  Poland: "PL",
  Portugal: "PT",
  Qatar: "QA",
  Romania: "RO",
  Russia: "RU",
  "Saudi Arabia": "SA",
  Serbia: "RS",
  Singapore: "SG",
  Slovakia: "SK",
  Slovenia: "SI",
  "South Africa": "ZA",
  "South Korea": "KR",
  Spain: "ES",
  "Sri Lanka": "LK",
  Sweden: "SE",
  Switzerland: "CH",
  Taiwan: "TW",
  Thailand: "TH",
  Turkey: "TR",
  Ukraine: "UA",
  "United Arab Emirates": "AE",
  "United Kingdom": "GB",
  "United States": "US",
  Vietnam: "VN",
  // Common variations
  USA: "US",
  UK: "GB",
  UAE: "AE",
  Korea: "KR",
};

// Helper function to convert country name to ISO code
const getCountryISO = (countryName: string | undefined): string => {
  if (!countryName) return "US";
  // If it's already a 2-character code, return it
  if (countryName.length === 2) return countryName.toUpperCase();
  // Look up the country name
  return countryToISO[countryName] || "US";
};

export default function Page() {
  const [selectedPayment, setSelectedPayment] = useState("full");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentMethodId, setPaymentMethodId] = useState<string | null>(null);
  const [isCardComplete, setIsCardComplete] = useState(false);

  // ✅ Store localStorage values safely in state
  const [tripDate, setTripDate] = useState<string | null>(null);
  const [numberOfGuests, setNumberOfGuests] = useState<string | null>(null);
  const [bookingType, setBookingType] = useState<string | null>(null);

  const router = useRouter();
  const params = useSearchParams();
  const boatID = params.get("boatId");
  const tripId = params.get("tripId");

  // Try to get values from URL params as fallback
  const dateFromUrl = params.get("date");
  const guestsFromUrl = params.get("guests");
  const bookingTypeFromUrl = params.get("bookingType");

  useEffect(() => {
    if (typeof window !== "undefined") {
      // 1) Preferred: new searchData JSON object written by SearchBar
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
        console.error("Failed to parse searchData from localStorage", err);
      }

      // 2) Legacy fallback: individual keys (older versions of the search bar)
      const legacyDate = localStorage.getItem("date");
      const legacyGuests = localStorage.getItem("Guests");
      const legacyBookingType = localStorage.getItem("bookingType");

      console.log("Resolved booking inputs:", {
        searchData: {
          dateFromStorage,
          guestsFromStorage,
          bookingTypeFromStorage,
        },
        legacy: { legacyDate, legacyGuests, legacyBookingType },
        url: { dateFromUrl, guestsFromUrl, bookingTypeFromUrl },
      });

      // Priority: searchData → legacy keys → URL params
      setTripDate(dateFromStorage || legacyDate || dateFromUrl);
      setNumberOfGuests(guestsFromStorage || legacyGuests || guestsFromUrl);
      setBookingType(
        bookingTypeFromStorage || legacyBookingType || bookingTypeFromUrl,
      );
    }
  }, [dateFromUrl, guestsFromUrl, bookingTypeFromUrl]);

  const methods = useForm();

  const { data } = useGetSingleBoatQuery(boatID);

  const filterTrip = data?.data?.trips?.find((trip: any) => trip.id === tripId);
  const [updateProfileFN] = useUpdateProfileMutation();
  const [bookingFN, { isLoading }] = useCreateBookingMutation();
  const [createBookingDeposit, { isLoading: isDepositLoading }] =
    useCreateBookingDepositMutation();

  // Handle Stripe payment method creation
  const handlePaymentMethodCreated = (pmId: string) => {
    console.log("✅ Payment method received:", pmId);
    setPaymentMethodId(pmId);
    // Trigger form submission after payment method is created
    methods.handleSubmit(handleUpdate)();
  };

  const handlePaymentError = (error: string) => {
    console.error("❌ Payment error:", error);
    toast.error(error);
    setIsProcessingPayment(false);
  };

  const handleUpdate = async (data: any) => {
    try {
      // Check if we have a payment method from Stripe Elements
      if (!paymentMethodId) {
        setIsProcessingPayment(true);
        window.dispatchEvent(new Event("createStripePaymentMethod"));
        return; // handlePaymentMethodCreated will re-call this function
      }

      if (!tripDate) {
        toast.error(
          "Trip date is missing. Please go back and select a trip date.",
        );

        setIsProcessingPayment(false);
        return;
      }

      if (!numberOfGuests || parseInt(numberOfGuests) < 1) {
        toast.error(
          "Number of guests is missing. Please go back and select number of guests.",
        );

        setIsProcessingPayment(false);
        return;
      }

      if (!boatID || !tripId) {
        toast.error(
          "Booking information is incomplete. Please start the booking process again.",
        );
        setIsProcessingPayment(false);
        return;
      }

      // Prepare booking info without card details - use paymentMethodId from Stripe Elements
      const fullPaymentInfo = {
        paymentMethod: {
          paymentMethod: "card",
          cardNumber: "****", // Card details are handled by Stripe
          expireDate: "",
          securityCode: "***",
          nameOfCard: `${data?.firstName} ${data?.lastName}`,
          bollingCountry: data?.bollingCountry || "US",
          zipCode: data?.zipCode || "",
        },
        user: {
          firstName: data?.firstName,
          lastName: data?.lastName,
          phoneNumber: data?.mobile,
        },
      };

      // Determine if this is a GROUP booking (bookingType === false)
      const isGroupBooking = bookingType
        ? !(bookingType.toLowerCase() === "true" || bookingType === "1")
        : false;

      // ─── NEW: route to deposit flow when user picked "partial" ───
      if (selectedPayment === "partial") {
        const depositRes = await createBookingDeposit({
          boatId: boatID,
          tripId: filterTrip?.id,
          tripDate,
          groupSize: parseInt(numberOfGuests ?? "0", 10),
          paymentMethodId,
          bookingType: !isGroupBooking, // true = PRIVATE
        });

        if ((depositRes as any)?.data?.success) {
          try {
            await updateProfileFN(fullPaymentInfo).unwrap();
          } catch (profileError) {
            console.warn(
              "Failed to update profile (non-critical):",
              profileError,
            );
          }
          toast.success(
            (depositRes as any)?.data?.message ??
              "Deposit secured. See you at the dock!",
          );
          router.push("/private-confirmation");
        } else {
          const err = (depositRes as any)?.error;
          const msg =
            err?.data?.message ??
            err?.message ??
            "Failed to secure deposit. Please try again.";
          console.error("Deposit booking failed:", err);
          toast.error(msg);
        }
        setIsProcessingPayment(false);
        return;
      }

      // ─── Legacy full-payment flow ───
      const bookingInfo: any = {
        boatId: boatID,
        tripId: filterTrip?.id,
        tripDate: tripDate,
        amount: selectedPayment,
        bookingType: !isGroupBooking, // true = PRIVATE, false = GROUP
        groupSize: parseInt(numberOfGuests ?? "0", 10),
        // Send payment method ID from Stripe Elements (secure tokenized payment)
        paymentMethodId: paymentMethodId,
      };

      // Add memberInfo for GROUP bookings (required by backend for groupMember.create)
      if (isGroupBooking) {
        console.log("Adding memberInfo for GROUP booking");
        bookingInfo.memberInfo = {
          firstName: data?.firstName,
          lastName: data?.lastName,
          email: data?.email,
          phoneNumber: data?.mobile,
        };
      }

      const res = await bookingFN(bookingInfo);

      if (res?.data?.success) {
        // Try to update profile, but don't fail the whole flow if it doesn't work
        try {
          await updateProfileFN(fullPaymentInfo).unwrap();
        } catch (profileError) {
          console.warn(
            "Failed to update profile (non-critical):",
            profileError,
          );
        }

        toast.success(res?.data?.message);
        router.push("/private-confirmation");
      } else {
        let errorMessage = "An error occurred during booking.";
        if (res?.error) {
          console.error("Booking error:", res.error);
          if ("data" in res.error && (res.error as any).data?.message) {
            errorMessage = (res.error as any).data.message;
          } else if ("message" in res.error) {
            errorMessage =
              (res.error as { message?: string }).message || errorMessage;
          }
          // Log full error details for debugging
          if ("data" in res.error && (res.error as any).data?.errorDetails) {
            console.error(
              "Error details:",
              (res.error as any).data.errorDetails,
            );
            if ((res.error as any).data.errorDetails.issues) {
              const issues = (res.error as any).data.errorDetails.issues;

              issues.forEach((issue: any, index: number) => {
                console.error(`Issue ${index + 1}:`, {
                  path: issue.path,
                  message: issue.message,
                  code: issue.code,
                  full: issue,
                });
              });
            }
          }
        }
        toast.error(errorMessage + " Please try again.");
      }
      setIsProcessingPayment(false);
    } catch (error) {
      console.error("Caught error:", error);
      toast.error(error as string);
      setIsProcessingPayment(false);
    }
  };

  // Get billing details from form for Stripe
  const watchedValues = methods.watch();
  const billingDetails = {
    name: `${watchedValues.firstName || ""} ${watchedValues.lastName || ""}`.trim(),
    email: watchedValues.email || "",
    phone: watchedValues.mobile || "",
    address: {
      postal_code: watchedValues.zipCode || "",
      country: getCountryISO(watchedValues.bollingCountry),
    },
  };

  return (
    <div className="container mx-auto lg:mt-30 md:mt-28 mt-24 mt-20 xl:px-6 lg:px-5 md:px-4 px-3">
      <ToastContainer />
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleUpdate)} className="my-10">
          <div className="flex flex-col lg:flex-row gap-5 items-start mx-2">
            <div className="flex-1 w-full">
              <PaymentDetails />

              {/* Stripe Payment Form */}
              <div className="w-full mt-8">
                <StripePaymentForm
                  onPaymentMethodCreated={handlePaymentMethodCreated}
                  onError={handlePaymentError}
                  isProcessing={isProcessingPayment}
                  setIsProcessing={setIsProcessingPayment}
                  onCardComplete={setIsCardComplete}
                  billingDetails={billingDetails}
                />
              </div>
            </div>

            <div>
              <PaymentCard
                image={data?.data?.photos?.[0]?.url}
                location={data?.data?.meetingPoint?.[0]}
                filterTrip={filterTrip}
                isLoading={isLoading || isDepositLoading || isProcessingPayment}
                setSelectedPayment={setSelectedPayment}
                selectedPayment={selectedPayment}
                isCardComplete={isCardComplete}
              />
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
