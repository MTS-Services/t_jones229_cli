// "use client";

// import React from "react";
// import { X, Upload, Play, ImageIcon } from "lucide-react";
// import Image from "next/image";
// import { Card } from "antd";

// const PhotosVideos: React.FC = () => {
//   return (
//     <div className="space-y-6 lg:pb-10 md:pb-8 pb-6">
//       {/* Instructions */}
//       <div className="p-5 md:p-14">
//         <h1 className="text-xl md:text-2xl font-bold text-text Primary mb-2">
//           Upload photos and videos
//         </h1>
//         <p className="text-base text-[#878787] mb-4">
//           Upload at least 5 photos to make your listing stand out. For an
//           attractive gallery, we recommend:
//         </p>

//         <ul className="text-base text-[#878787] mb-4 px-8 space-y-1">
//           <li className="list-disc">
//             A variety of images, including your boat, happy customers, and your
//             catches.
//           </li>
//           <li className="list-disc">
//             Horizontal / landscape photos for the best display.
//           </li>
//           <li className="list-disc">
//             Avoid using screenshots of photos to maintain quality.
//           </li>
//         </ul>

//         <p className="text-base text-textPrimary mb-2">Video Guidelines:</p>
//         <ul className="text-base text-[#878787] px-8 space-y-1">
//           <li className="list-disc">Videos must be at least 5 seconds long.</li>
//           <li className="list-disc">
//             File size should be between 5MB and 1GB.
//           </li>
//           <li className="list-disc">
//             Resolution: Portrait (720x1280px) or Landscape (1280x720px) or
//             higher.
//           </li>
//           <li className="list-disc">Slideshows are not allowed.</li>
//           <li className="list-disc">
//             Videos with visible contact information will be removed.
//           </li>
//         </ul>
//       </div>

//       {/* Upload Card */}
//       <div className="px-5 md:px-14">
//         <Card className="bg-[#f5f5f5] border-2 border-dashed border-[#e0e0e0] max-w-3xl">
//           <div className="p-5 text-center space-y-4">
//             <div className="flex justify-center">
//               <Upload className="h-12 w-12 text-blue-500" />
//             </div>

//             <p className="text-sm md:text-lg text-gray-700">
//               Drag & Drop your files
//             </p>

//             <button
//               type="button"
//               className="bg-[#ff9500] text-sm rounded-md hover:bg-orange-600 text-white px-6 py-2 md:text-base font-semibold"
//             >
//               Browse to Upload
//             </button>
//           </div>
//         </Card>
//       </div>

//       {/* Static Preview UI */}
//       <div className="px-14">
//         <h2 className="text-xl font-semibold mb-4">Uploaded Files (4)</h2>

//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           {[1, 2, 3, 4].map((item) => (
//             <Card key={item} className="relative group">
//               <div className="p-2">
//                 <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
//                   <Image
//                     src="/placeholder.svg"
//                     alt="Preview"
//                     fill
//                     className="object-cover"
//                   />

//                   <button className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100">
//                     <X className="h-4 w-4" />
//                   </button>

//                   <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
//                     <ImageIcon className="h-3 w-3 inline mr-1" />
//                     sample-image.jpg
//                   </div>
//                 </div>
//               </div>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PhotosVideos;

"use client";

import React, { useState, useRef } from "react";
import { X, Upload, ImageIcon } from "lucide-react";
import Image from "next/image";
import { Card, message } from "antd";

const PhotosVideos: React.FC = () => {
  const [images, setImages] = useState<
    { id: string; url: string; name: string; file: File }[]
  >([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        url: URL.createObjectURL(file),
        name: file.name,
        file: file,
      }));
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleNext = () => {
    if (images.length === 0) {
      message.warning("Please upload at least one photo.");
      return;
    }

    console.log("Uploaded Files Data:", images);

    // যদি আপনি শুধু ফাইলের নামগুলো দেখতে চান:
    console.log(
      "File Names:",
      images.map((img) => img.name)
    );

    message.success("Check console for data!");
  };

  const handleBack = () => {
    console.log("Back button clicked");
  };

  return (
    <div className="space-y-6 lg:pb-10 md:pb-8 pb-6 flex flex-col lg:gap-10 md:gap-8 gap-6">
      {/* Instructions */}
      <div className="">
        <h1 className="text-xl md:text-2xl font-bold text-textPrimary mb-2">
          Upload photos and videos
        </h1>
        <p className="text-base text-[#878787] mb-4">
          Upload at least 5 photos to make your listing stand out. For an
          attractive gallery, we recommend:
        </p>

        <ul className="text-base text-[#878787] mb-4 px-8 space-y-1">
          <li className="list-disc">
            A variety of images, including your boat, happy customers, and your
            catches.
          </li>
          <li className="list-disc">
            Horizontal (landscape) photos for the best display.
          </li>
          <li className="list-disc">
            Avoid using screenshots of photos to maintain quality.
          </li>
        </ul>

        <p className="text-base text-textPrimary mb-2">Video Guidelines:</p>
        <ul className="text-base text-[#878787] px-8 space-y-1">
          <li className="list-disc">Videos must be at least 5 seconds long.</li>
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

      {/* Upload Card */}
      <div className="">
        <Card className="bg-[#f5f5f5] border-2 border-dashed border-[#e0e0e0] max-w-3xl">
          <div className="p-5 text-center space-y-4">
            <div className="flex justify-center">
              <Upload className="h-12 w-12 text-blue-500" />
            </div>

            <p className="text-sm md:text-lg text-gray-700">
              Drag & Drop your files
            </p>

            <input
              type="file"
              multiple
              hidden
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,video/*"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#ff9500] text-sm rounded-md hover:bg-orange-600 text-white px-6 py-2 md:text-base font-semibold"
            >
              Browse to Upload
            </button>
          </div>
        </Card>
      </div>

      {/* Previews */}
      <div className="">
        <h2 className="text-xl font-semibold mb-4">
          Uploaded Files ({images.length})
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <Card
              key={img.id}
              className="relative group"
              bodyStyle={{ padding: "8px" }}
            >
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={img.url}
                  alt="Preview"
                  fill
                  className="object-cover"
                />

                <button
                  onClick={() => removeImage(img.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-[10px] px-2 py-1 rounded max-w-[90%] truncate">
                  <ImageIcon className="h-3 w-3 inline mr-1" />
                  {img.name}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex items-start justify-between border-t pt-8">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-100 transition-all font-medium"
        >
          <span className="text-lg">‹</span> Back
        </button>

        <button
          onClick={handleNext}
          className="bg-[#f2a93b] hover:bg-[#e0962d] text-white px-12 py-3 rounded-xl font-bold transition-all shadow-md flex items-center gap-2"
        >
          Next <span className="text-xl">›</span>
        </button>
      </div>
    </div>
  );
};

export default PhotosVideos;
