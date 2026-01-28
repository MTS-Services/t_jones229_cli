"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, FormProvider as RHFProvider } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import Cookies from "js-cookie";

// UI Icons
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

// Components
import Information from "@/components/List-boat-form/Information";
import PhotosVideos from "@/components/List-boat-form/PhotosVideos";
import Fishing from "@/components/List-boat-form/Fishing";
import MeetingPoint from "@/components/List-boat-form/MeetingPoint";
import MeetingPointMap from "@/components/List-boat-form/MeetingPointMap";
import Discription from "@/components/List-boat-form/Discription";
import Trips from "@/components/List-boat-form/Trips";
import Terms from "@/components/List-boat-form/Terms";

// API & State
import {
  useCreateBoatMutation,
  useUpdateBoatMutation,
} from "@/redux/api/boatApi";
import { RootState } from "@/redux/store/store";
import { useFormData } from "@/components/List-boat-form/FormProvider";
import { useGetMeQuery } from "@/redux/api/authApi";
import { clearImageUrl } from "@/redux/slices/uploadImageSlice";
import { clearPaymentMethodId } from "@/redux/slices/paymentMethodSlice";
import { setUser } from "@/redux/slices/authSlice";
import { useUpdateProfileMutation } from "@/redux/api/userDashboardApi/updateProfile";

const tabs = [
  { id: 0, title: "Information" },
  { id: 1, title: "Photos & Videos" },
  { id: 2, title: "Fishing" },
  { id: 3, title: "Meeting Point" },
  { id: 4, title: "Map" },
  { id: 5, title: "Description" },
  { id: 6, title: "Trips" },
  { id: 7, title: "Terms" },
];

const headings: Record<number, { title: string; description: string }> = {
  0: {
    title: "Information",
    description: "Complete the account set up below before you list your boat.",
  },
  1: {
    title: "Photos & Videos",
    description: "Upload high quality photos and videos.",
  },
  2: {
    title: "Fishing",
    description: "Specify your fishing techniques and gear.",
  },
  3: {
    title: "Meeting Point",
    description: "Set the location where customers will meet you.",
  },
  4: {
    title: "Meeting Point Map",
    description: "Pinpoint your exact location on the map.",
  },
  5: {
    title: "Description",
    description: "Add a detailed description of your services.",
  },
  6: {
    title: "Trips",
    description: "Here you can list variations to your trips.",
  },
  7: {
    title: "Terms & Pricing",
    description: "Before listing your boat, review our subscription terms.",
  },
};

export default function MultiStepFormContent() {
  const params = useSearchParams();
  const boatId = params.get("id");
  const router = useRouter();
  const dispatch = useDispatch();

  const { data: userData } = useGetMeQuery("");
  const userInfo = userData?.data?.paymentMethod;

  const { formData, updateFormData } = useFormData();
  const methods = useForm();
  const { handleSubmit, setValue, getValues } = methods;

  const [currentStep, setCurrentStep] = useState(0);
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([0])); // Track unlocked steps
  const [isLicenceImage, setIsLicenceImage] = useState(false);
  const [isBoatImage, setIsBoatImage] = useState(false);
  const imageUrl = useSelector((state: RootState) => state.imageUrl.imageUrl);

  const [createBoatFN, { isLoading }] = useCreateBoatMutation();
  const [updateBoat] = useUpdateBoatMutation();
  const [updateProfileFN] = useUpdateProfileMutation();

  // Load existing form data
  useEffect(() => {
    if (formData) {
      Object.entries(formData).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [formData, setValue]);

  // Validate image states
  useEffect(() => {
    if (formData?.licenseImage || formData?.captainLicenseImage) {
      setIsLicenceImage(true);
    }
    if (formData?.boatImages || imageUrl) {
      setIsBoatImage(true);
    }
  }, [formData, imageUrl]);

  // Listen for payment method creation success
  useEffect(() => {
    const handlePaymentMethodReady = () => {
      // Re-submit the form after payment method is created
      const currentData = getValues();
      if (currentData.paymentMethodId) {
        submitFinalForm(currentData);
      }
    };

    window.addEventListener("paymentMethodCreated", handlePaymentMethodReady);
    return () => {
      window.removeEventListener("paymentMethodCreated", handlePaymentMethodReady);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getValues]);

  const handleTabNavigation = (index: number) => {
    // For edit mode (boatId exists), allow navigation to any step
    // For create mode, only allow navigation to visited steps
    const canNavigate = boatId || visitedSteps.has(index);
    
    if (canNavigate) {
      // Save current form data before navigating
      const currentData = getValues();
      updateFormData(currentData);
      
      // Navigate to the selected step
      setCurrentStep(index);
    } else {
      toast.warn("Please complete the current step first by clicking Next.");
    }
  };

  const handleNext = async (data: any) => {
    // Save form data
    updateFormData(data);

    // Image validation for Photos & Videos step
    if (currentStep === 1 && !imageUrl && !isBoatImage) {
      return toast.error("Upload at least one image");
    }

    const lastStep = boatId ? 6 : 7;

    if (currentStep < lastStep) {
      const nextStep = currentStep + 1;
      
      // Unlock the next step by adding to visitedSteps
      setVisitedSteps((prev) => new Set([...prev, nextStep]));
      
      // Navigate to next step
      setCurrentStep(nextStep);
    } else {
      await submitFinalForm(data);
    }
  };

  const submitFinalForm = async (data: any) => {
    try {
      // Helper function to get value from formData or current data
      const getValue = (key: string) => formData?.[key] ?? data?.[key];

      // Get Payment Method ID from form data (set by StripePaymentForm)
      const paymentMethodId = data?.paymentMethodId || getValue("paymentMethodId");

      // Validate payment method for new boats
      if (!boatId && currentStep === 7) {
        if (!paymentMethodId) {
          // Trigger Stripe payment method creation
          window.dispatchEvent(new Event("createStripePaymentMethod"));
          return; // Wait for payment method creation to complete
        }

        // Validate personal details
        if (!data?.firstName || !data?.lastName || !data?.email || !data?.mobile) {
          return toast.error("Please fill in all required personal details");
        }
      }

      // Prepare payment info for profile update
      const fullPaymentInfo = {
        paymentMethod: {
          paymentMethod: "card",
        },
        user: {
          firstName: data?.firstName || getValue("firstName"),
          lastName: data?.lastName || getValue("lastName"),
          phoneNumber: data?.mobile || getValue("mobile"),
        },
      };

      // Prepare final boat data
      const finalData = {
        boatInfo: {
          guests: Number(getValue("guests")) || 1,
          description: getValue("description") || "",
          manufacturer: getValue("manufacturer") || "",
          boatLength: Number(getValue("boatLength")) || 0,
          modelYear: Number(getValue("modelYear")) || 2020,
          facilities: getValue("facilities") || [],
          gearAndCrew: getValue("gearAndCrew") || [],
          licenceImages: getValue("licenceImages") || [],
          acceptSharedCharters:
            Boolean(getValue("acceptSharedCharters")) || false,
          sharedBooking: Boolean(getValue("sharedBooking")) || false,
          listingType: getValue("listingType") || "Charter",
          boatType: getValue("boatType") || "Fishing Boat",
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
        videos: [],
        meetingPoint: {
          street: getValue("street") || "",
          city: getValue("city") || "",
          postCode: getValue("postCode") || "",
          country: getValue("country") || "",
          direction: getValue("direction") || "",
          location: getValue("location") || { latitude: 0, longitude: 0 },
        },
        description: {
          listingTypeTitle: getValue("listingTypeTitle") || "",
          listingTypeDescription: getValue("listingTypeDescription") || "",
        },
        trips: (getValue("trips") || []).map((trip: any) => ({
          tripName: trip.tripName || "",
          description: trip.tripsdescription || "",
          duration: Number(trip.tripsduration) || 1,
          tripDays: trip.tripDays || [],
          departureTime: trip.departureTime || "08:00",
          price: Number(trip.tripsprice) || 0,
          species: trip.tripsSpecies || [],
          fishingLocation: trip.fishingLocation || [],
          fishingTechnique: trip.fishingTechnique || [],
        })),
        ...(!boatId && {
          terms: {
            paymentMethodId: paymentMethodId || "",
          },
        }),
      };

      // Submit boat data
      const res = boatId
        ? await updateBoat({ boatInfo: finalData, id: boatId })
        : await createBoatFN(finalData);

      // Handle response
      if (!boatId && res?.data?.success) {
        // Update user profile with payment info
        await updateProfileFN(fullPaymentInfo).unwrap();

        toast.success(res?.data?.message || "Boat created successfully!");

        // Update cookies and Redux state
        if (res?.data?.data?.accessToken) {
          Cookies.set("token", res.data.data.accessToken);
          Cookies.set("currentUserRole", "CAPTAIN");
          dispatch(
            setUser({
              user: userInfo,
              token: res.data.data.accessToken,
              isAuthenticated: true,
            })
          );
        }

        // Clear states
        dispatch(clearPaymentMethodId());
        dispatch(clearImageUrl());

        router.push("/success-boat-creation");
      } else if (res?.data?.success) {
        toast.success(res?.data?.message || "Boat updated successfully!");
        dispatch(clearImageUrl());
        router.push("/dashboard/boat-trip");
      }

      // Handle errors
      if (res?.error) {
        if (typeof res.error === "object" && "data" in res.error) {
          const errData: any = (res.error as any).data;
          toast.error(errData?.message || "Something went wrong");
        } else {
          const errMsg = (res.error as any)?.message || "Something went wrong";
          toast.error(errMsg);
        }
        dispatch(clearPaymentMethodId());
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(error?.message || "Submission failed. Please try again.");
      dispatch(clearPaymentMethodId());
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentHeading = headings[currentStep];

  const renderStepComponent = () => {
    switch (currentStep) {
      case 0:
        return <Information setIsLicenceImage={setIsLicenceImage} />;
      case 1:
        return <PhotosVideos setIsBoatImage={setIsBoatImage} />;
      case 2:
        return <Fishing />;
      case 3:
        return <MeetingPoint />;
      case 4:
        return <MeetingPointMap />;
      case 5:
        return <Discription />;
      case 6:
        return <Trips />;
      case 7:
        return !boatId ? <Terms /> : null;
      default:
        return <Information setIsLicenceImage={setIsLicenceImage} />;
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex-none z-50 border-b border-gray-300">
        {/* Header */}
        <div className="bg-[#f7f7f7] lg:px-10 md:px-8 px-6 lg:py-5 md:py-4 py-3">
          <h1 className="md:text-3xl text-2xl font-bold text-gray-800 mb-2">
            {currentHeading?.title}
          </h1>
          <p className="text-base md:text-lg text-gray-600">
            {currentHeading?.description}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 bg-gray-100 lg:px-10 md:px-8 px-6">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab, index) => {
              const isActive = currentStep === index;
              // Disable tab if not visited (unless in edit mode with boatId)
              const isDisabled = !boatId && !visitedSteps.has(index);

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabNavigation(index)}
                  disabled={isDisabled}
                  className={`py-4 px-4 mr-4 font-medium transition whitespace-nowrap border-b-2 ${
                    isActive
                      ? "border-orange-500 text-orange-500"
                      : "border-transparent text-gray-500 hover:text-orange-400"
                  } ${
                    isDisabled
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  {tab.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto lg:px-10 md:px-8 px-6 py-6">
        <RHFProvider {...methods}>
          <form
            onSubmit={handleSubmit(handleNext)}
            className="h-full flex flex-col"
          >
            <div className="flex-1">{renderStepComponent()}</div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between border-t mt-10 pt-8 pb-10">
              {currentStep > 0 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-2 rounded-xl hover:bg-gray-100 font-medium transition"
                >
                  <MdKeyboardArrowLeft size={20} /> Back
                </button>
              ) : (
                <div />
              )}

              <button
                type="submit"
                disabled={
                  isLoading ||
                  (currentStep === 0 && !isLicenceImage) ||
                  (currentStep === 1 && !isBoatImage)
                }
                className={`${
                  (currentStep === 0 && !isLicenceImage) ||
                  (currentStep === 1 && !isBoatImage)
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#f2a93b] hover:bg-[#e0962d]"
                } text-white px-12 py-3 rounded-xl font-bold transition-all shadow-md flex items-center gap-2`}
              >
                {currentStep === (boatId ? 6 : 7)
                  ? isLoading
                    ? "Processing..."
                    : "Confirm Listing"
                  : "Next"}
                <MdKeyboardArrowRight size={20} />
              </button>
            </div>
          </form>
        </RHFProvider>
      </div>
    </div>
  );
}
