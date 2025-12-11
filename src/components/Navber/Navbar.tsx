'use client';

import Image from 'next/image';
import Link from 'next/link';
import Button from '../ReUsible/Button';
import Cookies from 'js-cookie';
import logo from '@/assets/logo2.svg';
import board from '@/assets/boart.svg';
import { IoIosSearch } from 'react-icons/io';
import { MdMenu, MdClose } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '@/redux/slices/authSlice';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const path = usePathname();
  const pathName = path.split('/')[1];

  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const route = useRouter();

  // Prevent hydration mismatch by waiting for client-side mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setVisible(currentScrollY < lastScrollY || currentScrollY < 50);
      setScrolled(currentScrollY > 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    dispatch(logout());
    Cookies.remove('token');
    Cookies.remove('currentUserRole');
    route.push('/');
  };

  return (
    <div
      className={`sticky top-0 left-0 right-0 z-[999] transition-all duration-500 ease-in-out transform ${
        scrolled ? 'bg-white py-3 shadow-md text-black' : 'bg-transparent py-5'
      } ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      <div className='container mx-auto px-5 xl:px-0 relative'>
        <div className='flex items-center justify-between font-satoshi'>
          <Link href={'/'} className='w-20 h-20'>
            <Image
              className='w-full h-full'
              src={logo}
              alt='logo'
              height={500}
              width={500}
            />
          </Link>

          {/* Hamburger Icon for Mobile */}
          <div className='lg:hidden'>
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? (
                <MdClose className='text-3xl' />
              ) : (
                <MdMenu className='text-3xl' />
              )}
            </button>
          </div>

          {/* Desktop Content */}
          {pathName !== 'search-charter' && (
            <div className='hidden lg:flex items-center gap-5'>
              <div className='bg-white rounded-xl lg:rounded-full pl-5 lg:pl-[57px] py-3 pr-3 shadow-xl flex flex-row justify-between items-center'>
                <div className='grid grid-cols-3 gap-3 max-w-sm'>
                  <input
                    type='text'
                    placeholder='where'
                    className='text-[#474747] border px-2 rounded-md'
                  />
                  <input
                    type='text'
                    placeholder='when'
                    className='text-[#474747] border px-2 rounded-md'
                  />
                  <input
                    type='text'
                    placeholder='who'
                    className='text-[#474747] border px-2 rounded-md'
                  />
                </div>
                <div className='bg-[#0037ff] text-white rounded-full h-8 w-8 flex justify-center items-center ml-3'>
                  <IoIosSearch className='text-2xl' />
                </div>
              </div>
            </div>
          )}

          <div className='hidden lg:flex items-center gap-3'>
            {mounted && user ? (
              <div
                onClick={handleLogout}
                className='text-[15px] font-semibold text-[#242424] hover:text-[#FF9500] cursor-pointer'
              >
                Log out
              </div>
            ) : (
              <>
                <Link
                  href='/signup'
                  className='text-[15px] font-semibold text-[#242424] hover:text-[#FF9500]'
                >
                  Sign up
                </Link>
                <Link
                  href='/login'
                  className='text-[15px] font-semibold text-[#242424] hover:text-[#FF9500]'
                >
                  Login
                </Link>
              </>
            )}

            {mounted && user ? (
              <Button
                link={
                  user.role === 'USER'
                    ? '/dashboard/edit-user-details'
                    : user.role === 'CAPTAIN'
                    ? '/dashboard/boat-trip'
                    : '/dashboard'
                }
                variant='primary'
                className='flex items-center gap-3 font-bold w-44'
              >
                <Image className='h-6 w-6' src={board} alt='' />
                Dashboard
              </Button>
            ) : (
              <Button
                link='/boat-list'
                variant='primary'
                className='flex items-center gap-3 font-bold w-44'
              >
                <Image className='h-6 w-6' src={board} alt='' />
                List your boat
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className='lg:hidden absolute right-0 top-5 w-full  mt-4 flex flex-col gap-4 bg-white shadow-md p-4 rounded-xl text-[#242424]'>
            <div className=' pt-4 mt-4 flex flex-col gap-3 space-y-3 w-full'>
              {!mounted ? (
                <div className="animate-pulse h-4 w-16 bg-gray-200 rounded"></div>
              ) : user ? (
                <div
                  onClick={handleLogout}
                  className='hover:text-[#FF9500] cursor-pointer'
                >
                  Log out
                </div>
              ) : (
                <>
                  <Link href='/signup' className='hover:text-[#FF9500] w-full'>
                    Sign up
                  </Link>
                  <Link href='/login' className='hover:text-[#FF9500] w-full'>
                    Login
                  </Link>
                </>
              )}

              {!mounted ? (
                <div className="animate-pulse h-10 w-24 bg-gray-200 rounded"></div>
              ) : user ? (
                <Button
                  link={
                    user.role === 'USER'
                      ? '/dashboard/edit-user-details'
                      : user.role === 'CAPTAIN'
                      ? '/dashboard/boat-trip'
                      : '/dashboard'
                  }
                  variant='primary'
                  className=''
                >
                  Dashboard
                </Button>
              ) : (
                <Button link='/boat-list' variant='primary'>
                  List your boat
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
