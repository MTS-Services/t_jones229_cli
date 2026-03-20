import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { TABS } from "../utils/utils";

interface StepNavigationProps {
  currentStep: number;
  boatId: string | null;
  isLoading: boolean;
  isLicenceImage: boolean;
  isBoatImage: boolean;
  onBack: () => void;
}

export default function StepNavigation({
  currentStep,
  boatId,
  isLoading,
  isLicenceImage,
  isBoatImage,
  onBack,
}: StepNavigationProps) {
  const lastStep = boatId ? 6 : 7;
  const isLastStep = currentStep === lastStep;

  const isDisabled =
    isLoading ||
    (currentStep === 0 && !isLicenceImage) ||
    (currentStep === 1 && !isBoatImage);

  return (
    <div className="flex items-center justify-end gap-4 ">
      {currentStep > 0 ? (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 border-2 border-gray-300 text-gray-700 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl hover:bg-gray-100 hover:border-gray-200 font-semibold text-base sm:text-lg transition-all shadow-sm hover:shadow-md"
        >
          <MdKeyboardArrowLeft size={24} />
          <span>Back</span>
        </button>
      ) : (
        <div />
      )}

      <button
        type="submit"
        disabled={isDisabled}
        className={`
          flex items-center gap-2 px-8 sm:px-8 py-3 sm:py-3.5 rounded-xl font-bold text-base sm:text-lg
          transition-all shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95
          ${
            isDisabled
              ? "bg-gray-300 cursor-not-allowed opacity-60"
              : "bg-gradient-to-r from-[#f2a93b] to-[#ff8c00] hover:from-[#e0962d] hover:to-[#f77f00] text-white"
          }
        `}
      >
        {isLastStep ? (isLoading ? "Processing..." : "Confirm") : "Next"}
        <MdKeyboardArrowRight size={24} />
      </button>
    </div>
  );
}
