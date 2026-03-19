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
    <div className="flex items-center justify-between border-t-2 border-gray-200 py-8 bg-gradient-to-r from-gray-50 to-white -mx-6 px-6 sm:-mx-10 sm:px-10 lg:-mx-12 lg:px-12">
      {currentStep > 0 ? (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 border-2 border-gray-300 text-gray-700 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl hover:bg-gray-100 hover:border-gray-400 font-semibold text-base sm:text-lg transition-all shadow-sm hover:shadow-md"
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
          flex items-center gap-3 px-8 sm:px-14 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg
          transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95
          ${
            isDisabled
              ? "bg-gray-300 cursor-not-allowed opacity-60"
              : "bg-gradient-to-r from-[#f2a93b] to-[#ff8c00] hover:from-[#e0962d] hover:to-[#f77f00] text-white"
          }
        `}
      >
        {isLastStep
          ? isLoading
            ? "Processing..."
            : "Confirm Listing"
          : "Next"}
        <MdKeyboardArrowRight size={24} />
      </button>
    </div>
  );
}
