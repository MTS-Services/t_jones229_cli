"use client";

import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import logo from "@/assets/logo.svg";
import logo2 from "@/assets/logo2.svg";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store/store";
import { logout } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  UserPlus,
  LogIn,
} from "lucide-react";
import { logOut } from "@/services/authService";
import SearchBar from "../Home/SearchBar";

export default function HomeNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();

  // Unified Auth Action: Handles Dashboard redirection or Login/Signup navigation
  const handleAuthAction = (targetPath?: string) => {
    const role = user?.role || Cookies.get("currentUserRole");

    if (role) {
      // Logic for logged in users
      let path = "/dashboard";
      if (role === "ADMIN" || role === "SUPERADMIN") path = "/dashboard";
      else if (role === "CAPTAIN") path = "/dashboard/boat-trip";
      else if (role === "USER") path = "/dashboard/edit-user-details";

      router.push(path);
    } else {
      // Logic for guests: navigate to Login or Register
      router.push(targetPath || "/login");
    }
    setProfileDropdown(false);
    setMenuOpen(false);
  };

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    logOut();
    Cookies.remove("token");
    Cookies.remove("currentUserRole");
    router.push("/");
    setMenuOpen(false);
    setProfileDropdown(false);
  };

  if (!mounted)
    return <div className="h-[120px] lg:h-[180px] bg-transparent"></div>;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[999] transition-all duration-500 ${
          scrolled || menuOpen
            ? "bg-white/95 backdrop-blur-md shadow-md py-2"
            : "bg-transparent py-4"
        }`}
      >
        <nav className="container mx-auto xl:px-4 lg:px-3 px-2 py-2 flex items-center justify-between">
          {/* Logo Section */}
          <Link
            href="/"
            className="w-12 h-12 md:w-16 md:h-16 xl:w-20 xl:h-20 transition-transform hover:scale-105 active:scale-95"
          >
            <Image
              className="w-full h-full object-contain"
              src={scrolled || menuOpen ? logo2 : logo}
              alt="Logo"
              height={80}
              width={80}
            />
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex gap-4 items-center">
            {!user ? (
              <div className="flex items-center xl:gap-3 lg:gap-1 gap-0.5">
                <button
                  onClick={() => handleAuthAction("/login")}
                  className="font-bold lg:px-7 px-5 lg:py-2.5 py-2 rounded-full border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300 active:scale-95"
                >
                  Login
                </button>
                <button
                  onClick={() => handleAuthAction("/signup")}
                  className="font-bold lg:px-7 px-5 lg:py-2.5 py-2 rounded-full border-2 border-[#105d9e] bg-[#105d9e] text-white hover:bg-white hover:text-[#105d9e] transition-all duration-300 shadow-md active:scale-95"
                >
                  Sign up
                </button>
              </div>
            ) : (
              /* Desktop Profile Hover */
              <div
                className="relative group"
                onMouseEnter={() => setProfileDropdown(true)}
                onMouseLeave={() => setProfileDropdown(false)}
              >
                <button
                  // onClick={() => handleAuthAction()}
                  className="flex items-center gap-2 border-2 border-[#105d9e] rounded-full p-0.5 hover:shadow-xl transition-all duration-300 bg-white"
                >
                  {user?.image ? (
                    <Image
                      src={user.image}
                      alt="User"
                      width={40}
                      height={40}
                      className="rounded-full object-cover w-10 h-10 ring-2 ring-orange-50"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-[#105d9e] text-white flex items-center justify-center rounded-full font-bold shadow-inner">
                      {user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <ChevronDown
                    size={16}
                    className={`mr-1 transition-transform duration-300 ${
                      profileDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                <div
                  className={`absolute right-0 pt-3 w-64 z-[1000] transition-all duration-300 ease-out origin-top-right ${
                    profileDropdown
                      ? "opacity-100 scale-100 translate-y-0 visible"
                      : "opacity-0 scale-95 -translate-y-4 invisible"
                  }`}
                >
                  <div className="bg-white shadow-2xl rounded-2xl border border-gray-100 py-3 flex flex-col overflow-hidden">
                    <div className="px-5 py-2 border-b border-gray-50 bg-orange-50/30">
                      <p className="text-[10px] text-[#105d9e] uppercase font-extrabold tracking-wider">
                        {user?.role}
                      </p>
                      <p className="text-sm font-bold text-gray-800 truncate">
                        {user?.name}
                      </p>
                    </div>

                    <button
                      onClick={() => handleAuthAction()}
                      className="px-5 py-2 hover:bg-orange-50 flex items-center gap-3 text-gray-700 w-full text-left transition-all"
                    >
                      <div className="bg-orange-100 p-1.5 rounded-lg text-[#105d9e]">
                        <LayoutDashboard size={16} />
                      </div>
                      <span className="font-semibold text-sm">Dashboard</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="px-5 py-2 hover:bg-red-50 text-red-600 flex items-center gap-3 w-full text-left transition-all"
                    >
                      <div className="bg-red-100 p-1.5 rounded-lg">
                        <LogOut size={16} />
                      </div>
                      <span className="font-semibold text-sm">Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Toggle Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden z-[1001] p-2 hover:bg-black/5 rounded-full transition-colors"
          >
            {menuOpen ? (
              <X size={28} className="text-black" />
            ) : (
              <Menu size={28} className={"text-black"} />
            )}
          </button>
        </nav>

        {/* Search Bar Section in HomeNavbar */}
        <div
          className={`container mx-auto px-4 transition-all duration-500 ease-in-out ${
            scrolled
              ? "-mt-20 scale-90 opacity-100"
              : "mt-20 lg:mt-0 scale-100 opacity-100"
          }`}
        >
          <SearchBar scrolled={scrolled} />
        </div>

        {/* MOBILE MENU */}
        <div
          className={`fixed inset-0 w-full bg-white transition-all duration-500 lg:hidden z-[998] ${
            menuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-full opacity-0"
          }`}
        >
          <div className="flex flex-col gap-6 p-8 pt-28 text-black h-full">
            {user ? (
              <>
                <div className="flex items-center gap-4 mb-4 bg-orange-50 p-5 rounded-2xl border border-orange-100">
                  <div className="w-14 h-14 bg-[#105d9e] text-white flex items-center justify-center rounded-full text-2xl font-bold">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="font-extrabold text-lg">{user?.name}</p>
                    <p className="text-xs text-[#105d9e] font-bold uppercase">
                      {user?.role}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleAuthAction()}
                  className="text-lg font-bold flex items-center gap-5 p-4 rounded-2xl bg-gray-50 hover:bg-orange-50 transition-all"
                >
                  <LayoutDashboard size={24} className="text-[#105d9e]" />
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="text-lg font-bold text-red-600 flex items-center gap-5 p-4 rounded-2xl bg-red-50"
                >
                  <LogOut size={24} /> Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-4 mt-10">
                <button
                  onClick={() => handleAuthAction("/login")}
                  className="flex items-center justify-center gap-3 bg-white border-2 border-black text-black py-4 rounded-2xl font-bold text-xl active:scale-95 transition-transform"
                >
                  <LogIn size={20} /> Login
                </button>
                <button
                  onClick={() => handleAuthAction("/signup")}
                  className="flex items-center justify-center gap-3 bg-[#105d9e] text-white py-4 rounded-2xl font-bold text-xl shadow-lg active:scale-95 transition-transform"
                >
                  <UserPlus size={20} /> Create Account
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Dynamic Spacer to prevent content overlap */}
      <div className="h-[140px] md:h-[220px] lg:h-[150px]"></div>
    </>
  );
}
