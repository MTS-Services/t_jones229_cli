"use client";

import {
  useState,
  useRef,
  useCallback,
  type DragEvent,
  type ChangeEvent,
} from "react";
import {
  X,
  Upload,
  Play,
  ImageIcon,
  Camera,
  Video,
  Info,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import { Card, Progress } from "antd";
import { useUploadFileMutation } from "@/redux/api/uploadFile";
import { useFormContext } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setImageUrl } from "@/redux/slices/uploadImageSlice";

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  type: "image" | "video";
  uploadProgress?: number;
  status?: "uploading" | "success" | "error";
}

interface PhotosVideosProps {
  setIsBoatImage: (value: boolean) => void;
}

export default function PhotosVideos({ setIsBoatImage }: PhotosVideosProps) {
  const { setValue } = useFormContext<{ photos: string[] }>();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [idCounter, setIdCounter] = useState(0);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {},
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  // Stable ID generator
  const generateId = useCallback(() => {
    setIdCounter((prev) => prev + 1);
    return `file-${idCounter}-${Date.now()}`;
  }, [idCounter]);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const [uploadFileFN, { isLoading }] = useUploadFileMutation();

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      return { valid: false, error: "File must be an image or video" };
    }

    if (isVideo) {
      if (file.size > 1024 * 1024 * 1024) {
        // 1GB
        return { valid: false, error: "Video must be less than 1GB" };
      }
      if (file.size < 5 * 1024 * 1024) {
        // 5MB
        return {
          valid: false,
          error: "Video must be at least 5 seconds (min 5MB)",
        };
      }
    }

    return { valid: true };
  };

  const handleFiles = async (files: File[]) => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach((file) => {
      const validation = validateFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else if (validation.error) {
        errors.push(`${file.name}: ${validation.error}`);
      }
    });

    if (errors.length > 0) {
      // You could show a toast notification here
      console.warn("Validation errors:", errors);
    }

    if (validFiles.length === 0) {
      return;
    }

    // Add files with uploading status
    const newFiles: UploadedFile[] = validFiles.map((file) => {
      const id = generateId();
      const preview = URL.createObjectURL(file);
      const type = file.type.startsWith("image/") ? "image" : "video";

      return {
        id,
        file,
        preview,
        type,
        status: "uploading",
        uploadProgress: 0,
      };
    });

    setUploadedFiles((prev) => [...prev, ...newFiles]);

    // Upload files
    const formData = new FormData();
    validFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      // Simulate progress for better UX (remove if API doesn't support progress)
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = { ...prev };
          newFiles.forEach((file) => {
            newProgress[file.id] = Math.min(
              (newProgress[file.id] || 0) + 10,
              90,
            );
          });
          return newProgress;
        });
      }, 200);

      const res = await uploadFileFN(formData).unwrap();
      clearInterval(interval);

      if (res?.success && Array.isArray(res?.data?.images)) {
        // Update files to success status
        setUploadedFiles((prev) =>
          prev.map((file) => ({
            ...file,
            status: "success",
            uploadProgress: 100,
          })),
        );

        setValue(
          "photos",
          res.data.images.map((img: string) => ({ url: img })),
        );
        dispatch(setImageUrl(res.data.images));
        setIsBoatImage(true);
      } else {
        throw new Error("Upload failed");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      setUploadedFiles((prev) =>
        prev.map((file) => ({
          ...file,
          status: "error",
        })),
      );
    }
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((f) => f.id !== id);
    });

    // Clean up progress
    setUploadProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[id];
      return newProgress;
    });
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const getFileSizeText = (bytes: number): string => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="">
      {/* Header Section */}
      <section className="mb-8">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-6">
          <p className="text-blue-700">
            <Info className="inline-block h-5 w-5 mr-2" />
            Upload at least 5 photos to make your listing stand out!
          </p>
        </div>
      </section>

      {/* Guidelines Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Photo Guidelines */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Camera className="h-5 w-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              Photo Guidelines
            </h2>
          </div>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-1">•</span>
              <span>
                A variety of images, including your boat, happy customers, and
                catches
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-1">•</span>
              <span>Horizontal/landscape photos for the best display</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-1">•</span>
              <span>Avoid using screenshots to maintain quality</span>
            </li>
          </ul>
        </div>

        {/* Video Guidelines */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Video className="h-5 w-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              Video Guidelines
            </h2>
          </div>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-1">•</span>
              <span>Videos must be at least 5 seconds long</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-1">•</span>
              <span>File size: 5MB - 1GB</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-1">•</span>
              <span>
                Resolution: 720x1280px (Portrait) or 1280x720px (Landscape) or
                higher
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-1">•</span>
              <span>Slideshows are not allowed</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-1">•</span>
              <span>Videos with contact information will be removed</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Upload Area */}
      <div className="flex justify-center mb-8">
        <div className="w-full ">
          <Card className="bg-white border-2 border-dashed border-gray-300 hover:border-orange-400 transition-all">
            <div
              className={`p-8 text-center transition-all ${
                isDragOver ? "bg-orange-50 border-orange-300 scale-105" : ""
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex justify-center mb-4">
                <div
                  className={`p-4 rounded-full transition-all ${
                    isDragOver ? "bg-orange-200 scale-110" : "bg-orange-100"
                  }`}
                >
                  <Upload
                    className={`h-8 w-8 transition-all ${
                      isDragOver ? "text-orange-600" : "text-orange-500"
                    }`}
                  />
                </div>
              </div>
              <p className="text-lg font-medium text-gray-700 mb-2">
                {isDragOver ? "Drop your files here" : "Drag & Drop your files"}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Supports images and videos (max 1GB per file)
              </p>
              <button
                onClick={handleBrowseClick}
                type="button"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-sm"
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
      </div>

      {/* Uploaded Files Gallery */}
      {uploadedFiles.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Uploaded Files
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({uploadedFiles.length} file
                {uploadedFiles.length !== 1 ? "s" : ""})
              </span>
            </h2>
            {uploadedFiles.length < 5 && (
              <p className="text-sm text-orange-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                Add {5 - uploadedFiles.length} more file
                {5 - uploadedFiles.length !== 1 ? "s" : ""} (minimum 5)
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedFiles.map((uploadedFile) => (
              <Card
                key={uploadedFile.id}
                className="group overflow-hidden hover:shadow-lg transition-all"
                bodyStyle={{ padding: 0 }}
              >
                <div className="relative aspect-square">
                  {/* Media Preview */}
                  {uploadedFile.type === "image" ? (
                    <div className="relative w-full h-full bg-gray-100">
                      <Image
                        src={uploadedFile.preview || "/placeholder.svg"}
                        alt={uploadedFile.file.name}
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

                  {/* Status Overlay */}
                  {uploadedFile.status === "uploading" && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="bg-white rounded-lg p-2 w-3/4">
                        <Progress
                          percent={uploadProgress[uploadedFile.id] || 0}
                          size="small"
                          strokeColor="#f97316"
                          showInfo={false}
                        />
                        <p className="text-xs text-white text-center mt-1">
                          Uploading...
                        </p>
                      </div>
                    </div>
                  )}

                  {uploadedFile.status === "error" && (
                    <div className="absolute inset-0 bg-red-500 bg-opacity-80 flex items-center justify-center">
                      <p className="text-white text-xs text-center px-2">
                        Upload failed
                      </p>
                    </div>
                  )}

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFile(uploadedFile.id)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110 shadow-lg"
                    aria-label="Remove file"
                    disabled={uploadedFile.status === "uploading"}
                  >
                    <X className="h-4 w-4" />
                  </button>

                  {/* File Info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-1 text-xs">
                        {uploadedFile.type === "image" ? (
                          <Camera className="h-3 w-3" />
                        ) : (
                          <Video className="h-3 w-3" />
                        )}
                        <span className="truncate max-w-[100px]">
                          {uploadedFile.file.name.length > 15
                            ? `${uploadedFile.file.name.substring(0, 12)}...`
                            : uploadedFile.file.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        {getStatusIcon(uploadedFile.status)}
                        <span>{getFileSizeText(uploadedFile.file.size)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="fixed bottom-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span className="text-sm">Uploading files...</span>
            </div>
          )}
        </div>
      )}

      {/* Progress Summary */}
      {uploadedFiles.length > 0 && uploadedFiles.length < 5 && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            You've uploaded {uploadedFiles.length} file
            {uploadedFiles.length !== 1 ? "s" : ""}. Please upload at least 5
            photos to make your listing stand out!
          </p>
        </div>
      )}

      {uploadedFiles.length >= 5 && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Great! You've uploaded {uploadedFiles.length} file
            {uploadedFiles.length !== 1 ? "s" : ""}. Your listing is ready to
            go!
          </p>
        </div>
      )}
    </div>
  );
}
