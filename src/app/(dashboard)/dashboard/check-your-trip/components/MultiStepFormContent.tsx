"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, FormProvider as RHFProvider } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import Cookies from "js-cookie";

// Step form components (shared)
import Information from "@/components/List-boat-form/Information";
import PhotosVideos from "@/components/List-boat-form/PhotosVideos";
import Fishing from "@/components/List-boat-form/Fishing";
import MeetingPoint from "@/components/List-boat-form/MeetingPoint";
import MeetingPointMap from "@/components/List-boat-form/MeetingPointMap";
import Discription from "@/components/List-boat-form/Discription";
import Trips from "@/components/List-boat-form/Trips";
import Terms from "@/components/List-boat-form/Terms";

// Local sub-components
import StepProgressBar from "./StepProgressBar";
import StepNavigation from "./StepNavigation";

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

// Local utils
import { HEADINGS, buildFinalData, buildPaymentInfo } from "../utils/utils";

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
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([0]));
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isLicenceImage, setIsLicenceImage] = useState(false);
  const [isBoatImage, setIsBoatImage] = useState(false);
  const imageUrl = useSelector((state: RootState) => state.imageUrl.imageUrl);

  const [createBoatFN, { isLoading }] = useCreateBoatMutation();
  const [updateBoat] = useUpdateBoatMutation();
  const [updateProfileFN] = useUpdateProfileMutation();

  // Load existing form data into react-hook-form values
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

  // Listen for payment method creation success from Terms component
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
      updateFormData(getValues());
      setCurrentStep(index);
    } else {
      toast.warn("Please complete the current step first by clicking Next.");
    }
  };

  const handleNext = async (data: any) => {
    updateFormData(data);
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
      const paymentMethodId =
        data?.paymentMethodId ?? formData?.paymentMethodId ?? null;

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

      const finalData = buildFinalData(formData, data, boatId, paymentMethodId);
      const paymentInfo = buildPaymentInfo(data, formData);

      const res = boatId
        ? await updateBoat({ boatInfo: finalData, id: boatId })
        : await createBoatFN(finalData);

      if (!boatId && res?.data?.success) {
        await updateProfileFN(paymentInfo).unwrap();
        toast.success(res?.data?.message || "Boat created successfully!");

        if (res?.data?.data?.accessToken) {
          Cookies.set("token", res.data.data.accessToken);
          Cookies.set("currentUserRole", "CAPTAIN");
          dispatch(
            setUser({
              user: userInfo,
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
        const errData = (res.error as any)?.data || res.error;
        toast.error((errData as any)?.message || "Something went wrong");
        dispatch(clearPaymentMethodId());
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(error?.message || "Submission failed. Please try again.");
      dispatch(clearPaymentMethodId());
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

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
    <div className="">
      <ToastContainer position="top-right" autoClose={3000} />
      <StepProgressBar
        currentStep={currentStep}
        completedSteps={completedSteps}
        visitedSteps={visitedSteps}
        boatId={boatId}
        onTabClick={handleTabNavigation}
        heading={HEADINGS[currentStep]}
      />

      <div className="flex-1 overflow-y-auto lg:px-12 md:px-10 px-6 py-8">
        <RHFProvider {...methods}>
          <form
            onSubmit={handleSubmit(handleNext)}
            className="h-full flex flex-col"
          >
            <div className="flex-1 mb-6">{renderStepComponent()}</div>

            <div className="bg-white py-4 border-t border-orange-200 px-4 rounded-xl">
              <StepNavigation
                currentStep={currentStep}
                boatId={boatId}
                isLoading={isLoading}
                isLicenceImage={isLicenceImage}
                isBoatImage={isBoatImage}
                onBack={handleBack}
              />
            </div>
          </form>
        </RHFProvider>
      </div>
    </div>
  );
}
