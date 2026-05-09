"use client";

import { Divider } from "antd";
import {
  X,
  Search,
  Plus,
  Fish,
  MapPin,
  Wrench,
  Package,
  Shield,
  Info,
} from "lucide-react";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import CheckboxGroup from "./CheckboxGroup";
import { fishingLocationsOptions } from "@/constant/CheckBoxLevel";

const fishingTechniquesOptions = [
  "Light tackle",
  "Heavy tackle",
  "Bottom Fishing",
  "Deep Sea Fishing",
  "Trolling",
  "Spinning",
  "Jigging",
  "Popping",
  "Fly fishing",
];

const policiesOptions = [
  "Catch and Release",
  "Keep Catch",
  "No Smoking",
  "Alcohol Allowed",
];

const priceInclusionsOptions = [
  "Bait",
  "Tackle",
  "Water",
  "Snacks",
  "Lunch",
  "Ice",
];

interface CheckboxSection {
  title: string;
  name: string;
  options: string[];
  icon?: React.ReactNode;
}

export default function Fishing() {
  const { register, setValue } = useFormContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [speciesList, setSpeciesList] = useState<string[]>([]);

  const addSpecies = () => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;

    // Prevent duplicates
    if (speciesList.includes(trimmedQuery)) {
      // Could show a toast notification here
      console.warn("Species already added");
      return;
    }

    const updated = [...speciesList, trimmedQuery];
    setSpeciesList(updated);
    setValue("fishingSpecies", updated);
    setSearchQuery("");
  };

  const removeSpecies = (value: string) => {
    const updated = speciesList.filter((f) => f !== value);
    setSpeciesList(updated);
    setValue("fishingSpecies", updated);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSpecies();
    }
  };

  const sections: CheckboxSection[] = [
    {
      title: "Fishing Locations",
      name: "fishingLocation",
      options: fishingLocationsOptions,
      icon: <MapPin className="h-5 w-5 text-orange-500" />,
    },
    {
      title: "Fishing Techniques",
      name: "fishingTechnique",
      options: fishingTechniquesOptions,
      icon: <Wrench className="h-5 w-5 text-orange-500" />,
    },
    {
      title: "Included in Price",
      name: "includedPrice",
      options: priceInclusionsOptions,
      icon: <Package className="h-5 w-5 text-orange-500" />,
    },
    {
      title: "Policies",
      name: "policies",
      options: policiesOptions,
      icon: <Shield className="h-5 w-5 text-orange-500" />,
    },
  ];

  return (
    <div className="">
      {/* Targeted Species Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Fish className="h-6 w-6 text-orange-500" />
          <h2 className="text-xl font-bold text-gray-900">Targeted Species</h2>
        </div>

        <p className="text-gray-600 mb-6">
          Choose which species customers can target on your trip
        </p>

        <div className="">
          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search for a species (e.g., Tuna, Marlin, Salmon)..."
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
              />
            </div>
            <button
              type="button"
              onClick={addSpecies}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add Species
            </button>
          </div>

          {/* Species Tags */}
          {speciesList.length > 0 && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {speciesList.map((species) => (
                  <div
                    key={species}
                    className="group flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-full text-sm font-medium hover:shadow-md transition-all"
                  >
                    <Fish className="h-3.5 w-3.5" />
                    <span>{species}</span>
                    <button
                      type="button"
                      onClick={() => removeSpecies(species)}
                      className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                      aria-label={`Remove ${species}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {speciesList.length} species selected
              </p>
            </div>
          )}

          {/* Empty State */}
          {speciesList.length === 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
              <Fish className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                No species added yet. Search and add the fish species you
                target.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Checkbox Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => (
          <div
            key={section.name}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
              {section.icon}
              <h3 className="text-lg font-bold text-gray-900">
                {section.title}
              </h3>
            </div>
            <CheckboxGroup
              name={section.name}
              options={section.options}
              register={register}
            />
          </div>
        ))}
      </div>

      {/* Helpful Tips */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mb-1">
              Pro Tip
            </h4>
            <p className="text-sm text-blue-700">
              Be specific about your fishing offerings! Accurate information
              helps anglers find the perfect trip and ensures everyone has a
              great experience on the water.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
