"use client";

import { useParams, useRouter } from "next/navigation";
import {
  useGetBookingQuery,
  useCancelBookingMutation,
} from "@/redux/api/bookingApi";
import {
  ArrowLeft,
  Calendar,
  Users,
  Ship,
  User,
  CreditCard,
  Clock,
  MapPin,
  Phone,
  Mail,
  Anchor,
  Fish,
  Camera,
  FileText,
  DollarSign,
  Activity,
  Copy,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import StatusButton from "../button/StatusButton";
import { useState } from "react";

/* ── helpers ── */

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTime(raw: string) {
  const num = parseInt(raw, 10);
  if (isNaN(num)) return raw;
  const h = num % 12 || 12;
  const ampm = num >= 12 ? "PM" : "AM";
  return `${h}:00 ${ampm}`;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function getStatusConfig(status: string) {
  switch (status?.toUpperCase()) {
    case "CONFIRMED":
    case "COMPLETE":
      return {
        color: "#10B981",
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        icon: CheckCircle,
      };
    case "PENDING":
      return {
        color: "#F59E0B",
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        icon: AlertCircle,
      };
    case "CANCELLED":
    case "CANCEL":
      return {
        color: "#EF4444",
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
        icon: XCircle,
      };
    default:
      return {
        color: "#6B7280",
        bg: "bg-gray-50",
        text: "text-gray-700",
        border: "border-gray-200",
        icon: AlertCircle,
      };
  }
}

function getPaymentConfig(status: string) {
  switch (status?.toUpperCase()) {
    case "PAID":
      return {
        color: "#10B981",
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
      };
    case "UNPAID":
      return {
        color: "#F59E0B",
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
      };
    case "PARTIAL":
      return {
        color: "#3B82F6",
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
      };
    default:
      return {
        color: "#6B7280",
        bg: "bg-gray-50",
        text: "text-gray-700",
        border: "border-gray-200",
      };
  }
}

/* ── sub-components ── */

function Skeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-5 w-28 bg-gray-200 rounded" />
      <div className="h-8 w-56 bg-gray-200 rounded" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-200 p-6"
            >
              <div className="h-5 w-36 bg-gray-200 rounded mb-5" />
              <div className="grid grid-cols-2 gap-5">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j}>
                    <div className="h-3 w-16 bg-gray-200 rounded mb-2" />
                    <div className="h-5 w-28 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-200 p-6"
            >
              <div className="h-5 w-28 bg-gray-200 rounded mb-5" />
              <div className="space-y-4">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-5 w-full bg-gray-200 rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number | null | undefined;
  icon?: any;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-900">{value || "—"}</p>
    </div>
  );
}

function Card({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
          <Icon className="w-4 h-4 text-orange-600" />
        </div>
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function Badge({
  label,
  config,
}: {
  label: string;
  config: { bg: string; text: string; border: string };
}) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}
    >
      {label}
    </span>
  );
}

/* ── main component ── */

export default function TripsDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [copied, setCopied] = useState(false);

  const { data, isLoading, error } = useGetBookingQuery(id);
  const [cancelBooking, { isLoading: isCancelling }] =
    useCancelBookingMutation();
  const booking = data?.data;

  const copyId = () => {
    navigator.clipboard.writeText(booking?.id || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCancel = async () => {
    if (
      !booking ||
      booking.status === "CANCEL" ||
      booking.status === "CANCELLED"
    )
      return;
    if (
      !confirm(
        "Are you sure you want to cancel this booking? This will trigger a refund.",
      )
    )
      return;
    await cancelBooking(booking.id);
  };

  if (isLoading) return <Skeleton />;

  if (error || !booking) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto">
            <XCircle className="w-7 h-7 text-red-500" />
          </div>
          <p className="text-gray-600">Unable to load booking details.</p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
      </div>
    );
  }

  const statusCfg = getStatusConfig(booking.status);
  const paymentCfg = getPaymentConfig(booking.paymentStatus);
  const total = (booking.payFirst || 0) + (booking.payDue || 0);
  const paidPercent =
    total > 0 ? Math.round(((booking.payFirst || 0) / total) * 100) : 0;
  const StatusIcon = statusCfg.icon;

  const tripDays = booking.trip?.tripDays?.filter(
    (d: string) => !["Private", "Group booking"].includes(d),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Bookings
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {booking.trip?.tripName || "Booking Details"}
            </h1>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-sm text-gray-400 font-mono">
                #{booking.id.slice(-8)}
              </span>
              <button
                onClick={copyId}
                className="text-gray-300 hover:text-gray-500 transition-colors"
              >
                {copied ? (
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Badge label={booking.status} config={statusCfg} />
            <Badge label={booking.paymentStatus} config={paymentCfg} />
            <Badge
              label={booking.bookingType}
              config={{
                bg:
                  booking.bookingType === "GROUP"
                    ? "bg-purple-50"
                    : "bg-blue-50",
                text:
                  booking.bookingType === "GROUP"
                    ? "text-purple-700"
                    : "text-blue-700",
                border:
                  booking.bookingType === "GROUP"
                    ? "border-purple-200"
                    : "border-blue-200",
              }}
            />
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-medium text-gray-400 uppercase">
              Total
            </span>
          </div>
          <p className="text-xl font-bold text-gray-900">
            {formatCurrency(total)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-medium text-gray-400 uppercase">
              Due
            </span>
          </div>
          <p className="text-xl font-bold text-gray-900">
            {formatCurrency(booking.payDue || 0)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-medium text-gray-400 uppercase">
              Group Size
            </span>
          </div>
          <p className="text-xl font-bold text-gray-900">
            {booking.groupSize || 1}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <StatusIcon
              className="w-4 h-4"
              style={{ color: statusCfg.color }}
            />
            <span className="text-xs font-medium text-gray-400 uppercase">
              Status
            </span>
          </div>
          <StatusButton color={statusCfg.color} className="text-white text-xs">
            {booking.status}
          </StatusButton>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trip Info */}
          <Card title="Trip Details" icon={Calendar}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field
                label="Trip Name"
                value={booking.trip?.tripName}
                icon={MapPin}
              />
              <Field
                label="Trip Type"
                value={booking.trip?.tripType}
                icon={Activity}
              />
              <Field
                label="Trip Date"
                value={booking.tripDate ? formatDate(booking.tripDate) : null}
                icon={Calendar}
              />
              <Field
                label="Departure"
                value={
                  booking.trip?.departureTime
                    ? formatTime(booking.trip.departureTime)
                    : null
                }
                icon={Clock}
              />
              <Field
                label="Duration"
                value={
                  booking.trip?.duration
                    ? `${booking.trip.duration} hours`
                    : null
                }
                icon={Clock}
              />
              <Field
                label="Price per Trip"
                value={
                  booking.trip?.price
                    ? formatCurrency(booking.trip.price)
                    : null
                }
                icon={DollarSign}
              />
            </div>

            {tripDays && tripDays.length > 0 && (
              <div className="mt-5 pt-5 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                  Available Days
                </p>
                <div className="flex flex-wrap gap-2">
                  {tripDays.map((day: string) => (
                    <span
                      key={day}
                      className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md"
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {booking.trip?.fishingLocation?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                  Fishing Locations
                </p>
                <div className="flex flex-wrap gap-2">
                  {booking.trip.fishingLocation.map((loc: string) => (
                    <span
                      key={loc}
                      className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-md"
                    >
                      {loc}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {booking.trip?.fishingTechnique?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                  Techniques
                </p>
                <div className="flex flex-wrap gap-2">
                  {booking.trip.fishingTechnique.map((tech: string) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-md"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {booking.trip?.description && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                  Description
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {booking.trip.description}
                </p>
              </div>
            )}
          </Card>

          {/* Customer Info */}
          <Card title="Customer" icon={User}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field
                label="Full Name"
                value={
                  booking.user
                    ? `${booking.user.firstName} ${booking.user.lastName}`
                    : null
                }
                icon={User}
              />
              <Field label="Email" value={booking.user?.email} icon={Mail} />
              {booking.groupMember && (
                <>
                  <Field
                    label="Phone"
                    value={booking.groupMember.phoneNumber}
                    icon={Phone}
                  />
                  <Field
                    label="Fishing Type"
                    value={booking.groupMember.fishingType}
                    icon={Fish}
                  />
                  <Field
                    label="Target Species"
                    value={booking.groupMember.targetSpecies}
                    icon={Fish}
                  />
                </>
              )}
            </div>
            {booking.groupMember?.details && (
              <div className="mt-5 pt-5 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                  Additional Notes
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {booking.groupMember.details}
                </p>
              </div>
            )}
          </Card>

          {/* Boat & Captain */}
          <Card title="Boat & Captain" icon={Ship}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field
                label="Captain"
                value={
                  booking.boat?.captain
                    ? `${booking.boat.captain.firstName} ${booking.boat.captain.lastName}`
                    : null
                }
                icon={User}
              />
              <Field
                label="Captain Email"
                value={booking.boat?.captain?.email}
                icon={Mail}
              />
              <Field
                label="Boat Type"
                value={booking.boat?.boatType}
                icon={Anchor}
              />
              <Field
                label="Capacity"
                value={
                  booking.boat?.guests ? `${booking.boat.guests} guests` : null
                }
                icon={Users}
              />
            </div>
            {booking.boat?.description && (
              <div className="mt-5 pt-5 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                  About the Boat
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {booking.boat.description}
                </p>
              </div>
            )}
            {booking.boat?.photos && booking.boat.photos.length > 0 && (
              <div className="mt-5 pt-5 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5" /> Photos
                </p>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {booking.boat.photos.slice(0, 4).map((photo: any) => (
                    <div
                      key={photo.id}
                      className="aspect-square rounded-lg overflow-hidden border border-gray-200"
                    >
                      <img
                        src={photo.url}
                        alt="Boat"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Payment Card */}
          <Card title="Payment" icon={CreditCard}>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Paid</span>
                <span className="text-base font-bold text-emerald-600">
                  {formatCurrency(booking.payFirst || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Due</span>
                <span className="text-base font-bold text-orange-600">
                  {formatCurrency(booking.payDue || 0)}
                </span>
              </div>
              <div className="border-t border-gray-100 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-900">
                    Total
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Paid</span>
                  <span>{paidPercent}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${paidPercent}%` }}
                  />
                </div>
              </div>

              <div className="pt-2">
                <StatusButton
                  color={paymentCfg.color}
                  className="text-white text-xs"
                  fullWidth
                >
                  {booking.paymentStatus}
                </StatusButton>
              </div>
            </div>
          </Card>

          {/* Timeline */}
          <Card title="Timeline" icon={Clock}>
            <div className="relative space-y-0">
              {/* Vertical line */}
              <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gray-200" />

              <div className="relative flex items-start gap-3 pb-5">
                <div className="w-[30px] h-[30px] rounded-full bg-orange-50 border-2 border-orange-200 flex items-center justify-center z-10 flex-shrink-0">
                  <Calendar className="w-3.5 h-3.5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400">Booked On</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatDateTime(booking.createdAt)}
                  </p>
                </div>
              </div>

              <div className="relative flex items-start gap-3 pb-5">
                <div className="w-[30px] h-[30px] rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center z-10 flex-shrink-0">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400">Trip Date</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {booking.tripDate ? formatDate(booking.tripDate) : "—"}
                  </p>
                </div>
              </div>

              <div className="relative flex items-start gap-3">
                <div className="w-[30px] h-[30px] rounded-full bg-gray-50 border-2 border-gray-200 flex items-center justify-center z-10 flex-shrink-0">
                  <Clock className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400">
                    Last Updated
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatDateTime(booking.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Actions */}
          {booking.status !== "CANCEL" && booking.status !== "CANCELLED" && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <button
                onClick={handleCancel}
                disabled={isCancelling}
                className="w-full py-2.5 rounded-lg text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                {isCancelling ? "Cancelling..." : "Cancel Booking"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
