"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Ship,
  Calendar,
  Users,
  MapPin,
  DollarSign,
  Sunrise,
  Timer,
  MailIcon,
  User2,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import CancelBookModal from "@/components/dashboard/modal/CancelBookModal";
import EmailModal from "@/components/dashboard/modal/SendEmailModal";
import { useCompleteTripMutation } from "@/redux/api/bookingApi";
import { toast } from "react-toastify";
import { Booking } from "../types/types";
import {
  formatDate,
  formatDepartureTime,
  formatCurrency,
  getStatusConfig,
} from "../utils/utils";

interface BookingCardProps {
  booking: Booking;
  showCancel?: boolean;
}

export default function BookingCard({
  booking,
  showCancel = false,
}: BookingCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const userRole = useSelector((state: RootState) => state.auth.user?.role);
  const [completeTrip, { isLoading: isCompleting }] = useCompleteTripMutation();

  const handleCompleteTrip = async () => {
    try {
      const res: any = await completeTrip(booking.id);
      if (res?.data?.success) {
        toast.success(res.data.message ?? "Trip marked complete & payout sent");
      } else {
        const msg = res?.error?.data?.message ?? "Failed to complete trip";
        toast.error(msg);
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to complete trip");
    }
  };

  const {
    trip,
    boat,
    status,
    tripDate,
    bookingType,
    groupSize,
    payFirst,
    payDue,
    totalPrice,
    depositAmount,
    remainingAmount,
    id,
    userId,
  } = booking;

  // Resolve payment figures — prefer new deposit fields over legacy payFirst/payDue
  const paidAmount = depositAmount ?? payFirst ?? 0;
  const dueAmount = remainingAmount ?? payDue ?? 0;
  const totalAmount = totalPrice ?? (paidAmount + dueAmount);
  const isDepositBooking = depositAmount != null && remainingAmount != null;
  const depositPct = totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0;

  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;
  const captain = boat?.captain;
  const photo = boat?.photos?.[0]?.url;
  const meetingPoint = boat?.meetingPoint?.[0];

  return (
    <>
      <CancelBookModal
        isOpen={isModalOpen}
        id={id}
        onClose={() => setIsModalOpen(false)}
      />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all">
        <div className="flex flex-col lg:flex-row">
          {/* Image Section */}
          <div className="relative lg:w-72 h-52 lg:h-auto bg-gray-100 flex-shrink-0">
            {photo && !imgError ? (
              <Image
                src={photo}
                alt={trip?.tripName || "Trip"}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 288px"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Ship className="h-12 w-12 text-gray-300" />
              </div>
            )}

            {/* Booking Type Badge */}
            <div className="absolute top-3 left-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide shadow-sm ${
                  bookingType === "PRIVATE"
                    ? "bg-purple-600 text-white"
                    : "bg-blue-600 text-white"
                }`}
              >
                {bookingType}
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-5 lg:p-6">
            {/* Header: Name + Status */}
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {trip?.tripName || "N/A"}
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  {boat?.boatType || "Boat"}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
              >
                <StatusIcon className="h-3.5 w-3.5" />
                {statusConfig.label}
              </span>
            </div>

            {/* Trip Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 text-sm mb-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span>{formatDate(tripDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Sunrise className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span>Departs {formatDepartureTime(trip?.departureTime)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Timer className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span>{trip?.duration || 0} hours</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span>
                  {groupSize || 1} guest{(groupSize || 1) !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-2 text-green-600 font-medium">
                <DollarSign className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span>{formatCurrency(trip?.price)}</span>
              </div>
              {meetingPoint?.city && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{meetingPoint.city}</span>
                </div>
              )}
            </div>

            {/* Captain/Customer + Payment Row */}
            <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-gray-100">
              {/* Customer info (for captain view) */}
              {userRole === "CAPTAIN" && userId && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-xs font-semibold">
                    <User2 />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Customer
                    </p>
                    <p className="text-xs text-gray-500">
                      Booking ID: {id.slice(0, 8)}
                    </p>
                  </div>
                </div>
              )}

              {/* Captain info (for user view) */}
              {userRole !== "CAPTAIN" && captain && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-xs font-semibold">
                    <User2 />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {captain.firstName} {captain.lastName}
                    </p>
                    <p className="text-xs text-gray-500">Captain</p>
                  </div>
                </div>
              )}

              {/* Payment Summary */}
              <div className="flex items-center gap-3 ml-auto">
                {paidAmount > 0 && (
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {isDepositBooking ? `Deposit paid (${depositPct}%)` : "Paid"}
                    </p>
                    <p className="text-sm font-semibold text-emerald-600">
                      {formatCurrency(paidAmount)}
                    </p>
                  </div>
                )}
                {dueAmount > 0 && (
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Due on trip day</p>
                    <p className="text-sm font-semibold text-red-500">
                      {formatCurrency(dueAmount)}
                    </p>
                  </div>
                )}
                {isDepositBooking && totalAmount > 0 && (
                  <div className="w-20">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-emerald-500 h-1.5 rounded-full"
                        style={{ width: `${depositPct}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 text-right">{depositPct}% paid</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 hover:text-blue-700 transition-all group">
                <MailIcon className="w-5 h-5 text-blue-600" />
                <EmailModal
                  reciverId={
                    userRole === "CAPTAIN" ? userId : captain?.id || ""
                  }
                />
              </div>
              {showCancel && status !== "CANCEL" && status !== "COMPLETE" && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-all"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Cancel Booking
                </button>
              )}
              {userRole === "CAPTAIN" &&
                status !== "CANCEL" &&
                status !== "COMPLETE" && (
                  <button
                    onClick={handleCompleteTrip}
                    disabled={isCompleting}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-all disabled:opacity-50"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {isCompleting ? "Completing..." : "Mark Trip Complete"}
                  </button>
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
