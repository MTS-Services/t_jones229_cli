"use client";

import { Card, Divider } from "antd";
import { useFormContext } from "react-hook-form";
import CheckboxGroup from "./CheckboxGroup";
import {
  X,
  Upload,
  Play,
  ImageIcon,
  Camera,
  Video,
  Info,
  Users,
  Ship,
  Calendar,
  Ruler,
  FileText,
} from "lucide-react";
import {
  fishingFacilitiesOptions,
  fishingGearCrewOptions,
} from "@/constant/CheckBoxLevel";
import { useRef, useState, ChangeEvent, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useUploadFileMutation } from "@/redux/api/uploadFile";
import Image from "next/image";
import { setImageUrl } from "@/redux/slices/uploadImageSlice";
import { toast } from "react-toastify";
import { useGetMyBoatQuery } from "@/redux/api/boatApi";

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  type: "image" | "video";
}

const ErrorMessage = ({ error }: { error?: string }) =>
  error ? (
    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
      <Info className="h-4 w-4" />
      {error}
    </p>
  ) : null;

interface InformationProps {
  setIsLicenceImage: (value: boolean) => void;
}

export default function Information({ setIsLicenceImage }: InformationProps) {
  const {
    register,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useFormContext<{
    licenceImages: string[];
    sharedBooking: boolean;
    facilities: string[];
    gearAndCrew: string[];
    guests: number;
    description: string;
    manufacturer: string;
    boatLength: number;
    modelYear: number;
  }>();

  const { data } = useGetMyBoatQuery({});
  const dispatch = useDispatch();

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [idCounter, setIdCounter] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateId = () => {
    setIdCounter((prev) => prev + 1);
    return `license-file-${idCounter}-${Date.now()}`;
  };

  useEffect(() => {
    if (data?.data?.[0]) {
      const boat = data.data[0];
      reset({
        facilities: boat.facilities || ["kitchen"],
        gearAndCrew: boat.gearAndCrew || ["Tuna tubes", "Downriggers"],
        sharedBooking: boat.sharedBooking || false,
        guests: boat.guests || "",
        description: boat.description || "",
        manufacturer: boat.manufacturer || "",
        boatLength: boat.boatLength || "",
        modelYear: boat.modelYear || "",
        licenceImages: boat.licenceImages || [],
      });
    }
  }, [data, reset]);

  const selectedBooking = watch("sharedBooking");

  const [uploadFileFN, { isLoading }] = useUploadFileMutation();

  const handleFiles = async (files: File[]) => {
    const validFiles = files.filter(
      (file) =>
        file.type.startsWith("image/") || file.type.startsWith("video/"),
    );

    const newFormData = new FormData();
    validFiles.forEach((file) => {
      const id = generateId();
      const preview = URL.createObjectURL(file);
      const type = file.type.startsWith("image/") ? "image" : "video";
      setUploadedFiles((prev) => [...prev, { id, file, preview, type }]);
      newFormData.append("images", file);
    });

    try {
      const res = await uploadFileFN(newFormData).unwrap();
      if (res?.success && Array.isArray(res?.data?.images)) {
        setValue("licenceImages", res.data.images);
        dispatch(setImageUrl(res.data.images));
        setIsLicenceImage(true);
        // toast.success("Files uploaded successfully!");
      } else {
        toast.error(res?.data?.message || "File upload failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload files");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(Array.from(e.dataTransfer.files));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(Array.from(e.target.files));
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove) URL.revokeObjectURL(fileToRemove.preview);
      // toast.info("File removed");
      return prev.filter((f) => f.id !== id);
    });
  };

  const handleBrowseClick = () => fileInputRef.current?.click();

  return (
    <div className="space-y-6">
      {/* Listing Details Section */}
      <section className="">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-1 bg-orange-500 rounded-full"></div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            Listing Details
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Shared Booking */}
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-4">
                Shared Bookings
              </label>
              <div className="flex gap-6">
                {[
                  {
                    key: "Yes",
                    value: true,
                    description: "Accept multiple bookings",
                  },
                  {
                    key: "No",
                    value: false,
                    description: "Private bookings only",
                  },
                ].map((option) => (
                  <label
                    key={option.key}
                    className="flex items-start gap-3 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      checked={selectedBooking === option.value}
                      onChange={() => setValue("sharedBooking", option.value)}
                      className="mt-1 w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                    />
                    <div>
                      <span className="block text-base text-gray-700 font-medium">
                        {option.key}
                      </span>
                      <span className="block text-sm text-gray-500">
                        {option.description}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Angler Capacity */}
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">
                <Users className="inline-block h-5 w-5 mr-2 text-gray-500" />
                Angler Capacity
              </label>
              <select
                {...register("guests", {
                  required: "Please select angler capacity",
                  valueAsNumber: true,
                  min: 1,
                  validate: (value) =>
                    Number.isInteger(value) || "Please select a valid number",
                })}
                className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all bg-white"
              >
                <option value="">Select capacity</option>
                {Array.from({ length: 20 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} Angler{i !== 0 ? "s" : ""}
                  </option>
                ))}
              </select>
              <ErrorMessage error={errors?.guests?.message as string} />
            </div>
          </div>
        </div>
      </section>

      {/* Boat Info Section */}
      <section className="">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-1 bg-orange-500 rounded-full"></div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            Boat Information
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Boat Description */}
            <div className="md:col-span-2">
              <label className="block text-base font-semibold text-gray-700 mb-2">
                <FileText className="inline-block h-5 w-5 mr-2 text-gray-500" />
                Boat Description
              </label>
              <textarea
                {...register("description", {
                  required: "Please enter a description",
                })}
                rows={4}
                className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all bg-white resize-none"
                placeholder="Tell guests about your boat, its features, and what makes it special..."
              />
              <ErrorMessage error={errors?.description?.message as string} />
            </div>

            {/* Manufacturer */}
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">
                <Ship className="inline-block h-5 w-5 mr-2 text-gray-500" />
                Manufacturer
              </label>
              <input
                type="text"
                {...register("manufacturer", {
                  required: "Manufacturer is required",
                })}
                className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all bg-white"
                placeholder="e.g., Viking, Boston Whaler"
              />
              <ErrorMessage error={errors?.manufacturer?.message as string} />
            </div>

            {/* Boat Length */}
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">
                <Ruler className="inline-block h-5 w-5 mr-2 text-gray-500" />
                Boat Length (feet)
              </label>
              <input
                type="number"
                {...register("boatLength", {
                  required: "Length is required",
                  valueAsNumber: true,
                  min: 1,
                  validate: (value) =>
                    Number.isInteger(value) || "Please enter a whole number",
                })}
                className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all bg-white"
                placeholder="e.g., 24"
              />
              <ErrorMessage error={errors?.boatLength?.message as string} />
            </div>

            {/* Model Year */}
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">
                <Calendar className="inline-block h-5 w-5 mr-2 text-gray-500" />
                Model Year
              </label>
              <input
                type="number"
                {...register("modelYear", {
                  required: "Model year is required",
                  valueAsNumber: true,
                })}
                className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all bg-white"
                placeholder="e.g., 2023"
              />
              <ErrorMessage error={errors?.modelYear?.message as string} />
            </div>
          </div>
        </div>
      </section>

      {/* Features & Gear Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 ">
        {/* Features */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Features</h3>
          <p className="text-sm text-gray-500 mb-4">Select all that apply</p>
          <CheckboxGroup
            name="facilities"
            options={fishingFacilitiesOptions}
            selectedValues={watch("facilities") || []}
            register={register}
          />
        </div>

        {/* Gear & Crew */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Gear & Crew</h3>
          <p className="text-sm text-gray-500 mb-4">Select all that apply</p>
          <CheckboxGroup
            name="gearAndCrew"
            options={fishingGearCrewOptions}
            selectedValues={watch("gearAndCrew") || []}
            register={register}
          />
        </div>
      </div>

      {/* Document Upload Section */}
      <section className="">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-1 bg-orange-500 rounded-full"></div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            License & Documentation
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-gray-600 mb-6">
            Upload photo or screenshot proof of Captain ID and boating license
          </p>

          <Card className="bg-gray-50 border-2 border-dashed border-gray-300 hover:border-orange-400 transition-colors">
            <div
              className={`p-8 text-center transition-all ${
                isDragOver ? "bg-orange-50 border-orange-300" : ""
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex justify-center mb-4">
                <div className="bg-orange-100 p-4 rounded-full">
                  <Upload className="h-8 w-8 text-orange-500" />
                </div>
              </div>
              <p className="text-lg text-gray-700 mb-2">
                Drag & Drop your files here
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Supports images and videos (max 20MB each)
              </p>
              <button
                onClick={handleBrowseClick}
                type="button"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-semibold transition-all transform hover:scale-105"
              >
                Browse Files
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </Card>
        </div>
      </section>

      {/* Uploaded Files Gallery */}
      {uploadedFiles.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              Uploaded Files
              <span className="ml-2 text-sm text-gray-500 font-normal">
                ({uploadedFiles.length} file
                {uploadedFiles.length !== 1 ? "s" : ""})
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedFiles.map((uploadedFile) => (
              <Card
                key={uploadedFile.id}
                className="group overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-square">
                  {uploadedFile.type === "image" ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={uploadedFile.preview || "/placeholder.svg"}
                        alt="Uploaded image"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="relative w-full h-full bg-gray-900">
                      <video
                        src={uploadedFile.preview}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                        preload="metadata"
                        // @ts-ignore - webkit attribute for iOS
                        webkitPlaysinline="true"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all">
                        <Play className="h-10 w-10 text-white" />
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => removeFile(uploadedFile.id)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
                    aria-label="Remove file"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded flex items-center justify-between">
                    <span className="flex items-center gap-1 truncate">
                      {uploadedFile.type === "image" ? (
                        <Camera className="h-3 w-3 flex-shrink-0" />
                      ) : (
                        <Video className="h-3 w-3 flex-shrink-0" />
                      )}
                      <span className="truncate">
                        {uploadedFile.file.name.length > 20
                          ? `${uploadedFile.file.name.substring(0, 20)}...`
                          : uploadedFile.file.name}
                      </span>
                    </span>
                    <span className="text-xs opacity-75">
                      {(uploadedFile.file.size / (1024 * 1024)).toFixed(1)} MB
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {isLoading && (
        <div className="fixed bottom-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          <span>Uploading files...</span>
        </div>
      )}
    </div>
  );
}
