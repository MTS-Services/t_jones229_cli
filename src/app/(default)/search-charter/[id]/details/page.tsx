"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Ship,
  Users,
  Ruler,
  Calendar,
  Wrench,
  MapPin,
  Fish,
  DollarSign,
  Clock,
  User,
  Mail,
  Phone,
  Tag,
} from "lucide-react";
import { useGetSingleBoatQuery } from "@/redux/api/boatApi";
import Loader from "@/components/ui/Loader";
import PaymentMap from "@/components/Payment/PaymentMap";
import Container from "@/components/common/Container";

export default function BoatFullDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const boatId = params?.id as string;

  const { data: boatData, isLoading } = useGetSingleBoatQuery(boatId);
  const boat = boatData?.data;

  if (isLoading) return <Loader />;
  if (!boat) {
    return (
      <Container className="mt-28 min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Boat not found.</p>
      </Container>
    );
  }

  const captain = boat.captain;
  const meetingPoint = boat.meetingPoint?.[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ── Back Button ── */}
        <div className="pt-20 md:pt-24">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-[#035292] transition-colors font-semibold text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        {/* ── Title & Description ── */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-[#242424]">
            {boat.descriptions?.[0]?.listingTypeTitle || "Unnamed Boat"}
          </h2>
          {boat.descriptions?.[0]?.listingTypeDescription && (
            <p className="mt-3 text-gray-600 leading-relaxed">
              {boat.descriptions[0].listingTypeDescription}
            </p>
          )}
        </section>

        {/* ── Quick Specs ── */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: <Ship className="h-5 w-5 text-blue-600" />, label: "Boat Type", value: boat.boatType || "N/A", bg: "bg-blue-50 border-blue-100" },
            { icon: <Ruler className="h-5 w-5 text-amber-600" />, label: "Length", value: boat.boatLength ? `${boat.boatLength} ft` : "N/A", bg: "bg-amber-50 border-amber-100" },
            { icon: <Users className="h-5 w-5 text-emerald-600" />, label: "Capacity", value: boat.guests ? `${boat.guests} guests` : "N/A", bg: "bg-emerald-50 border-emerald-100" },
            { icon: <Calendar className="h-5 w-5 text-purple-600" />, label: "Model Year", value: boat.modelYear || "N/A", bg: "bg-purple-50 border-purple-100" },
          ].map((spec) => (
            <div key={spec.label} className={`rounded-xl border p-4 ${spec.bg}`}>
              <div className="flex items-center gap-2 mb-1">{spec.icon}<span className="text-xs text-gray-500 font-medium uppercase tracking-wide">{spec.label}</span></div>
              <p className="text-lg font-bold text-gray-900">{spec.value}</p>
            </div>
          ))}
        </section>

        {/* ── Captain Info ── */}
        {captain && (
          <section className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-[#035292]" /> Captain Information
            </h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <User className="w-7 h-7 text-blue-500" />
              </div>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold">{captain.firstName} {captain.lastName}</span>
                </div>
                {captain.email && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a href={`mailto:${captain.email}`} className="hover:text-blue-600 transition-colors text-sm truncate">{captain.email}</a>
                  </div>
                )}
                {captain.phoneNumber ? (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <a href={`tel:${captain.phoneNumber}`} className="hover:text-blue-600 transition-colors text-sm">{captain.phoneNumber}</a>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">Not provided</span>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── Facilities, Gear, Charter Types ── */}
        {(boat.facilities?.length > 0 || boat.gearAndCrew?.length > 0 || boat.charterTypes?.length > 0) && (
          <section className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-5">
            {boat.facilities?.length > 0 && (
              <div>
                <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-[#035292]" /> Facilities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {boat.facilities.map((f: string) => (
                    <span key={f} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-100">{f}</span>
                  ))}
                </div>
              </div>
            )}
            {boat.gearAndCrew?.length > 0 && (
              <div>
                <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#035292]" /> Gear &amp; Crew
                </h3>
                <div className="flex flex-wrap gap-2">
                  {boat.gearAndCrew.map((g: string) => (
                    <span key={g} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm border border-emerald-100">{g}</span>
                  ))}
                </div>
              </div>
            )}
            {boat.charterTypes?.length > 0 && (
              <div>
                <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#035292]" /> Charter Types
                </h3>
                <div className="flex flex-wrap gap-2">
                  {boat.charterTypes.map((ct: string) => (
                    <span key={ct} className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm border border-purple-100">{ct}</span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ── Fishing Details ── */}
        {boat.fishing && boat.fishing.length > 0 && (
          <section className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Fish className="w-4 h-4 text-[#035292]" /> Fishing Details
            </h3>
            {boat.fishing.map((fish: any) => (
              <div key={fish.id} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {fish.species?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Target Species</p>
                    <div className="flex flex-wrap gap-1.5">
                      {fish.species.map((s: string) => (
                        <span key={s} className="px-2.5 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-100">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {fish.fishingLocation?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Fishing Locations</p>
                    <div className="flex flex-wrap gap-1.5">
                      {fish.fishingLocation.map((loc: string) => (
                        <span key={loc} className="px-2.5 py-1 bg-orange-50 text-orange-700 text-sm rounded-full border border-orange-100">{loc}</span>
                      ))}
                    </div>
                  </div>
                )}
                {fish.fishingTechnique?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Techniques</p>
                    <div className="flex flex-wrap gap-1.5">
                      {fish.fishingTechnique.map((t: string) => (
                        <span key={t} className="px-2.5 py-1 bg-green-50 text-green-700 text-sm rounded-full border border-green-100">{t}</span>
                      ))}
                    </div>
                  </div>
                )}
                {fish.includedPrice?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Included</p>
                    <div className="flex flex-wrap gap-1.5">
                      {fish.includedPrice.map((item: string) => (
                        <span key={item} className="px-2.5 py-1 bg-gray-100 text-gray-700 text-sm rounded-full border border-gray-200">{item}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* ── Meeting Point ── */}
        {meetingPoint && (
          <section className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#035292]" /> Meeting Point
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <p className="font-semibold text-gray-900">{meetingPoint.street}</p>
                <p className="text-gray-600 text-sm">
                  {meetingPoint.city}{meetingPoint.state ? `, ${meetingPoint.state}` : ""}{meetingPoint.country ? `, ${meetingPoint.country}` : ""} {meetingPoint.postCode}
                </p>
                {meetingPoint.direction && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                    <p className="text-xs font-semibold text-amber-700 mb-1">Directions</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{meetingPoint.direction}</p>
                  </div>
                )}
              </div>
              <div className="h-48 rounded-xl overflow-hidden">
                <PaymentMap location={meetingPoint} />
              </div>
            </div>
          </section>
        )}

        {/* ── Available Trips ── */}
        {boat.trips && boat.trips.length > 0 && (
          <section className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Ship className="w-4 h-4 text-[#035292]" /> Available Trips
              </span>
              <span className="text-xs bg-gray-100 px-2.5 py-1 rounded-full text-gray-500 font-normal">
                {boat.trips.length} {boat.trips.length === 1 ? "trip" : "trips"}
              </span>
            </h3>
            <div className="space-y-4">
              {boat.trips.map((trip: any) => (
                <div key={trip.id} className="border border-gray-100 rounded-xl p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900">{trip.tripName}</h4>
                      {trip.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{trip.description}</p>
                      )}
                      <div className="flex flex-wrap gap-3 mt-2">
                        <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />{trip.duration}h
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                          <DollarSign className="h-3 w-3" />{trip.price}
                        </span>
                        <span className={`inline-flex items-center gap-1 text-xs ${trip.tripStatus === "OPEN" ? "text-emerald-600" : "text-amber-600"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${trip.tripStatus === "OPEN" ? "bg-emerald-500" : "bg-amber-500"}`} />
                          {trip.tripStatus}
                        </span>
                      </div>
                      {/* Trip Days */}
                      {trip.tripDays?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {trip.tripDays.map((d: string) => (
                            <span key={d} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{d}</span>
                          ))}
                        </div>
                      )}
                      {/* Species */}
                      {trip.species?.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {trip.species.map((s: string) => (
                            <span key={s} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">{s}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Back Button ── */}
        <div className="flex justify-start pb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
