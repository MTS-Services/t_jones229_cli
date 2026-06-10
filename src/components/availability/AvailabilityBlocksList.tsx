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
  /** When false, captains cannot delete admin-created blocks */
  allowDeleteAdminBlocks?: boolean;
}

/** Format stored block/booking instants as wall-clock HH:mm (matches trip schedule strings on UTC server) */
export function formatWallClockTime(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  const h = String(d.getUTCHours()).padStart(2, "0");
  const m = String(d.getUTCMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

/** Format stored block/booking instants as calendar date (UTC wall-clock day) */
export function formatWallClockDate(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function getBlockLabel(block: AvailabilityBlock): string {
  const startDate = formatWallClockDate(block.startDateTime);
  const endDate = formatWallClockDate(block.endDateTime);

  if (block.isFullDay && startDate !== endDate) {
    return `${startDate} – ${endDate}`;
  }

  if (block.isFullDay) {
    return `Full day · ${startDate}`;
  }

  return `${formatWallClockTime(block.startDateTime)} – ${formatWallClockTime(block.endDateTime)} · ${startDate}`;
}

export default function AvailabilityBlocksList({
  blocks,
  onDeleted,
  allowDeleteAdminBlocks = true,
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
        {blocks.map((block) => {
          const isAdminBlock = block.blockType === "MANUAL_ADMIN";
          const canDelete = allowDeleteAdminBlocks || !isAdminBlock;

          return (
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
              {isAdminBlock && (
                <p className="text-xs text-orange-600 mt-0.5">
                  Blocked by admin — cannot be removed
                </p>
              )}
            </div>
            {canDelete ? (
              <button
                onClick={() => handleDelete(block.id)}
                disabled={isLoading}
                className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors"
                title="Remove block"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            ) : (
              <span className="rounded-md bg-orange-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-orange-700">
                Admin
              </span>
            )}
          </div>
        );
        })}
      </div>
    </div>
  );
}
