"use client";

import type React from "react";

import { Search } from "lucide-react";

interface SearchTripsProps {
  filters: any;
  setFilters: (val: any) => void;
}

export default function SearchTrips({ filters, setFilters }: SearchTripsProps) {
  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
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
    <div className="">
      <div className="w-full">
        <h1 className="text-2xl font-medium text-gray-900 mb-6">
          Search trips
        </h1>

        <div className="flex flex-wrap lg:flex-row gap-3 items-center">
          {/* Search Input with Icon */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />

            <input
              type="text"
              name="searchTerm"
              value={filters.searchTerm}
              onChange={handleChange}
              placeholder="Search by trip name, customer or captain name"
              className="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#73bbf7] focus:border-transparent transition-all placeholder-gray-400 bg-white"
            />
          </div>

          {/* Date Select */}
          <div className="relative">
            <select
              name="date"
              value={filters.date}
              onChange={handleChange}
              className="appearance-none w-full md:w-[140px] p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#73bbf7] focus:border-transparent transition-all placeholder-gray-400 bg-white"
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
              className="appearance-none w-full md:w-[140px] p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#73bbf7] focus:border-transparent transition-all placeholder-gray-400 bg-white"
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
              className="appearance-none w-full md:w-[140px] p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#73bbf7] focus:border-transparent transition-all placeholder-gray-400 bg-white"
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
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-[15px] rounded-md text-sm font-medium flex items-center gap-2 transition-colors duration-200"
          >
            Search
            <Search className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
