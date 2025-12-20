"use client";

import PaymentCard from "@/components/Payment/PaymentCard";
import PaymentDetails from "@/components/Payment/PaymentDetails";
import { useGetSingleBoatQuery } from "@/redux/api/boatApi";
import { useCreateBookingMutation } from "@/redux/api/bookingApi";
import { useUpdateProfileMutation } from "@/redux/api/userDashboardApi/updateProfile";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";

export default function Page() {
  const [selectedPayment, setSelectedPayment] = useState("full");

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
      const storedDate = localStorage.getItem("date");
      const storedGuests = localStorage.getItem("Guests");
      const storedBookingType = localStorage.getItem("bookingType");
      
      console.log('LocalStorage values:', {
        date: storedDate,
        guests: storedGuests,
        bookingType: storedBookingType
      });
      
      // Use localStorage values or fallback to URL params
      setTripDate(storedDate || dateFromUrl);
      setNumberOfGuests(storedGuests || guestsFromUrl);
      setBookingType(storedBookingType || bookingTypeFromUrl);
    }
  }, [dateFromUrl, guestsFromUrl, bookingTypeFromUrl]);

  const methods = useForm();

  const { data } = useGetSingleBoatQuery(boatID);

  const filterTrip = data?.data?.trips?.find((trip: any) => trip.id === tripId);
  const [updateProfileFN] = useUpdateProfileMutation();
  const [bookingFN, { isLoading }] = useCreateBookingMutation();

  const handleUpdate = async (data: any) => {
    try {
      console.log('Form data received:', data);
      console.log('Trip date:', tripDate);
      console.log('Number of guests:', numberOfGuests);
      console.log('Booking type:', bookingType);
      console.log('Selected payment:', selectedPayment);

      // Validate required fields
      if (!data?.cardNumber || !data?.expireDate || !data?.securityCode) {
        toast.error('Please fill in all card details');
        return;
      }

      if (!tripDate) {
        toast.error('Trip date is missing. Please go back and select a trip date.');
        console.error('Missing trip date. Check if localStorage "date" is set or pass it via URL');
        return;
      }

      if (!numberOfGuests || parseInt(numberOfGuests) < 1) {
        toast.error('Number of guests is missing. Please go back and select number of guests.');
        console.error('Missing or invalid number of guests. Check if localStorage "Guests" is set');
        return;
      }

      if (!boatID || !tripId) {
        toast.error('Booking information is incomplete. Please start the booking process again.');
        return;
      }

      const [exp_month, exp_year] = data.expireDate.split("/");
      if (!exp_month || !exp_year) {
        toast.error('Invalid expiration date format. Use MM/YY');
        return;
      }

      // Convert country name to ISO 2-letter code for Stripe
      const getCountryCode = (country: string): string => {
        const countryMap: { [key: string]: string } = {
          'united states': 'US',
          'united stated': 'US',
          'usa': 'US',
          'us': 'US',
          'canada': 'CA',
          'uk': 'GB',
          'united kingdom': 'GB',
          'bangladesh': 'BD',
        };
        const normalized = country?.toLowerCase().trim();
        return countryMap[normalized] || 'US'; // Default to US if unknown
      };

      // Send card details to backend - backend will handle Stripe tokenization server-side
      console.log('Preparing card details for server-side processing...');

      // Prepare booking info without Stripe payment method creation
      // The backend will handle Stripe payment using the secret key
      const fullPaymentInfo = {
        paymentMethod: {
          paymentMethod: data?.paymentMethod || 'card',
          cardNumber: data?.cardNumber?.slice(-4), // Only store last 4 digits for security
          expireDate: data?.expireDate,
          securityCode: '***', // Don't store actual security code
          nameOfCard: data?.nameOfCard || `${data?.firstName} ${data?.lastName}`,
          bollingCountry: data?.bollingCountry || 'US',
          zipCode: data?.zipCode || '',
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

      console.log('isGroupBooking:', isGroupBooking, 'bookingType from storage:', bookingType);

      const bookingInfo: any = {
        boatId: boatID,
        tripId: filterTrip?.id,
        tripDate: tripDate,
        amount: selectedPayment,
        bookingType: !isGroupBooking, // true = PRIVATE, false = GROUP
        groupSize: parseInt(numberOfGuests ?? "0", 10),
        // Send card details - backend will handle Stripe processing
        cardDetails: {
          number: data.cardNumber,
          exp_month: exp_month.trim(),
          exp_year: exp_year.trim(),
          cvc: data.securityCode,
          name: `${data?.firstName} ${data?.lastName}`,
          address: {
            postal_code: data?.zipCode,
            country: getCountryCode(data?.bollingCountry),
          },
        },
      };

      // Add memberInfo for GROUP bookings (required by backend for groupMember.create)
      if (isGroupBooking) {
        console.log('Adding memberInfo for GROUP booking');
        bookingInfo.memberInfo = {
          firstName: data?.firstName,
          lastName: data?.lastName,
          email: data?.email,
          phoneNumber: data?.mobile,
        };
      }

      console.log('Booking info to send:', bookingInfo);

      const res = await bookingFN(bookingInfo);
      console.log('Booking response:', res);

      if (res?.data?.success) {
        // Try to update profile, but don't fail the whole flow if it doesn't work
        try {
          await updateProfileFN(fullPaymentInfo).unwrap();
        } catch (profileError) {
          console.warn('Failed to update profile (non-critical):', profileError);
        }

        toast.success(res?.data?.message);
        localStorage.removeItem("date");
        localStorage.removeItem("Guests");
        localStorage.removeItem("bookingType");
        router.push("/private-confirmation");
      } else {
        let errorMessage = "An error occurred during booking.";
        if (res?.error) {
          console.error('Booking error:', res.error);
          if ("data" in res.error && (res.error as any).data?.message) {
            errorMessage = (res.error as any).data.message;
          } else if ("message" in res.error) {
            errorMessage =
              (res.error as { message?: string }).message || errorMessage;
          }
          // Log full error details for debugging
          if ("data" in res.error && (res.error as any).data?.errorDetails) {
            console.error('Error details:', (res.error as any).data.errorDetails);
            if ((res.error as any).data.errorDetails.issues) {
              const issues = (res.error as any).data.errorDetails.issues;
              console.error('Validation issues:', issues);
              issues.forEach((issue: any, index: number) => {
                console.error(`Issue ${index + 1}:`, {
                  path: issue.path,
                  message: issue.message,
                  code: issue.code,
                  full: issue
                });
              });
            }
          }
        }
        toast.error(errorMessage + ' Please try again.');
      }
    } catch (error) {
      console.error('Caught error:', error);
      toast.error(error as string);
    }
  };

  return (
    <div className="container mx-auto">
      <ToastContainer />
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleUpdate)} className="my-10">
          <div className="flex flex-col lg:flex-row gap-5 items-center mx-2">
            <PaymentDetails />

            <div>
              <PaymentCard
                image={data?.data?.photos?.[0]?.url}
                location={data?.data?.meetingPoint?.[0]}
                filterTrip={filterTrip}
                isLoading={isLoading}
                setSelectedPayment={setSelectedPayment}
                selectedPayment={selectedPayment}
              />
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
