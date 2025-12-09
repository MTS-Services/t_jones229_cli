'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '../ReUsible/Button';
import Cookies from 'js-cookie';
import logo from '@/assets/logo.svg';
import logo2 from '@/assets/logo2.svg';
import board from '@/assets/boart.svg';
import dashboard from '@/assets/icon/dashboard.png';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { logout } from '@/redux/slices/authSlice';
import { useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react'; // Install lucide-react or use any icon lib
import { logOut } from '@/services/authService';

export default function HomeNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false); // Mobile menu state

  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const route = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setScrolled(currentScrollY > 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    dispatch(logout());
    logOut();
    Cookies.remove('token');
    Cookies.remove('currentUserRole');
    route.push('/');
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[999] transition-all duration-500 ease-in-out transform  ${
        scrolled || menuOpen
          ? 'bg-white py-3 shadow-md text-black'
          : 'bg-transparent py-5'
      } ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      <div className='container flex items-center justify-between font-satoshi px-4 '>
        {/* Logo */}
        <Link href='/' className='w-20 h-20'>
          <Image
            className='w-full h-full'
            src={scrolled || menuOpen ? logo2 : logo}
            alt='Logo'
            height={500}
            width={500}
          />
        </Link>

        {/* Hamburger Icon for Mobile */}
        <button
          onClick={toggleMenu}
          className='lg:hidden text-black z-50'
          aria-label='Toggle Menu'
        >
          {menuOpen ? (
            <X size={28} className='text-black' />
          ) : (
            <Menu size={28} className='text-white' />
          )}
        </button>

        {/* Menu - Desktop */}
        <div className='hidden lg:flex gap-4 items-center'>
          {user ? (
            <div
              onClick={handleLogout}
              className={`cursor-pointer text-base font-normal hover:text-[#FF9500] transition-colors duration-300 ${
                scrolled ? 'text-black' : 'text-white'
              }`}
            >
              Log out
            </div>
          ) : (
            <>
              <Link
                href='/signup'
                className={`text-base font-normal hover:text-[#FF9500] transition-colors duration-300 ${
                  scrolled ? 'text-black' : 'text-white'
                }`}
              >
                Sign up
              </Link>
              <Link
                href='/login'
                className={`text-base font-normal hover:text-[#FF9500] transition-colors duration-300 ${
                  scrolled ? 'text-black' : 'text-white'
                }`}
              >
                Login
              </Link>
            </>
          )}

          {user && (
            <Button
              // link="/dashboard/edit-user-details"
              link={
                user.role === 'USER'
                  ? '/dashboard/edit-user-details'
                  : user.role === 'CAPTAIN'
                  ? '/dashboard/boat-trip'
                  : '/dashboard'
              }
              variant='primary'
              className='flex items-center gap-3 font-satoshi text-base font-bold w-44'
            >
              <Image src={dashboard} alt='dashboard icon' className='h-6 w-6' />
              Dashboard
            </Button>
          )}

          {!user && (
            <Button
              link='/boat-list'
              variant='primary'
              className='flex items-center gap-3 font-satoshi text-base font-bold w-44'
            >
              <Image src={board} alt='board icon' className='h-6 w-6' />
              List your boat
            </Button>
          )}
        </div>

        {/* Mobile Menu - Slide Down */}
        {menuOpen && (
          <div className='absolute top-full left-0 w-full bg-white shadow-lg p-4 flex flex-col gap-4 lg:hidden text-black'>
            {user ? (
              <div
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className='cursor-pointer text-base font-normal hover:text-[#FF9500] transition-colors'
              >
                Log out
              </div>
            ) : (
              <>
                <Link
                  href='/signup'
                  onClick={() => setMenuOpen(false)}
                  className='text-base font-normal hover:text-[#FF9500] transition-colors'
                >
                  Sign up
                </Link>
                <Link
                  href='/login'
                  onClick={() => setMenuOpen(false)}
                  className='text-base font-normal hover:text-[#FF9500] transition-colors'
                >
                  Login
                </Link>
              </>
            )}

            {user && (
              <Button
                link={
                  user.role === 'USER'
                    ? '/dashboard/edit-user-details'
                    : user.role === 'CAPTAIN'
                    ? '/dashboard/boat-trip'
                    : '/dashboard'
                }
                variant='primary'
                className='flex items-center gap-3 w-full'
                onClick={() => setMenuOpen(false)}
              >
                <Image
                  src={dashboard}
                  alt='dashboard icon'
                  className='h-6 w-6'
                />
                Dashboard
              </Button>
            )}

            {!user && (
              <Button
                link='/boat-list'
                variant='primary'
                className='flex items-center gap-3 w-full'
                onClick={() => setMenuOpen(false)}
              >
                <Image src={board} alt='board icon' className='h-6 w-6' />
                List your boat
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
