"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  User,
  Anchor,
  Clock,
  DollarSign,
  MapPin,
  Calendar,
} from "lucide-react";
import { Booking } from "../types/types";
import { getStatusBadgeColor, getBookingTypeColor } from "../utils/utils";

interface BookingCardProps {
  booking: Booking;
  variant?: "default" | "compact";
  onClick?: (booking: Booking) => void;
}

export function BookingCard({
  booking,
  variant = "default",
  onClick,
}: BookingCardProps) {
  const trip = booking?.boat?.trips[0];
  const captainName =
    booking?.boat?.captain?.firstName && booking?.boat?.captain?.lastName
      ? `${booking?.boat?.captain?.firstName} ${booking?.boat?.captain?.lastName}`
      : booking?.boat?.captain?.email;

  if (variant === "compact") {
    return (
      <div
        className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200 cursor-pointer"
        onClick={() => onClick?.(booking)}
      >
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <div>
            <p className="font-medium text-sm text-gray-900">
              {trip?.tripName}
            </p>
            <p className="text-xs text-gray-500">
              {booking?.user?.firstName} {booking?.user?.lastName}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={`text-xs ${getStatusBadgeColor(booking?.status)}`}>
            {booking?.status}
          </Badge>
          <span className="text-xs text-gray-500">{trip?.departureTime}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-4 border-b border-blue-100 rounded-xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <Anchor className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{trip?.tripName}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="secondary"
                  className={`text-xs px-3 py-0.5 ${getBookingTypeColor(booking?.bookingType)}`}
                >
                  {booking?.bookingType}
                </Badge>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-500">
                  ID: #{booking?.id?.slice(0, 8)}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              ${booking?.totalPrice ?? (booking?.payFirst + booking?.payDue)}
            </p>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Total
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="p-5">
        {/* Key info grid */}
        <div className="grid grid-cols-2 gap-5 mb-4">
          {/* Customer */}
          <div className="flex items-start gap-2">
            <div className="bg-blue-50 p-1.5 rounded-lg">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Customer</p>
              <p className="font-medium text-gray-900 text-sm">
                {booking?.user?.firstName} {booking?.user?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate max-w-[140px]">
                {booking?.user?.email}
              </p>
            </div>
          </div>

          {/* Captain */}
          <div className="flex items-start gap-2">
            <div className="bg-green-50 p-1.5 rounded-lg">
              <MapPin className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Captain</p>
              <p className="font-medium text-gray-900 text-sm">
                {captainName || "Not assigned"}
              </p>
              <p className="text-xs text-gray-500">Trip lead</p>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-start gap-2">
            <div className="bg-orange-50 p-1.5 rounded-lg">
              <Clock className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Departure</p>
              <p className="font-medium text-gray-900 text-sm">
                {trip?.departureTime}
              </p>
              <p className="text-xs text-gray-500">
                {trip?.duration}h duration
              </p>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-start gap-2">
            <div className="bg-purple-50 p-1.5 rounded-lg">
              <Calendar className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Trip Date</p>
              <p className="font-medium text-gray-900 text-sm">
                {new Date(booking?.tripDate)?.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(booking?.tripDate)?.toLocaleDateString("en-US", {
                  weekday: "short",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Payment section */}
        <div className="bg-gray-50 rounded-lg p-3 mt-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Payment Summary
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm">
                    <span className="font-semibold text-gray-900">
                      ${booking?.depositAmount ?? booking?.payFirst ?? 0}
                    </span>
                    <span className="text-gray-500 text-xs ml-1">paid</span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span className="text-sm">
                    <span className="font-semibold text-gray-900">
                      ${booking?.remainingAmount ?? booking?.payDue ?? 0}
                    </span>
                    <span className="text-gray-500 text-xs ml-1">due</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress bar for payment */}
          {(() => {
            const paid = booking?.depositAmount ?? booking?.payFirst ?? 0;
            const total = booking?.totalPrice ?? (paid + (booking?.remainingAmount ?? booking?.payDue ?? 0));
            return total > 0 ? (
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full"
                    style={{ width: `${(paid / total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ) : null;
          })()}
        </div>
      </div>
    </div>
  );
}
