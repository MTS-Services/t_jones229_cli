import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

type AdashboardCardProps = {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  link: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
};

export default function AdashboardCard({
  title,
  value,
  icon,
  link,
  trend,
  subtitle,
}: AdashboardCardProps) {
  return (
    <Link
      href={link}
      className="group relative block h-[170px] rounded-2xl bg-white border border-gray-200 p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/30"
    >
      {/* Soft hover glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative h-full flex flex-col justify-between">
        {/* Top Section */}
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {title}
          </h3>

          {icon && (
            <div className="text-gray-400 group-hover:text-primary transition-colors duration-300">
              {icon}
            </div>
          )}
        </div>

        {/* Middle Section (Main Value) */}
        <div>
          <div className="text-3xl font-semibold text-gray-900">{value}</div>

          <div className="flex items-center gap-3 mt-2">
            {subtitle && (
              <span className="text-sm text-gray-500">{subtitle}</span>
            )}

            {trend && (
              <span
                className={`text-xs font-semibold flex items-center gap-1 px-2 py-0.5 rounded-full ${
                  trend.isPositive
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {trend.isPositive ? "↑" : "↓"}
                {Math.abs(trend.value)}%
              </span>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex items-center text-sm font-medium text-gray-400 group-hover:text-primary transition-colors duration-300">
          <span>View details</span>
          <ChevronRightIcon className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
