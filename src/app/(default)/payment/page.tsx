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

  useEffect(() => {
    if (typeof window !== "undefined") {
      setTripDate(localStorage.getItem("date"));
      setNumberOfGuests(localStorage.getItem("Guests"));
      setBookingType(localStorage.getItem("bookingType"));
    }
  }, []);

  const router = useRouter();
  const params = useSearchParams();
  const boatID = params.get("boatId");
  const tripId = params.get("tripId");
  const methods = useForm();

  const { data } = useGetSingleBoatQuery(boatID);

  const filterTrip = data?.data?.trips?.find((trip: any) => trip.id === tripId);
  const [updateProfileFN] = useUpdateProfileMutation();
  const [bookingFN, { isLoading }] = useCreateBookingMutation();

  const handleUpdate = async (data: any) => {
    const [exp_month, exp_year] = data?.expireDate.split("/");

    const formBody = new URLSearchParams();
    formBody.append("type", "card");
    formBody.append("card[number]", data?.cardNumber);
    formBody.append("card[exp_month]", exp_month.trim());
    formBody.append("card[exp_year]", exp_year.trim());
    formBody.append("card[cvc]", data?.securityCode);

    // Optional billing info
    formBody.append(
      "billing_details[name]",
      `${data?.firstName} ${data?.lastName}`
    );
    formBody.append("billing_details[email]", data?.email);
    formBody.append("billing_details[phone]", data?.mobile);
    formBody.append("billing_details[address][postal_code]", data?.zipCode);

    //pk_test_51S7FGWFSOdhjuWuwt3kJdy5Z1mbFuygwNcHF9RwdEWtGOaD8ttn7rCxgvgXF8sgGRKmaRRZodTExO7K0mei0rSMt00QCt0obAN   ashik vai
    const response = await fetch("https://api.stripe.com/v1/payment_methods", {
      method: "POST",
      headers: {
        Authorization: `Bearer pk_test_51S7FGWFSOdhjuWuwt3kJdy5Z1mbFuygwNcHF9RwdEWtGOaD8ttn7rCxgvgXF8sgGRKmaRRZodTExO7K0mei0rSMt00QCt0obAN`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formBody.toString(),
    });

    const result = await response.json();

    // right side form submission
    try {
      const fullPaymentInfo = {
        paymentMethod: {
          paymentMethod: data?.paymentMethod,
          cardNumber: data?.cardNumber,
          expireDate: data?.expireDate,
          securityCode: data?.securityCode,
          nameOfCard: data?.nameOfCard,
          bollingCountry: data?.bollingCountry,
          zipCode: data?.zipCode,
        },
        user: {
          firstName: data?.firstName,
          lastName: data?.lastName,
          phoneNumber: data?.mobile,
        },
      };
      const bookingInfo = {
        boatId: boatID,
        tripId: filterTrip?.id,
        tripDate: tripDate,
        amount: selectedPayment,
        bookingType: bookingType
          ? bookingType.toLowerCase() === "true" || bookingType === "1"
          : true,
        paymentMethodId: result.id,
        groupSize: parseInt(numberOfGuests ?? "0", 10),
      };

      const res = await bookingFN(bookingInfo);
      console.log(res);

      if (res?.data?.success) {
        await updateProfileFN(fullPaymentInfo).unwrap();

        toast.success(res?.data?.message);
        localStorage.removeItem("date");
        localStorage.removeItem("Guests");
        localStorage.removeItem("bookingType");
        router.push("/private-confirmation");
      } else {
        let errorMessage = "An error occurred during booking.";
        if (res?.error) {
          if ("data" in res.error && (res.error as any).data?.message) {
            errorMessage = (res.error as any).data.message;
          } else if ("message" in res.error) {
            errorMessage =
              (res.error as { message?: string }).message || errorMessage;
          }
        }
        toast.error(errorMessage + 'Please try again.');
      }
    } catch (error) {
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
                handleSubmit={handleUpdate}
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
