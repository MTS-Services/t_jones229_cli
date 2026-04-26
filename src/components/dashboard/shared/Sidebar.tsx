"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarItems } from "./sidebarItems";
import { HiX } from "react-icons/hi";
import logo from "@/assets/logo.svg";
import { useGetMyBoatQuery } from "@/redux/api/boatApi";

interface SidebarProps {
  externalOpen?: boolean;
  onExternalClose?: () => void;
}

const Sidebar = ({ externalOpen, onExternalClose }: SidebarProps = {}) => {
  // Set default role to avoid blank sidebar
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(
    Cookies.get("currentUserRole") || "GUEST",
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isCaptain = currentUserRole === "CAPTAIN";
  const { data: boatsData } = useGetMyBoatQuery({}, { skip: !isCaptain });
  const hasBoats = (boatsData?.data?.length ?? 0) > 0;

  useEffect(() => {
    const role = Cookies.get("currentUserRole") || "GUEST";
    setCurrentUserRole(role);
  }, []);

  // Sync external open state → internal state
  useEffect(() => {
    if (externalOpen !== undefined) {
      setIsMobileMenuOpen(externalOpen);
    }
  }, [externalOpen]);

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

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    onExternalClose?.();
  };

  const toggleMobileMenu = () => {
    const next = !isMobileMenuOpen;
    setIsMobileMenuOpen(next);
    if (!next) onExternalClose?.();
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
    // Hide Trip Calendar when captain has no boats
    if (isCaptain && item.key === "Trip Calendar" && !hasBoats) {
      return false;
    }
    return true;
  });

  return (
    <>
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
              priority
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
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={closeMobileMenu}
          />

          {/* Sidebar */}
          <aside
            id="mobile-sidebar"
            className={`
        absolute inset-y-0 left-0 w-64 bg-gray-100 shadow-2xl
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}
          >
            {/* Header */}
            <div className="flex items-center justify-between h-16 px-4 border-b">
              <Image src={logo} alt="logo" className="w-16 h-auto" />

              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-md text-gray-700 hover:bg-gray-200 transition"
                aria-label="Close menu"
              >
                <HiX className="w-6 h-6" />
              </button>
            </div>

            {/* Menu */}
            <nav className="py-4">
              {sidebarItemsToShow?.map((item) => {
                let href = "#";

                if (
                  typeof item.label === "object" &&
                  item.label !== null &&
                  "props" in item.label &&
                  (item.label as any).props?.href
                ) {
                  href = (item.label as any).props.href;
                }

                const isActive = isActiveMenuItem(href);

                return (
                  <Link
                    key={item.key}
                    href={href}
                    onClick={closeMobileMenu}
                    className={`
                flex items-center px-6 py-3 text-sm transition-all duration-200 border-l-4
                ${
                  isActive
                    ? "bg-blue-600 border-blue-700 text-white font-medium"
                    : "text-gray-700 border-transparent hover:bg-blue-100 hover:border-blue-400"
                }
              `}
                  >
                    <span className="text-lg mr-3">{item.icon}</span>
                    <span>{item.key}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
