"use client";

import { toast } from "react-toastify";
import { Ban, Trash2 } from "lucide-react";
import {
  AvailabilityBlock,
  useDeleteAvailabilityBlockMutation,
} from "@/redux/api/availabilityApi";

interface AvailabilityBlocksListProps {
  blocks: AvailabilityBlock[];
  onDeleted?: () => void;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getBlockLabel(block: AvailabilityBlock): string {
  const startDate = formatDate(block.startDateTime);
  const endDate = formatDate(block.endDateTime);

  if (block.isFullDay && startDate !== endDate) {
    return `${startDate} – ${endDate}`;
  }

  if (block.isFullDay) {
    return `Full day · ${startDate}`;
  }

  return `${formatTime(block.startDateTime)} – ${formatTime(block.endDateTime)} · ${startDate}`;
}

export default function AvailabilityBlocksList({
  blocks,
  onDeleted,
}: AvailabilityBlocksListProps) {
  const [deleteBlock, { isLoading }] = useDeleteAvailabilityBlockMutation();

  if (!blocks?.length) return null;

  const handleDelete = async (blockId: string) => {
    try {
      await deleteBlock(blockId).unwrap();
      toast.success("Block removed");
      onDeleted?.();
    } catch {
      toast.error("Failed to remove block");
    }
  };

  return (
    <div className="space-y-2 border-t border-gray-100 pt-4 mt-4">
      <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
        <Ban className="h-4 w-4 text-red-500" />
        Blocked Periods ({blocks.length})
      </h3>
      <div className="space-y-2">
        {blocks.map((block) => (
          <div
            key={block.id}
            className="flex items-center justify-between bg-red-50 border border-red-100 rounded-lg px-3 py-2"
          >
            <div className="text-sm">
              <span className="font-medium text-red-700">
                {getBlockLabel(block)}
              </span>
              {block.reason && (
                <p className="text-xs text-gray-500 mt-0.5">{block.reason}</p>
              )}
              {block.blockType === "MANUAL_ADMIN" && (
                <p className="text-xs text-orange-600 mt-0.5">Blocked by admin</p>
              )}
            </div>
            <button
              onClick={() => handleDelete(block.id)}
              disabled={isLoading}
              className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors"
              title="Remove block"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
