"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
// import logo from "@/assets/logo.svg";
import logo from "@/assets/logo2.svg";
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
  User,
  Home,
} from "lucide-react";
import { logOut } from "@/services/authService";
import SearchBar from "../Home/SearchBar";

export default function HomeNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false); // FIXED: Added missing state

  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleAuthAction = (targetPath?: string) => {
    const role = user?.role || Cookies.get("currentUserRole");

    if (role) {
      let path = "/dashboard";
      if (role === "ADMIN" || role === "SUPERADMIN") path = "/dashboard";
      else if (role === "CAPTAIN") path = "/dashboard/check-your-trip";
      else if (role === "USER") path = "/dashboard/edit-user-details";

      router.push(path);
    } else {
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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  const handleLogout = () => {
    dispatch(logout());
    logOut();
    Cookies.remove("token");
    Cookies.remove("currentUserRole");
    router.push("/");
    setMenuOpen(false);
    setProfileDropdown(false);
  };

  if (!mounted) return <div className=" bg-transparent"></div>;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[999] transition-all duration-500 bg-white  ${
          scrolled
            ? "h-[100px] md:h-[80px] bg-white/95 backdrop-blur-md border-b border-gray-100"
            : "h-[150px] z-50"
        }`}
      >
        <nav className="container mx-auto xl:px-4 lg:px-3 px-2 flex items-center justify-between">
          <div className="transition-all duration-700 ease-in-out origin-center transform hover:scale-105">
            <Link href="/">
              <Image
                src={logo}
                alt="Logo"
                width={scrolled ? 80 : 100}
                height={scrolled ? 80 : 100}
                className="object-contain transition-all duration-700 ease-in-out"
                priority={true}
              />
            </Link>
          </div>

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
                  onClick={() => handleAuthAction("/boat-list")}
                  className="font-bold lg:px-7 px-5 lg:py-2.5 py-2 rounded-full border-2 border-[#105d9e] bg-[#105d9e] text-white hover:bg-white hover:text-[#105d9e] transition-all duration-300 shadow-md active:scale-95"
                >
                  List your boat
                </button>
              </div>
            ) : (
              <div
                className="relative group"
                onMouseEnter={() => setProfileDropdown(true)}
                onMouseLeave={() => setProfileDropdown(false)}
              >
                <button className="flex items-center gap-2 border-2 border-[#105d9e] rounded-full p-0.5 hover:shadow-xl transition-all duration-300 bg-white">
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

        <div
          className={`container mx-auto px-4 transition-all duration-700 ease-in-out ${
            scrolled && !isSearchActive
              ? "xl:-mt-[65px] lg:-mt-16 md:-mt-[63px] -mt-[0px] scale-90 opacity-100 max-w-2xl"
              : "xl:-mb-16 lg:-mb-16 md:-mb-[60px] -mb-[55px] scale-100 opacity-100"
          }`}
        >
          <SearchBar
            scrolled={scrolled}
            onActiveChange={(isActive) => setIsSearchActive(isActive)}
          />
        </div>

        {/* MOBILE MENU OVERLAY */}
        {menuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 z-[998] lg:hidden animate-in fade-in duration-200"
              onClick={() => setMenuOpen(false)}
            />

            {/* Slide-in Menu */}
            <div className="fixed left-0 top-0 h-screen w-[300px] max-w-[80vw] bg-white z-[1000] lg:hidden shadow-2xl animate-in slide-in-from-left duration-300">
              <div className="flex flex-col h-full">
                {/* User Info (if logged in) */}
                {user && (
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      {user?.image ? (
                        <Image
                          src={user.image}
                          alt={user.name || "User"}
                          width={48}
                          height={48}
                          className="rounded-full object-cover w-12 h-12 border-2 border-white shadow-md"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-[#105d9e] to-[#0a3f6b] text-white flex items-center justify-center rounded-full text-lg font-semibold shadow-md">
                          {user?.name?.[0]?.toUpperCase() || <User size={20} />}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {user?.name}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Menu Items */}
                <div className="flex-1 py-4 overflow-y-auto">
                  <div className="px-4 space-y-1">
                    <Link
                      href="/"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <Home size={20} className="text-gray-500" />
                      <span>Home</span>
                    </Link>

                    {user ? (
                      <>
                        <button
                          onClick={() => handleAuthAction()}
                          className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors text-left"
                        >
                          <LayoutDashboard
                            size={20}
                            className="text-[#105d9e]"
                          />
                          <span>Dashboard</span>
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left"
                        >
                          <LogOut size={20} />
                          <span>Logout</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleAuthAction("/login")}
                          className="w-full flex items-center gap-3 px-4 py-3 text-[#105d9e] hover:bg-blue-50 rounded-xl transition-colors text-left font-medium"
                        >
                          <User size={20} />
                          <span>Sign In</span>
                        </button>
                        <Link
                          href="/boat-list"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-[#105d9e] hover:bg-blue-50 rounded-xl transition-colors font-medium"
                        >
                          <LayoutDashboard size={20} />
                          <span>List Your Boat</span>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </header>

      <div className="h-[105px] md:h-[115px] lg:h-[120px] xl:h-[135px]" />
    </>
  );
}
