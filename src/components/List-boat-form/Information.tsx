'use client';

import { Card, Divider } from 'antd';
import { useFormContext } from 'react-hook-form';
import CheckboxGroup from './CheckboxGroup';
import { X, Upload, Play, ImageIcon } from 'lucide-react';
import {
  fishingFacilitiesOptions,
  fishingGearCrewOptions,
} from '@/constant/CheckBoxLevel';
import { useRef, useState, ChangeEvent, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useUploadFileMutation } from '@/redux/api/uploadFile';
import Image from 'next/image';
import { setImageUrl } from '@/redux/slices/uploadImageSlice';
import { toast } from 'react-toastify';
import { useGetMyBoatQuery } from '@/redux/api/boatApi';

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video';
}

const ErrorMessage = ({ error }: { error?: string }) =>
  error ? <p className='text-red-500 text-sm mt-1'>{error}</p> : null;

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

  // Stable ID generator
  const generateId = () => {
    setIdCounter((prev) => prev + 1);
    return `license-file-${idCounter}-${Date.now()}`;
  };

  // Reset form values when data loads
  useEffect(() => {
    if (data?.data?.[0]) {
      const boat = data.data[0];
      reset({
        facilities: boat.facilities || ['kitchen'],
        gearAndCrew: boat.gearAndCrew || ['Tuna tubes', 'Downriggers'],
        sharedBooking: boat.sharedBooking || false,
        guests: boat.guests || '',
        description: boat.description || '',
        manufacturer: boat.manufacturer || '',
        boatLength: boat.boatLength || '',
        modelYear: boat.modelYear || '',
        licenceImages: boat.licenceImages || [],
      });
    }
  }, [data, reset]);

  const selectedBooking = watch('sharedBooking');

  const [uploadFileFN, { isLoading }] = useUploadFileMutation();
  const formData = new FormData();

  const handleFiles = async (files: File[]) => {
    const validFiles = files.filter(
      (file) => file.type.startsWith('image/') || file.type.startsWith('video/')
    );

    validFiles.forEach((file) => {
      const id = generateId();
      const preview = URL.createObjectURL(file);
      const type = file.type.startsWith('image/') ? 'image' : 'video';

      setUploadedFiles((prev) => [...prev, { id, file, preview, type }]);
    });

    files.forEach((file) => formData.append('images', file));

    try {
      const res = await uploadFileFN(formData).unwrap();
      if (res?.success && Array.isArray(res?.data?.images)) {
        setValue('licenceImages', res.data.images);
        dispatch(setImageUrl(res.data.images));
        setIsLicenceImage(true);
      } else {
        toast.error(res?.data?.message || 'File upload failed');
      }
    } catch (error) {
      console.error(error);
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
      return prev.filter((f) => f.id !== id);
    });
  };

  const handleBrowseClick = () => fileInputRef.current?.click();

  return (
    <div className='mx-auto bg-white'>
      {/* Header */}
      <div className='bg-[#F5F5F5] pt-16 md:pt-0 px-5 md:px-14 py-9'>
        <h1 className='text-3xl font-bold text-textPrimary leading-normal mb-2'>
          Information
        </h1>
        <p className='text-base text-textPrimary font-normal leading-normal'>
          we need to collect the Captain&apos;s name, address, email address and
          telephone number. And get them to create a password.
        </p>
      </div>

      <div className='py-12 px-5 md:px-14'>
        {/* Listing Details */}
        <div className='my-8'>
          <h2 className='text-xl md:text-2xl font-bold text-textPrimary leading-normal mb-4'>
            Listing Details
          </h2>

          <div className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-10'>
              {/* Shared Booking */}
              <div className='mb-8'>
                <h2 className='text-lg font-medium text-gray-900 mb-4'>
                  Do you want to accept shared bookings?
                </h2>
                <div className='flex gap-5'>
                  {[
                    { key: 'Yes', value: true },
                    { key: 'No', value: false },
                  ].map((option) => (
                    <label
                      key={option.key}
                      className='flex justify-center gap-2 items-center'
                    >
                      <input
                        type='radio'
                        checked={selectedBooking === option.value}
                        onChange={() => setValue('sharedBooking', option.value)}
                        className='text-blue-600 border-gray-300 rounded'
                      />
                      <span className='text-base text-gray-700'>
                        {option.key}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Angler Capacity */}
              <div className='w-full'>
                <label className='text-textSecondary text-base md:text-lg font-normal leading-8'>
                  Angler Capacity
                </label>
                <select
                  {...register('guests', {
                    required: 'Please enter a whole number',
                    valueAsNumber: true,
                    min: 1,
                    validate: (value) =>
                      Number.isInteger(value) || 'Please enter a whole number',
                  })}
                  className='w-full px-3 py-2 border border-[#E0E0E0] bg-white'
                >
                  <option value=''>Angler Capacity</option>
                  {Array.from({ length: 20 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                <ErrorMessage error={errors?.guests?.message as string} />
              </div>
            </div>

            <Divider style={{ borderColor: '#d9d9d9' }} className='my-4' />
            <h2 className='text-xl md:text-2xl font-bold text-textPrimary leading-normal mt-2 col-span-2'>
              Boat Info
            </h2>

            {/* Boat Description & Manufacturer */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='text-textSecondary text-base md:text-lg font-normal leading-8'>
                  Boat Description
                </label>
                <textarea
                  {...register('description', {
                    required: 'Please enter short description',
                  })}
                  className='w-full px-3 py-2 border border-[#E0E0E0]'
                  placeholder='Write a short description of your boat'
                />
                <ErrorMessage error={errors?.description?.message as string} />
              </div>

              <div>
                <label className='text-textSecondary text-base md:text-lg font-normal leading-8'>
                  Manufacturer
                </label>
                <input
                  type='text'
                  {...register('manufacturer', {
                    required: 'Manufacturer is required',
                  })}
                  className='w-full px-3 py-2 border border-[#E0E0E0]'
                  placeholder='e.g. Viking'
                />
                <ErrorMessage error={errors?.manufacturer?.message as string} />
              </div>
            </div>

            {/* Boat Length & Model Year */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='text-textSecondary text-base md:text-lg font-normal leading-8'>
                  Boat length in feet
                </label>
                <input
                  type='number'
                  {...register('boatLength', {
                    required: 'Length is required',
                    valueAsNumber: true,
                    min: 1,
                    validate: (value) =>
                      Number.isInteger(value) || 'Please enter a whole number',
                  })}
                  className='w-full px-3 py-2 border border-[#E0E0E0]'
                  placeholder='e.g 10'
                />
                <ErrorMessage error={errors?.boatLength?.message as string} />
              </div>

              <div>
                <label className='text-textSecondary text-base md:text-lg font-normal leading-8'>
                  Model Year
                </label>
                <input
                  type='number'
                  {...register('modelYear', {
                    required: 'model year is required',
                    valueAsNumber: true,
                  })}
                  className='w-full px-3 py-2 border border-[#E0E0E0]'
                  placeholder='your boat model year, e.g. 2023'
                />
                <ErrorMessage error={errors?.modelYear?.message as string} />
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className='mb-8'>
          <h2 className='text-base md:text-lg font-bold text-gray-900 mb-4'>
            Features
          </h2>
          <CheckboxGroup
            name='facilities'
            options={fishingFacilitiesOptions}
            selectedValues={watch('facilities') || []}
            register={register}
          />
        </div>

        {/* Gear & Crew */}
        <div className='mb-8'>
          <h2 className='text-base md:text-lg font-bold text-gray-900 mb-4'>
            Gear & Crew
          </h2>
          <CheckboxGroup
            name='gearAndCrew'
            options={fishingGearCrewOptions}
            selectedValues={watch('gearAndCrew') || []}
            register={register}
          />
        </div>

        {/* Upload */}
        <div className='px-5 mb-8'>
          <h2 className='text-base md:text-lg font-bold text-gray-900 mb-4'>
            Upload photo or screenshot proof of Captain ID and boating licence.
          </h2>
          <Card className='bg-[#f5f5f5] border-2 border-dashed border-[#e0e0e0] max-w-3xl'>
            <div className='p-5'>
              <div
                className={`text-center space-y-4 ${
                  isDragOver ? 'bg-blue-50 border-blue-300' : ''
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className='flex justify-center'>
                  <Upload className='h-12 w-12 text-blue-500' />
                </div>
                <p className='text-sm md:text-lg text-gray-700'>
                  Drag & Drop your files
                </p>
                <button
                  onClick={handleBrowseClick}
                  type='button'
                  className='bg-[#ff9500] text-sm rounded-md hover:bg-orange-600 text-white px-6 py-2 md:text-base font-semibold leading-normal'
                >
                  Browse to Upload
                </button>
                <input
                  ref={fileInputRef}
                  type='file'
                  multiple
                  accept='image/*,video/*'
                  onChange={handleFileChange}
                  className='hidden'
                />
              </div>
            </div>
          </Card>
        </div>

        {uploadedFiles.length > 0 && (
          <div className='px-14'>
            <h2 className='text-xl font-semibold mb-4'>
              Uploaded Files ({uploadedFiles.length})
            </h2>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {uploadedFiles.map((uploadedFile) => (
                <Card key={uploadedFile.id} className='relative group'>
                  <div className='p-2'>
                    <div className='relative aspect-square rounded-lg overflow-hidden bg-gray-100'>
                      {uploadedFile.type === 'image' ? (
                        <Image
                          src={uploadedFile.preview || '/placeholder.svg'}
                          alt='Uploaded image'
                          fill
                          className='object-cover'
                        />
                      ) : (
                        <div className='relative w-full h-full'>
                          <video
                            src={uploadedFile.preview}
                            className='w-full h-full object-cover'
                            muted
                          />
                          <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-30'>
                            <Play className='h-8 w-8 text-white' />
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => removeFile(uploadedFile.id)}
                        className='absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity'
                      >
                        <X className='h-4 w-4' />
                      </button>

                      <div className='absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded'>
                        {uploadedFile.type === 'image' ? (
                          <ImageIcon className='h-3 w-3 inline mr-1' />
                        ) : (
                          <Play className='h-3 w-3 inline mr-1' />
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
          </div>
        )}

        {isLoading && <p>Uploading...</p>}
        <Divider style={{ borderColor: '#d9d9d9' }} className='col-span-2' />
      </div>
    </div>
  );
}
