"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, FormProvider as RHFProvider } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import Cookies from "js-cookie";

// UI Icons
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdCheck,
} from "react-icons/md";

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
  { id: 1, title: "Photos" },
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
  const userInfo = userData?.data;

  const { formData, updateFormData } = useFormData();
  const methods = useForm();
  const { handleSubmit, setValue, getValues } = methods;

  const [currentStep, setCurrentStep] = useState(0);
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([0]));
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
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
      const currentData = getValues();
      if (currentData.paymentMethodId) {
        submitFinalForm(currentData);
      }
    };

    window.addEventListener("paymentMethodCreated", handlePaymentMethodReady);
    return () => {
      window.removeEventListener(
        "paymentMethodCreated",
        handlePaymentMethodReady,
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getValues]);

  const handleTabNavigation = (index: number) => {
    const canNavigate = boatId || visitedSteps.has(index);

    if (canNavigate) {
      const currentData = getValues();
      updateFormData(currentData);
      setCurrentStep(index);
    } else {
      toast.warn("Please complete the current step first by clicking Next.");
    }
  };

  const handleNext = async (data: any) => {
    updateFormData(data);

    // Mark current step as completed
    setCompletedSteps((prev) => new Set([...prev, currentStep]));

    if (currentStep === 1 && !imageUrl && !isBoatImage) {
      return toast.error("Upload at least one image");
    }

    const lastStep = boatId ? 6 : 7;

    if (currentStep < lastStep) {
      const nextStep = currentStep + 1;

      setVisitedSteps((prev) => new Set([...prev, nextStep]));
      setCurrentStep(nextStep);
    } else {
      await submitFinalForm(data);
    }
  };

  const submitFinalForm = async (data: any) => {
    try {
      const getValue = (key: string) => formData?.[key] ?? data?.[key];

      const paymentMethodId =
        data?.paymentMethodId || getValue("paymentMethodId");

      if (!boatId && currentStep === 7) {
        if (!paymentMethodId) {
          window.dispatchEvent(new Event("createStripePaymentMethod"));
          return;
        }

        if (
          !data?.firstName ||
          !data?.lastName ||
          !data?.email ||
          !data?.mobile
        ) {
          return toast.error("Please fill in all required personal details");
        }
      }

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
          duration: 0,
          tripDays: [],
          departureTime: "",
          schedules: trip.schedules || [],
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

      const res = boatId
        ? await updateBoat({ boatInfo: finalData, id: boatId })
        : await createBoatFN(finalData);

      if (!boatId && res?.data?.success) {
        await updateProfileFN(fullPaymentInfo).unwrap();

        toast.success(res?.data?.message || "Boat created successfully!");

        if (res?.data?.data?.accessToken) {
          Cookies.set("token", res.data.data.accessToken);
          Cookies.set("currentUserRole", "CAPTAIN");
          dispatch(
            setUser({
              user: {
                id: userInfo?.id,
                name: `${userInfo?.firstName || ""} ${userInfo?.lastName || ""}`.trim(),
                email: userInfo?.email,
                role: "CAPTAIN",
              },
              token: res.data.data.accessToken,
              isAuthenticated: true,
            }),
          );
        }

        dispatch(clearPaymentMethodId());
        dispatch(clearImageUrl());

        router.push("/success-boat-creation");
      } else if (res?.data?.success) {
        toast.success(res?.data?.message || "Boat updated successfully!");
        dispatch(clearImageUrl());
        router.push("/dashboard/boat-trip");
      }

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

  const getStepStatus = (step: number) => {
    if (step === currentStep) return "current";
    if (completedSteps.has(step)) return "completed";
    if (visitedSteps.has(step)) return "visited";
    return "upcoming";
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-xl bg-white shadow-lg">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Updated Multi-Step Header with Arrows */}
      <div className="flex-none bg-gradient-to-br from-orange-50 to-white border-b-2 border-orange-100">
        <div className="px-6 sm:px-8 lg:px-12 py-8">
          {/* Step Progress Bar */}
          <div className="relative mb-2">
            {/* Progress Line Background */}
            <div className="absolute top-6 left-0 w-full h-1 bg-gray-100 rounded-full" />

            {/* Active Progress Line */}
            <div
              className="absolute top-6 left-0 h-1 bg-gradient-to-r from-[#f2a93b] to-[#ff8c00] rounded-full transition-all duration-500 ease-in-out"
              style={{
                width: `${(currentStep / (tabs.length - 1)) * 100}%`,
              }}
            />

            {/* Steps */}
            <div className="relative flex justify-between">
              {tabs.map((tab, index) => {
                const status = getStepStatus(index);

                return (
                  <div key={tab.id} className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => handleTabNavigation(index)}
                      disabled={!boatId && status === "upcoming"}
                      className={`
                        relative z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center
                        transition-all duration-300 font-bold text-base sm:text-lg shadow-md hover:shadow-lg
                        ${status === "completed" && "bg-gradient-to-br from-[#f2a93b] to-[#e0962d] text-white scale-105"}
                        ${status === "current" && "bg-gradient-to-br from-[#f2a93b] to-[#ff8c00] text-white ring-4 ring-orange-200 scale-110 shadow-xl"}
                        ${status === "visited" && !completedSteps.has(index) && "bg-white border-3 border-[#f2a93b] text-[#f2a93b] hover:bg-orange-50"}
                        ${status === "upcoming" && "bg-white border-2 border-gray-300 text-gray-400 cursor-not-allowed opacity-50"}
                      `}
                    >
                      {status === "completed" ? (
                        <MdCheck size={24} className="font-bold" />
                      ) : (
                        index + 1
                      )}
                    </button>

                    {/* Step Title */}
                    <span
                      className={`
                        mt-3 text-xs sm:text-sm font-semibold text-center max-w-[80px] leading-tight
                        ${status === "completed" && "text-[#f2a93b]"}
                        ${status === "current" && "text-[#f2a93b] font-bold"}
                        ${status === "visited" && "text-gray-700"}
                        ${status === "upcoming" && "text-gray-400"}
                      `}
                    >
                      {tab.title}
                    </span>

                    {/* Arrow between steps (except last) */}
                    {index < tabs.length - 1 && (
                      <div className="hidden lg:block absolute -right-4 top-4 text-gray-300">
                        <MdKeyboardArrowRight size={24} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current Step Description */}
          <div className="mt-8 text-center sm:text-left bg-white rounded-lg p-6 shadow-sm border border-orange-100">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {currentHeading.title}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              {currentHeading.description}
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto lg:px-12 md:px-10 px-6 py-8">
        <RHFProvider {...methods}>
          <form
            onSubmit={handleSubmit(handleNext)}
            className="h-full flex flex-col"
          >
            <div className="flex-1 mb-6">{renderStepComponent()}</div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between border-t-2 border-gray-200 py-8 bg-gradient-to-r from-gray-50 to-white -mx-6 px-6 sm:-mx-10 sm:px-10 lg:-mx-12 lg:px-12">
              {currentStep > 0 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-2 border-2 border-gray-300 text-gray-700 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl hover:bg-gray-100 hover:border-gray-400 font-semibold text-base sm:text-lg transition-all shadow-sm hover:shadow-md"
                >
                  <MdKeyboardArrowLeft size={24} /> <span>Back</span>
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
                className={`
                  flex items-center gap-3 px-8 sm:px-14 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95
                  ${
                    (currentStep === 0 && !isLicenceImage) ||
                    (currentStep === 1 && !isBoatImage)
                      ? "bg-gray-300 cursor-not-allowed opacity-60"
                      : "bg-gradient-to-r from-[#f2a93b] to-[#ff8c00] hover:from-[#e0962d] hover:to-[#f77f00] text-white"
                  }
                `}
              >
                {currentStep === (boatId ? 6 : 7)
                  ? isLoading
                    ? "Processing..."
                    : "Confirm Listing"
                  : "Next"}
                <MdKeyboardArrowRight size={24} />
              </button>
            </div>
          </form>
        </RHFProvider>
      </div>
    </div>
  );
}
