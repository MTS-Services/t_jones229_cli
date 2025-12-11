import Image from 'next/image';
import React from 'react';
import { IoLocationOutline } from 'react-icons/io5';
import doller from '@/assets/boat2.svg';
import men from '@/assets/icon/men.svg';
import placeholderImage from '@/assets/placeholder.webp';
import Link from 'next/link';
import { CardProps } from '@/types/pricingCard';

const TopChartersCard: React.FC<CardProps> = ({ boatInfo }) => {
  return (
    <div className='flex flex-col md:flex-row items-start bg-white rounded-[16px] shadow-lg p-5 gap-5 border-[1px] border-[#dedede] mt-5 custom-shadow hover:shadow-xl transition-shadow duration-300'>
      <Image
        src={boatInfo?.photos?.[0]?.url || placeholderImage}
        alt={boatInfo?.descriptions?.[0]?.listingTypeTitle ?? 'Boat Image'}
        height={100}
        width={100}
        className='w-full md:w-48 lg:w-56 h-48 md:h-40 lg:h-44 object-cover rounded-lg flex-shrink-0'
      />

      <div className='flex-1 min-w-0'>
        <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3'>
          <h3 className='text-lg md:text-xl text-[#242424] font-bold leading-tight line-clamp-2 flex-1'>
            {boatInfo?.descriptions?.[0]?.listingTypeTitle}
          </h3>

          <div className='flex flex-row items-center gap-3 flex-shrink-0'>
            <p className='text-[#9E9E9E] text-sm font-normal flex items-center gap-1'>
              <IoLocationOutline className='text-[#FF9500] h-5 w-5 flex-shrink-0' />
              <span className='line-clamp-1 max-w-[100px]'>
                {boatInfo?.meetingPoint?.[0]?.city}
              </span>
            </p>

            <Link href={`/search-charter/${boatInfo?.id}`}>
              <button className='bg-orange-400 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-500 transition-colors duration-300 whitespace-nowrap'>
                More info
              </button>
            </Link>
          </div>
        </div>

        <p className='text-base text-[#878787] my-4 line-clamp-2'>
          {boatInfo?.descriptions?.[0]?.listingTypeDescription}
        </p>
        <p className='font-bold text-sm text-[#171717] '>Key features:</p>

        <div className='flex flex-wrap  md:flex-row w-full items-center gap-2 md:gap-4 mt-4'>
          <div className='flex items-center gap-1 bg-[#EDF1FF] px-2 py-1 rounded-full border-2 border-[#b2c3ff] text-[#242424] text-sm md:text-base '>
            <Image
              src={doller}
              alt={'doller'}
              height={100}
              width={100}
              className='w-4 md:w-5 h-4 md:h-5 object-cover rounded-lg'
            />
            {boatInfo?.boatLength} meeter
          </div>

          <div className='flex items-center gap-1 bg-[#EDF1FF] px-2 py-1 rounded-full border-2 border-[#b2c3ff] text-[#242424] text-sm md:text-base '>
            <Image
              src={men}
              alt={'men'}
              height={100}
              width={100}
              className='w-4 md:w-5 h-4 md:h-5 object-cover rounded-lg'
            />
            Up to {boatInfo?.guests} people
          </div>
        </div>
        <div className='mt-4'>
          <h1 className='text-base text-[#171717] font-bold leading-6'>
            Fishing species:{' '}
            {boatInfo?.fishing?.[0]?.species?.map(
              (specie: string, index: number) => (
                <span key={index} className='text-[#878787] font-normal'>
                  {' '}
                  {specie},
                </span>
              )
            )}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default TopChartersCard;
