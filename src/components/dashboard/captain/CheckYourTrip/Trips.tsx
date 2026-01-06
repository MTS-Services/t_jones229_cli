"use client";

import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

const Trips: React.FC = () => {
  const [days, setDays] = useState({
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
    Saturday: false,
    Sunday: false,
  });

  const [species, setSpecies] = useState<string[]>([
    "Shark",
    "Dolphin",
    "Tuna",
  ]);
  const [newSpecies, setNewSpecies] = useState("");

  const [bookingType, setBookingType] = useState<"private" | "group">(
    "private"
  );

  // Fix for TS: use keyof typeof days
  const toggleDay = (day: keyof typeof days) => {
    setDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  const removeSpecies = (sp: string) => {
    setSpecies(species.filter((s) => s !== sp));
  };

  const addSpecies = () => {
    const trimmed = newSpecies.trim();
    if (trimmed && !species.includes(trimmed)) {
      setSpecies([...species, trimmed]);
      setNewSpecies("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-white rounded-lg shadow">

      {/* Trip Name */}
      <div className="flex flex-col space-y-1">
        <label className="font-medium">Trip name</label>
        <input
          type="text"
          placeholder="e.g 6h deep dive fishing"
          className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Description */}
      <div className="flex flex-col space-y-1">
        <label className="font-medium">Description</label>
        <textarea
          placeholder="Add a description to this trip"
          className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Duration */}
      <div className="flex flex-col space-y-1">
        <label className="font-medium">Duration</label>
        <select className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300">
          <option>Choose the trip duration</option>
          <option>2 hours</option>
          <option>4 hours</option>
          <option>6 hours</option>
          <option>Full day</option>
        </select>
      </div>

      {/* Days */}
      <div className="flex flex-col space-y-1">
        <label className="font-medium">
          Select days this trip is available:
        </label>
        <div className="flex flex-wrap gap-2">
          {Object.keys(days).map((day) => (
            <label key={day} className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={days[day as keyof typeof days]} // TS-safe
                onChange={() => toggleDay(day as keyof typeof days)}
                className="h-4 w-4"
              />
              <span>{day}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Departure Time */}
      <div className="flex flex-col space-y-1">
        <label className="font-medium">Departure time</label>
        <select className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300">
          <option>Select what time it starts</option>
          <option>6:00 AM</option>
          <option>9:00 AM</option>
          <option>12:00 PM</option>
          <option>3:00 PM</option>
        </select>
      </div>

      {/* Price */}
      <div className="flex flex-col space-y-1">
        <label className="font-medium">Price</label>
        <input
          type="text"
          placeholder="Enter the price per trip e.g $500"
          className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Booking Type */}
      <div className="flex flex-col space-y-1">
        <label className="font-medium">
          Shared group bookings or private booking only?
        </label>
        <div className="flex gap-4">
          <label className="flex items-center space-x-1">
            <input
              type="radio"
              checked={bookingType === "private"}
              onChange={() => setBookingType("private")}
              className="h-4 w-4"
            />
            <span>Private</span>
          </label>
          <label className="flex items-center space-x-1">
            <input
              type="radio"
              checked={bookingType === "group"}
              onChange={() => setBookingType("group")}
              className="h-4 w-4"
            />
            <span>Group booking</span>
          </label>
        </div>
        <p className="text-gray-500 text-sm border rounded p-2">
          Group bookings allow users to sign up to the trip individually, if the
          date fills with enough people then the book will be confirmed.
        </p>
      </div>

      {/* Targeted Species */}
      <div className="flex flex-col space-y-2">
        <label className="font-medium">Targeted Species</label>
        <div className="flex flex-wrap gap-2">
          {species.map((sp) => (
            <span
              key={sp}
              className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
            >
              {sp}{" "}
              <AiOutlineClose
                className="w-3 h-3 cursor-pointer"
                onClick={() => removeSpecies(sp)}
              />
            </span>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={newSpecies}
            onChange={(e) => setNewSpecies(e.target.value)}
            placeholder="Search species..."
            className="border rounded px-3 py-2 flex-1 focus:outline-none focus:ring focus:ring-blue-300"
          />
          <button
            onClick={addSpecies}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default Trips;
