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
import { Booking } from "@/types/calenderTypes";

interface BookingCardProps {
  booking: Booking;
  variant?: "default" | "compact";
}

export function BookingCard({
  booking,
  variant = "default",
}: BookingCardProps) {
  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "CONFIRMED":
        return "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200";
      case "PENDING":
        return "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200 hover:bg-red-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200";
    }
  };

  const getBookingTypeColor = (type: string) => {
    return type === "PRIVATE"
      ? "bg-purple-100 text-purple-800 border-purple-200"
      : "bg-blue-100 text-blue-800 border-blue-200";
  };
  // need booking trip information
  const trip = booking?.boat?.trips[0];
  const captainName =
    booking?.boat?.captain?.firstName && booking?.boat?.captain?.lastName
      ? `${booking?.boat?.captain?.firstName} ${booking?.boat?.captain?.lastName}`
      : booking?.boat?.captain?.email;

  if (variant === "compact") {
    return (
      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200">
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
          <Badge className={`text-xs ${getStatusColor(booking?.status)}`}>
            {booking?.status}
          </Badge>
          <span className="text-xs text-gray-500">{trip?.departureTime}</span>
        </div>
      </div>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-gradient-to-br from-white to-gray-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Anchor className="h-5 w-5 text-blue-600" />
              {trip?.tripName}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`text-xs ${getBookingTypeColor(
                  booking?.bookingType
                )}`}
              >
                {booking?.bookingType}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              ${booking?.payFirst + booking?.payDue}
            </p>
            <p className="text-xs text-gray-500">Total Amount</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <User className="h-4 w-4 text-blue-500" />
            <div>
              <p className="font-medium">
                {booking?.user?.firstName} {booking?.user?.lastName}
              </p>
              <p className="text-xs text-gray-500">{booking?.user?.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-green-500" />
            <div>
              <p className="font-medium">Captain</p>
              <p className="text-xs text-gray-500">{captainName}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4 text-orange-500" />
            <div>
              <p className="font-medium">{trip?.departureTime}</p>
              <p className="text-xs text-gray-500">
                {trip?.duration}h duration
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4 text-purple-500" />
            <div>
              <p className="font-medium">
                {new Date(booking?.tripDate)?.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <p className="text-xs text-gray-500">Trip Date</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-600">
                ${booking?.payFirst}
              </span>
              <span className="text-gray-500">paid</span>
            </div>
            <div className="flex items-center space-x-1">
              <DollarSign className="h-4 w-4 text-orange-600" />
              <span className="font-medium text-orange-600">
                ${booking?.payDue}
              </span>
              <span className="text-gray-500">due</span>
            </div>
          </div>

          <Button size="sm" variant="outline" className="text-xs">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
