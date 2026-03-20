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
    <div className="flex-none bg-gradient-to-br from-orange-100 to-white border-b-2 border-orange-200 rounded-xl">
      <div className="px-6 sm:px-8 lg:px-12 py-8">
        {/* Step Progress Bar */}
        <div className="relative mb-6">
          {/* Progress Line Background - properly centered with circles */}
          <div
            className="absolute top-4 sm:top-5 left-0 w-full h-0.5 bg-gray-200 rounded-full"
            style={{ left: "50px", right: "50px", width: "calc(100% - 100px)" }}
          />

          {/* Active Progress Line - properly aligned */}
          <div
            className="absolute top-4 sm:top-5 h-0.5 bg-gradient-to-r from-[#f2a93b] to-[#ff8c00] rounded-full transition-all duration-700 ease-out"
            style={{
              left: "50px",
              width: `calc((100% - 100px) * ${currentStep} / ${TABS.length - 1})`,
            }}
          />

          {/* Step Circles Container */}
          <div className="relative flex justify-between">
            {TABS.map((tab: Tab, index: number) => {
              const status = getStepStatus(index);
              return (
                <div key={tab.id} className="flex flex-col items-center">
                  {/* Step Circle */}
                  <button
                    type="button"
                    onClick={() => onTabClick(index)}
                    disabled={!boatId && status === "upcoming"}
                    className={`
                      relative z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                      transition-all duration-300 font-bold shadow-lg hover:shadow-xl border-2
                      ${
                        status === "completed"
                          ? "bg-gradient-to-br from-[#f2a93b] to-[#e0962d] text-white border-[#e0962d] transform scale-105 hover:scale-110"
                          : ""
                      }
                      ${
                        status === "current"
                          ? "bg-gradient-to-br from-[#f2a93b] to-[#ff8c00] text-white border-[#ff8c00] ring-4 ring-orange-200 transform scale-110 hover:scale-115"
                          : ""
                      }
                      ${
                        status === "visited" && !completedSteps.has(index)
                          ? "bg-white border-[#f2a93b] text-[#f2a93b] hover:bg-orange-50 hover:border-orange-400"
                          : ""
                      }
                      ${
                        status === "upcoming"
                          ? "bg-white border-gray-300 text-gray-400 cursor-not-allowed opacity-60"
                          : ""
                      }
                    `}
                  >
                    {status === "completed" ? (
                      <MdCheck size={16} className="sm:w-5 sm:h-5" />
                    ) : (
                      <span className="text-xs sm:text-sm font-bold">
                        {index + 1}
                      </span>
                    )}
                  </button>

                  {/* Step Title - better alignment and spacing */}
                  <div className="mt-3 w-20 sm:w-24 flex justify-center">
                    <span
                      className={`
                        text-xs sm:text-sm font-semibold text-center leading-tight
                        ${status === "completed" ? "text-[#f2a93b]" : ""}
                        ${status === "current" ? "text-[#f2a93b] font-bold" : ""}
                        ${status === "visited" ? "text-gray-700" : ""}
                        ${status === "upcoming" ? "text-gray-400" : ""}
                      `}
                    >
                      {tab.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Step Description */}
        <div className="mt-4 text-center sm:text-left bg-white rounded-lg p-4 shadow-sm border border-orange-100">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            {heading.title}
          </h2>
          <p className="text-base sm:text-lg text-gray-500 leading-relaxed">
            {heading.description}
          </p>
        </div>
      </div>
    </div>
  );
}
