"use client";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.svg";
import { TbSailboat } from "react-icons/tb";

const MinimalSidebar = () => {
  return (
    <div
      className="hidden lg:block lg:w-64 h-screen lg:sticky lg:top-0 lg:left-0 lg:overflow-y-auto lg:flex-shrink-0"
      style={{ backgroundColor: "#f7f7f7" }}
    >
      {/* Logo Section */}
      <div className="h-36">
        <Link href="/" className="h-24 w-full">
          <Image
            src={logo}
            alt="logo"
            height={200}
            width={200}
            className="h-32 w-full"
          />
        </Link>
      </div>

      {/* Navigation Menu - Only Check Your Trip */}
      <div className="bg-transparent text-white">
        <Link
          href="/list-your-boat"
          className="flex items-center px-6 py-3 mb-0.5 text-black transition-all duration-200 bg-[#035292] text-white font-medium"
        >
          <span className="text-lg mr-3">
            <TbSailboat />
          </span>
          <span className="text-sm">Check Your Trip</span>
        </Link>
      </div>
    </div>
  );
};

export default MinimalSidebar;
