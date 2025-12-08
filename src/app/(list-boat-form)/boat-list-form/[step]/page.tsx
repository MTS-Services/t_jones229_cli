// MultiStepFormStep.tsx

"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { useEffect, useState } from "react";
import { useFormData } from "@/components/List-boat-form/FormProvider";
import Information from "@/components/List-boat-form/Information";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import PhotosVideos from "@/components/List-boat-form/PhotosVideos";
import Fishing from "@/components/List-boat-form/Fishing";
import MeetingPoint from "@/components/List-boat-form/MeetingPoint";
import MeetingPointMap from "@/components/List-boat-form/MeetingPointMap";
import Discription from "@/components/List-boat-form/Discription";
import Trips from "@/components/List-boat-form/Trips";
import Terms from "@/components/List-boat-form/Terms";
import {
  useCreateBoatMutation,
  useUpdateBoatMutation,
} from "@/redux/api/boatApi";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { clearPaymentMethodId } from "@/redux/slices/paymentMethodSlice";
import { clearImageUrl } from "@/redux/slices/uploadImageSlice";
import { useGetMeQuery } from "@/redux/api/authApi";
import Cookies from "js-cookie";
import { setUser } from "@/redux/slices/authSlice";
import { useUpdateProfileMutation } from "@/redux/api/userDashboardApi/updateProfile";

export default function MultiStepFormStep() {
  const params = useSearchParams();
  const boatId = params.get("id");

  const stepTitles = [
    "Information",
    "photos-and-video",
    "fishing",
    "meeting-point",
    "meeting-point-map",
    "description",
    "trips",
    ...(!boatId ? ["terms"] : []),
  ];

  const router = useRouter();
  const pathname = usePathname();
  const stepFromPath = pathname?.split("/").pop() ?? "Information";
  const stepIndex = stepTitles.indexOf(stepFromPath);
  const { formData, updateFormData } = useFormData();
  const methods = useForm();
  const { handleSubmit, setValue } = methods;
  const dispatch = useDispatch();
  const [isLicenceImage, setIsLicenceImage] = useState(false);
  const [isBoatImage, setIsBoatImage] = useState(false);
  const imageUrl = useSelector((state: RootState) => state.imageUrl.imageUrl);
  const { data: userData } = useGetMeQuery('');
  const userInfo = userData?.data?.paymentMethod;

  useEffect(() => {
    Object.entries(formData).forEach(([key, value]) => {
      setValue(key, value);
    });
  }, [formData, setValue]);

  // update profile information
  const [updateProfileFN] = useUpdateProfileMutation();

  // post boat
  const [updateBoat] = useUpdateBoatMutation();
  const [createBoatFN, { isLoading }] = useCreateBoatMutation();

  const handleNext = async (data: any) => {
    const getValue = (key: any) => formData?.[key] ?? data?.[key];
    updateFormData(data);
    // set payment method id  ****************************

    // const [exp_month, exp_year] = userInfo?.expireDate?.split("/");
    let exp_month = "";
    let exp_year = "";

    if (data?.expireDate) {
      const [month, year] = data?.expireDate.split("/");
      exp_month = month?.trim() || "";
      exp_year = year?.trim() || "";
    } else {
      console.warn("Expire date not found in userInfo");
    }

    const formBody = new URLSearchParams();
    formBody.append("type", "card");
    formBody.append("card[number]", data?.cardNumber);
    formBody.append("card[exp_month]", exp_month?.trim());
    formBody.append("card[exp_year]", exp_year?.trim());
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
    const paymentMethodId = result?.id;

    // *************************************************
    if (stepIndex === 1 && !imageUrl) {
      return toast.error("Upload at least one image");
    }
    if (stepIndex === 7 && !paymentMethodId) {
      return toast.error(
        "set the payment method. please, Go to your dashboard then updatea user information and payment information.!"
      );
    } else {
      if (stepIndex < stepTitles.length - 1) {
        router.push(
          `/boat-list-form/${stepTitles[stepIndex + 1]}?${
            boatId ? `id=${boatId}` : ""
          }`
        );
      } else {
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

        const finalData = {
          boatInfo: {
            guests: getValue("guests"),
            description: getValue("description"),
            manufacturer: getValue("manufacturer"),
            boatLength: getValue("boatLength"),
            modelYear: getValue("modelYear"),
            facilities: getValue("facilities") || [],
            gearAndCrew: getValue("gearAndCrew") || [],
            licenceImages: getValue("licenceImages") || [],
            acceptSharedCharters: false,

            // empty value
            sharedBooking: getValue("sharedBooking") || false,
            listingType: getValue("listingType") || "",
            boatType: getValue("boatType") || "",
            isDeleted: false,
          },
          fishing: {
            species: getValue("fishingSpecies") || [],
            fishingLocation: getValue("fishingLocation") || [],
            fishingTechnique: getValue("fishingTechnique") || [],
            policies: getValue("policies") || [],
            includedPrice: getValue("includedPrice") || [],
          },
          photos: getValue("photos") || [],
          videos: [], // Add later if needed
          meetingPoint: {
            street: getValue("street"),
            city: getValue("city"),
            postCode: getValue("postCode"),
            country: getValue("country"),
            direction: getValue("direction"),
            location: getValue("location") || { latitude: 0, longitude: 0 },
          },

          description: {
            listingTypeTitle: getValue("listingTypeTitle"),
            listingTypeDescription: getValue("listingTypeDescription"),
          },
          trips: (getValue("trips") || []).map((trip: any) => ({
            tripName: trip.tripName,
            description: trip.tripsdescription,
            duration: trip.tripsduration,
            tripDays: trip.tripDays || [],
            departureTime: trip.departureTime,
            price: Number(trip.tripsprice),
            species: trip.tripsSpecies || [],
            fishingLocation: trip.fishingLocation || [],
            fishingTechnique: trip.fishingTechnique || [],
          })),

          ...(!boatId && {
            terms: {
              paymentMethod: data?.paymentMethod,
              cardNumber: data?.cardNumber,
              expireDate: data?.expireDate,
              securityCode: data?.securityCode,
              nameOfCard: data?.nameOfCard,
              bollingCountry: data?.bollingCountry,
              zipCode: data?.zipCode,
              paymentMethodId: paymentMethodId,
            },
          }),
        };

        try {
          const res = boatId
            ? await updateBoat({ boatInfo: finalData, id: boatId })
            : await createBoatFN(finalData);
          if (!boatId && res?.data?.success) {
            await updateProfileFN(fullPaymentInfo).unwrap();

            toast.success(res?.data?.message);
            Cookies.set("token", res?.data?.data?.accessToken);
            Cookies.set("currentUserRole", "CAPTAIN");
            dispatch(
              setUser({
                user: userInfo,
                token: res?.data?.data?.accessToken,
                isAuthenticated: true,
              })
            );

            router.push("/success-boat-creation");
          } else if (res?.data?.success) {
            toast.success(res?.data?.message);
            router.push("/dashboard/boat-trip");
          }
          if (res?.error) {
            // res.error can be FetchBaseQueryError or SerializedError; check shape before accessing .data
            if (typeof res.error === "object" && "data" in res.error) {
              const errData: any = (res.error as any).data;
              toast.error(errData?.message || "Something went wrong");
            } else {
              const errMsg =
                (res.error as any)?.message || "Something went wrong";
              toast.error(errMsg);
            }
          }

          dispatch(clearPaymentMethodId());
          dispatch(clearImageUrl());
        } catch (error) {
          toast.error("Error creating boat: " + error);
          dispatch(clearPaymentMethodId());
        }

        // Here you can send finalData to your API or handle it as needed
      }
    }
  };

  const handlePrevious = () => {
    if (stepIndex > 0) {
      router.push(
        `/boat-list-form/${stepTitles[stepIndex - 1]}?${
          boatId ? `id=${boatId}` : ""
        }`
      );
    }
  };

  return (
    <FormProvider {...methods}>
      <ToastContainer />
      <form onSubmit={handleSubmit(handleNext)} className="space-y-4 pb-10">
        {stepIndex === 0 && (
          <Information setIsLicenceImage={setIsLicenceImage} />
        )}

        {stepIndex === 1 && <PhotosVideos setIsBoatImage={setIsBoatImage} />}
        {stepIndex === 2 && <Fishing />}
        {stepIndex === 3 && <MeetingPoint />}
        {stepIndex === 4 && <MeetingPointMap />}
        {stepIndex === 5 && <Discription />}
        {stepIndex === 6 && <Trips />}
        {!boatId && stepIndex === 7 && <Terms />}

        <div className="flex justify-between gap-2  px-10 xl:px-0">
          {stepIndex > 0 && (
            <button
              type="button"
              onClick={handlePrevious}
              className="bg-[#f7f7f7] border border-[#9f9f9f] rounded-[14px] px-4 py-2 text-base flex items-center gap-2 mx-2 md:mx-14"
            >
              <MdKeyboardArrowLeft />
              Back
            </button>
          )}
          <div className={`${stepIndex === 0 ? "px-3 lg:px-14" : ""}`}>
            <button
              type="submit"
              disabled={
                (stepIndex === 0 && isLicenceImage === false) ||
                (stepIndex === 1 && isBoatImage === false)
              }
              className={`bg-[#ffaa33] text-white px-4 py-2 rounded-[14px] flex items-center gap-2 text-lg mr-10 md:mr-40 ${
                stepIndex === 0 && isLicenceImage === false
                  ? "bg-gray-300 "
                  : ""
              }  ${
                stepIndex === 1 && isBoatImage === false ? "bg-gray-300 " : ""
              }`}
            >
              {stepIndex === stepTitles.length - 1
                ? isLoading
                  ? "Loading..."
                  : "Confirm"
                : "Next"}
              <MdKeyboardArrowRight />
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
