"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useGetMyBoatQuery } from "@/redux/api/boatApi";
import {
  useCreateTripScheduleSlotMutation,
  useDeleteTripScheduleSlotMutation,
  useGetCaptainScheduledTimesQuery,
  useUpdateTripScheduleSlotMutation,
  type CaptainScheduledTime,
} from "@/redux/api/availabilityApi";

const TIME_OPTIONS = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00",
];

interface TripScheduleDayManagerProps {
  date: string;
  onSuccess?: () => void;
}

function isRealScheduleId(id: string) {
  return id && !id.startsWith("legacy-");
}

export default function TripScheduleDayManager({
  date,
  onSuccess,
}: TripScheduleDayManagerProps) {
  const today = new Date().toISOString().split("T")[0];
  const isPastDate = date < today;

  const { data: boatsData, isLoading: loadingBoats } = useGetMyBoatQuery({});
  const trips = useMemo(() => {
    const boats = boatsData?.data ?? [];
    return boats.flatMap((boat: any) =>
      (boat.trips ?? []).map((trip: any) => ({
        id: trip.id as string,
        tripName: trip.tripName as string,
        boatName: boat.boatName ?? boat.name ?? "Boat",
      })),
    );
  }, [boatsData]);

  const [selectedTripId, setSelectedTripId] = useState<string>("");
  const [newStartTime, setNewStartTime] = useState("08:00");
  const [newEndTime, setNewEndTime] = useState("12:00");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStart, setEditStart] = useState("08:00");
  const [editEnd, setEditEnd] = useState("12:00");

  const {
    data: scheduledTimes = [],
    isFetching: loadingTimes,
    refetch,
  } = useGetCaptainScheduledTimesQuery(
    { date },
    { skip: !date, refetchOnMountOrArgChange: true },
  );

  const [createSlot, { isLoading: creating }] =
    useCreateTripScheduleSlotMutation();
  const [updateSlot, { isLoading: updating }] =
    useUpdateTripScheduleSlotMutation();
  const [deleteSlot, { isLoading: deleting }] =
    useDeleteTripScheduleSlotMutation();

  useEffect(() => {
    if (trips.length === 0) {
      setSelectedTripId("");
      return;
    }
    if (!selectedTripId || !trips.some((t) => t.id === selectedTripId)) {
      setSelectedTripId(trips[0].id);
    }
  }, [trips, selectedTripId]);

  useEffect(() => {
    setEditingId(null);
  }, [date, selectedTripId]);

  const filteredSlots = useMemo(() => {
    if (!selectedTripId) return scheduledTimes;
    return scheduledTimes.filter((s) => s.tripId === selectedTripId);
  }, [scheduledTimes, selectedTripId]);

  const afterSave = () => {
    refetch();
    onSuccess?.();
  };

  const handleAddTime = async () => {
    if (isPastDate) {
      toast.error("Cannot add times on past dates");
      return;
    }
    if (!selectedTripId) {
      toast.error("Select a trip first");
      return;
    }
    if (newStartTime >= newEndTime) {
      toast.error("End time must be after start time");
      return;
    }

    try {
      await createSlot({
        tripId: selectedTripId,
        date,
        startTime: newStartTime,
        endTime: newEndTime,
      }).unwrap();
      toast.success("Available time added");
      afterSave();
    } catch (err: any) {
      toast.error(err?.data?.message || "Could not add time slot");
    }
  };

  const startEdit = (slot: CaptainScheduledTime) => {
    setEditingId(slot.scheduleId);
    setEditStart(slot.startTime);
    setEditEnd(slot.endTime);
  };

  const handleSaveEdit = async (scheduleId: string) => {
    if (editStart >= editEnd) {
      toast.error("End time must be after start time");
      return;
    }
    try {
      await updateSlot({
        scheduleId,
        startTime: editStart,
        endTime: editEnd,
      }).unwrap();
      toast.success("Time updated");
      setEditingId(null);
      afterSave();
    } catch (err: any) {
      toast.error(err?.data?.message || "Could not update time slot");
    }
  };

  const handleDelete = async (slot: CaptainScheduledTime) => {
    if (!isRealScheduleId(slot.scheduleId)) {
      toast.error("Edit this trip's default schedule in Check Your Trip");
      return;
    }
    if (slot.booked) {
      toast.error("Cancel the booking first before removing this time");
      return;
    }
    try {
      await deleteSlot(slot.scheduleId).unwrap();
      toast.success("Time removed");
      afterSave();
    } catch (err: any) {
      toast.error(err?.data?.message || "Could not remove time slot");
    }
  };

  const selectedTrip = trips.find((t) => t.id === selectedTripId);
  const isSaving = creating || updating || deleting;

  return (
    <section className="mt-4 space-y-4 border-t border-gray-100 pt-4">
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <Clock className="h-4 w-4 text-[#035292]" />
          Trip times on this date
        </h3>
        <p className="mt-1 text-xs text-gray-500">
          Add, edit, or remove available times. Cancelled bookings reopen the
          slot automatically.
        </p>
      </div>

      {loadingBoats ? (
        <p className="text-xs text-gray-500">Loading your trips...</p>
      ) : trips.length === 0 ? (
        <p className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          No trips found. Create a trip in Check Your Trip first.
        </p>
      ) : (
        <>
          {trips.length > 1 && (
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                Trip
              </label>
              <select
                value={selectedTripId}
                onChange={(e) => setSelectedTripId(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              >
                {trips.map((trip) => (
                  <option key={trip.id} value={trip.id}>
                    {trip.tripName} ({trip.boatName})
                  </option>
                ))}
              </select>
            </div>
          )}

          {trips.length === 1 && selectedTrip && (
            <p className="text-xs text-gray-600">
              Trip: <span className="font-medium">{selectedTrip.tripName}</span>
            </p>
          )}

          {loadingTimes ? (
            <p className="text-xs text-gray-500">Loading times...</p>
          ) : filteredSlots.length === 0 ? (
            <p className="text-xs text-gray-500">
              No times on this date for this trip yet. Add one below.
            </p>
          ) : (
            <div className="space-y-2">
              {filteredSlots.map((slot) => {
                const editable = isRealScheduleId(slot.scheduleId);
                const isEditing = editingId === slot.scheduleId;

                return (
                  <div
                    key={slot.scheduleId}
                    className={`rounded-lg border p-3 ${
                      slot.booked
                        ? "border-blue-200 bg-blue-50"
                        : slot.blocked
                          ? "border-red-200 bg-red-50"
                          : "border-gray-200 bg-white"
                    }`}
                  >
                    {isEditing ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <select
                          value={editStart}
                          onChange={(e) => setEditStart(e.target.value)}
                          className="rounded border border-gray-200 px-2 py-1.5 text-sm"
                        >
                          {TIME_OPTIONS.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                        <span className="text-gray-400">to</span>
                        <select
                          value={editEnd}
                          onChange={(e) => setEditEnd(e.target.value)}
                          className="rounded border border-gray-200 px-2 py-1.5 text-sm"
                        >
                          {TIME_OPTIONS.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          disabled={isSaving}
                          onClick={() => handleSaveEdit(slot.scheduleId)}
                          className="rounded-lg bg-[#035292] px-3 py-1.5 text-xs font-medium text-white"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {slot.startTime} – {slot.endTime}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {slot.tripName}
                            {slot.booked && " · Booked"}
                            {slot.blockedBy === "captain" &&
                              " · Blocked by you"}
                            {slot.blockedBy === "admin" && " · Blocked by admin"}
                            {slot.blocked && !slot.blockedBy && " · Blocked"}
                          </p>
                        </div>
                        {editable && !isPastDate && (
                          <div className="flex items-center gap-1">
                            {!slot.booked && (
                              <button
                                type="button"
                                disabled={isSaving}
                                onClick={() => startEdit(slot)}
                                className="rounded px-2 py-1 text-xs text-[#035292] hover:bg-blue-50"
                              >
                                Edit
                              </button>
                            )}
                            <button
                              type="button"
                              disabled={isSaving || slot.booked}
                              onClick={() => handleDelete(slot)}
                              className="rounded p-1.5 text-red-500 hover:bg-red-50 disabled:opacity-40"
                              title={
                                slot.booked
                                  ? "Cancel booking first"
                                  : "Delete time"
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {!isPastDate && (
            <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
              <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <Plus className="h-4 w-4 text-[#035292]" />
                Add new available time
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Start time
                  </label>
                  <select
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  >
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    End time
                  </label>
                  <select
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  >
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={isSaving || !selectedTripId}
                  onClick={handleAddTime}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#035292] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#024070] disabled:opacity-50"
                >
                  {creating ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          )}

          {isPastDate && (
            <p className="text-xs text-gray-500">
              Past date — times are shown for reference only.
            </p>
          )}
        </>
      )}
    </section>
  );
}
