import { useEffect, useState } from 'react';
import { ConfigProvider, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import Recommended from './Recommended';
import PriceHighest from './PriceHighest';
import PriceLowest from './PriceLowest';
import InteractiveMap from '../List-boat-form/GoogleMap';
import { useGetAllBoatQuery } from '@/redux/api/boatApi';
import { Pagination } from '../dashboard/admin/button/Pagination';

const SearchTab = () => {
  const [key, setKey] = useState<string>('1');
  const [currentPage, setCurrentPage] = useState(1);
  const [queryParams, setQueryParams] = useState({});

  const buildQueryParams = (page: number): Record<string, string> => {
    // Safe localStorage access for SSR
    const city = typeof window !== 'undefined' ? localStorage.getItem('location') : null;
    const startDate = typeof window !== 'undefined' ? localStorage.getItem('StartDate') : null;
    const endDate = typeof window !== 'undefined' ? localStorage.getItem('date') : null;
    const bookingType = typeof window !== 'undefined' ? localStorage.getItem('bookingType') : null;
    const guests = typeof window !== 'undefined' ? localStorage.getItem('Guests') : null;

    const params: Record<string, string> = {};

    if (city) params.city = city;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    // if (bookingType) params.sharedBooking = bookingType;
    if (bookingType && bookingType !== 'undefined' && bookingType !== 'null') {
      params.sharedBooking = bookingType;
    }
    // if (bookingType) params.sharedBooking = bookingType;
    // if (guests) params.guests = guests;
    const guestsNum = guests ? Number(guests) : 0;
    if (guestsNum > 0) params.guests = guestsNum.toString();

    // h_t_l=true
    // l_t_h=true
    // params.h_t_l = "true";
    if (key === '2') params.h_t_l = 'true';
    if (key === '3') params.l_t_h = 'true';

    params.page = page.toString();
    params.limit = '10';

    return params;
  };

  useEffect(() => {
    setQueryParams(buildQueryParams(currentPage));
  }, [currentPage, key]);

  const { data, isLoading, refetch } = useGetAllBoatQuery(queryParams);

  const currentItems = data?.data?.data || [];

  const totalPages = data?.data?.meta?.totalPage || 1;

  const onChange = (key: string) => {
    setKey(key);
    setCurrentPage(1);
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'All',
      children: (
        <Recommended currentItems={currentItems} isLoading={isLoading} />
      ),
    },
    {
      key: '2',
      label: 'Price (Highest)',
      children: (
        <PriceHighest currentItems={currentItems} isLoading={isLoading} />
      ),
    },
    {
      key: '3',
      label: 'Price (Lowest)',
      children: (
        <PriceLowest currentItems={currentItems} isLoading={isLoading} />
      ),
    },
  ];

  return (
    <div className='min-h-screen bg-gray-50 py-6'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-col xl:flex-row gap-6'>
          {/* Left side - Boat listings */}
          <div className='w-full xl:w-[60%] 2xl:w-[65%]'>
            <ConfigProvider
              theme={{
                components: {
                  Tabs: {
                    itemHoverColor: '#242424',
                    colorPrimary: '#3D53F5',
                    colorText: '#242424',
                    itemColor: '#878787',
                    itemSelectedColor: '#242424',
                    fontSize: 16,
                  },
                },
              }}
            >
              <Tabs defaultActiveKey='1' items={items} onChange={onChange} />
            </ConfigProvider>
          </div>

          {/* Right side - Map */}
          <div className='hidden xl:block xl:w-[40%] 2xl:w-[35%]'>
            <div className='sticky top-4'>
              <div className='bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200'>
                <div className='bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3'>
                  <h2 className='text-white font-semibold text-lg flex items-center gap-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Explore Area
                  </h2>
                  <p className='text-blue-100 text-sm mt-1'>Click on map to select location</p>
                </div>
                <div className='p-0'>
                  <InteractiveMap />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {totalPages > 1 && (
        <div className='container mx-auto'>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default SearchTab;
