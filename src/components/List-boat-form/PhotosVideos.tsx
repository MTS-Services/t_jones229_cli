"use client";

import {
  useState,
  useRef,
  useCallback,
  type DragEvent,
  type ChangeEvent,
} from "react";
import { X, Upload, Play, ImageIcon } from "lucide-react";
import Image from "next/image";
import { Card } from "antd";
import { useUploadFileMutation } from "@/redux/api/uploadFile";
import { useFormContext } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setImageUrl } from "@/redux/slices/uploadImageSlice";

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  type: "image" | "video";
}

interface PhotosVideosProps {
  setIsBoatImage: (value: boolean) => void;
}

export default function PhotosVideos({ setIsBoatImage }: PhotosVideosProps) {
  const { setValue } = useFormContext<{ photos: string[] }>();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [idCounter, setIdCounter] = useState(0);
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

  const handleFiles = async (files: File[]) => {
    const validFiles = files.filter((file) => {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      return isImage || isVideo;
    });

    // Only proceed if there are valid files
    if (validFiles.length === 0) {
      console.log("No valid image/video files selected");
      return;
    }

    validFiles.forEach((file) => {
      const id = generateId();
      const preview = URL.createObjectURL(file);
      const type = file.type.startsWith("image/") ? "image" : "video";

      const newFile: UploadedFile = {
        id,
        file,
        preview,
        type,
      };

      setUploadedFiles((prev) => [...prev, newFile]);
    });

    // Create FormData inside the function to avoid stale data
    const formData = new FormData();
    validFiles.forEach((file) => {
      formData.append("images", file);
    });

    // Debug: Log FormData contents
    console.log("📤 Uploading files:", validFiles.length);
    for (const [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value);
    }

    try {
      const res = await uploadFileFN(formData).unwrap();
      console.log("✅ Upload response:", res);
      if (res?.success) {
        // const uploadedUrls = res?.data?.images || [];
        if (res?.success && Array.isArray(res?.data?.images)) {
          // setValue("photos", [res.data.images]);
          setValue(
            "photos",
            res.data.images.map((img: string) => ({ url: img }))
          );
          dispatch(setImageUrl(res.data.images));
          setIsBoatImage(true);
        }
      }
    } catch (error: any) {
      console.error("❌ Upload error:", error);
      console.error("❌ Error details:", JSON.stringify(error, null, 2));
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
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <div className="">
        <h1 className="text-xl md:text-2xl font-bold text-textPrimary leading-normal mb-4">
          Upload photos and videos
        </h1>
        <p className="text-lg font-medium text-gray-900 mb-4">
          Upload at least 5 photos to make your listing stand out. For an
          attractive gallery, we recommend:
        </p>

        <ul className="text-base text-gray-600 font-normal mb-4 px-8 space-y-1">
          <li className="list-disc">
            A variety of images, including your boat, happy customers, and your
            catches.
          </li>
          <li className="list-disc">
            Horizontal / landscape photos for the best display.
          </li>
          <li className="list-disc">
            Avoid using screenshots of photos to maintain quality.
          </li>
        </ul>

        <div className="mb-6">
          <p className="text-lg font-medium text-gray-900 leading-normal">
            Video Guidelines:
          </p>
          <ul className="text-base font-normal text-gray-600 mb-4 px-8 space-y-1">
            <li className="list-disc">
              Videos must be at least 5 seconds long.
            </li>
            <li className="list-disc">
              File size should be between 5MB and 1GB.
            </li>
            <li className="list-disc">
              Resolution: Portrait (720x1280px) or Landscape (1280x720px) or
              higher.
            </li>
            <li className="list-disc">Slideshows are not allowed.</li>
            <li className="list-disc">
              Videos with visible contact information will be removed.
            </li>
          </ul>
        </div>
      </div>

      <div className="block lg:max-w-4xl md:max-w-3xl w-full mx-auto mx-auto pt-6">
        <Card className="bg-[#f5f5f5] border-2 border-dashed border-[#e0e0e0] max-w-3xl">
          <div className="p-5">
            <div
              className={`text-center space-y-4 ${
                isDragOver ? "bg-blue-50 border-blue-300" : ""
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex justify-center">
                <Upload className="h-12 w-12 text-blue-500" />
              </div>
              <p className=" text-sm text-gray-700">Drag & Drop your files</p>
              <button
                onClick={handleBrowseClick}
                type="button"
                className="bg-[#ff9500] text-sm rounded-md hover:bg-orange-600 text-white px-6 py-2 md:text-base font-semibold leading-normal"
              >
                Browse to Upload
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
          </div>
        </Card>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="px-14">
          <h2 className="text-xl font-semibold mb-4">
            Uploaded Files ({uploadedFiles.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedFiles.map((uploadedFile) => (
              <Card key={uploadedFile.id} className="relative group">
                <div className="p-2">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                    {uploadedFile.type === "image" ? (
                      <Image
                        src={uploadedFile.preview || "/placeholder.svg"}
                        alt="Uploaded image"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="relative w-full h-full">
                        <video
                          src={uploadedFile.preview}
                          className="w-full h-full object-cover"
                          muted
                          playsInline
                          preload="metadata"
                          // @ts-ignore - webkit attribute for iOS
                          webkitPlaysinline="true"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                          <Play className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => removeFile(uploadedFile.id)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>

                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      {uploadedFile.type === "image" ? (
                        <ImageIcon className="h-3 w-3 inline mr-1" />
                      ) : (
                        <Play className="h-3 w-3 inline mr-1" />
                      )}
                      {uploadedFile.file.name.length > 15
                        ? `${uploadedFile.file.name.substring(0, 15)}...`
                        : uploadedFile.file.name}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          {isLoading ? "uploading..." : ""}
        </div>
      )}
    </div>
  );
}
