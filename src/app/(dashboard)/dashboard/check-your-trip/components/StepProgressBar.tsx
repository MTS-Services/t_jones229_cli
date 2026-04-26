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
      <div className="px-2 md:px-6 lg:px-12 py-5 md:py-8">
        {/* ── MOBILE: compact step indicator (current / total + title) ── */}
        <div className="flex md:hidden items-center gap-3 mb-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#f2a93b] to-[#ff8c00] text-white flex items-center justify-center font-bold text-sm shadow-md ring-4 ring-orange-200">
              {currentStep + 1}
            </div>
            <span className="text-xs text-gray-400 font-medium">
              / {TABS.length}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-900 leading-tight">
              {TABS[currentStep]?.title}
            </p>
            <p className="text-xs text-gray-500 leading-tight mt-0.5">
              {heading.description}
            </p>
          </div>
        </div>

        {/* ── MOBILE: scrollable dot track ── */}
        <div className="hidden pb-1 gap-1 mb-4">
          {TABS.map((tab: Tab, index: number) => {
            const status = getStepStatus(index);
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabClick(index)}
                disabled={!boatId && status === "upcoming"}
                className={`
                  flex-shrink-0 flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-all duration-200
                  ${status === "current" ? "bg-orange-50" : ""}
                  ${status === "upcoming" ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                <div
                  className={`
                    w-7 h-7 rounded-full flex items-center justify-center border-2 font-bold text-xs shadow-sm
                    ${status === "completed" ? "bg-gradient-to-br from-[#f2a93b] to-[#e0962d] text-white border-[#e0962d]" : ""}
                    ${status === "current" ? "bg-gradient-to-br from-[#f2a93b] to-[#ff8c00] text-white border-[#ff8c00] ring-2 ring-orange-200" : ""}
                    ${status === "visited" && !completedSteps.has(index) ? "bg-white border-[#f2a93b] text-[#f2a93b]" : ""}
                    ${status === "upcoming" ? "bg-white border-gray-300 text-gray-400" : ""}
                  `}
                >
                  {status === "completed" ? <MdCheck size={12} /> : index + 1}
                </div>
                <span
                  className={`
                    text-[9px] font-semibold leading-tight text-center w-12 truncate
                    ${status === "current" ? "text-[#f2a93b]" : "text-gray-400"}
                  `}
                >
                  {tab.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── MOBILE: progress bar strip ── */}
        <div className="flex md:hidden h-1.5 bg-gray-200 rounded-full overflow-hidden mb-1">
          <div
            className="h-full bg-gradient-to-r from-[#f2a93b] to-[#ff8c00] rounded-full transition-all duration-700 ease-out"
            style={{ width: `${(currentStep / (TABS.length - 1)) * 100}%` }}
          />
        </div>

        {/* ── DESKTOP: full step progress bar ── */}
        <div className="hidden md:block relative mb-6">
          {/* Progress Line Background */}
          <div
            className="absolute top-5 h-0.5 bg-gray-200 rounded-full"
            style={{ left: "50px", right: "50px", width: "calc(100% - 100px)" }}
          />
          {/* Active Progress Line */}
          <div
            className="absolute top-5 h-0.5 bg-gradient-to-r from-[#f2a93b] to-[#ff8c00] rounded-full transition-all duration-700 ease-out"
            style={{
              left: "50px",
              width: `calc((100% - 100px) * ${currentStep} / ${TABS.length - 1})`,
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
                      relative z-10 w-10 h-10 rounded-full flex items-center justify-center
                      transition-all duration-300 font-bold shadow-lg hover:shadow-xl border-2
                      ${status === "completed" ? "bg-gradient-to-br from-[#f2a93b] to-[#e0962d] text-white border-[#e0962d] scale-105 hover:scale-110" : ""}
                      ${status === "current" ? "bg-gradient-to-br from-[#f2a93b] to-[#ff8c00] text-white border-[#ff8c00] ring-4 ring-orange-200 scale-110 hover:scale-115" : ""}
                      ${status === "visited" && !completedSteps.has(index) ? "bg-white border-[#f2a93b] text-[#f2a93b] hover:bg-orange-50" : ""}
                      ${status === "upcoming" ? "bg-white border-gray-300 text-gray-400 cursor-not-allowed opacity-60" : ""}
                    `}
                  >
                    {status === "completed" ? (
                      <MdCheck size={18} />
                    ) : (
                      <span className="text-sm font-bold">{index + 1}</span>
                    )}
                  </button>
                  <div className="mt-3 w-20 lg:w-24 flex justify-center">
                    <span
                      className={`
                        text-xs lg:text-sm font-semibold text-center leading-tight
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

        {/* Current Step Description - desktop only (mobile shows it inline above) */}
        <div className="hidden md:block mt-4 bg-white rounded-lg p-4 shadow-sm border border-orange-100">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            {heading.title}
          </h2>
          <p className="text-base text-gray-500 leading-relaxed">
            {heading.description}
          </p>
        </div>
      </div>
    </div>
  );
}
