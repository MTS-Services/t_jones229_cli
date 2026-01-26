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
import { Menu, X, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { logOut } from "@/services/authService";
import ListBookingSearchBar from "./ListBookingSearchBar";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  if (!mounted) return <div className="h-[80px] bg-white" />;

  return (
    <header className="fixed top-0 left-0 right-0 z-[999] bg-white border-b border-gray-100 shadow-sm">
      <nav className="container mx-auto px-4 h-20  flex items-center justify-between gap-4">
        {/* LOGO */}
         <Link href="/" className="w-12 h-12 md:w-16 md:h-16 xl:w-24 xl:h-24">
            <Image
              src={logo2}
              alt="Logo"
             
              className="object-cover w-full h-full"
            />
          </Link>

        {/* SEARCH BAR */}
        <div className="block flex-1 max-w-2xl">
          <ListBookingSearchBar scrolled={scrolled} />
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
          {!user ? (
            <button
              onClick={() => handleAuthAction("/login")}
              className="font-bold lg:px-7 px-5 lg:py-2.5 py-2 rounded-full border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300 active:scale-95"
            >
              Login
            </button>
          ) : (
            <div
              className="relative"
              onMouseEnter={() => setProfileDropdown(true)}
              onMouseLeave={() => setProfileDropdown(false)}
            >
              <button className="flex items-center gap-2 border border-gray-200 rounded-full p-1 hover:shadow-md transition-all">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt="User"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-[#105d9e] text-white flex items-center justify-center rounded-full text-xs font-bold">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                )}
                <ChevronDown size={14} />
              </button>

              {profileDropdown && (
                <div className="absolute right-0 top-full pt-2 w-48">
                  <div className="bg-white shadow-xl rounded-xl border border-gray-100 py-2 overflow-hidden">
                    <button
                      onClick={() => handleAuthAction()}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      <LayoutDashboard size={16} /> Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MOBILE MENU */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden p-2"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>
    </header>
  );
}
