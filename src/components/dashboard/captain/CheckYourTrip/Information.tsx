"use client";

import { Card, Divider } from "antd";
import { Upload, Play, ImageIcon, X } from "lucide-react";
import Image from "next/image";

import React from "react";

const Information: React.FC = () => {
  return (
    <div className="mx-auto bg-white">
      {/* Header */}
      <div className="bg-[#F5F5F5] pt-16 md:pt-0 px-5 md:px-14 py-9">
        <h1 className="text-3xl font-bold text-textPrimary mb-2">
          Information
        </h1>
        <p className="text-base text-textPrimary">
          Please provide basic information about your boat.
        </p>
      </div>

      <div className="py-12 px-5 md:px-14">
        {/* Listing Details */}
        <h2 className="text-2xl font-bold mb-6">Listing Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Shared Booking */}
          <div>
            <h3 className="text-lg font-medium mb-4">
              Accept shared bookings?
            </h3>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input type="radio" />
                Yes
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" />
                No
              </label>
            </div>
          </div>

          {/* Angler Capacity */}
          <div>
            <label className="block mb-2">Angler Capacity</label>
            <select className="w-full border px-3 py-2">
              <option>Angler Capacity</option>
              {[...Array(10)].map((_, i) => (
                <option key={i}>{i + 1}</option>
              ))}
            </select>
          </div>
        </div>

        <Divider />

        {/* Boat Info */}
        <h2 className="text-2xl font-bold my-6">Boat Info</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block mb-2">Boat Description</label>
            <textarea
              className="w-full border px-3 py-2"
              placeholder="Short description"
            />
          </div>

          <div>
            <label className="block mb-2">Manufacturer</label>
            <input
              className="w-full border px-3 py-2"
              placeholder="e.g. Viking"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div>
            <label className="block mb-2">Boat Length (ft)</label>
            <input className="w-full border px-3 py-2" />
          </div>

          <div>
            <label className="block mb-2">Model Year</label>
            <input className="w-full border px-3 py-2" />
          </div>
        </div>

        {/* Upload Section */}
        <h2 className="text-lg font-bold mb-4">Upload Captain ID & Licence</h2>

        <Card className="border-2 border-dashed bg-[#f5f5f5] max-w-3xl">
          <div className="text-center py-10 space-y-4">
            <Upload className="mx-auto h-12 w-12 text-blue-500" />
            <p>Drag & drop your files</p>
            <button className="bg-orange-500 text-white px-6 py-2 rounded">
              Browse to Upload
            </button>
          </div>
        </Card>

        {/* Uploaded Preview (Static UI) */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">Uploaded Files</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="relative">
              <div className="relative aspect-square bg-gray-200 rounded overflow-hidden">
                <Image
                  src="/placeholder.svg"
                  alt="preview"
                  fill
                  className="object-cover"
                />

                <button className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full">
                  <X size={14} />
                </button>

                <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                  <ImageIcon size={12} className="inline mr-1" />
                  image.jpg
                </div>
              </div>
            </Card>
          </div>
        </div>

        <Divider className="mt-12" />
      </div>
    </div>
  );
};

export default Information;
