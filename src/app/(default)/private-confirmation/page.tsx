"use client";

import {
  CheckCircle,
  Calendar,
  Users,
  MapPin,
  Mail,
  Clock,
  Package,
  Shield,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import image1 from "@/assets/Carousel.png";
import Button from "@/components/ReUsible/Button";
import { RootState } from "@/redux/store/store";
import Container from "@/components/common/Container";

export default function ConfirmationPage() {
  const [bookingDetails, setBookingDetails] = useState({
    tripDate: null as string | null,
    numberOfGuests: null as string | null,
    bookingType: null as string | null,
    location: null as string | null,
    bookingId: null as string | null,
  });

  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Generate a booking ID if not exists
      const bookingId =
        localStorage.getItem("bookingId") ||
        `BK-${Date.now().toString().slice(-8)}`;
      if (!localStorage.getItem("bookingId")) {
        localStorage.setItem("bookingId", bookingId);
      }

      // Preferred: new searchData JSON object written by SearchBar
      let dateFromStorage: string | null = null;
      let guestsFromStorage: string | null = null;
      let bookingTypeFromStorage: string | null = null;
      let locationFromStorage: string | null = null;

      try {
        const raw = localStorage.getItem("searchData");
        if (raw) {
          const parsed = JSON.parse(raw);
          dateFromStorage = parsed?.date ?? parsed?.startDate ?? null;
          guestsFromStorage =
            parsed?.guests != null ? String(parsed.guests) : null;
          bookingTypeFromStorage =
            parsed?.bookingType != null ? String(parsed.bookingType) : null;
          locationFromStorage = parsed?.location ?? null;
        }
      } catch (err) {
        console.error("Failed to parse searchData from localStorage", err);
      }

      setBookingDetails({
        tripDate:
          dateFromStorage ||
          localStorage.getItem("date") ||
          localStorage.getItem("StartDate"),
        numberOfGuests: guestsFromStorage || localStorage.getItem("Guests"),
        bookingType:
          bookingTypeFromStorage || localStorage.getItem("bookingType"),
        location: locationFromStorage || localStorage.getItem("location"),
        bookingId,
      });
    }
  }, []);

  const downloadReceipt = () => {
    // Implement receipt download functionality
    const receiptContent = `
      FISHING TRIPPER - BOOKING CONFIRMATION
      Booking ID: ${bookingDetails.bookingId}
      Date: ${new Date().toLocaleDateString()}
      
      Trip: Trolling and Dolphin Trip
      Date & Time: ${bookingDetails.tripDate}
      Guests: ${bookingDetails.numberOfGuests}
      Location: ${bookingDetails.location || "Marina Bay, Florida"}
      Customer: ${user?.email}
    `;

    const blob = new Blob([receiptContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `booking-${bookingDetails.bookingId}.txt`;
    a.click();
  };

  return (
    <Container className="">
      <div className="">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#edfff6] to-[#daf7e9] rounded-md">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-white/60 p-4 rounded-full">
                  <CheckCircle className="w-16 h-16 text-green-600" />
                </div>
              </div>
              <h1 className="text-3xl text-green-600 md:text-4xl font-bold mb-4">
                Your Fishing Trip is Confirmed!
              </h1>
              <p className="text-lg md:text-xl opacity-90 mb-6">
                Get ready for an unforgettable adventure! All details have been
                sent to
              </p>
              <div className="inline-flex items-center gap-2 bg-white/40 px-4 py-2 rounded-full">
                <Mail className="w-5 h-5" />
                <span className="font-semibold ">{user?.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column - Booking Details */}
              <div className="lg:w-2/3">
                {/* Booking Summary Card */}
                <div className="bg-white rounded-2xl  p-6 mb-8 border border-blue-100">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Booking Summary
                      </h2>
                      <div className="flex items-center gap-2 text-blue-600">
                        <Shield className="w-5 h-5" />
                        <span className="font-medium">
                          Booking ID: {bookingDetails.bookingId}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <DetailItem
                        icon={Package}
                        label="Trip Name"
                        value="Trolling and Dolphin Trip"
                        color="blue"
                      />
                      <DetailItem
                        icon={Calendar}
                        label="Date & Time"
                        value={bookingDetails.tripDate}
                        color="green"
                      />
                    </div>
                    <div className="space-y-4">
                      <DetailItem
                        icon={Users}
                        label="Number of Guests"
                        value={bookingDetails.numberOfGuests}
                        color="purple"
                      />
                      <DetailItem
                        icon={MapPin}
                        label="Location"
                        value={bookingDetails.location || "Marina Bay, Florida"}
                        color="orange"
                      />
                    </div>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-white rounded-2xl p-6 border border-green-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Clock className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">
                        What to Expect
                      </h3>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                        <span>
                          Arrive 15 minutes early at the meeting point
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                        <span>
                          Bring sunscreen, hat, and comfortable clothing
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                        <span>Snacks and drinks are recommended</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                        <span>Fishing gear will be provided</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-2xl  p-6 border border-blue-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Mail className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Need Help?
                      </h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Our team is here to assist you with any questions about
                      your trip.
                    </p>
                    <div className="space-y-2">
                      <a
                        href="mailto:tom@fishingtripper.com"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                      >
                        <Mail className="w-4 h-4" />
                        tom@fishingtripper.com
                      </a>
                      <p className="text-sm text-gray-500 mt-4">
                        Response time: Typically within 1-2 hours
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Important Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InfoCard
                      title="Weather Policy"
                      description="Trips run rain or shine. In case of severe weather, we'll contact you 24 hours prior."
                    />
                    <InfoCard
                      title="Cancellation"
                      description="Free cancellation up to 48 hours before the trip. View full policy in your email."
                    />
                    <InfoCard
                      title="What to Bring"
                      description="ID, sunscreen, sunglasses, camera, and excitement for adventure!"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button link="/" variant="primary" className="flex-1">
                    Explore More Trips
                  </Button>
                </div>
              </div>

              {/* Right Column - Image & Quick Links */}
              <div className="lg:w-1/3">
                <div className="sticky top-24 space-y-6">
                  {/* Trip Image */}
                  <div className="rounded-2xl overflow-hidden shadow-md mb-6">
                    <Image
                      src={image1}
                      alt="Fishing Trip Preview"
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="bg-white p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Your Adventure Awaits!
                      </h4>
                      <p className="text-sm text-gray-600">
                        Capture memories that will last a lifetime on this
                        exclusive fishing trip.
                      </p>
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div className="bg-white rounded-2xl shadow-md p-6">
                    <h4 className="font-bold text-gray-900 mb-4">
                      Quick Links
                    </h4>
                    <div className="space-y-3">
                      <QuickLink
                        href="/faq"
                        label="Frequently Asked Questions"
                      />
                      <QuickLink href="/safety" label="Safety Guidelines" />
                      <QuickLink
                        href="/gear-rental"
                        label="Gear Rental Options"
                      />
                      <QuickLink
                        href="/weather-updates"
                        label="Live Weather Updates"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="bg-gray-900 text-white py-8 rounded-lg mt-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-300">
              Need immediate assistance? Call us at{" "}
              <a
                href="tel:+11234567890"
                className="text-blue-300 hover:text-blue-200"
              >
                +1 (123) 456-7890
              </a>
            </p>
            <p className="text-sm text-gray-400 mt-2">
              You'll receive a reminder email 24 hours before your trip
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}

// Helper Components
interface DetailItemProps {
  icon: React.ComponentType<any>;
  label: string;
  value: string | null;
  color: string;
}

function DetailItem({ icon: Icon, label, value, color }: DetailItemProps) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
  };

  return (
    <div className="flex items-center gap-4">
      <div
        className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-semibold text-gray-900">
          {value || "Not specified"}
        </p>
      </div>
    </div>
  );
}

interface InfoCardProps {
  title: string;
  description: string;
}

function InfoCard({ title, description }: InfoCardProps) {
  return (
    <div className="bg-white/50 p-4 rounded-lg">
      <h5 className="font-semibold text-gray-900 mb-2">{title}</h5>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

interface QuickLinkProps {
  href: string;
  label: string;
}

function QuickLink({ href, label }: QuickLinkProps) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
    >
      <span className="text-gray-700 group-hover:text-blue-600">{label}</span>
      <div className="text-gray-400 group-hover:text-blue-600">→</div>
    </Link>
  );
}
