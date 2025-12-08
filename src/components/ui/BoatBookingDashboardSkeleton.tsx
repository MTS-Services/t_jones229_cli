import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Calendar, Clock } from "lucide-react";

export function BoatBookingDashboardSkeleton() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const calendarDays = Array.from({ length: 35 }, (_, i) => i + 1); // 5 weeks of calendar

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 p-6">
        <Skeleton className="h-6 w-48 mb-8" />

        <div className="space-y-4 mb-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="p-4 border-0 bg-gray-50">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-3 w-16 mb-2" />
                  <Skeleton className="h-6 w-12" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index}>
              <div className="flex items-center gap-3 mb-3">
                <Skeleton className="w-3 h-3 rounded-full" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-6" />
              </div>
              <div className="flex items-center gap-3 ml-6">
                <Clock className="h-4 w-4 text-gray-300" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" disabled>
              <ChevronLeft className="h-5 w-5 text-gray-300" />
            </Button>
            <Skeleton className="h-9 w-40" />
            <Button variant="ghost" size="icon" disabled>
              <ChevronRight className="h-5 w-5 text-gray-300" />
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-32 rounded-md" />
            <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md">
              <Calendar className="h-4 w-4 text-gray-300" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Calendar Header */}
          <div className="grid grid-cols-7 border-b border-gray-200">
            {days.map((day) => (
              <div
                key={day}
                className="p-4 text-center font-medium text-gray-400 bg-gray-50"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {calendarDays.map((_, index) => (
              <div
                key={index}
                className="min-h-32 p-3 border-r border-b border-gray-100 last:border-r-0"
              >
                <Skeleton className="h-4 w-6 mb-2" />
                {Math.random() > 0.8 && (
                  <div className="space-y-1">
                    <Skeleton className="h-6 w-full rounded-md" />
                    {Math.random() > 0.7 && (
                      <Skeleton className="h-6 w-3/4 rounded-md" />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
