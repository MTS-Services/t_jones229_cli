"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
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
  User,
  Home,
  Search,
} from "lucide-react";
import { logOut } from "@/services/authService";
import ListBookingSearchBar from "./ListBookingSearchBar";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);

  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();

  /* ------------------ SCROLL DETECTION ------------------ */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu on resize if screen becomes larger
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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

  const handleLogout = () => {
    dispatch(logout());
    logOut();
    Cookies.remove("token");
    Cookies.remove("currentUserRole");
    router.push("/");
    setMenuOpen(false);
    setProfileDropdown(false);
  };

  const toggleSearch = () => {
    setSearchExpanded(!searchExpanded);
  };

  if (!mounted) return <div className="h-[64px] bg-white" />;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled && !menuOpen
            ? "bg-white/95 backdrop-blur-md border-b border-gray-100"
            : "bg-white border-b border-gray-100"
        }`}
      >
        <nav className="container mx-auto px-4 h-18 flex items-center justify-between gap-2 sm:gap-4">
          {/* LOGO */}
          <Link
            href="/"
            className="flex-shrink-0 transition-transform hover:scale-105 active:scale-95"
          >
            <Image
              src={logo2}
              alt="Logo"
              className="object-cover w-auto h-16 md:h-20"
              priority
            />
          </Link>

          {/* SEARCH BAR - Desktop */}
          <div className="hidden lg:block flex-1 max-w-2xl mx-4">
            <ListBookingSearchBar scrolled={scrolled} />
          </div>

          {/* RIGHT SIDE - Desktop */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            {!user ? (
              <button
                onClick={() => handleAuthAction("/login")}
                className="font-semibold px-6 py-2.5 rounded-full border-2 border-[#105d9e] text-[#105d9e] hover:bg-[#105d9e] hover:text-white transition-all duration-300 active:scale-95 shadow-sm hover:shadow-md"
              >
                Sign In
              </button>
            ) : (
              <div
                className="relative"
                onMouseEnter={() => setProfileDropdown(true)}
                onMouseLeave={() => setProfileDropdown(false)}
              >
                <button className="flex items-center gap-2 border border-gray-200 rounded-full p-1.5 pr-3 hover:shadow-lg transition-all duration-300 hover:border-[#105d9e]/30 bg-white">
                  {user?.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "User"}
                      width={36}
                      height={36}
                      className="rounded-full object-cover w-9 h-9"
                    />
                  ) : (
                    <div className="w-9 h-9 bg-gradient-to-br from-[#105d9e] to-[#0a3f6b] text-white flex items-center justify-center rounded-full text-sm font-semibold shadow-inner">
                      {user?.name?.[0]?.toUpperCase() || <User size={16} />}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                    {user?.name?.split(" ")[0] || "User"}
                  </span>
                  <ChevronDown size={16} className="text-gray-500" />
                </button>

                {profileDropdown && (
                  <div className="absolute right-0 top-full pt-2 w-56 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="bg-white shadow-xl rounded-xl border border-gray-100 py-2 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {user?.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </p>
                      </div>
                      <button
                        onClick={() => handleAuthAction()}
                        className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-2 transition-colors"
                      >
                        <LayoutDashboard size={18} className="text-[#105d9e]" />
                        <span>Dashboard</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                      >
                        <LogOut size={18} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* SEARCH ICON - Mobile */}
            <button
              onClick={toggleSearch}
              className="lg:hidden p-2 bg-slate-50 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Toggle search"
            >
              <Search size={20} className="text-gray-600" />
            </button>
            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? (
                <X size={24} className="text-gray-600" />
              ) : (
                <Menu size={24} className="text-gray-600" />
              )}
            </button>
          </div>
        </nav>

        {/* MOBILE SEARCH BAR - Collapsible */}
        <div
          className={`lg:hidden overflow-hidden ${
            searchExpanded
              ? "py-3 px-3 bg-gray-500/10 border-t border-gray-100"
              : "max-h-0"
          }`}
        >
          <ListBookingSearchBar scrolled={scrolled} />
        </div>
      </header>

      {/* MOBILE MENU OVERLAY */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 z-[998] lg:hidden animate-in fade-in duration-200"
            onClick={() => setMenuOpen(false)}
          />

          {/* Slide-in Menu */}
          <div className="fixed left-0 top-0 h-full w-[300px] max-w-[80vw] bg-white z-[1000] lg:hidden shadow-2xl animate-in slide-in-from-left duration-300">
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
                        <LayoutDashboard size={20} className="text-[#105d9e]" />
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
                    <button
                      onClick={() => handleAuthAction("/login")}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[#105d9e] hover:bg-blue-50 rounded-xl transition-colors text-left font-medium"
                    >
                      <User size={20} />
                      <span>Sign In</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
