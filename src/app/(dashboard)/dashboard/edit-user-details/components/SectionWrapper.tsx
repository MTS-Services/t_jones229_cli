"use client";

import React from "react";
import { MdKeyboardArrowRight, MdSave, MdEdit } from "react-icons/md";

interface SectionWrapperProps {
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
  hasChanges: boolean;
  isEditing: boolean;
  isUpdating: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function SectionWrapper({
  title,
  description,
  icon: Icon,
  children,
  hasChanges,
  isEditing,
  isUpdating,
  onEdit,
  onSave,
  onCancel,
}: SectionWrapperProps) {
  return (
    <div
      className={`
      bg-white rounded-2xl p-4 sm:p-6 shadow-sm border-2 transition-all duration-300
      ${
        isEditing
          ? "border-[#FF9500] shadow-lg shadow-[#FF9500]/10"
          : "border-gray-100 hover:border-gray-200"
      }
    `}
    >
      {/* Section Header */}
      <div className="flex items-start justify-between mb-4 sm:mb-6 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div
            className={`
            p-2 sm:p-3 rounded-xl flex-shrink-0 transition-all duration-300
            ${
              isEditing
                ? "bg-[#FF9500] text-white"
                : "bg-[#FF9500]/10 text-[#FF9500]"
            }
          `}
          >
            <Icon className="size-5 sm:size-6" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-800 leading-tight">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">{description}</p>
          </div>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={onEdit}
            className={`
              flex-shrink-0 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl
              transition-all duration-300
              ${
                hasChanges
                  ? "bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
              }
            `}
          >
            <MdEdit className="size-4" />
            <span className="text-xs sm:text-sm font-medium hidden xs:inline sm:inline">
              {hasChanges ? "Changes Ready" : `Edit ${title}`}
            </span>
            {hasChanges && (
              <span className="size-2 bg-green-500 rounded-full animate-pulse" />
            )}
          </button>
        )}
      </div>

      {/* Section Content */}
      <div className="w-full">{children}</div>

      {/* Section Actions */}
      {isEditing && (
        <div className="mt-4 sm:mt-6 pt-4 border-t border-gray-100 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-6 py-2.5 text-gray-600 font-medium rounded-xl hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={!hasChanges || isUpdating}
            className={`
              w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 
              bg-[#FF9500] text-white font-medium 
              rounded-xl shadow-lg shadow-[#FF9500]/25
              transition-all duration-300
              hover:bg-[#E08500] hover:shadow-xl
              disabled:opacity-50 disabled:cursor-not-allowed
              group
            `}
          >
            {isUpdating ? (
              <>
                <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <MdSave className="size-4 group-hover:scale-110 transition-transform" />
                <span>Save {title}</span>
                <MdKeyboardArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
