"use client";

import type React from "react";

import { Search } from "lucide-react";

interface SearchTripsProps {
  filters: any;
  setFilters: (val: any) => void;
}

export default function SearchTrips({ filters, setFilters }: SearchTripsProps) {
  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    setFilters((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
      page: 1,
    }));
  };

  const handleSearch = () => {
    // Search functionality can be added here if needed
  };

  return (
    <div className="bg-gray-100 p-6">
      <div className=" max-w-6xl">
        <h1 className="text-2xl font-medium text-gray-900 mb-6">
          Search trips
        </h1>

        <div className="flex flex-wrap lg:flex-row gap-3 items-center">
          {/* Search Input with Icon */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              name="searchTerm"
              value={filters.searchTerm}
              onChange={handleChange}
              placeholder="Search by trip name, customer or captain name"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Date Select */}
          <div className="relative">
            <select
              name="date"
              value={filters.date}
              onChange={handleChange}
              className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2.5 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 min-w-[120px]"
            >
              <option value="">Date</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="this-week">This Week</option>
              <option value="this-month">This Month</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Location Select */}
          <div className="relative">
            <select
              name="city"
              value={filters.city}
              onChange={handleChange}
              className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2.5 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 min-w-[120px]"
            >
              <option value="">Location</option>
              <option value="Alice">Alice</option>
              <option value="Miami">Miami</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Status Select */}
          <div className="relative">
            <select
              name="status"
              value={filters.status}
              onChange={handleChange}
              className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2.5 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 min-w-[120px]"
            >
              <option value="">Status</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETE">Complete</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors duration-200"
          >
            Search
            <Search className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
