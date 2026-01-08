// "use client";

// import Image from "next/image";
// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import Button from "../ReUsible/Button";
// import Cookies from "js-cookie";
// import logo from "@/assets/logo.svg";
// import logo2 from "@/assets/logo2.svg";
// import board from "@/assets/boart.svg";
// import dashboard from "@/assets/icon/dashboard.png";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/redux/store/store";
// import { logout } from "@/redux/slices/authSlice";
// import { useRouter } from "next/navigation";
// import { Menu, X } from "lucide-react"; // Install lucide-react or use any icon lib
// import { logOut } from "@/services/authService";

// export default function HomeNavbar() {
//   const [scrolled, setScrolled] = useState(false);
//   const [visible, setVisible] = useState(true);
//   const [lastScrollY, setLastScrollY] = useState(0);
//   const [menuOpen, setMenuOpen] = useState(false); // Mobile menu state
//   const [mounted, setMounted] = useState(false); // Prevent hydration mismatch

//   const user = useSelector((state: RootState) => state.auth.user);
//   const dispatch = useDispatch();
//   const route = useRouter();

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   useEffect(() => {
//     const handleScroll = () => {
//       const currentScrollY = window.scrollY;
//       if (currentScrollY > lastScrollY && currentScrollY > 50) {
//         setVisible(false);
//       } else {
//         setVisible(true);
//       }
//       setScrolled(currentScrollY > 50);
//       setLastScrollY(currentScrollY);
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [lastScrollY]);

//   const handleLogout = () => {
//     dispatch(logout());
//     logOut();
//     Cookies.remove("token");
//     Cookies.remove("currentUserRole");
//     route.push("/");
//   };

//   const toggleMenu = () => setMenuOpen((prev) => !prev);

//   return (
//     <div
//       className={`fixed top-0 left-0 right-0 z-[999] transition-all duration-500 ease-in-out transform  ${
//         scrolled || menuOpen
//           ? "bg-white py-3 shadow-md text-black"
//           : "bg-transparent py-5"
//       } ${
//         visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
//       }`}
//     >
//       <div className="container flex items-center justify-between font-satoshi px-4 ">
//         {/* Logo */}
//         <Link href="/" className="w-20 h-20">
//           <Image
//             className="w-full h-full"
//             src={scrolled || menuOpen ? logo2 : logo}
//             alt="Logo"
//             height={500}
//             width={500}
//           />
//         </Link>

//         {/* Hamburger Icon for Mobile */}
//         <button
//           onClick={toggleMenu}
//           className="lg:hidden text-black z-50"
//           aria-label="Toggle Menu"
//         >
//           {menuOpen ? (
//             <X size={28} className="text-black" />
//           ) : (
//             <Menu size={28} className="text-white" />
//           )}
//         </button>

//         {/* Menu - Desktop */}
//         <div className="hidden lg:flex gap-4 items-center">
//           {mounted && user ? (
//             <div
//               onClick={handleLogout}
//               className={`cursor-pointer text-base font-normal hover:text-[#105d9e] transition-colors duration-300 ${
//                 scrolled ? "text-black" : "text-white"
//               }`}
//             >
//               Log out
//             </div>
//           ) : mounted ? (
//             <>
//               <Link
//                 href="/signup"
//                 className={`text-base font-normal hover:text-[#105d9e] transition-colors duration-300 ${
//                   scrolled ? "text-black" : "text-white"
//                 }`}
//               >
//                 Sign up
//               </Link>
//               <Link
//                 href="/login"
//                 className={`text-base font-normal hover:text-[#105d9e] transition-colors duration-300 ${
//                   scrolled ? "text-black" : "text-white"
//                 }`}
//               >
//                 Login
//               </Link>
//             </>
//           ) : null}

//           {mounted && user && (
//             <Button
//               // link="/dashboard/edit-user-details"
//               link={
//                 user.role === "USER"
//                   ? "/dashboard/edit-user-details"
//                   : user.role === "CAPTAIN"
//                   ? "/dashboard/boat-trip"
//                   : "/dashboard"
//               }
//               variant="primary"
//               className="flex items-center gap-3 font-satoshi text-base font-bold w-44"
//             >
//               <Image src={dashboard} alt="dashboard icon" className="h-6 w-6" />
//               Dashboard
//             </Button>
//           )}

//           {mounted && !user && (
//             <Button
//               link="/boat-list"
//               variant="primary"
//               className="flex items-center gap-3 font-satoshi text-base font-bold w-44"
//             >
//               <Image src={board} alt="board icon" className="h-6 w-6" />
//               List your boat
//             </Button>
//           )}
//         </div>

//         {/* Mobile Menu - Slide Down */}
//         {menuOpen && mounted && (
//           <div className="absolute top-full left-0 w-full bg-white shadow-lg p-4 flex flex-col gap-4 lg:hidden text-black">
//             {user ? (
//               <div
//                 onClick={() => {
//                   handleLogout();
//                   setMenuOpen(false);
//                 }}
//                 className="cursor-pointer text-base font-normal hover:text-[#105d9e] transition-colors"
//               >
//                 Log out
//               </div>
//             ) : (
//               <>
//                 <Link
//                   href="/signup"
//                   onClick={() => setMenuOpen(false)}
//                   className="text-base font-normal hover:text-[#105d9e] transition-colors"
//                 >
//                   Sign up
//                 </Link>
//                 <Link
//                   href="/login"
//                   onClick={() => setMenuOpen(false)}
//                   className="text-base font-normal hover:text-[#105d9e] transition-colors"
//                 >
//                   Login
//                 </Link>
//               </>
//             )}

//             {user && (
//               <Button
//                 link={
//                   user.role === "USER"
//                     ? "/dashboard/edit-user-details"
//                     : user.role === "CAPTAIN"
//                     ? "/dashboard/boat-trip"
//                     : "/dashboard"
//                 }
//                 variant="primary"
//                 className="flex items-center gap-3 w-full"
//                 onClick={() => setMenuOpen(false)}
//               >
//                 <Image
//                   src={dashboard}
//                   alt="dashboard icon"
//                   className="h-6 w-6"
//                 />
//                 Dashboard
//               </Button>
//             )}

//             {!user && (
//               <Button
//                 link="/boat-list"
//                 variant="primary"
//                 className="flex items-center gap-3 w-full"
//                 onClick={() => setMenuOpen(false)}
//               >
//                 <Image src={board} alt="board icon" className="h-6 w-6" />
//                 List your boat
//               </Button>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// -----------------------------------------------------------------------------------------------

// "use client";

// import Image from "next/image";
// import React, { useEffect, useState, useRef } from "react";
// import Link from "next/link";
// import Cookies from "js-cookie";
// import logo from "@/assets/logo.svg";
// import logo2 from "@/assets/logo2.svg";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/redux/store/store";
// import { logout } from "@/redux/slices/authSlice";
// import { useRouter } from "next/navigation";
// import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
// import { logOut } from "@/services/authService";
// import SearchBar from "../Home/SearchBar";

// export default function HomeNavbar() {
//   const [scrolled, setScrolled] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [mounted, setMounted] = useState(false);
//   const [profileDropdown, setProfileDropdown] = useState(false);

//   const user = useSelector((state: RootState) => state.auth.user);
//   const dispatch = useDispatch();
//   const route = useRouter();
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     setMounted(true);
//     // Click outside to close dropdown
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setProfileDropdown(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 50);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const handleLogout = () => {
//     dispatch(logout());
//     logOut();
//     Cookies.remove("token");
//     Cookies.remove("currentUserRole");
//     route.push("/");
//     setMenuOpen(false);
//     setProfileDropdown(false);
//   };

//   const getInitial = () => {
//     if (user?.name) return user.name.charAt(0).toUpperCase();
//     if (user?.email) return user.email.charAt(0).toUpperCase();
//     return "U";
//   };

//   if (!mounted) {
//     return <div className="h-[120px] lg:h-[180px] bg-transparent"></div>;
//   }

//   return (
//     <>
//       <header
//         className={`fixed top-0 left-0 right-0 z-[999] transition-all duration-300 ease-in-out ${
//           scrolled || menuOpen
//             ? "bg-white shadow-md py-2"
//             : "bg-transparent py-4"
//         }`}
//       >
//         <nav className="container mx-auto px-4 flex items-center justify-between font-satoshi">
//           {/* LOGO */}
//           <Link
//             href="/"
//             className="w-14 h-14 lg:w-20 lg:h-20 flex items-center"
//           >
//             <Image
//               className="w-full h-full object-contain"
//               src={scrolled || menuOpen ? logo2 : logo}
//               alt="Logo"
//               height={80}
//               width={80}
//             />
//           </Link>

//           {/* DESKTOP MENU */}
//           <div className="hidden lg:flex gap-8 items-center">
//             {!user ? (
//               <Link
//                 href="/login"
//                 className={`font-bold transition-colors px-6 py-2 rounded-full border text-black hover:bg-[#105d9e] hover:border-[#105d9e] hover:text-white`}
//               >
//                 Login
//               </Link>
//             ) : (
//               <div className="relative" ref={dropdownRef}>
//                 {/* PROFILE AVATAR */}
//                 <button
//                   onClick={() => setProfileDropdown(!profileDropdown)}
//                   className="flex items-center gap-2 border-2 border-[#105d9e] rounded-full p-0.5 hover:shadow-lg transition-all"
//                 >
//                   {user?.image ? (
//                     <Image
//                       src={user.image}
//                       alt="User"
//                       width={45}
//                       height={45}
//                       className="rounded-full object-cover"
//                     />
//                   ) : (
//                     <div className="w-11 h-11 bg-[#105d9e] text-white flex items-center justify-center rounded-full font-bold text-lg">
//                       {getInitial()}
//                     </div>
//                   )}
//                 </button>

//                 {/* PROFILE DROPDOWN - Z-INDEX SET TO 1000 */}
//                 {profileDropdown && (
//                   <div className="absolute right-0 mt-3 w-56 bg-white shadow-[0px_10px_30px_rgba(0,0,0,0.15)] rounded-2xl border border-gray-100 py-3 flex flex-col z-[1000] animate-in fade-in zoom-in duration-200">
//                     <div className="px-4 py-2 border-b mb-2">
//                       <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">
//                         Account
//                       </p>
//                       <p className="text-sm font-semibold text-gray-800 truncate">
//                         {user?.email}
//                       </p>
//                     </div>
//                     <Link
//                       href="/dashboard"
//                       className="px-4 py-2.5 hover:bg-orange-50 flex items-center gap-3 text-gray-700 transition-colors"
//                       onClick={() => setProfileDropdown(false)}
//                     >
//                       <LayoutDashboard size={18} className="text-[#105d9e]" />
//                       <span className="font-medium">Dashboard</span>
//                     </Link>
//                     <button
//                       onClick={handleLogout}
//                       className="px-4 py-2.5 hover:bg-red-50 text-red-600 flex items-center gap-3 text-left transition-colors"
//                     >
//                       <LogOut size={18} />
//                       <span className="font-medium">Logout</span>
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* MOBILE TOGGLE ICON */}
//           <button
//             onClick={() => setMenuOpen(!menuOpen)}
//             className="lg:hidden z-[1001] p-2"
//           >
//             {menuOpen ? (
//               <X size={28} className="text-black" />
//             ) : (
//               <Menu
//                 size={28}
//                 className={scrolled ? "text-black" : "text-white"}
//               />
//             )}
//           </button>
//         </nav>

//         {/* SEARCH BAR */}
//         <div
//           className={`container mx-auto px-4 mt-2 transition-all duration-300 ${
//             scrolled ? "scale-95" : "scale-100"
//           }`}
//         >
//           <SearchBar />
//         </div>

//         {/* MOBILE DROPDOWN - Z-INDEX HIGHER THAN HEADER */}
//         <div
//           className={`absolute top-full left-0 w-full bg-white shadow-2xl transition-all duration-500 ease-in-out overflow-hidden lg:hidden z-[998] ${
//             menuOpen
//               ? "max-h-[600px] border-t p-6 opacity-100"
//               : "max-h-0 opacity-0"
//           }`}
//         >
//           <div className="flex flex-col gap-5 text-black">
//             {user ? (
//               <>
//                 <div className="flex items-center gap-4 mb-2 bg-gray-50 p-4 rounded-xl">
//                   {user?.image ? (
//                     <Image
//                       src={user.image}
//                       alt="User"
//                       width={55}
//                       height={55}
//                       className="rounded-full shadow-sm"
//                     />
//                   ) : (
//                     <div className="w-14 h-14 bg-[#105d9e] text-white flex items-center justify-center rounded-full text-2xl font-bold">
//                       {getInitial()}
//                     </div>
//                   )}
//                   <div className="overflow-hidden">
//                     <p className="font-bold text-lg truncate">
//                       {user?.name || "User"}
//                     </p>
//                     <p className="text-sm text-gray-500 truncate">
//                       {user?.email}
//                     </p>
//                   </div>
//                 </div>
//                 <Link
//                   href="/dashboard"
//                   className="text-lg font-semibold flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
//                   onClick={() => setMenuOpen(false)}
//                 >
//                   <LayoutDashboard size={22} className="text-[#105d9e]" />{" "}
//                   Dashboard
//                 </Link>
//                 <button
//                   onClick={handleLogout}
//                   className="text-left text-lg font-semibold text-red-600 flex items-center gap-3 p-2 rounded-lg hover:bg-red-50 transition-colors"
//                 >
//                   <LogOut size={22} /> Logout
//                 </button>
//               </>
//             ) : (
//               <Link
//                 href="/login"
//                 className="bg-[#105d9e] text-center text-white py-4 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-all"
//                 onClick={() => setMenuOpen(false)}
//               >
//                 Login
//               </Link>
//             )}
//           </div>
//         </div>
//       </header>

//       {/* Dynamic Spacer */}
//       <div className="h-[140px] md:h-[180px] lg:h-[220px]"></div>
//     </>
//   );
// }

// -------------------------------------------------------------------------

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
import { Menu, X, LogOut, LayoutDashboard, ChevronDown, UserPlus, LogIn } from "lucide-react";
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
        <nav className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo Section */}
          <Link
            href="/"
            className="w-14 h-14 lg:w-20 lg:h-20 transition-transform hover:scale-105 active:scale-95"
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
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleAuthAction("/login")}
                  className="font-bold px-7 py-2.5 rounded-full border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300 active:scale-95"
                >
                  Login
                </button>
                <button
                  onClick={() => handleAuthAction("/signup")}
                  className="font-bold px-7 py-2.5 rounded-full border-2 border-[#105d9e] bg-[#105d9e] text-white hover:bg-white hover:text-[#105d9e] transition-all duration-300 shadow-md active:scale-95"
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
              <Menu
                size={28}
                className={scrolled ? "text-black" : "text-white"}
              />
            )}
          </button>
        </nav>

        {/* Search Bar */}
        <div
          className={`container mx-auto px-4 mt-2 transition-all duration-500 ${
            scrolled ? "scale-95 opacity-90 -mt-16" : "scale-100 opacity-100"
          }`}
        >
          <SearchBar scrolled={scrolled} />
        </div>

        {/* MOBILE MENU */}
        <div
          className={`fixed inset-0 w-full bg-white transition-all duration-500 lg:hidden z-[998] ${
            menuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
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
                    <p className="text-xs text-[#105d9e] font-bold uppercase">{user?.role}</p>
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
      <div className="h-[140px] md:h-[180px] lg:h-[220px]"></div>
    </>
  );
}