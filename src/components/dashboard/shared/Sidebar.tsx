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
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const role = Cookies.get("currentUserRole") || null;
    // const role = Cookies.get("currentUserRole") || null
    setCurrentUserRole(role);
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

  // Check if menu item is active
  const isActiveMenuItem = (href: string) => {
    return pathname === href;
  };

  // While loading or during SSR, render sidebar with only logo to keep markup consistent
  if (currentUserRole === null) {
    return (
      <>
        {/* Mobile Menu Button */}
        {/* <button
          id="mobile-menu-button"
          className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-[#0037FF] text-white shadow-lg"
          onClick={toggleMobileMenu}
        >
          <HiMenu className="w-6 h-6" />
        </button> */}

        {/* Desktop Sidebar - Exactly like Ant Design Sider */}
        {/* <div
          className="hidden lg:block lg:w-64 lg:h-screen lg:sticky lg:top-0 lg:left-0 lg:overflow-y-auto lg:flex-shrink-0"
          style={{ backgroundColor: "#0037FF" }}
        >
          <div className="text-white text-center h-16 flex items-center justify-center">
            <Image
              src="/placeholder.svg?height=100&width=300"
              alt="logo"
              width={300}
              height={100}
              className="w-[150px] mx-auto"
            />
          </div>
        </div> */}

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50">
            <div
              id="mobile-sidebar"
              className="fixed inset-y-0 left-0 w-64 transform transition-transform duration-300 ease-in-out overflow-y-auto"
              style={{ backgroundColor: "#0037FF" }}
            >
              <div className="flex items-center justify-between h-16 px-4">
                <div className="w-[150px]">
                  <Image
                    src="/placeholder.svg?height=100&width=300"
                    alt="logo"
                    width={300}
                    height={100}
                    className="w-full h-auto"
                  />
                </div>
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-md text-white hover:bg-blue-600 transition-colors"
                >
                  <HiX className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  if (!currentUserRole) {
    console.error("No user role found in cookies");
    return null;
  }

  const sidebarItemsToShow = sidebarItems?.filter((item) =>
    item?.roles?.includes(currentUserRole)
  );

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

      {/* Desktop Sidebar - Exactly like Ant Design Sider */}
      <div
        className="hidden lg:block lg:w-64 lg:h-screen lg:sticky lg:top-0 lg:left-0 lg:overflow-y-auto lg:flex-shrink-0"
        style={{ backgroundColor: "#0037FF" }}
      >
        {/* Logo Section - Matching your original style */}
        <div className="h-36 ">
          <Link href={"/"} className="h-24 w-full">
            <Image src={logo} alt="logo" height={200} width={200} className="h-32 w-full"/>
          </Link>
        </div>

        {/* Navigation Menu - Matching Ant Design Menu style */}
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
                  flex items-center px-6 py-3 text-white transition-all duration-200 border-l-4
                  ${
                    isActive
                      ? "bg-blue-600 border-[#FF9500] text-white font-medium"
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
