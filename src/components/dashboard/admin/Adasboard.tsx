"use client";

import DashboardCard from "./AdashboardCard";
import { useDashboardQuery } from "@/redux/api/dashboardApi";
import { Skeleton } from "@/components/ui/skeleton";

import { LuCalendarDays, LuTrendingUp } from "react-icons/lu";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import {
  FaCheckCircle,
  FaTimesCircle,
  FaUsers,
  FaUserTie,
  FaClipboardList,
  FaMoneyBillWave,
} from "react-icons/fa";

// Define interface for CustomTooltip props
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
    payload?: any;
  }>;
  label?: string;
}

export default function Adashboard() {
  const { data, isLoading } = useDashboardQuery({});

  const tripMetrics = data?.data?.tripMetrics || {};
  const userMetrics = data?.data?.userMetrics || {};
  const listingRequest = data?.data?.listingRequest || {};

  // Prepare data for bar chart
  const barChartData = [
    { name: "Upcoming", value: tripMetrics.PENDING || 0, color: "#FF9500" },
    { name: "Ongoing", value: tripMetrics.ONGOING || 0, color: "#007AFF" },
    { name: "Completed", value: tripMetrics.COMPLETED || 0, color: "#34C759" },
    { name: "Cancelled", value: tripMetrics.CANCELLED || 0, color: "#FF3B30" },
    { name: "Confirmed", value: tripMetrics.CONFIRMED || 0, color: "#5856D6" },
  ];

  const totalTrips = barChartData.reduce((sum, item) => sum + item.value, 0);

  // Custom tooltip for bar chart
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (!active || !payload?.length) {
      return null;
    }

    const rawValue = payload[0]?.value;
    const value = typeof rawValue === "number" ? rawValue : 0;

    if (!Number.isFinite(value)) {
      return null;
    }

    const percentage =
      totalTrips > 0 ? ((value / totalTrips) * 100).toFixed(1) : "0.0";

    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-800">{label}</p>
        <p className="text-gray-600">
          Trips: <span className="font-bold text-gray-900">{value}</span>
        </p>
        <p className="text-sm text-gray-500">{percentage}% of total</p>
      </div>
    );
  };

  const renderCard = (
    Component: typeof DashboardCard,
    title: string,
    value: number | string,
    icon: React.ReactNode,
    link: string
  ) => {
    return isLoading ? (
      <Skeleton className="h-20 rounded-lg" />
    ) : (
      <Component title={title} value={value} icon={icon} link={link} />
    );
  };

  return (
    <main className="p-4 md:p-8 space-y-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">
        Platform Metrics
      </h2>

      <div className="grid xl:grid-cols-6 lg:grid-cols-3 md:grid-cols-3 grid-cols-2 gap-4">
        {renderCard(
          DashboardCard,
          "UPCOMING TRIPS:",
          tripMetrics.PENDING ?? 0,
          <LuCalendarDays className="text-[#FF9500]" size={28} />,
          "/dashboard/trips-managment"
        )}

        {renderCard(
          DashboardCard,
          "COMPLETED:",
          tripMetrics.COMPLETE ?? 0,
          <FaCheckCircle className="text-[#FF9500]" size={28} />,
          "/dashboard/trips-managment"
        )}

        {renderCard(
          DashboardCard,
          "CANCELLED:",
          0,
          <FaTimesCircle className="text-[#FF9500]" size={28} />,
          "/dashboard/trips-managment"
        )}

        {renderCard(
          DashboardCard,
          "ACTIVE CUSTOMERS:",
          userMetrics.USER ?? 0,
          <FaUsers className="text-[#FF9500]" size={28} />,
          "/dashboard/user-management"
        )}

        {renderCard(
          DashboardCard,
          "ACTIVE CAPTAINS:",
          userMetrics.CAPTAIN ?? 0,
          <FaUserTie className="text-[#FF9500]" size={28} />,
          "/dashboard/user-management"
        )}

        {renderCard(
          DashboardCard,
          "REFUND REQUESTS:",
          listingRequest ?? 0,
          <FaMoneyBillWave className="text-[#FF9500]" size={28} />,
          "/dashboard/user-management"
        )}
      </div>

      {/* Bar Chart Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Trip Status Distribution
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Overview of all trips by status
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-2 md:mt-0">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF9500]"></div>
              <span className="text-sm text-gray-600">Upcoming</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#34C759]"></div>
              <span className="text-sm text-gray-600">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#007AFF]"></div>
              <span className="text-sm text-gray-600">Ongoing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF3B30]"></div>
              <span className="text-sm text-gray-600">Cancelled</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#5856D6]"></div>
              <span className="text-sm text-gray-600">Confirmed</span>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="h-80">
            <Skeleton className="h-full w-full rounded-lg" />
          </div>
        ) : totalTrips === 0 ? (
          <div className="h-80 flex flex-col items-center justify-center text-gray-500">
            <LuTrendingUp size={48} className="mb-4 opacity-20" />
            <p>No trip data available</p>
            <p className="text-sm mt-2">
              Start creating trips to see analytics
            </p>
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={barChartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f0f0f0"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#666", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#666", fontSize: 12 }}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ stroke: "rgba(0, 0, 0, 0.1)", strokeWidth: 2 }}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span className="text-sm text-gray-600">{value}</span>
                  )}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Number of Trips"
                  stroke="#8884d8"
                  strokeWidth={3}
                  dot={{
                    r: 6,
                    fill: "#8884d8",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                  activeDot={{
                    r: 8,
                    fill: "#8884d8",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </main>
  );
}
