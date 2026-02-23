"use client";

import { useState, useEffect, useCallback } from "react";

interface SearchBookingsProps {
  filters: {
    limit: number;
    page: number;
    status: string;
    searchTerm: string;
    date: string;
    city: string;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      limit: number;
      page: number;
      status: string;
      searchTerm: string;
      date: string;
      city: string;
    }>
  >;
}

export default function SearchBookings({
  filters,
  setFilters,
}: SearchBookingsProps) {
  const [searchInput, setSearchInput] = useState(filters.searchTerm);

  // Debounced search effect - triggers API call 500ms after user stops typing
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchInput !== filters.searchTerm) {
        setFilters((prev) => ({
          ...prev,
          searchTerm: searchInput,
          page: 1, // Reset to page 1 when search changes
        }));
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchInput]);

  // Sync local state when filters reset externally
  useEffect(() => {
    if (filters.searchTerm === "" && searchInput !== "") {
      setSearchInput("");
    }
  }, [filters.searchTerm]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleStatusChange = useCallback(
    (status: string) => {
      setFilters((prev) => ({
        ...prev,
        status: status,
        page: 1, // Reset to first page when filter changes
      }));
    },
    [setFilters],
  );

  const handleDateChange = useCallback(
    (date: string) => {
      setFilters((prev) => ({
        ...prev,
        date: date,
        page: 1, // Reset to first page when filter changes
      }));
    },
    [setFilters],
  );

  const handleCityChange = useCallback(
    (city: string) => {
      setFilters((prev) => ({
        ...prev,
        city: city,
        page: 1, // Reset to first page when filter changes
      }));
    },
    [setFilters],
  );

  const handleReset = useCallback(() => {
    setSearchInput("");
    setFilters({
      limit: 10,
      page: 1,
      status: "",
      searchTerm: "",
      date: "",
      city: "",
    });
  }, [setFilters]);

  return (
    <div className="">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Search & Filter Bookings</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search In */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              value={searchInput}
              onChange={handleSearchInputChange}
              placeholder="Trip, customer, captain..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchInput && (
              <p className="text-xs text-gray-500 mt-1">Searching...</p>
            )}
          </div> */}

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="UPCOMING">Upcoming</option>
              <option value="COMPLETE">Complete</option>
              <option value="CANCEL">Cancel</option>
            </select>
          </div>

          {/* Date Filter */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trip Date
            </label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div> */}

          {/* City Filt */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              value={filters.city}
              onChange={(e) => handleCityChange(e.target.value)}
              placeholder="Meeting point city"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div> */}

          {/* Action Buttons */}
          {/* <div className="flex items-end">
            <button
              onClick={handleReset}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Reset All Filters
            </button>
          </div> */}
        </div>

        {/* Active Filters Display */}
        {(filters.searchTerm ||
          filters.status ||
          filters.date ||
          filters.city) && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">Active filters:</span>
            {filters.searchTerm && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Search: {filters.searchTerm}
              </span>
            )}
            {filters.status && (
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                Status: {filters.status}
              </span>
            )}
            {filters.date && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Date: {filters.date}
              </span>
            )}
            {filters.city && (
              <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                City: {filters.city}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
