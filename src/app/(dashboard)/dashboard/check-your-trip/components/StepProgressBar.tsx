import { MdKeyboardArrowRight, MdCheck } from "react-icons/md";
import { Tab, StepStatus, StepHeading } from "../types/types";
import { TABS } from "../utils/utils";

interface StepProgressBarProps {
  currentStep: number;
  completedSteps: Set<number>;
  visitedSteps: Set<number>;
  boatId: string | null;
  onTabClick: (index: number) => void;
  heading: StepHeading;
}

export default function StepProgressBar({
  currentStep,
  completedSteps,
  visitedSteps,
  boatId,
  onTabClick,
  heading,
}: StepProgressBarProps) {
  const getStepStatus = (step: number): StepStatus => {
    if (step === currentStep) return "current";
    if (completedSteps.has(step)) return "completed";
    if (visitedSteps.has(step)) return "visited";
    return "upcoming";
  };

  return (
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
              width: `${(currentStep / (TABS.length - 1)) * 100}%`,
            }}
          />

          {/* Step Circles */}
          <div className="relative flex justify-between">
            {TABS.map((tab: Tab, index: number) => {
              const status = getStepStatus(index);
              return (
                <div key={tab.id} className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => onTabClick(index)}
                    disabled={!boatId && status === "upcoming"}
                    className={`
                      relative z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center
                      transition-all duration-300 font-bold text-base sm:text-lg shadow-md hover:shadow-lg
                      ${status === "completed" ? "bg-gradient-to-br from-[#f2a93b] to-[#e0962d] text-white scale-105" : ""}
                      ${status === "current" ? "bg-gradient-to-br from-[#f2a93b] to-[#ff8c00] text-white ring-4 ring-orange-200 scale-110 shadow-xl" : ""}
                      ${status === "visited" && !completedSteps.has(index) ? "bg-white border-3 border-[#f2a93b] text-[#f2a93b] hover:bg-orange-50" : ""}
                      ${status === "upcoming" ? "bg-white border-2 border-gray-300 text-gray-400 cursor-not-allowed opacity-50" : ""}
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
                      ${status === "completed" ? "text-[#f2a93b]" : ""}
                      ${status === "current" ? "text-[#f2a93b] font-bold" : ""}
                      ${status === "visited" ? "text-gray-700" : ""}
                      ${status === "upcoming" ? "text-gray-400" : ""}
                    `}
                  >
                    {tab.title}
                  </span>

                  {/* Arrow between steps (except last) */}
                  {index < TABS.length - 1 && (
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
            {heading.title}
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            {heading.description}
          </p>
        </div>
      </div>
    </div>
  );
}
