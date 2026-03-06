"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarItems } from "./sidebarItems";
import { HiMenu, HiX } from "react-icons/hi";
import logo from "@/assets/logo.svg";

const Sidebar = () => {
  // Set default role to avoid blank sidebar
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(
    Cookies.get("currentUserRole") || "GUEST",
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const role = Cookies.get("currentUserRole") || "GUEST";
    setCurrentUserRole(role);

    // Debug: check what's actually in the totalTrips cookie
    const rawCookie = Cookies.get("totalTrips");
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("mobile-sidebar");
      const menuButton = document.getElementById("mobile-menu-button");

      if (
        isMobileMenuOpen &&
        sidebar &&
        menuButton &&
        !sidebar.contains(event.target as Node) &&
        !menuButton.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActiveMenuItem = (href: string) => {
    // Exact match for dashboard home
    if (href === "/dashboard" && pathname === "/dashboard") return true;

    // For other routes, check if pathname starts with href (for nested routes)
    if (href !== "/dashboard" && pathname.startsWith(href)) return true;

    return false;
  };

  // **Skeleton loader if role is not yet set (optional)**
  if (!currentUserRole) {
    return (
      <div className="hidden lg:block lg:w-64 lg:h-screen lg:sticky lg:top-0 lg:left-0 lg:bg-blue-500 animate-pulse"></div>
    );
  }

  const sidebarItemsToShow = sidebarItems?.filter((item) => {
    if (!item?.roles?.includes(currentUserRole)) return false;
    // Hide Trip Calendar ONLY when totalTrips cookie is explicitly "0"
    if (currentUserRole === "CAPTAIN" && item.key === "Trip Calendar") {
      const raw = Cookies.get("totalTrips");
      console.log("🔍 Trip Calendar filter — cookie raw:", raw);
      // Only hide if cookie is explicitly the string "0"
      if (raw === "0") return false;
    }
    return true;
  });

  return (
    <>
      {/* Mobile Menu Button */}
      {!isMobileMenuOpen && (
        <button
          id="mobile-menu-button"
          className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-[#0037FF] text-white shadow-lg hover:bg-blue-600 transition-colors"
          onClick={toggleMobileMenu}
        >
          <HiMenu className="w-6 h-6" />
        </button>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block bg-slate-100 lg:w-64 h-screen lg:sticky lg:top-0 lg:left-0 lg:overflow-y-auto lg:flex-shrink-0">
        {/* Logo Section */}
        <div className="h-36 ">
          <Link href={"/"} className="h-24 w-full">
            <Image
              src={logo}
              alt="logo"
              height={200}
              width={200}
              className="h-28 w-full"
            />
          </Link>
        </div>

        {/* Navigation Menu */}
        <div className="bg-transparent text-white">
          {sidebarItemsToShow?.map((item) => {
            let href = "#";
            if (
              typeof item.label === "object" &&
              item.label !== null &&
              "props" in item.label &&
              typeof (item.label as any).props === "object" &&
              (item.label as any).props !== null &&
              "href" in (item.label as any).props
            ) {
              href = (item.label as any).props.href;
            }
            const isActive = isActiveMenuItem(href);

            return (
              <Link
                key={item.key}
                href={href}
                className={`
                  flex items-center px-6 py-3 mb-0.5 text-black transition-all duration-200
                  ${
                    isActive
                      ? "bg-[#035292] text-white font-medium"
                      : "hover:bg-[#035292] hover:text-white"
                  }
                `}
              >
                <span className="text-lg mr-3">{item.icon}</span>
                <span className="text-sm">{item.key}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300">
          <div
            id="mobile-sidebar"
            className={`fixed inset-y-0 left-0 w-64 transform transition-transform duration-300 ease-in-out overflow-y-auto shadow-xl ${
              isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            style={{ backgroundColor: "#0037FF" }}
          >
            {/* Mobile Header */}
            <div className="flex items-center justify-between h-16 px-4">
              <div className="w-[150px]">
                <Image
                  src={logo}
                  alt="logo"
                  width={300}
                  height={100}
                  className="w-32 h-auto"
                />
              </div>
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md text-white hover:bg-blue-600 transition-colors"
              >
                <HiX className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Navigation Menu */}
            <div className="bg-transparent text-white">
              {sidebarItemsToShow?.map((item) => {
                let href = "#";
                if (
                  typeof item.label === "object" &&
                  item.label !== null &&
                  "props" in item.label &&
                  typeof (item.label as any).props === "object" &&
                  (item.label as any).props !== null &&
                  "href" in (item.label as any).props
                ) {
                  href = (item.label as any).props.href;
                }
                const isActive = isActiveMenuItem(href);

                return (
                  <Link
                    key={item.key}
                    href={href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center px-6 py-3 text-white transition-all duration-200 border-l-4
                      ${
                        isActive
                          ? "bg-blue-600 border-white text-white font-medium"
                          : "border-transparent hover:bg-blue-600 hover:border-blue-300"
                      }
                    `}
                  >
                    <span className="text-lg mr-3">{item.icon}</span>
                    <span className="text-sm">{item.key}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
