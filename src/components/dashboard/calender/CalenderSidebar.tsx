"use client"

import { Clock, Users, DollarSign, TrendingUp, Anchor } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { CalendarResponse } from "@/types/calenderTypes"

interface CalendarSidebarProps {
  data: CalendarResponse["data"]
}

export function CalendarSidebar({ data }: CalendarSidebarProps) {


  const totalBookings = data?.dailyServiceCounts?.reduce((sum, day) => sum + (day?.count ?? 0), 0)
  const totalRevenue = data?.dailyServiceCounts
    ?.flatMap((day) => day?.bookings ?? [])
    ?.reduce((sum, booking) => sum + (booking?.payFirst ?? 0) + (booking?.payDue ?? 0), 0)

  const avgBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0

  const uniqueUsers = new Set(
    data?.dailyServiceCounts?.flatMap((day) => day?.bookings ?? [])?.map((booking) => booking?.user?.id),
  )?.size

  const timelineSections = [
    { key: "today" as const, title: "Today", bookings: data?.timeline?.today ?? [], color: "bg-blue-500" },
    { key: "tomorrow" as const, title: "Tomorrow", bookings: data?.timeline?.tomorrow ?? [], color: "bg-green-500" },
    { key: "thisWeek" as const, title: "This Week", bookings: data?.timeline?.thisWeek ?? [], color: "bg-purple-500" },
    {
      key: "thisMonth" as const,
      title: "This Month",
      bookings: data?.timeline?.thisMonth ?? [],
      color: "bg-orange-500",
    },
  ]

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-slate-50 to-white">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          {/* <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {data?.filter?.monthName} {data?.filter?.year}
          </h2> */}
          <p className="text-lg text-gray-500">Boat Booking Dashboard</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Anchor className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-blue-600 font-medium">Bookings</p>
                  <p className="text-xl font-bold text-blue-900">{totalBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-green-600 font-medium">Customers</p>
                  <p className="text-xl font-bold text-green-900">{uniqueUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-500 rounded-lg">
                  <DollarSign className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-yellow-600 font-medium">Revenue</p>
                  <p className="text-xl font-bold text-yellow-900">${totalRevenue?.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-purple-600 font-medium">Avg Value</p>
                  <p className="text-xl font-bold text-purple-900">${Math.round(avgBookingValue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline Sections */}
        <div className="space-y-4">
          {timelineSections.map((section) => (
            <Card key={section.key} className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 ${section.color} rounded-full`}></div>
                    <h3 className="font-semibold text-gray-900">{section.title}</h3>
                    <span className="text-sm text-gray-500">({section.bookings?.length})</span>
                  </div>
                </Button>
              </CardHeader>

              {section?.bookings && (
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {section.bookings?.length > 0 ? (
                      section.bookings?.slice(0, 3)?.map((booking) => (
                        <div key={booking?.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                booking?.status === "CONFIRMED"
                                  ? "bg-green-500"
                                  : booking?.status === "PENDING"
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                            ></div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{booking?.bookingType} Booking</p>
                              <p className="text-xs text-gray-500">
                                ${(booking?.payFirst + booking?.payDue).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {new Date(booking?.tripDate).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              })}
                            </p>
                            <p className="text-xs text-gray-500 capitalize">{booking?.status.toLowerCase()}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <Clock className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No bookings scheduled</p>
                      </div>
                    )}
                    {section.bookings?.length > 3 && (
                      <Button variant="ghost" size="sm" className="w-full text-xs">
                        View {section.bookings?.length - 3} more bookings
                      </Button>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
